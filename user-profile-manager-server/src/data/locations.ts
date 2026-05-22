import { Country, LocationMap } from '../types';

// ──────────────────────────────────────────────
// Country & City Data
// ──────────────────────────────────────────────
// Centralized location data served via API.
// The frontend fetches this from the backend,
// keeping the source of truth in one place.
// ──────────────────────────────────────────────

const locations: LocationMap = {
  US: {
    name: 'United States',
    cities: ['New York', 'Los Angeles', 'Chicago'],
  },
  India: {
    name: 'India',
    cities: ['Mumbai', 'Delhi', 'Bangalore'],
  },
};

export const getCountries = (): Country[] => {
  return Object.entries(locations).map(([code, data]) => ({
    code,
    name: data.name,
  }));
};

export const getCitiesByCountry = (countryCode: string): string[] => {
  const country = locations[countryCode];
  return country ? country.cities : [];
};

export const isValidCountry = (countryCode: string): boolean => {
  return Object.keys(locations).includes(countryCode);
};

export const isValidCity = (countryCode: string, city: string): boolean => {
  const cities = getCitiesByCountry(countryCode);
  return cities.includes(city);
};
