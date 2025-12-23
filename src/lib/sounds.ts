
class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private async ensureContext() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  }

  async playWrongGuess() {
    try {
      const ctx = await this.ensureContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  async playTimerEnd() {
    try {
      const ctx = await this.ensureContext();
      const now = ctx.currentTime;

      // Sequence of tones
      const playTone = (freq: number, startTime: number, duration: number, type: OscillatorType = 'square') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      playTone(880, now, 0.1);
      playTone(880, now + 0.15, 0.1);
      playTone(880, now + 0.3, 0.1);
      playTone(440, now + 0.45, 0.6, 'sawtooth');

    } catch (e) {
      console.error("Audio play failed", e);
    }
  }
  
  async playCorrectGuess() {
      try {
        const ctx = await this.ensureContext();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {
          console.error("Audio play failed", e);
      }
  }
}

export const soundManager = new SoundManager();
