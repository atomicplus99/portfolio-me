import { Injectable, signal } from '@angular/core';
import * as THREE from 'three';
import { HologramObject, PerformanceStats } from '../interfaces/hologram.interface';
import { ProjectsService } from './proyect.service';
import { Project } from '../interfaces/proyect.interface';


@Injectable({
  providedIn: 'root'
})
export class ThreejsService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private raycaster!: THREE.Raycaster;
  private clock = new THREE.Clock();
  private animationId!: number;

  // Signals para estado reactivo
  private readonly isInitialized = signal(false);
  private readonly performanceStats = signal<PerformanceStats>({
    fps: 0,
    objectCount: 0,
    particleCount: 0,
    renderTime: 0
  });

  private hologramObjects: HologramObject[] = [];
  private pointLights: THREE.PointLight[] = [];
  private ambientLight!: THREE.AmbientLight;

  constructor(private projectsService: ProjectsService) {}

  initializeScene(canvas: HTMLCanvasElement, performanceMode: boolean, isMobile: boolean): void {
    this.setupRenderer(canvas, performanceMode, isMobile);
    this.setupScene(isMobile);
    this.setupCamera(canvas, isMobile);
    this.setupRaycaster();
    this.setupLighting(performanceMode);
    this.createHologramProjects(performanceMode, isMobile);
    
    this.isInitialized.set(true);
    this.startAnimation();
  }

  private setupRenderer(canvas: HTMLCanvasElement, performanceMode: boolean, isMobile: boolean): void {
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;
    
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !performanceMode,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance"
    });
    
    const rect = canvas.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.shadowMap.enabled = !performanceMode;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private setupScene(isMobile: boolean): void {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0f172a, 10, 100);
  }

  private setupCamera(canvas: HTMLCanvasElement, isMobile: boolean): void {
    const rect = canvas.getBoundingClientRect();
    const fov = isMobile ? 65 : 75;
    
    this.camera = new THREE.PerspectiveCamera(fov, rect.width / rect.height, 0.1, 1000);
    const initialDistance = isMobile ? 25 : 20;
    this.camera.position.set(0, 0, initialDistance);
  }

  private setupRaycaster(): void {
    this.raycaster = new THREE.Raycaster();
  }

  private setupLighting(performanceMode: boolean): void {
    this.ambientLight = new THREE.AmbientLight(0x404040, performanceMode ? 0.4 : 0.3);
    this.scene.add(this.ambientLight);

    const lightCount = performanceMode ? 3 : 6;
    const colors = [0x22d3ee, 0xa855f7, 0x10b981, 0xf59e0b, 0xef4444, 0x3b82f6];
    
    for (let i = 0; i < lightCount; i++) {
      const light = new THREE.PointLight(colors[i], performanceMode ? 0.8 : 1, 20);
      light.position.set(
        (i - (lightCount / 2)) * 8,
        Math.sin(i) * 3,
        Math.cos(i) * 3
      );
      light.castShadow = !performanceMode;
      this.pointLights.push(light);
      this.scene.add(light);
    }
  }

  private createHologramProjects(performanceMode: boolean, isMobile: boolean): void {
    const projects = this.projectsService.getProjects();
    
    projects.forEach((project, index) => {
      const hologram = this.createProjectHologram(project, index, performanceMode, isMobile);
      this.hologramObjects.push(hologram);
      this.scene.add(hologram.mesh);
    });

    this.updatePerformanceStats();
  }

  private createProjectHologram(project: Project, index: number, performanceMode: boolean, isMobile: boolean): HologramObject {
    const group = new THREE.Group();

    // Posicionamiento
    const angle = (index / this.projectsService.getProjects().length) * Math.PI * 2;
    const radius = isMobile ? 12 : 10;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * (isMobile ? 1 : 2);

    group.position.set(x, y, z);

    // Geometría principal
    const sides = performanceMode ? 6 : 8;
    const shape = new THREE.Shape();
    const size = isMobile ? 3 : 3.5;
    
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const shapeX = Math.cos(angle) * size;
      const shapeY = Math.sin(angle) * size;
      if (i === 0) {
        shape.moveTo(shapeX, shapeY);
      } else {
        shape.lineTo(shapeX, shapeY);
      }
    }

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: !performanceMode,
      bevelSegments: performanceMode ? 1 : 2,
      steps: performanceMode ? 1 : 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const color = this.projectsService.getProjectColor(project.type);
    
    const material = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.7,
      shininess: 100,
      emissive: color,
      emissiveIntensity: 0.2
    });

    const mainMesh = new THREE.Mesh(geometry, material);
    mainMesh.castShadow = !performanceMode;
    mainMesh.receiveShadow = !performanceMode;
    group.add(mainMesh);

    // Wireframe (solo si no es modo performance)
    if (!performanceMode) {
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });

      const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
      wireframeMesh.scale.setScalar(1.01);
      group.add(wireframeMesh);
    }

    // Icono central
    const iconGeometry = new THREE.PlaneGeometry(2.2, 2.2);
    const iconMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });

    const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);
    iconMesh.position.z = 0.3;
    group.add(iconMesh);

    // Anillos orbitales
    const ringCount = performanceMode ? 2 : 3;
    for (let i = 0; i < ringCount; i++) {
      const ringGeometry = new THREE.RingGeometry(3 + i * 0.8, 3.2 + i * 0.8, 16);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      group.add(ring);
    }

    return {
      mesh: group,
      project: project,
      originalPosition: group.position.clone(),
      targetPosition: group.position.clone(),
      isHovered: false,
      isSelected: false
    };
  }

  private startAnimation(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.renderFrame();
    };
    animate();
  }

  private renderFrame(): void {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = this.clock.getDelta();

    this.animateHolograms(elapsedTime);
    this.animateLights(elapsedTime);
    
    this.renderer.render(this.scene, this.camera);
    
    // Actualizar estadísticas
    const fps = Math.round(1 / deltaTime);
    this.performanceStats.update(stats => ({
      ...stats,
      fps,
      renderTime: deltaTime * 1000
    }));
  }

  private animateHolograms(elapsedTime: number): void {
    this.hologramObjects.forEach((hologram, index) => {
      hologram.mesh.rotation.y = elapsedTime * 0.5 + index;
      hologram.mesh.rotation.x = Math.sin(elapsedTime + index) * 0.1;

      const floatOffset = Math.sin(elapsedTime * 2 + index) * 0.5;
      hologram.mesh.position.y = hologram.originalPosition.y + floatOffset;

      // Escala y emisión basada en estado
      if (hologram.isHovered || hologram.isSelected) {
        const scale = hologram.isSelected ? 1.3 : 1.1;
        hologram.mesh.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        
        const material = (hologram.mesh.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = hologram.isSelected ? 0.5 : 0.3;
      } else {
        hologram.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        const material = (hologram.mesh.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.2;
      }
    });
  }

  private animateLights(elapsedTime: number): void {
    this.pointLights.forEach((light, index) => {
      const angle = elapsedTime * 0.5 + index * (Math.PI * 2 / this.pointLights.length);
      light.position.x = Math.cos(angle) * 15;
      light.position.z = Math.sin(angle) * 15;
      light.position.y = Math.sin(elapsedTime + index) * 3;
      
      light.intensity = 0.8 + Math.sin(elapsedTime * 3 + index) * 0.3;
    });
  }

  private updatePerformanceStats(): void {
    this.performanceStats.update(stats => ({
      ...stats,
      objectCount: this.hologramObjects.length,
      particleCount: 1000
    }));
  }

  updateCameraRotation(targetRotationX: number, targetRotationY: number): void {
    const radius = this.camera.position.length();
    this.camera.position.x = Math.sin(targetRotationY) * radius;
    this.camera.position.z = Math.cos(targetRotationY) * radius;
    this.camera.position.y = targetRotationX * 0.5;
    
    this.camera.lookAt(0, 0, 0);
  }

  updateCameraZoom(distance: number): void {
    this.camera.position.normalize().multiplyScalar(distance);
  }

  checkIntersections(mouse: THREE.Vector2): HologramObject | null {
    this.raycaster.setFromCamera(mouse, this.camera);
    
    // Reset hover states
    this.hologramObjects.forEach(h => h.isHovered = false);
    
    const meshes = this.hologramObjects.map(h => h.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object.parent as THREE.Group;
      const hologram = this.hologramObjects.find(h => h.mesh === intersectedObject);
      
      if (hologram) {
        hologram.isHovered = true;
        return hologram;
      }
    }
    
    return null;
  }

  selectProject(projectId: number): void {
    this.hologramObjects.forEach(h => h.isSelected = false);
    
    const hologram = this.hologramObjects.find(h => h.project.id === projectId);
    if (hologram) {
      hologram.isSelected = true;
    }
  }

  deselectProject(): void {
    this.hologramObjects.forEach(h => h.isSelected = false);
  }

  onWindowResize(width: number, height: number): void {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getPerformanceStats() {
    return this.performanceStats();
  }

  getIsInitialized() {
    return this.isInitialized();
  }

  cleanup(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.scene) {
      this.scene.clear();
    }

    this.hologramObjects = [];
    this.pointLights = [];
  }
}