const UserModel = require('../models/userModel');
const { getCountries, getCitiesByCountry } = require('../data/locations');

// ──────────────────────────────────────────────
// User Controller — Request Handlers
// ──────────────────────────────────────────────

const UserController = {
  /**
   * POST /api/users
   * Create a new user profile
   */
  async createUser(req, res) {
    try {
      const { firstName, lastName, dateOfBirth, email, country, city } = req.body;

      // Check for duplicate email
      const exists = await UserModel.emailExists(email);
      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'A user with this email already exists',
          errors: { email: 'This email is already registered' },
        });
      }

      const user = await UserModel.create({
        firstName,
        lastName,
        dateOfBirth,
        email,
        country,
        city,
      });

      res.status(201).json({
        success: true,
        message: 'User profile created successfully',
        data: user,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while creating the user profile',
      });
    }
  },

  /**
   * GET /api/users
   * Fetch all users with optional search
   * Query params: ?search=term
   */
  async getUsers(req, res) {
    try {
      const { search } = req.query;
      const users = await UserModel.findAll(search);

      res.json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching user profiles',
      });
    }
  },

  /**
   * GET /api/locations/countries
   * Get list of available countries
   */
  getCountries(req, res) {
    res.json({
      success: true,
      data: getCountries(),
    });
  },

  /**
   * GET /api/locations/cities/:country
   * Get cities for a given country code
   */
  getCities(req, res) {
    const { country } = req.params;
    const cities = getCitiesByCountry(country);

    if (cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No cities found for the specified country',
      });
    }

    res.json({
      success: true,
      data: cities,
    });
  },
};

module.exports = UserController;
