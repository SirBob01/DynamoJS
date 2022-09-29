import { Core } from './Core';

/**
 * State information for transitions
 */
interface TransitionInformation {
  /**
   * Next state
   */
  next: GameState | null;

  /**
   * Kill the previous state
   */
  kill: boolean;

  /**
   * Transitioning?
   */
  transition: boolean;
}

abstract class GameState {
  private transitionInfo: TransitionInformation;

  /**
   * A game state. User logic should be implemented
   * in a class that inherits from GameState.
   *
   * @return New GameState object
   */
  constructor() {
    this.transitionInfo = {
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
  setNext(next: GameState | null = null, kill = true) {
    this.transitionInfo.next = next;
    this.transitionInfo.kill = kill;
    this.transitionInfo.transition = true;
  }

  /**
   * Get the next state for a transition
   *
   * @returns Next state
   */
  getTransitionInfo() {
    return { ...this.transitionInfo };
  }

  /**
   * Load the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract onEntry(core: Core): void;

  /**
   * Exit the state. This can be overriden.
   * This is called only once in its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract onExit(core: Core): void;

  /**
   * Update the state at every frame. This can be overriden.
   * This is called throughout its lifetime.
   *
   * @param core Core modules passed by Engine
   */
  abstract update(core: Core): void;
}

export { GameState };
