async function loadGitHubRepos() {
    const user = 'git5loxosec';
    const limit = 10;
    const mainContainer = document.getElementById('repos-container');

    if(!mainContainer) return;

    try {
        const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
        if (!res.ok) throw new Error('API Error');
        
        let repos = await res.json();

        const topRepos = repos
            .filter(repo => repo.name.toLowerCase() !== `${user}.github.io`.toLowerCase())
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, limit);

        mainContainer.innerHTML = '';

        topRepos.forEach(repo => {
            const card = document.createElement('div');
            // Usamos app-card para que herede el estilo de tu CSS
            card.className = 'app-card';

            card.innerHTML = `
                <div class="card-content">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h2 style="margin:0;">${repo.name}</h2>
                        <span style="color: #f2cc60; font-size: 0.9em;">★ ${repo.stargazers_count}</span>
                    </div>
                    <p>${repo.description || 'No description provided.'}</p>
                    <div class="card-buttons" style="margin-top: 15px;">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Source</a>
                        <span style="font-size: 0.8em; opacity: 0.5; align-self: center;">
                            ${repo.language || 'Tool'}
                        </span>
                    </div>
                </div>
            `;

            mainContainer.appendChild(card);
        });
    } catch (e) {
        console.error("Error sincronizando repos:", e);
    }
}

loadGitHubRepos();
