import * as THREE from 'three';

const _lightDirection = new THREE.Vector3();
const _lightTarget = new THREE.Vector3();
const _lightUp = new THREE.Vector3(0, 1, 0);
const _frustumCorners = [
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(),
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
];
const _cascadeCenter = new THREE.Vector3();
const _tempVec = new THREE.Vector3();
const _inverseView = new THREE.Matrix4();

export class CascadeShadowMap {
    private cascadeCount: number = 3;
    private cascadeSplits: number[] = [0.05, 0.15, 0.4];
    private shadowMapSize: number = 2048;
    private shadowBias: number = 0.002;
    private shadowNormalBias: number = 0.02;
    private enabled: boolean = true;
    private cascadeRenderTargets: THREE.WebGLRenderTarget[] = [];
    private cascadeCameras: THREE.OrthographicCamera[] = [];
    private cascadeLightSpaceMatrices: THREE.Matrix4[] = [];
    private depthMaterial: THREE.MeshDepthMaterial;
    private mergeMaterial: THREE.ShaderMaterial;
    private mergeScene: THREE.Scene;
    private mergeCamera: THREE.OrthographicCamera;
    private mergedTarget: THREE.WebGLRenderTarget;
    private lightDirectionSmooth = new THREE.Vector3(0, 1, 0);

