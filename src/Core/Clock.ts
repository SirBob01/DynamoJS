/**
 * Clock stores per-frame delta time information
 */
interface Clock {
  dt: number;
  dt_cap: number;
}

export type { Clock };
