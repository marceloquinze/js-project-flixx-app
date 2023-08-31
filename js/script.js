// API: https://developer.themoviedb.org/reference/movie-details
// TODO: add list of categories in the home page (by rating, by language, genre, now playing)
// TODO: add list of Brazilian films, or a dropdown with categories

const global = {
	currentPage: window.location.pathname,
};

// Display Popular 20 Movies
async function displayPopularMovies() {
	const { results } = await fetchData('movie/popular');
	results.forEach((movie) => {
		// Limit number of itens (add index to foreach)
		// if (index < 8) {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${
				movie.poster_path
					? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
            />`
					: `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
            />`
			}
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
        `;
		document.querySelector('#popular-movies').appendChild(div);
	});
}

// Display Popular 20 TV Shows
async function displayPopularTVShows() {
	const { results } = await fetchData('tv/popular');
	results.forEach((show) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
        ${
			show.poster_path
				? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
        />`
				: `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${show.name}"
        />`
		}
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Aired: ${show.first_air_date}</small>
        </p>
      </div>
        `;
		document.querySelector('#popular-shows').appendChild(div);
	});
}

// Fetch data from API
async function fetchData(endpoint) {
	const API_KEY = 'cd311c035d6b18faffbee52835eb8ad3';
	const API_URL = 'https://api.themoviedb.org/3/';

	showSpinner();
	const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
	const data = await response.json();
	hideSpinner();
	return data;
}

// Highlight active link
function highlightActiveLink() {
	const links = document.querySelectorAll('.nav-link');
	links.forEach((link) => {
		if (link.getAttribute('href') === global.currentPage) {
			link.classList.add('active');
		}
	});
}

// Show Spinner
function showSpinner() {
	document.querySelector('.spinner').classList.add('show');
}

// Hide Spinner
function hideSpinner() {
	document.querySelector('.spinner').classList.remove('show');
}

// Init App
function init() {
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			break;
		case '/shows.html':
			displayPopularTVShows();
			break;
		case '/movie-details.html':
			console.log('movies details');
			break;
		case '/tv-details.html':
			console.log('tv details');
			break;
		case '/search.html':
			console.log('search');
			break;
	}

	highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
