import { Segment } from './Segment';
import { Vec2D } from './Vec2D';

class AABB {
  center: Vec2D;
  dim: Vec2D;

  /**
   * An axis-aligned bounding box.
   *
   * @param x   X-coordinate of the center
   * @param y   Y-coordinate of the center
   * @param w   Width of the bounding box
   * @param h   Height of the bounding box
   * @return New AABB object
   */
  constructor(x: number, y: number, w: number, h: number) {
    this.center = new Vec2D(x, y);
    this.dim = new Vec2D(w, h);
  }

  /**
   * Create a copy of the current AABB.
   *
   * @return New AABB object
   */
  copy() {
    return new AABB(this.center.x, this.center.y, this.dim.x, this.dim.y);
  }

  /**
   * Get the upper-left corner of the AABB.
   *
   * @return Coordinates of the upperleft corner
   */
  min() {
    return this.center.sub(this.dim.scale(0.5));
  }

  /**
   * Get the bottom-right corner of the AABB.
   *
   * @return Coordinates of the bottom-right corner
   */
  max() {
    return this.center.add(this.dim.scale(0.5));
  }

  /**
   * Get the left side of the AABB.
   *
   * @return Line segment of the left face
   */
  left() {
    const tl = this.min();
    const bl = this.max();
    bl.x -= this.dim.x;
    return new Segment(tl, bl);
  }

  /**
   * Get the right side of the AABB.
   *
   * @return Line segment of the right face
   */
  right() {
    const tr = this.min();
    const br = this.max();
    tr.x += this.dim.x;
    return new Segment(tr, br);
  }

  /**
   * Get the top side of the AABB.
   *
   * @return Line segment of the top face
   */
  top() {
    const tl = this.min();
    const tr = this.min();
    tr.x += this.dim.x;
    return new Segment(tl, tr);
  }

  /**
   * Get the bottom side of the AABB.
   *
   * @return Line segment of the bottom face
   */
  bottom() {
    const bl = this.max();
    const br = this.max();
    bl.x -= this.dim.x;
    return new Segment(bl, br);
  }

  /**
   * Test if a point is within the AABB.
   *
   * @param point Test point
   * @return Is the point in bounds?
   */
  isInBounds(point: Vec2D) {
    const min = this.min();
    const max = this.max();

    const hor = point.x < max.x && point.x > min.x;
    const ver = point.y < max.y && point.y > min.y;
    return hor && ver;
  }

  /**
   * Test if the AABB is colliding with another.
   *
   * @param other Paired AABB
   * @return Are bounding boxes colliding?
   */
  isColliding(other: AABB) {
    const min = this.min();
    const max = this.max();

    const otherMin = other.min();
    const otherMax = other.max();

    const hor = otherMax.x > min.x && otherMin.x < max.x;
    const ver = otherMax.y > min.y && otherMin.y < max.y;
    return hor && ver;
  }
}

export { AABB };
