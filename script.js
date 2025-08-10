// --- Locale Override Dropdown ---
const supportedLocales = [
    { code: 'en-US', label: 'English (US)', format: 'MM/DD/YYYY' },
    { code: 'en-GB', label: 'English (UK)', format: 'DD/MM/YYYY' },
    { code: 'de-DE', label: 'Deutsch (Deutschland)', format: 'DD.MM.YYYY' },
    { code: 'fr-FR', label: 'Français (France)', format: 'DD/MM/YYYY' },
    { code: 'es-ES', label: 'Español (España)', format: 'DD/MM/YYYY' },
    { code: 'pt-BR', label: 'Português (Brasil)', format: 'DD/MM/YYYY' },
    { code: 'zh-CN', label: '中文 (中国)', format: 'YYYY/MM/DD' },
    { code: 'ja-JP', label: '日本語 (日本)', format: 'YYYY/MM/DD' },
    { code: 'ko-KR', label: '한국어 (대한민국)', format: 'YYYY.MM.DD' },
    { code: 'en-CA', label: 'English (Canada)', format: 'YYYY-MM-DD' },
    { code: 'ar-SA', label: 'العربية (السعودية)', format: 'DD/MM/YYYY', rtl: true },
];

function createLocaleDropdown(selectedCode) {
    let dropdown = document.getElementById('locale-override');
    if (!dropdown) {
        dropdown = document.createElement('select');
        dropdown.id = 'locale-override';
        dropdown.setAttribute('aria-label', 'Select date format/locale');
        dropdown.style.marginBottom = '0.75rem';
        dropdown.style.fontSize = '1rem';
        dropdown.style.borderRadius = '10px';
        dropdown.style.padding = '0.5rem 1rem';
        dropdown.style.border = '1.5px solid #a0aec0';
        dropdown.style.background = 'var(--dropdown-bg, #f7fafc)';
        dropdown.style.color = 'var(--dropdown-color, #2d3748)';
        dropdown.style.fontWeight = '500';
        dropdown.style.boxShadow = '0 2px 8px rgba(102,126,234,0.07)';
        dropdown.style.transition = 'background 0.3s, color 0.3s';
        dropdown.style.outline = 'none';
        dropdown.style.width = '100%';
        dropdown.style.maxWidth = '350px';
        dropdown.style.display = 'block';
        dropdown.style.marginLeft = 'auto';
        dropdown.style.marginRight = 'auto';
        dropdown.addEventListener('focus', function() { this.style.borderColor = '#667eea'; });
        dropdown.addEventListener('blur', function() { this.style.borderColor = '#a0aec0'; });
        // Theme support
        if (document.body.classList.contains('dark-mode')) {
            dropdown.style.background = '#1e293b';
            dropdown.style.color = '#f1f5f9';
            dropdown.style.border = '1.5px solid #475569';
        }
        // Insert above manual input
        const manualInput = document.getElementById('manual-input');
        manualInput.parentElement.insertBefore(dropdown, manualInput);
    }
    dropdown.innerHTML = '';
    supportedLocales.forEach(loc => {
        const opt = document.createElement('option');
        opt.value = loc.code;
        opt.textContent = `${loc.label} — ${loc.format}`;
        if (loc.rtl) opt.dir = 'rtl';
        dropdown.appendChild(opt);
    });
    dropdown.value = selectedCode;
    dropdown.addEventListener('change', onLocaleOverrideChange);
}

function onLocaleOverrideChange(e) {
    const code = e.target.value;
    localStorage.setItem('ageCalcLocaleOverride', code);
    applyLocaleOverride(code);
}

function applyLocaleOverride(code) {
    const loc = supportedLocales.find(l => l.code === code);
    if (!loc) return;
    reorderManualInputs(loc.format);
    showFormatHint(loc.format);
    window._ageCalcLocaleFormat = loc.format;
    // RTL support
    const manualInput = document.getElementById('manual-input');
    if (loc.rtl) {
        manualInput.setAttribute('dir', 'rtl');
    } else {
        manualInput.removeAttribute('dir');
    }
}
// --- Locale Detection & Dynamic Format Hints ---
const localeFormatMap = {
    'en-US': 'MM/DD/YYYY',
    'en-CA': 'YYYY-MM-DD',
    'zh-CN': 'YYYY/MM/DD',
    'ja-JP': 'YYYY/MM/DD',
    'ko-KR': 'YYYY.MM.DD',
    'en-GB': 'DD/MM/YYYY',
    'fr-FR': 'DD/MM/YYYY',
    'de-DE': 'DD.MM.YYYY',
    'es-ES': 'DD/MM/YYYY',
    'pt-BR': 'DD/MM/YYYY',
    // fallback
    'default': 'DD/MM/YYYY'
};

