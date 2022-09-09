import { Core } from './Core';

/**
 * State information for transitions
 */
interface TransitionInformation {
  next: GameState | null;
  kill: boolean;
  transition: boolean;
}

abstract class GameState {
  private transition_info: TransitionInformation;

  /**
   * A game state. User logic should be implemented
   * in a class that inherits from GameState.
   *
   * @return New GameState object
   */
  constructor() {
    this.transition_info = {
      next: null,
      kill: false,
      transition: false,
    };
  }

  /**
   * Set the next state for transitioning.
   *
   * @param next GameState after transitioning
   * @param kill Should the current state be killed?
   */
  set_next(next: GameState | null = null, kill = true) {
    this.transition_info.next = next;
    this.transition_info.kill = kill;
    this.transition_info.transition = true;
  }

  /**
   * Get the next state for a transition
   *
   * @returns Next state
   */
  get_transition_info() {
    return { ...this.transition_info };
  }

  /**
   * Load the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract on_entry(core: Core): void;

  /**
   * Exit the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract on_exit(core: Core): void;

  /**
   * Update the state at every frame. This can be overriden.
   * This is called throughout its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract update(core: Core): void;
}

export { GameState };
