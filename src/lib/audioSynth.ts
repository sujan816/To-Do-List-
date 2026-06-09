/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynth {
  private ctx: AudioContext | null = null;
  private rainSource: AudioWorkletNode | ScriptProcessorNode | null = null;
  private rainGainNode: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playQuestComplete() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2 slightly staggered
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

      gain2.gain.setValueAtTime(0.1, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn("Sound blocked or unsupported in current browser: ", e);
    }
  }

  playLevelUp() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Arpeggio C Major

      notes.forEach((freq, index) => {
        const time = now + index * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternating waveforms for retro depth
        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        // Shiny vibrato
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.linearRampToValueAtTime(freq + (index * 5), time + 0.15);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.32);
      });
    } catch (e) {
      console.warn("Sound blocked: ", e);
    }
  }

  playThemeSong(themeId: string) {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      let notes: { freq: number; dur: number; type?: OscillatorType }[] = [];

      if (themeId === 'onepiece') {
        notes = [
          { freq: 523.25, dur: 0.15, type: 'sine' }, // C5
          { freq: 587.33, dur: 0.15, type: 'triangle' }, // D5
          { freq: 659.25, dur: 0.15, type: 'sine' }, // E5
          { freq: 783.99, dur: 0.25, type: 'triangle' }, // G5
          { freq: 880.00, dur: 0.2, type: 'sine' }, // A5
          { freq: 783.99, dur: 0.3, type: 'triangle' }, // G5
        ];
      } else if (themeId === 'naruto') {
        notes = [
          { freq: 329.63, dur: 0.15, type: 'triangle' }, // E4
          { freq: 392.00, dur: 0.15, type: 'sine' }, // G4
          { freq: 440.00, dur: 0.2, type: 'triangle' }, // A4
          { freq: 493.88, dur: 0.2, type: 'sine' }, // B4
          { freq: 440.00, dur: 0.15, type: 'triangle' }, // A4
          { freq: 392.00, dur: 0.15, type: 'sine' }, // G4
          { freq: 329.63, dur: 0.35, type: 'triangle' }, // E4
        ];
      } else if (themeId === 'deathnote') {
        notes = [
          { freq: 220.00, dur: 0.25, type: 'sine' }, // A3
          { freq: 246.94, dur: 0.25, type: 'sine' }, // B3
          { freq: 261.63, dur: 0.25, type: 'sine' }, // C4
          { freq: 246.94, dur: 0.25, type: 'sine' }, // B3
          { freq: 220.00, dur: 0.3, type: 'sine' }, // A3
          { freq: 207.65, dur: 0.3, type: 'sine' }, // G#3
          { freq: 220.00, dur: 0.4, type: 'sine' }, // A3
        ];
      } else if (themeId === 'breakingbad') {
        notes = [
          { freq: 196.00, dur: 0.3, type: 'triangle' }, // G3
          { freq: 261.63, dur: 0.3, type: 'sine' }, // C4
          { freq: 233.08, dur: 0.3, type: 'triangle' }, // A#3
          { freq: 196.00, dur: 0.5, type: 'sine' }, // G3
        ];
      } else if (themeId === 'got') {
        notes = [
          { freq: 196.00, dur: 0.3, type: 'sine' }, // G3
          { freq: 130.81, dur: 0.3, type: 'sine' }, // C3
          { freq: 155.56, dur: 0.15, type: 'triangle' }, // Eb3
          { freq: 174.61, dur: 0.15, type: 'triangle' }, // F3
          { freq: 196.00, dur: 0.3, type: 'sine' }, // G3
          { freq: 130.81, dur: 0.3, type: 'sine' }, // C3
          { freq: 146.83, dur: 0.15, type: 'triangle' }, // D3
          { freq: 155.56, dur: 0.15, type: 'triangle' }, // Eb3
          { freq: 130.81, dur: 0.5, type: 'sine' }, // C3
        ];
      } else {
        this.playLevelUp();
        return;
      }

      let accumTime = now;
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = note.type || 'sine';
        osc.frequency.setValueAtTime(note.freq, accumTime);

        gain.gain.setValueAtTime(0.0, accumTime);
        gain.gain.linearRampToValueAtTime(0.12, accumTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, accumTime + note.dur - 0.01);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(accumTime);
        osc.stop(accumTime + note.dur);

        accumTime += note.dur * 0.9;
      });
    } catch (e) {
      console.warn("Theme song playback failed: ", e);
    }
  }

  playClick() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  startRain(volume: number = 0.5) {
    try {
      const ctx = this.initCtx();
      if (this.rainSource) {
        this.stopRain();
      }

      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink/White noise generation
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter algorithm
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // normalise
        b6 = white * 0.115926;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Filter to make it warmer/cozier
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(450, ctx.currentTime);

      this.rainGainNode = ctx.createGain();
      this.rainGainNode.gain.setValueAtTime(volume * 0.25, ctx.currentTime);

      noiseNode.connect(lowpass);
      lowpass.connect(this.rainGainNode);
      this.rainGainNode.connect(ctx.destination);

      noiseNode.start();
      this.rainSource = noiseNode as any;

      // Periodic gentle patter of raindrops on glass
      this.scheduleDrips();
    } catch (e) {
      console.warn("Lofi ambient failed to start: ", e);
    }
  }

  private scheduleDrips() {
    if (!this.rainSource || !this.ctx) return;
    const ctx = this.ctx;
    
    const triggerDrip = () => {
      if (!this.rainSource) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Low frequent soft wet tap
      osc.frequency.setValueAtTime(120 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

      gain.gain.setValueAtTime(0.015 * (Math.random() * 0.8 + 0.4), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);

      // Schedule next random drip
      setTimeout(triggerDrip, 200 + Math.random() * 1500);
    };

    triggerDrip();
  }

  stopRain() {
    if (this.rainSource) {
      try {
        (this.rainSource as any).stop();
      } catch (e) {}
      this.rainSource = null;
    }
  }

  setRainVolume(volume: number) {
    if (this.rainGainNode && this.ctx) {
      this.rainGainNode.gain.linearRampToValueAtTime(volume * 0.25, this.ctx.currentTime + 0.1);
    }
  }
}

export const sfx = new AudioSynth();
