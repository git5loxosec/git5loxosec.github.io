async function loadGitHubRepos() {
    const user = 'git5loxosec';
    const limit = 10;
    const mainContainer = document.getElementById('repos-container');

    if(!mainContainer) return;
    mainContainer.innerHTML = '<p style="text-align:center; opacity:0.5;">Sincronizando infraestructura...</p>';

    try {
        const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
        if (!res.ok) throw new Error('API Error');
        
        let repos = await res.json();

        // 1. Filtrar el repo de la página
        // 2. Ordenar por estrellas (descendente)
        // 3. Tomar los primeros 10
        const topRepos = repos
            .filter(repo => repo.name.toLowerCase() !== `${user}.github.io`.toLowerCase())
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, limit);

        mainContainer.innerHTML = '';

        topRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin:0;"><a class="repo-link" href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <span style="color: #e3b341; font-size: 0.9em;">★ ${repo.stargazers_count}</span>
                </div>
                <p style="font-size: 0.85em; opacity: 0.7; margin: 8px 0;">
                    ${repo.description || 'No description provided.'}
                </p>
                <div style="font-size: 0.75em; display: flex; gap: 15px; opacity: 0.6;">
                    <span>● ${repo.language || 'Binary'}</span>
                    <span>Actualizado: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            `;

            mainContainer.appendChild(card);
        });
    } catch (e) {
        mainContainer.innerHTML = '<p>Error al conectar con el servidor.</p>';
        console.error(e);
    }
}

loadGitHubRepos();
