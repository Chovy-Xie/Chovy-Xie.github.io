const db = require('../database');

// Get all categories
const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM categories ORDER BY display_order', [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    getAllCategories
}; 