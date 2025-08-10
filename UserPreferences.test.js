// UserPreferences.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock browser APIs BEFORE importing UserPreferences
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock navigator
Object.defineProperty(navigator, 'language', {
  value: 'en-US',
  writable: true
});

// Now import UserPreferences after mocks are set up
import { UserPreferences } from './UserPreferences.js';

describe('UserPreferences', () => {
  let preferences;

  beforeEach(() => {
    document.body.innerHTML = '';
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    preferences = new UserPreferences();
  });

  afterEach(() => {
    document.querySelectorAll('.settings-button, .settings-modal').forEach(el => el.remove());
  });

  describe('Initialization', () => {
    it('loads default preferences when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const prefs = new UserPreferences();
      
      expect(prefs.get('theme')).toBe('auto');
      expect(prefs.get('inputMethod')).toBe('manual');
      expect(prefs.get('showNotifications')).toBe(true);
    });

    it('loads saved preferences from localStorage', () => {
      const savedPrefs = {
        theme: 'dark',
        inputMethod: 'picker',
        showNotifications: false
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPrefs));
      
      const prefs = new UserPreferences();
      expect(prefs.get('theme')).toBe('dark');
      expect(prefs.get('inputMethod')).toBe('picker');
      expect(prefs.get('showNotifications')).toBe(false);
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      console.warn = vi.fn();
      
      const prefs = new UserPreferences();
      expect(prefs.get('theme')).toBe('auto'); // Should use defaults
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('Preference Management', () => {
    it('gets specific preferences', () => {
      expect(preferences.get('theme')).toBe('auto');
      expect(preferences.get('showFunFacts')).toBe(true);
    });

    it('sets specific preferences', () => {
      preferences.set('theme', 'dark');
      expect(preferences.get('theme')).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('updates multiple preferences at once', () => {
      const updates = {
        theme: 'light',
        showAnimations: false,
        autoCalculate: true
      };
      
      preferences.update(updates);
      expect(preferences.get('theme')).toBe('light');
      expect(preferences.get('showAnimations')).toBe(false);
      expect(preferences.get('autoCalculate')).toBe(true);
    });

    it('resets to default preferences', () => {
      preferences.set('theme', 'dark');
      preferences.set('showNotifications', false);
      
      preferences.reset();
      expect(preferences.get('theme')).toBe('auto');
      expect(preferences.get('showNotifications')).toBe(true);
    });
  });

  describe('Settings UI', () => {
    it('creates settings button in DOM', () => {
      expect(document.querySelector('.settings-button')).toBeTruthy();
    });

    it('shows settings modal when button is clicked', () => {
      const settingsButton = document.querySelector('.settings-button');
      settingsButton.click();
      
      expect(document.querySelector('.settings-modal')).toBeTruthy();
      expect(document.querySelector('.settings-content')).toBeTruthy();
    });

    it('closes modal on outside click', () => {
      const settingsButton = document.querySelector('.settings-button');
      settingsButton.click();
      
      const modal = document.querySelector('.settings-modal');
      modal.click(); // Click outside content
      
      // Should trigger close animation
      expect(modal.style.animation).toContain('fadeOut');
    });

    it('closes modal on Escape key', () => {
      const settingsButton = document.querySelector('.settings-button');
      settingsButton.click();
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      const modal = document.querySelector('.settings-modal');
      expect(modal.style.animation).toContain('fadeOut');
    });
  });

  describe('Preference Persistence', () => {
    it('saves preferences to localStorage', () => {
      preferences.set('theme', 'dark');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'agecalc-preferences',
        expect.stringContaining('"theme":"dark"')
      );
    });

    it('triggers preferences change event', () => {
      const eventSpy = vi.fn();
      window.addEventListener('preferencesChanged', eventSpy);
      
      preferences.set('theme', 'dark');
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ theme: 'dark' })
        })
      );
    });
  });

  describe('Settings Form Interaction', () => {
    beforeEach(() => {
      // Open settings modal
      const settingsButton = document.querySelector('.settings-button');
      settingsButton.click();
    });

    it('loads current values into form fields', () => {
      const themeSelect = document.querySelector('#theme-select');
      const animationsToggle = document.querySelector('#animations-toggle');
      
      expect(themeSelect.value).toBe(preferences.get('theme'));
      expect(animationsToggle.checked).toBe(preferences.get('showAnimations'));
    });

    it('saves settings from modal form', () => {
      const themeSelect = document.querySelector('#theme-select');
      const saveButton = document.querySelector('.save-settings');
      
      themeSelect.value = 'dark';
      saveButton.click();
      
      expect(preferences.get('theme')).toBe('dark');
    });

    it('resets settings when reset button is clicked', () => {
      preferences.set('theme', 'dark');
      
      const resetButton = document.querySelector('.reset-settings');
      resetButton.click();
      
      expect(preferences.get('theme')).toBe('auto');
    });
  });
});
