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

  initializeApp(cdr: ChangeDetectorRef, renderer: Renderer2): void {
    this.startLoader();
    this.setupSectionLoading(cdr);
    this.scheduleProgressiveLoading();
    this.setupPerformanceOptimizations(renderer);
  }

  initializeAfterViewInit(): void {
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 100);
  }

  private startLoader(): void {
    this.loaderService.startLoading();
  }

  private setupSectionLoading(cdr: ChangeDetectorRef): void {
    this.sectionLoadingService.setCdr(cdr);
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