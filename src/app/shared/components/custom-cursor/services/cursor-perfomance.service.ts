import { Injectable, NgZone, signal } from '@angular/core';
import { CursorConfigService } from './cursor-config.service';
import { DeviceDetectionService } from './device-detection.service';

@Injectable({
  providedIn: 'root'
})
export class CursorPerformanceService {
  
  private isOverHeaderSignal = signal(false);
  private isScrollingSignal = signal(false);
  private headerElementsCache: Element[] = [];
  private scrollTimeout: number | null = null;
  private lastMouseMoveTime = 0;
  private readonly mouseMoveThrottleDelay = 16; 

  constructor(
    private ngZone: NgZone,
    private configService: CursorConfigService,
    private deviceDetectionService: DeviceDetectionService
  ) {}

  // GETTERS
  get isOverHeader(): boolean {
    return this.isOverHeaderSignal();
  }

  get isScrolling(): boolean {
    return this.isScrollingSignal();
  }

  // INICIALIZACIÓN
  initializeHeaderCache(): void {
    this.headerElementsCache = Array.from(
      document.querySelectorAll('header, .header-fixed, [class*="header"]')
    );
  }

  // DETECCIÓN DE HEADER
  isMouseOverHeader(target: Element): boolean {
    if (this.headerElementsCache.length === 0) {
      this.initializeHeaderCache();
    }
    
    let currentElement: Element | null = target;
    while (currentElement && currentElement !== document.body) {
      if (this.headerElementsCache.includes(currentElement) || 
          currentElement.closest('header, .header-fixed, [class*="header"]')) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }

  // GESTIÓN DE ESTADOS
  updateHeaderState(isOver: boolean): void {
    if (this.isOverHeaderSignal() === isOver) return;
    
    this.isOverHeaderSignal.set(isOver);
    
    if (isOver) {
      this.configService.enableHeaderMode();
    } else if (!this.isScrollingSignal()) {
      this.configService.disableHeaderMode();
    }
    
    this.updateAdaptiveConfig();
  }

  updateScrollState(isScrolling: boolean): void {
    if (this.isScrollingSignal() === isScrolling) return;
    
    this.isScrollingSignal.set(isScrolling);
    
    if (isScrolling) {
      this.configService.enableScrollMode();
    } else if (!this.isOverHeaderSignal()) {
      this.configService.disableScrollMode();
    }
    
    this.updateAdaptiveConfig();
  }

  // THROTTLING
  shouldThrottleMouseMove(): boolean {
    const currentTime = performance.now();
    if (currentTime - this.lastMouseMoveTime < this.mouseMoveThrottleDelay) {
      return true;
    }
    this.lastMouseMoveTime = currentTime;
    return false;
  }

  // SCROLL MANAGEMENT
  handleScrollStart(): void {
    this.updateScrollState(true);
    
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = window.setTimeout(() => {
      this.updateScrollState(false);
    }, 150);
  }

  // CONFIGURACIÓN ADAPTATIVA
  private updateAdaptiveConfig(): void {
    const deviceInfo = {
      isMobile: this.deviceDetectionService.isMobile(),
      isLowEnd: this.isLowEndDevice(),
      isScrolling: this.isScrollingSignal(),
      isOverHeader: this.isOverHeaderSignal()
    };
    
    this.configService.setAdaptiveConfig(deviceInfo);
  }

  private isLowEndDevice(): boolean {
    return navigator.hardwareConcurrency < 4 || 
           (navigator as any).deviceMemory < 4;
  }

  // EJECUCIÓN OPTIMIZADA
  runOutsideAngular<T>(callback: () => T): T {
    return this.ngZone.runOutsideAngular(callback);
  }

  runInsideAngular<T>(callback: () => T): T {
    return this.ngZone.run(callback);
  }

  // LIMPIEZA
  cleanup(): void {
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    this.headerElementsCache = [];
    this.isOverHeaderSignal.set(false);
    this.isScrollingSignal.set(false);
  }

  // MÉTRICAS DE PERFORMANCE
  getPerformanceMetrics() {
    return {
      isOverHeader: this.isOverHeaderSignal(),
      isScrolling: this.isScrollingSignal(),
      headerElementsCached: this.headerElementsCache.length,
      lastMouseMoveTime: this.lastMouseMoveTime,
      throttleDelay: this.mouseMoveThrottleDelay
    };
  }
}