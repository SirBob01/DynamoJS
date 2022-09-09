import { Surface } from '../Surface';
import { Clock } from './Clock';
import { Input } from './Input';
import { Jukebox } from './Jukebox';

class Core {
  readonly display: Surface;
  readonly audio: Jukebox;
  readonly input: Input;
  readonly clock: Clock;

  /**
   * Container for all the core modules of the engine
   */
  constructor() {
    const element = document.getElementById('display');
    if (!element) {
      throw new Error('Could not find canvas with id `display`');
    }
    this.display = new Surface(0, 0, element as HTMLCanvasElement);
    this.audio = new Jukebox();
    this.input = new Input();
    this.clock = {
      dt: 0,
      dt_cap: 100, // Protect integration from breaking
    };
  }
}

export { Core };
