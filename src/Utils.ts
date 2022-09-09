/**
 * Linearly interpolate between two values.
 *
 * @param a Start value
 * @param b End value
 * @param t Value in the range [0, 1]
 * @return Value between a and b
 */
function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b;
}

/**
 * Clamp a value between a minimum and maximum
 *
 * @param x   Target value
 * @param min Minimum value
 * @param max Maximum value
 * @return Clamped value
 */
function clamp(x: number, min: number, max: number) {
  return Math.min(max, Math.max(x, min));
}

/**
 * Generate a random floating point number in [min, max)
 *
 * @param min Minimum value of range
 * @param max Maximum value of range
 * @return Random number
 */
function randrange(min: number, max: number) {
  return min + (max - min) * Math.random();
}

export { lerp, clamp, randrange };
