import { Injectable, signal } from '@angular/core';
import { CursorConfig } from '../interfaces/cursor.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CursorConfigService {
  
    private defaultConfig: CursorConfig = {
    maxParticles: 8,
    poolSize: 12,
    particleDelay: 200,
    cornerOffset: 25,
    numCorners: 2,
    radarLerp: 0.08,
    cornerLerp: 0.15,
    particleLifetime: 1500,
    burstParticles: 4,
    defensiveParticles: 6,
    optimizedMode: false
  };

  private optimizedConfig: Partial<CursorConfig> = {
    particleDelay: 300,
    maxParticles: 4,
    poolSize: 8,
    radarLerp: 0.05,
    cornerLerp: 0.1
  };

  private configSignal = signal<CursorConfig>(this.defaultConfig);

  public get config() {
    return this.configSignal.asReadonly();
  }

  public updateConfig(partialConfig: Partial<CursorConfig>): void {
    this.configSignal.update(current => ({
      ...current,
      ...partialConfig
    }));
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

  public getZIndexes() {
    return {
      reticle: '999999',
      particles: '999995',
      corners: '999998',
      radar: '999997'
    } as const;
  }
}