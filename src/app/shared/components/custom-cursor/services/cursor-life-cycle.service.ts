import { Injectable, Renderer2 } from '@angular/core';
import { DeviceDetectionService } from './device-detection.service';
import { ParticlePoolService } from './particle-pool.service';
import { TacticalElementsService } from './tacticals-elements.service';
import { AnimationService } from './animation.service';
import { CursorPerformanceService } from './cursor-perfomance.service';


@Injectable()
export class CursorLifecycleService {
  
  private globalStyleElement?: HTMLStyleElement;
  private initialized = false;

  constructor(
    private renderer: Renderer2,
    private deviceDetectionService: DeviceDetectionService,
    private particlePoolService: ParticlePoolService,
    private tacticalElementsService: TacticalElementsService,
    private animationService: AnimationService,
    private performanceService: CursorPerformanceService
  ) {}

  // GETTERS
  get isInitialized(): boolean {
    return this.initialized;
  }

  // INICIALIZACIÓN
  shouldInitialize(disabled: boolean): boolean {
    return !disabled && this.deviceDetectionService.shouldShowCursor();
  }

  initialize(): void {
    if (this.initialized) return;

    try {
      this.injectGlobalStyles();
      this.performanceService.initializeHeaderCache();
      this.particlePoolService.initializePool();
      this.tacticalElementsService.createElement();
      this.animationService.startAnimation();
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing cursor:', error);
      this.destroy(); // Cleanup en caso de error
    }
  }

  // DESTRUCCIÓN
  destroy(): void {
    if (!this.initialized) return;

    try {
      this.animationService.stopAnimation();
      this.tacticalElementsService.destroyElements();
      this.particlePoolService.destroyPool();
      this.performanceService.cleanup();
      this.removeGlobalStyles();
      
      this.initialized = false;
    } catch (error) {
      console.error('Error destroying cursor:', error);
    }
  }

  // GESTIÓN DE ESTILOS
  private injectGlobalStyles(): void {
    this.globalStyleElement = this.renderer.createElement('style');
    this.renderer.setAttribute(this.globalStyleElement, 'type', 'text/css');
    
    const globalCSS = this.getGlobalCSS();
    const textNode = this.renderer.createText(globalCSS);
    this.renderer.appendChild(this.globalStyleElement, textNode);
    this.renderer.appendChild(document.head, this.globalStyleElement);
  }

  private getGlobalCSS(): string {
    const mediaQuery = this.deviceDetectionService.getMediaQuery();
    
    return `
      @media ${mediaQuery} {
        .tactical-reticle, .interference-particle { 
          display: none !important; 
        }
        *, *::before, *::after, html, body { 
          cursor: auto !important; 
        }
      }
    `;
  }

  private removeGlobalStyles(): void {
    if (this.globalStyleElement?.parentNode) {
      this.renderer.removeChild(document.head, this.globalStyleElement);
      this.globalStyleElement = undefined;
    }
  }

  // HABILITACIÓN/DESHABILITACIÓN
  enable(): void {
    if (this.deviceDetectionService.shouldShowCursor()) {
      this.initialize();
    }
  }

  disable(): void {
    this.destroy();
  }

  // REINICIALIZACIÓN
  reinitialize(): void {
    this.destroy();
    setTimeout(() => {
      if (this.deviceDetectionService.shouldShowCursor()) {
        this.initialize();
      }
    }, 100);
  }

  // MÉTRICAS
  getStatus() {
    return {
      initialized: this.initialized,
      hasGlobalStyles: !!this.globalStyleElement,
      shouldShow: this.deviceDetectionService.shouldShowCursor()
    };
  }
}