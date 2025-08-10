// Accessibility enhancement utilities
export class AccessibilityHelper {
  static announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
      position: absolute !important;
      left: -10000px !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
      clip: rect(1px, 1px, 1px, 1px) !important;
    `;
    
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  static trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  static enhanceFormAccessibility() {
    // Add ARIA descriptions to inputs
    const inputs = document.querySelectorAll('input[type="number"], input[type="date"]');
    inputs.forEach(input => {
      if (!input.getAttribute('aria-describedby')) {
        const errorId = input.id + '-error';
        input.setAttribute('aria-describedby', errorId);
      }
    });

    // Enhance error messaging
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.setAttribute('role', 'status');
      errorElement.setAttribute('aria-atomic', 'true');
    }
  }

  static addKeyboardNavigation() {
    // Add keyboard shortcuts help
    const helpText = document.createElement('div');
    helpText.className = 'keyboard-help';
    helpText.innerHTML = `
      <details>
        <summary>Keyboard Shortcuts</summary>
        <dl>
          <dt>Ctrl/Cmd + D</dt><dd>Toggle theme</dd>
          <dt>Ctrl/Cmd + Enter</dt><dd>Calculate age</dd>
          <dt>Escape</dt><dd>Clear form</dd>
        </dl>
      </details>
    `;
    
    const main = document.querySelector('main');
    if (main) {
      main.appendChild(helpText);
    }
  }
}
