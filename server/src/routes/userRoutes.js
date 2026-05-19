const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { userValidationRules, validate } = require('../middleware/validation');

// ──────────────────────────────────────────────
// User Routes
// ──────────────────────────────────────────────

// User CRUD
router.post('/users', userValidationRules, validate, UserController.createUser);
router.get('/users', UserController.getUsers);

// Location data (for cascading dropdowns)
router.get('/locations/countries', UserController.getCountries);
router.get('/locations/cities/:country', UserController.getCities);

module.exports = router;
