// script.js - Enhanced Age Calculator Application
import AgeCalculator from './AgeCalculator.js';
import UIManager from './UIManager.js';
import ThemeManager from './ThemeManager.js';
import { ErrorHandler } from './ErrorHandler.js';
import { ValidationHelper } from './ValidationHelper.js';
import { performanceMonitor } from './PerformanceMonitor.js';
import { userPreferences } from './UserPreferences.js';

class AgeCalculatorApp {
  constructor() {
    this.ageCalculator = null; // Will be created when needed
    this.uiManager = new UIManager();
    this.themeManager = new ThemeManager();
    this.currentTab = 'input';
    this.initializeApp();
  }

  initializeApp() {
    // Wrap initialization in error boundary
    const safeInit = ErrorHandler.createBoundaryWrapper(
      this._initializeApp.bind(this), 
      'App Initialization'
    );
    safeInit();
  }

  _initializeApp() {
    // Apply user preferences
    userPreferences.applyPreferences();
    
    // Setup event listeners
    this.setupEventListeners();
    this.initializeTabs();
    this.setupKeyboardShortcuts();
    this.setupExportFunctionality();
    this.focusFirstInput();
    
    // Setup enhanced validation
    this.setupEnhancedValidation();
    
    // Listen for preference changes
    window.addEventListener('preferencesChanged', (e) => {
      this.onPreferencesChanged(e.detail);
    });
  }

  setupEnhancedValidation() {
    // Real-time validation for manual inputs
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');

    if (dayInput) {
      const dayValidator = ValidationHelper.createValidator('day');
      dayInput.addEventListener('input', (e) => {
        const result = dayValidator(e.target.value);
        this.showFieldValidation(e.target, result);
      });
    }

    if (monthInput) {
      const monthValidator = ValidationHelper.createValidator('month');
      monthInput.addEventListener('input', (e) => {
        const result = monthValidator(e.target.value);
        this.showFieldValidation(e.target, result);
      });
    }

    if (yearInput) {
      const yearValidator = ValidationHelper.createValidator('year');
      yearInput.addEventListener('input', (e) => {
        const result = yearValidator(e.target.value);
        this.showFieldValidation(e.target, result);
      });
    }

    // Date picker validation
    const birthdateInput = document.getElementById('birthdate');
    if (birthdateInput) {
      birthdateInput.addEventListener('input', (e) => {
        const errors = ValidationHelper.validateDateString(e.target.value);
        const result = { 
          valid: errors.length === 0, 
          message: errors.join(', ') 
        };
        this.showFieldValidation(e.target, result);
      });
    }
  }

  showFieldValidation(field, result) {
    // Remove existing validation styling
    field.classList.remove('field-error', 'field-success');
    
    // Remove existing validation message
    const existingMessage = field.parentNode.querySelector('.validation-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    if (!field.value) {
      return; // Don't show validation for empty fields
    }

    if (result.valid) {
      field.classList.add('field-success');
    } else {
      field.classList.add('field-error');
      
      if (result.message) {
        const message = document.createElement('div');
        message.className = 'validation-message';
        message.textContent = result.message;
        message.style.cssText = `
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        `;
        field.parentNode.appendChild(message);
      }
    }
  }