    constructor() {
        this.depthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.BasicDepthPacking
        });

        this.mergeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                cascade0: { value: null },
                cascade1: { value: null },
                cascade2: { value: null },
                shadowIntensity: { value: 1.0 },
                splits: { value: new THREE.Vector3(this.cascadeSplits[0], this.cascadeSplits[1], this.cascadeSplits[2]) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D cascade0;
                uniform sampler2D cascade1;
                uniform sampler2D cascade2;
                uniform float shadowIntensity;
                uniform vec3 splits;
                varying vec2 vUv;
                void main() {
                    float depth = gl_FragCoord.z / gl_FragCoord.w;
                    float shadow = 1.0;
                    if (depth < splits.x * 500.0) {
                        shadow = texture2D(cascade0, vUv).r;
                    } else if (depth < splits.y * 500.0) {
                        shadow = texture2D(cascade1, vUv).r;
                    } else if (depth < splits.z * 500.0) {
                        shadow = texture2D(cascade2, vUv).r;
                    }
                    shadow = mix(1.0, shadow, shadowIntensity);
                    gl_FragColor = vec4(vec3(shadow), 1.0);
                }
            `,
            depthWrite: false,
            depthTest: false
        });

        this.mergeScene = new THREE.Scene();
        this.mergeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const mergeGeo = new THREE.PlaneGeometry(2, 2);
        this.mergeScene.add(new THREE.Mesh(mergeGeo, this.mergeMaterial));

        this.mergedTarget = new THREE.WebGLRenderTarget(this.shadowMapSize, this.shadowMapSize, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });

        this.initCascades();
    }

    private initCascades(): void {
        for (const rt of this.cascadeRenderTargets) {
            rt.dispose();
        }
        this.cascadeRenderTargets = [];
        this.cascadeCameras = [];
        this.cascadeLightSpaceMatrices = [];

        for (let i = 0; i < this.cascadeCount; i++) {
            const rt = new THREE.WebGLRenderTarget(this.shadowMapSize, this.shadowMapSize, {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });
            this.cascadeRenderTargets.push(rt);

            const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.5, 500);
            this.cascadeCameras.push(cam);

            this.cascadeLightSpaceMatrices.push(new THREE.Matrix4());
        }
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    setShadowParams(params: {
        cascadeCount?: number;
        cascadeSplits?: number[];
        shadowMapSize?: number;
        shadowBias?: number;
        shadowNormalBias?: number;
    }): void {
        let needsReinit = false;
        if (params.cascadeCount !== undefined && params.cascadeCount !== this.cascadeCount) {
            this.cascadeCount = Math.max(1, Math.min(4, params.cascadeCount));
            needsReinit = true;
        }
        if (params.shadowMapSize !== undefined && params.shadowMapSize !== this.shadowMapSize) {
            this.shadowMapSize = Math.max(512, Math.min(4096, params.shadowMapSize));
            needsReinit = true;
        }
        if (params.cascadeSplits !== undefined) {
            this.cascadeSplits = params.cascadeSplits.slice(0, this.cascadeCount - 1);
        }
        if (params.shadowBias !== undefined) {
            this.shadowBias = params.shadowBias;
        }
        if (params.shadowNormalBias !== undefined) {
            this.shadowNormalBias = params.shadowNormalBias;
        }
        if (needsReinit) {
            this.initCascades();
        }
    }

    getShadowParams(): {
        cascadeCount: number;
        cascadeSplits: number[];
        shadowMapSize: number;
        shadowBias: number;
        shadowNormalBias: number;
    } {
        return {
            cascadeCount: this.cascadeCount,
            cascadeSplits: [...this.cascadeSplits],
            shadowMapSize: this.shadowMapSize,
            shadowBias: this.shadowBias,
            shadowNormalBias: this.shadowNormalBias
        };
    }

    updateCascades(camera: THREE.PerspectiveCamera, lightPosition: THREE.Vector3): void {
        if (!this.enabled) return;

        _lightDirection.subVectors(lightPosition, _lightTarget.set(0, 0, 0)).normalize();
        this.lightDirectionSmooth.lerp(_lightDirection, 0.1).normalize();

        const near = camera.near;
        const far = camera.far;

        camera.updateMatrixWorld();
        _inverseView.copy(camera.matrixWorld).invert();

        const splitDistances: number[] = [];
        for (let i = 0; i <= this.cascadeCount; i++) {
            if (i === 0) {
                splitDistances.push(near);
            } else if (i === this.cascadeCount) {
                splitDistances.push(far);
            } else {
                const t = i < this.cascadeSplits.length ? this.cascadeSplits[i - 1] : i / this.cascadeCount;
                splitDistances.push(near + (far - near) * t);
            }
        }

        for (let c = 0; c < this.cascadeCount; c++) {
            const cascadeNear = splitDistances[c];
            const cascadeFar = splitDistances[c + 1];

            this.getFrustumCorners(camera, cascadeNear, cascadeFar, _inverseView, _frustumCorners);

            _cascadeCenter.set(0, 0, 0);
            for (const corner of _frustumCorners) {
                _cascadeCenter.add(corner);
            }
            _cascadeCenter.divideScalar(8);

            let maxExtent = 0;
            for (const corner of _frustumCorners) {
                _tempVec.subVectors(corner, _cascadeCenter);
                const extent = Math.max(Math.abs(_tempVec.x), Math.abs(_tempVec.y), Math.abs(_tempVec.z));
                if (extent > maxExtent) maxExtent = extent;
            }

            const snappedExtent = Math.ceil(maxExtent);
            const snappedCenter = new THREE.Vector3(
                Math.floor(_cascadeCenter.x),
                Math.floor(_cascadeCenter.y),
                Math.floor(_cascadeCenter.z)
            );

            const lightPos = _tempVec.copy(this.lightDirectionSmooth).multiplyScalar(snappedExtent * 2).add(snappedCenter);
            const cam = this.cascadeCameras[c];
            cam.position.copy(lightPos);
            cam.up.copy(_lightUp);
            cam.lookAt(snappedCenter);
            cam.left = -snappedExtent;
            cam.right = snappedExtent;
            cam.top = snappedExtent;
            cam.bottom = -snappedExtent;
            cam.near = 0.5;
            cam.far = snappedExtent * 4;
            cam.updateProjectionMatrix();

            this.cascadeLightSpaceMatrices[c].multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
        }
    }

    private getFrustumCorners(
        camera: THREE.PerspectiveCamera,
        near: number,
        far: number,
        inverseView: THREE.Matrix4,
        outCorners: THREE.Vector3[]
    ): void {
        const fovRad = camera.fov * Math.PI / 180;
        const aspect = camera.aspect;
        const tanHalfH = Math.tan(fovRad / 2);
        const tanHalfW = tanHalfH * aspect;

        const cornersNearFar = [
            [-tanHalfW * near, -tanHalfH * near, near],
            [tanHalfW * near, -tanHalfH * near, near],
            [tanHalfW * near, tanHalfH * near, near],
            [-tanHalfW * near, tanHalfH * near, near],
            [-tanHalfW * far, -tanHalfH * far, far],
            [tanHalfW * far, -tanHalfH * far, far],
            [tanHalfW * far, tanHalfH * far, far],
            [-tanHalfW * far, tanHalfH * far, far]
        ];

        for (let i = 0; i < 8; i++) {
            const c = cornersNearFar[i];
            outCorners[i].set(c[0], c[1], c[2]).applyMatrix4(inverseView);
        }
    }

    renderCascades(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
        if (!this.enabled) return;

        const originalShadowEnabled = renderer.shadowMap.enabled;
        renderer.shadowMap.enabled = false;

        for (let i = 0; i < this.cascadeCount; i++) {
            const cam = this.cascadeCameras[i];
            const rt = this.cascadeRenderTargets[i];
            renderer.setRenderTarget(rt);
            renderer.clear();
            renderer.render(scene, cam);
        }

        renderer.shadowMap.enabled = originalShadowEnabled;

        const uniforms = this.mergeMaterial.uniforms;
        uniforms.cascade0.value = this.cascadeRenderTargets[0].texture;
        uniforms.cascade1.value = this.cascadeRenderTargets.length > 1 ? this.cascadeRenderTargets[1].texture : this.cascadeRenderTargets[0].texture;
        uniforms.cascade2.value = this.cascadeRenderTargets.length > 2 ? this.cascadeRenderTargets[2].texture : this.cascadeRenderTargets[0].texture;
        uniforms.shadowIntensity.value = 1.0;

        renderer.setRenderTarget(this.mergedTarget);
        renderer.clear();
        renderer.render(this.mergeScene, this.mergeCamera);
        renderer.setRenderTarget(null);
    }

    applyToLight(light: THREE.DirectionalLight): void {
        if (!this.enabled || this.cascadeCameras.length === 0) return;
        const cam = this.cascadeCameras[0];
        light.shadow.camera.copy(cam);
        light.shadow.camera.updateProjectionMatrix();
        light.shadow.mapSize.width = this.shadowMapSize;
        light.shadow.mapSize.height = this.shadowMapSize;
        light.shadow.bias = this.shadowBias;
        light.shadow.normalBias = this.shadowNormalBias;
    }

    getLightSpaceMatrix(cascadeIndex: number): THREE.Matrix4 {
        if (cascadeIndex < this.cascadeLightSpaceMatrices.length) {
            return this.cascadeLightSpaceMatrices[cascadeIndex];
        }
        return new THREE.Matrix4();
    }

    dispose(): void {
        for (const rt of this.cascadeRenderTargets) {
            rt.dispose();
        }
        this.mergedTarget.dispose();
        this.depthMaterial.dispose();
        this.mergeMaterial.dispose();
    }
}
