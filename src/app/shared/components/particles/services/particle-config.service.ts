import { Injectable } from "@angular/core";
import { ParticleConfig } from "../interfaces/particles.interface";
import { AppPerformanceService } from "../../../../core/global/services/portfolio-perfomance.service";


@Injectable({
  providedIn: 'root'
})
export class ParticleConfigService {

  
  constructor(private performanceService: AppPerformanceService) {}


  private readonly defaultConfig: ParticleConfig = {
    count: 800,       // Densidad galáctica completa
    size: 1.5,        // Puntos visibles
    opacity: 0.7,     // Presencia moderada
    speed: 0.03,      // Movimiento galáctico lento
    colors: {
      hue: 0.6,       // Azul galáctico
      saturation: 0.8, // Vibrante
      lightness: 0.6,  // Brillante
      variance: 0.25   // Variación natural
    }
  };

  private readonly mobileConfig: ParticleConfig = {
    count: 500,       // Equilibrado para móvil
    size: 1.2,        
    opacity: 0.6,     
    speed: 0.02,      
    colors: {
      hue: 0.6,
      saturation: 0.7,
      lightness: 0.5,
      variance: 0.2
    }
  };

  private readonly lowEndConfig: ParticleConfig = {
    count: 300,       // Mínimo funcional
    size: 1.0,        
    opacity: 0.5,     
    speed: 0.01,      
    colors: {
      hue: 0.6,
      saturation: 0.6,
      lightness: 0.4,
      variance: 0.15
    }
  };

  // UNIFICADO: Usa detección de AppPerformanceService
  getConfig(isMobile?: boolean): ParticleConfig {
    const deviceInfo = this.performanceService.deviceInfo();
    const mobile = isMobile ?? deviceInfo.isMobile;
    
    if (deviceInfo.isLowEnd) {
      return this.lowEndConfig;
    }
    
    return mobile ? this.mobileConfig : this.defaultConfig;
  }

  createCustomConfig(overrides: Partial<ParticleConfig>): ParticleConfig {
    const baseConfig = this.getConfig();
    return { ...baseConfig, ...overrides };
  }

  // SIMPLIFICADO: Ya no necesita su propia detección
  private isMobile(): boolean {
    return this.performanceService.deviceInfo().isMobile;
  }

  private isLowEndDevice(): boolean {
    return this.performanceService.deviceInfo().isLowEnd;
  }

  // Configuraciones específicas según performance
  getOptimizedConfig(performanceLevel: 'high' | 'medium' | 'low'): ParticleConfig {
    const configs = {
      high: {
        ...this.defaultConfig,
        count: 1000,      // Ultra densidad
        size: 2.0,        
        opacity: 0.8
      },
      medium: {
        ...this.defaultConfig,
        count: 800,       // Configuración default
        size: 1.5,
        opacity: 0.7
      },
      low: this.lowEndConfig
    };

    return configs[performanceLevel];
  }

  // Configuración extrema para pruebas
  getExtremeConfig(): ParticleConfig {
    return {
      count: 1200,      // Máximo para pruebas
      size: 2.5,        
      opacity: 0.9,
      speed: 0.05,
      colors: {
        hue: 0.6,
        saturation: 1.0,
        lightness: 0.7,
        variance: 0.3
      }
    };
  }

  // DEBUGGING: Ver qué configuración se está usando
  getCurrentConfig(isMobile?: boolean): { config: ParticleConfig; type: string; deviceInfo: any } {
    const deviceInfo = this.performanceService.deviceInfo();
    const mobile = isMobile ?? deviceInfo.isMobile;
    
    if (deviceInfo.isLowEnd) {
      return { config: this.lowEndConfig, type: 'lowEnd', deviceInfo };
    }
    
    if (mobile) {
      return { config: this.mobileConfig, type: 'mobile', deviceInfo };
    }
    
    return { config: this.defaultConfig, type: 'default', deviceInfo };
  }

  // NUEVO: Método para debugging desde consola
  debugConfig(): void {
    const current = this.getCurrentConfig();
    console.group('🌌 Particle Config Debug');
    console.log('Type:', current.type);
    console.log('Config:', current.config);
    console.log('Device Info:', current.deviceInfo);
    console.log('Performance Service:', this.performanceService.getPerformanceMetrics());
    console.groupEnd();
  }
}