const productModel = require('../models/productModel');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const products = await productModel.getProductsByCategory(req.params.id);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await productModel.getFeaturedProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await productModel.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        if (!searchTerm.trim()) {
            return res.status(400).json({ error: 'Search term is required' });
        }
        
        const products = await productModel.searchProducts(searchTerm);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, image_url, price, category_id, is_featured, is_new } = req.body;
        
        // Validation
        if (!name || !description || !image_url || !price || !category_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const result = await productModel.createProduct({
            name,
            description,
            image_url,
            price,
            category_id,
            is_featured: is_featured || 0,
            is_new: is_new || 0
        });
        
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { name, description, image_url, price, category_id, is_featured, is_new } = req.body;
        
        // Validation
        if (!name || !description || !image_url || !price || !category_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const result = await productModel.updateProduct(req.params.id, {
            name,
            description,
            image_url,
            price,
            category_id,
            is_featured: is_featured || 0,
            is_new: is_new || 0
        });
        
        if (result.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const result = await productModel.deleteProduct(req.params.id);
        
        if (result.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Bulk upload products
const bulkUploadProducts = async (req, res) => {
    try {
        const products = req.body;
        
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Invalid input: expected array of products' });
        }
        
        const result = await productModel.bulkUploadProducts(products);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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