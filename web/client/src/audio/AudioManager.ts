export class AudioManager {
    private audioContext: AudioContext | null = null;

    constructor() {
        try {
            this.audioContext = new AudioContext();
        } catch {
            console.warn('Web Audio API not available');
        }
    }

    play(soundName: string, volume: number = 0.5): void {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        switch (soundName) {
            case 'block_break': this.playBlockBreak(volume); break;
            case 'block_place': this.playBlockPlace(volume); break;
            case 'footstep': this.playFootstep(volume); break;
            case 'hurt': this.playHurt(volume); break;
            case 'pickup': this.playPickup(volume); break;
            case 'death': this.playDeath(volume); break;
        }
    }

    private playBlockBreak(volume: number): void {
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
        gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }

    private playBlockPlace(volume: number): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.08;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playFootstep(volume: number): void {
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
        gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }

    private playHurt(volume: number): void {
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
        gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + duration);
        osc2.stop(ctx.currentTime + duration);
    }

    private playPickup(volume: number): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.15;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.075);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
        gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playDeath(volume: number): void {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const duration = 0.5;

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    dispose(): void {
        this.audioContext?.close();
    }
}
