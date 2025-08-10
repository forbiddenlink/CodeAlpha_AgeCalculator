// Enhanced validation utility
export class ValidationHelper {
  static sanitizeInput(value) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return '';
    }
    return String(value).replace(/[<>"/\\&]/g, '').trim();
  }

  static validateDateRange(day, month, year) {
    const errors = [];
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    
    // Convert to numbers and validate
    day = parseInt(day);
    month = parseInt(month);
    year = parseInt(year);
    
    // Enhanced validation with specific error messages
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      errors.push('Day must be a number between 1 and 31');
    }
    
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      errors.push('Month must be a number between 1 and 12');
    }
    
    if (!Number.isInteger(year)) {
      errors.push('Year must be a valid number');
    } else if (year < 1900) {
      errors.push('Year must be 1900 or later for accurate calculations');
    } else if (year > currentYear) {
      errors.push('Birth year cannot be in the future');
    }
    
    // Validate day for specific month (only if basic validation passed)
    if (errors.length === 0) {
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        errors.push(`${monthNames[month]} ${year} only has ${daysInMonth} days`);
      }
      
      // Check if date is in the future
      const inputDate = new Date(year, month - 1, day);
      if (inputDate > currentDate) {
        errors.push('Birth date cannot be in the future');
      }
    }
    
    return errors;
  }

  static validateAge(day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    const ageInYears = today.getFullYear() - year;
    
    const errors = [];
    
    if (ageInYears > 150) {
      errors.push('Age cannot exceed 150 years. Please verify the birth year.');
    }
    
    if (ageInYears < 0) {
      errors.push('Birth date cannot be in the future');
    }
    
    if (birthDate > today) {
      errors.push('Birth date cannot be in the future');
    }
    
    return errors;
  }

  static validateDateString(dateString) {
    if (!dateString) {
      return ['Date is required'];
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return ['Please enter a valid date'];
    }
    
    if (date > new Date()) {
      return ['Birth date cannot be in the future'];
    }
    
    if (date.getFullYear() < 1900) {
      return ['Year must be 1900 or later for accurate calculations'];
    }
    
    return [];
  }

  static normalizeInput(value) {
    // Remove any non-numeric characters except for date separators
    return String(value).replace(/[^\d\-\/\.]/g, '');
  }

  static isValidDate(day, month, year) {
    const errors = this.validateDateRange(day, month, year);
    return errors.length === 0;
  }

  // Real-time validation for form fields
  static createValidator(fieldType) {
    const validators = {
      day: (value) => {
        const num = parseInt(value);
        if (!value) return { valid: true, message: '' };
        if (isNaN(num) || num < 1 || num > 31) {
          return { valid: false, message: 'Day must be between 1-31' };
        }
        return { valid: true, message: '' };
      },
      
      month: (value) => {
        const num = parseInt(value);
        if (!value) return { valid: true, message: '' };
        if (isNaN(num) || num < 1 || num > 12) {
          return { valid: false, message: 'Month must be between 1-12' };
        }
        return { valid: true, message: '' };
      },
      
      year: (value) => {
        const num = parseInt(value);
        if (!value) return { valid: true, message: '' };
        if (isNaN(num)) {
          return { valid: false, message: 'Year must be a number' };
        }
        if (num < 1900) {
          return { valid: false, message: 'Year must be 1900 or later' };
        }
        if (num > new Date().getFullYear()) {
          return { valid: false, message: 'Year cannot be in the future' };
        }
        return { valid: true, message: '' };
      }
    };
    
    return validators[fieldType] || (() => ({ valid: true, message: '' }));
  }
}
