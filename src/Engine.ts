import { Core } from './Core';
import { GameState } from './GameState';
import { clamp } from './Utils';

class Engine {
  private states: GameState[];
  private running: boolean;
  private animation_request_id: number;
  private core: Core;

  /**
   * The main DynamoJS engine.
   *
   * @param initial_state Initial state of the application
   * @return New Engine object
   */
  constructor(initial_state: GameState) {
    this.core = new Core();
    this.states = [initial_state];
    this.running = true;
    this.animation_request_id = 0;

    initial_state.on_entry(this.core);
    this.core.input.poll(this.core.display.canvas);
  }

  /**
   * Execute a single tick to update the game state.
   */
  tick() {
    this.core.display.clear();

    const current_state = this.states[this.states.length - 1];
    const transition_info = current_state.get_transition_info();

    if (transition_info.transition) {
      if (transition_info.kill) {
        current_state.on_exit(this.core);
        this.states.pop();
      } else {
        transition_info.transition = false;
      }
      if (transition_info.next) {
        transition_info.next.on_entry(this.core);
        this.states.push(transition_info.next);
      }
    } else {
      current_state.update(this.core);
    }
    this.core.audio.update();
    this.core.input.refresh();
  }

  /**
   * The main() function for a DynamoJS program.
   * Persistently run the application.
   */
  run() {
    let last_time = 0;
    const callback = (elapsed: number) => {
      this.core.clock.dt = clamp(
        elapsed - last_time,
        0,
        this.core.clock.dt_cap
      );
      last_time = elapsed;
      this.tick();

      if (this.running) {
        this.animation_request_id = window.requestAnimationFrame(callback);
      } else if (this.animation_request_id) {
        window.cancelAnimationFrame(this.animation_request_id);
      }
    };
    this.animation_request_id = window.requestAnimationFrame(callback);
  }

  /**
   * Destroy this engine instance
   */
  destroy() {
    this.running = false;
    this.core.input.unregister_handlers();
  }
}

export { Engine };
