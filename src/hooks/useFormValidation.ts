
import { useState } from 'react';

interface ValidationRules {
  email?: boolean;
  password?: boolean;
  required?: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: string, rules: ValidationRules = {}): boolean => {
    let errorMessage = '';

    if (rules.required && !value.trim()) {
      errorMessage = 'This field is required';
    } else if (rules.email && value && !isValidEmail(value)) {
      errorMessage = 'Please enter a valid email address';
    } else if (rules.password && value && !isValidPassword(value)) {
      errorMessage = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    return !errorMessage;
  };

  const clearError = (name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    isValidEmail,
    isValidPassword
  };
};
