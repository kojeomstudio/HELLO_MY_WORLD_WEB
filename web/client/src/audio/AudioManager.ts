export class AudioManager {
    private audioContext: AudioContext | null = null;

    constructor() {
        try {
            this.audioContext = new AudioContext();
        } catch {
            console.warn('Web Audio API not available');
        }
    }

    play(_soundName: string, _volume: number = 0.5): void {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    dispose(): void {
        this.audioContext?.close();
    }
}
