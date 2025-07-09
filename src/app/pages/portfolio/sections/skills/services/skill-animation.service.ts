import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  
  private readonly visibleItems = signal<boolean[]>([]);
  private readonly animationDelay = 200; // ms between animations

  initializeStaggeredAnimation(itemCount: number, initialDelay: number = 800): void {
    this.visibleItems.set(new Array(itemCount).fill(false));

    setTimeout(() => {
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          this.visibleItems.update(items => {
            const newItems = [...items];
            newItems[i] = true;
            return newItems;
          });
        }, i * this.animationDelay);
      }
    }, initialDelay);
  }

  getVisibleItems() {
    return this.visibleItems();
  }

  isItemVisible(index: number): boolean {
    const items = this.visibleItems();
    return items[index] || false;
  }

  resetAnimation(): void {
    this.visibleItems.set([]);
  }

  setItemVisible(index: number, visible: boolean = true): void {
    this.visibleItems.update(items => {
      const newItems = [...items];
      newItems[index] = visible;
      return newItems;
    });
  }
}