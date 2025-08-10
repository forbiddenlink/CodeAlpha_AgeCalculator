// ThemeManager.js
export default class ThemeManager {
  constructor() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.themeToggle = document.querySelector('.theme-toggle');
    this.initializeTheme();
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  initializeTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      this.themeToggle.textContent = '☀️';
    } else {
      document.body.classList.remove('dark-mode');
      this.themeToggle.textContent = '🌙';
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    this.themeToggle.textContent = this.isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', this.isDarkMode);
    document.body.style.transition = 'background 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }
}
