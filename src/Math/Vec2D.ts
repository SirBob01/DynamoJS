class Vec2D {
  x: number;
  y: number;

  /**
   * A 2D vector.
   *
   * @param x X-coordinate
   * @param y Y-coordinate
   * @return New Vec2D object
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Create a copy of the current vector.
   *
   * @return New Vec2D object
   */
  copy() {
    return new Vec2D(this.x, this.y);
  }

  /**
   * Test if a vector is equivalent to the current one.
   *
   * @param b Other vector
   * @return Are the vectors equal?
   */
  equals(b: Vec2D) {
    return this.x == b.x && this.y == b.y;
  }

  /**
   * Add a new vector to the current one.
   *
   * @param b Addend vector
   * @return Resultant sum of the vectors
   */
  add(b: Vec2D) {
    return new Vec2D(this.x + b.x, this.y + b.y);
  }

  /**
   * Subtract a vector from the current one.
   *
   * @param b Subtrahend vector
   * @return Resultant difference of the vectors
   */
  sub(b: Vec2D) {
    return new Vec2D(this.x - b.x, this.y - b.y);
  }

  /**
   * Multiply the current vector by a scalar value.
   *
   * @param s Scalar value
   * @return Resultant product
   */
  scale(s: number) {
    return new Vec2D(this.x * s, this.y * s);
  }

  /**
   * Calculate the dot product with another vector.
   *
   * @param b Other vector
   * @return Resultant dot product
   */
  dot(b: Vec2D) {
    return this.x * b.x + this.y * b.y;
  }

  /**
   * Get the squared length of the vector.
   *
   * @return Squared length
   */
  length_sq() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Get the cartesian length of the vector.
   *
   * @return Cartesian length
   */
  length() {
    return Math.sqrt(this.length_sq());
  }

  /**
   * Get the unit vector.
   *
   * @return Directional vector of length 1.
   */
  unit() {
    const length = this.length();
    return new Vec2D(this.x / length, this.y / length);
  }

  /**
   * Get the array representation of the vector.
   *
   * @return Ordered list of coordinate values
   */
  get() {
    return [this.x, this.y];
  }

  /**
   * Grab the string representation of the vector.
   *
   * @return Comma-separated values
   */
  to_string() {
    return this.x + ',' + this.y;
  }

  /**
   * Create a new Vec2D object from a comma-separated string.
   *
   * @param string Comma-separated values
   * @return New Vec2D object
   */
  static from_string(string: string) {
    const vals = string.split(',');
    return new Vec2D(parseFloat(vals[0]), parseFloat(vals[1]));
  }
}

export { Vec2D };
