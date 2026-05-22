import { useState, useCallback } from 'react';
import type { FormValues, FormErrors, FormTouched } from '../types';

// ──────────────────────────────────────────────
// Custom Form Hook
// ──────────────────────────────────────────────
// Manages form state, validation, touched fields,
// and submission. Keeps form logic out of
// components for cleaner separation.
// ──────────────────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface UseFormReturn {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  handleChange: (name: keyof FormValues, value: string) => void;
  handleBlur: (name: keyof FormValues) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (name: keyof FormValues, value: string) => void;
  setServerErrors: (serverErrors: FormErrors) => void;
}

const useForm = (
  initialValues: FormValues,
  onSubmit: (values: FormValues) => Promise<void>
): UseFormReturn => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateField = useCallback(
    (name: keyof FormValues, value: string): string => {
      switch (name) {
        case 'firstName':
          if (!value.trim()) return 'First name is required';
          if (value.trim().length > 100) return 'First name must be 100 characters or less';
          return '';

        case 'lastName':
          if (!value.trim()) return 'Last name is required';
          if (value.trim().length > 100) return 'Last name must be 100 characters or less';
          return '';

        case 'dateOfBirth':
          if (!value) return 'Date of birth is required';
          {
            const dob = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dob >= today) return 'Date of birth must be in the past';
          }
          return '';

        case 'email':
          if (!value.trim()) return 'Email is required';
          if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
          return '';

        case 'country':
          if (!value) return 'Country is required';
          return '';

        case 'city':
          if (!value) return 'City is required';
          return '';

        default:
          return '';
      }
    },
    []
  );

  // Validate all fields at once
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(values) as Array<keyof FormValues>).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
    const allTouched: FormTouched = {};
    (Object.keys(values) as Array<keyof FormValues>).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  }, [values, validateField]);

  // Handle field change
  const handleChange = useCallback(
    (name: keyof FormValues, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validate on change if the field was already touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  // Handle field blur (mark as touched and validate)
  const handleBlur = useCallback(
    (name: keyof FormValues) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField, values]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateAll()) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error: unknown) {
        // If server returns field-level errors, merge them in
        if (
          error &&
          typeof error === 'object' &&
          'response' in error
        ) {
          const axiosError = error as { response?: { data?: { errors?: FormErrors } } };
          if (axiosError.response?.data?.errors) {
            setErrors((prev) => ({ ...prev, ...axiosError.response!.data!.errors }));
          }
        }
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set a specific field value (useful for cascading dropdowns)
  const setFieldValue = useCallback((name: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Set server errors
  const setServerErrors = useCallback((serverErrors: FormErrors) => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setServerErrors,
  };
};

export default useForm;
