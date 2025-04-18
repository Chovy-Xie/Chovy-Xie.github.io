// Global state
const state = {
    categories: [],
    currentCategory: null
};

// DOM references
const domElements = {
    categoriesMenu: document.getElementById('categories-menu'),
    categorySearchForm: document.getElementById('category-search-form'),
    categorySearchInput: document.getElementById('category-search-input'),
    randomJokeSection: document.getElementById('random-joke-section'),
    randomJokeContainer: document.getElementById('random-joke'),
    newRandomJokeBtn: document.getElementById('new-random-joke'),
    categoryJokesSection: document.getElementById('category-jokes-section'),
    categoryTitle: document.getElementById('category-title'),
    categoryJokesContainer: document.getElementById('category-jokes'),
    addJokeForm: document.getElementById('add-joke-form'),
    jokeCategory: document.getElementById('joke-category'),
    jokeSetup: document.getElementById('joke-setup'),
    jokeDelivery: document.getElementById('joke-delivery')
};

// API endpoint URLs
const API = {
    categories: '/jokebook/categories',
    jokesByCategory: (category) => `/jokebook/joke/${category}`,
    randomJoke: '/jokebook/random',
    addJoke: '/jokebook/joke/add'
};

// Fetch API wrapper with error handling
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // In a real app, we might show an error notification to the user here
        return null;
    }
}

// Load categories and populate navigation
async function loadCategories() {
    const categories = await fetchAPI(API.categories);
    
    if (categories && categories.length) {
        state.categories = categories;
        
        // Clear the menu
        domElements.categoriesMenu.textContent = '';
        
        // Add "All Categories" option that shows random joke
        const allCategoriesItem = document.createElement('li');
        const allCategoriesLink = document.createElement('a');
        allCategoriesLink.textContent = 'Random Joke';
        allCategoriesLink.href = '#';
        allCategoriesLink.classList.add('active');
        allCategoriesLink.dataset.category = 'random';
        allCategoriesItem.appendChild(allCategoriesLink);
        domElements.categoriesMenu.appendChild(allCategoriesItem);
        
        // Add each category to the menu
        categories.forEach(category => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = category;
            a.href = '#';
            a.dataset.category = category;
            
            li.appendChild(a);
            domElements.categoriesMenu.appendChild(li);
        });
        
        // Also populate the category dropdown in the form
        domElements.jokeCategory.textContent = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            domElements.jokeCategory.appendChild(option);
        });
    }
}

// Create a joke card element
function createJokeCard(joke) {
    const jokeCard = document.createElement('div');
    jokeCard.className = 'joke-card';
    
    const setup = document.createElement('p');
    setup.className = 'joke-setup';
    setup.textContent = joke.setup;
    
    const delivery = document.createElement('p');
    delivery.className = 'joke-delivery';
    delivery.textContent = joke.delivery;
    
    jokeCard.appendChild(setup);
    jokeCard.appendChild(delivery);
    
    return jokeCard;
}

// Load and display a random joke
async function loadRandomJoke() {
    // Show loading state
    domElements.randomJokeContainer.textContent = '';
    
    const loadingText = document.createElement('p');
    loadingText.className = 'joke-placeholder';
    loadingText.textContent = 'Loading a random joke...';
    domElements.randomJokeContainer.appendChild(loadingText);
    
    // Fetch joke
    const joke = await fetchAPI(API.randomJoke);
    
    // Update UI with joke
    domElements.randomJokeContainer.textContent = '';
    
    if (joke) {
        const jokeCard = createJokeCard(joke);
        domElements.randomJokeContainer.appendChild(jokeCard);
    } else {
        const errorText = document.createElement('p');
        errorText.className = 'joke-placeholder';
        errorText.textContent = 'Failed to load joke. Try again later.';
        domElements.randomJokeContainer.appendChild(errorText);
    }
}

