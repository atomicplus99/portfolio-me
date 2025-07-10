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

  handleCursorStatusChange(status: any, renderer: Renderer2): void {
    const isScrolling = this.performanceService.isScrolling();
    this.cursorInteractionService.onCursorStatusChange(status, isScrolling);
    
    this.coordinateWithPerformance(status, renderer);
  }

  handleTargetingChange(isTargeting: boolean, renderer: Renderer2): void {
    this.cursorInteractionService.onTargetingChange(isTargeting, renderer);
    
    if (isTargeting && this.performanceService.deviceInfo().isLowEnd) {
      this.applyTargetingOptimizations(renderer);
    } else {
      this.removeTargetingOptimizations(renderer);
    }
  }

  handleHeaderInteraction(isActive: boolean, renderer: Renderer2): void {
    this.cursorInteractionService.onHeaderInteraction(isActive, renderer);
    
    this.coordinateHeaderPerformance(isActive, renderer);
  }

  private coordinateWithPerformance(status: any, renderer: Renderer2): void {
    if (status.activeParticles > 5 && this.performanceService.deviceInfo().isLowEnd) {
      renderer.addClass(document.body, 'performance-mode');
    } else {
      renderer.removeClass(document.body, 'performance-mode');
    }
  }

  private coordinateHeaderPerformance(isActive: boolean, renderer: Renderer2): void {
    if (isActive) {
      renderer.addClass(document.body, 'header-interaction-mode');
      
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

    this.cursorInteractionService.cleanupCursorClasses(renderer);
  }

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