import { Vec2D } from '../Math';

class Sprite {
  private accumulator: number;
  private finished: boolean;
  private max_frames: number;
  readonly img: HTMLImageElement;
  readonly frames: Vec2D[];
  readonly size: Vec2D;
  current_frame: number;

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
    this.accumulator = 0;
    this.img = new Image();
    this.img.src = file;
    this.frames = [];

    this.current_frame = 0;
    this.finished = false;
    this.max_frames = nframes;
    this.size = new Vec2D(0, 0);

    // TODO: Synchronize image loading... pain in the ass
    this.img.onload = () => {
      if (frame_x == 0 || frame_y == 0) {
        this.size.x = this.img.width;
        this.size.y = this.img.height;
      } else {
        this.size.x = frame_x;
        this.size.y = frame_y;
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

  /**
   * Test if the sprite's animation has finished.
   *
   * If the sprite is looping, it will always return false
   *
   * @returns Sprite animation finished?
   */
  is_finished() {
    return this.finished;
  }
}

export { Sprite };
