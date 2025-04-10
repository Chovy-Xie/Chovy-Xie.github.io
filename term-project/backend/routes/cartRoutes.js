const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET cart for user
router.get('/:user_id', cartController.getUserCart);

// ADD item to cart
router.post('/:user_id/add', cartController.addToCart);

// UPDATE cart item quantity
router.put('/item/:cart_product_id', cartController.updateCartItem);

// REMOVE item from cart
router.delete('/item/:cart_product_id', cartController.removeFromCart);

// CHECKOUT (empty cart)
router.post('/:user_id/checkout', cartController.checkout);

module.exports = router; 