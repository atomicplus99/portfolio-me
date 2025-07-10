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
        smoothTouch: false,
        direction: 'vertical'
      } as any);

      const raf = (time: number) => {
        this.lenis?.raf(time);
        this.animationId = requestAnimationFrame(raf);
      };

      this.animationId = requestAnimationFrame(raf);

    } catch (error) {
    }
  }

  scrollTo(target: string | HTMLElement | number, options: any = {}): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        ...options
      });
    }
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