function getUserLocale() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

function getDateFormat(locale) {
    // Try exact match, then language only, then default
    if (localeFormatMap[locale]) return localeFormatMap[locale];
    const lang = locale.split('-')[0];
    for (const key in localeFormatMap) {
        if (key.startsWith(lang)) return localeFormatMap[key];
    }
    return localeFormatMap['default'];
}

function reorderManualInputs(format) {
    const row = document.querySelector('#manual-input .input-row');
    if (!row) return;
    const day = document.getElementById('day').parentElement;
    const month = document.getElementById('month').parentElement;
    const year = document.getElementById('year').parentElement;
    // Remove all
    while (row.firstChild) row.removeChild(row.firstChild);
    // Reorder
    if (format.startsWith('DD')) {
        row.appendChild(day);
        row.appendChild(month);
        row.appendChild(year);
    } else if (format.startsWith('MM')) {
        row.appendChild(month);
        row.appendChild(day);
        row.appendChild(year);
    } else if (format.startsWith('YYYY')) {
        row.appendChild(year);
        row.appendChild(month);
        row.appendChild(day);
    }
}

function showFormatHint(format) {
    let hint = document.getElementById('date-format-hint');
    if (!hint) {
        hint = document.createElement('div');
        hint.id = 'date-format-hint';
        hint.style.fontSize = '0.9rem';
        hint.style.color = '#718096';
        hint.style.marginTop = '0.25rem';
        hint.setAttribute('aria-live', 'polite');
        document.querySelector('#manual-input').appendChild(hint);
    }
    hint.textContent = `Format: ${format}`;
}

function parseManualInputByLocale(format) {
    // Returns { day, month, year } from manual fields, according to format
    const dayVal = document.getElementById('day').value;
    const monthVal = document.getElementById('month').value;
    const yearVal = document.getElementById('year').value;
    let day, month, year;
    if (format === 'DD/MM/YYYY') {
        day = parseInt(dayVal, 10);
        month = parseInt(monthVal, 10);
        year = parseInt(yearVal, 10);
    } else if (format === 'MM/DD/YYYY') {
        month = parseInt(monthVal, 10);
        day = parseInt(dayVal, 10);
        year = parseInt(yearVal, 10);
    } else if (format === 'YYYY-MM-DD' || format === 'YYYY/MM/DD' || format === 'YYYY.MM.DD') {
        year = parseInt(yearVal, 10);
        month = parseInt(monthVal, 10);
        day = parseInt(dayVal, 10);
    } else {
        // fallback
        day = parseInt(dayVal, 10);
        month = parseInt(monthVal, 10);
        year = parseInt(yearVal, 10);
    }
    return { day, month, year };
}

// On load, detect locale and update UI
document.addEventListener('DOMContentLoaded', () => {
    // Locale override: check localStorage, else use browser
    let code = localStorage.getItem('ageCalcLocaleOverride');
    if (!code) code = getUserLocale();
    // If not supported, fallback to en-US
    if (!supportedLocales.some(l => l.code === code)) code = 'en-US';
    createLocaleDropdown(code);
    applyLocaleOverride(code);
});

// When switching input method, show format hint if manual
window.switchInputMethod = function(method) {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const inputMethods = document.querySelectorAll('.input-method');
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    inputMethods.forEach(m => m.classList.remove('active'));
    if (method === 'manual') {
        document.querySelector('.toggle-btn').classList.add('active');
        document.getElementById('manual-input').classList.add('active');
        // Show format hint
        showFormatHint(window._ageCalcLocaleFormat || 'DD/MM/YYYY');
        // Show locale dropdown
        const dropdown = document.getElementById('locale-override');
        if (dropdown) dropdown.style.display = 'block';
    } else {
        document.querySelector('.toggle-btn:nth-child(2)').classList.add('active');
        document.getElementById('picker-input').classList.add('active');
        // Hide format hint
        const hint = document.getElementById('date-format-hint');
        if (hint) hint.style.display = 'none';
        // Hide locale dropdown
        const dropdown = document.getElementById('locale-override');
        if (dropdown) dropdown.style.display = 'none';
    }
    if (ui) ui.hideError();
};
// Theme management
import AgeCalculator from './AgeCalculator.js';
import UIManager from './UIManager.js';
import ThemeManager from './ThemeManager.js';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize theme
function initializeTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }
}

