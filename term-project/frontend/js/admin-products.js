document.addEventListener('DOMContentLoaded', function() {
    // Load all products
    loadProducts();
    
    // Load categories for filters and form
    loadCategories();
    
    // Set up event listeners
    document.getElementById('add-product-btn').addEventListener('click', () => openModal());
    document.querySelector('#product-modal .close').addEventListener('click', closeModal);
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);
});

// Load all products
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error loading products: ' + error.message, 'error');
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const categories = await response.json();
        
        // Populate category filter dropdown
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        // Populate category select in form
        const categorySelect = document.getElementById('product-category');
        categorySelect.innerHTML = '';
        
        categories.forEach(category => {
            // Add to filter
            const filterOption = document.createElement('option');
            filterOption.value = category.category_id;
            filterOption.textContent = category.name;
            categoryFilter.appendChild(filterOption);
            
            // Add to form select
            const selectOption = document.createElement('option');
            selectOption.value = category.category_id;
            selectOption.textContent = category.name;
            categorySelect.appendChild(selectOption);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showAlert('Error loading categories: ' + error.message, 'error');
    }
}

// Display products in table
function displayProducts(products) {
    const tableBody = document.getElementById('products-list');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.product_id}</td>
            <td><img src="${product.image_url}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
            <td>${product.name}</td>
            <td>${truncateText(product.description, 50)}</td>
            <td class="category-name" data-category-id="${product.category_id}">
                ${getCategoryName(product.category_id)}
            </td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${product.product_id}">Edit</button>
                <button class="delete-btn" data-id="${product.product_id}">Delete</button>
            </td>
        `;
        
        // Add event listeners to buttons
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editProduct(product.product_id);
        });
        
        row.querySelector('.delete-btn').addEventListener('click', () => {
            deleteProduct(product.product_id);
        });
        
        tableBody.appendChild(row);
    });
}

// Get category name from ID (placeholder function)
function getCategoryName(categoryId) {
    // This will be updated when categories are loaded
    return 'Loading...';
}

// Filter products based on search and category
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryId = document.getElementById('category-filter').value;
    const rows = document.querySelectorAll('#products-list tr');
    
    rows.forEach(row => {
        const name = row.cells[2].textContent.toLowerCase();
        const description = row.cells[3].textContent.toLowerCase();
        const rowCategoryId = row.cells[4].dataset.categoryId;
        
        const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = !categoryId || rowCategoryId === categoryId;
        
        row.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
    });
}

// Open modal for add/edit
function openModal(product = null) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    // Reset form
    form.reset();
    
    if (product) {
        // Edit mode
        modalTitle.textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-category').value = product.category_id;
        document.getElementById('product-image').value = product.image_url;
        document.getElementById('product-price').value = product.price;
        
        // Store product ID for later use
        form.dataset.productId = product.product_id;
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Product';
        delete form.dataset.productId;
    }
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Save product (create or update)
async function saveProduct(event) {
    event.preventDefault();
    
    const form = document.getElementById('product-form');
    const isEditing = form.dataset.productId !== undefined;
    
    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        category_id: document.getElementById('product-category').value,
        image_url: document.getElementById('product-image').value,
        price: parseFloat(document.getElementById('product-price').value),
        is_featured: 0, // Default
        is_new: 0       // Default
    };
    
    try {
        const url = isEditing 
            ? `http://localhost:3000/api/products/${form.dataset.productId}`
            : 'http://localhost:3000/api/products';
            
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save product');
        }
        
        // Close modal and reload products
        closeModal();
        loadProducts();
        
        showAlert(
            isEditing ? 'Product updated successfully!' : 'Product added successfully!',
            'success'
        );
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Error: ' + error.message, 'error');
    }
}

// Edit product
async function editProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const product = await response.json();
        openModal(product);
    } catch (error) {
        console.error('Error loading product for edit:', error);
        showAlert('Error: ' + error.message, 'error');
    }
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete product');
        }
        
        // Reload products
        loadProducts();
        showAlert('Product deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Error: ' + error.message, 'error');
    }
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Show alert message
function showAlert(message, type) {
    // Create alert element if it doesn't exist
    let alertEl = document.getElementById('alert-message');
    
    if (!alertEl) {
        alertEl = document.createElement('div');
        alertEl.id = 'alert-message';
        document.body.appendChild(alertEl);
        
        // Style the alert
        alertEl.style.position = 'fixed';
        alertEl.style.top = '20px';
        alertEl.style.right = '20px';
        alertEl.style.padding = '10px 20px';
        alertEl.style.borderRadius = '5px';
        alertEl.style.zIndex = '1000';
    }
    
    // Set message and style based on type
    alertEl.textContent = message;
    
    if (type === 'error') {
        alertEl.style.backgroundColor = '#ffdddd';
        alertEl.style.color = '#990000';
        alertEl.style.border = '1px solid #990000';
    } else {
        alertEl.style.backgroundColor = '#ddffdd';
        alertEl.style.color = '#009900';
        alertEl.style.border = '1px solid #009900';
    }
    
    // Show alert
    alertEl.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 3000);
} 