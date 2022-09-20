/**
 * Clock stores per-frame delta time information
 */
interface Clock {
  /**
   * Current delta time
   */
  dt: number;

  /**
   * Maximum value of delta time to protect against integration issues
   */
  dt_cap: number;

  /**
   * Total amount of time in milliseconds since Engine.run() was called
   */
  elapsed: number;
}

export type { Clock };
