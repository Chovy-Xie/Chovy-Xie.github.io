function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

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

async function fetchRepos() {
    const gallery = document.getElementById('repo-gallery');

    try {
        const response = await fetch('https://api.github.com/users/chovy-xie/repos?sort=updated&per_page=20');  // fetch the repositories of my GitHub
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
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

document.addEventListener('DOMContentLoaded', fetchRepos);