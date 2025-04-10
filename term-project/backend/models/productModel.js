const db = require('../database');

// Get all products
const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

// Get products by category
const getProductsByCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products WHERE category_id = ?', [categoryId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

// Get featured products
const getFeaturedProducts = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products WHERE is_featured = 1', [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

// Get product by ID
const getProductById = (productId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE product_id = ?', [productId], (err, row) => {
            if (err) reject(err);
            resolve(row || null);
        });
    });
};

// Search products
const searchProducts = (searchTerm) => {
    return new Promise((resolve, reject) => {
        const searchPattern = `%${searchTerm}%`;
        db.all('SELECT * FROM products WHERE name LIKE ? OR description LIKE ?', 
               [searchPattern, searchPattern], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

// Create product
const createProduct = (productData) => {
    return new Promise((resolve, reject) => {
        const { name, description, image_url, price, category_id, is_featured, is_new } = productData;
        db.run(`INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, description, image_url, price, category_id, is_featured || 0, is_new || 0],
            function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, message: 'Product created successfully' });
            }
        );
    });
};

// Update product
const updateProduct = (productId, productData) => {
    return new Promise((resolve, reject) => {
        const { name, description, image_url, price, category_id, is_featured, is_new } = productData;
        db.run(`UPDATE products 
                SET name = ?, description = ?, image_url = ?, price = ?, 
                    category_id = ?, is_featured = ?, is_new = ?
                WHERE product_id = ?`,
            [name, description, image_url, price, category_id, is_featured || 0, is_new || 0, productId],
            function(err) {
                if (err) reject(err);
                if (this.changes === 0) resolve({ message: 'Product not found' });
                else resolve({ message: 'Product updated successfully' });
            }
        );
    });
};

// Delete product
const deleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM products WHERE product_id = ?', [productId], function(err) {
            if (err) reject(err);
            if (this.changes === 0) resolve({ message: 'Product not found' });
            else resolve({ message: 'Product deleted successfully' });
        });
    });
};

// Bulk upload products
const bulkUploadProducts = (products) => {
    return new Promise((resolve, reject) => {
        let successCount = 0;
        let failCount = 0;
        
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            const stmt = db.prepare(`
                INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            
            products.forEach(product => {
                const { name, description, image_url, price, category_id, is_featured, is_new } = product;
                
                // Basic validation
                if (!name || !description || !image_url || !price || !category_id) {
                    failCount++;
                    return; // Skip this product
                }
                
                stmt.run(
                    name, 
                    description, 
                    image_url, 
                    price, 
                    category_id, 
                    is_featured || 0, 
                    is_new || 0, 
                    function(err) {
                        if (err) {
                            failCount++;
                        } else {
                            successCount++;
                        }
                    }
                );
            });
            
            stmt.finalize();
            
            db.run('COMMIT', err => {
                if (err) {
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    resolve({
                        message: 'Bulk upload completed',
                        success_count: successCount,
                        fail_count: failCount
                    });
                }
            });
        });
    });
};

module.exports = {
    getAllProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUploadProducts
}; 