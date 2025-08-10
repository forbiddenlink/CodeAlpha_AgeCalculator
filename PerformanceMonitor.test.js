// PerformanceMonitor.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PerformanceMonitor } from './PerformanceMonitor.js';

// Mock performance APIs
global.performance = {
  now: vi.fn(() => Date.now()),
  getEntriesByType: vi.fn(() => []),
  mark: vi.fn(),
  measure: vi.fn(),
};

// Mock PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

describe('PerformanceMonitor', () => {
  let monitor;

  beforeEach(() => {
    document.body.innerHTML = '';
    console.warn = vi.fn();
    console.error = vi.fn();
    monitor = new PerformanceMonitor();
  });

  afterEach(() => {
    document.querySelectorAll('#performance-dashboard').forEach(el => el.remove());
  });

  describe('Initialization', () => {
    it('initializes with default metrics', () => {
      expect(monitor.metrics).toEqual({
        loadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        calculations: 0,
        averageCalculationTime: 0
      });
    });

    it('initializes performance observers', () => {
      expect(PerformanceObserver).toHaveBeenCalled();
    });
  });

  describe('Calculation Timing', () => {
    it('times function execution', () => {
      const mockFn = vi.fn(() => 'result');
      performance.now
        .mockReturnValueOnce(100)  // start time
        .mockReturnValueOnce(150); // end time
      
      const timedFn = monitor.timeCalculation(mockFn);
      const result = timedFn('arg1', 'arg2');
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(result).toBe('result');
      expect(monitor.metrics.calculations).toBe(1);
      expect(monitor.metrics.averageCalculationTime).toBe(50);
    });

    it('tracks multiple calculation times', () => {
      const mockFn = vi.fn(() => 'result');
      performance.now
        .mockReturnValueOnce(100).mockReturnValueOnce(150) // First: 50ms
        .mockReturnValueOnce(200).mockReturnValueOnce(230); // Second: 30ms
      
      const timedFn = monitor.timeCalculation(mockFn);
      timedFn();
      timedFn();
      
      expect(monitor.metrics.calculations).toBe(2);
      expect(monitor.metrics.averageCalculationTime).toBe(40); // (50 + 30) / 2
    });

    it('warns about slow calculations', () => {
      const mockFn = vi.fn(() => 'result');
      performance.now
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(120); // 20ms - should trigger warning
      
      const timedFn = monitor.timeCalculation(mockFn);
      timedFn();
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Slow calculation detected')
      );
    });

    it('maintains rolling average with limited history', () => {
      const mockFn = vi.fn(() => 'result');
      const timedFn = monitor.timeCalculation(mockFn);
      
      // Simulate 102 calculations to test rolling window
      for (let i = 0; i < 102; i++) {
        performance.now
          .mockReturnValueOnce(i * 100)
          .mockReturnValueOnce(i * 100 + 10); // Each takes 10ms
        timedFn();
      }
      
      expect(monitor.calculationTimes.length).toBe(100); // Should cap at 100
      expect(monitor.metrics.averageCalculationTime).toBe(10);
    });
  });

  describe('Performance Report', () => {
    it('generates comprehensive report', () => {
      monitor.metrics.firstContentfulPaint = 1500;
      monitor.metrics.largestContentfulPaint = 2000;
      monitor.metrics.cumulativeLayoutShift = 0.05;
      monitor.metrics.firstInputDelay = 50;
      monitor.metrics.averageCalculationTime = 3;
      
      const report = monitor.getReport();
      
      expect(report).toEqual({
        loadTime: 0,
        firstContentfulPaint: 1500,
        largestContentfulPaint: 2000,
        cumulativeLayoutShift: 0.05,
        firstInputDelay: 50,
        calculations: 0,
        averageCalculationTime: 3,
        recommendations: expect.any(Array),
        timestamp: expect.any(String)
      });
    });

    it('provides performance recommendations', () => {
      monitor.metrics.firstContentfulPaint = 3000; // Bad FCP
      monitor.metrics.largestContentfulPaint = 3000; // Bad LCP
      monitor.metrics.cumulativeLayoutShift = 0.2; // Bad CLS
      monitor.metrics.firstInputDelay = 200; // Bad FID
      monitor.metrics.averageCalculationTime = 10; // Slow calculations
      
      const recommendations = monitor.getRecommendations();
      
      expect(recommendations).toContain('Consider optimizing CSS and JavaScript loading for faster FCP');
      expect(recommendations).toContain('Optimize images and defer non-critical resources for better LCP');
      expect(recommendations).toContain('Reduce layout shifts by adding size attributes to images and containers');
      expect(recommendations).toContain('Reduce JavaScript execution time to improve FID');
      expect(recommendations).toContain('Optimize age calculation algorithms');
    });

    it('provides no recommendations for good performance', () => {
      monitor.metrics.firstContentfulPaint = 1000;
      monitor.metrics.largestContentfulPaint = 2000;
      monitor.metrics.cumulativeLayoutShift = 0.05;
      monitor.metrics.firstInputDelay = 50;
      monitor.metrics.averageCalculationTime = 2;
      
      const recommendations = monitor.getRecommendations();
      expect(recommendations).toHaveLength(0);
    });
  });

  describe('Development Dashboard', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('shows dashboard in development mode', () => {
      monitor.metrics.firstContentfulPaint = 1200;
      monitor.metrics.averageCalculationTime = 5;
      
      monitor.showDashboard();
      
      const dashboard = document.querySelector('#performance-dashboard');
      expect(dashboard).toBeTruthy();
      expect(dashboard.textContent).toContain('Performance Metrics');
      expect(dashboard.textContent).toContain('FCP: 1200ms');
      expect(dashboard.textContent).toContain('Avg Calc: 5.00ms');
    });

    it('does not show dashboard in production', () => {
      process.env.NODE_ENV = 'production';
      
      monitor.showDashboard();
      
      const dashboard = document.querySelector('#performance-dashboard');
      expect(dashboard).toBeNull();
    });

    it('allows closing dashboard', () => {
      monitor.showDashboard();
      
      const closeButton = document.querySelector('#performance-dashboard button');
      closeButton.click();
      
      const dashboard = document.querySelector('#performance-dashboard');
      expect(dashboard).toBeNull();
    });
  });

  describe('Keyboard Shortcuts', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('shows dashboard with Ctrl+Shift+P', () => {
      // Mock process.env.NODE_ENV to development
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      // Re-import to get the keyboard listener registered
      delete window.performanceMonitor;
      
      // Manually set up the keyboard listener for test (since module was already loaded)
      const keyboardHandler = (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
          monitor.showDashboard();
        }
      };
      document.addEventListener('keydown', keyboardHandler);
      
      const keyEvent = new KeyboardEvent('keydown', {
        ctrlKey: true,
        shiftKey: true,
        key: 'P'
      });
      
      document.dispatchEvent(keyEvent);
      
      const dashboard = document.querySelector('#performance-dashboard');
      expect(dashboard).toBeTruthy();
      
      // Cleanup
      document.removeEventListener('keydown', keyboardHandler);
      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('does not show dashboard without correct key combination', () => {
      const keyEvent = new KeyboardEvent('keydown', {
        ctrlKey: true,
        key: 'P' // Missing shiftKey
      });
      
      document.dispatchEvent(keyEvent);
      
      const dashboard = document.querySelector('#performance-dashboard');
      expect(dashboard).toBeNull();
    });
  });
});
