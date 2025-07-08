import * as THREE from 'three';
import { ScrollGeometry, GeometryConfig } from '../interfaces/about.interface';

export class ThreeSceneManager {
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometries: ScrollGeometry[] = [];
  private animationId: number = 0;
  private isHovering = false;
  private resizeObserver?: ResizeObserver;

  constructor(
    private container: HTMLElement,
    private geometryConfigs: GeometryConfig[]
  ) {
    this.scene = new THREE.Scene();
    this.initializeCamera();
    this.initializeRenderer();
    this.createGeometries();
    this.setupResizeObserver();
  }

  private initializeCamera(): void {
    const { clientWidth, clientHeight } = this.container;
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  private initializeRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    
    const { clientWidth, clientHeight } = this.container;
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.id = 'three-canvas';
    
    this.container.appendChild(this.renderer.domElement);
  }

  private createGeometries(): void {
    this.geometryConfigs.forEach(config => {
      let geometry: THREE.BufferGeometry;
      
      switch (config.type) {
        case 'cube':
          geometry = new THREE.BoxGeometry(config.size, config.size, config.size);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(config.size, 16, 16);
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(config.size);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(config.size, config.size * 0.4, 8, 16);
          break;
      }
      
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(config.position);
      
      this.scene.add(mesh);
      
      this.geometries.push({
        mesh,
        initialPosition: config.position.clone(),
        initialRotation: mesh.rotation.clone(),
        initialScale: mesh.scale.clone(),
        type: config.type
      });
    });
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);
  }

  public startAnimation(): void {
    this.animate();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const time = Date.now() * 0.001;
    
    this.geometries.forEach((geo, index) => {
      const floatOffset = Math.sin(time + index) * 0.05;
      geo.mesh.position.y += floatOffset * 0.1;
      
      if (this.isHovering) {
        geo.mesh.rotation.z += 0.01;
      }
    });
    
    this.renderer.render(this.scene, this.camera);
  }

  public setHoverState(isHovering: boolean): void {
    this.isHovering = isHovering;
    
    this.geometries.forEach(geo => {
      if (geo.mesh.material instanceof THREE.MeshBasicMaterial) {
        geo.mesh.material.opacity = isHovering ? 0.8 : 0.6;
      }
    });
  }

  private handleResize(): void {
    const { clientWidth, clientHeight } = this.container;
    
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.geometries.forEach(geo => {
      geo.mesh.geometry.dispose();
      if (geo.mesh.material instanceof THREE.Material) {
        geo.mesh.material.dispose();
      }
    });
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.scene) {
      this.scene.clear();
    }
  }
}