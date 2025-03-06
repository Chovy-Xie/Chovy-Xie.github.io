function updateItemTotal(index) {
    const cartItems = document.querySelectorAll('.cart-item');
    const item = cartItems[index];
    const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
    const quantity = parseInt(item.querySelector('.quantity-input').value);
    const totalElement = item.querySelector('.item-total');
    
    const total = (price * quantity).toFixed(2);
    totalElement.textContent = `Total: $${total}`;
    
    updateCartSummary();
}

function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        subtotal += price * quantity;
    });
    
    const tax = subtotal * 0.0675; // 6.75% tax
    const deliveryFee = 2.99;
    const total = subtotal + tax + deliveryFee;
    
    // Update summary display
    document.querySelector('.summary-line:nth-child(2) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.summary-line:nth-child(3) span:last-child').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total span:last-child').textContent = `$${total.toFixed(2)}`;
}

function incrementQuantity(index) {
    const input = document.querySelectorAll('.quantity-input')[index];
    input.value = parseInt(input.value) + 1;
    updateItemTotal(index);
}

function decrementQuantity(index) {
    const input = document.querySelectorAll('.quantity-input')[index];
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateItemTotal(index);
    }
}

// Add event listeners for manual quantity input
document.querySelectorAll('.quantity-input').forEach((input, index) => {
    input.addEventListener('change', () => {
        // Ensure minimum value is 1
        if (parseInt(input.value) < 1) {
            input.value = 1;
        }
        updateItemTotal(index);
    });
});

// Initialize totals
document.addEventListener('DOMContentLoaded', () => {
    updateCartSummary();
}); 