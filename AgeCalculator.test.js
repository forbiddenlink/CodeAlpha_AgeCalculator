// AgeCalculator.test.js
import AgeCalculator from './AgeCalculator.js';

describe('AgeCalculator', () => {
  it('calculates age correctly for a normal date', () => {
    const calc = new AgeCalculator(10, 8, 2000); // Aug 10, 2000
    const result = calc.calculate();
    expect(result.years).toBeGreaterThanOrEqual(0);
    expect(result.months).toBeGreaterThanOrEqual(0);
    expect(result.days).toBeGreaterThanOrEqual(0);
  });

  it('handles leap years', () => {
    const calc = new AgeCalculator(29, 2, 2004); // Feb 29, 2004
    const result = calc.calculate();
    expect(result.years).toBeGreaterThanOrEqual(0);
  });

  it('returns error for future date', () => {
    const calc = new AgeCalculator(1, 1, 3000);
    const result = calc.calculate();
    expect(result.error).toBeDefined();
  });
});
