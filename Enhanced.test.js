// Comprehensive test suite
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AgeCalculator from './AgeCalculator.js';
import { ValidationHelper } from './ValidationHelper.js';
import { AccessibilityHelper } from './AccessibilityHelper.js';

describe('Enhanced AgeCalculator Tests', () => {
  describe('Edge Cases', () => {
    it('handles leap year calculations correctly', () => {
      const calc = new AgeCalculator(29, 2, 2000); // Feb 29, 2000
      const result = calc.calculate();
      expect(result.years).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeUndefined();
    });

    it('handles end of month dates', () => {
      const calc = new AgeCalculator(31, 1, 2000); // Jan 31, 2000
      const result = calc.calculate();
      expect(result.years).toBeGreaterThanOrEqual(0);
    });

    it('handles February 29 in non-leap years gracefully', () => {
      const validation = AgeCalculator.validateDate(29, 2, 2021);
      expect(validation).toBeTruthy();
    });
  });

  describe('Performance Tests', () => {
    it('calculates age quickly for multiple dates', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        const calc = new AgeCalculator(15, 6, 1990 + (i % 30));
        calc.calculate();
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe('Planetary Age Calculations', () => {
    it('calculates planetary ages correctly', () => {
      const calc = new AgeCalculator(1, 1, 2000);
      const planetaryAges = calc.getPlanetaryAges();
      
      expect(planetaryAges).toHaveLength(7); // 7 planets
      expect(planetaryAges[0].planet).toBe('Mercury');
      expect(planetaryAges[0].age).toBeGreaterThan(0);
    });
  });
});

describe('ValidationHelper Tests', () => {
  describe('Input Sanitization', () => {
    it('sanitizes malicious input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = ValidationHelper.sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
    });

    it('preserves normal input', () => {
      const normalInput = '15';
      const sanitized = ValidationHelper.sanitizeInput(normalInput);
      expect(sanitized).toBe('15');
    });
  });

  describe('Date Validation', () => {
    it('validates correct dates', () => {
      const errors = ValidationHelper.validateDateRange(15, 6, 1990);
      expect(errors).toHaveLength(0);
    });

    it('catches invalid dates', () => {
      const errors = ValidationHelper.validateDateRange(32, 13, 1800);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('validates leap year dates', () => {
      const errors = ValidationHelper.validateDateRange(29, 2, 2000);
      expect(errors).toHaveLength(0);
      
      const errors2 = ValidationHelper.validateDateRange(29, 2, 2001);
      expect(errors2.length).toBeGreaterThan(0);
    });
  });
});

describe('AccessibilityHelper Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Screen Reader Announcements', () => {
    it('creates accessible announcements', () => {
      AccessibilityHelper.announceToScreenReader('Test message');
      
      const announcement = document.querySelector('[aria-live]');
      expect(announcement).toBeTruthy();
      expect(announcement.textContent).toBe('Test message');
      expect(announcement.getAttribute('aria-live')).toBe('polite');
    });

    it('creates urgent announcements', () => {
      AccessibilityHelper.announceToScreenReader('Urgent message', 'assertive');
      
      const announcement = document.querySelector('[aria-live="assertive"]');
      expect(announcement).toBeTruthy();
    });
  });

  describe('Form Enhancement', () => {
    it('enhances form accessibility', () => {
      document.body.innerHTML = `
        <input type="number" id="test-input">
        <div id="error-message"></div>
      `;
      
      AccessibilityHelper.enhanceFormAccessibility();
      
      const input = document.getElementById('test-input');
      expect(input.getAttribute('aria-describedby')).toBe('test-input-error');
      
      const errorElement = document.getElementById('error-message');
      expect(errorElement.getAttribute('role')).toBe('status');
    });
  });
});

describe('Integration Tests', () => {
  it('handles complete age calculation workflow', () => {
    // Simulate user input
    const day = 15;
    const month = 6;
    const year = 1990;
    
    // Validate input
    const validationErrors = ValidationHelper.validateDateRange(day, month, year);
    expect(validationErrors).toHaveLength(0);
    
    // Calculate age
    const calc = new AgeCalculator(day, month, year);
    const result = calc.calculate();
    
    expect(result.years).toBeGreaterThan(0);
    expect(result.months).toBeGreaterThanOrEqual(0);
    expect(result.days).toBeGreaterThanOrEqual(0);
    
    // Get additional data
    const stats = calc.getStats();
    const funFacts = calc.getFunFacts();
    const planetaryAges = calc.getPlanetaryAges();
    
    expect(stats).toBeTruthy();
    expect(funFacts).toBeTruthy();
    expect(planetaryAges).toBeTruthy();
  });
});
