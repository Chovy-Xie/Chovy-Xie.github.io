// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Check which form is on the page
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form handler
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        
        // Add password confirmation validation
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordMatch);
        }
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialLogin('google'));
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => handleSocialLogin('facebook'));
    }

    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    if (togglePasswordBtns) {
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                // Toggle icon
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });
    }
});

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    try {
        // Form validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // Call the login API
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, remember })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to home page
        window.location.href = '/index.html';
        
    } catch (error) {
        showError(error.message || 'An error occurred during login');
        console.error('Login error:', error);
    }
}

/**
 * Handle signup form submission
 * @param {Event} e - Form submit event
 */
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms')?.checked || false;
    
    try {
        // Form validation
        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            showError('Password must be at least 8 characters long');
            return;
        }
        
        if (!termsAccepted) {
            showError('You must accept the Terms & Conditions');
            return;
        }
        
        // Call the signup API
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        
        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to home page
        window.location.href = '/index.html';
        
    } catch (error) {
        showError(error.message || 'An error occurred during signup');
        console.error('Signup error:', error);
    }
}

/**
 * Handle social login button clicks
 * @param {string} provider - The social provider (google, facebook)
 */
function handleSocialLogin(provider) {
    // In a real implementation, this would redirect to the OAuth provider
    console.log(`${provider} login clicked`);
    
    // Example of how we'd implement this with a real API
    // window.location.href = `/api/auth/${provider}`;
    
    // For the demo, just show an alert
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would be implemented with a real OAuth flow`);
}

/**
 * Validate that password and confirm password fields match
 */
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (password !== confirmPassword) {
        confirmPasswordInput.setCustomValidity("Passwords don't match");
    } else {
        confirmPasswordInput.setCustomValidity('');
    }
}

/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Check if error element already exists
    let errorElement = document.querySelector('.auth-error');
    
    if (!errorElement) {
        // Create error element if it doesn't exist
        errorElement = document.createElement('div');
        errorElement.className = 'auth-error';
        
        // Insert after the form title
        const form = document.querySelector('.auth-form');
        const subtitle = document.querySelector('.auth-subtitle');
        
        if (form && subtitle) {
            form.insertBefore(errorElement, subtitle.nextSibling);
        }
    }
    
    // Set error message and make it visible
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
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

/**
 * Logout the current user
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// Add error styling to the CSS
const style = document.createElement('style');
style.textContent = `
.auth-error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #f5c6cb;
    border-radius: 0.25rem;
    display: none;
}
`;
document.head.appendChild(style); 