// Load and display jokes for a specific category
async function loadCategoryJokes(category) {
    state.currentCategory = category;
    
    // Update active navigation item
    const navLinks = domElements.categoriesMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        if (link.dataset.category === category) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update category title
    domElements.categoryTitle.textContent = `${category} Jokes`;
    
    // Show loading state
    domElements.categoryJokesContainer.textContent = '';
    
    const loadingText = document.createElement('p');
    loadingText.className = 'joke-placeholder';
    loadingText.textContent = `Loading ${category} jokes...`;
    domElements.categoryJokesContainer.appendChild(loadingText);
    
    // Fetch jokes
    const jokes = await fetchAPI(API.jokesByCategory(category));
    
    // Update UI with jokes
    domElements.categoryJokesContainer.textContent = '';
    
    if (jokes && jokes.length) {
        jokes.forEach(joke => {
            const jokeCard = createJokeCard(joke);
            domElements.categoryJokesContainer.appendChild(jokeCard);
        });
    } else {
        const errorText = document.createElement('p');
        errorText.className = 'joke-placeholder';
        errorText.textContent = `No jokes found for category: ${category}`;
        domElements.categoryJokesContainer.appendChild(errorText);
    }
    
    // Show the category jokes section
    domElements.categoryJokesSection.classList.remove('hidden');
    domElements.randomJokeSection.classList.add('hidden');
}

// Handle search form submission
async function handleCategorySearch(event) {
    event.preventDefault();
    
    const categoryName = domElements.categorySearchInput.value.trim();
    
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }
    
    // Check if category exists in our known categories
    if (!state.categories.includes(categoryName)) {
        const confirmSearch = confirm(`Category "${categoryName}" is not in the list. Search anyway?`);
        if (!confirmSearch) {
            return;
        }
    }
    
    // Load and display jokes for the category
    try {
        await loadCategoryJokes(categoryName);
    } catch (error) {
        alert(`Error: ${error.message || 'Failed to load jokes for this category'}`);
    }
}

// Submit a new joke
async function submitJoke(event) {
    // Prevent form submission
    event.preventDefault();
    
    // Get form values
    const category = domElements.jokeCategory.value;
    const setup = domElements.jokeSetup.value.trim();
    const delivery = domElements.jokeDelivery.value.trim();
    
    // Validate
    if (!category || !setup || !delivery) {
        alert('Please fill in all fields');
        return;
    }
    
    // Submit to API
    const response = await fetchAPI(API.addJoke, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, setup, delivery })
    });
    
    if (response) {
        // Reset form
        domElements.jokeSetup.value = '';
        domElements.jokeDelivery.value = '';
        
        // Show success message
        alert('Joke added successfully!');
        
        // Show the category jokes with newly added joke
        loadCategoryJokes(category);
    } else {
        alert('Failed to add joke. Please try again later.');
    }
}

// Event delegation for navigation clicks
function handleNavClick(event) {
    // Only handle clicks on links
    if (event.target.tagName === 'A') {
        event.preventDefault();
        
        // Remove active class from all links
        const navLinks = domElements.categoriesMenu.querySelectorAll('a');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        event.target.classList.add('active');
        
        const category = event.target.dataset.category;
        
        if (category === 'random') {
            // Show random joke section
            domElements.randomJokeSection.classList.remove('hidden');
            domElements.categoryJokesSection.classList.add('hidden');
            loadRandomJoke();
        } else {
            // Show category jokes
            loadCategoryJokes(category);
        }
    }
}

// Initialize the app
function initApp() {
    // Load categories for navigation
    loadCategories();
    
    // Load initial random joke
    loadRandomJoke();
    
    // Set up event listeners
    domElements.categoriesMenu.addEventListener('click', handleNavClick);
    domElements.newRandomJokeBtn.addEventListener('click', loadRandomJoke);
    domElements.addJokeForm.addEventListener('submit', submitJoke);
    domElements.categorySearchForm.addEventListener('submit', handleCategorySearch);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 