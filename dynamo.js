/**   Utility functions   **/

/**
 * Linearly interpolate between two values.
 *
 * @param  {Number} a   Start value
 * @param  {Number} b   End value
 * @param  {Number} t   Value in the range [0, 1]
 * @return {Number}     Value between a and b
 */
function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

/**
 * Clamp a value between a minimum and maximum
 *
 * @param  {Number} x       Target value
 * @param  {Number} min     Minimum value
 * @param  {Number} max     Maximum value
 * @return {Number}         Clamped value
 */
function clamp(x, min, max) {
  return Math.min(max, Math.max(x, min));
}

/**
 * Generate a random floating point number in [min, max)
 *
 * @param  {Number} min Minimum value of range
 * @param  {Number} max Maximum value of range
 * @return {Number}     Random number
 */
function randrange(min, max) {
  return min + (max - min) * Math.random();
}

/**   Utility classes   **/

class Color {
  /**
   * A wrapper for rgba values.
   *
   * @param  {Number} r   Red value in range [0, 255]
   * @param  {Number} g   Green value in range [0, 255]
   * @param  {Number} b   Blue value in range [0, 255]
   * @param  {Number} a   Alpha channel in range [0, 255]
   * @return {Color}      New color object
   */
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Create a new copy of the current color.
   *
   * @return {Color} New color object
   */
  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * Linearly interpolate to another color.
   *
   * @param  {Color}  target  Target color
   * @param  {Number} t       Value between [0, 1]
   * @return {Color}          Resultant color
   */
  lerp(target, t) {
    var r = lerp(this.r, target.r, t);
    var g = lerp(this.g, target.g, t);
    var b = lerp(this.b, target.b, t);
    var a = lerp(this.a, target.a, t);
    return new Color(r, g, b, a);
  }

  /**
   * Generate the valid HTML string in rgba format.
   *
   * @return {String} RGBA string
   */
  get() {
    return (
      "rgb(" +
      clamp(Math.round(this.r), 0, 255) +
      "," +
      clamp(Math.round(this.g), 0, 255) +
      "," +
      clamp(Math.round(this.b), 0, 255) +
      "," +
      clamp(Math.round(this.a), 0, 255) +
      ")"
    );
  }

  /**
   * Get the normalized alpha value.
   *
   * @return {Number} Alpha value between [0, 1]
   */
  alpha() {
    return this.a / 255.0;
  }
}

class ColorGradient {
  /**
   * A wrapper for a canvas color gradient. It can
   * implement both LinearGradient and RadialGradient types.
   *
   * The values parameter is dependent on gradient type:
   *     "linear" - {start (Vec2D), end (Vec2D)}
   *     "radial" - {in_pos (Vec2D), in_r (Number),
   *                 out_pos (Vec2D), out_r (Number)}
   *
   * @param  {Surface} surface    Target Surface object
   * @param  {String}  type       Type of gradient (linear or radial)
   * @param  {Object}  values     Gradient type-dependent parameters
   * @param  {Number}  alpha      Alpha value between [0, 255]
   * @return {ColorGradient}      New ColorGradient object
   */
  constructor(surface, type, values, alpha = 255) {
    if (type == "linear") {
      this.grad = surface.surface.createLinearGradient(
        values.start.x,
        values.start.y,
        values.end.x,
        values.end.y
      );
    } else {
      this.grad = surface.surface.createRadialGradient(
        values.in_pos.x,
        values.in_pos.y,
        values.in_r,
        values.out_pos.x,
        values.out_pos.y,
        values.out_r
      );
    }
    this.a = alpha;
  }

  /**
   * Set a color at a position in the gradient.
   *
   * @param {Color} color Target color value
   * @param {Number} t    Position in gradient between [0, 1]
   */
  add_value(color, t) {
    this.grad.addColorStop(t, color.get());
  }

  /**
   * Get the underlying canvas gradient object.
   *
   * @return {CanvasGradient} Target CanvasGradient object
   */
  get() {
    return this.grad;
  }

  /**
   * Get the normalized alpha value.
   *
   * @return {Number} Alpha value between [0, 1]
   */
  alpha() {
    return this.a / 255.0;
  }
}

