// ──────────────────────────────────────────────
// Client Type Definitions
// ──────────────────────────────────────────────

/**
 * User profile as returned from the API
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  country: string;
  city: string;
  createdAt?: string;
}

/**
 * Form values for creating a user profile
 */
export interface FormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  country: string;
  city: string;
}

/**
 * Form errors — each key maps to an error message string
 */
export type FormErrors = Partial<Record<keyof FormValues, string>>;

/**
 * Touched state — tracks which fields the user has interacted with
 */
export type FormTouched = Partial<Record<keyof FormValues, boolean>>;

/**
 * Option for Select dropdown component
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Country data from the API
 */
export interface Country {
  code: string;
  name: string;
}

/**
 * Toast notification data
 */
export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error';
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  errors?: Record<string, string>;
}
