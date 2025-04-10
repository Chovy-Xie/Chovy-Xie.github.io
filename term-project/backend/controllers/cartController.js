const cartModel = require('../models/cartModel');

// Get cart for user
const getUserCart = async (req, res) => {
    try {
        const cart = await cartModel.getUserCart(req.params.user_id);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.params.user_id;
        
        // Validation
        if (!product_id || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });
        }
        
        const result = await cartModel.addToCart(user_id, product_id, quantity);
        
        if (result.message === 'Product added to cart successfully') {
            res.status(201).json(result);
        } else {
            res.json(result);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }
        
        const result = await cartModel.updateCartItem(req.params.cart_product_id, quantity);
        
        if (result.message === 'Cart item not found') {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const result = await cartModel.removeFromCart(req.params.cart_product_id);
        
        if (result.message === 'Cart item not found') {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Checkout (empty cart)
const checkout = async (req, res) => {
    try {
        const result = await cartModel.checkout(req.params.user_id);
        
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUserCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout
}; 