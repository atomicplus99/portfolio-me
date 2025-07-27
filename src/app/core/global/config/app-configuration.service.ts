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

  readonly cursorConfig = computed(() => {
    const baseConfig = this.performanceService.getCursorConfig();
    const overrides = this.configOverrides();
    return { ...baseConfig, ...overrides.cursor };
  });

  // ✅ Computed limpio - los signals se actualizan automáticamente
  readonly loadedSections = computed(() => {
    return this.sectionLoadingService.loadedSections();
  });

  readonly deviceInfo = computed(() => {
    return this.performanceService.deviceInfo();
  });

  readonly isScrolling = computed(() => {
    return this.performanceService.isScrolling();
  });

  updateCursorConfig(config: any): void {
    this.configOverrides.update(current => ({
      ...current,
      cursor: { ...current.cursor, ...config }
    }));
  }

  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    const configs = {
      high: {
        cursor: { maxParticles: 8, particleDelay: 150 }
      },
      medium: {
        cursor: { maxParticles: 4, particleDelay: 250 }
      },
      low: {
        cursor: { maxParticles: 2, particleDelay: 400 }
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
      }
    });
  }

  setDesktopOptimized(): void {
    this.configOverrides.set({
      cursor: {
        maxParticles: 6,
        particleDelay: 200,
        optimizedMode: false
      }
    });
  }

  resetToDefaults(): void {
    this.configOverrides.set({});
  }

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

  getConfigurationStatus() {
    return {
      cursorConfig: this.cursorConfig(),
      deviceInfo: this.deviceInfo(),
      overrides: this.configOverrides(),
      loadedSections: this.loadedSections()
    };
  }
}