class Vec2D {
  /**
   * A 2D vector.
   *
   * @param  {Number} x   X-coordinate
   * @param  {Number} y   Y-coordinate
   * @return {Vec2D}      New Vec2D object
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Create a copy of the current vector.
   *
   * @return {Vec2D} New Vec2D object
   */
  copy() {
    return new Vec2D(this.x, this.y);
  }

  /**
   * Test if a vector is equivalent to the current one.
   * @param  {Vec2D}   b Other vector
   * @return {Boolean}   Are the vectors equal?
   */
  equals(b) {
    return this.x == b.x && this.y == b.y;
  }

  /**
   * Add a new vector to the current one.
   *
   * @param  {Vec2D} b Addend vector
   * @return {Vec2D}   Resultant sum of the vectors
   */
  add(b) {
    return new Vec2D(this.x + b.x, this.y + b.y);
  }

  /**
   * Subtract a vector from the current one.
   *
   * @param  {Vec2D} b Subtrahend vector
   * @return {Vec2D}   Resultant difference of the vectors
   */
  sub(b) {
    return new Vec2D(this.x - b.x, this.y - b.y);
  }

  /**
   * Multiply the current vector by a scalar value.
   *
   * @param  {Number} s Scalar value
   * @return {Vec2D}    Resultant product
   */
  scale(s) {
    return new Vec2D(this.x * s, this.y * s);
  }

  /**
   * Calculate the dot product with another vector.
   *
   * @param  {Vec2D}  b Other vector
   * @return {Number}   Resultant dot product
   */
  dot(b) {
    return this.x * b.x + this.y * b.y;
  }

  /**
   * Get the squared length of the vector.
   *
   * @return {Number} Squared length
   */
  length_sq() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Get the cartesian length of the vector.
   *
   * @return {Number} Cartesian length
   */
  length() {
    return Math.sqrt(this.length_sq());
  }

  /**
   * Get the unit vector.
   *
   * @return {Vec2D} Directional vector of length 1.
   */
  unit() {
    var length = this.length();
    return new Vec2D(this.x / length, this.y / length);
  }

  /**
   * Get the array representation of the vector.
   *
   * @return {Number[]} Ordered list of coordinate values
   */
  get() {
    return [this.x, this.y];
  }

  /**
   * Grab the string representation of the vector.
   *
   * @return {String} Comma-separated values
   */
  to_string() {
    return this.x + "," + this.y;
  }

  /**
   * Create a new Vec2D object from a comma-separated string.
   *
   * @param  {String} string Comma-separated values
   * @return {Vec2D}         New Vec2D object
   */
  static from_string(string) {
    var vals = string.split(",");
    return new Vec2D(parseFloat(vals[0]), parseFloat(vals[1]));
  }
}

class Segment {
  /**
   * A line segment.
   *
   * @param  {Vec2D}   start Coordinates of the starting point
   * @param  {Vec2D}   stop  Coordinates of the stopping point
   * @return {Segment}       New Segment object
   */
  constructor(start, stop) {
    this.start = start;
    this.stop = stop;
  }

  /**
   * Create a copy of the current segment.
   *
   * @return {Segment} New Segment object
   */
  copy() {
    return new Segment(this.start, this.stop);
  }

  /**
   * Test if the current segment is parallel with another.
   *
   * @param  {Segment}  segment The other segment to test
   * @return {Boolean}          Are the segments parallel?
   */
  is_parallel(segment) {
    var m1 = (this.stop.y - this.start.y) / (this.stop.x - this.start.x);
    var m2 =
      (segment.stop.y - segment.start.y) / (segment.stop.x - segment.start.x);
    return m1 == m2;
  }
}

class AABB {
  /**
   * An axis-aligned bounding box.
   *
   * @param  {Number} x   X-coordinate of the center
   * @param  {Number} y   Y-coordinate of the center
   * @param  {Number} w   Width of the bounding box
   * @param  {Number} h   Height of the bounding box
   * @return {AABB}       New AABB object
   */
  constructor(x, y, w, h) {
    this.center = new Vec2D(x, y);
    this.dim = new Vec2D(w, h);
  }

  /**
   * Create a copy of the current AABB.
   *
   * @return {AABB} New AABB object
   */
  copy() {
    return new AABB(this.center.x, this.center.y, this.dim.x, this.dim.y);
  }

