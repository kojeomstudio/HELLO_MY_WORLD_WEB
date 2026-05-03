import * as THREE from 'three';
import { CloudSystem } from './CloudSystem';

const SKY_COLORS = {
    day: new THREE.Color(0.412, 0.647, 0.863),
    dayHorizon: new THREE.Color(0.843, 0.902, 1.0),
    dawn: new THREE.Color(0.706, 0.471, 0.314),
    dawnHorizon: new THREE.Color(1.0, 0.706, 0.471),
    night: new THREE.Color(0.039, 0.039, 0.118),
    nightHorizon: new THREE.Color(0.098, 0.098, 0.196)
};

class FrustumPlane {
    normal: THREE.Vector3;
    distance: number;

    constructor(nx: number, ny: number, nz: number, d: number) {
        this.normal = new THREE.Vector3(nx, ny, nz);
        this.distance = d;
    }
}

class Frustum {
    planes: FrustumPlane[] = [];

    constructor() {
        for (let i = 0; i < 6; i++) {
            this.planes.push(new FrustumPlane(0, 0, 0, 0));
        }
    }

    setFromProjectionMatrix(projectionMatrix: THREE.Matrix4): void {
        const me = projectionMatrix.elements;
        const p0 = this.planes[0];
        p0.normal.set(me[3] + me[0], me[7] + me[4], me[11] + me[8]);
        p0.distance = me[15] + me[12];

        const p1 = this.planes[1];
        p1.normal.set(me[3] - me[0], me[7] - me[4], me[11] - me[8]);
        p1.distance = me[15] - me[12];

        const p2 = this.planes[2];
        p2.normal.set(me[3] + me[1], me[7] + me[5], me[11] + me[9]);
        p2.distance = me[15] + me[13];

        const p3 = this.planes[3];
        p3.normal.set(me[3] - me[1], me[7] - me[5], me[11] - me[9]);
        p3.distance = me[15] - me[13];

        const p4 = this.planes[4];
        p4.normal.set(me[3] + me[2], me[7] + me[6], me[11] + me[10]);
        p4.distance = me[15] + me[14];

        const p5 = this.planes[5];
        p5.normal.set(me[3] - me[2], me[7] - me[6], me[11] - me[10]);
        p5.distance = me[15] - me[14];

        for (const plane of this.planes) {
            const len = plane.normal.length();
            if (len > 0) {
                const invLen = 1 / len;
                plane.normal.multiplyScalar(invLen);
                plane.distance *= invLen;
            }
        }
    }

    intersectsBox(center: THREE.Vector3, halfExtents: THREE.Vector3): boolean {
        for (const plane of this.planes) {
            const nx = plane.normal.x;
            const ny = plane.normal.y;
            const nz = plane.normal.z;
            const px = nx > 0 ? halfExtents.x : -halfExtents.x;
            const py = ny > 0 ? halfExtents.y : -halfExtents.y;
            const pz = nz > 0 ? halfExtents.z : -halfExtents.z;
            if (nx * (center.x + px) + ny * (center.y + py) + nz * (center.z + pz) + plane.distance < 0) {
                return false;
            }
        }
        return true;
    }
}

