import { Injectable, signal } from '@angular/core';
import { CursorConfig } from '../interfaces/cursor.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CursorConfigService {
  
  private defaultConfig: CursorConfig = {
    maxParticles: 15,        // Aumentado de 4 a 15
    poolSize: 30,            // Aumentado de 8 a 30
    particleDelay: 150,      // Reducido de 300 a 150 (más frecuentes)
    cornerOffset: 25,        // Aumentado de 20 a 25
    numCorners: 2,
    radarLerp: 0.08,         // Aumentado de 0.06 a 0.08
    cornerLerp: 0.15,        // Aumentado de 0.12 a 0.15
    particleLifetime: 2000,  // Aumentado de 1200 a 2000 (duran más)
    burstParticles: 8,       // Aumentado de 3 a 8
    defensiveParticles: 12,  // Aumentado de 4 a 12
    optimizedMode: false
  };

  private headerOptimizedConfig: Partial<CursorConfig> = {
    maxParticles: 8,         // Aumentado de 2 a 8
    poolSize: 16,            // Aumentado de 4 a 16
    particleDelay: 250,      // Reducido de 500 a 250
    cornerOffset: 20,
    radarLerp: 0.06,
    cornerLerp: 0.10,
    particleLifetime: 1500,  // Aumentado de 800 a 1500
    burstParticles: 4,       // Aumentado de 1 a 4
    defensiveParticles: 6    // Aumentado de 2 a 6
  };

  private optimizedConfig: Partial<CursorConfig> = {
    particleDelay: 200,      // Reducido de 400 a 200
    maxParticles: 10,        // Aumentado de 3 a 10
    poolSize: 20,            // Aumentado de 6 a 20
    radarLerp: 0.06,         // Aumentado de 0.04 a 0.06
    cornerLerp: 0.12,        // Aumentado de 0.08 a 0.12
    particleLifetime: 1500   // Aumentado de 1000 a 1500
  };

  private lowEndConfig: Partial<CursorConfig> = {
    maxParticles: 6,         // Aumentado de 2 a 6
    poolSize: 12,            // Aumentado de 4 a 12
    particleDelay: 300,      // Reducido de 600 a 300
    cornerOffset: 18,
    radarLerp: 0.05,
    cornerLerp: 0.08,
    particleLifetime: 1000,  // Aumentado de 600 a 1000
    burstParticles: 3,       // Aumentado de 1 a 3
    defensiveParticles: 4    // Aumentado de 1 a 4
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

  public enableScrollMode(): void {
    this.isScrolling.set(true);
    this.updateConfig({
      maxParticles: 5,       // Aumentado de 1 a 5
      particleDelay: 400,    // Reducido de 800 a 400
      radarLerp: 0.04,
      cornerLerp: 0.06
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

  public enableExtremeMode(): void {
    this.updateConfig({
      maxParticles: 25,      // Máximo de partículas
      poolSize: 50,          // Pool grande
      particleDelay: 100,    // Muy frecuentes
      particleLifetime: 3000, // Duran mucho
      burstParticles: 15,    // Explosiones grandes
      defensiveParticles: 20  // Patrón defensivo denso
    });
  }

  public get isInHeaderMode(): boolean {
    return this.isHeaderMode();
  }

  public get isInScrollMode(): boolean {
    return this.isScrolling();
  }
}