import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GalaxyConfig } from '../config/galaxy.config';
import { TextureGenerator } from '../utils/generator-texture';


@Injectable()
export class GalaxyService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private galaxy!: THREE.Points;
  private container!: HTMLElement;

  initialize(container: HTMLElement): void {
    this.container = container;
    this.setupThreeJS();
    this.createGalaxy();
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getGalaxy(): THREE.Points {
    return this.galaxy;
  }

  updateCameraAspect(): void {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.galaxy) {
      this.galaxy.geometry.dispose();
      (this.galaxy.material as THREE.Material).dispose();
    }
  }

  private setupThreeJS(): void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      40,
      this.container.clientWidth / this.container.clientHeight,
      1,
      2000
    );
    this.camera.position.set(600, 400, 300);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
  }

  private createGalaxy(): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(GalaxyConfig.stars * 3);
    const colors = new Float32Array(GalaxyConfig.stars * 3);
    const sizes = new Float32Array(GalaxyConfig.stars);

    const armAngle = (Math.PI * 2) / GalaxyConfig.arms;

    for (let i = 0; i < GalaxyConfig.stars; i++) {
      const i3 = i * 3;

      const radius = Math.pow(Math.random(), 0.6);
      const armIndex = i % GalaxyConfig.arms;
      const spiralAngle = radius * GalaxyConfig.revolutions * Math.PI * 2;
      const branchAngle = armIndex * armAngle;
      const totalAngle = spiralAngle + branchAngle;
      const distance = radius * GalaxyConfig.radius;

      const randomX = (Math.random() - 0.5) * GalaxyConfig.dispersion * distance;
      const randomY = (Math.random() - 0.5) * GalaxyConfig.dispersion * distance * 0.1;
      const randomZ = (Math.random() - 0.5) * GalaxyConfig.dispersion * distance;

      positions[i3] = Math.cos(totalAngle) * distance + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(totalAngle) * distance + randomZ;

      const distanceFromCenter = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 2] * positions[i3 + 2]);
      const colorData = this.calculateStarColor(distanceFromCenter);

      colors[i3] = colorData.color.r;
      colors[i3 + 1] = colorData.color.g;
      colors[i3 + 2] = colorData.color.b;
      sizes[i] = colorData.size;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      map: TextureGenerator.createStarTexture(),
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 1.6,
      depthWrite: false
    });

    this.galaxy = new THREE.Points(geometry, material);
    this.galaxy.rotation.x = 0.5;
    this.galaxy.rotation.z = -0.2;

    this.scene.add(this.galaxy);
  }

  private calculateStarColor(distanceFromCenter: number): { color: THREE.Color; size: number } {
    let color: THREE.Color;
    let size: number;

    if (distanceFromCenter < GalaxyConfig.coreRadius) {
      color = new THREE.Color(0x9483f3);
      size = 6 + Math.random() * 8;
    } else if (distanceFromCenter < GalaxyConfig.radius * 0.6) {
      color = new THREE.Color(0x2196F0);
      size = 3 + Math.random() * 5;
    } else {
      color = new THREE.Color(0x1976D2);
      size = 1 + Math.random() * 3;
    }

    const intensity = 0.7 + Math.random() * 0.6;
    color.multiplyScalar(intensity);

    return { color, size };
  }
}