import { clamp, lerp } from '../Utils';

class Color {
  /**
   * Red channel
   */
  r: number;

  /**
   * Blue channel
   */
  g: number;

  /**
   * Green channel
   */
  b: number;

  /**
   * Alpha channel
   */
  a: number;

  /**
   * RGBA color.
   *
   * @param r Red value in range [0, 255]
   * @param g Green value in range [0, 255]
   * @param b Blue value in range [0, 255]
   * @param a Alpha channel in range [0, 255]
   * @return New color object
   */
  constructor(r: number, g: number, b: number, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Create a new copy of the current color.
   *
   * @return New color object
   */
  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * Linearly interpolate to another color.
   *
   * @param target Target color
   * @param t      Value between [0, 1]
   * @return Resultant color
   */
  lerp(target: Color, t: number) {
    const r = lerp(this.r, target.r, t);
    const g = lerp(this.g, target.g, t);
    const b = lerp(this.b, target.b, t);
    const a = lerp(this.a, target.a, t);
    return new Color(r, g, b, a);
  }

  /**
   * Generate the valid HTML string in rgba format.
   *
   * @return RGBA string
   */
  get() {
    return (
      'rgb(' +
      clamp(Math.round(this.r), 0, 255) +
      ',' +
      clamp(Math.round(this.g), 0, 255) +
      ',' +
      clamp(Math.round(this.b), 0, 255) +
      ',' +
      clamp(Math.round(this.a), 0, 255) +
      ')'
    );
  }

  /**
   * Get the normalized alpha value.
   *
   * @return Alpha value between [0, 1]
   */
  alpha() {
    return this.a / 255.0;
  }
}

export { Color };
