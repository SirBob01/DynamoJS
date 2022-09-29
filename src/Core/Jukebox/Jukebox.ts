import { Vec2D } from '../../Math';
import { AudioStream } from './AudioStream';
import { AudioTrack } from './AudioTrack';

class Jukebox {
  private static pathPrefix = '';

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
  maxDistance: number;

  /**
   * The audio engine.
   *
   * @return New Jukebox object
   */
  constructor() {
    this.context = new AudioContext();
    this.volume = 1.0;
    this.maxDistance = 1000;

    this.sounds = new Map();
    this.streams = new Map();
  }

  /**
   * Set the path prefix for where to load audio files
   */
  static setPathPrefix(prefix: string) {
    Jukebox.pathPrefix = prefix;
  }

  /**
   * Load a sound from a URL and map it to an ID.
   *
   * @param url Valid URL to an audio file
   * @param id  Key value for mapping
   */
  loadSound(url: string) {
    const fullpath = `${Jukebox.pathPrefix}${url}`;
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
  playSound(url: string, volume: number, position: Vec2D) {
    const fullpath = `${Jukebox.pathPrefix}${url}`;
    const buffer = this.sounds.get(fullpath);
    if (!buffer) {
      this.loadSound(fullpath);
      return;
    }

    const sourceNode = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    const pannerNode = this.context.createPanner();

    sourceNode.connect(pannerNode);
    pannerNode.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Set initial values
    sourceNode.buffer = buffer;

    pannerNode.panningModel = 'equalpower';
    pannerNode.distanceModel = 'linear';
    pannerNode.refDistance = 1;
    pannerNode.maxDistance = this.maxDistance;
    pannerNode.rolloffFactor = 1;
    pannerNode.coneInnerAngle = 360;
    pannerNode.coneOuterAngle = 0;
    pannerNode.coneOuterGain = 0;

    pannerNode.positionX.setValueAtTime(position.x, this.context.currentTime);
    pannerNode.positionZ.setValueAtTime(position.y, this.context.currentTime);

    gainNode.gain.value = volume * this.volume;

    sourceNode.start(0);
  }

  /**
   * Create a new audio stream.
   *
   * @param stream Name of the stream
   */
  createStream(stream: string) {
    this.streams.set(stream, {
      volume: 1.0,
      tracks: [],
      isPlaying: true,
    });
  }

  /**
   * Get a reference to an audio stream
   *
   * @param stream
   * @returns Audio stream, if it exists
   */
  getStream(stream: string) {
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
  queueStream(
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

      sourceNode: this.context.createMediaElementSource(media),
      pannerNode: this.context.createPanner(),
      gainNode: this.context.createGain(),

      settings: {
        volume,
        position,
      },
    };
    media.src = `${Jukebox.pathPrefix}${url}`;
    media.crossOrigin = 'anonymous';

    // Set node values
    track.pannerNode.panningModel = 'equalpower';
    track.pannerNode.distanceModel = 'linear';
    track.pannerNode.refDistance = 1;
    track.pannerNode.maxDistance = this.maxDistance;
    track.pannerNode.rolloffFactor = 1;
    track.pannerNode.coneInnerAngle = 360;
    track.pannerNode.coneOuterAngle = 0;
    track.pannerNode.coneOuterGain = 0;

    // Connect audio nodes
    track.sourceNode.connect(track.pannerNode);
    track.pannerNode.connect(track.gainNode);
    track.gainNode.connect(this.context.destination);

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
  skipStream(stream: string, fadeout = 0) {
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
    const gainNow = current.gainNode.gain.value;
    current.gainNode.gain.cancelScheduledValues(this.context.currentTime);
    current.gainNode.gain.value = gainNow;

    // Fade out
    current.gainNode.gain.linearRampToValueAtTime(
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
  clearStream(stream: string, fadeout = 0) {
    const tracks = this.streams.get(stream)?.tracks;
    if (!tracks) {
      throw new Error('"' + stream + '" audio stream does not exist.');
    }
    this.skipStream(stream, fadeout);
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
      current.pannerNode.positionX.setValueAtTime(
        current.settings.position.x,
        this.context.currentTime
      );
      current.pannerNode.positionZ.setValueAtTime(
        current.settings.position.y,
        this.context.currentTime
      );

      // Handle starting
      if (!current.start) {
        // Set fade effects
        current.gainNode.gain.value = 0;
        current.gainNode.gain.linearRampToValueAtTime(
          current.settings.volume * this.volume * stream.volume,
          this.context.currentTime + current.fadein
        );
        current.media.play();
        current.start = true;
      }

      // Handle skipping
      if (current.skipped && current.gainNode.gain.value == 0) {
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
