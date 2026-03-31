import * as THREE from 'three';
import { CloudSystem } from './CloudSystem';

export class Renderer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private canvas: HTMLCanvasElement;
    private skyLight: THREE.DirectionalLight;
    private ambientLight: THREE.AmbientLight;
    private fog: THREE.Fog;
    private skyColor: THREE.Color;
    private cloudSystem: CloudSystem;
    private damageFlashEl: HTMLElement;
    private vignetteEl: HTMLElement;
    private lavaOverlayEl: HTMLElement;
    private damageFlashIntensity: number = 0;
    private currentBrightness: number = 1;
    private isRaining: boolean = false;
    private normalFogNear: number = 80;
    private normalFogFar: number = 160;
    private rainFogNear: number = 30;
    private rainFogFar: number = 80;

    constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'game-canvas';
        container.appendChild(this.canvas);

        this.scene = new THREE.Scene();
        this.skyColor = new THREE.Color(0x87CEEB);
        this.scene.background = this.skyColor;
        this.fog = new THREE.Fog(this.skyColor, 80, 160);
        this.scene.fog = this.fog;

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = false;

        this.skyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.skyLight.position.set(100, 200, 100);
        this.scene.add(this.skyLight);

        this.ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(this.ambientLight);

        this.addSkyDome();
        this.setupResizeHandler();
        this.cloudSystem = new CloudSystem(this.scene);

        this.damageFlashEl = document.getElementById('damage-flash')!;
        this.vignetteEl = document.getElementById('cave-vignette')!;
        this.lavaOverlayEl = document.getElementById('lava-overlay')!;
    }

    private addSkyDome(): void {
        const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide,
        });
        const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        skyMesh.name = 'sky';
        this.scene.add(skyMesh);

        const sunGeometry = new THREE.SphereGeometry(15, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        sunMesh.position.set(200, 150, -100);
        sunMesh.name = 'sun';
        this.scene.add(sunMesh);
    }

    private setupResizeHandler(): void {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    getScene(): THREE.Scene { return this.scene; }
    getCamera(): THREE.PerspectiveCamera { return this.camera; }
    getCanvas(): HTMLCanvasElement { return this.canvas; }
    getBrightness(): number { return this.currentBrightness; }

    setFov(fov: number): void {
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
    }

    setRaining(raining: boolean): void {
        this.isRaining = raining;
    }

    addToScene(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    removeFromScene(object: THREE.Object3D): void {
        this.scene.remove(object);
    }

    updateSkyBrightness(brightness: number): void {
        this.currentBrightness = brightness;

        let r = 0.53 * brightness;
        let g = 0.81 * brightness;
        let b = 0.92 * brightness;

        if (this.isRaining) {
            const rainMix = 0.3;
            r = r * (1 - rainMix) + 0.4 * rainMix;
            g = g * (1 - rainMix) + 0.42 * rainMix;
            b = b * (1 - rainMix) + 0.48 * rainMix;
        }

        this.skyColor.setRGB(r, g, b);
        this.scene.background = this.skyColor;
        (this.scene.fog as THREE.Fog).color = this.skyColor;

        this.fog.near = this.isRaining ? this.rainFogNear : this.normalFogNear;
        this.fog.far = this.isRaining ? this.rainFogFar : this.normalFogFar;

        this.skyLight.intensity = this.isRaining ? brightness * 0.6 : brightness;
        this.ambientLight.intensity = this.isRaining ? 0.3 + 0.3 * brightness : 0.2 + 0.6 * brightness;

        const sky = this.scene.getObjectByName('sky');
        if (sky) {
            (sky as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                color: this.skyColor,
                side: THREE.BackSide,
            });
        }
    }

    updateClouds(dt: number): void {
        this.cloudSystem.update(this.currentBrightness, dt);
    }

    flashDamage(intensity: number): void {
        this.damageFlashIntensity = intensity;
        this.damageFlashEl.style.opacity = String(intensity);
    }

    private updateDamageFlash(dt: number): void {
        if (this.damageFlashIntensity > 0) {
            this.damageFlashIntensity -= dt / 0.3;
            if (this.damageFlashIntensity < 0) this.damageFlashIntensity = 0;
            this.damageFlashEl.style.opacity = String(this.damageFlashIntensity);
        }
    }

    updateCaveDarkness(playerY: number, isUnderground: boolean): void {
        if (isUnderground && playerY < 30) {
            const depth = Math.min(1, (30 - playerY) / 25);
            const vignetteOpacity = 0.4 + 0.5 * depth;
            const ambientDim = 1 - depth * 0.7;
            this.vignetteEl.style.opacity = String(vignetteOpacity);
            this.ambientLight.intensity = (0.2 + 0.6 * this.currentBrightness) * ambientDim;
        } else {
            this.vignetteEl.style.opacity = '0';
            this.ambientLight.intensity = 0.2 + 0.6 * this.currentBrightness;
        }
    }

    updateLavaEffect(nearLava: boolean): void {
        this.lavaOverlayEl.style.opacity = nearLava ? '0.3' : '0';
    }

    updateEffects(dt: number): void {
        this.updateDamageFlash(dt);
    }

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
