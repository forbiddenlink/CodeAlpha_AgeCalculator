// UIManager.js - Enhanced with new features
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
    
    // Add shake animation
    this.errorElement.style.animation = 'none';
    setTimeout(() => {
      this.errorElement.style.animation = 'shake 0.4s ease-in-out';
    }, 10);
  }

  hideError() {
    this.errorElement.style.display = 'none';
    this.errorElement.removeAttribute('aria-live');
    this.errorElement.removeAttribute('role');
    this.errorElement.removeAttribute('tabindex');
  }

  displayResults(years, months, days, stats, funFacts, calculator) {
    // Animate main age numbers
    this.animateNumber('years', years);
    this.animateNumber('months', months);
    this.animateNumber('days', days);
    
    // Generate all sections
    this.generateStats(stats);
    this.generateFunFacts(funFacts);
    this.generatePlanetaryAges(calculator);
    this.generateMilestones(calculator);
    this.generateHistoricalEvents(calculator);
    this.generateBirthDayInfo(calculator);
    
    // Show results with animation
    this.resultsElement.classList.add('show');
    this.resultsElement.setAttribute('aria-live', 'polite');
    this.resultsElement.setAttribute('role', 'region');
  }

  animateNumber(elementId, finalValue) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1200;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
      
      element.textContent = currentValue;
      
      // Add pulse effect on completion
      if (progress === 1) {
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 200);
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    requestAnimationFrame(updateNumber);
  }

  generateStats(stats) {
    this.statsContainer.innerHTML = stats.map((stat, index) =>
      `<div class="stat-card" data-icon="${stat.icon}" style="animation-delay: ${index * 0.1}s">
        <span class="stat-icon">${this.getIconForStat(stat.icon)}</span>
        <span class="stat-number">${stat.number}</span>
        <div class="stat-label">${stat.label}</div>
      </div>`
    ).join('');
  }

  generatePlanetaryAges(calculator) {
    const planetaryAges = calculator.calculatePlanetaryAges();
    const planetarySection = document.createElement('div');
    planetarySection.className = 'planetary-ages-section';
    planetarySection.innerHTML = `
      <h3 class="section-title">🪐 Your Age on Other Planets</h3>
      <div class="planetary-grid">
        ${Object.entries(planetaryAges).map(([planet, data], index) => `
          <div class="planet-card" style="animation-delay: ${index * 0.1}s">
            <div class="planet-icon">${this.getPlanetIcon(planet)}</div>
            <div class="planet-age">${data.years}</div>
            <div class="planet-name">${data.name}</div>
          </div>
        `).join('')}
      </div>
    `;
    
    this.funFactsContainer.appendChild(planetarySection);
  }

  generateMilestones(calculator) {
    const milestones = calculator.getNextMilestones();
    const milestonesSection = document.createElement('div');
    milestonesSection.className = 'milestones-section';
    milestonesSection.innerHTML = `
      <h3 class="section-title">🎯 Upcoming Milestones</h3>
      <div class="milestones-grid">
        ${milestones.map((milestone, index) => `
          <div class="milestone-card ${milestone.type}" style="animation-delay: ${index * 0.1}s">
            <div class="milestone-icon">${this.getMilestoneIcon(milestone.type)}</div>
            <div class="milestone-age">${milestone.age}</div>
            <div class="milestone-days">${milestone.days} days</div>
            <div class="milestone-desc">${milestone.description}</div>
          </div>
        `).join('')}
      </div>
    `;
    
    this.funFactsContainer.appendChild(milestonesSection);
  }

  generateHistoricalEvents(calculator) {
    const events = calculator.getHistoricalEvents();
    const historySection = document.createElement('div');
    historySection.className = 'history-section';
    historySection.innerHTML = `
      <h3 class="section-title">📜 What Happened in ${calculator.year}</h3>
      <div class="history-grid">
        ${events.slice(0, 3).map((event, index) => `
          <div class="history-card" style="animation-delay: ${index * 0.15}s">
            <div class="history-icon">📅</div>
            <div class="history-text">${event}</div>
          </div>
        `).join('')}
      </div>
    `;
    
    this.funFactsContainer.appendChild(historySection);
  }

  generateBirthDayInfo(calculator) {
    const birthInfo = calculator.getBirthDayInfo();
    const birthInfoSection = document.createElement('div');
    birthInfoSection.className = 'birth-info-section';
    birthInfoSection.innerHTML = `
      <h3 class="section-title">🗓️ Birth Day Details</h3>
      <div class="birth-info-card">
        <div class="birth-date">
          <span class="birth-formatted">${birthInfo.formatted}</span>
          <span class="birth-weekend">${birthInfo.isWeekend ? '🎉 Weekend Baby!' : '📚 Weekday Born'}</span>
        </div>
      </div>
    `;
    
    this.funFactsContainer.appendChild(birthInfoSection);
  }

  generateFunFacts(facts) {
    const funFactsSection = document.createElement('div');
    funFactsSection.className = 'fun-facts-main';
    funFactsSection.innerHTML = `
      <div class="fun-facts-title">🎯 Fun Facts About You</div>
      <div class="fun-facts-grid">
        ${facts.map((fact, index) => `
          <div class="fun-fact" style="animation-delay: ${(index + 1) * 0.1}s">${fact}</div>
        `).join('')}
      </div>
    `;
    
    // Clear existing content and add new
    this.funFactsContainer.innerHTML = '';
    this.funFactsContainer.appendChild(funFactsSection);
  }

  // Helper methods for icons
  getIconForStat(iconType) {
    const icons = {
      calendar: '📅',
      chart: '📊',
      clock: '⏰',
      heart: '❤️',
      wind: '💨',
      cake: '🎂',
      timer: '⏱️'
    };
    return icons[iconType] || '📊';
  }

  getPlanetIcon(planet) {
    const icons = {
      mercury: '☿️',
      venus: '♀️',
      mars: '♂️',
      jupiter: '♃',
      saturn: '♄',
      uranus: '♅',
      neptune: '♆'
    };
    return icons[planet] || '🪐';
  }

  getMilestoneIcon(type) {
    const icons = {
      birthday: '🎂',
      decade: '🎊',
      major: '🏆'
    };
    return icons[type] || '🎯';
  }

  // Export functionality
  async generateShareableImage() {
    const years = document.getElementById('years').textContent;
    const months = document.getElementById('months').textContent;
    const days = document.getElementById('days').textContent;
    
    // Create a canvas to generate an image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎂 My Age Calculator', canvas.width / 2, 100);
    
    ctx.font = 'bold 72px Inter, Arial, sans-serif';
    ctx.fillText(`${years} Years`, canvas.width / 2, 220);
    ctx.fillText(`${months} Months`, canvas.width / 2, 320);
    ctx.fillText(`${days} Days`, canvas.width / 2, 420);
    
    ctx.font = 'normal 24px Inter, Arial, sans-serif';
    ctx.fillText('Built by Elizabeth Stein', canvas.width / 2, 550);
    
    // Convert to blob and download
    return new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png');
    });
  }
}
