import { Vec2D } from '../Math';

class Sprite {
  private static pathPrefix = '';

  private accumulator: number;
  private finished: boolean;
  private maxFrames: number;
  private onFrame: (frame: number) => void;
  private onFinish: () => void;

  /**
   * Source image element
   */
  readonly img: HTMLImageElement;

  /**
   * Local image coordinates of the animation frames
   */
  readonly frames: Vec2D[];

  /**
   * Size of an individual sprite animation frame
   */
  readonly size: Vec2D;

  /**
   * Current frame index
   */
  currentFrame: number;

  /**
   * An animated sprite from an image file.
   *
   * @param file    Filepath to the target image
   * @param frameX  Width of each frame
   * @param frameY  Height of each frame
   * @param nframes Maximum number of frames
   * @param onLoad  On-load callback function
   * @param onError On-error callback function
   * @return Sprite object
   */
  private constructor(
    file: string,
    frameX = 0,
    frameY = 0,
    nframes = 0,
    onLoad: () => void,
    onError: () => void
  ) {
    this.accumulator = 0;
    this.img = new Image();
    this.img.src = file;
    this.frames = [];
    this.onFrame = () => {};
    this.onFinish = () => {};

    this.currentFrame = 0;
    this.finished = false;
    this.maxFrames = nframes;
    this.size = new Vec2D(0, 0);

    // TODO: Synchronize image loading... pain in the ass
    this.img.onload = () => {
      if (frameX == 0 || frameY == 0) {
        this.size.x = this.img.width;
        this.size.y = this.img.height;
      } else {
        this.size.x = frameX;
        this.size.y = frameY;
      }

      const horFrames = this.img.width / this.size.x;
      const verFrames = this.img.height / this.size.y;
      if (this.maxFrames == 0) {
        this.maxFrames = horFrames * verFrames;
      }

      // Calculate individual frame coordinates
      for (let j = 0; j < verFrames; j++) {
        for (let i = 0; i < horFrames; i++) {
          this.frames.push(new Vec2D(i * this.size.x, j * this.size.y));
        }
      }
      onLoad();
    };
    this.img.onerror = onError;
  }

  /**
   * Set the path prefix for where to load image files
   */
  static setPathPrefix(prefix: string) {
    Sprite.pathPrefix = prefix;
  }

  /**
   * Create a new sprite, returning a promise
   *
   * @param file          Filepath to the target image
   * @param frameX        Width of each frame
   * @param frameY        Height of each frame
   * @param nframes       Maximum number of frames
   * @param includePrefix Include the prefix in the filename
   * @return Promise to a Sprite object
   */
  static create(
    file: string,
    frameX = 0,
    frameY = 0,
    nframes = 0,
    includePrefix = true
  ) {
    return new Promise(
      (resolve: (sprite: Sprite) => void, reject: (error: Error) => void) => {
        const sprite = new Sprite(
          includePrefix ? `${Sprite.pathPrefix}${file}` : file,
          frameX,
          frameY,
          nframes,
          () => {
            resolve(sprite);
          },
          () => {
            reject(new Error(`Could not load sprite source file \`${file}\``));
          }
        );
      }
    );
  }

  /**
   * Set the callback for when the animation finishes
   *
   * @param callback Callback method
   */
  setOnFinish(callback: () => void) {
    this.onFinish = callback;
  }

  /**
   * Set the callback for the start of an animation frame
   * The callback should take an index representing the current frame
   *
   * @param callback Callback method
   */
  setOnFrame(callback: (frame: number) => void) {
    this.onFrame = callback;
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
      this.currentFrame++;
      this.accumulator = 0;
      this.onFrame(this.currentFrame);
    }
    if (this.currentFrame > this.maxFrames - 1) {
      if (loop) {
        this.currentFrame = 0;
      } else {
        this.currentFrame = this.maxFrames - 1;
        this.finished = true;
        this.onFinish();
      }
    }
  }

  /**
   * Restart the animation
   */
  restart() {
    this.currentFrame = 0;
    this.finished = false;
  }

  /**
   * Check if the sprite's animation has finished.
   *
   * If the sprite is looping, it will always return false
   *
   * @returns Sprite animation finished?
   */
  isFinished() {
    return this.finished;
  }
}

export { Sprite };
