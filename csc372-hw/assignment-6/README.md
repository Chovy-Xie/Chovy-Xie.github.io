# Jokebook API

A Node.js/Express API with front-end interface for CSC372 Assignment 6.

## Database Structure

The application uses SQLite with the following schema:

- **categories**: Stores joke categories
  - `id`: INTEGER PRIMARY KEY
  - `name`: TEXT NOT NULL UNIQUE

- **jokes**: Stores jokes
  - `id`: INTEGER PRIMARY KEY
  - `setup`: TEXT NOT NULL
  - `delivery`: TEXT NOT NULL
  - `category_id`: INTEGER (Foreign key to categories)

## API Endpoints

1. **GET /jokebook/categories**
   - Returns a list of all joke categories

2. **GET /jokebook/joke/:category**
   - Returns jokes from the specified category
   - Optional query parameter: `limit` to restrict number of jokes returned
   - Example: `/jokebook/joke/funnyJoke?limit=2`

3. **GET /jokebook/random**
   - Returns a random joke from any category

4. **POST /jokebook/joke/add**
   - Adds a new joke
   - Required body parameters:
     - `category`: The joke category
     - `setup`: The joke setup
     - `delivery`: The joke punchline

## Web Interface

The application includes a client-side web interface built with vanilla JavaScript and CSS:

- Landing page displays a random joke from the database
- Navigation menu to browse jokes by category
- Form to add new jokes to the database
- Responsive design that works on both desktop and mobile

## Architecture

This application follows the Model-View-Controller (MVC) pattern:

- **Model**: `models/jokeModel.js` - Database operations
- **View**: Client-side rendering with vanilla JavaScript
- **Controller**: `controllers/jokeController.js` - Request handling
- **Routes**: `routes/jokeRoutes.js` - API endpoint definitions

## Setup and Running

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

3. For development with auto-restart:
```
npm run dev
```

4. Access the web interface by visiting:
```
http://localhost:3000
```

## Testing with Thunder Client

You can test the API endpoints using Thunder Client:

1. GET request to `http://localhost:3000/jokebook/categories`
2. GET request to `http://localhost:3000/jokebook/joke/funnyJoke`
3. GET request to `http://localhost:3000/jokebook/joke/funnyJoke?limit=2`
4. GET request to `http://localhost:3000/jokebook/random`
5. POST request to `http://localhost:3000/jokebook/joke/add` with JSON body:
```json
{
  "category": "funnyJoke",
  "setup": "Why don't scientists trust atoms?",
  "delivery": "Because they make up everything!"
}
``` 