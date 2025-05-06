/**
 * Order History JavaScript
 * Handles displaying, filtering, and interacting with user's order history
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    if (!isLoggedIn()) {
        showAuthRequired();
        return;
    }
    
    // Initialize order history page
    initOrderHistory();
});

/**
 * Shows authentication required message and hides order content
 */
function showAuthRequired() {
    const authRequired = document.getElementById('auth-required');
    const orderContent = document.getElementById('order-history-content');
    
    if (authRequired) authRequired.style.display = 'block';
    if (orderContent) orderContent.style.display = 'none';
}

/**
 * Initialize order history content for logged in users
 */
function initOrderHistory() {
    const authRequired = document.getElementById('auth-required');
    const orderContent = document.getElementById('order-history-content');
    
    if (authRequired) authRequired.style.display = 'none';
    if (orderContent) orderContent.style.display = 'block';
    
    // Load orders data
    loadOrders();
    
    // Initialize filter handlers
    initFilters();
    
    // Initialize pagination
    initPagination();
    
    // Initialize modal
    initModal();
}

/**
 * Initialize filter event handlers
 */
function initFilters() {
    const dateFilter = document.getElementById('date-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-orders');
    const searchBtn = document.getElementById('search-btn');
    
    // Date filter change
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            filterOrders();
        });
    }
    
    // Status filter change
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterOrders();
        });
    }
    
    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            filterOrders();
        });
    }
    
    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterOrders();
            }
        });
    }
}

/**
 * Initialize pagination controls
 */
function initPagination() {
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderOrders();
                updatePaginationControls();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderOrders();
                updatePaginationControls();
            }
        });
    }
}

/**
 * Initialize modal functionality
 */
function initModal() {
    const modal = document.getElementById('order-details-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Modal action buttons
    const reorderBtn = document.getElementById('modal-reorder-btn');
    const supportBtn = document.getElementById('modal-support-btn');
    
    if (reorderBtn) {
        reorderBtn.addEventListener('click', function() {
            const orderId = reorderBtn.getAttribute('data-order-id');
            handleReorder(orderId);
        });
    }
    
    if (supportBtn) {
        supportBtn.addEventListener('click', function() {
            const orderId = supportBtn.getAttribute('data-order-id');
            window.location.href = `/html/contact.html?subject=Order ${orderId} Support`;
        });
    }
}

// Global variables for order data and pagination
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
let totalPages = 1;
const ordersPerPage = 5;

/**
 * Load orders from API or mock data
 */
async function loadOrders() {
    try {
        // In a real app, we would fetch orders from an API
        // const user = getCurrentUser();
        // const response = await fetch(`/api/orders/user/${user.id}`, {
        //     headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     }
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to load orders');
        // }
        // 
        // const data = await response.json();
        // allOrders = data.orders;
        
        // For demo purposes, generate mock order data
        allOrders = generateMockOrders();
        
        // Initialize filtered orders to all orders
        filteredOrders = [...allOrders];
        
        // Calculate total pages
        totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        
        // Render orders
        renderOrders();
        
        // Update pagination controls
        updatePaginationControls();
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showError('Failed to load your order history. Please try again later.');
    }
}

/**
 * Generate mock order data for demonstration
 * @returns {Array} Array of mock orders
 */
function generateMockOrders() {
    const mockOrders = [];
    
    // Order statuses for random selection
    const statuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    
    // Product data for order items
    const products = [
        { id: 1, name: 'Bubble Tea', price: 5.99, image: '/images/bubble-tea.webp' },
        { id: 2, name: 'Green Tea', price: 4.49, image: '/images/green-tea.webp' },
        { id: 3, name: 'Matcha', price: 5.49, image: '/images/matcha.webp' },
        { id: 4, name: 'Iced Green Tea', price: 3.99, image: '/images/iced-green-tea.webp' }
    ];
    
    // Generate random orders
    for (let i = 1; i <= 12; i++) {
        // Random date within the last year
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 365));
        
        // Random status
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Random items (1-4 items per order)
        const items = [];
        const numItems = Math.floor(Math.random() * 4) + 1;
        
        let subtotal = 0;
        
        for (let j = 0; j < numItems; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const itemTotal = product.price * quantity;
            
            items.push({
                id: `item-${i}-${j}`,
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                price: product.price,
                image: product.image,
                total: itemTotal
            });
            
            subtotal += itemTotal;
        }
        
        // Calculate tax and total
        const tax = subtotal * 0.0675;
        const shipping = status === 'cancelled' ? 0 : 2.99;
        const total = subtotal + tax + shipping;
        
        // Create order object
        const order = {
            id: 10000 + i,
            date: orderDate,
            status: status,
            items: items,
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total,
            shippingAddress: {
                name: 'John Doe',
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62704',
                country: 'United States'
            },
            paymentMethod: {
                type: 'Credit Card',
                last4: '1234'
            }
        };
        
        mockOrders.push(order);
    }
    
    // Sort by date (newest first)
    return mockOrders.sort((a, b) => b.date - a.date);
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

