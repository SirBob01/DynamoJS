import { Surface } from '../Surface';

/**
 * Resize listener function
 */
type ResizeListener = (width: number, height: number) => void;

class Display extends Surface {
  private container: HTMLElement;
  private resizeListener: ResizeListener;
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
    this.resizeListener = () => {};
    this.fullscreen = false;

    // Listen for canvas resizing
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      this.setSize(clientWidth, clientHeight);
      this.resizeListener(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);

    // Listener for fullscreen toggle
    this.container.addEventListener('fullscreenchange', (event) => {
      const { clientWidth, clientHeight } = container;
      this.setSize(clientWidth, clientHeight);
      this.resizeListener(clientWidth, clientHeight);
    });
  }

  /**
   * Set the listener function that is called whenever
   * the display container is resized. This function should take
   * the updated width and height of the display.
   *
   * @param listener Listener function
   */
  setResizeListener(listener: ResizeListener) {
    this.resizeListener = listener;
  }

  /**
   * Remove a registered resize listener function, if it exists.
   */
  removeResizeListener() {
    this.resizeListener = () => {};
  }

  /**
   * Turn on fullscreen mode
   */
  setFullscreen(flag: boolean) {
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
  isFullscreen() {
    return this.fullscreen;
  }
}

export { Display };
