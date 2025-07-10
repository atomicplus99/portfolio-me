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
    const containerRect = this.container.getBoundingClientRect();

    this.camera = new THREE.PerspectiveCamera(
      75,
      containerRect.width / containerRect.height,
      0.1,
      1000
    );
    // CORREGIDO: Mover cámara más lejos para mejor vista
    this.camera.position.set(0, 0, 50);
  }

  private initializeRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    const containerRect = this.container.getBoundingClientRect();
    this.renderer.setSize(containerRect.width, containerRect.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private createParticles(): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.config.count * 3);
    const colors = new Float32Array(this.config.count * 3);

    // GALÁCTICO: Distribución simple en todo el espacio
    const spread = 150; // Área amplia
    const height = 300; // Altura para múltiples secciones
    const depth = 80;   // Profundidad moderada

    for (let i = 0; i < this.config.count * 3; i += 3) {
      // SIMPLE: Distribución uniforme
      positions[i] = (Math.random() - 0.5) * spread;        // X
      positions[i + 1] = (Math.random() - 0.5) * height;    // Y (todo el scroll)
      positions[i + 2] = (Math.random() - 0.5) * depth;     // Z

      // GALÁCTICO: Colores azules/morados simples
      const color = new THREE.Color();
      const intensity = 0.3 + Math.random() * 0.7; // Variación de brillo
      
      color.setHSL(
        0.55 + Math.random() * 0.2, // Azul a morado
        0.6 + Math.random() * 0.3,  // Saturación moderada
        intensity                    // Brillo variable
      );
      
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // GALÁCTICO MEJORADO: Material con un poco más de presencia
    const material = new THREE.PointsMaterial({
      size: this.config.size,
      vertexColors: true,
      transparent: true,
      opacity: this.config.opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      // AÑADIR: Textura circular simple para mejor definición
      map: this.createSimpleCircleTexture(),
      alphaTest: 0.1,
      // ✅ ARREGLAR EL ERROR WEBGL:
      premultipliedAlpha: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  // NUEVO: Textura circular simple pero efectiva
  private createSimpleCircleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 32; // REDUCIDO: menos resolución = mejor performance
    canvas.height = 32;
    
    const ctx = canvas.getContext('2d')!;
    
    // Gradiente radial simple pero efectivo
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');   // Centro sólido
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.7)'); // Medio
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)'); // Borde suave
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');   // Transparente
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    // ✅ ARREGLAR EL ERROR WEBGL:
    texture.premultiplyAlpha = false;
    texture.flipY = false;
    texture.needsUpdate = true;
    return texture;
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

    // GALÁCTICO: Rotación lenta pero perceptible
    this.particles.rotation.y = elapsedTime * this.config.speed;
    this.particles.rotation.x = elapsedTime * this.config.speed * 0.3;

    // SUTIL: Movimiento muy ligero solo en algunas partículas
    const positions = this.particles.geometry.attributes['position'].array as Float32Array;
    
    // Solo actualizar cada 3 frames para performance
    if (Math.floor(elapsedTime * 60) % 3 === 0) {
      for (let i = 0; i < positions.length; i += 9) { // Solo cada 3ra partícula
        positions[i + 1] += Math.sin(elapsedTime * 0.5 + positions[i] * 0.1) * 0.01;
      }
      this.particles.geometry.attributes['position'].needsUpdate = true;
    }
  }

  public handleResize(): void {
    if (!this.camera || !this.renderer) return;

    const containerRect = this.container.getBoundingClientRect();

    this.camera.aspect = containerRect.width / containerRect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(containerRect.width, containerRect.height);
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