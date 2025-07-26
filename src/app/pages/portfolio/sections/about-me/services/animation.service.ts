import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private visibleElementsSubject = new BehaviorSubject<boolean[]>([]);
  public visibleElements$ = this.visibleElementsSubject.asObservable();

 initializeStaggeredAnimation(elementCount: number, delay: number = 200): void {
  const visibleElements = new Array(elementCount).fill(false);
  this.visibleElementsSubject.next(visibleElements);

  setTimeout(() => {
    // 1. Header título (inmediato)
    this.setElementVisible(0);
    
    // 2. Stats grid (300ms) - CAMBIÉ DE 1 A 2
    setTimeout(() => this.setElementVisible(2), 300);
    
    // 3. Story card (600ms) - CAMBIÉ DE 2 A 3  
    setTimeout(() => this.setElementVisible(3), 600);
    
    // 4. Story paragraphs (900ms) - CAMBIÉ DE 3 A 4
    setTimeout(() => this.setElementVisible(4), 900);
  }, 500);
}

  private setElementVisible(index: number): void {
    const current = this.visibleElementsSubject.value;
    current[index] = true;
    this.visibleElementsSubject.next([...current]);
  }

  // Animación específica para elementos individuales
  initializeCustomAnimation(sequence: { index: number, delay: number }[]): void {
    const visibleElements = new Array(10).fill(false);
    this.visibleElementsSubject.next(visibleElements);

    sequence.forEach(({ index, delay }) => {
      setTimeout(() => {
        this.setElementVisible(index);
      }, delay);
    });
  }

  // Animación en cascada para múltiples elementos
  initializeCascadeAnimation(startIndex: number, count: number, interval: number = 150): void {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.setElementVisible(startIndex + i);
      }, i * interval);
    }
  }

  reset(): void {
    this.visibleElementsSubject.next([]);
  }

  // Método para triggear animaciones desde componentes
  triggerAnimation(type: 'profile' | 'story' | 'stats' | 'all'): void {
    switch (type) {
      case 'profile':
        this.setElementVisible(1);
        setTimeout(() => this.setElementVisible(2), 300);
        break;
      
      case 'story':
        this.setElementVisible(3);
        setTimeout(() => this.setElementVisible(4), 200);
        break;
      
      case 'stats':
        this.setElementVisible(2);
        break;
      
      case 'all':
        this.initializeStaggeredAnimation(5, 200);
        break;
    }
  }
}