const express = require('express');
const JokeController = require('../controllers/jokeController');

const router = express.Router();

// GET /jokebook/categories - Get all categories
router.get('/categories', JokeController.getCategories);

// GET /jokebook/joke/:category - Get jokes by category (with optional limit)
router.get('/joke/:category', JokeController.getJokesByCategory);

// GET /jokebook/random - Get a random joke
router.get('/random', JokeController.getRandomJoke);

// POST /jokebook/joke/add - Add a new joke
router.post('/joke/add', JokeController.addJoke);

module.exports = router; 