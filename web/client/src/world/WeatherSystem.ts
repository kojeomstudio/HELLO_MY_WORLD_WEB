import * as THREE from 'three';

const RAIN_COUNT = 800;
const RAIN_RADIUS = 50;
const RAIN_HEIGHT = 35;
const RAIN_SPEED = 25;
const WIND_ANGLE = 0.15;

export class WeatherSystem {
    private rainPoints: THREE.Points | null = null;
    private rainPositions: Float32Array | null = null;
    private rainVelocities: Float32Array | null = null;
    private isRaining: boolean = false;
    private scene: THREE.Scene;
    private groundLevel: number = 0;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.initRain();
    }

    private initRain(): void {
        const geometry = new THREE.BufferGeometry();
        this.rainPositions = new Float32Array(RAIN_COUNT * 3);
        this.rainVelocities = new Float32Array(RAIN_COUNT);

        for (let i = 0; i < RAIN_COUNT; i++) {
            this.resetRaindrop(i, true);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(this.rainPositions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x99bbdd,
            size: 0.3,
            transparent: true,
            opacity: 0.6,
            depthWrite: false
        });

        this.rainPoints = new THREE.Points(geometry, material);
        this.rainPoints.visible = false;
        this.scene.add(this.rainPoints);
    }

    private resetRaindrop(index: number, randomY: boolean): void {
        if (!this.rainPositions) return;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * RAIN_RADIUS;
        const i3 = index * 3;

        this.rainPositions[i3] = Math.cos(angle) * radius;
        this.rainPositions[i3 + 1] = randomY ? Math.random() * RAIN_HEIGHT : RAIN_HEIGHT + Math.random() * 10;
        this.rainPositions[i3 + 2] = Math.sin(angle) * radius;

        this.rainVelocities![index] = RAIN_SPEED * (0.8 + Math.random() * 0.4);
    }

    setRaining(raining: boolean): void {
        this.isRaining = raining;
        if (this.rainPoints) {
            this.rainPoints.visible = raining;
        }
    }

    getIsRaining(): boolean {
        return this.isRaining;
    }

    update(dt: number, playerX: number, playerY: number, playerZ: number): void {
        if (!this.isRaining || !this.rainPoints || !this.rainPositions || !this.rainVelocities) return;

        this.groundLevel = playerY - 10;
        const posAttr = this.rainPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
        let needsUpdate = false;

        for (let i = 0; i < RAIN_COUNT; i++) {
            const i3 = i * 3;
            this.rainPositions[i3] += Math.sin(WIND_ANGLE) * this.rainVelocities[i] * dt;
            this.rainPositions[i3 + 1] -= this.rainVelocities[i] * dt;
            this.rainPositions[i3 + 2] += Math.cos(WIND_ANGLE) * this.rainVelocities[i] * dt * 0.3;

            if (this.rainPositions[i3 + 1] < this.groundLevel) {
                this.rainPositions[i3] = playerX + (Math.random() - 0.5) * RAIN_RADIUS * 2;
                this.rainPositions[i3 + 1] = playerY + RAIN_HEIGHT * 0.5 + Math.random() * RAIN_HEIGHT * 0.5;
                this.rainPositions[i3 + 2] = playerZ + (Math.random() - 0.5) * RAIN_RADIUS * 2;
                needsUpdate = true;
            }
        }

        this.rainPoints.position.set(playerX, 0, playerZ);
        posAttr.needsUpdate = needsUpdate || true;
    }
}