/**
 * Render orders to the page
 */
function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');
    
    if (!ordersList) return;
    
    // Clear the current list
    ordersList.innerHTML = '';
    
    // Check if there are any orders to display
    if (filteredOrders.length === 0) {
        if (noOrders) noOrders.style.display = 'block';
        return;
    }
    
    // Hide no orders message
    if (noOrders) noOrders.style.display = 'none';
    
    // Calculate pagination slice
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const ordersToDisplay = filteredOrders.slice(startIndex, endIndex);
    
    // Get order template
    const orderTemplate = document.getElementById('order-template');
    const productTemplate = document.getElementById('product-template');
    
    if (!orderTemplate || !productTemplate) return;
    
    // Render each order
    ordersToDisplay.forEach(order => {
        // Clone the template
        const orderElement = orderTemplate.content.cloneNode(true);
        
        // Set order id and date
        orderElement.querySelector('.order-id').textContent = `Order #${order.id}`;
        orderElement.querySelector('.order-date').textContent = formatDate(order.date);
        
        // Set order status
        const statusElement = orderElement.querySelector('.order-status');
        statusElement.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        statusElement.className = `order-status ${order.status}`;
        
        // Add order items/products
        const productsContainer = orderElement.querySelector('.order-products');
        
        // Limit to first 3 items for display
        const displayItems = order.items.slice(0, 3);
        
        displayItems.forEach(item => {
            const productElement = productTemplate.content.cloneNode(true);
            
            productElement.querySelector('.product-name').textContent = item.productName;
            productElement.querySelector('.product-price').textContent = formatCurrency(item.price);
            productElement.querySelector('.product-quantity').textContent = `x ${item.quantity}`;
            
            const productImage = productElement.querySelector('.product-image');
            productImage.src = item.image;
            productImage.alt = item.productName;
            
            productsContainer.appendChild(productElement);
        });
        
        // Add "+X more" if there are more items than displayed
        if (order.items.length > 3) {
            const moreItemsElement = document.createElement('div');
            moreItemsElement.className = 'more-items';
            moreItemsElement.textContent = `+${order.items.length - 3} more items`;
            productsContainer.appendChild(moreItemsElement);
        }
        
        // Set order total
        orderElement.querySelector('.total-amount').textContent = formatCurrency(order.total);
        
        // Add event listeners to buttons
        const viewDetailsBtn = orderElement.querySelector('.btn-view-details');
        const reorderBtn = orderElement.querySelector('.btn-reorder');
        
        viewDetailsBtn.addEventListener('click', () => openOrderDetails(order.id));
        reorderBtn.addEventListener('click', () => handleReorder(order.id));
        
        // Add to page
        ordersList.appendChild(orderElement);
    });
}

/**
 * Open order details in a modal
 * @param {string} orderId - ID of the order to display
 */