// Toggle theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    
    localStorage.setItem('darkMode', isDarkMode);
    
    // Add transition effect
    document.body.style.transition = 'background 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}
let ui, theme;
document.addEventListener('DOMContentLoaded', () => {
    ui = new UIManager();
    theme = new ThemeManager();
});

// Initialize theme on load
document.addEventListener('DOMContentLoaded', initializeTheme);

// Switch between input methods
function switchInputMethod(method) {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const inputMethods = document.querySelectorAll('.input-method');
    
    // Remove active state from all elements
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    inputMethods.forEach(method => method.classList.remove('active'));
    
    // Add active state to selected method
    if (method === 'manual') {
        document.querySelector('.toggle-btn').classList.add('active');
        document.getElementById('manual-input').classList.add('active');
    } else {
        document.querySelector('.toggle-btn:nth-child(2)').classList.add('active');
        document.getElementById('picker-input').classList.add('active');
    }
    
    hideError();
}


// Show error message (with ARIA live region for accessibility)
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.style.animation = 'shake 0.5s ease-in-out';
    errorElement.setAttribute('aria-live', 'assertive');
    errorElement.setAttribute('role', 'alert');
    errorElement.tabIndex = -1;
    errorElement.focus();
}

// Hide error message
function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.style.display = 'none';
    errorElement.removeAttribute('aria-live');
    errorElement.removeAttribute('role');
    errorElement.removeAttribute('tabindex');
}

// Add shake animation for errors
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Validate date with stricter checks and leap year/month-end handling
function validateDate(day, month, year) {
    const today = new Date();
    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
        return "Please enter valid numbers for day, month, and year.";
    }
    if (year < 1900 || year > today.getFullYear()) {
        return `Please enter a valid year (1900-${today.getFullYear()})`;
    }
    if (month < 1 || month > 12) {
        return "Please enter a valid month (1-12)";
    }
    if (day < 1) {
        return "Please enter a valid day (1-31)";
    }
    // Get max days in month
    const maxDay = new Date(year, month, 0).getDate();
    if (day > maxDay) {
        return `That month only has ${maxDay} days.`;
    }
    const birthDate = new Date(year, month - 1, day);
    // Compare only date part (ignore time zone offset)
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (birthDate > todayDate) {
        return "Birth date cannot be in the future!";
    }
    return null;
}

// Calculate age
function performCalculation() {
    let day, month, year;
    if (document.getElementById('manual-input').classList.contains('active')) {
        // Use locale-aware parsing
        const format = window._ageCalcLocaleFormat || 'DD/MM/YYYY';
        const parsed = parseManualInputByLocale(format);
        day = parsed.day;
        month = parsed.month;
        year = parsed.year;
        if (!day || !month || !year) {
            ui.showError("Please fill in all fields");
            return;
        }
    } else {
        const birthdate = document.getElementById('birthdate').value;
        if (!birthdate) {
            ui.showError("Please select your birth date");
            return;
        }
        const dateParts = birthdate.split('-');
        year = parseInt(dateParts[0], 10);
        month = parseInt(dateParts[1], 10);
        day = parseInt(dateParts[2], 10);
    }
    const validationError = AgeCalculator.validateDate(day, month, year);
    if (validationError) {
        ui.showError(validationError);
        return;
    }
    const calc = new AgeCalculator(day, month, year);
    const age = calc.calculate();
    if (age.error) {
        ui.showError(age.error);
        return;
    }
    const stats = calc.getStats();
    const funFacts = calc.getFunFacts();
    ui.displayResults(age.years, age.months, age.days, stats, funFacts);
}


// Display results with enhanced animations and ARIA live region
function displayResults(years, months, days, birthDate) {
    const resultsElement = document.getElementById('results');
    // Animate age numbers
    animateNumber('years', years);
    animateNumber('months', months);
    animateNumber('days', days);
    // Generate statistics
    generateStats(years, months, days, birthDate);
    // Generate fun facts
    generateFunFacts(years, months, days, birthDate);
    // Show results with enhanced animation
    resultsElement.classList.add('show');
    // Accessibility: announce results
    resultsElement.setAttribute('aria-live', 'polite');
    resultsElement.setAttribute('role', 'region');
    // Add celebration effect for milestone ages
    if (years % 10 === 0 || years === 18 || years === 21 || years === 25 || years === 30) {
        addCelebrationEffect();
    }
}

