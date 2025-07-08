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
      location: 'Huaral, Lima - Perú'
    },
    tech: {
      badge: 'Angular Powered',
      icon: '⚡'
    },
    version: 'v2024.1'
  };

  getConfig(): FooterConfig {
    return this.defaultConfig;
  }
}