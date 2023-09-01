// API: https://developer.themoviedb.org/reference/movie-details
// TODO: add list of categories in the home page (by rating, by language, genre, now playing)
// TODO: add list of Brazilian films, or a dropdown with categories
// TODO: limit number of items on each list via dropdown select

const global = {
	currentPage: window.location.pathname,
	search: {
		term: '',
		type: '',
		page: 1,
		totalPages: 1,
	},
	api: {
		apiKey: 'cd311c035d6b18faffbee52835eb8ad3',
		apiUrl: 'https://api.themoviedb.org/3/',
	},
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

// Display Movie Details
async function displayMovieDetails() {
	const movieID = window.location.search.split('=')[1];
	const movie = await fetchData(`movie/${movieID}`);

	displayBackDrop('movie', movie.backdrop_path);

	const div = document.createElement('div');
	div.innerHTML = `
    <div class="details-top">
    <div>
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
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>${movie.overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
        ${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
  </div>
    `;
	document.querySelector('#movie-details').appendChild(div);
}

// Display Show Details
async function displayShowDetails() {
	const showID = window.location.search.split('=')[1];
	const tvshow = await fetchData(`tv/${showID}`);

	displayBackDrop('show', tvshow.backdrop_path);

	const div = document.createElement('div');
	div.innerHTML = `
    <div class="details-top">
    <div>
        ${
			tvshow.poster_path
				? `<img
        src="https://image.tmdb.org/t/p/w500${tvshow.poster_path}"
        class="card-img-top"
        alt="${tvshow.name}"
        />`
				: `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${tvshow.name}"
      />`
		}
    </div>
    <div>
      <h2>${tvshow.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${tvshow.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${tvshow.first_air_date}</p>
      <p>${tvshow.overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${tvshow.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${tvshow.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${tvshow.number_of_episodes}</li>
        <li>
            <span class="text-secondary">Last Episode To Air:</span> ${tvshow.last_episode_to_air.name}
        </li>
      <li><span class="text-secondary">Status:</span> ${tvshow.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
        ${tvshow.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
  </div>
    `;
	document.querySelector('#show-details').appendChild(div);
}

// Search Movies and Shows
async function search() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	global.search.type = urlParams.get('type');
	global.search.term = urlParams.get('search-term');

	if (global.search.term !== '' && global.search.term !== null) {
		const { results, total_pages, page } = await searchAPIData();

		if (results.length === 0) {
			showAlert('No results found');
			return;
		}

		//displaySearchResults(results);
	} else {
		showAlert('Please, enter a search term');
	}
}

// Display Slider Movies
async function displaySlider() {
	const { results } = await fetchData('movie/now_playing');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');
		div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}}">
          <img src="http://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
        </h4>
        `;

		document.querySelector('.swiper-wrapper').appendChild(div);

		initSwiper();
	});
}

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	});
}

// Add Backdrop
function displayBackDrop(type, imagePath) {
	const overlayDiv = document.createElement('div');
	overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${imagePath})`;
	overlayDiv.style.backgroundSize = 'cover';
	overlayDiv.style.backgroundPosition = 'center';
	overlayDiv.style.backgroundRepeat = 'no-repeat';
	overlayDiv.style.height = '100vh';
	overlayDiv.style.width = '100vw';
	overlayDiv.style.position = 'absolute';
	overlayDiv.style.top = '0';
	overlayDiv.style.left = '0';
	overlayDiv.style.zIndex = '-1';
	overlayDiv.style.opacity = '0.1';

	if (type === 'movie') {
		document.querySelector('#movie-details').appendChild(overlayDiv);
	} else {
		document.querySelector('#show-details').appendChild(overlayDiv);
	}
}

// Show Alert
function showAlert(message, className = 'error') {
	const alertEl = document.createElement('div');
	alertEl.classList.add('alert', className);
	alertEl.appendChild(document.createTextNode(message));
	document.querySelector('#alert').appendChild(alertEl);

	// Remove after 3 seconds
	setTimeout(() => {
		alertEl.remove();
	}, 4000);
}

// Add Commas to Number
function addCommasToNumber(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Fetch data from API
async function fetchData(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();
	const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
	const data = await response.json();
	hideSpinner();
	return data;
}

// Make request to search
async function searchAPIData() {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();
	const response = await fetch(
		`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
	);
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
			displaySlider();
			displayPopularMovies();
			break;
		case '/shows.html':
			displayPopularTVShows();
			break;
		case '/movie-details.html':
			displayMovieDetails();
			break;
		case '/tv-details.html':
			displayShowDetails();
			break;
		case '/search.html':
			search();
			break;
	}

	highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
