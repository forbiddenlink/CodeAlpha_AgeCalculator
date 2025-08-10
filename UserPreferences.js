// User preferences and settings manager
class UserPreferences {
  constructor() {
    this.preferences = this.loadPreferences();
    this.initializePreferences();
  }

  // Default preferences
  getDefaultPreferences() {
    return {
      theme: 'auto', // 'light', 'dark', or 'auto'
      inputMethod: 'manual', // 'manual' or 'picker'
      dateFormat: 'MM/DD/YYYY', // Various date formats
      language: navigator.language || 'en',
      showNotifications: true,
      showAnimations: typeof window !== 'undefined' && window.matchMedia ? 
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches : true,
      autoCalculate: false, // Calculate as user types
      showFunFacts: true,
      showPlanetaryAges: true,
      showStatistics: true,
      rememberLastInput: false, // Remember last entered date
      shareFormat: 'text', // 'text', 'image', 'json'
      accessibility: {
        announceResults: true,
        focusManagement: true,
        highContrast: false
      },
      analytics: {
        allowTracking: false, // GDPR compliance
        shareUsageData: false
      }
    };
  }

  // Load preferences from localStorage
  loadPreferences() {
    try {
      const stored = localStorage.getItem('agecalc-preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.getDefaultPreferences(), ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return this.getDefaultPreferences();
  }

  // Save preferences to localStorage
  savePreferences() {
    try {
      localStorage.setItem('agecalc-preferences', JSON.stringify(this.preferences));
      this.triggerPreferencesChange();
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  // Get a specific preference
  get(key) {
    return this.preferences[key];
  }

  // Set a specific preference
  set(key, value) {
    this.preferences[key] = value;
    this.savePreferences();
    return this;
  }

  // Update multiple preferences at once
  update(newPreferences) {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
    return this;
  }

  // Reset preferences to defaults
  reset() {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
    return this;
  }

  // Initialize preferences UI
  initializePreferences() {
    this.createSettingsPanel();
    this.applyPreferences();
  }

  // Apply current preferences to the UI
  applyPreferences() {
    // Apply theme
    if (this.preferences.theme !== 'auto') {
      document.documentElement.setAttribute('data-theme', this.preferences.theme);
    }

    // Apply animations preference
    if (!this.preferences.showAnimations) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }

    // Apply accessibility preferences
    if (this.preferences.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }

    // Apply input method preference
    const inputMethodToggle = document.querySelector('.toggle-group');
    if (inputMethodToggle) {
      const buttons = inputMethodToggle.querySelectorAll('.toggle-btn');
      buttons.forEach(btn => {
        const isManual = btn.textContent.toLowerCase().includes('manual');
        const shouldBeActive = (isManual && this.preferences.inputMethod === 'manual') ||
                              (!isManual && this.preferences.inputMethod === 'picker');
        btn.classList.toggle('active', shouldBeActive);
      });
    }
  }

  // Create settings panel
  createSettingsPanel() {
    const settingsButton = document.createElement('button');
    settingsButton.innerHTML = '⚙️';
    settingsButton.className = 'settings-button';
    settingsButton.title = 'Settings';
    settingsButton.setAttribute('aria-label', 'Open settings');
    
    // Style the settings button
    Object.assign(settingsButton.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '44px',
      height: '44px',
      border: 'none',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      zIndex: '1000',
      transition: 'all 0.2s ease'
    });

    settingsButton.addEventListener('click', () => this.showSettingsModal());
    document.body.appendChild(settingsButton);
  }

  // Show settings modal
  showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = this.getSettingsHTML();
    
    document.body.appendChild(modal);
    
    // Add event listeners
    this.setupSettingsEventListeners(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeSettingsModal(modal);
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeSettingsModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Generate settings HTML
  getSettingsHTML() {
    return `
      <div class="settings-content">
        <div class="settings-header">
          <h2>Settings</h2>
          <button class="close-settings" aria-label="Close settings">×</button>
        </div>
        
        <div class="settings-section">
          <h3>Appearance</h3>
          
          <div class="setting-item">
            <label for="theme-select">Theme</label>
            <select id="theme-select">
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input type="checkbox" id="animations-toggle">
              <span class="checkmark"></span>
              <span>Enable animations</span>
            </label>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Functionality</h3>
          
          <div class="setting-item">
            <label for="input-method-select">Default Input Method</label>
            <select id="input-method-select">
              <option value="manual">Manual Entry</option>
              <option value="picker">Date Picker</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input type="checkbox" id="auto-calculate-toggle">
              <span class="checkmark"></span>
              <span>Auto-calculate as I type</span>
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input type="checkbox" id="notifications-toggle">
              <span class="checkmark"></span>
              <span>Show notifications</span>
            </label>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Display Options</h3>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input type="checkbox" id="fun-facts-toggle">
              <span class="checkmark"></span>
              <span>Show fun facts</span>
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input type="checkbox" id="planetary-ages-toggle">
              <span class="checkmark"></span>
              <span>Show planetary ages</span>
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input type="checkbox" id="statistics-toggle">
              <span class="checkmark"></span>
              <span>Show detailed statistics</span>
            </label>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="reset-settings">Reset to Defaults</button>
          <button class="save-settings">Save Settings</button>
        </div>
      </div>
    `;
  }

  // Setup event listeners for settings
  setupSettingsEventListeners(modal) {
    // Load current values
    modal.querySelector('#theme-select').value = this.preferences.theme;
    modal.querySelector('#animations-toggle').checked = this.preferences.showAnimations;
    modal.querySelector('#input-method-select').value = this.preferences.inputMethod;
    modal.querySelector('#auto-calculate-toggle').checked = this.preferences.autoCalculate;
    modal.querySelector('#notifications-toggle').checked = this.preferences.showNotifications;
    modal.querySelector('#fun-facts-toggle').checked = this.preferences.showFunFacts;
    modal.querySelector('#planetary-ages-toggle').checked = this.preferences.showPlanetaryAges;
    modal.querySelector('#statistics-toggle').checked = this.preferences.showStatistics;

    // Close button
    modal.querySelector('.close-settings').addEventListener('click', () => {
      this.closeSettingsModal(modal);
    });

    // Reset button
    modal.querySelector('.reset-settings').addEventListener('click', () => {
      this.reset();
      this.closeSettingsModal(modal);
    });

    // Save button
    modal.querySelector('.save-settings').addEventListener('click', () => {
      this.saveSettingsFromModal(modal);
      this.closeSettingsModal(modal);
    });
  }

  // Save settings from modal
  saveSettingsFromModal(modal) {
    this.preferences.theme = modal.querySelector('#theme-select').value;
    this.preferences.showAnimations = modal.querySelector('#animations-toggle').checked;
    this.preferences.inputMethod = modal.querySelector('#input-method-select').value;
    this.preferences.autoCalculate = modal.querySelector('#auto-calculate-toggle').checked;
    this.preferences.showNotifications = modal.querySelector('#notifications-toggle').checked;
    this.preferences.showFunFacts = modal.querySelector('#fun-facts-toggle').checked;
    this.preferences.showPlanetaryAges = modal.querySelector('#planetary-ages-toggle').checked;
    this.preferences.showStatistics = modal.querySelector('#statistics-toggle').checked;

    this.savePreferences();
    this.applyPreferences();
  }

  // Close settings modal
  closeSettingsModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      if (modal.parentNode) {
        document.body.removeChild(modal);
      }
    }, 300);
  }

  // Trigger preferences change event
  triggerPreferencesChange() {
    window.dispatchEvent(new CustomEvent('preferencesChanged', {
      detail: this.preferences
    }));
  }

  // Export preferences
  exportPreferences() {
    const data = {
      preferences: this.preferences,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'age-calculator-preferences.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import preferences
  importPreferences(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.preferences) {
          this.preferences = { ...this.getDefaultPreferences(), ...data.preferences };
          this.savePreferences();
          this.applyPreferences();
        }
      } catch (error) {
        console.error('Failed to import preferences:', error);
      }
    };
    reader.readAsText(file);
  }
}

// Export the class and a function to get the instance
export { UserPreferences };

// Lazy initialization function
let userPreferencesInstance = null;
export function getUserPreferences() {
  if (!userPreferencesInstance) {
    userPreferencesInstance = new UserPreferences();
  }
  return userPreferencesInstance;
}

// For backwards compatibility, create instance when requested
export const userPreferences = getUserPreferences();
