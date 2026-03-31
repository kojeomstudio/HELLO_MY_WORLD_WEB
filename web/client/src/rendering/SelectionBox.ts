import * as THREE from 'three';

export class SelectionBox {
    private wireframe: THREE.LineSegments;
    private edges: THREE.EdgesGeometry;
    private material: THREE.LineBasicMaterial;
    private visible: boolean = false;

    constructor(scene: THREE.Scene) {
        const geometry = new THREE.BoxGeometry(1.005, 1.005, 1.005);
        this.edges = new THREE.EdgesGeometry(geometry);
        this.material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 2,
            transparent: true,
            opacity: 0.5
        });
        this.wireframe = new THREE.LineSegments(this.edges, this.material);
        this.wireframe.visible = false;
        scene.add(this.wireframe);
    }

    update(hitPoint: THREE.Vector3 | null, normal: THREE.Vector3 | null): void {
        if (!hitPoint || !normal) {
            this.wireframe.visible = false;
            this.visible = false;
            return;
        }

        const blockX = Math.floor(hitPoint.x - normal.x * 0.5);
        const blockY = Math.floor(hitPoint.y - normal.y * 0.5);
        const blockZ = Math.floor(hitPoint.z - normal.z * 0.5);

        this.wireframe.position.set(blockX + 0.5, blockY + 0.5, blockZ + 0.5);
        this.wireframe.visible = true;
        this.visible = true;
    }

    setVisible(visible: boolean): void {
        this.wireframe.visible = visible && this.visible;
    }

    isActive(): boolean {
        return this.visible;
    }

    destroy(): void {
        this.edges.dispose();
        this.material.dispose();
        this.wireframe.removeFromParent();
    }
}
