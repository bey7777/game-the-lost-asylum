import { CONFIG } from './config.js';

class AudioManager {
    constructor() {
        this.ctx = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.musicGain = this.ctx.createGain();
            this.sfxGain = this.ctx.createGain();

            this.musicGain.gain.value = CONFIG.DEFAULT_SETTINGS.musicVolume;
            this.sfxGain.gain.value = CONFIG.DEFAULT_SETTINGS.sfxVolume;

            this.musicGain.connect(this.ctx.destination);
            this.sfxGain.connect(this.ctx.destination);

            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API tidak didukung penuh:", e);
        }
    }

    setVolumes(music, sfx) {
        if (!this.initialized) return;
        this.musicGain.gain.value = music;
        this.sfxGain.gain.value = sfx;
    }

    playTone(freq, type, duration, gainVal = 0.1, delay = 0) {
        if (!this.initialized) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(this.ctx.currentTime + delay);
            osc.stop(this.ctx.currentTime + delay + duration);
        } catch (e) {
            // Fallback aman jika audio error
        }
    }

    playStep() {
        this.playTone(120, 'triangle', 0.08, 0.05);
    }

    playItemPick() {
        this.playTone(440, 'sine', 0.1, 0.1);
        this.playTone(660, 'sine', 0.15, 0.1, 0.1);
    }

    playDoorOpen() {
        this.playTone(90, 'sawtooth', 0.3, 0.15);
    }

    playJumpscare() {
        this.playTone(60, 'sawtooth', 0.8, 0.4);
        this.playTone(800, 'square', 0.5, 0.3);
    }
}

export const audioManager = new AudioManager();