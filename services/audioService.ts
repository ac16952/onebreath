/**
 * Generates soothing noise colors using Web Audio API.
 * This ensures the app is self-contained without needing external audio files.
 */
export class AudioGenerator {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // Lazy initialization
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playNoise(type: 'brown' | 'pink' | 'white') {
    this.init();
    if (!this.ctx) return;

    if (this.isPlaying) {
      this.stop();
    }

    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'white') {
        output[i] = white;
      } else if (type === 'pink') {
        // Simplified pink-noise approximation using previous sample
        output[i] = (white + (i > 0 ? output[i - 1] : 0)) / 2;
      } else if (type === 'brown') {
        // Brown noise is integrated white noise
        const lastOut = i > 0 ? output[i - 1] : 0;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        output[i] *= 3.5; // Compensate for gain loss
      }
    }

    this.source = this.ctx.createBufferSource();
    this.source.buffer = buffer;
    this.source.loop = true;
    
    this.gainNode = this.ctx.createGain();
    // Fade in
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 1); // Low volume for calm
    
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.source.start();
    this.isPlaying = true;
  }

  public stop() {
    if (this.ctx && this.gainNode && this.source) {
      // Fade out
      this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        this.source?.stop();
        this.source?.disconnect();
        this.isPlaying = false;
      }, 500);
    }
  }

  public toggle(type: 'brown' | 'pink' | 'white') {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.playNoise(type);
    }
    return !this.isPlaying;
  }
}

export const audioGenerator = new AudioGenerator();
