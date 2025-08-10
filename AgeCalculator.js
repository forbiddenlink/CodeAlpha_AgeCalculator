// AgeCalculator.js - Enhanced with advanced date calculations
import { intervalToDuration, differenceInDays, addYears, isBefore, isLeapYear, format, parseISO, addDays, startOfDay } from 'date-fns';

export default class AgeCalculator {
  constructor(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.birthDate = new Date(year, month - 1, day);
    this.today = new Date();
    
    // Planet orbital periods in Earth days
    this.planetData = {
      mercury: { days: 88, name: 'Mercury' },
      venus: { days: 225, name: 'Venus' },
      mars: { days: 687, name: 'Mars' },
      jupiter: { days: 4333, name: 'Jupiter' },
      saturn: { days: 10759, name: 'Saturn' },
      uranus: { days: 30687, name: 'Uranus' },
      neptune: { days: 60190, name: 'Neptune' }
    };
  }

  static validateDate(day, month, year) {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Enhanced validation with better error messages
    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
      return "Please enter valid numbers for day, month, and year.";
    }
    
    if (year < 1900) {
      return "Please enter a year after 1900 for accurate calculations.";
    }
    
    if (year > currentYear) {
      return "Birth year cannot be in the future!";
    }
    
    if (month < 1 || month > 12) {
      return "Please enter a valid month (1-12).";
    }
    
    if (day < 1) {
      return "Please enter a valid day (1-31).";
    }
    
