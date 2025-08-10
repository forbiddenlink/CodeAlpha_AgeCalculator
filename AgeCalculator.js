// AgeCalculator.js
import { intervalToDuration, differenceInDays, addYears, isBefore, isLeapYear, format, parseISO } from 'date-fns';

export default class AgeCalculator {
  constructor(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;
  }

  static validateDate(day, month, year) {
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
    // Use date-fns isLeapYear for leap year check
    const maxDay = new Date(year, month, 0).getDate();
    if (day > maxDay) {
      return `That month only has ${maxDay} days.`;
    }
    const birthDate = new Date(year, month - 1, day);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (birthDate > todayDate) {
      return "Birth date cannot be in the future!";
    }
    return null;
  }

  calculate() {
    const today = new Date();
    const birthDate = new Date(this.year, this.month - 1, this.day);
    if (isBefore(today, birthDate)) {
      return { error: "Birth date cannot be in the future!" };
    }
    // Use intervalToDuration for accurate calculation
    const duration = intervalToDuration({ start: birthDate, end: today });
    return { years: duration.years, months: duration.months, days: duration.days };
  }

  daysUntilNextBirthday() {
    const today = new Date();
    let nextBirthday = new Date(today.getFullYear(), this.month - 1, this.day);
    if (isBefore(nextBirthday, today) || format(today, 'MM-dd') === format(nextBirthday, 'MM-dd')) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    return differenceInDays(nextBirthday, today);
  }

  getStats() {
    const birthDate = new Date(this.year, this.month - 1, this.day);
    const now = new Date();
    const totalDays = differenceInDays(now, birthDate);
    const totalHours = totalDays * 24;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const heartbeats = Math.floor(totalSeconds * 80); // Average 80 bpm
    const nextBirthday = this.daysUntilNextBirthday();
    return [
      { number: totalDays.toLocaleString(), label: 'Total Days', icon: 'calendar' },
      { number: totalWeeks.toLocaleString(), label: 'Total Weeks', icon: 'chart' },
      { number: totalHours.toLocaleString(), label: 'Total Hours', icon: 'clock' },
      { number: heartbeats.toLocaleString(), label: 'Heartbeats', icon: 'heart' },
      { number: nextBirthday, label: 'Days to Birthday', icon: 'cake' },
      { number: Math.floor(totalMinutes / 1000000), label: 'Million Minutes', icon: 'timer' }
    ];
  }

  getFunFacts() {
    const { years } = this.calculate();
    const birthDate = new Date(this.year, this.month - 1, this.day);
    const facts = [];
    if (years < 1) facts.push("You're still a baby! Welcome to the world! 🌍");
    else if (years < 5) facts.push("You're in your early childhood years! 🧸");
    else if (years < 13) facts.push("You're in your childhood! Enjoy these carefree years! 🎈");
    else if (years < 20) facts.push("You're a teenager! These are formative years! 🎵");
    else if (years < 30) facts.push("You're in your twenties! The world is your oyster! 🌟");
    else if (years < 40) facts.push("You're in your thirties! Peak of your career! 💼");
    else if (years < 50) facts.push("You're in your forties! Wisdom comes with age! 🧠");
    else if (years < 60) facts.push("You're in your fifties! Experience is your superpower! ⚡");
    else if (years < 70) facts.push("You're in your sixties! Golden years ahead! 🏆");
    else facts.push("You're a senior! Respect and wisdom! 👑");
    if (years % 10 === 0) facts.push(`Congratulations! You've reached ${years} years! 🎉`);
    const birthMonth = birthDate.getMonth();
    const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    const season = seasons[Math.floor(birthMonth / 3)];
    facts.push(`You were born in ${season}! 🌸`);
    const zodiacSigns = [
      'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
      'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
    ];
    const zodiacIndex = (birthMonth + 1) % 12;
    facts.push(`Your zodiac sign is ${zodiacSigns[zodiacIndex]}! ✨`);
    return facts;
  }
}
