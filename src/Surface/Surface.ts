import { Vec2D, Segment, AABB } from '../Math';
import { Color } from './Color';
import { ColorGradient } from './ColorGradient';
import { Sprite } from './Sprite';

class Surface {
  /**
   * HTML canvas target
   */
  canvas: HTMLCanvasElement;

  /**
   * Rendering context
   */
  surface: CanvasRenderingContext2D;

  /**
   * A base surface for targeted rendering.
   *
   * @param w      Width of the surface
   * @param h      Height of the surface
   * @param canvas Target canvas element
   * @return New Surface object
   */
  constructor(w: number, h: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;

    this.surface = this.canvas.getContext('2d')!;
  }

  /**
   * Set the width and height of the surface's underlying canvas
   *
   * @param width  Width of the surface
   * @param height Height of the surface
   */
  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Get the bounds of the surface.
   *
   * @param center Should bounding box be centered?
   * @return Bouding box of the surface
   */
  rect(center = true) {
    const aabb = new AABB(
      this.canvas.width / 2.0,
      this.canvas.height / 2.0,
      this.canvas.width,
      this.canvas.height
    );
    if (!center) {
      aabb.center.x = 0;
      aabb.center.y = 0;
    }
    return aabb;
  }

  /**
   * Generate a subsurface.
   *
   * @param aabb    Size and location of subsurface
   * @param center  Should coordinates be centered?
   * @return New Surface object
   */
  subsurface(aabb: AABB, center = false) {
    const sub = new Surface(aabb.dim.x, aabb.dim.y);
    const target = center ? aabb.min() : aabb.center;
    this.surface.imageSmoothingEnabled = false;
    sub.surface.drawImage(
      this.canvas,
      Math.round(target.x),
      Math.round(target.y),
      Math.round(aabb.dim.x),
      Math.round(aabb.dim.y),
      0,
      0,
      Math.round(aabb.dim.x),
      Math.round(aabb.dim.y)
    );
    return sub;
  }

  /**
   * Fill the entire surface with a color or gradient.
   *
   * @param color Target color or gradient
   */
  fill(color: Color | ColorGradient) {
    this.drawRect(this.rect(), color, true);
  }

