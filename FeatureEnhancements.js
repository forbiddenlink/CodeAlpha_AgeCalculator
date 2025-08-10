// Enhanced features for better user experience
export class FeatureEnhancements {
  
  // Progressive Web App capabilities
  static initializePWA() {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    
    // Install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showInstallButton(deferredPrompt);
    });
  }

  static showInstallButton(deferredPrompt) {
    const installButton = document.createElement('button');
    installButton.textContent = '📱 Install App';
    installButton.className = 'install-btn';
    installButton.addEventListener('click', async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installButton.style.display = 'none';
      }
      deferredPrompt = null;
    });
    
    document.querySelector('header').appendChild(installButton);
  }

  // Advanced sharing options
  static enhanceSharing() {
    return {
      async shareNative(data) {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'My Age Calculation',
              text: data.text,
              url: window.location.href
            });
            return true;
          } catch (err) {
            console.log('Native sharing failed:', err);
            return false;
          }
        }
        return false;
      },

      exportAsImage(data) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 400;
        
        // Create a beautiful age result image
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('My Age', canvas.width / 2, 80);
        
        ctx.font = '24px Inter, sans-serif';
        ctx.fillText(`${data.years} years, ${data.months} months, ${data.days} days`, 
                    canvas.width / 2, 200);
        
        // Download the image
        const link = document.createElement('a');
        link.download = 'my-age-calculation.png';
        link.href = canvas.toDataURL();
        link.click();
      },

      exportAsJSON(data) {
        const exportData = {
          ...data,
          calculatedAt: new Date().toISOString(),
          appVersion: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        });
        
        const link = document.createElement('a');
        link.download = 'age-calculation.json';
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    };
  }

  // Localization support
  static addLocalizationSupport() {
    const languages = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
      ru: 'Русский',
      zh: '中文',
      ja: '日本語',
      ko: '한국어'
    };

    const localeSelect = document.createElement('select');
    localeSelect.id = 'locale-select';
    localeSelect.className = 'locale-select';
    localeSelect.setAttribute('aria-label', 'Select language');
    
    Object.entries(languages).forEach(([code, name]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      if (code === navigator.language.slice(0, 2)) {
        option.selected = true;
      }
      localeSelect.appendChild(option);
    });

    localeSelect.addEventListener('change', (e) => {
      this.updateLocale(e.target.value);
    });

    document.querySelector('header').appendChild(localeSelect);
  }

  static updateLocale(locale) {
    // Store preference
    localStorage.setItem('preferred-locale', locale);
    
    // Update number formatting in existing results
    const numbers = document.querySelectorAll('[data-number]');
    numbers.forEach(el => {
      const value = parseFloat(el.dataset.number);
      if (!isNaN(value)) {
        el.textContent = value.toLocaleString(locale);
      }
    });
  }

  // Analytics and insights
  static addUsageAnalytics() {
    const analytics = {
      sessionStart: Date.now(),
      calculations: 0,
      features: {
        manualEntry: 0,
        datePicker: 0,
        sharing: 0,
        themeToggle: 0
      }
    };

    // Track feature usage
    window.addEventListener('beforeunload', () => {
      const sessionData = {
        ...analytics,
        sessionDuration: Date.now() - analytics.sessionStart
      };
      
      // Store in localStorage for simple analytics
      const existingData = JSON.parse(localStorage.getItem('usage-analytics') || '[]');
      existingData.push(sessionData);
      
      // Keep only last 30 sessions
      if (existingData.length > 30) {
        existingData.splice(0, existingData.length - 30);
      }
      
      localStorage.setItem('usage-analytics', JSON.stringify(existingData));
    });

    return analytics;
  }

  // Enhanced error recovery
  static addErrorRecovery() {
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      
      // Show user-friendly error message
      const notification = document.createElement('div');
      notification.className = 'error-notification';
      notification.innerHTML = `
        <div class="error-content">
          <h3>Something went wrong</h3>
          <p>The app encountered an error. Please refresh the page to continue.</p>
          <button onclick="window.location.reload()">Refresh Page</button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 10000);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    });
  }
}
