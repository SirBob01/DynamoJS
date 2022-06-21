export type spriteCallback = (sprite: Sprite) => void;
/**   Utility functions   **/
/**
 * Linearly interpolate between two values.
 *
 * @param  {Number} a   Start value
 * @param  {Number} b   End value
 * @param  {Number} t   Value in the range [0, 1]
 * @return {Number}     Value between a and b
 */
export function lerp(a: number, b: number, t: number): number;
/**
 * Clamp a value between a minimum and maximum
 *
 * @param  {Number} x       Target value
 * @param  {Number} min     Minimum value
 * @param  {Number} max     Maximum value
 * @return {Number}         Clamped value
 */
export function clamp(x: number, min: number, max: number): number;
/**
 * Generate a random floating point number in [min, max)
 *
 * @param  {Number} min Minimum value of range
 * @param  {Number} max Maximum value of range
 * @return {Number}     Random number
 */
export function randrange(min: number, max: number): number;
/**   Utility classes   **/
export class Color {
    /**
     * A wrapper for rgba values.
     *
     * @param  {Number} r   Red value in range [0, 255]
     * @param  {Number} g   Green value in range [0, 255]
     * @param  {Number} b   Blue value in range [0, 255]
     * @param  {Number} a   Alpha channel in range [0, 255]
     * @return {Color}      New color object
     */
    constructor(r: number, g: number, b: number, a?: number);
    r: number;
    g: number;
    b: number;
    a: number;
    /**
     * Create a new copy of the current color.
     *
     * @return {Color} New color object
     */
    copy(): Color;
    /**
     * Linearly interpolate to another color.
     *
     * @param  {Color}  target  Target color
     * @param  {Number} t       Value between [0, 1]
     * @return {Color}          Resultant color
     */
    lerp(target: Color, t: number): Color;
    /**
     * Generate the valid HTML string in rgba format.
     *
     * @return {String} RGBA string
     */
    get(): string;
    /**
     * Get the normalized alpha value.
     *
     * @return {Number} Alpha value between [0, 1]
     */
    alpha(): number;
}
export class ColorGradient {
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
    constructor(surface: Surface, type: string, values: any, alpha?: number);
    grad: any;
    a: number;
    /**
     * Set a color at a position in the gradient.
     *
     * @param {Color} color Target color value
     * @param {Number} t     Position in gradient between [0, 1]
     */
    add_value(color: Color, t: number): void;
    /**
     * Get the underlying canvas gradient object.
     *
     * @return {CanvasGradient} Target CanvasGradient object
     */
    get(): CanvasGradient;
    /**
     * Get the normalized alpha value.
     *
     * @return {Number} Alpha value between [0, 1]
     */
    alpha(): number;
}
export class Vec2D {
    /**
     * Create a new Vec2D object from a comma-separated string.
     *
     * @param  {String} string Comma-separated values
     * @return {Vec2D}         New Vec2D object
     */
    static from_string(string: string): Vec2D;
    /**
     * A 2D vector.
     *
     * @param  {Number} x   X-coordinate
     * @param  {Number} y   Y-coordinate
     * @return {Vec2D}      New Vec2D object
     */
    constructor(x: number, y: number);
    x: number;
    y: number;
    /**
     * Create a copy of the current vector.
     *
     * @return {Vec2D} New Vec2D object
     */
    copy(): Vec2D;
    /**
     * Test if a vector is equivalent to the current one.
     * @param  {Vec2D}   b Other vector
     * @return {Boolean}   Are the vectors equal?
     */
    equals(b: Vec2D): boolean;
    /**
     * Add a new vector to the current one.
     *
     * @param  {Vec2D} b Addend vector
     * @return {Vec2D}   Resultant sum of the vectors
     */
    add(b: Vec2D): Vec2D;
    /**
     * Subtract a vector from the current one.
     *
     * @param  {Vec2D} b Subtrahend vector
     * @return {Vec2D}   Resultant difference of the vectors
     */
    sub(b: Vec2D): Vec2D;
    /**
     * Multiply the current vector by a scalar value.
     *
     * @param  {Number} s Scalar value
     * @return {Vec2D}    Resultant product
     */
    scale(s: number): Vec2D;
    /**
     * Calculate the dot product with another vector.
     *
     * @param  {Vec2D}  b Other vector
     * @return {Number}   Resultant dot product
     */
    dot(b: Vec2D): number;
    /**
     * Get the squared length of the vector.
     *
     * @return {Number} Squared length
     */
    length_sq(): number;
    /**
     * Get the cartesian length of the vector.
     *
     * @return {Number} Cartesian length
     */
    length(): number;
    /**
     * Get the unit vector.
     *
     * @return {Vec2D} Directional vector of length 1.
     */
    unit(): Vec2D;
    /**
     * Get the array representation of the vector.
     *
     * @return {Number[]} Ordered list of coordinate values
     */
    get(): number[];
    /**
     * Grab the string representation of the vector.
     *
     * @return {String} Comma-separated values
     */
    to_string(): string;
}
export class Segment {
    /**
     * A line segment.
     *
     * @param  {Vec2D}   start Coordinates of the starting point
     * @param  {Vec2D}   stop  Coordinates of the stopping point
     * @return {Segment}       New Segment object
     */
    constructor(start: Vec2D, stop: Vec2D);
    start: Vec2D;
    stop: Vec2D;
    /**
     * Create a copy of the current segment.
     *
     * @return {Segment} New Segment object
     */
    copy(): Segment;
    /**
     * Test if the current segment is parallel with another.
     *
     * @param  {Segment}  segment The other segment to test
     * @return {Boolean}          Are the segments parallel?
     */
    is_parallel(segment: Segment): boolean;
}
export class AABB {
    /**
     * An axis-aligned bounding box.
     *
     * @param  {Number} x   X-coordinate of the center
     * @param  {Number} y   Y-coordinate of the center
     * @param  {Number} w   Width of the bounding box
     * @param  {Number} h   Height of the bounding box
     * @return {AABB}       New AABB object
     */
    constructor(x: number, y: number, w: number, h: number);
    center: Vec2D;
    dim: Vec2D;
    /**
     * Create a copy of the current AABB.
     *
     * @return {AABB} New AABB object
     */
    copy(): AABB;
    /**
     * Get the upper-left corner of the AABB.
     *
     * @return {Vec2D} Coordinates of the upperleft corner
     */
    min(): Vec2D;
    /**
     * Get the bottom-right corner of the AABB.
     *
     * @return {Vec2D} Coordinates of the bottom-right corner
     */
    max(): Vec2D;
    /**
     * Get the left side of the AABB.
     *
     * @return {Segment} Line segment of the left face
     */
    left(): Segment;
    /**
     * Get the right side of the AABB.
     *
     * @return {Segment} Line segment of the right face
     */
    right(): Segment;
    /**
     * Get the top side of the AABB.
     *
     * @return {Segment} Line segment of the top face
     */
    top(): Segment;
    /**
     * Get the bottom side of the AABB.
     *
     * @return {Segment} Line segment of the bottom face
     */
    bottom(): Segment;
    /**
     * Test if a point is within the AABB.
     *
     * @param  {Vec2D}   point   Test point
     * @return {Boolean}         Is the point in bounds?
     */
    is_in_bounds(point: Vec2D): boolean;
    /**
     * Test if the AABB is colliding with another.
     *
     * @param  {AABB}    other   Paired AABB
     * @return {Boolean}         Are bounding boxes colliding?
     */
    is_colliding(other: AABB): boolean;
}
/**
 * @callback spriteCallback
 * @param {Sprite} sprite
 * @return {void}
 */
