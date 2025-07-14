import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-scroll-indicator.component.html',
  styleUrls: ['./hero-scroll-indicator.component.css']
})
export class ScrollIndicatorComponent {
  private readonly sections = [
    '#hero',
    '#about',
    '#about-me',
    '#projects',
    '#skills',
    '#contact'
  ];

  private isScrolling = false;

  scrollToNextSection(): void {
    if (this.isScrolling) return;

    const currentIndex = this.getCurrentSection();
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.sections.length) {
      const nextSection = document.querySelector(this.sections[nextIndex]);
      if (nextSection) {
        this.isScrolling = true;

        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Liberar inmediatamente después del scroll
        this.isScrolling = false;
      }
    }
  }

  private getCurrentSection(): number {
    const scrollTop = window.scrollY;
    let currentSection = 0;
    
    // Encontrar la sección que está más visible en la pantalla
    for (let i = 0; i < this.sections.length; i++) {
      const section = document.querySelector(this.sections[i]) as HTMLElement;
      if (section) {
        const rect = section.getBoundingClientRect();
        
        // Si la sección está en el viewport (al menos 20% visible)
        if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= window.innerHeight * 0.2) {
          currentSection = i;
          break; // Tomar la primera sección que cumple la condición
        }
      }
    }
    
    return currentSection;
  }
}