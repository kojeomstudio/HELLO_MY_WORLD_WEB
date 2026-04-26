import * as THREE from 'three';

export type WeatherType = 'none' | 'rain' | 'snow';

const RAIN_COUNT = 800;
const RAIN_RADIUS = 50;
const RAIN_HEIGHT = 35;
const RAIN_SPEED = 25;
const WIND_ANGLE = 0.15;

const SNOW_COUNT = 600;
const SNOW_SPEED = 5;
const SNOW_DRIFT = 2;

export class WeatherSystem {
    private rainPoints: THREE.Points | null = null;
    private rainPositions: Float32Array | null = null;
    private rainVelocities: Float32Array | null = null;
    private snowPoints: THREE.Points | null = null;
    private snowPositions: Float32Array | null = null;
    private snowVelocities: Float32Array | null = null;
    private weatherType: WeatherType = 'none';
    private scene: THREE.Scene;
    private groundLevel: number = 0;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.initRain();
        this.initSnow();
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

    private initSnow(): void {
        const geometry = new THREE.BufferGeometry();
        this.snowPositions = new Float32Array(SNOW_COUNT * 3);
        this.snowVelocities = new Float32Array(SNOW_COUNT);

        for (let i = 0; i < SNOW_COUNT; i++) {
            this.resetSnowflake(i, true);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(this.snowPositions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.4,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });

        this.snowPoints = new THREE.Points(geometry, material);
        this.snowPoints.visible = false;
        this.scene.add(this.snowPoints);
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

    private resetSnowflake(index: number, randomY: boolean): void {
        if (!this.snowPositions) return;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * RAIN_RADIUS;
        const i3 = index * 3;

        this.snowPositions[i3] = Math.cos(angle) * radius;
        this.snowPositions[i3 + 1] = randomY ? Math.random() * RAIN_HEIGHT : RAIN_HEIGHT + Math.random() * 10;
        this.snowPositions[i3 + 2] = Math.sin(angle) * radius;

        this.snowVelocities![index] = SNOW_SPEED * (0.7 + Math.random() * 0.6);
    }

    toggleWeather(): WeatherType {
        if (this.weatherType === 'none') {
            this.weatherType = 'rain';
        } else if (this.weatherType === 'rain') {
            this.weatherType = 'snow';
        } else {
            this.weatherType = 'none';
        }
        this.applyWeather();
        return this.weatherType;
    }

    private applyWeather(): void {
        if (this.rainPoints) {
            this.rainPoints.visible = this.weatherType === 'rain';
        }
        if (this.snowPoints) {
            this.snowPoints.visible = this.weatherType === 'snow';
        }
    }

    setRaining(raining: boolean): void {
        this.weatherType = raining ? 'rain' : 'none';
        this.applyWeather();
    }

    getIsRaining(): boolean {
        return this.weatherType === 'rain';
    }

    getWeatherType(): WeatherType {
        return this.weatherType;
    }

    update(dt: number, playerX: number, playerY: number, playerZ: number): void {
        this.groundLevel = playerY - 10;

        if (this.weatherType === 'rain') {
            this.updateRain(dt, playerX, playerZ);
        } else if (this.weatherType === 'snow') {
            this.updateSnow(dt, playerX, playerZ);
        }
    }

    private updateRain(dt: number, playerX: number, playerZ: number): void {
        if (!this.rainPoints || !this.rainPositions || !this.rainVelocities) return;

        const posAttr = this.rainPoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < RAIN_COUNT; i++) {
            const i3 = i * 3;
            this.rainPositions[i3] += Math.sin(WIND_ANGLE) * this.rainVelocities[i] * dt;
            this.rainPositions[i3 + 1] -= this.rainVelocities[i] * dt;
            this.rainPositions[i3 + 2] += Math.cos(WIND_ANGLE) * this.rainVelocities[i] * dt * 0.3;

            if (this.rainPositions[i3 + 1] < this.groundLevel) {
                this.rainPositions[i3] = (Math.random() - 0.5) * RAIN_RADIUS * 2;
                this.rainPositions[i3 + 1] = RAIN_HEIGHT * 0.5 + Math.random() * RAIN_HEIGHT * 0.5;
                this.rainPositions[i3 + 2] = (Math.random() - 0.5) * RAIN_RADIUS * 2;
            }
        }

        this.rainPoints.position.set(playerX, 0, playerZ);
        posAttr.needsUpdate = true;
    }

    private updateSnow(dt: number, playerX: number, playerZ: number): void {
        if (!this.snowPoints || !this.snowPositions || !this.snowVelocities) return;

        const posAttr = this.snowPoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < SNOW_COUNT; i++) {
            const i3 = i * 3;
            this.snowPositions[i3] += Math.sin(i * 0.7 + this.snowPositions[i3 + 1] * 0.1) * SNOW_DRIFT * dt;
            this.snowPositions[i3 + 1] -= this.snowVelocities[i] * dt;
            this.snowPositions[i3 + 2] += Math.cos(i * 1.3 + this.snowPositions[i3 + 1] * 0.1) * SNOW_DRIFT * dt;

            if (this.snowPositions[i3 + 1] < this.groundLevel) {
                this.snowPositions[i3] = (Math.random() - 0.5) * RAIN_RADIUS * 2;
                this.snowPositions[i3 + 1] = RAIN_HEIGHT * 0.5 + Math.random() * RAIN_HEIGHT * 0.5;
                this.snowPositions[i3 + 2] = (Math.random() - 0.5) * RAIN_RADIUS * 2;
            }
        }

        this.snowPoints.position.set(playerX, 0, playerZ);
        posAttr.needsUpdate = true;
    }
}
