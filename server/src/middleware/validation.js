const { body, validationResult } = require('express-validator');
const { isValidCountry, isValidCity } = require('../data/locations');

// ──────────────────────────────────────────────
// Validation Rules for User Creation
// ──────────────────────────────────────────────
// Server-side validation mirrors client-side
// validation (defense in depth).
// ──────────────────────────────────────────────

const userValidationRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be 100 characters or less')
    .escape(),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be 100 characters or less')
    .escape(),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dob >= today) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    }),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .custom((value) => {
      if (!isValidCountry(value)) {
        throw new Error('Invalid country selection');
      }
      return true;
    }),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .custom((value, { req }) => {
      if (!isValidCity(req.body.country, value)) {
        throw new Error('Invalid city for the selected country');
      }
      return true;
    }),
];

/**
 * Middleware to check validation results and return errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Transform errors into a field-keyed object for easy frontend consumption
    const fieldErrors = {};
    errors.array().forEach((error) => {
      if (!fieldErrors[error.path]) {
        fieldErrors[error.path] = error.msg;
      }
    });

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: fieldErrors,
    });
  }
  next();
};

module.exports = { userValidationRules, validate };
