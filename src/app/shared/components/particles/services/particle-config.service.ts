import { Injectable } from "@angular/core";
import { ParticleConfig } from "../interfaces/particles.interface";

@Injectable({
  providedIn: 'root'
})
export class ParticleConfigService {
  private readonly defaultConfig: ParticleConfig = {
    count: 1000,
    size: 0.5,
    opacity: 0.6,
    speed: 0.1,
    colors: {
      hue: 0.5,
      saturation: 0.8,
      lightness: 0.5,
      variance: 0.1
    }
  };

  private readonly mobileConfig: ParticleConfig = {
    count: 500,
    size: 0.3,
    opacity: 0.4,
    speed: 0.05,
    colors: {
      hue: 0.5,
      saturation: 0.8,
      lightness: 0.5,
      variance: 0.1
    }
  };

  getConfig(isMobile: boolean): ParticleConfig {
    return isMobile ? this.mobileConfig : this.defaultConfig;
  }

  createCustomConfig(overrides: Partial<ParticleConfig>): ParticleConfig {
    return { ...this.defaultConfig, ...overrides };
  }
}