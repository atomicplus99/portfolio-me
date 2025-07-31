import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LenisScrollService implements OnDestroy {
  private lenis: any = null;
  private animationId: number | null = null;

  async initLenis(): Promise<void> {
    try {
      const { default: Lenis } = await import('@studio-freight/lenis');

      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: true, // ← CAMBIAR A TRUE para interceptar touch
        direction: 'vertical'
      } as any);

      // ✅ Resetear scroll al inicio inmediatamente
      this.resetScrollToTop();

      const raf = (time: number) => {
        this.lenis?.raf(time);
        this.animationId = requestAnimationFrame(raf);
      };

      this.animationId = requestAnimationFrame(raf);

    } catch (error) {
      console.error('Error initializing Lenis:', error);
    }
  }

  // ✅ Resetear scroll al inicio
  resetScrollToTop(): void {
    // Resetear scroll nativo
    window.scrollTo(0, 0);
    
    // Resetear scroll de Lenis si está disponible
    if (this.lenis) {
      this.lenis.scrollTo(0, { duration: 0 });
    }
    
    // Asegurar que el scroll esté en el inicio
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (this.lenis) {
        this.lenis.scrollTo(0, { duration: 0 });
      }
    }, 100);
  }

  scrollTo(target: string | HTMLElement | number, options: any = {}): Promise<void> {
    return new Promise((resolve) => {
      if (this.lenis) {
        this.lenis.scrollTo(target, {
          duration: 1.5,
          easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
          onComplete: () => resolve(),
          ...options
        });
      } else {
        resolve();
      }
    });
  }

  scrollToTop(): void {
    this.scrollTo(0, { duration: 2 });
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.lenis?.destroy();
    this.lenis = null;
  }

  onScroll(callback: (lenis: any) => void): void {
    this.lenis?.on('scroll', callback);
  }

  getInstance(): any {
    return this.lenis;
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}