import * as THREE from 'three';

const CLOUD_SIZE = 600;
const CLOUD_HEIGHT = 120;
const CLOUD_SPEED = 3.0;
const CLOUD_WRAP = 200;

export class CloudSystem {
    private mesh: THREE.Mesh;
    private material: THREE.MeshBasicMaterial;
    constructor(scene: THREE.Scene) {
        const texture = this.generateCloudTexture();
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            opacity: 0.6
        });

        const geometry = new THREE.PlaneGeometry(CLOUD_SIZE, CLOUD_SIZE);
        geometry.rotateX(-Math.PI / 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.set(0, CLOUD_HEIGHT, 0);
        this.mesh.name = 'clouds';
        scene.add(this.mesh);
    }

    private generateCloudTexture(): THREE.CanvasTexture {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        ctx.clearRect(0, 0, size, size);

        const clusters: Array<{ x: number; y: number; radius: number; opacity: number }> = [];

        for (let i = 0; i < 18; i++) {
            const cx = Math.random() * size;
            const cy = Math.random() * size;
            const blobCount = 3 + Math.floor(Math.random() * 5);
            const clusterOpacity = 0.3 + Math.random() * 0.4;

            for (let j = 0; j < blobCount; j++) {
                const bx = cx + (Math.random() - 0.5) * 120;
                const by = cy + (Math.random() - 0.5) * 60;
                const radius = 30 + Math.random() * 70;
                clusters.push({ x: bx, y: by, radius, opacity: clusterOpacity });
            }
        }

        for (const blob of clusters) {
            const gradient = ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${blob.opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${blob.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(blob.x - blob.radius, blob.y - blob.radius, blob.radius * 2, blob.radius * 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return texture;
    }

    update(brightness: number, dt: number): void {
        this.mesh.position.x += CLOUD_SPEED * dt;
        if (this.mesh.position.x > CLOUD_WRAP) {
            this.mesh.position.x -= CLOUD_WRAP * 2;
        }

        const tintColor = new THREE.Color();

        if (brightness > 0.7) {
            tintColor.setRGB(1, 1, 1);
        } else if (brightness > 0.4) {
            const t = (brightness - 0.4) / 0.3;
            tintColor.setRGB(1, 0.6 + 0.4 * t, 0.4 + 0.6 * t);
        } else if (brightness > 0.15) {
            const t = (brightness - 0.15) / 0.25;
            tintColor.setRGB(0.6 + 0.4 * t, 0.3 + 0.3 * t, 0.2 + 0.2 * t);
        } else {
            tintColor.setRGB(0.3, 0.3, 0.35);
        }

        this.material.color.copy(tintColor);

        if (brightness > 0.7) {
            this.material.opacity = 0.55;
        } else if (brightness > 0.4) {
            this.material.opacity = 0.5;
        } else if (brightness > 0.15) {
            this.material.opacity = 0.35;
        } else {
            this.material.opacity = 0.15;
        }
    }

    dispose(scene: THREE.Scene): void {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        if (this.material.map) {
            this.material.map.dispose();
        }
        this.material.dispose();
    }
}
