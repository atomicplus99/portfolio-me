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

  constructor(private projectsService: ProjectsService) { }

  // 🌌 SHADER GALÁCTICO ÉPICO
  private createGalacticHologramShader(baseColor: THREE.Color): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uHover;
        uniform float uSelected;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          
          // Distorsión espacial sutil
          vec3 pos = position;
          float warp = sin(uTime * 0.8 + length(position) * 2.0) * 0.02 * (uHover + uSelected);
          pos += normal * warp;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform float uOpacity;
        uniform float uHover;
        uniform float uSelected;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          vec3 normal = normalize(vNormal);
          
          // 🌟 FRESNEL GALÁCTICO
          float fresnel = pow(1.0 - dot(viewDirection, normal), 2.2);
          
          // ⚡ LÍNEAS DE ENERGÍA HEXAGONALES
          vec2 hexUV = vWorldPosition.xy * 1.5;
          float hexPattern = abs(sin(hexUV.x * 3.14159)) * abs(sin(hexUV.y * 3.14159));
          hexPattern = step(0.7, hexPattern);
          
          // 🔮 PULSO ENERGÉTICO
          float pulse = sin(uTime * 3.0 + length(vWorldPosition) * 0.5) * 0.5 + 0.5;
          pulse = smoothstep(0.2, 0.8, pulse);
          
          // 🔥 COLOR ESPACIAL ÉPICO
          vec3 baseColor = uBaseColor * 0.9; // Reducir intensidad base
          
          // NO saturar tanto - mantener los colores reales
          vec3 energyColor = baseColor * 1.1; // Apenas incrementar
          vec3 pulseColor = mix(baseColor, energyColor, pulse * 0.5); // Pulso más sutil
          
          // Estados interactivos MÁS SUTILES
          vec3 hoverColor = mix(pulseColor, pulseColor * 1.15, uHover); // Menos dramático
          vec3 selectedColor = mix(hoverColor, hoverColor * 1.25, uSelected); // Menos dramático
          
          vec3 finalColor = selectedColor;
          
          // Aplicar efectos MÁS CONTROLADOS
          finalColor += fresnel * finalColor * 0.4; // Muy reducido
          finalColor += hexPattern * finalColor * 0.2; // Muy reducido  
          finalColor += pulse * finalColor * 0.15; // Muy sutil
          
          // Transparencia
          float alpha = uOpacity * (0.8 + fresnel * 0.2);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0.0 },
        uBaseColor: { value: baseColor },
        uOpacity: { value: 0.75 }, // Menos opaco
        uHover: { value: 0.0 },
        uSelected: { value: 0.0 }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }

  initializeScene(canvas: HTMLCanvasElement, performanceMode: boolean, isMobile: boolean, mobileCompactMode: boolean = false): void {
    if (this.scene) {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }

    this.hologramObjects = [];
    this.pointLights = [];

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }

    this.setupRenderer(canvas, performanceMode, isMobile);
    this.setupScene(isMobile);
    this.setupCamera(canvas, isMobile);
    this.setupRaycaster();
    this.setupGalacticLighting(performanceMode);
    this.createGalacticHologramProjects(performanceMode, isMobile, mobileCompactMode);

    this.isInitialized.set(true);
    this.startAnimation();
  }

  private setupRenderer(canvas: HTMLCanvasElement, performanceMode: boolean, isMobile: boolean): void {
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;

    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: isMobile ? "low-power" : "high-performance"
      });
    }

    const rect = canvas.getBoundingClientRect();
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    requestAnimationFrame(() => {
      const newRect = canvas.getBoundingClientRect();
      this.renderer.setSize(newRect.width, newRect.height);
      this.renderer.setPixelRatio(pixelRatio);
    });

    this.renderer.shadowMap.enabled = !performanceMode;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  private setupScene(isMobile: boolean): void {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0a0a, 20, 60);
  }

  private setupCamera(canvas: HTMLCanvasElement, isMobile: boolean): void {
    const rect = canvas.getBoundingClientRect();
    const fov = isMobile ? 60 : 70;

    this.camera = new THREE.PerspectiveCamera(fov, rect.width / rect.height, 0.1, 1000);
    
    // ✅ DISTANCIA AJUSTADA SEGÚN DISPOSITIVO
    const initialDistance = isMobile ? 16 : 25; // Desktop más lejos para ver hologramas grandes

    this.camera.position.set(0, 0, initialDistance);
    this.camera.rotation.set(0, 0, 0);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  private setupRaycaster(): void {
    this.raycaster = new THREE.Raycaster();
  }

  private setupGalacticLighting(performanceMode: boolean): void {
    this.ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.2); // Muy oscuro
    this.scene.add(this.ambientLight);

    // 🔥 COLORES ÉPICOS ESPACIALES REALES
    const colors = [
      0x00ccff,  // Azul neón espacial
      0xff3366,  // Rojo vibrante 
      0x33ff99,  // Verde esmeralda
      0xffaa00,  // Naranja fuego
      0xcc66ff,  // Púrpura galáctico
      0x66ffff   // Cyan brillante
    ];
    const lightCount = performanceMode ? 4 : 6;

    for (let i = 0; i < lightCount; i++) {
      const light = new THREE.PointLight(colors[i], 1.5, 35); // Intensidad muy reducida
      const angle = (i / lightCount) * Math.PI * 2;
      light.position.set(
        Math.cos(angle) * 25,
        Math.sin(i * 2.5) * 8,
        Math.sin(angle) * 25
      );
      light.castShadow = false;
      this.pointLights.push(light);
      this.scene.add(light);
    }
  }

  private createGalacticHologramProjects(performanceMode: boolean, isMobile: boolean, mobileCompactMode: boolean = false): void {
    const projects = this.projectsService.getProjects();

    projects.forEach((project, index) => {
      const hologram = this.createGalacticProjectHologram(project, index, performanceMode, isMobile, mobileCompactMode);
      this.hologramObjects.push(hologram);
      this.scene.add(hologram.mesh);
    });

    this.updatePerformanceStats();
  }

  private createGalacticProjectHologram(project: Project, index: number, performanceMode: boolean, isMobile: boolean, mobileCompactMode: boolean = false): HologramObject {
    const group = new THREE.Group();

    const angle = (index / this.projectsService.getProjects().length) * Math.PI * 2;
    const radius = isMobile ? 8 : 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 1.0;

    group.position.set(x, y, z);

    // 🛸 GEOMETRÍA GALÁCTICA REDUCIDA
    let geometry: THREE.BufferGeometry;
    
    if (performanceMode) {
      geometry = new THREE.OctahedronGeometry(1.2, 2); // REDUCIDO de 2.0 a 1.2
    } else {
      geometry = new THREE.DodecahedronGeometry(1.0, 1); // REDUCIDO de 1.8 a 1.0
    }

    const color = new THREE.Color(this.projectsService.getProjectColor(project.type));
    
    // 🌌 MATERIAL SHADER GALÁCTICO
    const hologramMaterial = this.createGalacticHologramShader(color);
    const mainMesh = new THREE.Mesh(geometry, hologramMaterial);
    group.add(mainMesh);

    // 🌟 NÚCLEO INTERNO REDUCIDO
    if (!performanceMode) {
      const coreGeometry = new THREE.SphereGeometry(0.5, 16, 12); // REDUCIDO de 0.8 a 0.5
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(coreMesh);
    }

    // ⚡ ANILLOS ORBITALES REDUCIDOS
    const ringCount = performanceMode ? 1 : 3;
    for (let i = 0; i < ringCount; i++) {
      const ringRadius = 1.8 + i * 0.4; // REDUCIDO de 2.8 + 0.6 a 1.8 + 0.4
      const ringGeometry = new THREE.TorusGeometry(ringRadius, 0.04, 8, 32); // Grosor reducido de 0.06 a 0.04
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = (Math.random() - 0.5) * Math.PI;
      ring.rotation.y = (Math.random() - 0.5) * Math.PI;
      ring.rotation.z = (Math.random() - 0.5) * Math.PI;
      group.add(ring);
    }

    // 🌌 CAMPO DE ENERGÍA REDUCIDO
    const fieldGeometry = new THREE.SphereGeometry(2.2, 12, 8); // REDUCIDO de 3.5 a 2.2
    const fieldMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
    group.add(fieldMesh);

    // 📡 INTERFAZ HOLOGRÁFICA REDUCIDA
    const interfaceGeometry = new THREE.PlaneGeometry(0.6, 0.6); // REDUCIDO de 0.8 a 0.6
    const interfaceMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const interfaceMesh = new THREE.Mesh(interfaceGeometry, interfaceMaterial);
    interfaceMesh.position.set(0, 0, 0.6); // Ajustado por menor tamaño
    group.add(interfaceMesh);

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

    this.animateGalacticHolograms(elapsedTime);
    this.animateGalacticLights(elapsedTime);

    this.renderer.render(this.scene, this.camera);

    const fps = Math.round(1 / deltaTime);
    this.performanceStats.update(stats => ({
      ...stats,
      fps,
      renderTime: deltaTime * 1000
    }));
  }

  private animateGalacticHolograms(elapsedTime: number): void {
    this.hologramObjects.forEach((hologram, index) => {
      const group = hologram.mesh;
      
      // 🌀 ROTACIÓN GALÁCTICA ÉPICA
      group.rotation.y = elapsedTime * 0.3 + index * 0.8;
      group.rotation.x = Math.sin(elapsedTime * 0.5 + index) * 0.15;
      group.rotation.z = Math.cos(elapsedTime * 0.4 + index) * 0.1;
      
      // 🌊 FLOTACIÓN ESPACIAL
      const floatOffset = Math.sin(elapsedTime * 1.0 + index * 2.0) * 0.4;
      group.position.y = hologram.originalPosition.y + floatOffset;

      // 🌌 ACTUALIZAR SHADER GALÁCTICO
      const mainMesh = group.children[0] as THREE.Mesh;
      const material = mainMesh.material as THREE.ShaderMaterial;
      
      material.uniforms['uTime'].value = elapsedTime;
      material.uniforms['uHover'].value = THREE.MathUtils.lerp(
        material.uniforms['uHover'].value, 
        hologram.isHovered ? 1.0 : 0.0, 
        0.08
      );
      material.uniforms['uSelected'].value = THREE.MathUtils.lerp(
        material.uniforms['uSelected'].value, 
        hologram.isSelected ? 1.0 : 0.0, 
        0.08
      );

      // 🎯 ESCALA REDUCIDA
      const targetScale = hologram.isSelected ? 1.15 : hologram.isHovered ? 1.05 : 1.0; // REDUCIDO de 1.35/1.12
      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // ⚡ ANIMAR ANILLOS ORBITALES GALÁCTICOS
      group.children.forEach((child, childIndex) => {
        if (childIndex > 1 && child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          const rotationSpeed = 0.01 * (childIndex + 1);
          child.rotation.x += rotationSpeed;
          child.rotation.y += rotationSpeed * 0.7;
          child.rotation.z += rotationSpeed * 0.5;
        }
      });

      // 🌟 NÚCLEO PULSANTE
      if (group.children[1]) {
        const coreMesh = group.children[1] as THREE.Mesh;
        if (coreMesh && coreMesh.material instanceof THREE.MeshBasicMaterial) {
          const coreMaterial = coreMesh.material;
          const pulse = Math.sin(elapsedTime * 4.0 + index) * 0.3 + 0.7;
          coreMaterial.opacity = pulse * (hologram.isSelected ? 0.8 : hologram.isHovered ? 0.7 : 0.6);
          
          coreMesh.rotation.x += 0.02;
          coreMesh.rotation.y += 0.015;
        }
      }

      // 🌌 CAMPO ESTELAR DINÁMICO
      const fieldIndex = group.children.length - 2;
      if (group.children[fieldIndex]) {
        const fieldMesh = group.children[fieldIndex] as THREE.Mesh;
        const fieldMaterial = fieldMesh.material as THREE.MeshBasicMaterial;
        const intensity = hologram.isSelected ? 0.12 : hologram.isHovered ? 0.08 : 0.05;
        fieldMaterial.opacity = THREE.MathUtils.lerp(fieldMaterial.opacity, intensity, 0.05);
        
        fieldMesh.rotation.x += 0.002;
        fieldMesh.rotation.y += 0.003;
      }
    });
  }

  private animateGalacticLights(elapsedTime: number): void {
    this.pointLights.forEach((light, index) => {
      const angle = elapsedTime * 0.2 + index * (Math.PI * 2 / this.pointLights.length);
      const radius = 22 + Math.sin(elapsedTime * 0.4 + index) * 3;
      const height = Math.sin(elapsedTime * 0.3 + index) * 6;
      
      light.position.x = Math.cos(angle) * radius;
      light.position.z = Math.sin(angle) * radius;
      light.position.y = height;

      light.intensity = 2.2 + Math.sin(elapsedTime * 2.2 + index) * 0.5;
    });
  }

  private updatePerformanceStats(): void {
    this.performanceStats.update(stats => ({
      ...stats,
      objectCount: this.hologramObjects.length,
      particleCount: this.hologramObjects.length * 4
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

    // ✅ DETECCIÓN MEJORADA DE DISPOSITIVO
    const isMobile = width <= 768;
    const isTablet = width > 768 && width <= 1024;
    
    // ✅ AJUSTES ESPECÍFICOS POR DISPOSITIVO
    if (isMobile) {
      // Móvil: FOV más amplio, distancia ajustada
      this.camera.fov = 75;
      this.camera.position.z = 16;
    } else if (isTablet) {
      // Tablet: FOV intermedio
      this.camera.fov = 70;
      this.camera.position.z = 20;
    } else {
      // Desktop: FOV estándar
      this.camera.fov = 65;
      this.camera.position.z = 25;
    }
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    
    // ✅ OPTIMIZACIÓN DE PIXEL RATIO POR DISPOSITIVO
    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
  }

  getPerformanceStats() {
    return this.performanceStats();
  }

  getIsInitialized() {
    return this.isInitialized();
  }

  dispose(): void {
    this.cleanup();
  }

  // ✅ MEJORADO - Actualizar dimensiones móviles
  updateMobileDimensions(compactMode: boolean): void {
    if (!this.camera || !this.scene) return;

    // ✅ AJUSTES RÁPIDOS PARA MÓVIL
    const scale = compactMode ? 0.7 : 1.0;
    const radius = compactMode ? 10 : 12;
    const cameraZ = compactMode ? 14 : 16;
    const fov = compactMode ? 78 : 75;
    
    // ✅ APLICAR CAMBIOS RÁPIDAMENTE
    this.hologramObjects.forEach((hologram, index) => {
      hologram.mesh.scale.set(scale, scale, scale);
      
      const angle = (index / this.hologramObjects.length) * Math.PI * 2;
      hologram.mesh.position.x = Math.cos(angle) * radius;
      hologram.mesh.position.y = Math.sin(angle) * radius * 0.3;
      hologram.mesh.position.z = 0;
    });
    
    this.camera.position.z = cameraZ;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  cleanup(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.hologramObjects.forEach(hologram => {
      hologram.mesh.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    });

    if (this.scene) {
      this.scene.clear();
    }

    this.hologramObjects = [];
    this.pointLights = [];
  }
}