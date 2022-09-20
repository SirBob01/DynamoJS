import { Vec2D } from '../../Math';

/**
 * Audio track reference for adjustable settings
 */
interface AudioTrackSettings {
  /**
   * Volume of the current track
   */
  volume: number;

  /**
   * Position of the track relative to the screen
   */
  position: Vec2D;
}

/**
 * Audio track meta information
 */
interface AudioTrack {
  /**
   * HTML audio media element
   */
  media: HTMLAudioElement;

  /**
   * Number of repetitions to play the track
   *
   * -1 if looping forever
   */
  loops: number;

  /**
   * Fade in time in seconds
   */
  fadein: number;

  /**
   * Track is playing
   */
  start: boolean;

  /**
   * Track is Skipping
   */
  skipped: boolean;

  /**
   * Audio source node
   */
  source_node: MediaElementAudioSourceNode;

  /**
   * Audio panning node
   */
  panner_node: PannerNode;

  /**
   * Audio gain node
   */
  gain_node: GainNode;

  /**
   * User-adjustable track settings
   */
  settings: AudioTrackSettings;
}

export type { AudioTrack, AudioTrackSettings };
