import { inRange, minPositive, safeDivision } from '../../src/helpers/math';

describe('helpers', () => {
  describe('inRange', () => {
    it('should return if the values is in range', () => {
      expect(inRange(5, 10, 0)).toBeTruthy();
      expect(inRange(11, 10, 0)).toBeFalsy();
      expect(inRange(-5, 10, 0)).toBeFalsy();
      expect(inRange(5, 10, 7)).toBeFalsy();
    });
  });
  describe('minPositive', () => {
    it('should return the minimum positive element of a list or 0', () => {
      expect(minPositive(5, 10)).toBe(5);
      expect(minPositive(-5, 10)).toBe(0);
    });
  });
  describe('safeDivision', () => {
    it('should return the result of a determined division', () => {
      expect(safeDivision(10, 5, 0)).toBe(2);
      expect(safeDivision(-10, 5, 0)).toBe(-2);
    });
    it('should return default values if the operation is undetermined', () => {
      expect(safeDivision(10, 0, 100)).toBe(100);
    });
  });
});
