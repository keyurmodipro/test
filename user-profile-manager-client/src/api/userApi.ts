import axios from 'axios';
import type { User, Country, ApiResponse, FormValues } from '../types';

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
 */
export const getUsers = async (search: string = ''): Promise<ApiResponse<User[]>> => {
  const params = search ? { search } : {};
  const { data } = await api.get<ApiResponse<User[]>>('/users', { params });
  return data;
};

/**
 * Create a new user profile
 */
export const createUser = async (userData: FormValues): Promise<ApiResponse<User>> => {
  const { data } = await api.post<ApiResponse<User>>('/users', userData);
  return data;
};

/**
 * Fetch list of available countries
 */
export const getCountries = async (): Promise<ApiResponse<Country[]>> => {
  const { data } = await api.get<ApiResponse<Country[]>>('/locations/countries');
  return data;
};

/**
 * Fetch cities for a given country
 */
export const getCities = async (countryCode: string): Promise<ApiResponse<string[]>> => {
  const { data } = await api.get<ApiResponse<string[]>>(`/locations/cities/${countryCode}`);
  return data;
};
