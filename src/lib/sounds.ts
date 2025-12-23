
class SoundManager {
  private audioContext: AudioContext | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  private currentNoteIndex: number = 0;

  // Simple 8-bit melody (frequencies in Hz)
  // C Major scale pattern
  private melody = [
    523.25, 0, 523.25, 587.33, 659.25, 0, 523.25, 0,
    783.99, 0, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25,
    392.00, 0, 392.00, 440.00, 493.88, 0, 392.00, 0,
    523.25, 0, 659.25, 0, 783.99, 0, 523.25, 0
  ];

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

  toggleMusic(shouldPlay: boolean) {
    this.isMuted = !shouldPlay;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  async startMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    
    try {
      const ctx = await this.ensureContext();
      this.isMusicPlaying = true;
      this.currentNoteIndex = 0;

      // Create a master gain for music
      this.musicGainNode = ctx.createGain();
      this.musicGainNode.gain.value = 0.05; // Low volume for background
      this.musicGainNode.connect(ctx.destination);

      const noteDuration = 0.2; // seconds
      const intervalTime = noteDuration * 1000;

      const playNextNote = () => {
        if (!this.isMusicPlaying || !this.musicGainNode) return;

        const freq = this.melody[this.currentNoteIndex];
        this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

        if (freq > 0) {
          const osc = ctx.createOscillator();
          osc.type = 'square'; // 8-bit sound
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          const noteGain = ctx.createGain();
          noteGain.gain.setValueAtTime(0.1, ctx.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + noteDuration - 0.05);
          
          osc.connect(noteGain);
          noteGain.connect(this.musicGainNode!);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + noteDuration);
        }
      };

      playNextNote(); // Play first immediately
      this.musicInterval = setInterval(playNextNote, intervalTime);

    } catch (e) {
      console.error("Music start failed", e);
      this.isMusicPlaying = false;
    }
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGainNode) {
      this.musicGainNode.disconnect();
      this.musicGainNode = null;
    }
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
        const startTime = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle'; // Changed to triangle for better audibility
        
        // Happy arpeggio
        osc.frequency.setValueAtTime(523.25, startTime); // C5
        osc.frequency.setValueAtTime(659.25, startTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, startTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, startTime + 0.3); // C6
        
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(startTime + 0.6);
      } catch (e) {
          console.error("Audio play failed", e);
      }
  }

  async playReveal() {
    try {
      const ctx = await this.ensureContext();
      const startTime = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, startTime); // A5
      
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(startTime + 0.1);
    } catch (e) {
        console.error("Audio play failed", e);
    }
  }
}

export const soundManager = new SoundManager();
