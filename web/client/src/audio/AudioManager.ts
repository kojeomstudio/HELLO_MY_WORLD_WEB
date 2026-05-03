interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export class AudioManager {
    private audioContext: AudioContext | null = null;
    private volume: number = 0.5;
    private listenerPosition: Vec3 = { x: 0, y: 0, z: 0 };
    private positionalOutput: AudioNode | null = null;
    private static readonly MAX_DISTANCE = 16;

    constructor() {
        try {
            this.audioContext = new AudioContext();
        } catch {
            console.warn('Web Audio API not available');
        }
    }

    play(soundName: string, _volume: number = 0.5): void {
        this.playPositional(soundName, this.listenerPosition, this.listenerPosition);
    }

    setListenerPosition(x: number, y: number, z: number): void {
        this.listenerPosition = { x, y, z };
    }

    playPositional(soundType: string, position: Vec3, playerPosition: Vec3): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const dx = position.x - playerPosition.x;
        const dy = position.y - playerPosition.y;
        const dz = position.z - playerPosition.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance >= AudioManager.MAX_DISTANCE) return;

        const refDistSq = 16;
        const distanceFactor = refDistSq / (refDistSq + distance * distance);
        const pan = distance > 0.1 ? Math.max(-1, Math.min(1, dx / distance)) : 0;

        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(pan, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(distanceFactor, ctx.currentTime);

        panner.connect(gainNode);
        gainNode.connect(ctx.destination);

        this.positionalOutput = panner;
        this.playSound(soundType);
        this.positionalOutput = null;
    }

    setVolume(volume: number): void {
        this.volume = volume;
    }

    private getDestination(ctx: AudioContext): AudioNode {
        return this.positionalOutput ?? ctx.destination;
    }

    private playSound(soundName: string): void {
        switch (soundName) {
            case 'block_break': this.playBlockBreak(); break;
            case 'block_place': this.playBlockPlace(); break;
            case 'block_place_failed': this.playPlaceFailed(); break;
            case 'footstep': this.playFootstep(); break;
            case 'hurt': this.playHurt(); break;
            case 'mob_hurt': this.playMobHurt(); break;
            case 'explosion': this.playExplosion(); break;
            case 'splash': this.playSplash(); break;
            case 'pickup': this.playPickup(); break;
            case 'death': this.playDeath(); break;
            case 'eat': this.playEat(); break;
            case 'tool_breaks': this.playToolBreaks(); break;
            case 'punch_use': this.playPunchUse(); break;
        }
    }

    private playBlockBreak(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.1;

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(gain);
        gain.connect(this.getDestination(ctx));
        source.start();
    }

    private playBlockPlace(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.08;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.getDestination(ctx));
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playFootstep(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.05;

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.5;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(gain);
        gain.connect(this.getDestination(ctx));
        source.start();
    }

    private playHurt(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.2;

        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(200, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(153, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.getDestination(ctx));
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + duration);
        osc2.stop(ctx.currentTime + duration);
    }

    private playMobHurt(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.15;

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.4;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(oscGain);
        oscGain.connect(this.getDestination(ctx));
        noiseSource.connect(noiseGain);
        noiseGain.connect(this.getDestination(ctx));

        osc.start();
        noiseSource.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playExplosion(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.6;

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 6) * (1 - Math.sin(t * Math.PI * 80) * 0.3);
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.getDestination(ctx));
        source.start();
    }

    private playSplash(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.3;

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            data[i] = (Math.random() * 2 - 1) * (1 - t) * Math.sin(t * Math.PI * 30) * 0.5;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, ctx.currentTime);
        filter.Q.setValueAtTime(1, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.getDestination(ctx));
        source.start();
    }

    private playPickup(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.15;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.075);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
        gain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.getDestination(ctx));
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playDeath(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.5;

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.getDestination(ctx));
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playEat(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.2;
        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const t = i / ctx.sampleRate;
            data[i] = (Math.random() * 2 - 1) * Math.sin(t * 40) * (1 - i / bufferSize) * 0.5;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(this.getDestination(ctx));
        source.start();
    }

    private playToolBreaks(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.15;
        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.getDestination(ctx));
        source.start();
    }

    private playPlaceFailed(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.1;
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.getDestination(ctx));
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playPunchUse(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.08;
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + duration);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.getDestination(ctx));
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    dispose(): void {
        this.audioContext?.close();
    }

    playBlockSound(type: string): void {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (type === 'note_block') {
            this.playNoteBlockTone();
        } else if (type === 'jukebox') {
            this.playJukeboxMelody();
        } else {
            this.playBlockSoundGroup(type, 'place');
        }
    }

    playBlockSoundGroup(soundGroup: string, action: string): void {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const ctx = this.audioContext;
        const vol = this.volume;

        switch (soundGroup) {
            case 'stone':
            case 'metal': {
                const duration = action === 'break' ? 0.12 : 0.08;
                const bufferSize = Math.floor(ctx.sampleRate * duration);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
                }
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(2000, ctx.currentTime);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.getDestination(ctx));
                source.start();
                break;
            }
            case 'dirt':
            case 'grass':
            case 'sand':
            case 'gravel': {
                const duration = action === 'break' ? 0.15 : 0.1;
                const bufferSize = Math.floor(ctx.sampleRate * duration);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
                }
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, ctx.currentTime);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.getDestination(ctx));
                source.start();
                break;
            }
            case 'wood': {
                const duration = 0.06;
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(vol * 0.35, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.getDestination(ctx));
                osc.start();
                osc.stop(ctx.currentTime + duration);
                break;
            }
            case 'glass': {
                const duration = 0.2;
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.getDestination(ctx));
                osc.start();
                osc.stop(ctx.currentTime + duration);
                break;
            }
            case 'leaves':
            case 'cloth': {
                const duration = 0.1;
                const bufferSize = Math.floor(ctx.sampleRate * duration);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.3 * (1 - i / bufferSize);
                }
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(3000, ctx.currentTime);
                filter.Q.setValueAtTime(0.5, ctx.currentTime);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.getDestination(ctx));
                source.start();
                break;
            }
            case 'snow': {
                const duration = 0.08;
                const bufferSize = Math.floor(ctx.sampleRate * duration);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.15 * (1 - i / bufferSize);
                }
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1500, ctx.currentTime);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.getDestination(ctx));
                source.start();
                break;
            }
            default: {
                const duration = action === 'break' ? 0.1 : 0.08;
                const bufferSize = Math.floor(ctx.sampleRate * duration);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
                }
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                source.connect(gain);
                gain.connect(this.getDestination(ctx));
                source.start();
                break;
            }
        }
    }

    private playNoteBlockTone(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.8;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.getDestination(ctx));
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playJukeboxMelody(): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const notes = [523.25, 587.33, 659.25, 783.99, 659.25, 523.25];
        const noteDuration = 0.2;

        for (let i = 0; i < notes.length; i++) {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(notes[i], ctx.currentTime + i * noteDuration);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime + i * noteDuration);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * noteDuration);

            osc.connect(gain);
            gain.connect(this.getDestination(ctx));
            osc.start(ctx.currentTime + i * noteDuration);
            osc.stop(ctx.currentTime + (i + 1) * noteDuration);
        }
    }
}
