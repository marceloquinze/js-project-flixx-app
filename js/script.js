// API: https://developer.themoviedb.org/reference/movie-details
// TODO: add list of categories in the home page (by rating, by language, genre, now playing)
// TODO: add list of Brazilian films, or a dropdown with categories
// TODO: limit number of items on each list via dropdown select
import { global } from './global.js';

import fetchData from './models.js';

import {
	showSpinner,
	hideSpinner,
	highlightActiveLink,
	displayBackDrop,
	showAlert,
	addCommasToNumber,
} from './utils.js';

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
            src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
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
        src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
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
        src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
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
        src="https://image.tmdb.org/t/p/w500/${tvshow.poster_path}"
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
		const { results, total_pages, page, total_results } = await searchAPIData();

		global.search.page = page;
		global.search.totalPages = total_pages;
		global.search.totalResults = total_results;

		if (results.length === 0) {
			showAlert('No results found');
			return;
		}

		displaySearchResults(results);
		document.querySelector('#search-term').value = '';
	} else {
		showAlert('Please, enter a search term');
	}
}

// Display Search Results
function displaySearchResults(results) {
	// Clear previous results
	document.querySelector('#search-results').innerHTML = '';
	document.querySelector('#search-results-heading').innerHTML = '';
	document.querySelector('#pagination').innerHTML = '';

	results.forEach((result) => {
		// Limit number of itens (add index to foreach)
		// if (index < 8) {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
        <a href="${global.search.type}-details.html?id=${result.id}">
          ${
				result.poster_path
					? `<img
            src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`
					: `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`
			}
        </a>
        <div class="card-body">
          <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${
				global.search.type === 'movie' ? result.release_date : result.first_air_date
			}</small>
          </p>
        </div>
        `;

		document.querySelector('#search-results-heading').innerHTML = `
			<h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>
		`;
		document.querySelector('#search-results').appendChild(div);
	});

	displayPagination();
}

// Create and display pagination for search
function displayPagination() {
	const div = document.createElement('div');
	div.classList.add('pagination');
	div.innerHTML = `
	<button class="btn btn-primary" id="prev">Prev</button>
	<button class="btn btn-primary" id="next">Next</button>
	<div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
	`;
	document.querySelector('#pagination').appendChild(div);

	// Disable prev button on first page
	if (global.search.page === 1) {
		document.querySelector('#prev').disabled = true;
	}

	// Disable next button on last page
	if (global.search.page === global.search.totalPages) {
		document.querySelector('#next').disabled = true;
	}

	// Next page
	document.querySelector('#next').addEventListener('click', async () => {
		global.search.page++;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
	});

	// Previous page
	document.querySelector('#prev').addEventListener('click', async () => {
		global.search.page--;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
	});
}

// Display Slider Movies
async function displaySlider() {
	const { results } = await fetchData('movie/now_playing');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');
		div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}}">
          <img src="http://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
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

// Make request to search
async function searchAPIData() {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();
	const response = await fetch(
		`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
	);
	const data = await response.json();
	hideSpinner();
	return data;
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
