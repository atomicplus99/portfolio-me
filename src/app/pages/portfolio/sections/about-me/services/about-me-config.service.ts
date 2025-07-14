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
      location: '📍 Huaral, Lima - Perú',
      image: '/assets/images/profile_user_arias.jpg',
      fallbackText: 'AA',
      status: {
        text: 'Disponibilidad inmediata',
        available: true
      }
    },
    stats: [
      { value: '1+', label: 'Años de Experiencia' },
      { value: '☕', label: 'Combustible Diario' }
    ],
    story: {
      title: 'Sobre mí',
      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
      paragraphs: [
        'Hola, soy <strong class="text-purple-400">Abel Arias</strong>, me gusta el <strong class="text-cyan-400">desarrollo web</strong> porque combina lógica, creatividad y el placer de ver como una idea se convierte en algo real que otras personas pueden usar.',

        'Me defino por el <strong class="text-blue-400">compromiso</strong>, el <strong class="text-cyan-400">orden</strong> y las ganas de hacer las cosas bien. Disfruto trabajar en equipo, aprender de otros y aportar siempre con <strong class="text-purple-400">buena energía</strong>.',

        'Fuera del código, soy alguien <strong class="text-cyan-400">curioso</strong> que siempre tiene ganas de aprender algo nuevo... o de descubrir una <strong class="text-blue-400">playlist buena!</strong> 🎵'
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