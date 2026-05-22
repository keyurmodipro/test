const { pool } = require('../config/db');

// ──────────────────────────────────────────────
// User Model — Database Queries
// ──────────────────────────────────────────────
// All SQL queries are parameterized to prevent
// SQL injection attacks.
// ──────────────────────────────────────────────

const UserModel = {
  /**
   * Create a new user profile
   * @param {Object} userData - User data to insert
   * @returns {Object} - Created user with ID
   */
  async create(userData) {
    const { firstName, lastName, dateOfBirth, email, country, city } = userData;

    const [result] = await pool.execute(
      `INSERT INTO users (first_name, last_name, date_of_birth, email, country, city)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, dateOfBirth, email.toLowerCase(), country, city]
    );

    return {
      id: result.insertId,
      firstName,
      lastName,
      dateOfBirth,
      email: email.toLowerCase(),
      country,
      city,
    };
  },

  /**
   * Fetch all users, optionally filtered by search term
   * Searches against first_name and last_name
   * @param {string} [search] - Optional search term
   * @returns {Array} - List of user objects
   */
  async findAll(search) {
    let query = `
      SELECT id, first_name, last_name, date_of_birth, email, country, city, created_at
      FROM users
    `;
    const params = [];

    if (search && search.trim()) {
      query += ` WHERE first_name LIKE ? OR last_name LIKE ?`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.execute(query, params);

    // Map snake_case DB columns to camelCase
    return rows.map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth,
      email: row.email,
      country: row.country,
      city: row.city,
      createdAt: row.created_at,
    }));
  },

  /**
   * Check if an email already exists
   * @param {string} email
   * @returns {boolean}
   */
  async emailExists(email) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    return rows.length > 0;
  },
};

module.exports = UserModel;