  onPreferencesChanged(preferences) {
    // Handle auto-calculate preference
    if (preferences.autoCalculate) {
      this.setupAutoCalculation();
    } else {
      this.removeAutoCalculation();
    }
    
    // Handle input method preference
    this.switchInputMethod(preferences.inputMethod);
    
    // Handle animation preferences
    if (!preferences.showAnimations) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    } else {
      document.documentElement.style.removeProperty('--transition-fast');
      document.documentElement.style.removeProperty('--transition');
      document.documentElement.style.removeProperty('--transition-slow');
    }
  }

  setupAutoCalculation() {
    const inputs = document.querySelectorAll('#day, #month, #year, #birthdate');
    inputs.forEach(input => {
      input.addEventListener('input', this.debounce(this.tryAutoCalculate.bind(this), 1000));
    });
  }

  removeAutoCalculation() {
    const inputs = document.querySelectorAll('#day, #month, #year, #birthdate');
    inputs.forEach(input => {
      input.removeEventListener('input', this.tryAutoCalculate);
    });
  }

  tryAutoCalculate() {
    const manualInput = document.getElementById('manual-input');
    const isManualActive = manualInput && manualInput.classList.contains('active');
    
    try {
      if (isManualActive) {
        const day = parseInt(document.getElementById('day').value);
        const month = parseInt(document.getElementById('month').value);
        const year = parseInt(document.getElementById('year').value);
        
        if (day && month && year) {
          const errors = ValidationHelper.validateDateRange(day, month, year);
          if (errors.length === 0) {
            this.handleFormSubmit(new Event('submit'));
          }
        }
      } else {
        const birthdateValue = document.getElementById('birthdate').value;
        if (birthdateValue) {
          const errors = ValidationHelper.validateDateString(birthdateValue);
          if (errors.length === 0) {
            this.handleFormSubmit(new Event('submit'));
          }
        }
      }
    } catch (error) {
      // Silently fail for auto-calculation
      console.debug('Auto-calculation failed:', error);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  setupEventListeners() {
    // Form submission - using calculate button instead of form
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', (e) => this.handleFormSubmit(e));
    }

    // Tab switching - using existing tab buttons
    const tabButtons = document.querySelectorAll('.toggle-btn');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const method = e.target.textContent.toLowerCase().includes('manual') ? 'manual' : 'picker';
        this.switchInputMethod(method);
      });
    });

    // Theme toggle is handled by ThemeManager itself
    // No need to add duplicate event listener here

    // Input method specific handlers
    this.setupBirthdateInput();
    this.setupAgeInput();

    // Share functionality - using existing share button
    const shareButton = document.getElementById('share-btn');
    if (shareButton) {
      shareButton.addEventListener('click', () => this.copyToClipboard());
    }
  }

  setupBirthdateInput() {
    const birthdateInput = document.getElementById('birthdate');
    
    if (birthdateInput) {
      // Auto-focus and validation
      birthdateInput.addEventListener('input', (e) => {
        this.uiManager.hideError();
        this.validateBirthdate(e.target.value);
      });

      birthdateInput.addEventListener('blur', (e) => {
        this.validateBirthdate(e.target.value, true);
      });

      // Set max date to today
      const today = new Date().toISOString().split('T')[0];
      birthdateInput.max = today;
    }
  }

  setupAgeInput() {
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');

    [dayInput, monthInput, yearInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.uiManager.hideError();
          // Don't validate on input - only on blur or submit
        });
        
        input.addEventListener('blur', () => {
          // Only validate if user has finished typing (blur event)
          this.validateCurrentInputs();
        });
      }
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to calculate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.handleFormSubmit(e);
      }
      
      // Escape to clear
      if (e.key === 'Escape') {
        this.clearForm();
      }

      // Tab navigation enhancement
      if (e.key === 'Tab' && e.target.classList.contains('tab-button')) {
        e.preventDefault();
        const tabs = Array.from(document.querySelectorAll('.tab-button'));
        const currentIndex = tabs.indexOf(e.target);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length;
        
        tabs[nextIndex].click();
        tabs[nextIndex].focus();
      }
    });
  }

  setupExportFunctionality() {
    const exportButton = document.getElementById('export-btn');
    if (exportButton) {
      exportButton.addEventListener('click', async () => {
        try {
          const blob = await this.uiManager.generateShareableImage();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `my-age-${new Date().getTime()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          
          this.showNotification('Image exported successfully! 📸');
        } catch (error) {
          this.showNotification('Export failed. Please try again.', 'error');
        }
      });
    }
  }

  initializeTabs() {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      if (tab.id !== 'input-tab') {
        tab.style.display = 'none';
      }
    });
  }

  switchTab(tabName) {
    // Handle the manual/picker input method switching from HTML
    if (tabName === 'manual' || tabName === 'picker') {
      // Update tab buttons
      document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      // Activate correct button
      const activeButton = document.getElementById(`${tabName}-tab`);
      if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
      }

      // Update tab content
      document.querySelectorAll('.input-method').forEach(content => {
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
      });
      
      const activeTab = document.getElementById(`${tabName}-input`);
      if (activeTab) {
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-hidden', 'false');
      }
      
      this.currentTab = tabName;
      
      // Focus first interactive element in new tab
      setTimeout(() => {
        const firstInput = activeTab?.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
      
      return;
    }

    // Original tab switching logic for other tabs
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabButton) {
      tabButton.classList.add('active');
      tabButton.setAttribute('aria-selected', 'true');
    }

    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
      content.setAttribute('aria-hidden', 'true');
    });
    
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
      activeTab.style.display = 'block';
      activeTab.setAttribute('aria-hidden', 'false');
    }
    
    this.currentTab = tabName;
    
    // Focus first interactive element in new tab
    setTimeout(() => {
      const firstInput = activeTab?.querySelector('input, button');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    this.uiManager.hideError();

    // Wrap calculation in error boundary and performance monitoring
    const safeCalculate = ErrorHandler.createBoundaryWrapper(
      this._performCalculation.bind(this),
      'Age Calculation'
    );

    await safeCalculate();
  }

  async _performCalculation() {
    let birthDate;
    
    // Check which input method is active
    const manualInput = document.getElementById('manual-input');
    const isManualActive = manualInput && manualInput.classList.contains('active');
    
    if (isManualActive) {
      // Manual input method with enhanced validation
      const day = parseInt(document.getElementById('day').value) || 0;
      const month = parseInt(document.getElementById('month').value) || 0;
      const year = parseInt(document.getElementById('year').value) || 0;
      
      if (!day || !month || !year) {
        throw new Error('Please fill in all date fields.');
      }
      
      // Validate using enhanced validation
      const validationErrors = ValidationHelper.validateDateRange(day, month, year);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }
      
      birthDate = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      // Date picker method
      const birthdateValue = document.getElementById('birthdate').value;
      if (!birthdateValue) {
        throw new Error('Please enter your birth date.');
      }
      
      const validationErrors = ValidationHelper.validateDateString(birthdateValue);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }
      
      birthDate = new Date(birthdateValue);
    }

    // Show loading state
    this.showLoadingState();

    // Calculate age with performance monitoring and slight delay for loading effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a new AgeCalculator instance with the birth date
    let day, month, year;
    
    if (isManualActive) {
      day = parseInt(document.getElementById('day').value);
      month = parseInt(document.getElementById('month').value);
      year = parseInt(document.getElementById('year').value);
    } else {
      day = birthDate.getDate();
      month = birthDate.getMonth() + 1; // Convert from 0-indexed to 1-indexed
      year = birthDate.getFullYear();
    }
    
    this.ageCalculator = new AgeCalculator(day, month, year);
    
    // Wrap calculation in performance monitoring
    const timedCalculate = performanceMonitor.timeCalculation(
      this.ageCalculator.calculate.bind(this.ageCalculator)
    );
    const result = timedCalculate();
    
    // Generate enhanced content using the calculator's methods
    const stats = this.ageCalculator.getStats();
    const funFacts = this.ageCalculator.getFunFacts();
    
    // Display results with all new features (check user preferences)
    const preferences = userPreferences.preferences;
    this.uiManager.displayResults(
      result.years, 
      result.months, 
      result.days, 
      preferences.showStatistics ? stats : [],
      preferences.showFunFacts ? funFacts : [],
      this.ageCalculator,
      preferences
    );

    this.hideLoadingState();
    
    if (preferences.showNotifications) {
      this.showNotification('Age calculated successfully! 🎉');
    }
    
    // Announce to screen readers if accessibility is enabled
    if (preferences.accessibility.announceResults) {
      this.announceResults(result);
    }
  }

  showLoadingState() {
    const submitBtn = document.querySelector('.calculate-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Calculating...';
    }
  }

  hideLoadingState() {
    const submitBtn = document.querySelector('.calculate-btn');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Calculate My Age
      `;
    }
  }

  generateEnhancedStats(result) {
    return [
      { icon: 'calendar', number: result.totalDays.toLocaleString(), label: 'Total Days Lived' },
      { icon: 'clock', number: result.totalHours.toLocaleString(), label: 'Total Hours' },
      { icon: 'timer', number: result.totalMinutes.toLocaleString(), label: 'Total Minutes' },
      { icon: 'heart', number: result.heartbeats.toLocaleString(), label: 'Heartbeats' },
      { icon: 'wind', number: result.breaths.toLocaleString(), label: 'Breaths Taken' },
      { icon: 'cake', number: result.birthdaysPassed, label: 'Birthdays Celebrated' }
    ];
  }

  generateEnhancedFunFacts(result) {
    const facts = [
      `🌍 You've experienced ${result.birthdaysPassed} trips around the sun!`,
      `⏰ You've lived through ${Math.floor(result.totalDays / 7).toLocaleString()} weeks`,
      `🌙 You've seen approximately ${Math.floor(result.totalDays / 29.5).toLocaleString()} full moon cycles`,
      `📚 If you read for 1 hour daily, you've read for ${Math.floor(result.totalDays).toLocaleString()} hours!`,
      `🎬 You could have watched ${Math.floor(result.totalHours / 2).toLocaleString()} movies (2h each)`,
      `☕ Enough time to drink ${Math.floor(result.totalDays * 2).toLocaleString()} cups of coffee`
    ];

    return facts.slice(0, 4); // Show 4 facts
  }

  validateBirthdate(value, showError = false) {
    if (!value) return false;
    
    const date = new Date(value);
    const today = new Date();
    
    if (date > today) {
      if (showError) {
        this.uiManager.showError('Birth date cannot be in the future.');
      }
      return false;
    }
    
    return true;
  }

  validateAgeInputs() {
    const yearsInput = document.getElementById('age-years');
    const monthsInput = document.getElementById('age-months');
    const daysInput = document.getElementById('age-days');
    
    // Return true if elements don't exist (no validation needed)
    if (!yearsInput || !monthsInput || !daysInput) {
      return true;
    }
    
    const years = parseInt(yearsInput.value) || 0;
    const months = parseInt(monthsInput.value) || 0;
    const days = parseInt(daysInput.value) || 0;
    
    if (years > 150) {
      this.uiManager.showError('Age seems unrealistic. Please check your input.');
      return false;
    }
    
    return true;
  }

  validateCurrentInputs() {
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    
    if (dayInput && monthInput && yearInput) {
      const day = parseInt(dayInput.value) || 0;
      const month = parseInt(monthInput.value) || 0;
      const year = parseInt(yearInput.value) || 0;
      
      // Only validate if all fields have values
      if (day && month && year && yearInput.value.length >= 4) {
        // Basic validation
        if (day < 1 || day > 31) {
          this.uiManager.showError('Day must be between 1 and 31.');
          return false;
        }
        if (month < 1 || month > 12) {
          this.uiManager.showError('Month must be between 1 and 12.');
          return false;
        }
        if (year < 1900 || year > new Date().getFullYear()) {
          this.uiManager.showError('Please enter a valid year.');
          return false;
        }
      }
    }
    
    return true;
  }

  switchInputMethod(method) {
    const manualInput = document.getElementById('manual-input');
    const pickerInput = document.getElementById('picker-input');
    const tabs = document.querySelectorAll('.toggle-btn');
    
    if (method === 'manual') {
      manualInput?.classList.add('active');
      pickerInput?.classList.remove('active');
      tabs[0]?.setAttribute('aria-selected', 'true');
      tabs[1]?.setAttribute('aria-selected', 'false');
    } else {
      manualInput?.classList.remove('active');
      pickerInput?.classList.add('active');
      tabs[0]?.setAttribute('aria-selected', 'false');
      tabs[1]?.setAttribute('aria-selected', 'true');
    }
  }

  clearForm() {
    // Clear all inputs manually since we don't have a form element
    const inputs = ['day', 'month', 'year', 'birthdate'];
    inputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.value = '';
        // Remove validation classes
        input.classList.remove('field-error', 'field-success');
      }
    });
    
    // Hide results and errors
    this.uiManager.hideError();
    const resultsElement = document.getElementById('results');
    if (resultsElement) {
      resultsElement.classList.remove('show');
    }
    
    // Focus first input
    this.focusFirstInput();
    
    this.showNotification('Form cleared! ✨');
  }

  focusFirstInput() {
    const firstInput = document.querySelector('.tab-content:not([style*="none"]) input');
    if (firstInput) firstInput.focus();
  }

  async copyToClipboard() {
    const years = document.getElementById('years')?.textContent || '0';
    const months = document.getElementById('months')?.textContent || '0';
    const days = document.getElementById('days')?.textContent || '0';
    
    const shareText = `🎂 I'm ${years} years, ${months} months, and ${days} days old! 
Calculated with Elizabeth Stein's Age Calculator ✨`;

    try {
      await navigator.clipboard.writeText(shareText);
      this.showNotification('Copied to clipboard! 📋');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('Copied to clipboard! 📋');
    }
  }

  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  announceResults(result) {
    const announcement = `Age calculation complete. You are ${result.years} years, ${result.months} months, and ${result.days} days old.`;
    
    // Create screen reader announcement
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;
    
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  }
}

// Initialize the application when DOM is loaded
// Global app instance
let ageCalculatorApp;

document.addEventListener('DOMContentLoaded', () => {
  ageCalculatorApp = new AgeCalculatorApp();
  // Make globally accessible for debugging
  window.ageCalculatorApp = ageCalculatorApp;
});

// Global functions for HTML onclick handlers
window.calculateAge = function() {
  if (ageCalculatorApp) {
    ageCalculatorApp.handleFormSubmit(new Event('submit'));
  }
};

window.shareResults = function() {
  if (ageCalculatorApp) {
    ageCalculatorApp.copyToClipboard();
  }
};

window.switchInputMethod = function(method) {
  if (ageCalculatorApp) {
    ageCalculatorApp.switchTab(method);
  }
};