function openOrderDetails(orderId) {
    // Find the order
    const order = allOrders.find(o => o.id == orderId);
    
    if (!order) return;
    
    // Update modal content
    const modal = document.getElementById('order-details-modal');
    const modalOrderId = document.getElementById('modal-order-id');
    const modalOrderDate = document.getElementById('modal-order-date');
    const modalOrderStatus = document.getElementById('modal-order-status');
    const modalOrderItems = document.getElementById('modal-order-items');
    const modalShippingAddress = document.getElementById('modal-shipping-address');
    const modalPaymentMethod = document.getElementById('modal-payment-method');
    const modalSubtotal = document.getElementById('modal-subtotal');
    const modalTax = document.getElementById('modal-tax');
    const modalShipping = document.getElementById('modal-shipping');
    const modalTotal = document.getElementById('modal-total');
    const modalReorderBtn = document.getElementById('modal-reorder-btn');
    const modalSupportBtn = document.getElementById('modal-support-btn');
    
    if (modalOrderId) modalOrderId.textContent = `Order #${order.id}`;
    if (modalOrderDate) modalOrderDate.textContent = formatDate(order.date);
    
    // Set status with appropriate class
    if (modalOrderStatus) {
        modalOrderStatus.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        modalOrderStatus.className = `order-status ${order.status}`;
    }
    
    // Populate items
    if (modalOrderItems) {
        modalOrderItems.innerHTML = '';
        
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'modal-order-item';
            
            itemElement.innerHTML = `
                <div class="modal-item-image">
                    <img src="${item.image}" alt="${item.productName}">
                </div>
                <div class="modal-item-details">
                    <h5>${item.productName}</h5>
                    <div class="modal-item-meta">
                        <span>${formatCurrency(item.price)} × ${item.quantity}</span>
                        <span class="modal-item-total">${formatCurrency(item.total)}</span>
                    </div>
                </div>
            `;
            
            modalOrderItems.appendChild(itemElement);
        });
    }
    
    // Set shipping address
    if (modalShippingAddress) {
        modalShippingAddress.innerHTML = `
            ${order.shippingAddress.name}<br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}
        `;
    }
    
    // Set payment method
    if (modalPaymentMethod) {
        modalPaymentMethod.innerHTML = `
            <i class="far fa-credit-card"></i> ${order.paymentMethod.type} ending in ${order.paymentMethod.last4}
        `;
    }
    
    // Set order summary values
    if (modalSubtotal) modalSubtotal.textContent = formatCurrency(order.subtotal);
    if (modalTax) modalTax.textContent = formatCurrency(order.tax);
    if (modalShipping) modalShipping.textContent = formatCurrency(order.shipping);
    if (modalTotal) modalTotal.textContent = formatCurrency(order.total);
    
    // Set order ID for action buttons
    if (modalReorderBtn) modalReorderBtn.setAttribute('data-order-id', order.id);
    if (modalSupportBtn) modalSupportBtn.setAttribute('data-order-id', order.id);
    
    // Display the modal
    if (modal) modal.style.display = 'block';
}

/**
 * Update pagination controls based on current state
 */
function updatePaginationControls() {
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    }
}

/**
 * Handle reorder action
 * @param {string} orderId - ID of the order to reorder
 */
function handleReorder(orderId) {
    // Find the order
    const order = allOrders.find(o => o.id == orderId);
    
    if (!order) return;
    
    // In a real app, we would call an API to add all items to the cart
    // For demo, show an alert
    alert(`Items from Order #${orderId} have been added to your cart!`);
    
    // Redirect to cart page
    window.location.href = '/html/cart.html';
}

/**
 * Filter orders based on user selections
 */
function filterOrders() {
    const dateFilter = document.getElementById('date-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-orders');
    
    // Get filter values
    const dateValue = dateFilter ? dateFilter.value : 'all';
    const statusValue = statusFilter ? statusFilter.value : 'all';
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter orders
    filteredOrders = allOrders.filter(order => {
        // Date filter
        if (dateValue !== 'all') {
            const daysAgo = parseInt(dateValue);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
            
            if (new Date(order.date) < cutoffDate) {
                return false;
            }
        }
        
        // Status filter
        if (statusValue !== 'all' && order.status !== statusValue) {
            return false;
        }
        
        // Search filter
        if (searchValue) {
            const orderIdMatch = order.id.toString().includes(searchValue);
            const dateMatch = formatDate(order.date).toLowerCase().includes(searchValue);
            const statusMatch = order.status.toLowerCase().includes(searchValue);
            
            // Check if any item names match
            const itemMatch = order.items.some(item => 
                item.productName.toLowerCase().includes(searchValue)
            );
            
            if (!(orderIdMatch || dateMatch || statusMatch || itemMatch)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Update total pages
    totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    
    // Render filtered orders
    renderOrders();
    
    // Update pagination
    updatePaginationControls();
}

/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'orders-error';
    errorElement.textContent = message;
    
    // Insert after the heading
    const container = document.querySelector('.order-history-container');
    const heading = document.querySelector('.order-history-container h1');
    
    if (container && heading) {
        container.insertBefore(errorElement, heading.nextSibling);
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, 5000);
}

/**
 * Check if user is logged in
 * @returns {boolean} Whether user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

/**
 * Get the current user
 * @returns {Object|null} User object or null if not logged in
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

// Add error styling to the CSS
const style = document.createElement('style');
style.textContent = `
.orders-error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #f5c6cb;
    border-radius: 0.25rem;
}

.modal-order-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.modal-order-item:last-child {
    border-bottom: none;
}

.modal-item-image img {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: cover;
}

.modal-item-details h5 {
    margin: 0 0 0.25rem;
}

.modal-item-meta {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 0.9rem;
}

.modal-item-total {
    font-weight: 500;
}

.more-items {
    color: #666;
    font-style: italic;
    padding: 0.5rem 0;
}
`;
document.head.appendChild(style); 