import { Injectable, Renderer2 } from '@angular/core';
import { AppPerformanceService } from './portfolio-perfomance.service';
import { CursorInteractionService } from './portfolio-cursor.service';

@Injectable({
  providedIn: 'root'
})
export class AppEventCoordinatorService {

  constructor(
    private performanceService: AppPerformanceService,
    private cursorInteractionService: CursorInteractionService
  ) {}

  // EVENTOS DEL CURSOR
  handleCursorStatusChange(status: any, renderer: Renderer2): void {
    const isScrolling = this.performanceService.isScrolling();
    this.cursorInteractionService.onCursorStatusChange(status, isScrolling);
    
    // Coordinar con performance si es necesario
    this.coordinateWithPerformance(status, renderer);
  }

  handleTargetingChange(isTargeting: boolean, renderer: Renderer2): void {
    this.cursorInteractionService.onTargetingChange(isTargeting, renderer);
    
    // Aplicar optimizaciones adicionales si es targeting
    if (isTargeting && this.performanceService.deviceInfo().isLowEnd) {
      this.applyTargetingOptimizations(renderer);
    } else {
      this.removeTargetingOptimizations(renderer);
    }
  }

  handleHeaderInteraction(isActive: boolean, renderer: Renderer2): void {
    this.cursorInteractionService.onHeaderInteraction(isActive, renderer);
    
    // Coordinar con performance para header
    this.coordinateHeaderPerformance(isActive, renderer);
  }

  // COORDINACIÓN ENTRE SERVICIOS
  private coordinateWithPerformance(status: any, renderer: Renderer2): void {
    // Si hay muchas partículas activas y dispositivo lento
    if (status.activeParticles > 5 && this.performanceService.deviceInfo().isLowEnd) {
      renderer.addClass(document.body, 'performance-mode');
    } else {
      renderer.removeClass(document.body, 'performance-mode');
    }
  }

  private coordinateHeaderPerformance(isActive: boolean, renderer: Renderer2): void {
    if (isActive) {
      // Optimizaciones específicas para header
      renderer.addClass(document.body, 'header-interaction-mode');
      
      // Reducir efectos si es dispositivo lento
      if (this.performanceService.deviceInfo().isLowEnd) {
        renderer.addClass(document.body, 'header-low-end-mode');
      }
    } else {
      renderer.removeClass(document.body, 'header-interaction-mode');
      renderer.removeClass(document.body, 'header-low-end-mode');
    }
  }

  private applyTargetingOptimizations(renderer: Renderer2): void {
    renderer.addClass(document.body, 'targeting-optimized');
  }

  private removeTargetingOptimizations(renderer: Renderer2): void {
    renderer.removeClass(document.body, 'targeting-optimized');
  }

  // LIMPIEZA DE EVENTOS
  cleanupAllEvents(renderer: Renderer2): void {
    const classesToCleanup = [
      'performance-mode',
      'header-interaction-mode', 
      'header-low-end-mode',
      'targeting-optimized'
    ];

    classesToCleanup.forEach(className => {
      renderer.removeClass(document.body, className);
    });

    // Limpieza de servicios individuales
    this.cursorInteractionService.cleanupCursorClasses(renderer);
  }

  // MÉTRICAS DE COORDINACIÓN
  getCoordinationMetrics() {
    return {
      cursorInteraction: this.cursorInteractionService.getInteractionMetrics(),
      performance: this.performanceService.getPerformanceMetrics(),
      activeBodyClasses: this.getActiveBodyClasses()
    };
  }

  private getActiveBodyClasses(): string[] {
    const coordinationClasses = [
      'performance-mode',
      'header-interaction-mode',
      'header-low-end-mode', 
      'targeting-optimized'
    ];
    
    return coordinationClasses.filter(className => 
      document.body.classList.contains(className)
    );
  }
}