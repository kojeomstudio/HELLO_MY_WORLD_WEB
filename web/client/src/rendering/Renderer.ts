import * as THREE from 'three';

export class Renderer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private canvas: HTMLCanvasElement;
    private skyLight: THREE.DirectionalLight;
    private ambientLight: THREE.AmbientLight;
    private fog: THREE.Fog;
    private skyColor: THREE.Color;

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

    addToScene(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    removeFromScene(object: THREE.Object3D): void {
        this.scene.remove(object);
    }

    updateSkyBrightness(brightness: number): void {
        const r = 0.53 * brightness;
        const g = 0.81 * brightness;
        const b = 0.92 * brightness;
        this.skyColor.setRGB(r, g, b);
        this.scene.background = this.skyColor;
        (this.scene.fog as THREE.Fog).color = this.skyColor;

        this.skyLight.intensity = brightness;
        this.ambientLight.intensity = 0.2 + 0.6 * brightness;

        const sky = this.scene.getObjectByName('sky');
        if (sky) {
            (sky as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                color: this.skyColor,
                side: THREE.BackSide,
            });
        }
    }

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
