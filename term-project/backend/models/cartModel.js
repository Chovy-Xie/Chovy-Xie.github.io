const db = require('../database');

// Get cart for user
const getUserCart = (userId) => {
    return new Promise((resolve, reject) => {
        // First find the user's active cart
        db.get(
            'SELECT cart_id FROM carts WHERE user_id = ? AND status = "active" LIMIT 1',
            [userId],
            (err, cart) => {
                if (err) {
                    return reject(err);
                }
                
                if (!cart) {
                    return resolve({ items: [] }); // No active cart
                }
                
                // Get cart items with product details
                const sql = `
                    SELECT 
                        cp.cart_product_id, 
                        cp.quantity, 
                        p.product_id, 
                        p.name, 
                        p.price, 
                        p.image_url
                    FROM cart_products cp
                    JOIN products p ON cp.product_id = p.product_id
                    WHERE cp.cart_id = ?
                `;
                
                db.all(sql, [cart.cart_id], (err, items) => {
                    if (err) {
                        return reject(err);
                    }
                    
                    resolve({ 
                        cart_id: cart.cart_id,
                        items: items
                    });
                });
            }
        );
    });
};

// Add item to cart
const addToCart = (userId, productId, quantity) => {
    return new Promise((resolve, reject) => {
        // Transaction to ensure data integrity
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Check if user has an active cart
            db.get(
                'SELECT cart_id FROM carts WHERE user_id = ? AND status = "active" LIMIT 1',
                [userId],
                (err, cart) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }
                    
                    let cartId;
                    
                    // Create cart if it doesn't exist
                    if (!cart) {
                        db.run(
                            'INSERT INTO carts (user_id, status) VALUES (?, "active")',
                            [userId],
                            function(err) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return reject(err);
                                }
                                
                                cartId = this.lastID;
                                addOrUpdateCartItem(cartId);
                            }
                        );
                    } else {
                        cartId = cart.cart_id;
                        addOrUpdateCartItem(cartId);
                    }
                    
                    // Add or update cart item
                    function addOrUpdateCartItem(cartId) {
                        // Check if product is already in cart
                        db.get(
                            'SELECT cart_product_id, quantity FROM cart_products WHERE cart_id = ? AND product_id = ?',
                            [cartId, productId],
                            (err, item) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return reject(err);
                                }
                                
                                if (item) {
                                    // Update quantity if product already in cart
                                    db.run(
                                        'UPDATE cart_products SET quantity = quantity + ? WHERE cart_product_id = ?',
                                        [quantity, item.cart_product_id],
                                        (err) => {
                                            if (err) {
                                                db.run('ROLLBACK');
                                                return reject(err);
                                            }
                                            
                                            db.run('COMMIT');
                                            resolve({ message: 'Cart updated successfully' });
                                        }
                                    );
                                } else {
                                    // Add new product to cart
                                    db.run(
                                        'INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                                        [cartId, productId, quantity],
                                        (err) => {
                                            if (err) {
                                                db.run('ROLLBACK');
                                                return reject(err);
                                            }
                                            
                                            db.run('COMMIT');
                                            resolve({ message: 'Product added to cart successfully' });
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        });
    });
};

// Update cart item quantity
const updateCartItem = (cartProductId, quantity) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE cart_products SET quantity = ? WHERE cart_product_id = ?',
            [quantity, cartProductId],
            function(err) {
                if (err) {
                    return reject(err);
                }
                
                if (this.changes === 0) {
                    return resolve({ message: 'Cart item not found' });
                }
                
                resolve({ message: 'Cart item updated successfully' });
            }
        );
    });
};

// Remove item from cart
const removeFromCart = (cartProductId) => {
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM cart_products WHERE cart_product_id = ?',
            [cartProductId],
            function(err) {
                if (err) {
                    return reject(err);
                }
                
                if (this.changes === 0) {
                    return resolve({ message: 'Cart item not found' });
                }
                
                resolve({ message: 'Item removed from cart successfully' });
            }
        );
    });
};

// Checkout (empty cart)
const checkout = (userId) => {
    return new Promise((resolve, reject) => {
        // First find the user's active cart
        db.get(
            'SELECT cart_id FROM carts WHERE user_id = ? AND status = "active" LIMIT 1',
            [userId],
            (err, cart) => {
                if (err) {
                    return reject(err);
                }
                
                if (!cart) {
                    return resolve({ error: 'No active cart found' });
                }
                
                // Update cart status to 'completed'
                db.run(
                    'UPDATE carts SET status = "completed" WHERE cart_id = ?',
                    [cart.cart_id],
                    function(err) {
                        if (err) {
                            return reject(err);
                        }
                        
                        if (this.changes === 0) {
                            return resolve({ error: 'Failed to checkout cart' });
                        }
                        
                        resolve({ 
                            message: 'Checkout successful',
                            order_id: cart.cart_id
                        });
                    }
                );
            }
        );
    });
};

module.exports = {
    getUserCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout
}; 