// ThemeManager.test.js
// Example: You can mock DOM and localStorage for ThemeManager tests
import ThemeManager from './ThemeManager.js';

describe('ThemeManager', () => {
  beforeEach(() => {
    document.body.innerHTML = '<button class="theme-toggle"></button>';
    localStorage.clear();
  });

  it('toggles dark mode', () => {
    const theme = new ThemeManager();
    theme.toggleTheme();
    expect(document.body.classList.contains('dark-mode')).toBe(true);
    theme.toggleTheme();
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });
});
