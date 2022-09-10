import { Surface } from '../Surface';

/**
 * Resize listener function
 */
type ResizeListener = (width: number, height: number) => void;

class Display extends Surface {
  private resize_listeners: ResizeListener[];

  /**
   * Primary display surface.
   *
   * @param container Container element
   * @return New Display object
   */
  constructor(container: HTMLElement) {
    super(container.clientWidth, container.clientHeight);
    container.appendChild(this.canvas);
    this.resize_listeners = [];

    // Listen for canvas resizing
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      this.set_size(clientWidth, clientHeight);
      this.resize_listeners.forEach((listener) => {
        listener(clientWidth, clientHeight);
      });
    });
    resizeObserver.observe(container);
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
}

export { Display };