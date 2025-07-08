import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {
  private readonly _isMobile = signal(false);
  private readonly _showDesktopElements = signal(true);

  readonly isMobile = this._isMobile.asReadonly();
  readonly showDesktopElements = this._showDesktopElements.asReadonly();

  constructor() {
    this.checkViewport();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkViewport());
    }

    effect(() => {
      this._showDesktopElements.set(!this._isMobile());
    });
  }

  private checkViewport(): void {
    if (typeof window !== 'undefined') {
      this._isMobile.set(window.innerWidth < 1024);
    }
  }
}