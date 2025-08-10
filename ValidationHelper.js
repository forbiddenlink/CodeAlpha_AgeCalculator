// Enhanced validation utility
export class ValidationHelper {
  static sanitizeInput(value) {
    return String(value).replace(/[<>"/\\&]/g, '');
  }

  static validateDateRange(day, month, year) {
    const errors = [];
    const currentYear = new Date().getFullYear();
    
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
      errors.push('Year must be 1900 or later');
    } else if (year > currentYear) {
      errors.push('Birth year cannot be in the future');
    }
    
    // Validate day for specific month
    if (errors.length === 0) {
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        errors.push(`${monthNames[month]} ${year} only has ${daysInMonth} days`);
      }
    }
    
    return errors;
  }

  static validateAge(day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    const ageInYears = today.getFullYear() - year;
    
    if (ageInYears > 150) {
      return ['Age cannot exceed 150 years. Please verify the birth year.'];
    }
    
    if (birthDate > today) {
      return ['Birth date cannot be in the future'];
    }
    
    return [];
  }
}
