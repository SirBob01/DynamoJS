// Utility functions
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
    return Math.min(x, Math.max(x, min));
}

// Utility classes
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
    constructor(r, g, b, a=255) {
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
        return "rgb("+this.r+","+this.g+","+this.b+")";
    }

    /**
     * Get the normalized alpha value.
     * 
     * @return {Number} Alpha value between [0, 1] 
     */
    alpha() {
        return this.a/255.0;
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
    constructor(surface, type, values, alpha=255) {
        if(type == "linear") {
            this.grad = surface.surface.createLinearGradient( 
                values.start.x, values.start.y,
                values.end.x, values.end.y
            );
        }
        else {
            this.grad = surface.surface.createRadialGradient( 
                values.in_pos.x, values.in_pos.y, values.in_r, 
                values.out_pos.x, values.out_pos.y, values.out_r,
            );
        }
        this.a = alpha;
    }

    /**
     * Set a color at a position in the gradient.
     * 
     * @param {[type]} color Target color value
     * @param {[type]} t     Position in gradient between [0, 1]
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
        return this.a/255.0;
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
     * Get the array representation of the vector.
     * 
     * @return {Array} Ordered list of coordinate values
     */
    get() {
        return [this.x, this.y];
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
        return new AABB(
            this.center.x, this.center.y, 
            this.dim.x, this.dim.y
        );
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


class Sprite {
    /**
     * An animated sprite from an image file.
     * 
     * @param  {String} file    Filepath to the target image
     * @param  {Number} frame_x Width of each frame
     * @param  {Number} frame_y Height of each frame
     * @param  {Number} nframes Maximum number of frames
     * @return {Sprite}         New Sprite object
     */
    constructor(file, frame_x=0, frame_y=0, nframes=0) {
        this.img = new Image();
        this.img.src = file;

        this.frames = [];

        this.accumulator = 0;
        this.current_frame = 0;
        this.finished = false;
        this.max_frames = nframes;

        // Drawing properties
        this.flip = new Vec2D(1, 1);
        this.opacity = 1.0;

        // Synchronize resource loading
        var _this = this;
        this.img.onload = function() {
            if(frame_x == 0 || frame_y == 0) {
                _this.size = new Vec2D(_this.img.width, _this.img.height);
            }
            else {
                _this.size = new Vec2D(frame_x, frame_y);
            }

            var hor_frames = _this.img.width/_this.size.x;
            var ver_frames = _this.img.height/_this.size.y;
            if(this.max_frames == 0) {
                this.max_frames = hor_frames * ver_frames;
            }

            // Calculate individual frame coordinates
            for(var i = 0; i < hor_frames; i++) {
                for(var j = 0; j < ver_frames; j++) {
                    _this.frames.push(new Vec2D(
                        i*_this.size.x, 
                        j*_this.size.y
                    ));
                }
            }
        }
    }

    /**
     * Animate the sprite and update its current frame.
     * Call it on every tick.
     * 
     * @param  {Number}  dt   Delta-time from previous tick
     * @param  {Number}  fps  Animation rate
     * @param  {Boolean} loop Does the animation loop?
     */
    animate(dt, fps, loop=false) {
        this.accumulator += dt;
        if(this.accumulator >= (1000.0/fps)) {
            this.current_frame++;
            this.accumulator = 0;
        }
        if(this.current_frame > this.max_frames - 1) {
            if(loop) {
                this.current_frame = 0;
            }
            else {
                this.current_frame = this.max_frames-1;
                this.finished = true;
            }
        }
    }
}


// Core Modules
class Surface {
    /**
     * A base surface for targeted rendering.
     * 
     * @param  {Number}  w      Width of the surface
     * @param  {Number}  h      Height of the surface
     * @param  {Element} canvas Target canvas element
     * @return {Surface}        New Surface object
     */
    constructor(w=0, h=0, canvas=null) {
        if(!canvas) {
            this.canvas = document.createElement('canvas');        
            this.canvas.width = w;
            this.canvas.height = h;
        }
        else {
            this.canvas = canvas;
        }
        this.surface = this.canvas.getContext("2d");
    }

    /**
     * Get the bounds of the surface.
     * 
     * @return {AABB} Bouding box of the surface
     */
    rect() {
        return new AABB(
            this.canvas.width/2.0,
            this.canvas.height/2.0,
            this.canvas.width,
            this.canvas.height
        )
    }

    /**
     * Fill the entire surface with a color or gradient.
     * 
     * @param  {Color} color Target color or gradient
     */
    fill(color) {
        this.draw_rect(this.rect(), color, true);
    }

    /**
     * Draw another surface on top of the current one.
     * 
     * @param  {Surface} src    Source surface to be drawn
     * @param  {AABB}    aabb   Target bounding box for stretching
     * @param  {String}  blend  Drawing blend mode
     */
    draw_surface(src, aabb, blend="source-over") {
        this.surface.globalCompositeOperation = blend;
        var upperleft = aabb.min();
        this.surface.drawImage(
            src.canvas, 
            upperleft.x, upperleft.y,
            aabb.dim.x, aabb.dim.y
        );
        this.surface.globalCompositeOperation = "source-over";
    }

    /**
     * Draw a sprite on the surface.
     * 
     * @param  {Sprite} sprite Source sprite to be drawn
     * @param  {AABB}   aabb   Target bounding box for stretching
     * @param  {String} blend  Drawing blend mode
     */
    draw_sprite(sprite, aabb, blend="source-over") {
        this.surface.globalAlpha = sprite.opacity;
        this.surface.globalCompositeOperation = blend;
        this.surface.imageSmoothingEnabled = false;
        this.surface.scale(sprite.flip.x, sprite.flip.y);

        var frame = sprite.frames[sprite.current_frame];
        if(aabb.dim.x && aabb.dim.y) {
            var point = aabb.center.copy();
            point.x -= aabb.dim.x * 0.5 * sprite.flip.x;
            point.y -= aabb.dim.y * 0.5 * sprite.flip.y;
            this.surface.drawImage(
                sprite.img,
                frame.x, frame.y,
                sprite.size.x, sprite.size.y,
                point.x * sprite.flip.x, point.y * sprite.flip.y,
                aabb.dim.x, aabb.dim.y
            );
        }
        else {
            var point = aabb.center.copy();
            point.x -= sprite.size.x * 0.5 * sprite.flip.x;
            point.y -= sprite.size.y * 0.5 * sprite.flip.y;
            this.surface.drawImage(
                sprite.img,
                frame.x, frame.y,
                sprite.size.x, sprite.size.y,
                point.x * sprite.flip.x, point.y * sprite.flip.y,
                sprite.size.x, sprite.size.y
            );
        }
        this.surface.setTransform(1, 0, 0, 1, 0, 0);
        this.surface.globalAlpha = 1.0;
        this.surface.globalCompositeOperation = "source-over";
    }

    /**
     * Draw a rectangular shape on the surface.
     * 
     * @param  {AABB}    aabb      Target bounding box
     * @param  {Color}   color     Target color or gradient
     * @param  {Boolean} fill      Should the shape be filled?
     * @param  {Number}  linewidth Width of the outline
     * @param  {String}  blend     Drawing blend mode
     */
    draw_rect(aabb, color, fill=false, linewidth=1, blend="source-over") {
        this.surface.globalAlpha = color.alpha();
        this.surface.globalCompositeOperation = blend;
        
        // Offset drawing so it is centered
        var upperleft = aabb.min();
        if(fill) {
            this.surface.fillStyle = color.get();
            this.surface.fillRect(
                upperleft.x, upperleft.y, 
                aabb.dim.x, aabb.dim.y
            );
        }
        else {
            this.surface.lineWidth = linewidth;
            this.surface.strokeStyle = color.get();
            this.surface.strokeRect(
                upperleft.x, upperleft.y,
                aabb.dim.x, aabb.dim.y
            );
        }
        this.surface.globalAlpha = 1.0;
        this.surface.globalCompositeOperation = "source-over";
    }

    /**
     * Draw a circular shape on the surface.
     * 
     * @param  {Vec2D}   center    Centered position of target
     * @param  {Number}  radius    Radius of the circle
     * @param  {Color}   color     Target color or gradient
     * @param  {Boolean} fill      Should the shape be filled?
     * @param  {Number}  linewidth Width of the outline
     * @param  {String}  blend     Drawing blend mode
     */
    draw_circle(center, radius, color, fill=false, linewidth=1, blend="source-over") {
        this.surface.globalAlpha = color.alpha();
        this.surface.globalCompositeOperation = blend;
        this.surface.beginPath();
        this.surface.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        if(fill) {
            this.surface.fillStyle = color.get();
            this.surface.fill();
        }
        else {
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
     * @param  {String} string Text to be rendered
     * @param  {String} font   Valid font family
     * @param  {Number} size   Size of the font in pixels
     * @param  {Color}  color  Target color or gradient
     * @param  {Vec2D}  pos    Centered position of target
     * @param  {String} blend  Drawing blend mode
     */
    draw_text(string, font, size, color, pos, blend="source-over") {
        this.surface.fillStyle = color.get();
        this.surface.globalAlpha = color.alpha();
        this.surface.globalCompositeOperation = blend;

        this.surface.font = size + 'px ' + font;
        this.surface.fillText(string, pos.x, pos.y);
        
        this.surface.globalAlpha = 1.0;
        this.surface.globalCompositeOperation = "source-over";
    }

    /**
     * Clear the entire surface.
     */
    clear() {
        this.surface.clearRect(
            0, 0, 
            this.canvas.width, this.canvas.height
        );
    }
}


// TODO: Add stream for layering tracks
class Jukebox {
    /**
     * The audio engine.
     * 
     * @return {Jukebox} New Jukebox object
     */
    constructor() {
        this.context = new AudioContext();
        this.volume = 1.0;

        // id : bytestream
        this.sounds = {};
    }
    
    /**
     * Load a sound from a URL and map it to an ID.
     * 
     * @param  {String} url Valid URL to an audio file
     * @param  {String} id  Key value for mapping
     */
    load_sound(url, id) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.responseType = 'arraybuffer';
        request.onreadystatechange = function() {
            if(request.status == 200 && request.readyState == 4) {
                _this.context.decodeAudioData(request.response, 
                    function(buffer) {
                        _this.sounds[id] = buffer;
                    },
                    function(e) {
                        console.log("Error decoding "+url+": "+e.err);
                    });
            }
        };
        request.open("GET", url, true);
        request.send();
    }

    /**
     * Play a sound effect.
     * 
     * @param  {String} id     Valid mapped key value
     * @param  {Number} volume Volume of sound between [0, 1]
     */
    play_sound(id, volume) {
        if(!(id in this.sounds)) {
            throw id+" sound is not loaded into Jukebox.";
        }
        var source_node = this.context.createBufferSource();
        var gain_node = this.context.createGain();

        source_node.connect(gain_node);
        gain_node.connect(this.context.destination);
        
        // Set initial values
        source_node.buffer = this.sounds[id];
        gain_node.gain.value = volume * this.volume;

        source_node.start(0);
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
        this.mouse = new Vec2D(0, 0);
    }

    /**
     * Get the state of an input.
     * Alphanumeric keys range from a - z, 0 - 9.
     * Mouse buttons range from Mouse0 - Mouse2.
     * 
     * @param  {String} key  Target input to be tested
     * @return {Boolean}     Is the input pressed or released?
     */
    get_state(key) {
        if(key in this.state) {
            return this.state[key];
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
        document.addEventListener('keydown', function(event) {
            _this.state[event.key] = true;
        });
        document.addEventListener('keyup', function(event) {
            _this.state[event.key] = false;
        });
        document.addEventListener('mousedown', function(event) {
            _this.state["Mouse"+event.which] = true;
        });
        document.addEventListener('mouseup', function(event) {
            _this.state["Mouse"+event.which] = false;
        });
        document.addEventListener('mousemove', function(event) {
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
        
            _this.mouse.x = (event.clientX - rect.left) * scaleX;
            _this.mouse.y = (event.clientY - rect.top) * scaleY;
        });
    }
}


class GameState {
    /**
     * A game state. This is where user defined
     * logic is implemented.
     * 
     * @return {GameState} New GameState object
     */
    constructor() {
        this.next = null;
        this.kill = false;
    }

    /**
     * Set the next state for transitioning.
     * 
     * @param {GameState} next GameState after transitioning
     * @param {Boolean}   kill Should the current state be killed?
     */
    set_next(next, kill) {
        this.next = next;
        this.kill = kill;
    }

    /**
     * Load the state. This can be overriden.
     * This is called only once in its lifetime.
     * 
     * @param  {Object} core Core modules passed by Engine
     */
    on_entry(core) {
        return;
    }

    /**
     * Exit the state. This can be overriden.
     * This is called only once in its lifetime.
     * 
     * @param  {Object} core Core modules passed by Engine
     */
    on_exit(core) {
        return;
    }

    /**
     * Update the state at every frame. This can be overriden.
     * This is called only once in its lifetime.
     * 
     * @param  {Object} core Core modules passed by Engine
     */
    update(core) {
        return;
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
        this.display = new Surface(
            0, 0,
            document.getElementById("display")
        );
        this.input = new Input();
        this.audio = new Jukebox();
        this.core = {
            display : this.display,
            audio : this.audio,
            input : this.input
        };

        this.states = [initial_state];
        initial_state.on_entry(this.core);
    }

    /**
     * Update the game state.
     */
    tick() {
        this.display.clear();
        this.input.poll(this.display.canvas);

        var current_state = this.states[0];
        var next = current_state.next;

        if(next != null) {
            if(current_state.kill) {
                current_state.on_exit(this.core);
                this.states.pop();
            }
            next.on_entry(this.core);
            this.states.push(next);
        }
        else {
            current_state.update(this.core);
        }
    }

    /**
     * The main() function for a DynamoJS program.
     * Persistently run the application.
     */
    run() {
        var _this = this;
        setInterval(function () {
            _this.tick();
        }, (1.0/60.0) * 1000.0);
    }
}