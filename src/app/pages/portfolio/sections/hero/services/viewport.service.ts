import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {
  private readonly _isMobile = signal(false);
  private readonly _showDesktopElements = signal(false);
  private readonly _isInitialized = signal(false);

  readonly isMobile = this._isMobile.asReadonly();
  readonly showDesktopElements = this._showDesktopElements.asReadonly();
  readonly isInitialized = this._isInitialized.asReadonly();

  constructor() {
    this.initializeViewport();
    
    if (typeof window !== 'undefined') {
      let resizeTimeout: number;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => this.checkViewport(), 100);
      });
    }

    effect(() => {
      this._showDesktopElements.set(!this._isMobile());
    });
  }

  private initializeViewport(): void {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      
      this._isMobile.set(isMobile);
      this._showDesktopElements.set(!isMobile);
      this._isInitialized.set(true);
    }
  }

  private checkViewport(): void {
    if (typeof window !== 'undefined') {
      this._isMobile.set(window.innerWidth < 1024);
    }
  }
}