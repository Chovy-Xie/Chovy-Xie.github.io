const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to database
const db = new sqlite3.Database(path.join(__dirname, 'jokebook.db'));

// Initialize database
const initializeDB = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tables if they don't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        )
      `);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS jokes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          setup TEXT NOT NULL,
          delivery TEXT NOT NULL,
          category_id INTEGER,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `);
      
      // Check if data already exists
      db.get('SELECT COUNT(*) as count FROM categories', (err, result) => {
        if (err) {
          return reject(err);
        }
        
        // Only populate if empty
        if (result.count === 0) {
          // Insert categories
          const categoriesStmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
          ['funnyJoke', 'lameJoke'].forEach(category => {
            categoriesStmt.run(category);
          });
          categoriesStmt.finalize();
          
          // Insert jokes
          const jokesStmt = db.prepare('INSERT INTO jokes (setup, delivery, category_id) VALUES (?, ?, ?)');
          
          // Funny jokes
          [
            {
              'setup': 'Why did the student eat his homework?',
              'delivery': 'Because the teacher told him it was a piece of cake!'
            },
            {
              'setup': 'What kind of tree fits in your hands',
              'delivery': 'A palm tree'
            },
            {
              'setup': 'What is worse than raining cats and dogs?',
              'delivery': 'Hailing taxis'
            }
          ].forEach(joke => {
            jokesStmt.run(joke.setup, joke.delivery, 1);
          });
          
          // Lame jokes
          [
            {
              'setup': 'Which bear is the most condescending?',
              'delivery': 'Pan-DUH'
            },
            {
              'setup': 'What would the Terminator be called in his retirement?',
              'delivery': 'The Exterminator'
            }
          ].forEach(joke => {
            jokesStmt.run(joke.setup, joke.delivery, 2);
          });
          
          jokesStmt.finalize();
        }
        
        resolve('Database initialized');
      });
    });
  });
};

module.exports = { db, initializeDB }; 