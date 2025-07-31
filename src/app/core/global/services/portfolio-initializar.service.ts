import { Injectable, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { LoaderService } from '../../../shared/components/loader/services/loader.service';
import { AppPerformanceService } from './portfolio-perfomance.service';
import { SectionLoadingService } from './portfolio-loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {

  constructor(
    private loaderService: LoaderService,
    private performanceService: AppPerformanceService,
    private sectionLoadingService: SectionLoadingService
  ) {}

  initializeApp(cdr: ChangeDetectorRef, renderer: Renderer2): void {
    this.startLoader();
    this.scheduleProgressiveLoading();
    this.setupPerformanceOptimizations(renderer);
  }

  initializeAfterViewInit(): void {
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 100);
  }

  private startLoader(): void {
    // ✅ Usar el modo 'normal' por defecto, pero también soporta 'quick' y 'realistic'
    this.loaderService.startNormalLoading().subscribe({
      next: (state) => {},
      complete: () => {
      },
      error: (error) => {
        this.loaderService.finishLoading();
      }
    });
  }

  private scheduleProgressiveLoading(): void {
    this.sectionLoadingService.scheduleProgressiveLoading();
  }

  private setupIntersectionObserver(): void {
    this.sectionLoadingService.setupIntersectionObserver();
  }

  private setupPerformanceOptimizations(renderer: Renderer2): void {
    this.performanceService.setupPerformanceOptimizations(renderer);
  }

  // ✅ Compatible con ambas versiones del LoaderService
  isAppReady(): boolean {
    const state = this.loaderService.state();
    return !state.isLoading;
  }

  getInitializationStatus() {
    const loaderState = this.loaderService.state();
    
    return {
      loaderStarted: !loaderState.isLoading,
      loaderProgress: loaderState.progress,
      sectionsSetup: this.sectionLoadingService.getLoadingMetrics().hasObserver,
      performanceSetup: true,
      // ✅ Información adicional para debugging
      loaderComplete: loaderState.progress >= 100
    };
  }

  // ✅ Método de utilidad para diferentes modos de carga
  startQuickLoading(): void {
    this.loaderService.startQuickLoading().subscribe({
      complete: () => {}
    });
  }

  startRealisticLoading(): void {
    this.loaderService.startRealisticLoading().subscribe({
      complete: () => {}
    });
  }

  // ✅ Método de emergencia
  forceCompleteLoader(): void {
    this.loaderService.finishLoading();
  }
}