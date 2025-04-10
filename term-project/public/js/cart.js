document.addEventListener('DOMContentLoaded', function() {
    // For demo purposes, using user_id 1
    const userId = 1;
    
    // Load cart data
    loadCart(userId);
    
    // Set up checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        checkout();
    });
});

// Load cart from API
async function loadCart(userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            renderCartItems(data.items);
            updateCartSummary();
        } else {
            showEmptyCart();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        showEmptyCart('Error loading cart. Please try again later.');
    }
}

// Render cart items
function renderCartItems(items) {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items
    
    items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.cartProductId = item.cart_product_id;
        
        cartItem.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">$${parseFloat(item.price).toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn decrement">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn increment">+</button>
                </div>
                <p class="item-total">Total: $${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn">Remove</button>
            </div>
        `;
        
        // Add event listeners
        setupCartItemEvents(cartItem);
        
        cartItemsContainer.appendChild(cartItem);
    });
}

// Set up cart item event listeners
function setupCartItemEvents(cartItem) {
    const cartProductId = cartItem.dataset.cartProductId;
    const quantityInput = cartItem.querySelector('.quantity-input');
    
    // Decrement button
    cartItem.querySelector('.decrement').addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateCartItemQuantity(cartProductId, parseInt(quantityInput.value));
        }
    });
    
    // Increment button
    cartItem.querySelector('.increment').addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateCartItemQuantity(cartProductId, parseInt(quantityInput.value));
    });
    
    // Input change
    quantityInput.addEventListener('change', () => {
        // Ensure minimum value is 1
        if (parseInt(quantityInput.value) < 1) {
            quantityInput.value = 1;
        }
        updateCartItemQuantity(cartProductId, parseInt(quantityInput.value));
    });
    
    // Remove button
    cartItem.querySelector('.remove-btn').addEventListener('click', () => {
        removeCartItem(cartProductId);
    });
}

// Update cart item quantity
async function updateCartItemQuantity(cartProductId, quantity) {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/item/${cartProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update cart item');
        }
        
        // Update item total in UI
        const cartItem = document.querySelector(`[data-cart-product-id="${cartProductId}"]`);
        const price = parseFloat(cartItem.querySelector('.price').textContent.replace('$', ''));
        cartItem.querySelector('.item-total').textContent = `Total: $${(price * quantity).toFixed(2)}`;
        
        // Update cart summary
        updateCartSummary();
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
}

// Remove item from cart
async function removeCartItem(cartProductId) {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/item/${cartProductId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove cart item');
        }
        
        // Remove item from UI
        const cartItem = document.querySelector(`[data-cart-product-id="${cartProductId}"]`);
        cartItem.remove();
        
        // Check if cart is now empty
        const remainingItems = document.querySelectorAll('.cart-item');
        if (remainingItems.length === 0) {
            showEmptyCart();
        } else {
            updateCartSummary();
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

// Show empty cart message
function showEmptyCart(message = 'Your cart is empty') {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = `<p class="empty-cart-message">${message}</p>`;
    
    // Reset summary
    document.querySelector('.summary-line:nth-child(2) span:last-child').textContent = '$0.00';
    document.querySelector('.summary-line:nth-child(3) span:last-child').textContent = '$0.00';
    document.querySelector('.summary-line:nth-child(4) span:last-child').textContent = '$0.00';
    document.querySelector('.total span:last-child').textContent = '$0.00';
}

// Update cart summary
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        subtotal += price * quantity;
    });
    
    const tax = subtotal * 0.0675; // 6.75% tax rate
    const deliveryFee = subtotal > 0 ? 2.99 : 0;
    const total = subtotal + tax + deliveryFee;
    
    document.querySelector('.summary-line:nth-child(2) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.summary-line:nth-child(3) span:last-child').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.summary-line:nth-child(4) span:last-child').textContent = `$${deliveryFee.toFixed(2)}`;
    document.querySelector('.total span:last-child').textContent = `$${total.toFixed(2)}`;
}

// Checkout function (placeholder)
function checkout() {
    alert('Checkout functionality would be implemented here!');
    // In a real app, you would:
    // 1. Validate cart contents
    // 2. Process payment
    // 3. Update cart status to 'purchased'
    // 4. Redirect to order confirmation page
} 