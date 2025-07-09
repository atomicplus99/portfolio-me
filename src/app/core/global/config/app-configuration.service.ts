import { Injectable, computed, signal } from '@angular/core';
import { AppPerformanceService } from '../services/portfolio-perfomance.service';
import { SectionLoadingService } from '../services/portfolio-loading.service';


@Injectable({
  providedIn: 'root'
})
export class AppConfigurationService {

  private configOverrides = signal<any>({});

  constructor(
    private performanceService: AppPerformanceService,
    private sectionLoadingService: SectionLoadingService
  ) {}

  // CONFIGURACIONES COMPUTADAS
  readonly cursorConfig = computed(() => {
    const baseConfig = this.performanceService.getCursorConfig();
    const overrides = this.configOverrides();
    return { ...baseConfig, ...overrides.cursor };
  });

  readonly particleConfig = computed(() => {
    const baseConfig = this.performanceService.getParticleConfig();
    const overrides = this.configOverrides();
    return { ...baseConfig, ...overrides.particles };
  });

  readonly loadedSections = computed(() => {
    return this.sectionLoadingService.loadedSections();
  });

  readonly deviceInfo = computed(() => {
    return this.performanceService.deviceInfo();
  });

  readonly isScrolling = computed(() => {
    return this.performanceService.isScrolling();
  });

  // CONFIGURACIÓN DINÁMICA
  updateCursorConfig(config: any): void {
    this.configOverrides.update(current => ({
      ...current,
      cursor: { ...current.cursor, ...config }
    }));
  }

  updateParticleConfig(config: any): void {
    this.configOverrides.update(current => ({
      ...current,
      particles: { ...current.particles, ...config }
    }));
  }

  // CONFIGURACIONES PREDEFINIDAS
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    const configs = {
      high: {
        cursor: { maxParticles: 8, particleDelay: 150 },
        particles: { count: 50, maxFPS: 60 }
      },
      medium: {
        cursor: { maxParticles: 4, particleDelay: 250 },
        particles: { count: 30, maxFPS: 45 }
      },
      low: {
        cursor: { maxParticles: 2, particleDelay: 400 },
        particles: { count: 15, maxFPS: 30 }
      }
    };

    this.configOverrides.set(configs[mode]);
  }

  setMobileOptimized(): void {
    this.configOverrides.set({
      cursor: { 
        maxParticles: 1, 
        particleDelay: 500,
        optimizedMode: true 
      },
      particles: { 
        count: 10, 
        maxFPS: 30,
        enableGPUAcceleration: false 
      }
    });
  }

  setDesktopOptimized(): void {
    this.configOverrides.set({
      cursor: { 
        maxParticles: 6, 
        particleDelay: 200,
        optimizedMode: false 
      },
      particles: { 
        count: 40, 
        maxFPS: 60,
        enableGPUAcceleration: true 
      }
    });
  }

  // RESET
  resetToDefaults(): void {
    this.configOverrides.set({});
  }

  // CONFIGURACIÓN AUTOMÁTICA
  applyAutoConfiguration(): void {
    const device = this.deviceInfo();
    
    if (device.isMobile) {
      this.setMobileOptimized();
    } else if (device.isLowEnd) {
      this.setPerformanceMode('low');
    } else {
      this.setPerformanceMode('high');
    }
  }

  // MÉTRICAS DE CONFIGURACIÓN
  getConfigurationStatus() {
    return {
      cursorConfig: this.cursorConfig(),
      particleConfig: this.particleConfig(),
      deviceInfo: this.deviceInfo(),
      overrides: this.configOverrides(),
      loadedSections: this.loadedSections()
    };
  }
}