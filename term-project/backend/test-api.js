const http = require('http');

// Configuration
const baseUrl = 'http://localhost:3000';
const endpoints = [
    // Read operations
    { url: '/api/products', method: 'GET', description: 'Get all products' },
    { url: '/api/products/featured', method: 'GET', description: 'Get featured products' },
    { url: '/api/products/search?q=tea', method: 'GET', description: 'Search products' },
    { url: '/api/products/category/1', method: 'GET', description: 'Get products by category' },
    { url: '/api/products/1', method: 'GET', description: 'Get product by ID' },
    { url: '/api/categories', method: 'GET', description: 'Get all categories' },
    { url: '/api/cart/101', method: 'GET', description: 'Get user cart' },
    
    // Write operations (with JSON payloads)
    { 
        url: '/api/products', 
        method: 'POST', 
        description: 'Create a new product',
        data: JSON.stringify({
            name: "Test Product",
            description: "A test product created by the test script",
            image_url: "/images/test-product.jpg",
            price: 9.99,
            category_id: 1,
            is_featured: 0,
            is_new: 1
        }),
        headers: { 'Content-Type': 'application/json' }
    },
    { 
        url: '/api/products/bulk', 
        method: 'POST', 
        description: 'Bulk upload products',
        data: JSON.stringify([
            {
                name: "Test Bulk Product 1",
                description: "A test product for bulk upload",
                image_url: "/images/test-bulk-1.jpg",
                price: 8.99,
                category_id: 1,
                is_featured: 0,
                is_new: 1
            },
            {
                name: "Test Bulk Product 2",
                description: "Another test product for bulk upload",
                image_url: "/images/test-bulk-2.jpg",
                price: 7.99,
                category_id: 2,
                is_featured: 0,
                is_new: 1
            }
        ]),
        headers: { 'Content-Type': 'application/json' }
    },
    { 
        url: '/api/cart/101/add', 
        method: 'POST', 
        description: 'Add item to cart',
        data: JSON.stringify({
            product_id: 1,
            quantity: 2
        }),
        headers: { 'Content-Type': 'application/json' }
    },
    { 
        url: '/api/upload/json', 
        method: 'POST', 
        description: 'Upload JSON data',
        data: JSON.stringify([
            {
                name: "Test JSON Upload",
                description: "A test product for JSON upload",
                image_url: "/images/test-json.jpg",
                price: 10.99,
                category_id: 3,
                is_featured: 0,
                is_new: 1
            }
        ]),
        headers: { 'Content-Type': 'application/json' }
    },
    { 
        url: '/api/upload/image', 
        method: 'POST', 
        description: 'Upload image (simulation)',
        data: '',
        headers: { 'Content-Type': 'application/json' }
    }
    // Note: We're not testing PUT or DELETE operations to avoid modifying actual data
    // You can add them here if needed with appropriate endpoints and data
];

// Function to make an HTTP request
function makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: endpoint.url,
            method: endpoint.method,
            headers: endpoint.headers || {}
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    // Try to parse JSON response
                    const jsonData = JSON.parse(data);
                    resolve({
                        endpoint,
                        statusCode: res.statusCode,
                        data: data,
                        jsonData: jsonData
                    });
                } catch (e) {
                    // If not JSON, return raw data
                    resolve({
                        endpoint,
                        statusCode: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (endpoint.data) {
            req.write(endpoint.data);
        }
        
        req.end();
    });
}

// Test all endpoints sequentially
async function testEndpoints() {
    console.log('Testing API endpoints...');
    console.log('==============================================');

    let newItemId = null;

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint.method} ${endpoint.url} - ${endpoint.description}`);
            const result = await makeRequest(endpoint);
            
            console.log(`Status code: ${result.statusCode}`);
            // Success status codes: 200 OK, 201 Created
            if (result.statusCode >= 200 && result.statusCode < 300) {
                console.log('Response data (truncated):', result.data.substring(0, 100) + '...');
                
                // Save the ID of the newly created product for later tests
                if (endpoint.method === 'POST' && endpoint.url === '/api/products' && result.jsonData && result.jsonData.id) {
                    newItemId = result.jsonData.id;
                    console.log(`Created new product with ID: ${newItemId}`);
                }
                
                console.log('PASSED ✅');
            } else {
                console.log('Response data:', result.data);
                console.log('FAILED ❌');
            }
        } catch (error) {
            console.error(`Error testing ${endpoint.method} ${endpoint.url}:`, error.message);
            console.log('FAILED ❌');
        }
        console.log('-----------------------------------');
    }

    console.log('==============================================');
    console.log('API testing complete!');
}

// Run the tests
testEndpoints(); 