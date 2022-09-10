import { Surface } from '../Surface';

/**
 * Resize listener function
 */
type ResizeListener = (width: number, height: number) => void;

class Display extends Surface {
  private container: HTMLElement;
  private resize_listeners: ResizeListener[];
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
    this.resize_listeners = [];
    this.fullscreen = false;

    // Listen for canvas resizing
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      this.set_size(clientWidth, clientHeight);
      this.resize_listeners.forEach((listener) => {
        listener(clientWidth, clientHeight);
      });
    });
    resizeObserver.observe(container);

    // Listener for fullscreen toggle
    this.container.addEventListener('fullscreenchange', (event) => {
      const { clientWidth, clientHeight } = container;
      this.set_size(clientWidth, clientHeight);
      this.resize_listeners.forEach((listener) => {
        listener(clientWidth, clientHeight);
      });
    });
  }

  /**
   * Add a new resize listener function that is called whenever
   * the display container is resized. This function should take
   * the updated width and height of the display.
   *
   * @param listener Listener function
   */
  add_resize_listener(listener: ResizeListener) {
    this.resize_listeners.push(listener);
  }

  /**
   * Remove a registered resize listener function, if it exists.
   *
   * @param listener Listener function
   */
  remove_resize_listener(listener: ResizeListener) {
    const index = this.resize_listeners.findIndex(
      (query) => query === listener
    );
    if (index > -1) {
      this.resize_listeners.splice(index, 1);
    }
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
