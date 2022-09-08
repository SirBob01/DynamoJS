/**   Utility functions   **/

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

/**   Utility classes   **/

class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  /**
   * A wrapper for rgba values.
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

/**
 * Linear gradient parameters
 */
interface LinearGradient {
  type: 'linear';
  start: Vec2D;
  end: Vec2D;
}

/**
 * Radial gradient parameters
 */
interface RadialGradient {
  type: 'radial';
  in_pos: Vec2D;
  out_pos: Vec2D;
  in_r: number;
  out_r: number;
}

class ColorGradient {
  grad: CanvasGradient;
  a: number;

  /**
   * A wrapper for a canvas color gradient. It can
   * implement both LinearGradient and RadialGradient types.
   *
   * The parameters are dependent on gradient type:
   *     "linear" - {start (Vec2D), end (Vec2D)}
   *     "radial" - {in_pos (Vec2D), in_r (Number),
   *                 out_pos (Vec2D), out_r (Number)}
   *
   * @param surface    Target Surface object
   * @param parameters Gradient type-dependent parameters
   * @param alpha      Alpha value between [0, 255]
   * @return New ColorGradient object
   */
  constructor(
    surface: Surface,
    parameters: LinearGradient | RadialGradient,
    alpha = 255
  ) {
    if (parameters.type == 'linear') {
      this.grad = surface.surface.createLinearGradient(
        parameters.start.x,
        parameters.start.y,
        parameters.end.x,
        parameters.end.y
      );
    } else {
      this.grad = surface.surface.createRadialGradient(
        parameters.in_pos.x,
        parameters.in_pos.y,
        parameters.in_r,
        parameters.out_pos.x,
        parameters.out_pos.y,
        parameters.out_r
      );
    }
    this.a = alpha;
  }

  /**
   * Set a color at a position in the gradient.
   *
   * @param color Target color value
   * @param t    Position in gradient between [0, 1]
   */
  add_value(color: Color, t: number) {
    this.grad.addColorStop(t, color.get());
  }

  /**
   * Get the underlying canvas gradient object.
   *
   * @return Target CanvasGradient object
   */
  get() {
    return this.grad;
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
   * @param point   Test point
   * @return Is the point in bounds?
   */
  is_in_bounds(point: Vec2D) {
    const min = this.min();
    const max = this.max();

    const hor = point.x < max.x && point.x > min.x;
    const ver = point.y < max.y && point.y > min.y;
    return hor && ver;
  }

  /**
   * Test if the AABB is colliding with another.
   *
   * @param other   Paired AABB
   * @return Are bounding boxes colliding?
   */
  is_colliding(other: AABB) {
    const min = this.min();
    const max = this.max();

    const other_min = other.min();
    const other_max = other.max();

    const hor = other_max.x > min.x && other_min.x < max.x;
    const ver = other_max.y > min.y && other_min.y < max.y;
    return hor && ver;
  }
}

class Sprite {
  img: HTMLImageElement;
  frames: Vec2D[];
  accumulator: number;
  current_frame: number;
  finished: boolean;
  max_frames: number;
  size: Vec2D;

  /**
   * An animated sprite from an image file.
   *
   * @param file      Filepath to the target image
   * @param frame_x   Width of each frame
   * @param frame_y   Height of each frame
   * @param nframes   Maximum number of frames
   * @param callback  On-load callback function
   * @return Sprite object
   */
  constructor(
    file: string,
    frame_x = 0,
    frame_y = 0,
    nframes = 0,
    callback: (sprite: Sprite) => void = () => {}
  ) {
    this.img = new Image();
    this.img.src = file;
    this.frames = [];

    this.accumulator = 0;
    this.current_frame = 0;
    this.finished = false;
    this.max_frames = nframes;
    this.size = new Vec2D(0, 0);

    // TODO: Synchronize image loading... pain in the ass
    this.img.onload = () => {
      if (frame_x == 0 || frame_y == 0) {
        this.size = new Vec2D(this.img.width, this.img.height);
      } else {
        this.size = new Vec2D(frame_x, frame_y);
      }

      const hor_frames = this.img.width / this.size.x;
      const ver_frames = this.img.height / this.size.y;
      if (this.max_frames == 0) {
        this.max_frames = hor_frames * ver_frames;
      }

      // Calculate individual frame coordinates
      for (let j = 0; j < ver_frames; j++) {
        for (let i = 0; i < hor_frames; i++) {
          this.frames.push(new Vec2D(i * this.size.x, j * this.size.y));
        }
      }
      // Workaround for asynchronous load
      if (callback) {
        callback(this);
      }
    };
    this.img.onerror = () => {
      throw new Error('Could not load image file ' + file);
    };
  }

