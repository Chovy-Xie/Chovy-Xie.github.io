/**
 * Authentication status check script
 * Used on all pages to update UI based on user's login status
 */
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

/**
 * Check if user is logged in and update UI accordingly
 */
function checkAuthStatus() {
    // Get auth elements
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const userMenu = document.getElementById('user-menu');
    const usernameEl = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');
    const orderHistoryLink = document.getElementById('order-history-link');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
        try {
            // Parse user data
            const user = JSON.parse(userJson);
            
            // Update UI for logged in state
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (usernameEl) usernameEl.textContent = user.name || 'User';
            if (orderHistoryLink) orderHistoryLink.style.display = 'inline-block';
            
            // Add event listener to logout button
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    logout();
                });
            }
            
            // Verify token validity with backend (optional)
            verifyToken(token);
            
        } catch (error) {
            console.error('Error parsing user data:', error);
            resetAuthState();
        }
    } else {
        // User is not logged in
        resetAuthState();
    }
}

/**
 * Reset auth state in the UI
 */
function resetAuthState() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const userMenu = document.getElementById('user-menu');
    const orderHistoryLink = document.getElementById('order-history-link');
    
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (signupBtn) signupBtn.style.display = 'inline-block';
    if (userMenu) userMenu.style.display = 'none';
    if (orderHistoryLink) orderHistoryLink.style.display = 'none';
}

/**
 * Logout the current user
 */
function logout() {
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home
    window.location.href = '/index.html';
}

/**
 * Verify token validity with backend
 * @param {string} token - JWT token
 */
async function verifyToken(token) {
    try {
        // This would be a real API call in production
        // const response = await fetch('/api/auth/verify', {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // });
        
        // if (!response.ok) {
        //     throw new Error('Invalid token');
        // }
        
        // For now, we'll just simulate token verification
        // In a real app, we'd validate the token with the backend
        console.log('Token verification would happen here');
        
    } catch (error) {
        console.error('Token verification failed:', error);
        // If verification fails, reset auth state
        resetAuthState();
    }
}

// Add some CSS for the user menu
const style = document.createElement('style');
style.textContent = `
.user-menu {
    display: flex;
    align-items: center;
    gap: 10px;
}

#username {
    font-weight: 500;
}

.logout-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
}

.logout-btn:hover {
    background-color: #d32f2f;
}
`;
document.head.appendChild(style); 