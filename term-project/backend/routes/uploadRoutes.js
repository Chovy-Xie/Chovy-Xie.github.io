const express = require('express');
const router = express.Router();

// JSON file upload stub
router.post('/json', (req, res) => {
    // Process JSON directly from request body instead of file upload
    const products = req.body;
    
    if (!Array.isArray(products) && !products.length) {
        return res.status(400).json({
            message: 'Invalid input: expected array of products',
            note: 'File upload is disabled, please send JSON directly in request body'
        });
    }
    
    res.json({
        message: 'JSON import simulation successful',
        note: 'File upload is disabled, using direct JSON data',
        count: Array.isArray(products) ? products.length : 0
    });
});

// Image upload stub
router.post('/image', (req, res) => {
    res.json({
        message: 'Image upload simulation successful',
        note: 'File upload is disabled, using placeholder image',
        image_url: '/images/placeholder.jpg'  // Placeholder image URL
    });
});

module.exports = router; 