import { Injectable, signal, effect, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {
  private readonly destroyRef = inject(DestroyRef);

  // ✅ Breakpoints optimizados
  private readonly MOBILE_BREAKPOINT = 768; // ✅ Cambiado de 1024 a 768
  private readonly TABLET_BREAKPOINT = 1024;
  private readonly DESKTOP_BREAKPOINT = 1280;

  // ✅ Signals privados
  private readonly _isMobile = signal(false);
  private readonly _isTablet = signal(false);
  private readonly _isDesktop = signal(false);
  private readonly _showDesktopElements = signal(false);
  private readonly _isInitialized = signal(false);
  private readonly _screenWidth = signal(0);

  // ✅ API pública readonly
  readonly isMobile = this._isMobile.asReadonly();
  readonly isTablet = this._isTablet.asReadonly();
  readonly isDesktop = this._isDesktop.asReadonly();
  readonly showDesktopElements = this._showDesktopElements.asReadonly();
  readonly isInitialized = this._isInitialized.asReadonly();
  readonly screenWidth = this._screenWidth.asReadonly();

  constructor() {
    this.initializeViewport();
    this.setupResizeListener();
    this.setupEffects();
  }

  private initializeViewport(): void {
    if (typeof window !== 'undefined') {
      this.updateViewportState(window.innerWidth);
      this._isInitialized.set(true);
    }
  }

  private setupResizeListener(): void {
    if (typeof window !== 'undefined') {
      // ✅ Usar observables para mejor performance
      fromEvent(window, 'resize').pipe(
        debounceTime(100), // ✅ Debounce para evitar calls excesivos
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.updateViewportState(window.innerWidth);
      });
    }
  }

  private setupEffects(): void {
    // ✅ Effect para sincronizar showDesktopElements
    effect(() => {
      // ✅ Mostrar elementos desktop en tablet y desktop, no solo desktop
      const showDesktop = this._isTablet() || this._isDesktop();
      this._showDesktopElements.set(showDesktop);
    });
  }

  private updateViewportState(width: number): void {
    this._screenWidth.set(width);

    // ✅ Lógica de breakpoints corregida
    const isMobile = width <= this.MOBILE_BREAKPOINT;
    const isTablet = width > this.MOBILE_BREAKPOINT && width <= this.TABLET_BREAKPOINT;
    const isDesktop = width > this.TABLET_BREAKPOINT;

    this._isMobile.set(isMobile);
    this._isTablet.set(isTablet);
    this._isDesktop.set(isDesktop);
  }

  // ✅ Métodos de utilidad adicionales
  getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
    if (this._isMobile()) return 'mobile';
    if (this._isTablet()) return 'tablet';
    return 'desktop';
  }

  isSmallScreen(): boolean {
    return this._screenWidth() <= this.MOBILE_BREAKPOINT;
  }

  isMediumScreen(): boolean {
    const width = this._screenWidth();
    return width > this.MOBILE_BREAKPOINT && width <= this.TABLET_BREAKPOINT;
  }

  isLargeScreen(): boolean {
    return this._screenWidth() > this.TABLET_BREAKPOINT;
  }

  // ✅ Para backwards compatibility
  isLegacyMobile(): boolean {
    return this._screenWidth() < 1024; // El comportamiento anterior
  }

  // ✅ Método para debug
  getViewportInfo() {
    return {
      width: this._screenWidth(),
      breakpoint: this.getCurrentBreakpoint(),
      isMobile: this._isMobile(),
      isTablet: this._isTablet(),
      isDesktop: this._isDesktop(),
      showDesktopElements: this._showDesktopElements()
    };
  }
}