// UIManager.test.js
// Example: You can mock DOM methods or use a library like jsdom for UIManager tests
import UIManager from './UIManager.js';

describe('UIManager', () => {
  it('shows and hides error messages', () => {
    document.body.innerHTML = '<div id="error-message"></div>';
    const ui = new UIManager();
    ui.showError('Test error');
    expect(document.getElementById('error-message').textContent).toBe('Test error');
    ui.hideError();
    expect(document.getElementById('error-message').style.display).toBe('none');
  });
});
