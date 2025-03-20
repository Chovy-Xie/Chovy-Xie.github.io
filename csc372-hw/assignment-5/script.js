// Default username (your GitHub username)
const defaultUsername = 'chovy-xie';

// Function to format dates
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Function to create repository card
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    card.innerHTML = `
        <h2>
            <i class="fa-brands fa-github"></i>
            <a href="${repo.html_url}" class="repo-link" target="_blank">${repo.name}</a>
        </h2>
        <p>${repo.description || 'No description available'}</p>
        <p>Created: ${formatDate(repo.created_at)}</p>
        <p>Updated: ${formatDate(repo.updated_at)}</p>
        <p>Watchers: ${repo.watchers_count}</p>
        <p>Language: ${repo.language || 'Not specified'}</p>
    `;

    return card;
}

// Function to fetch and display repositories
async function fetchRepos() {
    const username = document.getElementById('username').value || defaultUsername;
    const gallery = document.getElementById('repo-gallery');
    gallery.innerHTML = ''; // Clear existing content

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`);
        if (!response.ok) {
            throw new Error('User not found');
        }
        
        const repos = await response.json();
        
        repos.forEach(repo => {
            const card = createRepoCard(repo);
            gallery.appendChild(card);
        });
    } catch (error) {
        gallery.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Load default user's repositories when page loads
document.addEventListener('DOMContentLoaded', fetchRepos);