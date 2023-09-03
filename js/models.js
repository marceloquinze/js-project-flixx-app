import { global } from './global.js';
import { showSpinner, hideSpinner } from './utils.js';

// Fetch data from API
export default async function fetchData(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();
	const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
	const data = await response.json();
	hideSpinner();
	return data;
}
