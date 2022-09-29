import { AudioTrack } from './AudioTrack';

/**
 * A stream of long audio tracks, like music or dialogue
 */
interface AudioStream {
  /**
   * Current volume of the stream
   */
  volume: number;

  /**
   * List of audio tracks to be played
   */
  tracks: AudioTrack[];

  /**
   * Is the stream playing anything?
   */
  isPlaying: boolean;
}

export type { AudioStream };
