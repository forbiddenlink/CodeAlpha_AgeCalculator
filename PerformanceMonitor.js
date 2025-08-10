// Performance monitoring utility
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      calculations: 0,
      averageCalculationTime: 0
    };
    this.calculationTimes = [];
    this.init();
  }

  init() {
    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor page load performance
    this.monitorPageLoad();
    
    // Monitor long tasks
    this.observeLongTasks();
  }

  observeWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint = lastEntry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Cumulative Layout Shift
    let cumulativeScore = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          cumulativeScore += entry.value;
        }
      }
      this.metrics.cumulativeLayoutShift = cumulativeScore;
    }).observe({ type: 'layout-shift', buffered: true });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
      }
    }).observe({ type: 'first-input', buffered: true });
  }

  monitorPageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
    });
  }

  observeLongTasks() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      }
    }).observe({ type: 'longtask', buffered: true });
  }

  // Time age calculation performance
  timeCalculation(calculationFn) {
    return (...args) => {
      const start = performance.now();
      const result = calculationFn(...args);
      const end = performance.now();
      
      const duration = end - start;
      this.calculationTimes.push(duration);
      this.metrics.calculations++;
      
      // Calculate rolling average
      if (this.calculationTimes.length > 100) {
        this.calculationTimes.shift(); // Keep only last 100 calculations
      }
      
      this.metrics.averageCalculationTime = 
        this.calculationTimes.reduce((sum, time) => sum + time, 0) / 
        this.calculationTimes.length;
      
      // Log slow calculations
      if (duration > 10) {
        console.warn(`Slow calculation detected: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    };
  }

  // Get performance report
  getReport() {
    return {
      ...this.metrics,
      recommendations: this.getRecommendations(),
      timestamp: new Date().toISOString()
    };
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.metrics.firstContentfulPaint > 2000) {
      recommendations.push('Consider optimizing CSS and JavaScript loading for faster FCP');
    }
    
    if (this.metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize images and defer non-critical resources for better LCP');
    }
    
    if (this.metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Reduce layout shifts by adding size attributes to images and containers');
    }
    
    if (this.metrics.firstInputDelay > 100) {
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }
    
    if (this.metrics.averageCalculationTime > 5) {
      recommendations.push('Optimize age calculation algorithms');
    }
    
    return recommendations;
  }

  // Display performance dashboard (for development)
  showDashboard() {
    if (process.env.NODE_ENV !== 'development') return;
    
    const dashboard = document.createElement('div');
    dashboard.id = 'performance-dashboard';
    dashboard.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-width: 300px;
      ">
        <h4>Performance Metrics</h4>
        <div>FCP: ${this.metrics.firstContentfulPaint.toFixed(0)}ms</div>
        <div>LCP: ${this.metrics.largestContentfulPaint.toFixed(0)}ms</div>
        <div>CLS: ${this.metrics.cumulativeLayoutShift.toFixed(3)}</div>
        <div>FID: ${this.metrics.firstInputDelay.toFixed(0)}ms</div>
        <div>Avg Calc: ${this.metrics.averageCalculationTime.toFixed(2)}ms</div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #ff4444;
          border: none;
          color: white;
          padding: 5px;
          border-radius: 3px;
          cursor: pointer;
          margin-top: 10px;
        ">Close</button>
      </div>
    `;
    
    document.body.appendChild(dashboard);
  }
}

// Initialize performance monitoring
export const performanceMonitor = new PerformanceMonitor();

// Add keyboard shortcut to show dashboard in development
if (process.env.NODE_ENV === 'development') {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      performanceMonitor.showDashboard();
    }
  });
}