  /**
   * Draw another surface on top of the current one.
   *
   * @param src     Source surface to be drawn
   * @param aabb    Target bounding box for stretching
   * @param blend   Drawing blend mode
   * @param opacity Transparency value
   * @param angle   Angular rotation in radians
   * @param flip    Flip factor of the image
   * @param center  Should drawing be centered?
   */
  drawSurface(
    src: Surface,
    aabb: AABB,
    blend: GlobalCompositeOperation = 'source-over',
    opacity = 1.0,
    angle = 0.0,
    flip: Vec2D = new Vec2D(1, 1),
    center = true
  ) {
    this.surface.imageSmoothingEnabled = false;
    this.surface.globalCompositeOperation = blend;
    this.surface.globalAlpha = opacity;
    this.surface.scale(flip.x, flip.y);

    let point = aabb.center.copy();
    if (!center) {
      point = point.add(aabb.dim.scale(0.5));
    }
    this.surface.translate(point.x * flip.x, point.y * flip.y);
    this.surface.rotate(angle);
    this.surface.drawImage(
      src.canvas,
      Math.round(-aabb.dim.x / 2),
      Math.round(-aabb.dim.y / 2),
      Math.round(aabb.dim.x),
      Math.round(aabb.dim.y)
    );
    this.surface.setTransform(1, 0, 0, 1, 0, 0);
    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw a sprite on the surface.
   *
   * @param sprite  Source sprite to be drawn
   * @param aabb    Target bounding box for stretching
   * @param blend   Drawing blend mode
   * @param opacity Transparency value
   * @param angle   Angular rotation in radians
   * @param flip    Flip factor of the image
   * @param center  Should drawing be centered?
   */
  drawSprite(
    sprite: Sprite,
    aabb: AABB,
    blend: GlobalCompositeOperation = 'source-over',
    opacity = 1.0,
    angle = 0.0,
    flip: Vec2D = new Vec2D(1, 1),
    center = true
  ) {
    if (sprite.frames.length == 0) {
      // Assumes that the sprite will *eventually* load
      // Unless Sprite could not load image of course...
      return;
    }
    this.surface.imageSmoothingEnabled = false;
    this.surface.globalCompositeOperation = blend;
    this.surface.globalAlpha = opacity;
    this.surface.scale(flip.x, flip.y);

    const frame = sprite.frames[sprite.currentFrame];
    let point = aabb.center.copy();
    const dim = aabb.dim.copy();
    if (!dim.x && !dim.y) {
      dim.x = sprite.size.x;
      dim.y = sprite.size.y;
    }
    if (!center) {
      point = point.add(dim.scale(0.5));
    }
    this.surface.translate(point.x * flip.x, point.y * flip.y);
    this.surface.rotate(angle);
    this.surface.drawImage(
      sprite.img,
      Math.round(frame.x),
      Math.round(frame.y),
      Math.round(sprite.size.x),
      Math.round(sprite.size.y),
      Math.round(-dim.x / 2),
      Math.round(-dim.y / 2),
      Math.round(dim.x),
      Math.round(dim.y)
    );
    this.surface.setTransform(1, 0, 0, 1, 0, 0);
    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw a line segment on the surface.
   *
   * @param segment   Start and end points of the line
   * @param color     Target color or gradient
   * @param linewidth Width of the line
   * @param blend     Drawing blend mode
   */
  drawLine(
    segment: Segment,
    color: Color | ColorGradient,
    linewidth = 1,
    blend: GlobalCompositeOperation = 'source-over'
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;
    this.surface.strokeStyle = color.get();
    this.surface.lineWidth = linewidth;

    this.surface.beginPath();
    this.surface.moveTo(segment.start.x, segment.start.y);
    this.surface.lineTo(segment.stop.x, segment.stop.y);
    this.surface.stroke();

    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw a rectangular shape on the surface.
   *
   * @param aabb      Target bounding box
   * @param color     Target color or gradient
   * @param fill      Should the shape be filled?
   * @param linewidth Width of the outline
   * @param blend     Drawing blend mode
   * @param center    Should drawing be centered?
   */
  drawRect(
    aabb: AABB,
    color: Color | ColorGradient,
    fill = false,
    linewidth = 1,
    blend: GlobalCompositeOperation = 'source-over',
    center = true
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;

    let target: Vec2D;
    if (center) {
      target = aabb.min();
    } else {
      target = aabb.center;
    }
    if (fill) {
      this.surface.fillStyle = color.get();
      this.surface.fillRect(target.x, target.y, aabb.dim.x, aabb.dim.y);
    } else {
      this.surface.lineWidth = linewidth;
      this.surface.strokeStyle = color.get();
      this.surface.strokeRect(target.x, target.y, aabb.dim.x, aabb.dim.y);
    }
    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw a circular shape on the surface.
   *
   * @param center    Centered position of target
   * @param radius    Radius of the circle
   * @param color     Target color or gradient
   * @param fill      Should the shape be filled?
   * @param linewidth Width of the outline
   * @param blend     Drawing blend mode
   */
  drawCircle(
    center: Vec2D,
    radius: number,
    color: Color | ColorGradient,
    fill = false,
    linewidth = 1,
    blend: GlobalCompositeOperation = 'source-over'
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;
    this.surface.beginPath();
    this.surface.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    if (fill) {
      this.surface.fillStyle = color.get();
      this.surface.fill();
    } else {
      this.surface.lineWidth = linewidth;
      this.surface.strokeStyle = color.get();
      this.surface.stroke();
    }
    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw a polygon from a sorted list of points
   *
   * @param points    Sorted array of Vec2D points
   * @param color     Target color or gradient
   * @param fill      Should the shape be filled?
   * @param linewidth Width of the outline
   * @param blend     Drawing blend mode
   */
  drawPolygon(
    points: Vec2D[],
    color: Color | ColorGradient,
    fill = false,
    linewidth = 1,
    blend: GlobalCompositeOperation = 'source-over'
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;
    this.surface.beginPath();

    this.surface.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      this.surface.lineTo(p.x, p.y);
    }
    if (fill) {
      this.surface.fillStyle = color.get();
      this.surface.fill();
    } else {
      this.surface.lineWidth = linewidth;
      this.surface.strokeStyle = color.get();
      this.surface.stroke();
    }
    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = 'source-over';
  }

  /**
   * Render text on the surface.
   *
   * @param string Text to be rendered
   * @param font   Valid font family
   * @param size   Size of the font in pixels
   * @param color  Target color or gradient
   * @param pos    Centered position of target
   * @param blend  Drawing blend mode
   */
  drawText(
    string: string,
    font: string,
    size: number,
    color: Color | ColorGradient,
    pos: Vec2D,
    fill = true,
    linewidth = 1,
    bold = false,
    italic = false,
    align: CanvasTextAlign = 'left',
    blend: GlobalCompositeOperation = 'source-over'
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;

    let mods = '';
    if (bold) {
      mods += 'bold ';
    }
    if (italic) {
      mods += 'italic ';
    }
    this.surface.font = mods + size + 'px ' + font;
    this.surface.textAlign = align;
    if (fill) {
      this.surface.fillStyle = color.get();
      this.surface.fillText(string, pos.x, pos.y);
    } else {
      this.surface.strokeStyle = color.get();
      this.surface.lineWidth = linewidth;
      this.surface.strokeText(string, pos.x, pos.y);
    }

    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = 'source-over';
  }

  /**
   * Clear the entire surface.
   */
  clear() {
    this.surface.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export { Surface };
