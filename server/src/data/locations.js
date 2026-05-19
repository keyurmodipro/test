// ──────────────────────────────────────────────
// Country & City Data
// ──────────────────────────────────────────────
// Centralized location data served via API.
// The frontend fetches this from the backend,
// keeping the source of truth in one place.
// ──────────────────────────────────────────────

const locations = {
  US: {
    name: 'United States',
    cities: ['New York', 'Los Angeles', 'Chicago'],
  },
  India: {
    name: 'India',
    cities: ['Mumbai', 'Delhi', 'Bangalore'],
  },
};

const getCountries = () => {
  return Object.entries(locations).map(([code, data]) => ({
    code,
    name: data.name,
  }));
};

const getCitiesByCountry = (countryCode) => {
  const country = locations[countryCode];
  return country ? country.cities : [];
};

const isValidCountry = (countryCode) => {
  return Object.keys(locations).includes(countryCode);
};

const isValidCity = (countryCode, city) => {
  const cities = getCitiesByCountry(countryCode);
  return cities.includes(city);
};

module.exports = {
  getCountries,
  getCitiesByCountry,
  isValidCountry,
  isValidCity,
};
