import { Injectable } from "@angular/core";
import { ParticleConfig } from "../interfaces/particles.interface";

@Injectable({
  providedIn: 'root'
})
export class ParticleConfigService {
  // OPTIMIZADO: Reducir partículas para mejor performance
  private readonly defaultConfig: ParticleConfig = {
    count: 800, // Reducido de 1000
    size: 0.4,  // Reducido de 0.5
    opacity: 0.5, // Reducido de 0.6
    speed: 0.08, // Reducido de 0.1
    colors: {
      hue: 0.5,
      saturation: 0.8,
      lightness: 0.5,
      variance: 0.1
    }
  };

  // OPTIMIZADO: Configuración móvil más ligera
  private readonly mobileConfig: ParticleConfig = {
    count: 300, // Reducido de 500
    size: 0.3,
    opacity: 0.3, // Reducido de 0.4
    speed: 0.04, // Reducido de 0.05
    colors: {
      hue: 0.5,
      saturation: 0.8,
      lightness: 0.5,
      variance: 0.1
    }
  };

  // NUEVO: Configuración para dispositivos de baja potencia
  private readonly lowEndConfig: ParticleConfig = {
    count: 200,
    size: 0.3,
    opacity: 0.3,
    speed: 0.03,
    colors: {
      hue: 0.5,
      saturation: 0.8,
      lightness: 0.5,
      variance: 0.1
    }
  };

  getConfig(isMobile: boolean): ParticleConfig {
    // NUEVO: Detectar dispositivos de baja potencia
    const isLowEnd = this.isLowEndDevice();
    
    if (isLowEnd) {
      return this.lowEndConfig;
    }
    
    return isMobile ? this.mobileConfig : this.defaultConfig;
  }

  createCustomConfig(overrides: Partial<ParticleConfig>): ParticleConfig {
    const baseConfig = this.getConfig(this.isMobile());
    return { ...baseConfig, ...overrides };
  }

  // NUEVO: Detectar dispositivos de baja potencia
  private isLowEndDevice(): boolean {
    return navigator.hardwareConcurrency < 4 || 
           (navigator as any).deviceMemory < 4;
  }

  // NUEVO: Detectar móviles
  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  // NUEVO: Configuraciones específicas según performance
  getOptimizedConfig(performanceLevel: 'high' | 'medium' | 'low'): ParticleConfig {
    const configs = {
      high: this.defaultConfig,
      medium: {
        ...this.defaultConfig,
        count: 600,
        opacity: 0.4
      },
      low: this.lowEndConfig
    };

    return configs[performanceLevel];
  }
}