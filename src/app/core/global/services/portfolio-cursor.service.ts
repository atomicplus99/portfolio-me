import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorInteractionService {
  
  private isScrolling = false;

  constructor() {}


  onCursorStatusChange(status: any, isScrolling: boolean): void {
    if (isScrolling && this.isLowEndDevice()) {
      return;
    }

  }

  onTargetingChange(isTargeting: boolean, renderer: Renderer2): void {
    if (isTargeting && this.isLowEndDevice()) {

      renderer.addClass(document.body, 'cursor-targeting');
    } else {
      renderer.removeClass(document.body, 'cursor-targeting');
    }
  }

  // INTERACCIONES CON HEADER
  onHeaderInteraction(isActive: boolean, renderer: Renderer2): void {
    if (isActive) {
      renderer.addClass(document.body, 'header-active');
      renderer.addClass(document.body, 'cursor-over-header');
    } else {
      renderer.removeClass(document.body, 'header-active');
      renderer.removeClass(document.body, 'cursor-over-header');
    }
  }

  // GESTIÓN DE SCROLL
  updateScrollingState(isScrolling: boolean, renderer: Renderer2): void {
    this.isScrolling = isScrolling;
    
    if (isScrolling) {
      renderer.addClass(document.body, 'cursor-scrolling');
    } else {
      renderer.removeClass(document.body, 'cursor-scrolling');
    }
  }

  // ESTADO ACTUAL DE SCROLL
  get isCurrentlyScrolling(): boolean {
    return this.isScrolling;
  }

  // DETECCIÓN DE DISPOSITIVO DE BAJA POTENCIA
  private isLowEndDevice(): boolean {
    return navigator.hardwareConcurrency < 4 || 
           (navigator as any).deviceMemory < 4;
  }

  // CONFIGURACIÓN ADAPTATIVA DEL CURSOR
  getAdaptiveCursorConfig(deviceInfo: any) {
    return {
      maxParticles: deviceInfo.isMobile ? 2 : (deviceInfo.isLowEnd ? 4 : 6),
      particleDelay: deviceInfo.isMobile ? 350 : (this.isScrolling ? 500 : 250),
      cornerOffset: deviceInfo.isMobile ? 15 : 20,
      optimizedMode: deviceInfo.isLowEnd || this.isScrolling,
      headerOptimization: {
        enabled: true,
        throttleMouseMove: 16,
        reducedParticles: true,
        disableOnScroll: this.isScrolling
      }
    };
  }

  // LIMPIEZA DE CLASES CSS
  cleanupCursorClasses(renderer: Renderer2): void {
    const classesToRemove = [
      'header-active',
      'cursor-targeting', 
      'cursor-over-header',
      'cursor-scrolling',
      'app-scrolling'
    ];
    
    classesToRemove.forEach(className => {
      renderer.removeClass(document.body, className);
    });
  }

  // MÉTRICAS DE INTERACCIÓN
  getInteractionMetrics() {
    return {
      isScrolling: this.isScrolling,
      isLowEndDevice: this.isLowEndDevice(),
      activeClasses: this.getActiveBodyClasses()
    };
  }

  private getActiveBodyClasses(): string[] {
    const relevantClasses = [
      'header-active',
      'cursor-targeting', 
      'cursor-over-header',
      'cursor-scrolling',
      'app-scrolling',
      'page-hidden'
    ];
    
    return relevantClasses.filter(className => 
      document.body.classList.contains(className)
    );
  }
}