import { Injectable } from '@angular/core';
import { AboutMeConfig } from '../interfaces/about.interface';

@Injectable({
  providedIn: 'root'
})
export class AboutMeConfigService {
  private readonly defaultConfig: AboutMeConfig = {
    header: {
      title: 'SOBRE MÍ',
      subtitle: ''
    },
    profile: {
      name: 'Abel Arias',
      title: 'Full Stack Developer',
      location: 'Huaral, Lima - Perú',
      image: '/assets/images/profile_user_arias.jpg',
      fallbackText: 'AA'
    },
    stats: [
      { value: '1+', label: 'Años de Experiencia' },
      { value: '3+', label: 'Proyectos Completados' }
    ],
    story: {
      title: 'Sobre mí',
      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
      paragraphs: [
        // ✅ PÁRRAFOS COMPLETAMENTE LIMPIOS SIN STRONG
        'Hola, soy Abel Arias, me gusta el desarrollo web porque combina lógica, creatividad y el placer de crear algo real.',
        
        'Me defino por el compromiso, el orden y las ganas de hacer las cosas bien. Disfruto trabajar en equipo y aportar buena energía.',
        
        'Fuera del código, soy curioso y siempre tengo ganas de aprender algo nuevo... o descubrir una playlist buena! 🎵'
      ]
    }
  };

  getConfig(): AboutMeConfig {
    return this.defaultConfig;
  }

  createCustomConfig(overrides: Partial<AboutMeConfig>): AboutMeConfig {
    return {
      ...this.defaultConfig,
      ...overrides,
      header: { ...this.defaultConfig.header, ...overrides.header },
      profile: { ...this.defaultConfig.profile, ...overrides.profile },
      stats: overrides.stats || this.defaultConfig.stats,
      story: { ...this.defaultConfig.story, ...overrides.story }
    };
  }
}