export class Sprite {
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
    constructor(file: string, frame_x?: number, frame_y?: number, nframes?: number, callback?: null | spriteCallback);
    img: HTMLImageElement;
    frames: any[];
    accumulator: number;
    current_frame: number;
    finished: boolean;
    max_frames: number;
    /**
     * Animate the sprite and update its current frame.
     * Call it on every tick.
     *
     * @param  {Number}  dt   Delta-time from previous tick
     * @param  {Number}  fps  Animation rate
     * @param  {Boolean} loop Does the animation loop?
     */
    animate(dt: number, fps: number, loop?: boolean): void;
}
/**   Core modules   **/
export class Surface {
    /**
     * A base surface for targeted rendering.
     *
     * @param  {Number}  w      Width of the surface
     * @param  {Number}  h      Height of the surface
     * @param  {Element} canvas Target canvas element
     * @return {Surface}        New Surface object
     */
    constructor(w?: number, h?: number, canvas?: Element);
    canvas: Element;
    surface: any;
    /**
     * Get the bounds of the surface.
     *
     * @param  {Boolean} center Should bounding box be centered?
     * @return {AABB}           Bouding box of the surface
     */
    rect(center?: boolean): AABB;
    /**
     * Generate a subsurface.
     *
     * @param  {AABB}    aabb    Size and location of subsurface
     * @param  {Boolean} center  Should coordinates be centered?
     * @return {Surface}         New Surface object
     */
    subsurface(aabb: AABB, center?: boolean): Surface;
    /**
     * Fill the entire surface with a color or gradient.
     *
     * @param  {Color} color Target color or gradient
     */
    fill(color: Color): void;
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
    draw_surface(src: Surface, aabb: AABB, blend?: string, opacity?: number, angle?: number, flip?: Vec2D, center?: boolean): void;
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
    draw_sprite(sprite: Sprite, aabb: AABB, blend?: string, opacity?: number, angle?: number, flip?: Vec2D, center?: boolean): void;
    /**
     * Draw a line segment on the surface.
     *
     * @param  {Segment} segment   Start and end points of the line
     * @param  {Color}   color     Target color or gradient
     * @param  {Number}  linewidth Width of the line
     * @param  {String}  blend     Drawing blend mode
     */
    draw_line(segment: Segment, color: Color, linewidth?: number, blend?: string): void;
    /**
     * Draw a rectangular shape on the surface.
     *
     * @param  {AABB}    aabb      Target bounding box
     * @param  {Color}   color     Target color or gradient
     * @param  {Boolean} fill      Should the shape be filled?
     * @param  {Number}  linewidth Width of the outline
     * @param  {String}  blend     Drawing blend mode
     * @param  {Boolean} center    Should drawing be centered?
     */
    draw_rect(aabb: AABB, color: Color, fill?: boolean, linewidth?: number, blend?: string, center?: boolean): void;
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
    draw_circle(center: Vec2D, radius: number, color: Color, fill?: boolean, linewidth?: number, blend?: string): void;
    /**
     * Draw a polygon from a sorted list of points
     *
     * @param  {Vec2D[]}   points    Sorted array of Vec2D points
     * @param  {Color}   color     Target color or gradient
     * @param  {Boolean} fill      Should the shape be filled?
     * @param  {Number}  linewidth Width of the outline
     * @param  {String}  blend     Drawing blend mode
     */
    draw_polygon(points: Vec2D[], color: Color, fill?: boolean, linewidth?: number, blend?: string): void;
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
    draw_text(string: string, font: string, size: number, color: Color, pos: Vec2D, fill?: boolean, linewidth?: number, bold?: boolean, italic?: boolean, align?: string, blend?: string): void;
    /**
     * Clear the entire surface.
     */
    clear(): void;
}
export class Jukebox {
    context: AudioContext;
    volume: number;
    max_distance: number;
    sounds: {};
    streams: {};
    /**
     * Load a sound from a URL and map it to an ID.
     *
     * @param  {String} url Valid URL to an audio file
     * @param  {String} id  Key value for mapping
     */
    load_sound(url: string): void;
    /**
     * Play a sound effect.
     *
     * @param  {String} url      Valid URL to an audio file
     * @param  {Number} volume   Volume of sound between [0, 1]
     * @param  {Vec2D}  position Location of the sound relative to origin
     */
    play_sound(url: string, volume: number, position: Vec2D): void;
    /**
     * Create a new audio stream.
     *
     * @param  {String} stream Name of the stream
     */
    create_stream(stream: string): void;
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
    queue_stream(stream: string, url: string, volume: number, fadein: number, loops: number, position: Vec2D): {
        volume: number;
        position: Vec2D;
    };
    /**
     * Skip the current track on a stream.
     *
     * @param  {String} stream  Name of the stream
     * @param  {Number} fadeout Fade out time in seconds
     */
    skip_stream(stream: string, fadeout?: number): void;
    /**
     * Clear all tracks on the stream.
     *
     * @param  {String} stream  Name of the stream
     * @param  {Number} fadeout Fade out time in seconds
     */
    clear_stream(stream: string, fadeout?: number): void;
    /**
     * Update all streams.
     */
    update(): void;
}
export class Input {
    state: {};
    pressed: {};
    released: {};
    mouse: Vec2D;
    /**
     * Get the state of an input.
     * Alphanumeric keys range from a - z, 0 - 9.
     * Mouse buttons range from Mouse1 - Mouse3.
     *
     * @param  {String} key  Target input to be tested
     * @return {Boolean}     Is the input pressed or released?
     */
    get_state(key: string): boolean;
    /**
     * Check if input is pressed on the current frame.
     * Alphanumeric keys range from a - z, 0 - 9.
     * Mouse buttons range from Mouse1 - Mouse3.
     *
     * @param  {String} key  Target input to be tested
     * @return {Boolean}     Is the input pressed this frame?
     */
    get_pressed(key: string): boolean;
    /**
     * Check if input is released on the current frame.
     * Alphanumeric keys range from a - z, 0 - 9.
     * Mouse buttons range from Mouse1 - Mouse3.
     *
     * @param  {String} key  Target input to be tested
     * @return {Boolean}     Is the input released this frame?
     */
    get_released(key: string): boolean;
    /**
     * Continuously read user input.
     *
     * @param  {Element} canvas Target canvas element
     */
    poll(canvas: Element): void;
    /**
     * Reset the pressed and released values.
     */
    refresh(): void;
}
export class GameState {
    next: GameState;
    kill: boolean;
    transition: boolean;
    /**
     * Set the next state for transitioning.
     *
     * @param {GameState} next GameState after transitioning
     * @param {Boolean}   kill Should the current state be killed?
     */
    set_next(next?: GameState, kill?: boolean): void;
    /**
     * Load the state. This can be overriden.
     * This is called only once in its lifetime.
     *
     * @param  {Core} core Core modules passed by Engine
     */
    on_entry(core: Core): void;
    /**
     * Exit the state. This can be overriden.
     * This is called only once in its lifetime.
     *
     * @param  {Core} core Core modules passed by Engine
     */
    on_exit(core: Core): void;
    /**
     * Update the state at every frame. This can be overriden.
     * This is called throughout its lifetime.
     *
     * @param  {Core} core Core modules passed by Engine
     */
    update(core: Core): void;
}
export class Core {
    display: Surface;
    audio: Jukebox;
    input: Input;
    clock: {
        dt: number;
        dt_cap: number;
    };
}
export class Engine {
    /**
     * The main DynamoJS engine.
     *
     * @param  {GameState} initial_state Initial state of the application
     * @return {Engine}                  New Engine object
     */
    constructor(initial_state: GameState);
    core: Core;
    states: GameState[];
    /**
     * Update the game state.
     */
    tick(): void;
    /**
     * The main() function for a DynamoJS program.
     * Persistently run the application.
     */
    run(): void;
}
