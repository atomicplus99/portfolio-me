import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { AboutConfig } from '../interfaces/about.interface';


@Injectable({
  providedIn: 'root'
})
export class AboutConfigService {
  private readonly defaultConfig: AboutConfig = {
    quote: {
      title: [
        '"El código no es solo',
        'mi profesión',
        'es mi arte"'
      ],
      subtitle: 'Comprometido para crear soluciones que funcionan y sorprenden.'
    },
    cta: {
      text: 'Contactame',
      email: 'abel.ariase.soft@gmail.com',
      subject: 'Dejame un asunto'
    },
    geometries: [
      { 
        type: 'cube',
        position: new THREE.Vector3(-3, 2, 0),
        color: 0x64b5f6,
        size: 0.5
      },
      { 
        type: 'sphere',
        position: new THREE.Vector3(3, -1, 0),
        color: 0x8b5cf6,
        size: 0.4
      },
      { 
        type: 'octahedron',
        position: new THREE.Vector3(-2, -2, 0),
        color: 0x06b6d4,
        size: 0.6
      },
      { 
        type: 'torus',
        position: new THREE.Vector3(2, 2, 0),
        color: 0xa855f7,
        size: 0.3
      }
    ]
  };

  getConfig(): AboutConfig {
    return this.defaultConfig;
  }

  createCustomConfig(overrides: Partial<AboutConfig>): AboutConfig {
    return {
      ...this.defaultConfig,
      ...overrides,
      quote: { ...this.defaultConfig.quote, ...overrides.quote },
      cta: { ...this.defaultConfig.cta, ...overrides.cta },
      geometries: overrides.geometries || this.defaultConfig.geometries
    };
  }
}