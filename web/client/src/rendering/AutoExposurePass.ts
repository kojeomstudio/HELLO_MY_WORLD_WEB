import * as THREE from 'three';

const AutoExposureShader = {
    uniforms: {
        tDiffuse: { value: null },
        luminanceTexture: { value: null },
        exposureMin: { value: 0.2 },
        exposureMax: { value: 1.0 },
        brightness: { value: 1.0 },
        adaptationSpeed: { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D luminanceTexture;
        uniform float exposureMin;
        uniform float exposureMax;
        uniform float brightness;
        uniform float adaptationSpeed;
        varying vec2 vUv;

        vec3 ACESFilm(vec3 x) {
            float a = 2.51;
            float b = 0.03;
            float c = 2.43;
            float d = 0.59;
            float e = 0.14;
            return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
        }

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);

            float avgLuminance = texture2D(luminanceTexture, vec2(0.5, 0.5)).r;
            float targetExposure = exposureMin + (exposureMax - exposureMin) * brightness;
            float exposure = mix(targetExposure, avgLuminance * targetExposure, 0.5);

            color.rgb *= exposure;

            color.rgb = ACESFilm(color.rgb);

            gl_FragColor = color;
        }
    `
};

const LuminanceShader = {
    uniforms: {
        tDiffuse: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
            gl_FragColor = vec4(vec3(luminance), 1.0);
        }
    `
};

export class AutoExposurePass {
    private luminanceRT: THREE.WebGLRenderTarget;
    private luminanceRT2: THREE.WebGLRenderTarget;
    private luminanceScene: THREE.Scene;
    private luminanceCamera: THREE.OrthographicCamera;
    private luminanceMaterial: THREE.ShaderMaterial;
    private autoExposureMaterial: THREE.ShaderMaterial;
    private autoExposureScene: THREE.Scene;
    private autoExposureCamera: THREE.OrthographicCamera;
    private enabled: boolean = false;
    private pingPong: boolean = false;

    constructor(_width: number, _height: number) {
        const lumSize = 256;
        this.luminanceRT = new THREE.WebGLRenderTarget(lumSize, lumSize, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
        this.luminanceRT2 = new THREE.WebGLRenderTarget(lumSize, lumSize, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });

        this.luminanceCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
        this.luminanceScene = new THREE.Scene();
        this.luminanceMaterial = new THREE.ShaderMaterial(LuminanceShader);
        this.luminanceScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.luminanceMaterial));

        this.autoExposureCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
        this.autoExposureScene = new THREE.Scene();
        this.autoExposureMaterial = new THREE.ShaderMaterial(AutoExposureShader);
        this.autoExposureScene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.autoExposureMaterial));
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    setExposureParams(exposureMin: number, exposureMax: number, brightness: number): void {
        this.autoExposureMaterial.uniforms.exposureMin.value = exposureMin;
        this.autoExposureMaterial.uniforms.exposureMax.value = exposureMax;
        this.autoExposureMaterial.uniforms.brightness.value = brightness;
    }

    render(renderer: THREE.WebGLRenderer, inputTexture: THREE.Texture): THREE.Texture | null {
        if (!this.enabled) return inputTexture;

        this.luminanceMaterial.uniforms.tDiffuse.value = inputTexture;

        const currentRT = this.pingPong ? this.luminanceRT2 : this.luminanceRT;

        renderer.setRenderTarget(currentRT);
        renderer.clear();
        renderer.render(this.luminanceScene, this.luminanceCamera);

        this.autoExposureMaterial.uniforms.tDiffuse.value = inputTexture;
        this.autoExposureMaterial.uniforms.luminanceTexture.value = currentRT.texture;

        renderer.setRenderTarget(null);
        renderer.render(this.autoExposureScene, this.autoExposureCamera);

        this.pingPong = !this.pingPong;

        return null;
    }

    dispose(): void {
        this.luminanceRT.dispose();
        this.luminanceRT2.dispose();
        this.luminanceMaterial.dispose();
        this.autoExposureMaterial.dispose();
    }
}
