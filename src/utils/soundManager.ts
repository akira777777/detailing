/**
 * Sound Manager for UI audio feedback
 */

import { Howl } from 'howler';

type SoundName = 'click' | 'hover' | 'success' | 'error';

interface Sounds {
  [key: string]: Howl | undefined;
}

class SoundManager {
  private sounds: Sounds = {};
  private enabled: boolean = true;
  private volume: number = 0.3;
  private audioContext: AudioContext | null = null;

  /**
   * Lazy initialize AudioContext
   */
  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtor) {
        this.audioContext = new AudioCtor();
      }
    }
    return this.audioContext;
  }

  /**
   * Initialize sounds
   */
  init(): void {
    // Silent audio data URLs for placeholder sounds
    const silentWav = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=';

    this.sounds.click = new Howl({
      src: [silentWav],
      volume: this.volume,
    });

    this.sounds.hover = new Howl({
      src: [silentWav],
      volume: this.volume * 0.7,
    });

    this.sounds.success = new Howl({
      src: [silentWav],
      volume: this.volume,
    });

    this.sounds.error = new Howl({
      src: [silentWav],
      volume: this.volume * 0.8,
    });
  }

  /**
   * Play a sound by name
   */
  play(soundName: SoundName): void {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName]?.play();
    }
  }

  /**
   * Set the volume for all sounds
   */
  setVolume(volume: number): void {
    this.volume = volume;
    Object.values(this.sounds).forEach((sound) => {
      if (sound) sound.volume(volume);
    });
  }

  /**
   * Enable or disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Generate a simple tone using shared AudioContext
   */
  playTone(frequency = 440, duration = 100, volume = 0.3): void {
    if (!this.enabled) return;

    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    // Ensure context is running (browsers may suspend it)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.onended = () => {
      gainNode.disconnect();
    };

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }
}

export const soundManager = new SoundManager();

/**
 * Hook for using sounds in components
 */
export const useSound = () => {
  return {
    play: (soundName: SoundName) => soundManager.play(soundName),
    playTone: (frequency?: number, duration?: number, volume?: number) =>
      soundManager.playTone(frequency, duration, volume),
  };
};
 * Sound Manager for UI audio feedback
 */

import { Howl } from 'howler';

type SoundName = 'click' | 'hover' | 'success' | 'error';

interface Sounds {
  [key: string]: Howl | undefined;
}

class SoundManager {
  private sounds: Sounds = {};
  private enabled: boolean = true;
  private volume: number = 0.3;
  private audioContext: AudioContext | null = null;

  /**
   * Lazy initialize AudioContext
   */
  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtor) {
        this.audioContext = new AudioCtor();
      }
    }
    return this.audioContext;
  }

  /**
   * Initialize sounds
   */
  init(): void {
    // Silent audio data URLs for placeholder sounds
    const silentWav = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=';

    this.sounds.click = new Howl({
      src: [silentWav],
      volume: this.volume,
    });

    this.sounds.hover = new Howl({
      src: [silentWav],
      volume: this.volume * 0.7,
    });

    this.sounds.success = new Howl({
      src: [silentWav],
      volume: this.volume,
    });

    this.sounds.error = new Howl({
      src: [silentWav],
      volume: this.volume * 0.8,
    });
  }

  /**
   * Play a sound by name
   */
  play(soundName: SoundName): void {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName]?.play();
    }
  }

  /**
   * Set the volume for all sounds
   */
  setVolume(volume: number): void {
    this.volume = volume;
    Object.values(this.sounds).forEach((sound) => {
      if (sound) sound.volume(volume);
    });
  }

  /**
   * Enable or disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Generate a simple tone using shared AudioContext
   */
  playTone(frequency = 440, duration = 100, volume = 0.3): void {
    if (!this.enabled) return;

    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    // Ensure context is running (browsers may suspend it)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.onended = () => {
      gainNode.disconnect();
    };

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }
}

export const soundManager = new SoundManager();

/**
 * Hook for using sounds in components
 */
export const useSound = () => {
  return {
    play: (soundName: SoundName) => soundManager.play(soundName),
    playTone: (frequency?: number, duration?: number, volume?: number) =>
      soundManager.playTone(frequency, duration, volume),
  };
};

