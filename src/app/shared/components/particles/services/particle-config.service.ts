import { Injectable } from "@angular/core";
import { ParticleConfig } from "../interfaces/particles.interface";

@Injectable({
  providedIn: 'root'
})
export class ParticleConfigService {
  // OPTIMIZADO: Aumentadas las partículas para mejor efecto visual
  private readonly defaultConfig: ParticleConfig = {
    count: 2000,
    size: 0.4,        // MUY GRANDE (era 0.8)
    opacity: 1.0,     // COMPLETAMENTE VISIBLE (era 0.6)
    speed: 0.08,
    colors: {
      hue: 0.5,         // CAMBIAR COLOR A NARANJA/ROJO
      saturation: 1.0,  // SATURACIÓN MÁXIMA
      lightness: 0.7,   // MÁS BRILLANTE
      variance: 0.1
    }
  };
  private readonly mobileConfig: ParticleConfig = {
    count: 600,       // Aumentado de 300 a 600
    size: 0.4,        // Aumentado de 0.3 a 0.4
    opacity: 0.4,     // Aumentado de 0.3 a 0.4
    speed: 0.05,      // Aumentado de 0.04 a 0.05
    colors: {
      hue: 0.5,
      saturation: 0.8,
      lightness: 0.5,
      variance: 0.1
    }
  };

  // NUEVO: Configuración para dispositivos de baja potencia
  private readonly lowEndConfig: ParticleConfig = {
    count: 400,       // Aumentado de 200 a 400
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
    // COMENTAR ESTAS LÍNEAS PARA FORZAR SIEMPRE EL DEFAULT
    // const isLowEnd = this.isLowEndDevice();
    // if (isLowEnd) {
    //   return this.lowEndConfig;
    // }

    // FORZAR SIEMPRE EL DEFAULT (1200 partículas)
    return this.defaultConfig;

    // O si quieres mantener móvil diferente:
    // return isMobile ? this.mobileConfig : this.defaultConfig;
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
      high: {
        ...this.defaultConfig,
        count: 1500,      // Versión ultra alta
        opacity: 0.7
      },
      medium: {
        ...this.defaultConfig,
        count: 900,       // Versión media
        opacity: 0.5
      },
      low: this.lowEndConfig
    };

    return configs[performanceLevel];
  }

  // NUEVO: Configuración extrema para pruebas
  getExtremeConfig(): ParticleConfig {
    return {
      count: 2000,      // Para pruebas de máximo rendimiento
      size: 0.6,
      opacity: 0.8,
      speed: 0.1,
      colors: {
        hue: 0.5,
        saturation: 0.8,
        lightness: 0.5,
        variance: 0.2
      }
    };
  }
}