    // Check maximum days in the month
    const maxDay = new Date(year, month, 0).getDate();
    if (day > maxDay) {
      const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[month]} ${year} only has ${maxDay} days.`;
    }
    
    // Check if birth date is in the future
    const birthDate = new Date(year, month - 1, day);
    const todayDate = startOfDay(today);
    const birthDateStart = startOfDay(birthDate);
    
    if (birthDateStart > todayDate) {
      return "Birth date cannot be in the future!";
    }
    
    // Check for extremely old ages (over 150 years)
    const age = currentYear - year;
    if (age > 150) {
      return "Please verify the birth year. Age cannot exceed 150 years.";
    }
    
    return null;
  }

  calculate() {
    const today = new Date();
    
    if (isBefore(today, this.birthDate)) {
      return { error: "Birth date cannot be in the future!" };
    }
    
    // Use intervalToDuration for accurate calculation
    const duration = intervalToDuration({ start: this.birthDate, end: today });
    
    return {
      years: typeof duration.years === 'number' ? duration.years : 0,
      months: typeof duration.months === 'number' ? duration.months : 0,
      days: typeof duration.days === 'number' ? duration.days : 0
    };
  }

  // Calculate age on different planets
  calculatePlanetaryAges() {
    const earthDays = differenceInDays(this.today, this.birthDate);
    const planetaryAges = {};
    
    Object.entries(this.planetData).forEach(([planet, data]) => {
      const planetYears = (earthDays / data.days).toFixed(2);
      planetaryAges[planet] = {
        years: planetYears,
        name: data.name
      };
    });
    
    return planetaryAges;
  }

  // Alias for backward compatibility with tests
  getPlanetaryAges() {
    const planetaryAges = this.calculatePlanetaryAges();
    // Convert to array format expected by tests
    return Object.entries(planetaryAges).map(([key, data]) => ({
      planet: data.name,
      age: parseFloat(data.years),
      key
    }));
  }

  // Calculate next milestones
  getNextMilestones() {
    const currentAge = this.calculate();
    const nextBirthday = this.daysUntilNextBirthday();
    const currentAgeInYears = currentAge.years;
    
    const milestones = [];
    
    // Next birthday
    milestones.push({
      type: 'birthday',
      age: currentAgeInYears + 1,
      days: nextBirthday,
      description: `${currentAgeInYears + 1}th Birthday`
    });
    
    // Next decade milestone
    const nextDecade = Math.ceil((currentAgeInYears + 1) / 10) * 10;
    if (nextDecade !== currentAgeInYears + 1) {
      const yearsToDecade = nextDecade - currentAgeInYears;
      const daysToDecade = nextBirthday + ((yearsToDecade - 1) * 365);
      milestones.push({
        type: 'decade',
        age: nextDecade,
        days: Math.round(daysToDecade),
        description: `${nextDecade}th Birthday (Decade Milestone)`
      });
    }
    
    // Quarter century milestones
    const quarterCenturies = [25, 50, 75, 100];
    quarterCenturies.forEach(milestone => {
      if (milestone > currentAgeInYears) {
        const yearsToMilestone = milestone - currentAgeInYears;
        const daysToMilestone = nextBirthday + ((yearsToMilestone - 1) * 365);
        milestones.push({
          type: 'major',
          age: milestone,
          days: Math.round(daysToMilestone),
          description: `${milestone}th Birthday (Major Milestone)`
        });
      }
    });
    
    return milestones.slice(0, 3); // Return top 3 milestones
  }

  daysUntilNextBirthday() {
    const today = new Date();
    let nextBirthday = new Date(today.getFullYear(), this.month - 1, this.day);
    
    if (isBefore(nextBirthday, today) || format(today, 'MM-dd') === format(nextBirthday, 'MM-dd')) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    
    return differenceInDays(nextBirthday, today);
  }

  // Get day of week when born
  getBirthDayInfo() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[this.birthDate.getDay()];
    
    return {
      dayOfWeek,
      isWeekend: this.birthDate.getDay() === 0 || this.birthDate.getDay() === 6,
      formatted: format(this.birthDate, 'EEEE, MMMM do, yyyy')
    };
  }

  // Get historical events from birth year
  getHistoricalEvents() {
    const historicalData = {
      2023: ['ChatGPT reaches 100 million users', 'Turkey and Syria earthquakes'],
      2022: ['Russia invades Ukraine', 'Queen Elizabeth II dies', 'FIFA World Cup in Qatar'],
      2021: ['COVID-19 vaccines rolled out globally', 'Tokyo Olympics held', 'Taliban retakes Afghanistan'],
      2020: ['COVID-19 pandemic begins', 'Black Lives Matter protests', 'US Presidential Election'],
      2019: ['Notre-Dame fire', 'Hong Kong protests', 'Greta Thunberg climate activism'],
      2018: ['Royal Wedding of Harry and Meghan', 'Winter Olympics in PyeongChang', 'Black Panther movie released'],
      2017: ['Donald Trump becomes US President', 'Solar eclipse across US', 'Bitcoin reaches $20,000'],
      2016: ['Brexit referendum', 'Rio Olympics', 'Pokemon Go released'],
      2015: ['Paris attacks', 'Same-sex marriage legalized in US', 'Pluto flyby by New Horizons'],
      2014: ['World Cup in Brazil', 'Ebola outbreak', 'Malaysia Airlines Flight 370 disappears'],
      2013: ['Nelson Mandela dies', 'Edward Snowden NSA revelations', 'Pope Francis elected'],
      2012: ['London Olympics', 'Hurricane Sandy', 'Gangnam Style goes viral'],
      2011: ['Arab Spring begins', 'Japan earthquake and tsunami', 'Osama bin Laden killed'],
      2010: ['Haiti earthquake', 'Winter Olympics in Vancouver', 'iPad released'],
      2009: ['Barack Obama becomes US President', 'Michael Jackson dies', 'Swine flu pandemic'],
      2008: ['Global financial crisis', 'Beijing Olympics', 'Barack Obama elected'],
      2007: ['iPhone released', 'Virginia Tech shooting', 'Global recession begins'],
      2006: ['Twitter launched', 'World Cup in Germany', 'Pluto reclassified as dwarf planet'],
      2005: ['YouTube founded', 'Hurricane Katrina', 'London bombings'],
      2004: ['Facebook founded', 'Indian Ocean tsunami', 'Athens Olympics'],
      2003: ['Iraq War begins', 'SARS outbreak', 'Space Shuttle Columbia disaster'],
      2002: ['Euro currency introduced', 'Winter Olympics in Salt Lake City', 'Brazil wins World Cup'],
      2001: ['September 11 attacks', 'Wikipedia launched', 'iPod released'],
      2000: ['Y2K celebration', 'Sydney Olympics', 'Dot-com bubble'],
      1999: ['Kosovo War', 'Columbine shooting', 'Matrix movie released'],
      1998: ['Google founded', 'World Cup in France', 'Monica Lewinsky scandal'],
      1997: ['Princess Diana dies', 'Hong Kong returned to China', 'Titanic movie released'],
      1996: ['Atlanta Olympics', 'Mad Cow Disease outbreak', 'Dolly the sheep cloned'],
      1995: ['Oklahoma City bombing', 'Windows 95 released', 'Internet becomes mainstream'],
      1994: ['Nelson Mandela becomes South African President', 'World Cup in USA', 'Rwanda genocide'],
      1993: ['World Trade Center bombing', 'Waco siege', 'Jurassic Park released'],
      1992: ['Los Angeles riots', 'Barcelona Olympics', 'Cold War officially ends'],
      1991: ['Gulf War', 'Soviet Union dissolves', 'World Wide Web invented'],
      1990: ['German reunification', 'Nelson Mandela released', 'Hubble telescope launched']
    };
    
    return historicalData[this.year] || ['No major events recorded for this year'];
  }

  getStats() {
    const birthDate = new Date(this.year, this.month - 1, this.day);
    const now = new Date();
    const totalDays = differenceInDays(now, birthDate);
    const totalHours = totalDays * 24;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const heartbeats = Math.floor(totalSeconds * 1.2); // Average 72 bpm more accurate
    const breaths = Math.floor(totalMinutes * 16); // Average 16 breaths per minute
    const nextBirthday = this.daysUntilNextBirthday();
    
    return [
      { number: totalDays.toLocaleString(), label: 'Total Days', icon: 'calendar' },
      { number: totalWeeks.toLocaleString(), label: 'Total Weeks', icon: 'chart' },
      { number: totalHours.toLocaleString(), label: 'Total Hours', icon: 'clock' },
      { number: heartbeats.toLocaleString(), label: 'Heartbeats', icon: 'heart' },
      { number: breaths.toLocaleString(), label: 'Breaths Taken', icon: 'wind' },
      { number: nextBirthday, label: 'Days to Birthday', icon: 'cake' }
    ];
  }

  getFunFacts() {
    const { years } = this.calculate();
    const birthDate = new Date(this.year, this.month - 1, this.day);
    const birthInfo = this.getBirthDayInfo();
    const facts = [];
    
    // Age-based facts
    if (years < 1) facts.push("🍼 You're still a baby! Welcome to the world!");
    else if (years < 5) facts.push("🧸 You're in your early childhood years!");
    else if (years < 13) facts.push("🎈 You're in your childhood! Enjoy these carefree years!");
    else if (years < 20) facts.push("🎵 You're a teenager! These are formative years!");
    else if (years < 30) facts.push("🌟 You're in your twenties! The world is your oyster!");
    else if (years < 40) facts.push("💼 You're in your thirties! Peak of your career!");
    else if (years < 50) facts.push("🧠 You're in your forties! Wisdom comes with age!");
    else if (years < 60) facts.push("⚡ You're in your fifties! Experience is your superpower!");
    else if (years < 70) facts.push("🏆 You're in your sixties! Golden years ahead!");
    else facts.push("👑 You're a senior! Respect and wisdom!");
    
    // Birthday milestone
    if (years % 10 === 0 && years > 0) facts.push(`🎉 Congratulations! You've reached ${years} years!`);
    
