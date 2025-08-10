// ThemeManager.js - Enhanced theme management
export default class ThemeManager {
  constructor() {
    this.isDarkMode = this.getInitialTheme();
    this.themeToggle = document.querySelector('.theme-toggle');
    this.themeIcon = document.getElementById('theme-icon');
    this.initializeTheme();
    this.setupEventListeners();
  }

  getInitialTheme() {
    // Check localStorage first
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    
    return false; // Default to light theme
  }

  initializeTheme() {
    // Apply theme to root element for CSS custom properties
    const root = document.documentElement;
    
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      root.classList.add('dark');
      this.updateThemeIcon('☀️', 'Switch to light theme');
    } else {
      document.body.classList.remove('dark-mode');
      root.classList.remove('dark');
      this.updateThemeIcon('🌙', 'Switch to dark theme');
    }
  }

  updateThemeIcon(icon, ariaLabel) {
    if (this.themeIcon) {
      this.themeIcon.textContent = icon;
    }
    if (this.themeToggle) {
      this.themeToggle.setAttribute('aria-label', ariaLabel);
      this.themeToggle.setAttribute('title', ariaLabel);
    }
  }

  setupEventListeners() {
    // Theme toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (localStorage.getItem('darkMode') === null) {
          this.isDarkMode = e.matches;
          this.applyTheme();
        }
      });
    }

    // Listen for keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveThemePreference();
    this.announceThemeChange();
  }

  applyTheme() {
    const root = document.documentElement;
    const body = document.body;
    
    // Add transition for smooth theme switching
    body.style.transition = 'background 0.3s ease, color 0.3s ease';
    
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
      root.classList.add('dark');
      this.updateThemeIcon('☀️', 'Switch to light theme');
    } else {
      body.classList.remove('dark-mode');
      root.classList.remove('dark');
      this.updateThemeIcon('🌙', 'Switch to dark theme');
    }
    
    // Remove transition after animation
    setTimeout(() => {
      body.style.transition = '';
    }, 300);

    // Update any theme-dependent elements
    this.updateThemeDependentElements();
  }

  updateThemeDependentElements() {
    // Update locale dropdown styling
    const dropdown = document.getElementById('locale-override');
    if (dropdown) {
      if (this.isDarkMode) {
        dropdown.style.background = '#1e293b';
        dropdown.style.color = '#f1f5f9';
        dropdown.style.border = '1.5px solid #475569';
      } else {
        dropdown.style.background = '#f7fafc';
        dropdown.style.color = '#2d3748';
        dropdown.style.border = '1.5px solid #a0aec0';
      }
    }

    // Update any dynamic content that needs theme awareness
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notif => {
      // Notifications maintain their color but might need border adjustments
      if (this.isDarkMode) {
        notif.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      } else {
        notif.style.border = 'none';
      }
    });
  }

  saveThemePreference() {
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  announceThemeChange() {
    // Create accessible announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    announcement.textContent = `Switched to ${this.isDarkMode ? 'dark' : 'light'} theme`;
    
    document.body.appendChild(announcement);
    
    // Remove announcement after screen reader has had time to announce it
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.isDarkMode ? 'dark' : 'light';
  }

  // Public method to set theme programmatically
  setTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      this.isDarkMode = theme === 'dark';
      this.applyTheme();
      this.saveThemePreference();
    }
  }
}
