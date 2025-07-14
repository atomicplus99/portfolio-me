import { Injectable } from '@angular/core';
import { FooterConfig } from '../interfaces/footer.interface';

@Injectable({
  providedIn: 'root'
})
export class FooterConfigService {
  private readonly defaultConfig: FooterConfig = {
    brand: {
      name: 'Abel Arias',
      title: 'Full Stack Developer',
      location: 'Lima - Perú'
    },
    tech: {
      badge: 'Angular',
      icon: ''
    },
    version: '2025'
  };

  getConfig(): FooterConfig {
    return this.defaultConfig;
  }
}