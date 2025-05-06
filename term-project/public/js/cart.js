document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const cartItemsCount = document.getElementById('cart-items-count');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    const couponInput = document.getElementById('coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const backToCartBtn = document.getElementById('back-to-cart-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const orderNumberElement = document.getElementById('order-number');
    
    // Cart state
    let cart = {
        items: [],
        coupon: null,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0
    };
    
    // Available coupons
    const coupons = {
        'TEA10': { name: 'TEA10', discount: 0.1, minPurchase: 0 },
        'TEA20': { name: 'TEA20', discount: 0.2, minPurchase: 50 },
        'FREESHIP': { name: 'FREESHIP', discount: 0, freeShipping: true, minPurchase: 30 }
    };
    
    // Sample products (for development purposes)
    const sampleProducts = [
        { id: 1, name: 'Green Tea', price: 12.99, image: '../img/products/green-tea.jpg' },
        { id: 2, name: 'Black Tea', price: 14.99, image: '../img/products/black-tea.jpg' },
        { id: 3, name: 'Oolong Tea', price: 16.99, image: '../img/products/oolong-tea.jpg' },
        { id: 4, name: 'Herbal Tea Sampler', price: 24.99, image: '../img/products/herbal-sampler.jpg' }
    ];
    
    // Initialize cart
    function initCart() {
        loadCart();
        renderCart();
        setupEventListeners();
        
        // Add sample products to cart if cart is empty (for development purposes)
        if (cart.items.length === 0 && localStorage.getItem('cart') === null) {
            addSampleItems();
        }
    }
    
    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Calculate cart totals
    function calculateTotals() {
        // Calculate subtotal
        cart.subtotal = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Calculate tax (assumed 8%)
        cart.tax = cart.subtotal * 0.08;
        
        // Calculate shipping
        cart.shipping = cart.subtotal > 0 ? 5.99 : 0;
        
        // Apply coupon if available
        cart.discount = 0;
        if (cart.coupon) {
            const coupon = coupons[cart.coupon];
            if (coupon) {
                if (cart.subtotal >= coupon.minPurchase) {
                    if (coupon.discount > 0) {
                        cart.discount = cart.subtotal * coupon.discount;
                    }
                    if (coupon.freeShipping) {
                        cart.shipping = 0;
                    }
                }
            }
        }
        
        // Calculate total
        cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount;
    }
    
    // Render cart items and totals
    function renderCart() {
        if (cart.items.length === 0) {
            cartEmpty.style.display = 'flex';
            cartContent.style.display = 'none';
            return;
        }
        
        cartEmpty.style.display = 'none';
        cartContent.style.display = 'flex';
        
        // Clear cart items container
        cartItemsContainer.innerHTML = '';
        
        // Update cart items count
        cartItemsCount.textContent = cart.items.length;
        
        // Render each cart item
        cart.items.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.dataset.id = item.id;
            
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <div class="item-attributes">
                        ${item.attributes ? Object.entries(item.attributes).map(([key, value]) => `<span>${key}: ${value}</span>`).join(' | ') : ''}
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update totals
        calculateTotals();
        subtotalElement.textContent = `$${cart.subtotal.toFixed(2)}`;
        taxElement.textContent = `$${cart.tax.toFixed(2)}`;
        shippingElement.textContent = cart.shipping > 0 ? `$${cart.shipping.toFixed(2)}` : 'Free';
        
        // Update discount
        if (cart.discount > 0) {
            discountElement.parentElement.style.display = 'flex';
            discountElement.textContent = `-$${cart.discount.toFixed(2)}`;
        } else {
            discountElement.parentElement.style.display = 'none';
        }
        
        // Update total
        totalElement.textContent = `$${cart.total.toFixed(2)}`;
        
        // Save cart
        saveCart();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Event delegation for cart items
        cartItemsContainer.addEventListener('click', function(e) {
            const target = e.target;
            
            // Increase item quantity
            if (target.classList.contains('increase-btn') || target.closest('.increase-btn')) {
                const btn = target.classList.contains('increase-btn') ? target : target.closest('.increase-btn');
                const itemId = parseInt(btn.dataset.id);
                increaseItemQuantity(itemId);
            }
            
            // Decrease item quantity
            if (target.classList.contains('decrease-btn') || target.closest('.decrease-btn')) {
                const btn = target.classList.contains('decrease-btn') ? target : target.closest('.decrease-btn');
                const itemId = parseInt(btn.dataset.id);
                decreaseItemQuantity(itemId);
            }
            
            // Remove item
            if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
                const btn = target.classList.contains('remove-item-btn') ? target : target.closest('.remove-item-btn');
                const itemId = parseInt(btn.dataset.id);
                removeItem(itemId);
            }
        });
        
        // Apply coupon
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', function() {
                applyCoupon();
            });
        }
        
        // Checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                openCheckoutModal();
            });
        }
        
        // Close modals
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeModals();
            });
        });
        
        // Back to cart button
        if (backToCartBtn) {
            backToCartBtn.addEventListener('click', function() {
                closeModals();
            });
        }
        
        // Place order button
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', function() {
                placeOrder();
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === checkoutModal || e.target === confirmationModal) {
                closeModals();
            }
        });
    }
    
    // Add item to cart
    function addItem(product, quantity = 1, attributes = {}) {
        const existingItem = cart.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                attributes: attributes
            });
        }
        
        renderCart();
    }
    
    // Increase item quantity
    function increaseItemQuantity(itemId) {
        const item = cart.items.find(item => item.id === itemId);
        if (item) {
            item.quantity += 1;
            renderCart();
        }
    }
    
    // Decrease item quantity
    function decreaseItemQuantity(itemId) {
        const item = cart.items.find(item => item.id === itemId);
        if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                removeItem(itemId);
            } else {
                renderCart();
            }
        }
    }
    
    // Remove item from cart
    function removeItem(itemId) {
        cart.items = cart.items.filter(item => item.id !== itemId);
        renderCart();
    }
    
    // Apply coupon code
    function applyCoupon() {
        const couponCode = couponInput.value.trim().toUpperCase();
        
        if (!couponCode) {
            alert('Please enter a coupon code.');
            return;
        }
        
        const coupon = coupons[couponCode];
        
        if (!coupon) {
            alert('Invalid coupon code.');
            return;
        }
        
        if (coupon.minPurchase > cart.subtotal) {
            alert(`This coupon requires a minimum purchase of $${coupon.minPurchase.toFixed(2)}.`);
            return;
        }
        
        cart.coupon = couponCode;
        renderCart();
        alert(`Coupon ${couponCode} applied successfully!`);
    }
    
    // Open checkout modal
    function openCheckoutModal() {
        if (cart.items.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        
        // Populate checkout modal with cart items
        const checkoutItemsContainer = document.getElementById('checkout-items');
        checkoutItemsContainer.innerHTML = '';
        
        cart.items.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <div class="checkout-item-details">
                    <span class="checkout-item-name">${item.name}</span>
                    <span class="checkout-item-quantity">x${item.quantity}</span>
                </div>
                <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            
            checkoutItemsContainer.appendChild(checkoutItem);
        });
        
        // Update checkout summary
        document.getElementById('checkout-subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
        document.getElementById('checkout-tax').textContent = `$${cart.tax.toFixed(2)}`;
        document.getElementById('checkout-shipping').textContent = cart.shipping > 0 ? `$${cart.shipping.toFixed(2)}` : 'Free';
        
        if (cart.discount > 0) {
            document.getElementById('checkout-discount-row').style.display = 'flex';
            document.getElementById('checkout-discount').textContent = `-$${cart.discount.toFixed(2)}`;
        } else {
            document.getElementById('checkout-discount-row').style.display = 'none';
        }
        
        document.getElementById('checkout-total').textContent = `$${cart.total.toFixed(2)}`;
        
        // Show checkout modal
        checkoutModal.style.display = 'block';
    }
    
    // Close all modals
    function closeModals() {
        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'none';
    }
    
    // Place order
    function placeOrder() {
        // Validate form (very basic validation for demo)
        const name = document.getElementById('checkout-name').value;
        const email = document.getElementById('checkout-email').value;
        const address = document.getElementById('checkout-address').value;
        
        if (!name || !email || !address) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Generate random order number
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        orderNumberElement.textContent = orderNumber;
        
        // Hide checkout modal and show confirmation
        checkoutModal.style.display = 'none';
        confirmationModal.style.display = 'block';
        
        // Clear cart
        cart.items = [];
        cart.coupon = null;
        saveCart();
        
        // Redirect to home page after 5 seconds
        setTimeout(() => {
            // window.location.href = 'index.html';
            // Instead of redirecting, we'll just close the modal for demo purposes
            closeModals();
            renderCart();
        }, 5000);
    }
    
    // Add sample items to cart (for development purposes)
    function addSampleItems() {
        addItem(sampleProducts[0], 1);
        addItem(sampleProducts[1], 2);
    }
    
    // Initialize cart
    initCart();
    
    // Expose addItem function to global scope (for adding items from product pages)
    window.addToCart = function(product, quantity = 1, attributes = {}) {
        addItem(product, quantity, attributes);
    };
}); 