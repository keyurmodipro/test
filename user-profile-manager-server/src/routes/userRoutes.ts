import { Router } from 'express';
import UserController from '../controllers/userController';
import { userValidationRules, validate } from '../middleware/validation';

// ──────────────────────────────────────────────
// User Routes
// ──────────────────────────────────────────────

const router = Router();

// User CRUD
router.post('/users', userValidationRules, validate, UserController.createUser);
router.get('/users', UserController.getUsers);

// Location data (for cascading dropdowns)
router.get('/locations/countries', UserController.getCountries);
router.get('/locations/cities/:country', UserController.getCities);

export default router;
