import { useState, useCallback } from 'react';

// ──────────────────────────────────────────────
// Custom Form Hook
// ──────────────────────────────────────────────
// Manages form state, validation, touched fields,
// and submission. Keeps form logic out of
// components for cleaner separation.
// ──────────────────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateField = useCallback((name, value, allValues) => {
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
        const dob = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob >= today) return 'Date of birth must be in the past';
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
  }, []);

  // Validate all fields at once
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key], values);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  }, [values, validateField]);

  // Handle field change
  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validate on change if the field was already touched
      if (touched[name]) {
        const error = validateField(name, value, { ...values, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField, values]
  );

  // Handle field blur (mark as touched and validate)
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name], values);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField, values]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateAll()) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        // If server returns field-level errors, merge them in
        if (error.response?.data?.errors) {
          setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
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
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Set server errors
  const setServerErrors = useCallback((serverErrors) => {
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
