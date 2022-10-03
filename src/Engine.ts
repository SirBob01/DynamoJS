import { Core } from './Core';
import { GameState } from './GameState';
import { clamp } from './Utils';

class Engine {
  private states: GameState[];
  private running: boolean;
  private animationRequestId: number;
  private core: Core;

  /**
   * The main DynamoJS engine.
   *
   * @param container    Container element for the display
   * @param initialState Initial state of the application
   * @return New Engine object
   */
  constructor(container: HTMLElement, initialState: GameState) {
    this.core = new Core(container);
    this.states = [initialState];
    this.running = true;
    this.animationRequestId = 0;

    initialState.onEntry(this.core);
  }

  /**
   * Execute a single tick to update the game state.
   */
  tick() {
    this.core.display.clear();

    const currentState = this.states[this.states.length - 1];
    const transitionInfo = currentState.getTransitionInfo();

    if (transitionInfo.transition) {
      if (transitionInfo.kill) {
        currentState.onExit(this.core);
        this.states.pop();
      } else {
        transitionInfo.transition = false;
      }
      if (transitionInfo.next) {
        transitionInfo.next.onEntry(this.core);
        this.states.push(transitionInfo.next);
      }
    } else {
      currentState.update(this.core);
    }
    this.core.audio.update();
    this.core.input.refresh();
  }

  /**
   * The main() function for a DynamoJS program.
   * Persistently run the application.
   */
  run() {
    const startTime = performance.now();
    let lastTime = 0;
    const callback = (elapsed: number) => {
      this.core.clock.dt = clamp(elapsed - lastTime, 0, this.core.clock.dtCap);
      this.core.clock.elapsed = elapsed - startTime;
      lastTime = elapsed;
      this.tick();

      if (this.running) {
        this.animationRequestId = window.requestAnimationFrame(callback);
      } else if (this.animationRequestId) {
        window.cancelAnimationFrame(this.animationRequestId);
      }
    };
    this.animationRequestId = window.requestAnimationFrame(callback);
  }

  /**
   * Destroy this engine instance
   */
  destroy() {
    this.running = false;
    this.core.input.unregisterHandlers();
  }
}

export { Engine };
