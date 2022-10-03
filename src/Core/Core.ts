import { Clock } from './Clock';
import { Display } from './Display';
import { Input } from './Input';
import { Jukebox } from './Jukebox';

class Core {
  /**
   * Main display surface
   */
  readonly display: Display;

  /**
   * Audio engine
   */
  readonly audio: Jukebox;

  /**
   * Input handler
   */
  readonly input: Input;

  /**
   * Clock
   */
  readonly clock: Clock;

  /**
   * Container for all the core modules of the engine
   */
  constructor(container: HTMLElement) {
    this.display = new Display(container);
    this.audio = new Jukebox();
    this.input = new Input(this.display.canvas);
    this.clock = { dt: 0, dtCap: 100, elapsed: 0 };
  }
}

export { Core };
