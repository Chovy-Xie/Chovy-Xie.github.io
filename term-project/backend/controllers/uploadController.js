const fs = require('fs');
const path = require('path');
const productModel = require('../models/productModel');

// Upload JSON file for product import
const uploadJsonFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Read the uploaded JSON file
        fs.readFile(req.file.path, 'utf8', async (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Error reading uploaded file' });
            }
            
            let products;
            try {
                products = JSON.parse(data);
            } catch (err) {
                return res.status(400).json({ error: 'Invalid JSON format' });
            }
            
            if (!Array.isArray(products)) {
                products = [products]; // Convert to array if it's a single object
            }
            
            const result = await productModel.bulkUploadProducts(products);
            
            // Delete the temporary file
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temporary file:', err);
            });
            
            res.json(result);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Upload image for product
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Return the path to the uploaded file
        const imageUrl = `/uploads/${path.basename(req.file.path)}`;
        
        res.json({
            message: 'Image uploaded successfully',
            image_url: imageUrl
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    uploadJsonFile,
    uploadImage
}; 