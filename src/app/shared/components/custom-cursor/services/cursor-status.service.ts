import { Injectable, signal } from '@angular/core';
import { TacticalStatus } from '../interfaces/cursor.interfaces';
import { AnimationService } from './animation.service';
import { CursorConfigService } from './cursor-config.service';
import { CursorPerformanceService } from './cursor-perfomance.service';
import { CursorLifecycleService } from './cursor-life-cycle.service';


@Injectable()
export class CursorStatusService {
  
  private statusSignal = signal<TacticalStatus>({
    reticlePosition: { x: 0, y: 0 },
    isTargeting: false,
    isFiring: false,
    activeParticles: 0,
    systemStatus: 'inactive'
  });

  constructor(
    private animationService: AnimationService,
    private configService: CursorConfigService,
    private performanceService: CursorPerformanceService,
    private lifecycleService: CursorLifecycleService
  ) {}

  // GETTERS
  get status() {
    return this.statusSignal.asReadonly();
  }

  get currentStatus(): TacticalStatus {
    return this.statusSignal();
  }

  // ACTUALIZACIÓN DE STATUS
  updateStatus(): void {
    const animationState = this.animationService.animationState();

    const newStatus: TacticalStatus = {
      reticlePosition: animationState.cursorPosition,
      isTargeting: animationState.isTargeting,
      isFiring: animationState.isFiring,
      activeParticles: 0,
      systemStatus: this.lifecycleService.isInitialized ? 'operational' : 'inactive'
    };

    this.statusSignal.set(newStatus);
  }

  // MÉTRICAS COMPLETAS
  getPerformanceMetrics() {
    return {
      status: this.currentStatus,
      animation: {
        isRunning: this.animationService.isRunning(),
        state: this.animationService.animationState()
      },
      particles: 0,
      config: this.configService.config(),
      performance: this.performanceService.getPerformanceMetrics(),
      lifecycle: this.lifecycleService.getStatus()
    };
  }

  // CONFIGURACIÓN
  setOptimizedMode(enabled: boolean): void {
    this.configService.updateConfig({ optimizedMode: enabled });
    if (enabled) {
      this.animationService.optimizeForPerformance();
    } else {
      this.animationService.resetPerformanceSettings();
    }
    this.updateStatus();
  }

  updateConfiguration(config: any): void {
    this.configService.updateConfig(config);
    this.updateStatus();
  }

  resetConfiguration(): void {
    this.configService.resetToDefaults();
    this.updateStatus();
  }

  // ESTADOS ESPECÍFICOS
  isOverHeader(): boolean {
    return this.performanceService.isOverHeader;
  }

  isScrolling(): boolean {
    return this.performanceService.isScrolling;
  }

  isOptimizedMode(): boolean {
    return this.configService.config().optimizedMode;
  }

  // DEBUGGING
  logCurrentStatus(): void {
    console.group('Cursor Status');
    console.log('Tactical Status:', this.currentStatus);
    console.log('Performance:', this.performanceService.getPerformanceMetrics());
    console.log('Config:', this.configService.config());
    console.groupEnd();
  }
}