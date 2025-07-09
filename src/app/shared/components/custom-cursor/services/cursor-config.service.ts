import { Injectable, signal } from '@angular/core';
import { CursorConfig } from '../interfaces/cursor.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CursorConfigService {
  
  private defaultConfig: CursorConfig = {
    maxParticles: 4, // Reducido de 8
    poolSize: 8, // Reducido de 12
    particleDelay: 300, // Aumentado de 200 para menos frecuencia
    cornerOffset: 20, // Reducido de 25
    numCorners: 2,
    radarLerp: 0.06, // Reducido de 0.08 para menos suavidad pero mejor performance
    cornerLerp: 0.12, // Reducido de 0.15
    particleLifetime: 1200, // Reducido de 1500 para que duren menos
    burstParticles: 3, // Reducido de 4
    defensiveParticles: 4, // Reducido de 6
    optimizedMode: false
  };

  // NUEVO: Configuración específica para header
  private headerOptimizedConfig: Partial<CursorConfig> = {
    maxParticles: 2,
    poolSize: 4,
    particleDelay: 500, // Muy espaciado durante hover en header
    cornerOffset: 15,
    radarLerp: 0.04,
    cornerLerp: 0.08,
    particleLifetime: 800,
    burstParticles: 1,
    defensiveParticles: 2
  };

  private optimizedConfig: Partial<CursorConfig> = {
    particleDelay: 400, // Aumentado de 300
    maxParticles: 3, // Reducido de 4
    poolSize: 6, // Reducido de 8
    radarLerp: 0.04, // Más reducido
    cornerLerp: 0.08, // Más reducido
    particleLifetime: 1000 // Reducido
  };

  // NUEVO: Configuración para dispositivos de baja potencia
  private lowEndConfig: Partial<CursorConfig> = {
    maxParticles: 2,
    poolSize: 4,
    particleDelay: 600,
    cornerOffset: 15,
    radarLerp: 0.03,
    cornerLerp: 0.06,
    particleLifetime: 600,
    burstParticles: 1,
    defensiveParticles: 1
  };

  private configSignal = signal<CursorConfig>(this.defaultConfig);
  private isHeaderMode = signal(false);
  private isScrolling = signal(false);

  public get config() {
    return this.configSignal.asReadonly();
  }

  public updateConfig(partialConfig: Partial<CursorConfig>): void {
    this.configSignal.update(current => ({
      ...current,
      ...partialConfig
    }));
  }

  // NUEVO: Modo específico para header
  public enableHeaderMode(): void {
    this.isHeaderMode.set(true);
    this.updateConfig({
      ...this.headerOptimizedConfig,
      optimizedMode: true
    });
  }

  public disableHeaderMode(): void {
    this.isHeaderMode.set(false);
    this.resetToDefaults();
  }

  // NUEVO: Modo durante scroll
  public enableScrollMode(): void {
    this.isScrolling.set(true);
    this.updateConfig({
      maxParticles: 1,
      particleDelay: 800,
      radarLerp: 0.02,
      cornerLerp: 0.04
    });
  }

  public disableScrollMode(): void {
    this.isScrolling.set(false);
    if (!this.isHeaderMode()) {
      this.resetToDefaults();
    } else {
      this.enableHeaderMode();
    }
  }

  // NUEVO: Configuración automática según capacidad del dispositivo
  public enableLowEndMode(): void {
    this.updateConfig({
      ...this.lowEndConfig,
      optimizedMode: true
    });
  }

  public enableOptimizedMode(): void {
    this.updateConfig({
      ...this.optimizedConfig,
      optimizedMode: true
    });
  }

  public disableOptimizedMode(): void {
    this.updateConfig({
      ...this.defaultConfig,
      optimizedMode: false
    });
  }

  public resetToDefaults(): void {
    this.configSignal.set(this.defaultConfig);
  }

  // NUEVO: Configuración adaptativa
  public setAdaptiveConfig(deviceInfo: {
    isMobile: boolean;
    isLowEnd: boolean;
    isScrolling: boolean;
    isOverHeader: boolean;
  }): void {
    if (deviceInfo.isMobile) {
      return; // No hacer nada en móviles
    }

    if (deviceInfo.isLowEnd) {
      this.enableLowEndMode();
    } else if (deviceInfo.isScrolling) {
      this.enableScrollMode();
    } else if (deviceInfo.isOverHeader) {
      this.enableHeaderMode();
    } else {
      this.resetToDefaults();
    }
  }

  public getZIndexes() {
    return {
      reticle: '999999',
      particles: '999995',
      corners: '999998',
      radar: '999997'
    } as const;
  }

  // NUEVO: Getters para estados
  public get isInHeaderMode(): boolean {
    return this.isHeaderMode();
  }

  public get isInScrollMode(): boolean {
    return this.isScrolling();
  }
}