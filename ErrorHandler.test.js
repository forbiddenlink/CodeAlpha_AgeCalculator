// ErrorHandler.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ErrorHandler } from './ErrorHandler.js';

// Mock DOM methods
Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost:4567' },
  writable: true
});

Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Test Browser)',
  writable: true
});

describe('ErrorHandler', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    console.error = vi.fn();
    console.warn = vi.fn();
    console.debug = vi.fn();
  });

  afterEach(() => {
    // Clean up any notifications
    document.querySelectorAll('.error-notification').forEach(el => el.remove());
  });

  describe('handleError', () => {
    it('handles generic errors gracefully', () => {
      const error = new Error('Test error');
      const result = ErrorHandler.handleError(error, 'Test Context');
      
      expect(console.error).toHaveBeenCalledWith(
        '[Test Context] Error:', 
        error
      );
      expect(result).toBe('An unexpected error occurred. Please refresh the page and try again.');
    });

    it('returns user-friendly messages for specific error types', () => {
      const typeError = new TypeError('Invalid operation');
      const result = ErrorHandler.handleError(typeError);
      
      expect(result).toBe('Something went wrong with the calculation. Please try again.');
    });

    it('shows error notification in DOM', () => {
      const error = new Error('Test error');
      ErrorHandler.handleError(error);
      
      const notification = document.querySelector('.error-notification');
      expect(notification).toBeTruthy();
      expect(notification.textContent).toContain('An unexpected error occurred');
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('maps TypeError to user-friendly message', () => {
      const error = new TypeError('Type mismatch');
      const message = ErrorHandler.getUserFriendlyMessage(error);
      expect(message).toBe('Something went wrong with the calculation. Please try again.');
    });

    it('maps RangeError to user-friendly message', () => {
      const error = new RangeError('Out of range');
      const message = ErrorHandler.getUserFriendlyMessage(error);
      expect(message).toBe('Please enter a valid date within the supported range.');
    });

    it('returns default message for unknown errors', () => {
      const error = new Error('Unknown error');
      const message = ErrorHandler.getUserFriendlyMessage(error);
      expect(message).toBe('An unexpected error occurred. Please refresh the page and try again.');
    });
  });

  describe('createBoundaryWrapper', () => {
    it('wraps functions in error handling', async () => {
      const mockFn = vi.fn(() => {
        throw new Error('Test error');
      });
      
      const wrappedFn = ErrorHandler.createBoundaryWrapper(mockFn, 'Test Context');
      const result = await wrappedFn();
      
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('An unexpected error occurred. Please refresh the page and try again.');
    });

    it('passes through successful function results', async () => {
      const mockFn = vi.fn(() => 'success');
      const wrappedFn = ErrorHandler.createBoundaryWrapper(mockFn, 'Test Context');
      const result = await wrappedFn();
      
      expect(result).toBe('success');
    });
  });

  describe('logError', () => {
    it('logs errors in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error');
      ErrorHandler.logError(error, 'Test Context');
      
      expect(console.warn).toHaveBeenCalledWith(
        'Error logged:', 
        expect.objectContaining({
          context: 'Test Context',
          error: 'Test error'
        })
      );
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});
