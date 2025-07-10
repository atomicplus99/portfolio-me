import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileDetectionService } from '../../services/mobile-detection.service';
import * as THREE from 'three';
import { ThreejsService } from '../../services/three.service';


interface TouchInfo {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  startTime: number;
}

@Component({
  selector: 'app-threejs-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-three-canvas.component.html',
  styleUrls: ['./proyect-three-canvas.component.css']
})
export class ThreejsCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() performanceMode = false;
  @Input() isMobile = false;

  @Output() projectSelected = new EventEmitter<number>();
  @Output() firstInteraction = new EventEmitter<void>();
  @Output() cursorChanged = new EventEmitter<string>();

  private isMouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private targetRotationX = 0;
  private targetRotationY = 0;
  private currentRotationX = 0;
  private currentRotationY = 0;

  private touches: Map<number, TouchInfo> = new Map();
  private lastTouchDistance = 0;
  private touchStartTime = 0;
  private touchMoved = false;
  private lastMobileState = false;


  private mouse = new THREE.Vector2();

  constructor(
    private threejsService: ThreejsService,
    private mobileService: MobileDetectionService,
    private ngZone: NgZone
  ) { }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJS();
      this.setupTouchEventListeners();
      this.setupMouseEventListeners(); // ← AGREGAR ESTA LÍNEA
      this.setupResizeListener();
    });
  }

  ngOnDestroy(): void {
    this.threejsService.cleanup();
    this.touches.clear();
  }

  private initThreeJS(): void {
    if (!this.canvasRef?.nativeElement) return;

    // Guardar el estado móvil actual
    this.lastMobileState = this.isMobile;

    this.threejsService.initializeScene(
      this.canvasRef.nativeElement,
      this.performanceMode,
      this.isMobile
    );
  }

  private setupTouchEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
      this.onTouchStart(e);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.onTouchMove(e);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      this.onTouchEnd(e);
    }, { passive: true });

    canvas.addEventListener('touchcancel', (e) => {
      this.onTouchEnd(e);
    }, { passive: true });
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => this.onWindowResize());

    if (this.isMobile) {
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.onWindowResize(), 100);
      });
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (this.isMobile) return;

    this.isMouseDown = true;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.firstInteraction.emit();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isMobile) return;

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

    const intersectedHologram = this.threejsService.checkIntersections(this.mouse);

    if (intersectedHologram) {
      this.cursorChanged.emit('pointer');
    } else {
      this.cursorChanged.emit('grab');
    }

    if (this.isMouseDown) {
      const deltaX = event.clientX - this.mouseX;
      const deltaY = event.clientY - this.mouseY;

      this.targetRotationY += deltaX * 0.01;
      this.targetRotationX += deltaY * 0.01;

      this.mouseX = event.clientX;
      this.mouseY = event.clientY;

      this.threejsService.updateCameraRotation(this.targetRotationX, this.targetRotationY);
    }
  }

  onMouseUp(): void {
    if (this.isMobile) return;
    this.isMouseDown = false;
  }

  onWheel(event: WheelEvent): void {
    if (this.isMobile) return;

    if (this.isMouseDown) {
      event.preventDefault();

      const zoomSpeed = 0.1;
      const minDistance = 12;
      const maxDistance = 40;

      const currentDistance = 20; // Obtener distancia actual del servicio
      const newDistance = Math.max(minDistance, Math.min(maxDistance,
        currentDistance + event.deltaY * zoomSpeed * 0.01));

      this.threejsService.updateCameraZoom(newDistance);
    }
  }

  private onTouchStart(event: TouchEvent): void {
    this.firstInteraction.emit();
    this.touchStartTime = Date.now();
    this.touchMoved = false;

    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      const touchInfo: TouchInfo = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now()
      };
      this.touches.set(touch.identifier, touchInfo);
    }

    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      this.lastTouchDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
    }

    if (this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(10);
    }
  }

  private onTouchMove(event: TouchEvent): void {
    this.touchMoved = true;

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const touchInfo = this.touches.get(touch.identifier);

      if (touchInfo) {
        const deltaX = touch.clientX - touchInfo.x;
        const deltaY = touch.clientY - touchInfo.y;

        const sensitivity = 0.008;
        this.targetRotationY += deltaX * sensitivity;
        this.targetRotationX += deltaY * sensitivity;

        this.targetRotationX = Math.max(-0.5, Math.min(0.5, this.targetRotationX));

        touchInfo.x = touch.clientX;
        touchInfo.y = touch.clientY;

        this.threejsService.updateCameraRotation(this.targetRotationX, this.targetRotationY);
      }
    } else if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      if (this.lastTouchDistance > 0) {
        const deltaDistance = currentDistance - this.lastTouchDistance;
        const zoomSpeed = 0.02;
        const minDistance = 15;
        const maxDistance = 50;

        const currentCameraDistance = 25; // Obtener del servicio
        const newDistance = Math.max(minDistance, Math.min(maxDistance,
          currentCameraDistance - deltaDistance * zoomSpeed));

        this.threejsService.updateCameraZoom(newDistance);
      }

      this.lastTouchDistance = currentDistance;
    }

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.mouse.x = ((touch.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

      this.threejsService.checkIntersections(this.mouse);
    }
  }

  private onTouchEnd(event: TouchEvent): void {
    const touchDuration = Date.now() - this.touchStartTime;

    if (!this.touchMoved && touchDuration < 300) {
      this.handleTouchTap(event);
    }

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      this.touches.delete(touch.identifier);
    }

    if (this.touches.size === 0) {
      this.lastTouchDistance = 0;
    }
  }

  private handleTouchTap(event: TouchEvent): void {
    if (event.changedTouches.length === 0) return;

    const touch = event.changedTouches[0];
    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();

    this.mouse.x = ((touch.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    this.mouse.y = -((touch.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

    const intersectedHologram = this.threejsService.checkIntersections(this.mouse);

    if (intersectedHologram) {
      if (this.mobileService.getVibrationSupported()) {
        this.mobileService.vibrate([50, 100, 50]);
      }
      this.ngZone.run(() => {
        this.projectSelected.emit(intersectedHologram.project.id);
      });
    }
  }

  private onWindowResize(): void {
  const rect = this.canvasRef.nativeElement.getBoundingClientRect();
  
  this.mobileService.updateMobileStatus();
  const currentMobileState = this.mobileService.getIsMobile();
  
  console.log('Current lastMobileState:', this.lastMobileState);
  console.log('New mobile state:', currentMobileState);
  console.log('State changed?', currentMobileState !== this.lastMobileState);
  
  if (currentMobileState !== this.lastMobileState) {
    console.log('🔄 EJECUTANDO CAMBIO DE ESTADO');
    
    this.lastMobileState = currentMobileState;
    this.isMobile = currentMobileState; // ✅ CORRECTO
    
    // AGREGAR LA RE-INICIALIZACIÓN:
    this.threejsService.cleanup();
    this.threejsService.initializeScene(
      this.canvasRef.nativeElement,
      this.performanceMode,
      currentMobileState
    );
    
  } else {
    console.log('📏 SOLO REDIMENSIONANDO');
    this.threejsService.onWindowResize(rect.width, rect.height);
  }
}

  get isMobileClass(): boolean {
    return this.mobileService.getIsMobile();
  }

  private setupMouseEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.addEventListener('click', (event) => {
      if (!this.isMobile) {
        this.handleMouseClick(event);
      }
    });
  }

  private handleMouseClick(event: MouseEvent): void {

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

    const intersectedHologram = this.threejsService.checkIntersections(this.mouse);

    if (intersectedHologram) {
      this.ngZone.run(() => {
        this.projectSelected.emit(intersectedHologram.project.id);
      });
    }
  }

  selectProject(projectId: number): void {
    this.threejsService.selectProject(projectId);
  }

  deselectProject(): void {
    this.threejsService.deselectProject();
  }

  resetView(): void {
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.threejsService.updateCameraZoom(20);

    if (this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(50);
    }
  }
}