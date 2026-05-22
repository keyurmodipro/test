import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import { getCountries, getCitiesByCountry } from '../data/locations';
import { CreateUserRequest } from '../types';

// ──────────────────────────────────────────────
// User Controller — Request Handlers
// ──────────────────────────────────────────────

const UserController = {
  /**
   * POST /api/users
   * Create a new user profile
   */
  async createUser(req: Request<object, object, CreateUserRequest>, res: Response): Promise<void> {
    try {
      const { firstName, lastName, dateOfBirth, email, country, city } = req.body;

      // Check for duplicate email
      const exists = await UserModel.emailExists(email);
      if (exists) {
        res.status(409).json({
          success: false,
          message: 'A user with this email already exists',
          errors: { email: 'This email is already registered' },
        });
        return;
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
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const users = await UserModel.findAll(search as string | undefined);

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
  getCountries(_req: Request, res: Response): void {
    res.json({
      success: true,
      data: getCountries(),
    });
  },

  /**
   * GET /api/locations/cities/:country
   * Get cities for a given country code
   */
  getCities(req: Request<{ country: string }>, res: Response): void {
    const { country } = req.params;
    const cities = getCitiesByCountry(country);

    if (cities.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No cities found for the specified country',
      });
      return;
    }

    res.json({
      success: true,
      data: cities,
    });
  },
};

export default UserController;
