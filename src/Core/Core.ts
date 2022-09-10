import { Clock } from './Clock';
import { Display } from './Display';
import { Input } from './Input';
import { Jukebox } from './Jukebox';

class Core {
  readonly display: Display;
  readonly audio: Jukebox;
  readonly input: Input;
  readonly clock: Clock;

  /**
   * Container for all the core modules of the engine
   */
  constructor(container: HTMLElement) {
    this.display = new Display(container);
    this.audio = new Jukebox();
    this.input = new Input();
    this.clock = {
      dt: 0,
      dt_cap: 100, // Protect integration from breaking
    };
  }
}

export { Core };
