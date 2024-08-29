import { handleMeasureNumericValue, isSameMonth } from '../src/utils';

describe('Utils - handleMeasureNumericValue', () => {
  it('should return numeric value when input contains numbers and non-numeric characters', () => {
    const result = handleMeasureNumericValue('abc123def456');
    expect(result).toBe(123456);
  });

  it('should return NaN when input contains no numeric characters', () => {
    const result = handleMeasureNumericValue('abcdef');
    expect(result).toBe(NaN);
  });

  it('should return the number itself if input is a numeric string', () => {
    const result = handleMeasureNumericValue('123456');
    expect(result).toBe(123456);
  });
});

describe('Utils - isSameMonth', () => {
  it('should return true if both dates are in the same month and year', () => {
    const date1 = new Date('2023-08-15');
    const date2 = new Date('2023-08-01');
    const result = isSameMonth(date1, date2);
    expect(result).toBe(true);
  });

  it('should return false if dates are in the same month but different years', () => {
    const date1 = new Date('2023-08-15');
    const date2 = new Date('2022-08-01');
    const result = isSameMonth(date1, date2);
    expect(result).toBe(false);
  });

  it('should return false if dates are in different months', () => {
    const date1 = new Date('2023-08-15');
    const date2 = new Date('2023-07-01');
    const result = isSameMonth(date1, date2);
    expect(result).toBe(false);
  });
});
