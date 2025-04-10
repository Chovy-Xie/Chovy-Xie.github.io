document.addEventListener('DOMContentLoaded', function() {
    // Load products when the page loads
    loadProducts();
    
    // Set up search functionality
    setupSearch();
});

// Fetch products from the API
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showErrorMessage('Could not load products. Please try again later.');
    }
}

// Display products in the menu sections
function displayProducts(products) {
    // Group products by category
    const productsByCategory = {};
    
    products.forEach(product => {
        if (!productsByCategory[product.category_id]) {
            productsByCategory[product.category_id] = [];
        }
        productsByCategory[product.category_id].push(product);
    });
    
    // Get all menu sections
    const sections = document.querySelectorAll('.menu-section');
    
    // For each section, find its category and display appropriate products
    sections.forEach(section => {
        const categoryId = getCategoryIdFromSection(section.id);
        const productsGrid = section.querySelector('.menu-grid');
        
        if (categoryId && productsByCategory[categoryId]) {
            productsGrid.innerHTML = ''; // Clear placeholder content
            
            // Add products to the grid
            productsByCategory[categoryId].forEach(product => {
                productsGrid.appendChild(createProductElement(product));
            });
        }
    });
}

// Map section IDs to category IDs
function getCategoryIdFromSection(sectionId) {
    const mapping = {
        'new': 1,
        'milk-tea': 2,
        'hot-tea': 3,
        'ice-tea': 4,
        'coffee': 5,
        'lemonade': 6
    };
    
    return mapping[sectionId];
}

// Create product element
function createProductElement(product) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.dataset.productId = product.product_id;
    
    // Create slug from product name
    const slug = product.name.toLowerCase().replace(/\s+/g, '-');
    
    menuItem.innerHTML = `
        <div class="menu-image">
            <a href="details/${slug}.html" target="_blank" title="Product Details">
                <img src="${product.image_url}" alt="${product.name}">
            </a>
        </div>
        <h3>${product.name}</h3>
        <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
        <button class="add-to-cart-btn" data-product-id="${product.product_id}">
            Add to Cart
        </button>
    `;
    
    // Add event listener to the Add to Cart button
    const addToCartBtn = menuItem.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        addToCart(product.product_id);
    });
    
    return menuItem;
}

// Add product to cart
async function addToCart(productId) {
    // For demo purposes, using user_id 1
    // In a real app, you would get the user ID from login/authentication
    const userId = 1;
    
    try {
        const response = await fetch(`http://localhost:3000/api/cart/${userId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }
        
        // Show success message
        showMessage('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showMessage('Could not add to cart. Please try again.', true);
    }
}

// Set up search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll('.menu-item');
        
        items.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            
            if (name.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Show message to user
function showMessage(message, isError = false) {
    // Create message element if it doesn't exist
    let messageEl = document.getElementById('message-box');
    
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'message-box';
        document.body.appendChild(messageEl);
        
        // Style the message box
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.padding = '10px 20px';
        messageEl.style.borderRadius = '5px';
        messageEl.style.zIndex = '1000';
    }
    
    // Set message content and style
    messageEl.textContent = message;
    messageEl.style.backgroundColor = isError ? '#ffdddd' : '#ddffdd';
    messageEl.style.color = isError ? '#990000' : '#009900';
    messageEl.style.border = isError ? '1px solid #990000' : '1px solid #009900';
    
    // Show message
    messageEl.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    showMessage(message, true);
} 