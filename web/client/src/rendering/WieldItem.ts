import * as THREE from 'three';

export class WieldItem {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private pivot: THREE.Group;
    private currentMesh: THREE.Mesh | null = null;
    private currentItemId: string = '';
    private bobAngle: number = 0;
    private bobSpeed: number = 8;
    private bobAmount: number = 0.03;
    private swingAngle: number = 0;
    private isSwinging: boolean = false;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.scene = scene;
        this.camera = camera;
        this.pivot = new THREE.Group();
        this.scene.add(this.pivot);
    }

    updateItem(itemId: string, blockId: number | null, itemName: string): void {
        if (this.currentItemId === itemId && this.currentMesh) return;
        this.currentItemId = itemId;

        if (this.currentMesh) {
            this.pivot.remove(this.currentMesh);
            this.currentMesh.geometry.dispose();
            if (this.currentMesh.material instanceof THREE.Material) {
                this.currentMesh.material.dispose();
            }
            this.currentMesh = null;
        }

        if (!itemId || itemId === '') return;

        const isBlock = blockId !== null && blockId > 0;
        const isTool = itemName.includes('pickaxe') || itemName.includes('sword') ||
            itemName.includes('axe') || itemName.includes('shovel') || itemName.includes('hoe') ||
            itemName.includes('shears') || itemName.includes('dagger');

        if (isTool) {
            this.currentMesh = this.createToolMesh(itemName);
        } else if (isBlock) {
            this.currentMesh = this.createBlockMesh(itemName);
        } else {
            this.currentMesh = this.createItemMesh(itemName);
        }

        if (this.currentMesh) {
            this.pivot.add(this.currentMesh);
        }
    }

    private createBlockMesh(_itemName: string): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        const material = new THREE.MeshLambertMaterial({
            color: 0x888888
        });
        return new THREE.Mesh(geometry, material);
    }

    private createToolMesh(itemName: string): THREE.Mesh {
        let color = 0x8B4513;
        let handleColor = 0x5C3317;

        if (itemName.includes('wooden')) { color = 0xBC8F5A; handleColor = 0x8B4513; }
        else if (itemName.includes('stone')) { color = 0x808080; handleColor = 0x8B4513; }
        else if (itemName.includes('iron') || itemName.includes('steel')) { color = 0xD8D8D8; handleColor = 0x5C3317; }
        else if (itemName.includes('diamond')) { color = 0x4AEDD9; handleColor = 0x5C3317; }
        else if (itemName.includes('gold')) { color = 0xFFD700; handleColor = 0x5C3317; }
        else if (itemName.includes('mese')) { color = 0x00FFFF; handleColor = 0x5C3317; }
        else if (itemName.includes('titanium')) { color = 0xC0C0C0; handleColor = 0x5C3317; }
        else if (itemName.includes('blood')) { color = 0x8B0000; handleColor = 0x3D1C02; }
        else if (itemName.includes('fire')) { color = 0xFF6600; handleColor = 0x5C3317; }
        else if (itemName.includes('ice')) { color = 0x87CEEB; handleColor = 0x5C3317; }
        else if (itemName.includes('heal')) { color = 0xFFD700; handleColor = 0x5C3317; }
        else if (itemName.includes('elemental')) { color = 0xFF00FF; handleColor = 0x5C3317; }

        if (itemName.includes('dagger')) {
            const group = new THREE.Group() as any;
            const handleGeo = new THREE.BoxGeometry(0.03, 0.12, 0.03);
            const handleMat = new THREE.MeshLambertMaterial({ color: handleColor });
            const handle = new THREE.Mesh(handleGeo, handleMat);
            handle.position.y = -0.03;
            group.add(handle);

            const bladeGeo = new THREE.BoxGeometry(0.02, 0.14, 0.02);
            const bladeMat = new THREE.MeshLambertMaterial({ color });
            const blade = new THREE.Mesh(bladeGeo, bladeMat);
            blade.position.y = 0.065;
            group.add(blade);

            return group;
        }

        if (itemName.includes('sword')) {
            const group = new THREE.Group() as any;
            const handleGeo = new THREE.BoxGeometry(0.04, 0.2, 0.04);
            const handleMat = new THREE.MeshLambertMaterial({ color: handleColor });
            const handle = new THREE.Mesh(handleGeo, handleMat);
            handle.position.y = -0.05;
            group.add(handle);

            if (itemName.includes('elemental')) {
                const colors = [0xFF0000, 0xFF8800, 0xFFFF00, 0x00FF00, 0x0088FF, 0x8800FF];
                const segH = 0.25 / colors.length;
                for (let i = 0; i < colors.length; i++) {
                    const segGeo = new THREE.BoxGeometry(0.03, segH, 0.03);
                    const segMat = new THREE.MeshLambertMaterial({ color: colors[i] });
                    const seg = new THREE.Mesh(segGeo, segMat);
                    seg.position.y = 0.245 - i * segH - segH / 2;
                    group.add(seg);
                }
            } else if (itemName.includes('fire')) {
                const blade1Geo = new THREE.BoxGeometry(0.03, 0.125, 0.03);
                const blade1Mat = new THREE.MeshLambertMaterial({ color: 0xFF6600 });
                const blade1 = new THREE.Mesh(blade1Geo, blade1Mat);
                blade1.position.y = 0.1825;
                group.add(blade1);

                const blade2Geo = new THREE.BoxGeometry(0.03, 0.125, 0.03);
                const blade2Mat = new THREE.MeshLambertMaterial({ color: 0xFF2200 });
                const blade2 = new THREE.Mesh(blade2Geo, blade2Mat);
                blade2.position.y = 0.0575;
                group.add(blade2);
            } else {
                const bladeGeo = new THREE.BoxGeometry(0.03, 0.25, 0.03);
                const bladeMat = new THREE.MeshLambertMaterial({ color });
                const blade = new THREE.Mesh(bladeGeo, bladeMat);
                blade.position.y = 0.12;
                group.add(blade);
            }

            const guardGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);
            const guardMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
            const guard = new THREE.Mesh(guardGeo, guardMat);
            guard.position.y = 0.04;
            group.add(guard);

            return group;
        }

        if (itemName.includes('shears')) {
            const group = new THREE.Group() as any;
            const bladeGeo = new THREE.BoxGeometry(0.04, 0.18, 0.02);
            const bladeMat = new THREE.MeshLambertMaterial({ color });
            const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
            blade1.rotation.z = 0.2;
            group.add(blade1);
            const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
            blade2.rotation.z = -0.2;
            group.add(blade2);
            const pivotGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8);
            const pivotMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
            const pivotMesh = new THREE.Mesh(pivotGeo, pivotMat);
            pivotMesh.rotation.x = Math.PI / 2;
            group.add(pivotMesh);
            return group;
        }

        if (itemName.includes('pickaxe')) {
            const group = new THREE.Group() as any;
            const handleGeo = new THREE.BoxGeometry(0.04, 0.3, 0.04);
            const handleMat = new THREE.MeshLambertMaterial({ color: handleColor });
            const handle = new THREE.Mesh(handleGeo, handleMat);
            handle.rotation.z = 0.3;
            group.add(handle);

            const headGeo = new THREE.BoxGeometry(0.2, 0.04, 0.04);
            const headMat = new THREE.MeshLambertMaterial({ color });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.y = 0.14;
            head.position.x = 0.02;
            group.add(head);

            return group;
        }

        const geometry = new THREE.BoxGeometry(0.05, 0.3, 0.05);
        const material = new THREE.MeshLambertMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    private createItemMesh(itemName: string): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(0.12, 0.12, 0.12);
        let color = 0xCCAACC;

        if (itemName.includes('apple')) color = 0xFF2222;
        else if (itemName.includes('bread')) color = 0xD2A060;
        else if (itemName.includes('coal')) color = 0x333333;
        else if (itemName.includes('iron_ingot')) color = 0xDDDDDD;
        else if (itemName.includes('gold_ingot')) color = 0xFFD700;
        else if (itemName.includes('diamond')) color = 0x4AEDD9;
        else if (itemName.includes('stick')) color = 0x8B4513;
        else if (itemName.includes('bucket')) color = 0x888888;
        else if (itemName.includes('torch')) color = 0xFFD700;
        else if (itemName.includes('bucket_water')) color = 0x4488FF;
        else if (itemName.includes('lantern')) color = 0xFFCC66;
        else if (itemName.includes('soul_torch')) color = 0x6699FF;

        const material = new THREE.MeshLambertMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    swing(): void {
        this.isSwinging = true;
        this.swingAngle = -0.8;
    }

    update(dt: number, isMoving: boolean): void {
        this.bobAngle += dt * this.bobSpeed * (isMoving ? 1 : 0);

        if (this.isSwinging) {
            this.swingAngle += dt * 6;
            if (this.swingAngle >= 0) {
                this.swingAngle = 0;
                this.isSwinging = false;
            }
        }

        const bobY = Math.sin(this.bobAngle) * this.bobAmount * (isMoving ? 1 : 0);
        const bobX = Math.cos(this.bobAngle * 0.5) * this.bobAmount * 0.5 * (isMoving ? 1 : 0);

        const quaternion = this.camera.quaternion.clone();

        this.pivot.position.copy(this.camera.position);
        this.pivot.position.add(new THREE.Vector3(0.4 + bobX, -0.35 + bobY, -0.5).applyQuaternion(quaternion));

        this.pivot.quaternion.copy(quaternion);
        this.pivot.rotateZ(this.swingAngle);
    }

    destroy(): void {
        if (this.currentMesh) {
            this.currentMesh.geometry.dispose();
        }
        this.pivot.removeFromParent();
    }
}
