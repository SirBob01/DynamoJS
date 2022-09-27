import { Vec2D } from '../../Math';
import { AudioStream } from './AudioStream';
import { AudioTrack } from './AudioTrack';

class Jukebox {
  private static path_prefix = '';

  private context: AudioContext;
  private sounds: Map<string, AudioBuffer>;
  private streams: Map<string, AudioStream>;

  /**
   * Global volume level for the application
   */
  volume: number;

  /**
   * Maximum possible distance between an audio source and the listener
   */
  max_distance: number;

  /**
   * The audio engine.
   *
   * @return New Jukebox object
   */
  constructor() {
    this.context = new AudioContext();
    this.volume = 1.0;
    this.max_distance = 1000;

    this.sounds = new Map();
    this.streams = new Map();
  }

  /**
   * Set the path prefix for where to load audio files
   */
  static set_path_prefix(prefix: string) {
    Jukebox.path_prefix = prefix;
  }

  /**
   * Load a sound from a URL and map it to an ID.
   *
   * @param url Valid URL to an audio file
   * @param id  Key value for mapping
   */
  load_sound(url: string) {
    const fullpath = `${Jukebox.path_prefix}${url}`;
    const request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.onreadystatechange = () => {
      if (request.status == 200 && request.readyState == 4) {
        this.context.decodeAudioData(
          request.response,
          (buffer) => {
            this.sounds.set(fullpath, buffer);
          },
          (err) => {
            throw new Error('Error decoding ' + fullpath + ': ' + err);
          }
        );
      }
    };
    request.open('GET', fullpath, true);
    request.send();
  }

  /**
   * Play a sound effect.
   *
   * @param url      Valid URL to an audio file
   * @param volume   Volume of sound between [0, 1]
   * @param position Location of the sound relative to origin
   */
  play_sound(url: string, volume: number, position: Vec2D) {
    const fullpath = `${Jukebox.path_prefix}${url}`;
    const buffer = this.sounds.get(fullpath);
    if (!buffer) {
      this.load_sound(fullpath);
      return;
    }

    const source_node = this.context.createBufferSource();
    const gain_node = this.context.createGain();
    const panner_node = this.context.createPanner();

    source_node.connect(panner_node);
    panner_node.connect(gain_node);
    gain_node.connect(this.context.destination);

    // Set initial values
    source_node.buffer = buffer;

    panner_node.panningModel = 'equalpower';
    panner_node.distanceModel = 'linear';
    panner_node.refDistance = 1;
    panner_node.maxDistance = this.max_distance;
    panner_node.rolloffFactor = 1;
    panner_node.coneInnerAngle = 360;
    panner_node.coneOuterAngle = 0;
    panner_node.coneOuterGain = 0;

    panner_node.positionX.setValueAtTime(position.x, this.context.currentTime);
    panner_node.positionZ.setValueAtTime(position.y, this.context.currentTime);

    gain_node.gain.value = volume * this.volume;

    source_node.start(0);
  }

  /**
   * Create a new audio stream.
   *
   * @param stream Name of the stream
   */
  create_stream(stream: string) {
    this.streams.set(stream, {
      volume: 1.0,
      tracks: [],
      is_playing: true,
    });
  }

  /**
   * Get a reference to an audio stream
   *
   * @param stream
   * @returns Audio stream, if it exists
   */
  get_stream(stream: string) {
    return this.streams.get(stream);
  }

  /**
   * Queue a new track onto the stream.
   *
   * @param stream   Name of the stream
   * @param url      Valid URL to an audio file
   * @param volume   Volume of sound between [0, 1]
   * @param fadein   Fade in time in seconds
   * @param loops    Number of repetitions (-1 for infinite)
   * @param position Location of the sound relative to origin
   * @return User-accessible track information
   */
  queue_stream(
    stream: string,
    url: string,
    volume: number,
    fadein: number,
    loops: number,
    position: Vec2D
  ) {
    if (!this.streams.has(stream)) {
      throw new Error('"' + stream + '" audio stream does not exist.');
    }
    const media = new Audio();
    const track: AudioTrack = {
      media,
      loops,
      fadein,
      start: false,
      skipped: false,

      source_node: this.context.createMediaElementSource(media),
      panner_node: this.context.createPanner(),
      gain_node: this.context.createGain(),

      settings: {
        volume,
        position,
      },
    };
    media.src = `${Jukebox.path_prefix}${url}`;
    media.crossOrigin = 'anonymous';

    // Set node values
    track.panner_node.panningModel = 'equalpower';
    track.panner_node.distanceModel = 'linear';
    track.panner_node.refDistance = 1;
    track.panner_node.maxDistance = this.max_distance;
    track.panner_node.rolloffFactor = 1;
    track.panner_node.coneInnerAngle = 360;
    track.panner_node.coneOuterAngle = 0;
    track.panner_node.coneOuterGain = 0;

    // Connect audio nodes
    track.source_node.connect(track.panner_node);
    track.panner_node.connect(track.gain_node);
    track.gain_node.connect(this.context.destination);

    // Enqueue the track
    const tracks = this.streams.get(stream)?.tracks;
    if (!tracks) {
      throw new Error(`"${stream}" stream does not exist.`);
    }
    tracks.push(track);
    return track.settings;
  }

  /**
   * Skip the current track on a stream.
   *
   * @param stream  Name of the stream
   * @param fadeout Fade out time in seconds
   */
  skip_stream(stream: string, fadeout = 0) {
    const s = this.streams.get(stream);
    if (!s) {
      throw new Error('"' + stream + '" audio stream does not exist.');
    }
    if (s.tracks.length == 0) {
      return;
    }
    const current = s.tracks[0];
    current.skipped = true;

    // Cancel any occurring fades
    const gain_now = current.gain_node.gain.value;
    current.gain_node.gain.cancelScheduledValues(this.context.currentTime);
    current.gain_node.gain.value = gain_now;

    // Fade out
    current.gain_node.gain.linearRampToValueAtTime(
      0,
      this.context.currentTime + fadeout
    );
  }

  /**
   * Clear all tracks on the stream.
   *
   * @param stream  Name of the stream
   * @param fadeout Fade out time in seconds
   */
  clear_stream(stream: string, fadeout = 0) {
    const tracks = this.streams.get(stream)?.tracks;
    if (!tracks) {
      throw new Error('"' + stream + '" audio stream does not exist.');
    }
    this.skip_stream(stream, fadeout);
    tracks.splice(0, tracks.length);
  }

  /**
   * Update all streams.
   */
  update() {
    this.streams.forEach((stream) => {
      if (stream.tracks.length == 0) {
        return;
      }
      const current = stream.tracks[0];

      // Keep track of position
      current.panner_node.positionX.setValueAtTime(
        current.settings.position.x,
        this.context.currentTime
      );
      current.panner_node.positionZ.setValueAtTime(
        current.settings.position.y,
        this.context.currentTime
      );

      // Handle starting
      if (!current.start) {
        // Set fade effects
        current.gain_node.gain.value = 0;
        current.gain_node.gain.linearRampToValueAtTime(
          current.settings.volume * this.volume * stream.volume,
          this.context.currentTime + current.fadein
        );
        current.media.play();
        current.start = true;
      }

      // Handle skipping
      if (current.skipped && current.gain_node.gain.value == 0) {
        current.media.pause();
        stream.tracks.shift();
      }

      // Handle ending
      if (current.media.ended) {
        current.start = false;
        if (current.loops != 0) {
          current.loops--;
        } else {
          stream.tracks.shift();
        }
      }
    });
  }
}

export { Jukebox };