  /**
   * Get the upper-left corner of the AABB.
   *
   * @return {Vec2D} Coordinates of the upperleft corner
   */
  min() {
    return this.center.sub(this.dim.scale(0.5));
  }

  /**
   * Get the bottom-right corner of the AABB.
   *
   * @return {Vec2D} Coordinates of the bottom-right corner
   */
  max() {
    return this.center.add(this.dim.scale(0.5));
  }

  /**
   * Get the left side of the AABB.
   *
   * @return {Segment} Line segment of the left face
   */
  left() {
    var tl = this.min();
    var bl = this.max();
    bl.x -= this.dim.x;
    return new Segment(tl, bl);
  }

  /**
   * Get the right side of the AABB.
   *
   * @return {Segment} Line segment of the right face
   */
  right() {
    var tr = this.min();
    var br = this.max();
    tr.x += this.dim.x;
    return new Segment(tr, br);
  }

  /**
   * Get the top side of the AABB.
   *
   * @return {Segment} Line segment of the top face
   */
  top() {
    var tl = this.min();
    var tr = this.min();
    tr.x += this.dim.x;
    return new Segment(tl, tr);
  }

  /**
   * Get the bottom side of the AABB.
   *
   * @return {Segment} Line segment of the bottom face
   */
  bottom() {
    var bl = this.max();
    var br = this.max();
    bl.x -= this.dim.x;
    return new Segment(bl, br);
  }

  /**
   * Test if a point is within the AABB.
   *
   * @param  {Vec2D}   point   Test point
   * @return {Boolean}         Is the point in bounds?
   */
  is_in_bounds(point) {
    var min = this.min();
    var max = this.max();

    var hor = point.x < max.x && point.x > min.x;
    var ver = point.y < max.y && point.y > min.y;
    return hor && ver;
  }

  /**
   * Test if the AABB is colliding with another.
   *
   * @param  {AABB}    other   Paired AABB
   * @return {Boolean}         Are bounding boxes colliding?
   */
  is_colliding(other) {
    var min = this.min();
    var max = this.max();

    var other_min = other.min();
    var other_max = other.max();

    var hor = other_max.x > min.x && other_min.x < max.x;
    var ver = other_max.y > min.y && other_min.y < max.y;
    return hor && ver;
  }
}

/**
 * @callback spriteCallback
 * @param {Sprite} sprite
 * @return {void}
 */

class Sprite {
  /**
   * An animated sprite from an image file.
   *
   * @param  {String}                file      Filepath to the target image
   * @param  {Number}                frame_x   Width of each frame
   * @param  {Number}                frame_y   Height of each frame
   * @param  {Number}                nframes   Maximum number of frames
   * @param  {null | spriteCallback} callback  On-load callback function
   * @return {Sprite}                          Sprite object
   */
  constructor(file, frame_x = 0, frame_y = 0, nframes = 0, callback = null) {
    this.img = new Image();
    this.img.src = file;

    this.frames = [];

    this.accumulator = 0;
    this.current_frame = 0;
    this.finished = false;
    this.max_frames = nframes;

    // TODO: Synchronize image loading... pain in the ass
    var _this = this;
    this.img.onload = function () {
      if (frame_x == 0 || frame_y == 0) {
        _this.size = new Vec2D(_this.img.width, _this.img.height);
      } else {
        _this.size = new Vec2D(frame_x, frame_y);
      }

      var hor_frames = _this.img.width / _this.size.x;
      var ver_frames = _this.img.height / _this.size.y;
      if (this.max_frames == 0) {
        this.max_frames = hor_frames * ver_frames;
      }

      // Calculate individual frame coordinates
      for (var j = 0; j < ver_frames; j++) {
        for (var i = 0; i < hor_frames; i++) {
          _this.frames.push(new Vec2D(i * _this.size.x, j * _this.size.y));
        }
      }
      // Workaround for asynchronous load
      if (callback) {
        callback(_this);
      }
    };
    this.img.onerror = function () {
      throw "Could not load image file " + file;
    };
  }

