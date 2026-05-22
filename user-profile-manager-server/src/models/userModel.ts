import { pool } from '../config/db';
import { User, CreateUserRequest, UserRow } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ──────────────────────────────────────────────
// User Model — Database Queries
// ──────────────────────────────────────────────
// All SQL queries are parameterized to prevent
// SQL injection attacks.
// ──────────────────────────────────────────────

interface UserRowData extends RowDataPacket, UserRow {}

const UserModel = {
  /**
   * Create a new user profile
   */
  async create(userData: CreateUserRequest): Promise<User> {
    const { firstName, lastName, dateOfBirth, email, country, city } = userData;

    const [result] = await pool.execute<ResultSetHeader>(
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
   */
  async findAll(search?: string): Promise<User[]> {
    let query = `
      SELECT id, first_name, last_name, date_of_birth, email, country, city, created_at
      FROM users
    `;
    const params: string[] = [];

    if (search && search.trim()) {
      query += ` WHERE first_name LIKE ? OR last_name LIKE ?`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.execute<UserRowData[]>(query, params);

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
   */
  async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    return rows.length > 0;
  },
};

export default UserModel;
