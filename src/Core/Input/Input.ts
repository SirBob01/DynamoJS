import { Vec2D } from '../../Math';

class Input {
  private state: Map<string, boolean>;
  private pressed: Map<string, boolean>;
  private released: Map<string, boolean>;

  /**
   * Screen-space mouse position
   */
  readonly mouse: Vec2D;

  /**
   * Unregister all input handlers
   */
  unregisterHandlers: () => void;

  /**
   * The main input handler.
   */
  constructor() {
    this.state = new Map();
    this.pressed = new Map();
    this.released = new Map();

    this.mouse = new Vec2D(0, 0);
    this.unregisterHandlers = () => {};
  }

  /**
   * Get the state of an input.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse0 - Mouse2.
   *
   * @param key        Target input to be tested
   * @param ignoreCase Ignore the capitalization of the key
   * @return Is the input pressed or released?
   */
  getState(key: string, ignoreCase = false) {
    if (ignoreCase) {
      const upper = key.toUpperCase();
      return (this.state.get(key) || this.state.get(upper)) ?? false;
    }
    return this.state.get(key) ?? false;
  }

  /**
   * Check if input is pressed on the current frame.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse0 - Mouse2.
   *
   * @param key        Target input to be tested
   * @param ignoreCase Ignore the capitalization of the key
   * @return Is the input pressed this frame?
   */
  getPressed(key: string, ignoreCase = false) {
    if (ignoreCase) {
      const upper = key.toUpperCase();
      return (this.pressed.get(key) || this.pressed.get(upper)) ?? false;
    }
    return this.pressed.get(key) ?? false;
  }

  /**
   * Check if input is released on the current frame.
   * Alphanumeric keys range from a - z, 0 - 9.
   * Mouse buttons range from Mouse0 - Mouse2.
   *
   * @param key        Target input to be tested
   * @param ignoreCase Ignore the capitalization of the key
   * @return Is the input released this frame?
   */
  getReleased(key: string, ignoreCase = false) {
    if (ignoreCase) {
      const upper = key.toUpperCase();
      return (this.released.get(key) || this.released.get(upper)) ?? false;
    }
    return this.released.get(key) ?? false;
  }

  /**
   * Continuously read user input.
   *
   * @param canvas Target canvas element
   */
  poll(canvas: HTMLCanvasElement) {
    const keydown = (event: KeyboardEvent) => {
      if (!event.repeat) {
        this.pressed.set(event.key, true);
      }
      this.state.set(event.key, true);
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
    const canvasContextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    // Register
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    document.addEventListener('mousedown', mousedown);
    document.addEventListener('mouseup', mouseup);
    document.addEventListener('mousemove', mousemove);
    canvas.addEventListener('contextmenu', canvasContextmenu, false);

    // Store a function to unregister everything
    this.unregisterHandlers = () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
      document.removeEventListener('mousedown', mousedown);
      document.removeEventListener('mouseup', mouseup);
      document.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('contextmenu', canvasContextmenu, false);
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

export { Input };
