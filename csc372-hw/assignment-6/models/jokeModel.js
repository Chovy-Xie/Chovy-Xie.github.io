const { db } = require('../database');

class JokeModel {
  // Get all categories
  static getAllCategories() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories', (err, categories) => {
        if (err) {
          return reject(err);
        }
        resolve(categories);
      });
    });
  }

  // Get jokes by category name
  static getJokesByCategory(categoryName, limit = null) {
    return new Promise((resolve, reject) => {
      // First check if category exists
      db.get('SELECT id FROM categories WHERE name = ?', [categoryName], (err, category) => {
        if (err) {
          return reject(err);
        }
        if (!category) {
          return reject(new Error('Category not found'));
        }
        
        // Prepare query with optional limit
        let query = `
          SELECT jokes.* 
          FROM jokes 
          WHERE jokes.category_id = ?
        `;
        
        const params = [category.id];
        
        if (limit) {
          query += ' LIMIT ?';
          params.push(limit);
        }
        
        // Get jokes
        db.all(query, params, (err, jokes) => {
          if (err) {
            return reject(err);
          }
          resolve(jokes);
        });
      });
    });
  }

  // Get a random joke
  static getRandomJoke() {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT jokes.*, categories.name as category
        FROM jokes
        JOIN categories ON jokes.category_id = categories.id
        ORDER BY RANDOM() 
        LIMIT 1
      `, (err, joke) => {
        if (err) {
          return reject(err);
        }
        if (!joke) {
          return reject(new Error('No jokes found'));
        }
        resolve(joke);
      });
    });
  }

  // Add a new joke
  static addJoke(category, setup, delivery) {
    return new Promise((resolve, reject) => {
      // First find category id
      db.get('SELECT id FROM categories WHERE name = ?', [category], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result) {
          return reject(new Error('Category not found'));
        }
        
        const categoryId = result.id;
        
        // Insert the joke
        db.run(
          'INSERT INTO jokes (setup, delivery, category_id) VALUES (?, ?, ?)',
          [setup, delivery, categoryId],
          function(err) {
            if (err) {
              return reject(err);
            }
            
            // Get updated jokes for this category
            JokeModel.getJokesByCategory(category)
              .then(jokes => resolve(jokes))
              .catch(err => reject(err));
          }
        );
      });
    });
  }
}

module.exports = JokeModel; 