// ──────────────────────────────────────────────
// Server Type Definitions
// ──────────────────────────────────────────────

/**
 * User profile as stored in the database
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  country: string;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Request body for creating a new user
 */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  country: string;
  city: string;
}

/**
 * Database row from the users table (snake_case)
 */
export interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  country: string;
  city: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Country data structure
 */
export interface Country {
  code: string;
  name: string;
}

/**
 * Location data mapping
 */
export interface LocationEntry {
  name: string;
  cities: string[];
}

export interface LocationMap {
  [countryCode: string]: LocationEntry;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: Record<string, string>;
}
