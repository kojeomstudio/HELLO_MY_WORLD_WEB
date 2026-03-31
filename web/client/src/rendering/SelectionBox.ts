import * as THREE from 'three';

export class SelectionBox {
    private wireframe: THREE.LineSegments;
    private digOverlay: THREE.Mesh;
    private digMaterial: THREE.MeshBasicMaterial;
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

        const overlayGeometry = new THREE.BoxGeometry(1.008, 1.008, 1.008);
        this.digMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0,
            depthTest: true,
            side: THREE.FrontSide
        });
        this.digOverlay = new THREE.Mesh(overlayGeometry, this.digMaterial);
        this.digOverlay.visible = false;
        this.wireframe.add(this.digOverlay);
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

    setDigProgress(progress: number): void {
        if (progress <= 0) {
            this.digOverlay.visible = false;
            this.digMaterial.opacity = 0;
        } else {
            this.digOverlay.visible = true;
            this.digMaterial.opacity = Math.min(progress * 0.6, 0.6);
        }
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
        this.digMaterial.dispose();
        this.digOverlay.geometry.dispose();
        this.wireframe.removeFromParent();
    }
}
