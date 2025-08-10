// UIManager.js
export default class UIManager {
  constructor() {
    this.errorElement = document.getElementById('error-message');
    this.resultsElement = document.getElementById('results');
    this.statsContainer = document.getElementById('stats-grid');
    this.funFactsContainer = document.getElementById('fun-facts');
  }

  showError(message) {
    this.errorElement.textContent = message;
    this.errorElement.style.display = 'block';
    this.errorElement.setAttribute('aria-live', 'assertive');
    this.errorElement.setAttribute('role', 'alert');
    this.errorElement.tabIndex = -1;
    this.errorElement.focus();
  }

  hideError() {
    this.errorElement.style.display = 'none';
    this.errorElement.removeAttribute('aria-live');
    this.errorElement.removeAttribute('role');
    this.errorElement.removeAttribute('tabindex');
  }

  displayResults(years, months, days, stats, funFacts) {
    this.animateNumber('years', years);
    this.animateNumber('months', months);
    this.animateNumber('days', days);
    this.generateStats(stats);
    this.generateFunFacts(funFacts);
    this.resultsElement.classList.add('show');
    this.resultsElement.setAttribute('aria-live', 'polite');
    this.resultsElement.setAttribute('role', 'region');
  }

  animateNumber(elementId, finalValue) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
      element.textContent = currentValue;
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    requestAnimationFrame(updateNumber);
  }

  generateStats(stats) {
    this.statsContainer.innerHTML = stats.map(stat =>
      `<div class="stat-card" data-icon="${stat.icon}">
        <span class="stat-icon"></span>
        <span class="stat-number">${stat.number}</span>
        <div class="stat-label">${stat.label}</div>
      </div>`
    ).join('');
  }

  generateFunFacts(facts) {
    this.funFactsContainer.innerHTML = `
      <div class="fun-facts-title">🎯 Fun Facts About You</div>
      <div class="fun-facts-grid">
        ${facts.map(fact => `<div class="fun-fact">${fact}</div>`).join('')}
      </div>
    `;
  }
}
