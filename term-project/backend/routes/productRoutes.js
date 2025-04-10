const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/', productController.getAllProducts);

// GET featured products
router.get('/featured', productController.getFeaturedProducts);

// SEARCH products
router.get('/search', productController.searchProducts);

// GET products by category
router.get('/category/:id', productController.getProductsByCategory);

// GET single product by ID
router.get('/:id', productController.getProductById);

// CREATE new product
router.post('/', productController.createProduct);

// UPDATE product
router.put('/:id', productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

// BULK UPLOAD products
router.post('/bulk', productController.bulkUploadProducts);

module.exports = router; 