const JokeModel = require('../models/jokeModel');

// Controller for handling joke-related requests
class JokeController {
  // Get all categories
  static async getCategories(req, res) {
    try {
      const categories = await JokeModel.getAllCategories();
      res.json(categories.map(category => category.name));
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  // Get jokes by category
  static async getJokesByCategory(req, res) {
    try {
      const { category } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : null;
      
      // Validate limit if provided
      if (limit !== null && (isNaN(limit) || limit <= 0)) {
        return res.status(400).json({ error: 'Limit must be a positive number' });
      }
      
      const jokes = await JokeModel.getJokesByCategory(category, limit);
      res.json(jokes);
    } catch (error) {
      console.error('Error getting jokes by category:', error);
      
      // Handle specific error for category not found
      if (error.message === 'Category not found') {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.status(500).json({ error: 'Failed to fetch jokes' });
    }
  }

  // Get a random joke
  static async getRandomJoke(req, res) {
    try {
      const joke = await JokeModel.getRandomJoke();
      res.json(joke);
    } catch (error) {
      console.error('Error getting random joke:', error);
      res.status(500).json({ error: 'Failed to fetch random joke' });
    }
  }

  // Add a new joke
  static async addJoke(req, res) {
    try {
      const { category, setup, delivery } = req.body;
      
      // Validate required parameters
      if (!category || !setup || !delivery) {
        return res.status(400).json({ 
          error: 'Missing required parameters',
          required: ['category', 'setup', 'delivery'],
          received: { category, setup, delivery }
        });
      }
      
      const updatedJokes = await JokeModel.addJoke(category, setup, delivery);
      res.status(201).json(updatedJokes);
    } catch (error) {
      console.error('Error adding joke:', error);
      
      // Handle specific error for category not found
      if (error.message === 'Category not found') {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.status(500).json({ error: 'Failed to add joke' });
    }
  }
}

module.exports = JokeController; 