  /**
   * Animate the sprite and update its current frame.
   * Call it on every tick.
   *
   * @param dt   Delta-time from previous tick
   * @param fps  Animation rate
   * @param loop Does the animation loop?
   */
  animate(dt: number, fps: number, loop = false) {
    this.accumulator += dt;
    if (this.accumulator >= 1000.0 / fps) {
      this.current_frame++;
      this.accumulator = 0;
    }
    if (this.current_frame > this.max_frames - 1) {
      if (loop) {
        this.current_frame = 0;
      } else {
        this.current_frame = this.max_frames - 1;
        this.finished = true;
      }
    }
  }
}

/**   Core modules   **/

class Surface {
  canvas: HTMLCanvasElement;
  surface: CanvasRenderingContext2D;

  /**
   * A base surface for targeted rendering.
   *
   * @param w      Width of the surface
   * @param h      Height of the surface
   * @param canvas Target canvas element
   * @return New Surface object
   */
  constructor(w = 0, h = 0, canvas: HTMLCanvasElement | null = null) {
    if (!canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = w;
      this.canvas.height = h;
    } else {
      this.canvas = canvas;

      // Get actual size of the canvas
      const { width, height } = canvas.getBoundingClientRect();
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.surface = this.canvas.getContext('2d')!;

    // TODO: Why the fuck does this work? Figure this out soon pls.
    this.surface.imageSmoothingEnabled = false;
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
    sub.surface.drawImage(
      this.canvas,
      target.x,
      target.y,
      aabb.dim.x,
      aabb.dim.y,
      0,
      0,
      aabb.dim.x,
      aabb.dim.y
    );
    return sub;
  }

  /**
   * Fill the entire surface with a color or gradient.
   *
   * @param color Target color or gradient
   */
  fill(color: Color) {
    this.draw_rect(this.rect(), color, true);
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
  draw_surface(
    src: Surface,
    aabb: AABB,
    blend: GlobalCompositeOperation = 'source-over',
    opacity = 1.0,
    angle = 0.0,
    flip: Vec2D = new Vec2D(1, 1),
    center = true
  ) {
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
      -aabb.dim.x / 2,
      -aabb.dim.y / 2,
      aabb.dim.x,
      aabb.dim.y
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
  draw_sprite(
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
    this.surface.globalCompositeOperation = blend;
    this.surface.globalAlpha = opacity;
    this.surface.scale(flip.x, flip.y);

    const frame = sprite.frames[sprite.current_frame];
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
      frame.x,
      frame.y,
      sprite.size.x,
      sprite.size.y,
      -dim.x / 2,
      -dim.y / 2,
      dim.x,
      dim.y
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
  draw_line(
    segment: Segment,
    color: Color,
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
  draw_rect(
    aabb: AABB,
    color: Color,
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
  draw_circle(
    center: Vec2D,
    radius: number,
    color: Color,
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
  draw_polygon(
    points: Vec2D[],
    color: Color,
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
  draw_text(
    string: string,
    font: string,
    size: number,
    color: Color,
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

/**
 * Audio track meta information
 */
interface AudioTrack {
  media: HTMLAudioElement;
  loops: number;
  fadein: number;
  start: boolean;
  skipped: boolean;
  source_node: MediaElementAudioSourceNode;
  panner_node: PannerNode;
  gain_node: GainNode;
  user_inf: {
    volume: number;
    position: Vec2D;
  };
}

class AudioStream {
  max_volume: number;
  volume: number;
  tracks: AudioTrack[];
  is_playing: boolean;

  /**
   * Long audio tracks, like music or dialogue
   */
  constructor() {
    this.max_volume = 1.0;
    this.volume = 1.0;
    this.tracks = [];
    this.is_playing = true;
  }
}

class Jukebox {
  private context: AudioContext;
  private sounds: Map<string, AudioBuffer>;
  private streams: Map<string, AudioStream>;
  volume: number;
  max_distance: number;

  /**
   * The audio engine.
   *
   * @return New Jukebox object
   */
  constructor() {
    this.context = new AudioContext();
    this.volume = 1.0;
    this.max_distance = 1000;

    this.sounds = new Map();
    this.streams = new Map();
  }

  /**
   * Load a sound from a URL and map it to an ID.
   *
   * @param url Valid URL to an audio file
   * @param id  Key value for mapping
   */
  load_sound(url: string) {
    const request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.onreadystatechange = () => {
      if (request.status == 200 && request.readyState == 4) {
        this.context.decodeAudioData(
          request.response,
          (buffer) => {
            this.sounds.set(url, buffer);
          },
          (err) => {
            throw new Error('Error decoding ' + url + ': ' + err);
          }
        );
      }
    };
    request.open('GET', url, true);
    request.send();
  }

  /**
   * Play a sound effect.
   *
   * @param url      Valid URL to an audio file
   * @param volume   Volume of sound between [0, 1]
   * @param position Location of the sound relative to origin
   */
  play_sound(url: string, volume: number, position: Vec2D) {
    const buffer = this.sounds.get(url);
    if (!buffer) {
      this.load_sound(url);
      return;
    }

    const source_node = this.context.createBufferSource();
    const gain_node = this.context.createGain();
    const panner_node = this.context.createPanner();

    source_node.connect(panner_node);
    panner_node.connect(gain_node);
    gain_node.connect(this.context.destination);

    // Set initial values
    source_node.buffer = buffer;

    panner_node.panningModel = 'equalpower';
    panner_node.distanceModel = 'linear';
    panner_node.refDistance = 1;
    panner_node.maxDistance = this.max_distance;
    panner_node.rolloffFactor = 1;
    panner_node.coneInnerAngle = 360;
    panner_node.coneOuterAngle = 0;
    panner_node.coneOuterGain = 0;

    panner_node.positionX.setValueAtTime(position.x, this.context.currentTime);
    panner_node.positionZ.setValueAtTime(position.y, this.context.currentTime);

    gain_node.gain.value = volume * this.volume;

    source_node.start(0);
  }

  /**
   * Create a new audio stream.
   *
   * @param stream Name of the stream
   */
  create_stream(stream: string) {
    this.streams.set(stream, new AudioStream());
  }

  /**
   * Queue a new track onto the stream.
   *
   * @param stream   Name of the stream
   * @param url      Valid URL to an audio file
   * @param volume   Volume of sound between [0, 1]
   * @param fadein   Fade in time in seconds
   * @param loops    Number of repetitions (-1 for infinite)
   * @param position Location of the sound relative to origin
   * @return User-accessible track information
   */
  queue_stream(
    stream: string,
    url: string,
    volume: number,
    fadein: number,
    loops: number,
    position: Vec2D
  ) {
    if (!this.streams.has(stream)) {
      throw new Error('"' + stream + '" audio stream does not exist.');
    }
    const media = new Audio();
    const track: AudioTrack = {
      media,
      loops,
      fadein,
      start: false,
      skipped: false,

      source_node: this.context.createMediaElementSource(media),
      panner_node: this.context.createPanner(),
      gain_node: this.context.createGain(),

      user_inf: {
        volume,
        position,
      },
    };
    media.src = url;
    media.crossOrigin = 'anonymous';

    // Set node values
    track.panner_node.panningModel = 'equalpower';
    track.panner_node.distanceModel = 'linear';
    track.panner_node.refDistance = 1;
    track.panner_node.maxDistance = this.max_distance;
    track.panner_node.rolloffFactor = 1;
    track.panner_node.coneInnerAngle = 360;
    track.panner_node.coneOuterAngle = 0;
    track.panner_node.coneOuterGain = 0;

    // Connect audio nodes
    track.source_node.connect(track.panner_node);
    track.panner_node.connect(track.gain_node);
    track.gain_node.connect(this.context.destination);

    // Enqueue the track
    const tracks = this.streams.get(stream)?.tracks;
    if (!tracks) {
      throw new Error(`"${stream}" stream does not exist.`);
    }
    tracks.push(track);
    return track.user_inf;
  }

  /**
   * Skip the current track on a stream.
   *
   * @param stream  Name of the stream
   * @param fadeout Fade out time in seconds
   */
  skip_stream(stream: string, fadeout = 0) {
    const s = this.streams.get(stream);
    if (!s) {
      throw new Error('"' + stream + '" audio stream does not exist.');
    }
    if (s.tracks.length == 0) {
      return;
    }
    const current = s.tracks[0];
    current.skipped = true;

    // Cancel any occurring fades
    const gain_now = current.gain_node.gain.value;
    current.gain_node.gain.cancelScheduledValues(this.context.currentTime);
    current.gain_node.gain.value = gain_now;

    // Fade out
    current.gain_node.gain.linearRampToValueAtTime(
      0,
      this.context.currentTime + fadeout
    );
  }

  /**
   * Clear all tracks on the stream.
   *
   * @param stream  Name of the stream
   * @param fadeout Fade out time in seconds
   */
  clear_stream(stream: string, fadeout = 0) {
    const tracks = this.streams.get(stream)?.tracks;
    if (!tracks) {
      throw new Error('"' + stream + '" audio stream does not exist.');
    }
    this.skip_stream(stream, fadeout);
    tracks.splice(0, tracks.length);
  }

  /**
   * Update all streams.
   */
  update() {
    this.streams.forEach((stream) => {
      if (stream.tracks.length == 0) {
        return;
      }
      const current = stream.tracks[0];

      // Keep track of position
      current.panner_node.positionX.setValueAtTime(
        current.user_inf.position.x,
        this.context.currentTime
      );
      current.panner_node.positionZ.setValueAtTime(
        current.user_inf.position.y,
        this.context.currentTime
      );

      // Handle starting
      if (!current.start) {
        // Set fade effects
        current.gain_node.gain.value = 0;
        current.gain_node.gain.linearRampToValueAtTime(
          current.user_inf.volume * this.volume,
          this.context.currentTime + current.fadein
        );
        current.media.play();
        current.start = true;
      }

      // Handle skipping
      if (current.skipped && current.gain_node.gain.value == 0) {
        current.media.pause();
        stream.tracks.shift();
      }

      // Handle ending
      if (current.media.ended) {
        current.start = false;
        if (current.loops != 0) {
          current.loops--;
        } else {
          stream.tracks.shift();
        }
      }
    });
  }
}

class Input {
  private state: Map<string, boolean>;
  private pressed: Map<string, boolean>;
  private released: Map<string, boolean>;
  unregister_handlers: () => void;
  mouse: Vec2D;

  /**
   * The main input handler.
   */
  constructor() {
    this.state = new Map();
    this.pressed = new Map();
    this.released = new Map();
    this.unregister_handlers = () => {};

    this.mouse = new Vec2D(0, 0);
  }

  /**
   * Get the state of an input.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse1 - Mouse3.
   *
   * @param key  Target input to be tested
   * @return Is the input pressed or released?
   */
  get_state(key: string) {
    return this.state.get(key) ?? false;
  }

  /**
   * Check if input is pressed on the current frame.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse1 - Mouse3.
   *
   * @param key  Target input to be tested
   * @return Is the input pressed this frame?
   */
  get_pressed(key: string) {
    return this.pressed.get(key) ?? false;
  }

  /**
   * Check if input is released on the current frame.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse1 - Mouse3.
   *
   * @param key  Target input to be tested
   * @return Is the input released this frame?
   */
  get_released(key: string) {
    return this.released.get(key) ?? false;
  }

  /**
   * Continuously read user input.
   *
   * @param canvas Target canvas element
   */
  poll(canvas: HTMLCanvasElement) {
    const keydown = (event: KeyboardEvent) => {
      this.state.set(event.key, true);
      this.pressed.set(event.key, true);
    };
    const keyup = (event: KeyboardEvent) => {
      this.state.set(event.key, false);
      this.released.set(event.key, true);
    };
    const mousedown = (event: MouseEvent) => {
      const key = 'Mouse' + event.button;
      this.state.set(key, true);
      this.pressed.set(key, true);
    };
    const mouseup = (event: MouseEvent) => {
      const key = 'Mouse' + event.button;
      this.state.set(key, false);
      this.released.set(key, true);
    };
    const mousemove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      this.mouse.x = (event.clientX - rect.left) * scaleX;
      this.mouse.y = (event.clientY - rect.top) * scaleY;
    };

    // Handler to prevent opening menu when right-clicking the canvas
    const canvas_contextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    // Register
    document.removeEventListener('keydown', keydown);
    document.removeEventListener('keyup', keyup);
    document.removeEventListener('mousedown', mousedown);
    document.removeEventListener('mouseup', mouseup);
    document.removeEventListener('mousemove', mousemove);
    canvas.addEventListener('contextmenu', canvas_contextmenu, false);

    // Store a function to unregister everything
    this.unregister_handlers = () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
      document.removeEventListener('mousedown', mousedown);
      document.removeEventListener('mouseup', mouseup);
      document.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('contextmenu', canvas_contextmenu, false);
    };
  }

  /**
   * Reset the pressed and released values.
   */
  refresh() {
    this.pressed.forEach((_, key) => {
      this.pressed.set(key, false);
    });
    this.released.forEach((_, key) => {
      this.released.set(key, false);
    });
  }
}

/**
 * Clock stores per-frame delta time information
 */
interface Clock {
  dt: number;
  dt_cap: number;
}

abstract class GameState {
  next: GameState | null;
  kill: boolean;
  transition: boolean;

  /**
   * A game state. User logic should be implemented
   * in a class that inherits from GameState.
   *
   * @return New GameState object
   */
  constructor() {
    this.next = null;
    this.kill = false;
    this.transition = false;
  }

  /**
   * Set the next state for transitioning.
   *
   * @param next GameState after transitioning
   * @param kill Should the current state be killed?
   */
  set_next(next: GameState | null = null, kill = true) {
    this.next = next;
    this.kill = kill;
    this.transition = true;
  }

  /**
   * Load the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract on_entry(core: Core): void;

  /**
   * Exit the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract on_exit(core: Core): void;

  /**
   * Update the state at every frame. This can be overriden.
   * This is called throughout its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract update(core: Core): void;
}

class Core {
  display: Surface;
  audio: Jukebox;
  input: Input;
  clock: Clock;

  /**
   * Container for all the core modules of the engine
   */
  constructor() {
    const element = document.getElementById('display');
    if (!element) {
      throw new Error('Could not find canvas with id `display`');
    }
    this.display = new Surface(0, 0, element as HTMLCanvasElement);
    this.audio = new Jukebox();
    this.input = new Input();
    this.clock = {
      dt: 0,
      dt_cap: 100, // Protect integration from breaking
    };
  }
}

class Engine {
  private states: GameState[];
  private running: boolean;
  private animationRequestId: number;
  private core: Core;

  /**
   * The main DynamoJS engine.
   *
   * @param initial_state Initial state of the application
   * @return New Engine object
   */
  constructor(initial_state: GameState) {
    /** @private */
    this.core = new Core();

    /** @private */
    this.states = [initial_state];

    /** @private */
    this.running = true;

    /** @private */
    this.animationRequestId = 0;

    initial_state.on_entry(this.core);
    this.core.input.poll(this.core.display.canvas);
  }

  /**
   * Execute a single tick to update the game state.
   */
  tick() {
    this.core.display.clear();

    const current_state = this.states[this.states.length - 1];
    const next = current_state.next;

    if (current_state.transition) {
      if (current_state.kill) {
        current_state.on_exit(this.core);
        this.states.pop();
      } else {
        current_state.transition = false;
      }
      if (next) {
        next.on_entry(this.core);
        this.states.push(next);
      }
    } else {
      current_state.update(this.core);
    }
    this.core.audio.update();
    this.core.input.refresh();
  }

  /**
   * The main() function for a DynamoJS program.
   * Persistently run the application.
   */
  run() {
    let last_time = 0;
    const callback = (elapsed: number) => {
      this.core.clock.dt = clamp(
        elapsed - last_time,
        0,
        this.core.clock.dt_cap
      );
      last_time = elapsed;
      this.tick();

      if (this.running) {
        this.animationRequestId = window.requestAnimationFrame(callback);
      } else if (this.animationRequestId) {
        window.cancelAnimationFrame(this.animationRequestId);
      }
    };
    this.animationRequestId = window.requestAnimationFrame(callback);
  }

  /**
   * Destroy this engine instance
   */
  destroy() {
    this.running = false;
    this.core.input.unregister_handlers();
  }
}

export {
  lerp,
  clamp,
  randrange,
  Color,
  ColorGradient,
  Vec2D,
  Segment,
  AABB,
  Sprite,
  Surface,
  AudioStream,
  Jukebox,
  Input,
  GameState,
  Core,
  Engine,
};
