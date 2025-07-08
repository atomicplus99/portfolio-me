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
      for (let i = 0; i < elementCount; i++) {
        setTimeout(() => {
          const current = this.visibleElementsSubject.value;
          current[i] = true;
          this.visibleElementsSubject.next([...current]);
        }, i * delay);
      }
    }, 500);
  }

  reset(): void {
    this.visibleElementsSubject.next([]);
  }
}