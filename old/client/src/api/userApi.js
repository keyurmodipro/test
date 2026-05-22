import axios from 'axios';

// ──────────────────────────────────────────────
// API Service Layer
// ──────────────────────────────────────────────
// Centralized API calls with consistent error
// handling. All components use this service
// instead of calling axios directly.
// ──────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all users, optionally filtered by search term
 * @param {string} [search] - Optional search term for first/last name
 * @returns {Promise<Array>} List of user objects
 */
export const getUsers = async (search = '') => {
  const params = search ? { search } : {};
  const { data } = await api.get('/users', { params });
  return data;
};

/**
 * Create a new user profile
 * @param {Object} userData - User form data
 * @returns {Promise<Object>} API response with created user
 */
export const createUser = async (userData) => {
  const { data } = await api.post('/users', userData);
  return data;
};

/**
 * Fetch list of available countries
 * @returns {Promise<Array>} List of country objects { code, name }
 */
export const getCountries = async () => {
  const { data } = await api.get('/locations/countries');
  return data;
};

/**
 * Fetch cities for a given country
 * @param {string} countryCode - Country code (e.g., 'US', 'India')
 * @returns {Promise<Array>} List of city names
 */
export const getCities = async (countryCode) => {
  const { data } = await api.get(`/locations/cities/${countryCode}`);
  return data;
};
