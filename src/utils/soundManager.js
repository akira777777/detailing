import { Howl } from 'howler';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.3;
    this.audioContext = null; // Lazy initialized to prevent memory leak
  }

  // Lazy initialize AudioContext
  getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Инициализация звуков
  init() {
    this.sounds.click = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA='],
      volume: this.volume,
    });

    this.sounds.hover = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA='],
      volume: this.volume * 0.7,
    });

    this.sounds.success = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA='],
      volume: this.volume,
    });

    this.sounds.error = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA='],
      volume: this.volume * 0.8,
    });
  }

  play(soundName) {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName].play();
    }
  }

  setVolume(volume) {
    this.volume = volume;
    Object.values(this.sounds).forEach(sound => {
      if (sound) sound.volume(volume);
    });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Generate a simple tone using shared AudioContext
  playTone(frequency = 440, duration = 100, volume = 0.3) {
    if (!this.enabled) return;

    const audioContext = this.getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }
}

export const soundManager = new SoundManager();

// Hook для использования звуков
export const useSound = () => {
  return {
    play: (soundName) => soundManager.play(soundName),
    playTone: (frequency, duration, volume) => soundManager.playTone(frequency, duration, volume),
  };
};
