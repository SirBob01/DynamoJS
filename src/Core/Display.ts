import { Surface } from '../Surface';

/**
 * Resize listener function
 */
type ResizeListener = (width: number, height: number) => void;

class Display extends Surface {
  private container: HTMLElement;
  private resize_listener: ResizeListener;
  private fullscreen: boolean;

  /**
   * Primary display surface.
   *
   * @param container Container element
   * @return New Display object
   */
  constructor(container: HTMLElement) {
    super(container.clientWidth, container.clientHeight);
    container.appendChild(this.canvas);

    this.container = container;
    this.resize_listener = () => {};
    this.fullscreen = false;

    // Listen for canvas resizing
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      this.set_size(clientWidth, clientHeight);
      this.resize_listener(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);

    // Listener for fullscreen toggle
    this.container.addEventListener('fullscreenchange', (event) => {
      const { clientWidth, clientHeight } = container;
      this.set_size(clientWidth, clientHeight);
      this.resize_listener(clientWidth, clientHeight);
    });
  }

  /**
   * Set the listener function that is called whenever
   * the display container is resized. This function should take
   * the updated width and height of the display.
   *
   * @param listener Listener function
   */
  set_resize_listener(listener: ResizeListener) {
    this.resize_listener = listener;
  }

  /**
   * Remove a registered resize listener function, if it exists.
   */
  remove_resize_listener() {
    this.resize_listener = () => {};
  }

  /**
   * Turn on fullscreen mode
   */
  set_fullscreen(flag: boolean) {
    this.fullscreen = flag;
    if (flag) {
      this.container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Tests if fullscreen mode is toggled on
   *
   * @returns Fullscreen?
   */
  is_fullscreen() {
    return this.fullscreen;
  }
}

export { Display };
