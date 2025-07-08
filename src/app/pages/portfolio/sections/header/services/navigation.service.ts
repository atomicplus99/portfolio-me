// src/app/shared/services/navigation.service.ts
import { Injectable } from '@angular/core';
import { SectionMapping } from '../interfaces/header.interfaces';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly sectionMap: SectionMapping = {
    'proyectos': '#projects',
    'experiencia': '#skills', 
    'sobre-mi': '#about-me',
    'contacto': '#contact'
  };

  navigateToSection(sectionId: string): void {
    const targetSection = this.sectionMap[sectionId];
    if (!targetSection) return;

    const element = document.querySelector(targetSection);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  navigateToHome(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}