    // Birth day info
    facts.push(`📅 You were born on a ${birthInfo.dayOfWeek}!`);
    
    if (birthInfo.isWeekend) {
      facts.push("� Lucky you! You were born on a weekend!");
    }
    
    // Season fact
    const birthMonth = birthDate.getMonth();
    const seasons = ['❄️ Winter', '🌸 Spring', '☀️ Summer', '🍂 Autumn'];
    const season = seasons[Math.floor(birthMonth / 3)];
    facts.push(`You were born in ${season}!`);
    
    // Zodiac sign
    const zodiacSigns = [
      'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓', 'Aries ♈', 'Taurus ♉', 'Gemini ♊',
      'Cancer ♋', 'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐'
    ];
    const zodiacIndex = (birthMonth + Math.floor(this.day / 22)) % 12;
    facts.push(`✨ Your zodiac sign is ${zodiacSigns[zodiacIndex]}!`);
    
    // Next birthday countdown
    const daysUntilBirthday = this.daysUntilNextBirthday();
    if (daysUntilBirthday === 0) {
      facts.push("🎂 Happy Birthday! Today is your special day!");
    } else if (daysUntilBirthday <= 30) {
      facts.push(`🎁 Your birthday is in ${daysUntilBirthday} days!`);
    }
    
    return facts;
  }
}
