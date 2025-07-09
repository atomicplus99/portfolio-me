import * as THREE from 'three';
import { ParticleConfig } from '../interfaces/particles.interface';

export class ParticleSystem {
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private clock = new THREE.Clock();
  private animationId: number = 0;
  private config: ParticleConfig;

  constructor(
    private canvas: HTMLCanvasElement,
    private container: HTMLElement,
    config: ParticleConfig
  ) {
    this.config = config;
    this.scene = new THREE.Scene();
    this.initializeCamera();
    this.initializeRenderer();
    this.createParticles();
  }

  private initializeCamera(): void {
    // VOLVER A LA CONFIGURACIÓN ORIGINAL
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 20);
  }

  private initializeRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    
    // VOLVER A LA CONFIGURACIÓN ORIGINAL
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private createParticles(): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.config.count * 3);
    const colors = new Float32Array(this.config.count * 3);

    for (let i = 0; i < this.config.count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;

      const color = new THREE.Color();
      color.setHSL(
        this.config.colors.hue + Math.random() * this.config.colors.variance,
        this.config.colors.saturation,
        this.config.colors.lightness
      );
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.config.size,
      vertexColors: true,
      transparent: true,
      opacity: this.config.opacity,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  public startAnimation(): void {
    this.animate();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();
    this.updateParticles(elapsedTime);
    this.renderer.render(this.scene, this.camera);
  }

  private updateParticles(elapsedTime: number): void {
    if (!this.particles) return;

    this.particles.rotation.y = elapsedTime * this.config.speed;
    
    const positions = this.particles.geometry.attributes['position'].array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.01;
    }
    
    this.particles.geometry.attributes['position'].needsUpdate = true;
  }

  public handleResize(): void {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public updateConfig(newConfig: Partial<ParticleConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.recreateParticles();
  }

  private recreateParticles(): void {
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
    this.createParticles();
  }

  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.scene) {
      this.scene.clear();
    }
  }
}