  /**
   * Animate the sprite and update its current frame.
   * Call it on every tick.
   *
   * @param  {Number}  dt   Delta-time from previous tick
   * @param  {Number}  fps  Animation rate
   * @param  {Boolean} loop Does the animation loop?
   */
  animate(dt, fps, loop = false) {
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
  /**
   * A base surface for targeted rendering.
   *
   * @param  {Number}  w      Width of the surface
   * @param  {Number}  h      Height of the surface
   * @param  {Element} canvas Target canvas element
   * @return {Surface}        New Surface object
   */
  constructor(w = 0, h = 0, canvas = null) {
    if (!canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = w;
      this.canvas.height = h;
    } else {
      this.canvas = canvas;

      // Get actual size of the canvas
      const { width, height } = canvas.getBoundingClientRect();
      this.canvas.width = width;
      this.canvas.height = height;

      // Refresh when window is resized
      var _this = this;
      window.addEventListener("resize", function (event) {
        const { width, height } = _this.canvas.getBoundingClientRect();
        _this.canvas.width = width;
        _this.canvas.height = height;
      });
    }
    this.surface = this.canvas.getContext("2d");

    // TODO: Why the fuck does this work? Figure this out soon pls.
    this.surface.imageSmoothingEnabled = false;
  }

  /**
   * Get the bounds of the surface.
   *
   * @param  {Boolean} center Should bounding box be centered?
   * @return {AABB}           Bouding box of the surface
   */
  rect(center = true) {
    var aabb = new AABB(
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
   * @param  {AABB}    aabb    Size and location of subsurface
   * @param  {Boolean} center  Should coordinates be centered?
   * @return {Surface}         New Surface object
   */
  subsurface(aabb, center = false) {
    var sub = new Surface(aabb.dim.x, aabb.dim.y);
    var target;
    if (center) {
      target = aabb.min();
    } else {
      target = aabb.center;
    }
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
   * @param  {Color | ColorGradient} color Target color or gradient
   */
  fill(color) {
    this.draw_rect(this.rect(), color, true);
  }

  /**
   * Draw another surface on top of the current one.
   *
   * @param  {Surface} src     Source surface to be drawn
   * @param  {AABB}    aabb    Target bounding box for stretching
   * @param  {String}  blend   Drawing blend mode
   * @param  {Number}  opacity Transparency value
   * @param  {Number}  angle   Angular rotation in radians
   * @param  {Vec2D}   flip    Flip factor of the image
   * @param  {Boolean} center  Should drawing be centered?
   */
  draw_surface(
    src,
    aabb,
    blend = "source-over",
    opacity = 1.0,
    angle = 0.0,
    flip = new Vec2D(1, 1),
    center = true
  ) {
    this.surface.globalCompositeOperation = blend;
    this.surface.globalAlpha = opacity;
    this.surface.scale(flip.x, flip.y);

    var point = aabb.center.copy();
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
    this.surface.globalCompositeOperation = "source-over";
  }

  /**
   * Draw a sprite on the surface.
   *
   * @param  {Sprite}  sprite  Source sprite to be drawn
   * @param  {AABB}    aabb    Target bounding box for stretching
   * @param  {String}  blend   Drawing blend mode
   * @param  {Number}  opacity Transparency value
   * @param  {Number}  angle   Angular rotation in radians
   * @param  {Vec2D}   flip    Flip factor of the image
   * @param  {Boolean} center  Should drawing be centered?
   */
  draw_sprite(
    sprite,
    aabb,
    blend = "source-over",
    opacity = 1.0,
    angle = 0.0,
    flip = new Vec2D(1, 1),
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

    var frame = sprite.frames[sprite.current_frame];
    var point = aabb.center.copy();
    var dim = aabb.dim.copy();
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
    this.surface.globalCompositeOperation = "source-over";
  }

  /**
   * Draw a line segment on the surface.
   *
   * @param  {Segment}                 segment   Start and end points of the line
   * @param  {Color | ColorGradient}   color     Target color or gradient
   * @param  {Number}                  linewidth Width of the line
   * @param  {String}                  blend     Drawing blend mode
   */
  draw_line(segment, color, linewidth = 1, blend = "source-over") {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;
    this.surface.strokeStyle = color.get();
    this.surface.lineWidth = linewidth;

    this.surface.beginPath();
    this.surface.moveTo(segment.start.x, segment.start.y);
    this.surface.lineTo(segment.stop.x, segment.stop.y);
    this.surface.stroke();

    this.surface.globalAlpha = 1.0;
    this.surface.globalCompositeOperation = "source-over";
  }

  /**
   * Draw a rectangular shape on the surface.
   *
   * @param  {AABB}                  aabb      Target bounding box
   * @param  {Color | ColorGradient} color     Target color or gradient
   * @param  {Boolean}               fill      Should the shape be filled?
   * @param  {Number}                linewidth Width of the outline
   * @param  {String}                blend     Drawing blend mode
   * @param  {Boolean}               center    Should drawing be centered?
   */
  draw_rect(
    aabb,
    color,
    fill = false,
    linewidth = 1,
    blend = "source-over",
    center = true
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;

    var target;
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
    this.surface.globalCompositeOperation = "source-over";
  }

  /**
   * Draw a circular shape on the surface.
   *
   * @param  {Vec2D}                 center    Centered position of target
   * @param  {Number}                radius    Radius of the circle
   * @param  {Color | ColorGradient} color     Target color or gradient
   * @param  {Boolean}               fill      Should the shape be filled?
   * @param  {Number}                linewidth Width of the outline
   * @param  {String}                blend     Drawing blend mode
   */
  draw_circle(
    center,
    radius,
    color,
    fill = false,
    linewidth = 1,
    blend = "source-over"
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
    this.surface.globalCompositeOperation = "source-over";
  }

  /**
   * Draw a polygon from a sorted list of points
   *
   * @param  {Vec2D[]}               points    Sorted array of Vec2D points
   * @param  {Color | ColorGradient} color     Target color or gradient
   * @param  {Boolean}               fill      Should the shape be filled?
   * @param  {Number}                linewidth Width of the outline
   * @param  {String}                blend     Drawing blend mode
   */
  draw_polygon(
    points,
    color,
    fill = false,
    linewidth = 1,
    blend = "source_over"
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;
    this.surface.beginPath();

    this.surface.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      var p = points[i];
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
    this.surface.globalCompositeOperation = "source-over";
  }

  /**
   * Render text on the surface.
   *
   * @param  {String}                string Text to be rendered
   * @param  {String}                font   Valid font family
   * @param  {Number}                size   Size of the font in pixels
   * @param  {Color | ColorGradient} color  Target color or gradient
   * @param  {Vec2D}                 pos    Centered position of target
   * @param  {String}                blend  Drawing blend mode
   */
  draw_text(
    string,
    font,
    size,
    color,
    pos,
    fill = true,
    linewidth = 1,
    bold = false,
    italic = false,
    align = "left",
    blend = "source-over"
  ) {
    this.surface.globalAlpha = color.alpha();
    this.surface.globalCompositeOperation = blend;

    var mods = "";
    if (bold) {
      mods += "bold ";
    }
    if (italic) {
      mods += "italic ";
    }
    this.surface.font = mods + size + "px " + font;
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
    this.surface.globalCompositeOperation = "source-over";
  }

  /**
   * Clear the entire surface.
   */
  clear() {
    this.surface.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class AudioStream {
  /**
   * Meta data for long audio tracks, like music or dialogue
   */
  constructor() {
    this.max_volume = 1.0;
    this.volume = 1.0;
    this.tracks = [];
    this.is_playing = true;
  }
}

class Jukebox {
  /**
   * The audio engine.
   *
   * @return {Jukebox} New Jukebox object
   */
  constructor() {
    this.context = new AudioContext();
    this.volume = 1.0;
    this.max_distance = 1000;

    /** @type {Map<string, AudioBuffer>} */
    this.sounds = new Map();

    /** @type {Map<string, AudioStream>} */
    this.streams = new Map();
  }

  /**
   * Load a sound from a URL and map it to an ID.
   *
   * @param  {String} url Valid URL to an audio file
   * @param  {String} id  Key value for mapping
   */
  load_sound(url) {
    var _this = this;
    var request = new XMLHttpRequest();
    request.responseType = "arraybuffer";
    request.onreadystatechange = function () {
      if (request.status == 200 && request.readyState == 4) {
        _this.context.decodeAudioData(
          request.response,
          function (buffer) {
            _this.sounds.set(url, buffer);
          },
          function (e) {
            throw "Error decoding " + url + ": " + e.err;
          }
        );
      }
    };
    request.open("GET", url, true);
    request.send();
  }

  /**
   * Play a sound effect.
   *
   * @param  {String} url      Valid URL to an audio file
   * @param  {Number} volume   Volume of sound between [0, 1]
   * @param  {Vec2D}  position Location of the sound relative to origin
   */
  play_sound(url, volume, position) {
    if (!this.sounds.has(url)) {
      this.load_sound(url);
    }
    var source_node = this.context.createBufferSource();
    var gain_node = this.context.createGain();
    var panner_node = this.context.createPanner();

    source_node.connect(panner_node);
    panner_node.connect(gain_node);
    gain_node.connect(this.context.destination);

    // Set initial values
    source_node.buffer = this.sounds.get(url);

    panner_node.panningModel = "equalpower";
    panner_node.distanceModel = "linear";
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
   * @param  {String} stream Name of the stream
   */
  create_stream(stream) {
    this.streams.set(stream, new AudioStream());
  }

  /**
   * Queue a new track onto the stream.
   *
   * @param  {String} stream   Name of the stream
   * @param  {String} url      Valid URL to an audio file
   * @param  {Number} volume   Volume of sound between [0, 1]
   * @param  {Number} fadein   Fade in time in seconds
   * @param  {Number} loops    Number of repetitions (-1 for infinite)
   * @param  {Vec2D}  position Location of the sound relative to origin
   * @return {{volume: number, position: Vec2D}} User-accessible track information
   */
  queue_stream(stream, url, volume, fadein, loops, position) {
    if (!this.streams.has(stream)) {
      throw '"' + stream + '" audio stream does not exist.';
    }
    var media_elem = new Audio();
    var track = {
      media: media_elem,
      loops: loops,
      fadein: fadein,
      start: false,
      skipped: false,

      source_node: this.context.createMediaElementSource(media_elem),
      panner_node: this.context.createPanner(),
      gain_node: this.context.createGain(),

      user_inf: {
        volume: volume,
        position: position,
      },
    };
    media_elem.src = url;
    media_elem.crossOrigin = "anonymous";

    // Set node values
    track.panner_node.panningModel = "equalpower";
    track.panner_node.distanceModel = "linear";
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

    this.streams.get(stream).tracks.push(track);
    return track.user_inf;
  }

  /**
   * Skip the current track on a stream.
   *
   * @param  {String} stream  Name of the stream
   * @param  {Number} fadeout Fade out time in seconds
   */
  skip_stream(stream, fadeout = 0) {
    if (!this.streams.has(stream)) {
      throw '"' + stream + '" audio stream does not exist.';
    }
    var s = this.streams.get(stream);
    if (s.tracks.length == 0) {
      return;
    }
    var current = s.tracks[0];
    current.skipped = true;

    // Cancel any occurring fades
    var gain_now = current.gain_node.gain.value;
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
   * @param  {String} stream  Name of the stream
   * @param  {Number} fadeout Fade out time in seconds
   */
  clear_stream(stream, fadeout = 0) {
    if (!this.streams.has(stream)) {
      throw '"' + stream + '" audio stream does not exist.';
    }
    this.skip_stream(stream, fadeout);
    this.streams.get(stream).tracks = [];
  }

  /**
   * Update all streams.
   */
  update() {
    for (var s of this.streams.keys()) {
      var stream = this.streams.get(s);
      if (stream.tracks.length == 0) {
        continue;
      }
      var current = stream.tracks[0];

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
    }
  }
}

class Input {
  /**
   * The main input handler.
   *
   * @return {Input} New Input object
   */
  constructor() {
    this.state = {};
    this.pressed = {};
    this.released = {};
    this.mouse = new Vec2D(0, 0);
  }

  /**
   * Get the state of an input.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse1 - Mouse3.
   *
   * @param  {String} key  Target input to be tested
   * @return {Boolean}     Is the input pressed or released?
   */
  get_state(key) {
    if (key in this.state) {
      return this.state[key];
    }
    return false;
  }

  /**
   * Check if input is pressed on the current frame.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse1 - Mouse3.
   *
   * @param  {String} key  Target input to be tested
   * @return {Boolean}     Is the input pressed this frame?
   */
  get_pressed(key) {
    if (key in this.pressed) {
      return this.pressed[key];
    }
    return false;
  }

  /**
   * Check if input is released on the current frame.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse1 - Mouse3.
   *
   * @param  {String} key  Target input to be tested
   * @return {Boolean}     Is the input released this frame?
   */
  get_released(key) {
    if (key in this.released) {
      return this.released[key];
    }
    return false;
  }

  /**
   * Continuously read user input.
   *
   * @param  {Element} canvas Target canvas element
   */
  poll(canvas) {
    var _this = this;
    document.addEventListener("keydown", function (event) {
      _this.state[event.key] = true;
      _this.pressed[event.key] = true;
    });
    document.addEventListener("keyup", function (event) {
      _this.state[event.key] = false;
      _this.released[event.key] = true;
    });
    document.addEventListener("mousedown", function (event) {
      var key = "Mouse" + event.which;
      _this.state[key] = true;
      _this.pressed[key] = true;
    });
    document.addEventListener("mouseup", function (event) {
      var key = "Mouse" + event.which;
      _this.state[key] = false;
      _this.released[key] = true;
    });
    document.addEventListener("mousemove", function (event) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;

      _this.mouse.x = (event.clientX - rect.left) * scaleX;
      _this.mouse.y = (event.clientY - rect.top) * scaleY;
    });

    // Prevent opening menu when right-clicking the canvas
    canvas.addEventListener(
      "contextmenu",
      function (event) {
        event.preventDefault();
      },
      false
    );
  }

  /**
   * Reset the pressed and released values.
   */
  refresh() {
    for (var key in this.pressed) {
      this.pressed[key] = false;
    }
    for (var key in this.released) {
      this.released[key] = false;
    }
  }
}

class GameState {
  /**
   * A game state. User logic should be implemented
   * in a class that inherits from GameState.
   *
   * @return {GameState} New GameState object
   */
  constructor() {
    this.next = null;
    this.kill = false;
    this.transition = false;
  }

  /**
   * Set the next state for transitioning.
   *
   * @param {GameState} next GameState after transitioning
   * @param {Boolean}   kill Should the current state be killed?
   */
  set_next(next = null, kill = true) {
    this.next = next;
    this.kill = kill;
    this.transition = true;
  }

  /**
   * Load the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param  {Core} core Core modules passed by Engine
   */
  on_entry(core) {
    return;
  }

  /**
   * Exit the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param  {Core} core Core modules passed by Engine
   */
  on_exit(core) {
    return;
  }

  /**
   * Update the state at every frame. This can be overriden.
   * This is called throughout its lifetime.
   *
   * @param  {Core} core Core modules passed by Engine
   */
  update(core) {
    return;
  }
}

class Core {
  /**
   * Container for all the core modules of the engine
   */
  constructor() {
    this.display = new Surface(0, 0, document.getElementById("display"));
    this.audio = new Jukebox();
    this.input = new Input();
    this.clock = {
      dt: 0,
      dt_cap: 100, // Protect integration from breaking
    };
  }
}

class Engine {
  /**
   * The main DynamoJS engine.
   *
   * @param  {GameState} initial_state Initial state of the application
   * @return {Engine}                  New Engine object
   */
  constructor(initial_state) {
    this.core = new Core();
    this.states = [initial_state];
    initial_state.on_entry(this.core);
    this.core.input.poll(this.core.display.canvas);
  }

  /**
   * Update the game state.
   */
  tick() {
    this.core.display.clear();

    var current_state = this.states[this.states.length - 1];
    var next = current_state.next;

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
    var _this = this;
    var last_time = 0;
    var f = function (elapsed) {
      _this.core.clock.dt = clamp(
        elapsed - last_time,
        0,
        _this.core.clock.dt_cap
      );
      last_time = elapsed;
      _this.tick();
      window.requestAnimationFrame(f);
    };
    window.requestAnimationFrame(f);
  }
}

(function (exports) {
  exports.lerp = lerp;
  exports.clamp = clamp;
  exports.randrange = randrange;
  exports.Color = Color;
  exports.ColorGradient = ColorGradient;
  exports.Vec2D = Vec2D;
  exports.Segment = Segment;
  exports.AABB = AABB;
  exports.Sprite = Sprite;
  exports.Surface = Surface;
  exports.AudioStream = AudioStream;
  exports.Jukebox = Jukebox;
  exports.Input = Input;
  exports.GameState = GameState;
  exports.Core = Core;
  exports.Engine = Engine;
})(typeof exports === "undefined" ? (this.dynamo = {}) : exports);
