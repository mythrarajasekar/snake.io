type SoundEffect = 'collect' | 'collectRare' | 'collectBonus' | 'lifeLost' | 'gameOver' | 'levelUp';

class AudioServiceClass {
  private ctx: AudioContext | null = null;
  private muted = false;
  private musicGain: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private musicPlaying = false;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(muted ? 0 : 0.06, this.getCtx().currentTime, 0.1);
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  play(effect: SoundEffect): void {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      switch (effect) {
        case 'collect':      this.playTone(ctx, 880, 0.08, 'sine',    0.06); break;
        case 'collectRare':  this.playChord(ctx, [880, 1108, 1320], 0.12, 0.08); break;
        case 'collectBonus': this.playChord(ctx, [1046, 1318, 1568], 0.18, 0.1); break;
        case 'lifeLost':     this.playTone(ctx, 220, 0.35, 'sawtooth', 0.12); break;
        case 'gameOver':     this.playDescend(ctx); break;
        case 'levelUp':      this.playAscend(ctx); break;
      }
    } catch {
      // audio unavailable — silently ignore
    }
  }

  startMusic(): void {
    if (this.musicPlaying) return;
    try {
      const ctx = this.getCtx();
      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = this.muted ? 0 : 0.06;
      this.musicGain.connect(ctx.destination);

      // Simple looping arpeggio: C major pentatonic
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      const interval = 0.22;
      let time = ctx.currentTime;

      const scheduleBar = () => {
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, time + i * interval);
          gain.gain.linearRampToValueAtTime(1, time + i * interval + 0.02);
          gain.gain.linearRampToValueAtTime(0, time + i * interval + interval - 0.02);
          osc.connect(gain);
          gain.connect(this.musicGain!);
          osc.start(time + i * interval);
          osc.stop(time + i * interval + interval);
          this.musicOscillators.push(osc);
        });
        time += notes.length * interval;
      };

      // Schedule 8 bars ahead, then loop
      for (let i = 0; i < 8; i++) scheduleBar();

      this.musicPlaying = true;

      // Re-schedule every 2 seconds to keep music going
      const loop = setInterval(() => {
        if (!this.musicPlaying) { clearInterval(loop); return; }
        try { scheduleBar(); } catch { clearInterval(loop); }
      }, 2000);
    } catch {
      // audio unavailable
    }
  }

  stopMusic(): void {
    this.musicPlaying = false;
    this.musicOscillators.forEach((o) => { try { o.stop(); } catch {} });
    this.musicOscillators = [];
    if (this.musicGain) {
      this.musicGain.disconnect();
      this.musicGain = null;
    }
  }

  private playTone(
    ctx: AudioContext,
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private playChord(ctx: AudioContext, freqs: number[], duration: number, volume: number): void {
    freqs.forEach((f) => this.playTone(ctx, f, duration, 'sine', volume / freqs.length));
  }

  private playDescend(ctx: AudioContext): void {
    [440, 349, 294, 220].forEach((f, i) => {
      setTimeout(() => this.playTone(ctx, f, 0.3, 'sawtooth', 0.1), i * 150);
    });
  }

  private playAscend(ctx: AudioContext): void {
    [523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => this.playTone(ctx, f, 0.15, 'sine', 0.08), i * 100);
    });
  }
}

export const AudioService = new AudioServiceClass();
export default AudioService;