const _tempMatrix = new THREE.Matrix4();
const _boxCenter = new THREE.Vector3();
const _boxHalfExtents = new THREE.Vector3();

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
    private waterOverlayEl: HTMLElement;
    private damageFlashIntensity: number = 0;
    private currentBrightness: number = 1;
    private isRaining: boolean = false;
    private playerLight: THREE.PointLight;
    private normalFogNear: number = 80;
    private normalFogFar: number = 160;
    private rainFogNear: number = 30;
    private rainFogFar: number = 80;
    private underwaterFogNear: number = 5;
    private underwaterFogFar: number = 40;
    private isUnderwater: boolean = false;
    private gameTime: number = 6000;
    private skyMesh: THREE.Mesh | null = null;
    private sunMesh: THREE.Mesh | null = null;
    private moonMesh: THREE.Mesh | null = null;
    private starField: THREE.Points | null = null;
    private targetSunColor: THREE.Color = new THREE.Color();
    private targetMoonIntensity: number = 0;
    private targetStarOpacity: number = 0;
    private currentMoonIntensity: number = 0;
    private currentStarOpacity: number = 0;
    private shadowIntensity: number = 1.0;
    private exposureMin: number = 0.2;
    private exposureMax: number = 1.0;
    private ambientBoost: number = 0;
    private bloomStrength: number = 0;
    private sunColorOverride: string | null = null;
    private moonColorOverride: string | null = null;
    private fogColorOverride: string | null = null;
    private starsCount: number = 1000;
    private frustumCulling: boolean = true;
    private frustum = new Frustum();

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
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.skyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.skyLight.position.set(100, 200, 100);
        this.skyLight.castShadow = true;
        this.skyLight.shadow.mapSize.width = 1024;
        this.skyLight.shadow.mapSize.height = 1024;
        this.skyLight.shadow.camera.left = -50;
        this.skyLight.shadow.camera.right = 50;
        this.skyLight.shadow.camera.top = 50;
        this.skyLight.shadow.camera.bottom = -50;
        this.skyLight.shadow.camera.near = 0.5;
        this.skyLight.shadow.camera.far = 500;
        this.scene.add(this.skyLight);

        this.ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(this.ambientLight);

        this.playerLight = new THREE.PointLight(0xffffff, 0.3, 20);
        this.playerLight.position.set(0, 0, 0);
        this.scene.add(this.playerLight);

        this.addSkyDome();
        this.setupResizeHandler();
        this.cloudSystem = new CloudSystem(this.scene);

        this.damageFlashEl = document.getElementById('damage-flash')!;
        this.vignetteEl = document.getElementById('cave-vignette')!;
        this.lavaOverlayEl = document.getElementById('lava-overlay')!;
        this.waterOverlayEl = document.getElementById('water-overlay')!;
    }

    private addSkyDome(): void {
        const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                topColor: { value: SKY_COLORS.day.clone() },
                bottomColor: { value: SKY_COLORS.dayHorizon.clone() },
                offset: { value: 20 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `
        });
        this.skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        this.skyMesh.name = 'sky';
        this.scene.add(this.skyMesh);

        const sunGeometry = new THREE.SphereGeometry(15, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFCC });
        this.sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sunMesh.name = 'sun';
        this.scene.add(this.sunMesh);

        const moonGeometry = new THREE.SphereGeometry(10, 16, 16);
        const moonMaterial = new THREE.MeshBasicMaterial({
            color: 0xCCCCEE,
            transparent: true,
            opacity: 0
        });
        this.moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
        this.moonMesh.name = 'moon';
        this.scene.add(this.moonMesh);

        this.createStarField();
    }

    private createStarField(): void {
        if (this.starField) {
            this.scene.remove(this.starField);
            this.starField.geometry.dispose();
            (this.starField.material as THREE.PointsMaterial).dispose();
        }
        const starCount = this.starsCount;
        const positions = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        const rng = this.seededRandom(42);

        for (let i = 0; i < starCount; i++) {
            const theta = rng() * Math.PI * 2;
            const phi = Math.acos(2 * rng() - 1);
            const radius = 380;
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = Math.abs(radius * Math.cos(phi));
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            sizes[i] = 0.5 + rng() * 1.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xFFFFC8,
            size: 1.5,
            transparent: true,
            opacity: 0,
            sizeAttenuation: false,
            depthWrite: false
        });

        this.starField = new THREE.Points(geometry, material);
        this.starField.name = 'stars';
        this.scene.add(this.starField);
    }

    private seededRandom(seed: number): () => number {
        let s = seed;
        return () => {
            s = (s * 16807) % 2147483647;
            return (s - 1) / 2147483646;
        };
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

    setLighting(params: { shadowIntensity?: number; exposureMin?: number; exposureMax?: number; ambientBoost?: number; bloomStrength?: number }): void {
        if (params.shadowIntensity !== undefined) this.shadowIntensity = params.shadowIntensity;
        if (params.exposureMin !== undefined) this.exposureMin = params.exposureMin;
        if (params.exposureMax !== undefined) this.exposureMax = params.exposureMax;
        if (params.ambientBoost !== undefined) this.ambientBoost = params.ambientBoost;
        if (params.bloomStrength !== undefined) this.bloomStrength = params.bloomStrength;
    }

    getLighting(): { shadowIntensity: number; exposureMin: number; exposureMax: number; ambientBoost: number; bloomStrength: number } {
        return {
            shadowIntensity: this.shadowIntensity,
            exposureMin: this.exposureMin,
            exposureMax: this.exposureMax,
            ambientBoost: this.ambientBoost,
            bloomStrength: this.bloomStrength
        };
    }

    setCloudsEnabled(enabled: boolean): void {
        this.cloudSystem.setVisible(enabled);
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

    updateSky(time: number, brightness: number): void {
        this.gameTime = time;
        this.currentBrightness = brightness;

        if (this.isUnderwater) {
            const waterColor = new THREE.Color(0x1a3a6a);
            this.fog.near = this.underwaterFogNear;
            this.fog.far = this.underwaterFogFar;
            this.fog.color.copy(waterColor);
            this.scene.background = waterColor;
            this.skyLight.intensity = brightness * 0.4;
            this.ambientLight.intensity = 0.3;
            return;
        }

        const dayTime = time % 24000;
        const dayFraction = dayTime / 24000;
        const sunAngle = dayFraction * Math.PI * 2;

        let topColor: THREE.Color;
        let horizonColor: THREE.Color;
        let sunColor: THREE.Color;
        let sunIntensity: number;
        let moonIntensity: number;
        let starOpacity: number;

        const dawnThreshold = 4500;
        const sunriseEnd = 6000;
        const sunsetStart = 18000;
        const duskEnd = 19750;

        if (dayTime >= sunriseEnd && dayTime <= sunsetStart) {
            topColor = SKY_COLORS.day.clone();
            horizonColor = SKY_COLORS.dayHorizon.clone();
            sunColor = new THREE.Color(1.0, 1.0, 0.8);
            sunIntensity = brightness;
            moonIntensity = 0;
            starOpacity = 0;
        } else if (dayTime >= dawnThreshold && dayTime < sunriseEnd) {
            const t = (dayTime - dawnThreshold) / (sunriseEnd - dawnThreshold);
            const dawnT = Math.sin(t * Math.PI * 0.5);
            topColor = SKY_COLORS.night.clone().lerp(SKY_COLORS.dawn, dawnT);
            horizonColor = SKY_COLORS.nightHorizon.clone().lerp(SKY_COLORS.dawnHorizon, dawnT);
            sunColor = new THREE.Color(1.0, 0.6 + dawnT * 0.3, 0.2 + dawnT * 0.4);
            sunIntensity = dawnT * brightness;
            moonIntensity = (1 - dawnT) * 0.4;
            starOpacity = (1 - dawnT) * 0.8;
        } else if (dayTime > sunsetStart && dayTime <= duskEnd) {
            const t = (dayTime - sunsetStart) / (duskEnd - sunsetStart);
            const duskT = Math.sin(t * Math.PI * 0.5);
            topColor = SKY_COLORS.day.clone().lerp(SKY_COLORS.dawn, duskT * 0.7).lerp(SKY_COLORS.night, duskT * 0.5);
            horizonColor = SKY_COLORS.dayHorizon.clone().lerp(SKY_COLORS.dawnHorizon, duskT);
            sunColor = new THREE.Color(1.0, 0.8 - duskT * 0.3, 0.4 - duskT * 0.2);
            sunIntensity = (1 - duskT) * brightness;
            moonIntensity = duskT * 0.4;
            starOpacity = duskT * 0.8;
        } else {
            topColor = SKY_COLORS.night.clone();
            horizonColor = SKY_COLORS.nightHorizon.clone();
            sunColor = new THREE.Color(0.4, 0.2, 0.1);
            sunIntensity = 0;
            moonIntensity = 0.4;
            starOpacity = 0.8;
        }

        if (this.isRaining) {
            const rainMix = 0.3;
            const rainColor = new THREE.Color(0.4, 0.42, 0.48);
            topColor.lerp(rainColor, rainMix);
            horizonColor.lerp(rainColor, rainMix);
        }

        if (this.sunColorOverride) {
            sunColor.set(this.sunColorOverride);
        }

        this.skyColor.copy(horizonColor);
        this.fog.color.copy(horizonColor);
        if (this.fogColorOverride) {
            this.fog.color.set(this.fogColorOverride);
        }
        this.scene.background = this.skyColor;

        this.fog.near = this.isRaining ? this.rainFogNear : this.normalFogNear;
        this.fog.far = this.isRaining ? this.rainFogFar : this.normalFogFar;

        this.skyLight.intensity = this.isRaining ? sunIntensity * 0.6 : sunIntensity;
        this.skyLight.intensity *= this.shadowIntensity;
        this.skyLight.color.copy(sunColor);
        this.ambientLight.intensity = this.isRaining ? 0.3 + 0.3 * brightness : 0.2 + 0.6 * brightness;
        this.ambientLight.intensity += this.ambientBoost;
        var effectiveExposure = this.exposureMin + (this.exposureMax - this.exposureMin) * brightness;
        this.skyLight.intensity *= effectiveExposure;

        if (this.skyMesh) {
            const mat = this.skyMesh.material as THREE.ShaderMaterial;
            mat.uniforms.topColor.value.copy(topColor);
            mat.uniforms.bottomColor.value.copy(horizonColor);
        }

        this.targetSunColor.copy(sunColor);
        this.targetMoonIntensity = moonIntensity;
        this.targetStarOpacity = starOpacity;

        const sunX = Math.cos(sunAngle) * 200;
        const sunY = Math.sin(sunAngle) * 200;
        if (this.sunMesh) {
            this.sunMesh.position.set(sunX, Math.max(sunY, -50), -100);
            this.sunMesh.visible = sunIntensity > 0;
            if (this.sunColorOverride) {
                (this.sunMesh.material as THREE.MeshBasicMaterial).color.set(this.sunColorOverride);
            }
        }

        if (this.moonMesh) {
            const mat = this.moonMesh.material as THREE.MeshBasicMaterial;
            this.currentMoonIntensity += (this.targetMoonIntensity - this.currentMoonIntensity) * 0.05;
            mat.opacity = this.currentMoonIntensity;
            if (this.moonColorOverride) {
                mat.color.set(this.moonColorOverride);
            }
        }

        if (this.starField) {
            const mat = this.starField.material as THREE.PointsMaterial;
            this.currentStarOpacity += (this.targetStarOpacity - this.currentStarOpacity) * 0.03;
            mat.opacity = this.currentStarOpacity;
        }
    }

    updateSkyBrightness(brightness: number): void {
        this.updateSky(this.gameTime, brightness);
    }

    updateSkyParams(params: { sunColor?: string; moonColor?: string; starsCount?: number; fogColor?: string; reset?: boolean }): void {
        if (params.reset) {
            this.sunColorOverride = null;
            this.moonColorOverride = null;
            this.fogColorOverride = null;
            this.starsCount = 1000;
            this.createStarField();
            return;
        }
        if (params.sunColor !== undefined) {
            this.sunColorOverride = params.sunColor;
        }
        if (params.moonColor !== undefined) {
            this.moonColorOverride = params.moonColor;
        }
        if (params.fogColor !== undefined) {
            this.fogColorOverride = params.fogColor;
        }
        if (params.starsCount !== undefined) {
            this.starsCount = Math.max(100, Math.min(5000, params.starsCount));
            this.createStarField();
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

    updateWaterEffect(underwater: boolean): void {
        this.isUnderwater = underwater;
        this.waterOverlayEl.style.opacity = underwater ? '0.35' : '0';
    }

    clearWaterEffect(): void {
        if (this.isUnderwater) return;
        this.fog.near = this.isRaining ? this.rainFogNear : this.normalFogNear;
        this.fog.far = this.isRaining ? this.rainFogFar : this.normalFogFar;
        this.fog.color.copy(this.skyColor);
        this.scene.background = this.skyColor;
    }

    updateEffects(dt: number): void {
        this.updateDamageFlash(dt);
    }

    updatePlayerLight(x: number, y: number, z: number): void {
        this.playerLight.position.set(x, y, z);
    }

    setFrustumCulling(enabled: boolean): void {
        this.frustumCulling = enabled;
    }

    getFrustumCulling(): boolean {
        return this.frustumCulling;
    }

    render(): void {
        if (this.frustumCulling) {
            this.camera.updateMatrixWorld();
            this.camera.updateProjectionMatrix();
            _tempMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
            this.frustum.setFromProjectionMatrix(_tempMatrix);

            const children = this.scene.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!(child instanceof THREE.Mesh) || !child.userData.isChunk) continue;

                const geometry = child.geometry;
                if (!geometry.boundingBox) {
                    geometry.computeBoundingBox();
                }
                const box = geometry.boundingBox;
                box.getCenter(_boxCenter);
                box.getSize(_boxHalfExtents).multiplyScalar(0.5);

                const visible = this.frustum.intersectsBox(_boxCenter, _boxHalfExtents);
                child.visible = visible;
            }
        } else {
            const children = this.scene.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child instanceof THREE.Mesh && child.userData.isChunk) {
                    child.visible = true;
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}
