/**
 * Check if a number is between a range
 * @param  {Number} value
 * @param  {Number} max
 * @param  {Number} min
 * @return {Boolean}      True if it is in range
 */
export const inRange = (value, max, min = 0) => !(value < min || value > max);

/**
 * Find the minimum natural value of a set of numbers and 0
 * @param  {...Number} values
 * @return {Number}           Minimum natural number or 0
 */
export const minPositive = (...values) => Math.max(Math.min(...values), 0);

/**
 * Dividex number, or return a value if denominator is 0
 * @param  {Number} numerator
 * @param  {Number} denominator
 * @param  {Number} valueIfInfinite
 * @return {Number}                 Division result or valueIfInfinite
 */
export const safeDivision = (numerator, denominator, valueIfInfinite) => !denominator
  ? valueIfInfinite
  : numerator / denominator;
