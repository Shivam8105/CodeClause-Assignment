const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchType = document.getElementById('searchType');
const resultsDiv = document.getElementById('results');

// Helper to fetch and show user profile
async function showUser(username) {
  resultsDiv.innerHTML = "<p>Loading user...</p>";
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) {
    resultsDiv.innerHTML = `<p>User not found</p>`;
    return;
  }
  const data = await res.json();
  resultsDiv.innerHTML = `
    <div class="user-card">
      <img src="${data.avatar_url}" alt="Avatar">
      <h2>${data.name || data.login}</h2>
      <p><a href="${data.html_url}" target="_blank">@${data.login}</a></p>
      <p>Public Repos: ${data.public_repos} | Followers: ${data.followers}</p>
      <p>${data.bio ? data.bio : ""}</p>
      <p><button onclick="showRepos('${data.login}')">Show Repositories</button></p>
    </div>
  `;
}

// Helper to fetch and show user repos
async function showRepos(username) {
  resultsDiv.innerHTML = "<p>Loading repositories...</p>";
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`);
  if (!res.ok) {
    resultsDiv.innerHTML = `<p>Could not fetch repos.</p>`;
    return;
  }
  const repos = await res.json();
  resultsDiv.innerHTML = `
    <h2>Repositories of ${username}</h2>
    <div>
      ${repos.map(repo => `
        <div class="repo-card">
          <h2><a href="${repo.html_url}" target="_blank">${repo.name}</a></h2>
          <p>${repo.description ? repo.description : ''}</p>
          <div class="repo-details">
            ⭐ ${repo.stargazers_count} &nbsp; | &nbsp;
            Forks: ${repo.forks_count}
            &nbsp; | &nbsp;
            Language: ${repo.language || "N/A"}
          </div>
        </div>
      `).join('')}
    </div>
    <button onclick="showUser('${username}')">Back to profile</button>
  `;
}

// Helper to fetch and show repo details
async function showRepo(fullName) {
  resultsDiv.innerHTML = "<p>Loading repository...</p>";
  const res = await fetch(`https://api.github.com/repos/${fullName}`);
  if (!res.ok) {
    resultsDiv.innerHTML = `<p>Repository not found</p>`;
    return;
  }
  const repo = await res.json();
  resultsDiv.innerHTML = `
    <div class="repo-card">
      <h2><a href="${repo.html_url}" target="_blank">${repo.full_name}</a></h2>
      <p>${repo.description ? repo.description : ''}</p>
      <div class="repo-details">
        ⭐ ${repo.stargazers_count} &nbsp; | &nbsp;
        Forks: ${repo.forks_count}
        &nbsp; | &nbsp;
        Open Issues: ${repo.open_issues_count}
        <br>
        Language: ${repo.language || "N/A"}
        &nbsp; | &nbsp;
        Updated: ${new Date(repo.updated_at).toLocaleString()}
      </div>
      <p><button onclick="searchInput.value='${repo.owner.login}'; searchType.value='users'; searchForm.dispatchEvent(new Event('submit', {cancelable:true}));">View Owner Profile</button></p>
    </div>
  `;
}

// Handle search form
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  resultsDiv.innerHTML = "<p>Searching...</p>";

  if (searchType.value === "users") {
    showUser(query);
  } else if (searchType.value === "repositories") {
    // Search for repos
    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`);
    if (!res.ok) {
      resultsDiv.innerHTML = `<p>No repositories found</p>`;
      return;
    }
    const data = await res.json();
    if (data.items.length === 0) {
      resultsDiv.innerHTML = `<p>No repositories found</p>`;
      return;
    }
    resultsDiv.innerHTML = data.items.map(repo =>
      `<div class="repo-card">
        <h2><a href="#" onclick="showRepo('${repo.full_name}');return false;">${repo.full_name}</a></h2>
        <p>${repo.description ? repo.description : ''}</p>
        <div class="repo-details">
          ⭐ ${repo.stargazers_count} &nbsp; | &nbsp; Forks: ${repo.forks_count}
          &nbsp; | &nbsp; Language: ${repo.language || "N/A"}
        </div>
      </div>`
    ).join('');
  }
});

// For inline event handlers
window.showRepos = showRepos;
window.showUser = showUser;
window.showRepo = showRepo;
