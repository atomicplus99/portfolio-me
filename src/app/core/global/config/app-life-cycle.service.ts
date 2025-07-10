import { Injectable, ChangeDetectorRef, Renderer2, signal } from '@angular/core';
import { AppInitializationService } from '../services/portfolio-initializar.service';
import { AppEventCoordinatorService } from '../services/portfolio-event.service';
import { AppConfigurationService } from './app-configuration.service';
import { AppPerformanceService } from '../services/portfolio-perfomance.service';
import { SectionLoadingService } from '../services/portfolio-loading.service';


export type AppLifecycleState = 'initializing' | 'ready' | 'optimizing' | 'error' | 'destroyed';

@Injectable({
  providedIn: 'root'
})
export class AppLifecycleManagerService {

  private lifecycleState = signal<AppLifecycleState>('initializing');
  private initializationStartTime = 0;

  constructor(
    private initializationService: AppInitializationService,
    private eventCoordinatorService: AppEventCoordinatorService,
    private configurationService: AppConfigurationService,
    private performanceService: AppPerformanceService,
    private sectionLoadingService: SectionLoadingService
  ) {}

  get currentState() {
    return this.lifecycleState.asReadonly();
  }

  get isReady(): boolean {
    return this.lifecycleState() === 'ready';
  }

  get isInitializing(): boolean {
    return this.lifecycleState() === 'initializing';
  }

  async initializeApp(cdr: ChangeDetectorRef, renderer: Renderer2): Promise<void> {
    try {
      this.initializationStartTime = performance.now();
      this.lifecycleState.set('initializing');

      this.initializationService.initializeApp(cdr, renderer);

      this.configurationService.applyAutoConfiguration();

      this.lifecycleState.set('ready');
    } catch (error) {

      this.lifecycleState.set('error');
      throw error;
    }
  }

  initializeAfterViewInit(): void {
    if (this.lifecycleState() === 'ready') {
      this.initializationService.initializeAfterViewInit();
    }
  }

  handleCursorStatusChange(status: any, renderer: Renderer2): void {
    if (this.isReady) {
      this.eventCoordinatorService.handleCursorStatusChange(status, renderer);
    }
  }

  handleTargetingChange(isTargeting: boolean, renderer: Renderer2): void {
    if (this.isReady) {
      this.eventCoordinatorService.handleTargetingChange(isTargeting, renderer);
    }
  }

  handleHeaderInteraction(isActive: boolean, renderer: Renderer2): void {
    if (this.isReady) {
      this.eventCoordinatorService.handleHeaderInteraction(isActive, renderer);
    }
  }

  optimizePerformance(): void {
    this.lifecycleState.set('optimizing');
    
    try {
      const deviceInfo = this.performanceService.deviceInfo();
      
      if (deviceInfo.isLowEnd) {
        this.configurationService.setPerformanceMode('low');
      } else if (deviceInfo.isMobile) {
        this.configurationService.setMobileOptimized();
      }
      
      this.lifecycleState.set('ready');
    } catch (error) {
      this.lifecycleState.set('ready'); 
    }
  }

  destroyApp(renderer: Renderer2): void {
    try {
      this.lifecycleState.set('destroyed');
      
      this.eventCoordinatorService.cleanupAllEvents(renderer);
      this.sectionLoadingService.cleanup();
      this.performanceService.cleanup();
      
    } catch (error) {
    }
  }

  loadAllSections(): void {
    if (this.isReady) {
      this.sectionLoadingService.loadAllSections();
    }
  }

  resetSections(): void {
    if (this.isReady) {
      this.sectionLoadingService.resetSections();
    }
  }

  getAppMetrics() {
    return {
      lifecycle: {
        state: this.lifecycleState(),
        initializationTime: this.initializationStartTime ? 
          performance.now() - this.initializationStartTime : 0,
        isReady: this.isReady
      },
      configuration: this.configurationService.getConfigurationStatus(),
      coordination: this.eventCoordinatorService.getCoordinationMetrics(),
      performance: this.performanceService.getPerformanceMetrics(),
      sectionLoading: this.sectionLoadingService.getLoadingMetrics()
    };
  }

  logAppStatus(): void {
  }

  runDiagnostics(): { healthy: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (this.lifecycleState() === 'error') {
      issues.push('App is in error state');
    }
    
    if (!this.initializationService.isAppReady()) {
      issues.push('App initialization incomplete');
    }
    
    const sectionMetrics = this.sectionLoadingService.getLoadingMetrics();
    if (!sectionMetrics.hasObserver) {
      issues.push('Intersection observer not setup');
    }
    
    return {
      healthy: issues.length === 0,
      issues
    };
  }
}