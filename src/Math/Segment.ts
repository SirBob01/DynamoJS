import { Vec2D } from './Vec2D';

class Segment {
  start: Vec2D;
  stop: Vec2D;

  /**
   * A line segment.
   *
   * @param start Coordinates of the starting point
   * @param stop  Coordinates of the stopping point
   * @return New Segment object
   */
  constructor(start: Vec2D, stop: Vec2D) {
    this.start = start;
    this.stop = stop;
  }

  /**
   * Create a copy of the current segment.
   *
   * @return New Segment object
   */
  copy() {
    return new Segment(this.start, this.stop);
  }

  /**
   * Test if the current segment is parallel with another.
   *
   * @param segment The other segment to test
   * @return Are the segments parallel?
   */
  is_parallel(segment: Segment) {
    const m1 = (this.stop.y - this.start.y) / (this.stop.x - this.start.x);
    const m2 =
      (segment.stop.y - segment.start.y) / (segment.stop.x - segment.start.x);
    return m1 == m2;
  }
}

export { Segment };
