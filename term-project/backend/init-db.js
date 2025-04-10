const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../database/itea.db');

// SQL file paths
const createTablesPath = path.join(__dirname, '../database/schema/create_tables.sql');
const insertCategoriesPath = path.join(__dirname, '../database/seed-data/insert_categories.sql');
const insertProductsPath = path.join(__dirname, '../database/seed-data/insert_products.sql');

// Connect to database (will create it if it doesn't exist)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database');
    
    // Read SQL files
    const createTablesSQL = fs.readFileSync(createTablesPath, 'utf8');
    const insertCategoriesSQL = fs.readFileSync(insertCategoriesPath, 'utf8');
    const insertProductsSQL = fs.readFileSync(insertProductsPath, 'utf8');
    
    // Execute SQL in sequence
    db.serialize(() => {
        // Create tables
        db.exec(createTablesSQL, (err) => {
            if (err) {
                console.error('Error creating tables:', err.message);
                return;
            }
            console.log('Tables created successfully');
            
            // Insert categories
            db.exec(insertCategoriesSQL, (err) => {
                if (err) {
                    console.error('Error inserting categories:', err.message);
                    return;
                }
                console.log('Categories inserted successfully');
                
                // Insert products
                db.exec(insertProductsSQL, (err) => {
                    if (err) {
                        console.error('Error inserting products:', err.message);
                        return;
                    }
                    console.log('Products inserted successfully');
                    console.log('Database initialization complete!');
                    
                    // Close the database connection
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database connection closed');
                        }
                    });
                });
            });
        });
    });
}); 