// Animate number counting
function animateNumber(elementId, finalValue) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Generate enhanced statistics
function generateStats(years, months, days, birthDate) {
    const statsContainer = document.getElementById('stats-grid');
    const totalDays = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const nextBirthday = getNextBirthday(birthDate);
    const heartbeats = Math.floor(totalSeconds * 80); // Average 80 beats per minute
    
    const stats = [
        { number: totalDays.toLocaleString(), label: 'Total Days', icon: 'calendar' },
        { number: totalWeeks.toLocaleString(), label: 'Total Weeks', icon: 'chart' },
        { number: totalHours.toLocaleString(), label: 'Total Hours', icon: 'clock' },
        { number: heartbeats.toLocaleString(), label: 'Heartbeats', icon: 'heart' },
        { number: nextBirthday, label: 'Days to Birthday', icon: 'cake' },
        { number: Math.floor(totalMinutes / 1000000), label: 'Million Minutes', icon: 'timer' }
    ];
    
    statsContainer.innerHTML = stats.map(stat => 
        `<div class="stat-card" data-icon="${stat.icon}">
            <span class="stat-icon"></span>
            <span class="stat-number">${stat.number}</span>
            <div class="stat-label">${stat.label}</div>
        </div>`
    ).join('');
}

// Generate fun facts
function generateFunFacts(years, months, days, birthDate) {
    const funFactsContainer = document.getElementById('fun-facts');
    const facts = [];
    
    // Age-based facts
    if (years < 1) {
        facts.push("You're still a baby! Welcome to the world! 🌍");
    } else if (years < 5) {
        facts.push("You're in your early childhood years! 🧸");
    } else if (years < 13) {
        facts.push("You're in your childhood! Enjoy these carefree years! 🎈");
    } else if (years < 20) {
        facts.push("You're a teenager! These are formative years! 🎵");
    } else if (years < 30) {
        facts.push("You're in your twenties! The world is your oyster! 🌟");
    } else if (years < 40) {
        facts.push("You're in your thirties! Peak of your career! 💼");
    } else if (years < 50) {
        facts.push("You're in your forties! Wisdom comes with age! 🧠");
    } else if (years < 60) {
        facts.push("You're in your fifties! Experience is your superpower! ⚡");
    } else if (years < 70) {
        facts.push("You're in your sixties! Golden years ahead! 🏆");
    } else {
        facts.push("You're a senior! Respect and wisdom! 👑");
    }
    
    // Milestone facts
    if (years % 10 === 0) {
        facts.push(`Congratulations! You've reached ${years} years! 🎉`);
    }
    
    // Seasonal facts
    const birthMonth = birthDate.getMonth();
    const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    const season = seasons[Math.floor(birthMonth / 3)];
    facts.push(`You were born in ${season}! 🌸`);
    
    // Zodiac facts (simplified)
    const zodiacSigns = [
        'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
        'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
    ];
    const zodiacIndex = (birthMonth + 1) % 12;
    facts.push(`Your zodiac sign is ${zodiacSigns[zodiacIndex]}! ✨`);
    
    funFactsContainer.innerHTML = `
        <div class="fun-facts-title">🎯 Fun Facts About You</div>
        <div class="fun-facts-grid">
            ${facts.map(fact => `<div class="fun-fact">${fact}</div>`).join('')}
        </div>
    `;
}

// Add celebration effect for milestone ages
function addCelebrationEffect() {
    const container = document.querySelector('.calculator-container');
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.innerHTML = '🎉🎊🎈';
    confetti.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        animation: celebrate 2s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
    `;
    
    const celebrateStyle = document.createElement('style');
    celebrateStyle.textContent = `
        @keyframes celebrate {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(celebrateStyle);
    
    container.appendChild(confetti);
    
    setTimeout(() => {
        container.removeChild(confetti);
    }, 2000);
}

// Calculate days until next birthday
function getNextBirthday(birthDate) {
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const timeDiff = nextBirthday - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}


// Allow Enter key to calculate (use keydown for better support)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        // Only trigger if focus is on input or button
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.classList.contains('calculate-btn'))) {
            calculateAge();
        }
    }
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                switchInputMethod('manual');
                break;
            case '2':
                e.preventDefault();
                switchInputMethod('picker');
                break;
            case 'd':
                e.preventDefault();
                toggleTheme();
                break;
        }
    }
});

