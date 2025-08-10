const apiKey = '496510b3'; // Replace with your OMDb API key
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const moviesGrid = document.getElementById('moviesGrid');

// Modal elements
const movieModal = document.getElementById('movieModal');
const closeModalBtn = document.getElementById('closeModal');
const movieDetailsDiv = document.getElementById('movieDetails');

// Fetch movies by search term
async function fetchMovies(query) {
  moviesGrid.innerHTML = '<p class="loading-msg">🎬 Searching movies...</p>';
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      moviesGrid.innerHTML = `<p class="error-msg">❌ No movies found for "<strong>${query}</strong>".</p>`;
    }
  } catch (err) {
    console.error(err);
    moviesGrid.innerHTML = `<p class="error-msg">⚠️ Error fetching movies. Please try again.</p>`;
  }
}

// Display movies and add click handlers to show modal with details
function displayMovies(movies) {
  moviesGrid.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.setAttribute('tabindex', '0'); // For accessibility

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.Title}" />
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>Year: ${movie.Year}</p>
        <p>Type: ${capitalize(movie.Type)}</p>
      </div>
    `;

    // Click or keyboard Enter/Space to open modal with movie details
    card.addEventListener('click', () => showMovieDetails(movie.imdbID));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showMovieDetails(movie.imdbID);
      }
    });

    moviesGrid.appendChild(card);
  });
}

// Fetch and show detailed information in modal
async function showMovieDetails(imdbID) {
  movieDetailsDiv.innerHTML = '<p style="text-align:center; padding:40px;">Loading details…</p>';
  movieModal.style.display = 'block';

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`);
    const data = await res.json();

    if (data.Response === "True") {
      movieDetailsDiv.innerHTML = `
        <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/180x260?text=No+Image'}" alt="${data.Title}">
        <h2>${data.Title} (${data.Year})</h2>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p class="details-row"><strong>IMDB Rating:</strong> ${data.imdbRating} / 10</p>
        <p class="details-row"><strong>Runtime:</strong> ${data.Runtime}</p>
        <p class="details-row"><strong>Released:</strong> ${data.Released}</p>
        <p class="details-row"><strong>Language:</strong> ${data.Language}</p>
      `;
    } else {
      movieDetailsDiv.innerHTML = `<p style="text-align:center; padding:40px;">Details not found.</p>`;
    }
  } catch (error) {
    movieDetailsDiv.innerHTML = `<p style="text-align:center; padding:40px;">Error loading details.</p>`;
  }
}

// Close modal on clicking close button
closeModalBtn.onclick = () => {
  movieModal.style.display = "none";
};

// Close modal on clicking outside modal content
window.onclick = (e) => {
  if (e.target === movieModal) {
    movieModal.style.display = "none";
  }
};

// Capitalize first letter helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Search function triggered by button or Enter key
function onSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a movie title!');
    return;
  }
  fetchMovies(query);
}

// Event listeners for search button and Enter key in input
searchButton.addEventListener('click', onSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') onSearch();
});

// Load default movie list on page load
window.addEventListener('DOMContentLoaded', () => fetchMovies('Avengers'));
