// Centralized error handling utility
export class ErrorHandler {
  static handleError(error, context = 'Unknown') {
    console.error(`[${context}] Error:`, error);
    
    // User-friendly error messages
    const userMessage = this.getUserFriendlyMessage(error);
    
    // Show notification to user
    this.showErrorNotification(userMessage);
    
    // Log for analytics (in production, send to logging service)
    this.logError(error, context);
    
    return userMessage;
  }

  static getUserFriendlyMessage(error) {
    const errorMap = {
      'TypeError': 'Something went wrong with the calculation. Please try again.',
      'RangeError': 'Please enter a valid date within the supported range.',
      'ValidationError': 'Please check your input and try again.',
      'NetworkError': 'Please check your internet connection and try again.'
    };

    const errorType = error.constructor.name;
    return errorMap[errorType] || 'An unexpected error occurred. Please refresh the page and try again.';
  }

  static showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
      zIndex: '9999',
      maxWidth: '300px',
      animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  static logError(error, context) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error logged:', errorLog);
      return;
    }
    
    // In production, you'd send this to a logging service
    // Example: sendToLoggingService(errorLog);
  }

  static createBoundaryWrapper(fn, context) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        return this.handleError(error, context);
      }
    };
  }
}

// CSS for error notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .error-notification .error-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .error-notification .error-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
  }
`;
document.head.appendChild(style);