// Add keyboard shortcuts help
document.addEventListener('keydown', function(e) {
    if (e.key === 'F1') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
});

// Show keyboard shortcuts
function showKeyboardShortcuts() {
    const shortcuts = `
        <div class="shortcuts-modal">
            <div class="shortcuts-content">
                <h3>⌨️ Keyboard Shortcuts</h3>
                <div class="shortcut-item">
                    <span class="key">Enter</span>
                    <span class="description">Calculate age</span>
                </div>
                <div class="shortcut-item">
                    <span class="key">Ctrl/Cmd + 1</span>
                    <span class="description">Switch to manual input</span>
                </div>
                <div class="shortcut-item">
                    <span class="key">Ctrl/Cmd + 2</span>
                    <span class="description">Switch to date picker</span>
                </div>
                <div class="shortcut-item">
                    <span class="key">Ctrl/Cmd + D</span>
                    <span class="description">Toggle dark mode</span>
                </div>
                <div class="shortcut-item">
                    <span class="key">F1</span>
                    <span class="description">Show this help</span>
                </div>
                <button onclick="closeShortcuts()" class="close-btn">Close</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = shortcuts;
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for shortcuts modal
    const shortcutsStyle = document.createElement('style');
    shortcutsStyle.textContent = `
        .shortcuts-content {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .shortcuts-content h3 {
            margin-bottom: 1.5rem;
            color: #2d3748;
            text-align: center;
        }
        
        .shortcut-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .key {
            background: #f7fafc;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: monospace;
            font-weight: 600;
            color: #4a5568;
        }
        
        .description {
            color: #4a5568;
        }
        
        .close-btn {
            margin-top: 1.5rem;
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        
        body.dark-mode .shortcuts-content {
            background: #1e293b;
            color: #f1f5f9;
        }
        
        body.dark-mode .shortcuts-content h3 {
            color: #f1f5f9;
        }
        
        body.dark-mode .key {
            background: #334155;
            color: #cbd5e0;
        }
        
        body.dark-mode .description {
            color: #cbd5e0;
        }
        
        body.dark-mode .shortcut-item {
            border-bottom: 1px solid #475569;
        }
    `;
    document.head.appendChild(shortcutsStyle);
}

// Close shortcuts modal
function closeShortcuts() {
    const modal = document.querySelector('.shortcuts-modal').parentElement;
    document.body.removeChild(modal);
}


// Add loading animation to calculate button
document.querySelector('.calculate-btn').addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// Accessibility: focus error on input invalid, and add input event validation
['day', 'month', 'year'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            const day = parseInt(document.getElementById('day').value, 10);
            const month = parseInt(document.getElementById('month').value, 10);
            const year = parseInt(document.getElementById('year').value, 10);
            const err = validateDate(day, month, year);
            if (err) {
                showError(err);
            } else {
                hideError();
            }
        });
    }
});
const birthdateEl = document.getElementById('birthdate');
if (birthdateEl) {
    birthdateEl.addEventListener('input', () => {
        const val = birthdateEl.value;
        if (val) {
            const [year, month, day] = val.split('-').map(Number);
            const err = validateDate(day, month, year);
            if (err) {
                showError(err);
            } else {
                hideError();
            }
        }
    });
}

// Share results
function shareResults() {
    const years = document.getElementById('years').textContent;
    const months = document.getElementById('months').textContent;
    const days = document.getElementById('days').textContent;
    
    const shareText = `🎉 I'm ${years} years, ${months} months, and ${days} days old! Check out this amazing Age Calculator Pro! 🚀`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Age - Age Calculator Pro',
            text: shareText,
            url: shareUrl
        }).catch(err => {
            fallbackShare(shareText, shareUrl);
        });
    } else {
        fallbackShare(shareText, shareUrl);
    }
}

// Fallback share method
function fallbackShare(text, url) {
    const shareData = {
        title: 'My Age - Age Calculator Pro',
        text: text,
        url: url
    };
    
    // Try to copy to clipboard
    const fullText = `${text}\n\n${url}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(fullText).then(() => {
            showNotification('📋 Results copied to clipboard!');
        }).catch(() => {
            showNotification('📤 Share feature not available on this browser');
        });
    } else {
        showNotification('📤 Share feature not available on this browser');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    const slideInRight = document.createElement('style');
    slideInRight.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(slideInRight);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        const slideOutRight = document.createElement('style');
        slideOutRight.textContent = `
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(slideOutRight);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 