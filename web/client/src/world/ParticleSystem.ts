import * as THREE from 'three';

interface Particle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
    size: number;
    color: THREE.Color;
    alpha: number;
}

interface ParticleSpawner {
    id: number;
    posX: number;
    posY: number;
    posZ: number;
    velXMin: number;
    velYMin: number;
    velZMin: number;
    velXMax: number;
    velYMax: number;
    velZMax: number;
    accX: number;
    accY: number;
    accZ: number;
    expirationTime: number;
    sizeMin: number;
    sizeMax: number;
    texture: string;
    collisionDetection: boolean;
    collisionRemoval: boolean;
    vertical: boolean;
    amount: number;
    time: number;
    elapsed: number;
    accumulator: number;
}

export class ParticleSystem {
    private particles: Particle[] = [];
    private geometry: THREE.BufferGeometry;
    private material: THREE.PointsMaterial;
    private points: THREE.Points;
    private maxParticles: number = 500;
    private spawners: Map<number, ParticleSpawner> = new Map();

    constructor(scene: THREE.Scene) {
        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        });
        this.points = new THREE.Points(this.geometry, this.material);
        this.points.frustumCulled = false;
        scene.add(this.points);
    }

    emitBlockParticles(x: number, y: number, z: number, color: THREE.Color, count: number = 8): void {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) {
                this.particles.shift();
            }

            this.particles.push({
                position: new THREE.Vector3(
                    x + 0.2 + Math.random() * 0.6,
                    y + 0.2 + Math.random() * 0.6,
                    z + 0.2 + Math.random() * 0.6
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 3,
                    Math.random() * 4 + 1,
                    (Math.random() - 0.5) * 3
                ),
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                size: 0.1 + Math.random() * 0.1,
                color: color.clone().multiplyScalar(0.8 + Math.random() * 0.4),
                alpha: 1.0
            });
        }
    }

    emitPlaceParticles(x: number, y: number, z: number, color: THREE.Color, count: number = 6): void {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) {
                this.particles.shift();
            }

            this.particles.push({
                position: new THREE.Vector3(
                    x + Math.random(),
                    y + Math.random(),
                    z + Math.random()
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    Math.random() * 1.5,
                    (Math.random() - 0.5) * 2
                ),
                life: 0.3 + Math.random() * 0.3,
                maxLife: 0.3 + Math.random() * 0.3,
                size: 0.08 + Math.random() * 0.08,
                color: color.clone(),
                alpha: 1.0
            });
        }
    }

    emitDamageParticles(x: number, y: number, z: number, count: number = 12): void {
        const colors = [0xFF0000, 0xFF4444, 0xFF6666, 0xFF8888];
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) {
                this.particles.shift();
            }

            this.particles.push({
                position: new THREE.Vector3(
                    x + (Math.random() - 0.5) * 0.5,
                    y + Math.random() * 1.8,
                    z + (Math.random() - 0.5) * 0.5
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    Math.random() * 3 + 1,
                    (Math.random() - 0.5) * 2
                ),
                life: 0.4 + Math.random() * 0.4,
                maxLife: 0.4 + Math.random() * 0.4,
                size: 0.05 + Math.random() * 0.1,
                color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
                alpha: 1.0
            });
        }
    }

    emitSmokeParticles(x: number, y: number, z: number, count: number = 4): void {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) {
                this.particles.shift();
            }

            this.particles.push({
                position: new THREE.Vector3(
                    x + 0.3 + Math.random() * 0.4,
                    y + 0.8 + Math.random() * 0.4,
                    z + 0.3 + Math.random() * 0.4
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    0.5 + Math.random() * 1.0,
                    (Math.random() - 0.5) * 0.5
                ),
                life: 1.0 + Math.random() * 1.0,
                maxLife: 1.0 + Math.random() * 1.0,
                size: 0.15 + Math.random() * 0.15,
                color: new THREE.Color(0xCCCCCC),
                alpha: 0.5
            });
        }
    }

    addSpawner(
        id: number, posX: number, posY: number, posZ: number,
        velXMin: number, velYMin: number, velZMin: number,
        velXMax: number, velYMax: number, velZMax: number,
        accX: number, accY: number, accZ: number,
        expirationTime: number, sizeMin: number, sizeMax: number,
        texture: string, collisionDetection: boolean, collisionRemoval: boolean,
        vertical: boolean, amount: number, time: number
    ): void {
        this.spawners.set(id, {
            id, posX, posY, posZ,
            velXMin, velYMin, velZMin, velXMax, velYMax, velZMax,
            accX, accY, accZ,
            expirationTime, sizeMin, sizeMax, texture,
            collisionDetection, collisionRemoval, vertical,
            amount, time, elapsed: 0, accumulator: 0
        });
    }

    removeSpawner(id: number): void {
        this.spawners.delete(id);
    }

    private updateSpawners(dt: number): void {
        const expired: number[] = [];
        for (const [id, spawner] of this.spawners) {
            spawner.elapsed += dt;
            if (spawner.expirationTime > 0 && spawner.elapsed >= spawner.expirationTime) {
                expired.push(id);
                continue;
            }

            if (spawner.time <= 0) continue;

            spawner.accumulator += dt;
            const interval = spawner.time / spawner.amount;
            while (spawner.accumulator >= interval) {
                spawner.accumulator -= interval;
                this.emitFromSpawner(spawner);
            }
        }
        for (const id of expired) {
            this.spawners.delete(id);
        }
    }

    private emitFromSpawner(s: ParticleSpawner): void {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift();
        }

        const vx = s.velXMin + Math.random() * (s.velXMax - s.velXMin);
        const vy = s.vertical ? s.velYMin + Math.random() * (s.velYMax - s.velYMin) : s.velYMin + Math.random() * (s.velYMax - s.velYMin);
        const vz = s.velZMin + Math.random() * (s.velZMax - s.velZMin);

        this.particles.push({
            position: new THREE.Vector3(
                s.posX + (Math.random() - 0.5) * 0.5,
                s.posY + (Math.random() - 0.5) * 0.5,
                s.posZ + (Math.random() - 0.5) * 0.5
            ),
            velocity: new THREE.Vector3(vx, vy, vz),
            life: 0.5 + Math.random() * 1.0,
            maxLife: 1.5,
            size: s.sizeMin + Math.random() * (s.sizeMax - s.sizeMin),
            color: new THREE.Color(0xFFFFFF),
            alpha: 1.0
        });
    }

    update(dt: number): void {
        this.updateSpawners(dt);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            p.velocity.y -= 9.8 * dt;
            p.position.addScaledVector(p.velocity, dt);
            p.alpha = (p.life / p.maxLife) * 0.8;
        }

        this.updateGeometry();
    }

    private updateGeometry(): void {
        const count = this.particles.length;
        if (count === 0) {
            this.geometry.setDrawRange(0, 0);
            return;
        }

        const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
        const colAttr = this.geometry.getAttribute('color') as THREE.BufferAttribute;

        if (!posAttr || posAttr.count < count) {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const p = this.particles[i];
                positions[i * 3] = p.position.x;
                positions[i * 3 + 1] = p.position.y;
                positions[i * 3 + 2] = p.position.z;

                colors[i * 3] = p.color.r * p.alpha;
                colors[i * 3 + 1] = p.color.g * p.alpha;
                colors[i * 3 + 2] = p.color.b * p.alpha;
            }

            this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        } else {
            for (let i = 0; i < count; i++) {
                const p = this.particles[i];
                posAttr.setXYZ(i, p.position.x, p.position.y, p.position.z);
                colAttr.setXYZ(i, p.color.r * p.alpha, p.color.g * p.alpha, p.color.b * p.alpha);
            }
            posAttr.needsUpdate = true;
            colAttr.needsUpdate = true;
        }

        this.geometry.setDrawRange(0, count);
    }

    destroy(): void {
        this.geometry.dispose();
        this.material.dispose();
        this.points.removeFromParent();
    }
}
