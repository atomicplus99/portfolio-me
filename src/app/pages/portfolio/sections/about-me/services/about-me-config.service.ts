import { Injectable } from '@angular/core';
import { AboutMeConfig } from '../interfaces/about.interface';


@Injectable({
  providedIn: 'root'
})
export class AboutMeConfigService {
  private readonly defaultConfig: AboutMeConfig = {
    header: {
      title: 'SOBRE MÍ',
      subtitle: 'Full Stack Developer con más de 2 años de experiencia creando soluciones tecnológicas que transforman procesos y optimizan resultados empresariales.'
    },
    profile: {
      name: 'Abel Arias',
      title: 'Full Stack Developer',
      location: '📍 Huaral, Lima - Perú',
      image: '/assets/images/profile_user_arias.jpg',
      fallbackText: 'AA',
      status: {
        text: 'Disponible para proyectos',
        available: true
      }
    },
    stats: [
      { value: '2+', label: 'Años de Experiencia' },
      { value: '6+', label: 'Proyectos Completados' }
    ],
    story: {
      title: 'Mi Historia',
      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
      paragraphs: [
        'Desde que escribí mi primera línea de código en <strong class="text-gray-200">SENATI</strong>, supe que había encontrado mi vocación. No solo programo, <strong class="text-gray-200">creo experiencias</strong> que conectan con las personas.',
        'Mi especialidad es la <strong class="text-gray-200">arquitectura hexagonal con NestJS</strong> y el desarrollo de interfaces modernas con <strong class="text-gray-200">Angular</strong>. He liderado proyectos que han optimizado procesos hasta en un <strong class="text-gray-200">85%</strong> y construido APIs que responden en menos de <strong class="text-gray-200">100ms</strong> bajo miles de solicitudes.',
        'Actualmente me encuentro <strong class="text-gray-200">disponible para nuevos proyectos</strong>, siempre buscando desafíos que me permitan aplicar tecnologías emergentes y crear soluciones que marquen la diferencia.'
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