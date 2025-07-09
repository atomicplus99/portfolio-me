import { Injectable, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { LoaderService } from '../../../shared/components/loader/services/loader.service';
import { AppPerformanceService } from './portfolio-perfomance.service';
import { SectionLoadingService } from './portfolio-loading.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {

  constructor(
    private loaderService: LoaderService,
    private performanceService: AppPerformanceService,
    private sectionLoadingService: SectionLoadingService
  ) {}

  // INICIALIZACIÓN PRINCIPAL
  initializeApp(cdr: ChangeDetectorRef, renderer: Renderer2): void {
    this.startLoader();
    this.setupSectionLoading(cdr);
    this.scheduleProgressiveLoading();
    this.setupPerformanceOptimizations(renderer);
  }

  // INICIALIZACIÓN DESPUÉS DE VIEW INIT
  initializeAfterViewInit(): void {
    // Delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 100);
  }

  // LOADER
  private startLoader(): void {
    this.loaderService.startLoading();
  }

  // CARGA DE SECCIONES
  private setupSectionLoading(cdr: ChangeDetectorRef): void {
    this.sectionLoadingService.setCdr(cdr);
  }

  private scheduleProgressiveLoading(): void {
    this.sectionLoadingService.scheduleProgressiveLoading();
  }

  private setupIntersectionObserver(): void {
    this.sectionLoadingService.setupIntersectionObserver();
  }

  // PERFORMANCE
  private setupPerformanceOptimizations(renderer: Renderer2): void {
    this.performanceService.setupPerformanceOptimizations(renderer);
  }

  // ESTADO DE INICIALIZACIÓN
  isAppReady(): boolean {
    return !this.loaderService.state().isLoading;
  }

  getInitializationStatus() {
    return {
      loaderStarted: !this.loaderService.state().isLoading,
      sectionsSetup: this.sectionLoadingService.getLoadingMetrics().hasObserver,
      performanceSetup: true // Siempre true después de setup
    };
  }
}