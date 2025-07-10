// lenis-scroll.service.ts
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LenisScrollService implements OnDestroy {
  private lenis: any = null;
  private animationId: number | null = null;

  async initLenis(): Promise<void> {
    try {
      // Importar Lenis dinámicamente
      const { default: Lenis } = await import('@studio-freight/lenis');

      // Configuración de Lenis
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        direction: 'vertical'
      } as any);

      // Función de animación
      const raf = (time: number) => {
        this.lenis?.raf(time);
        this.animationId = requestAnimationFrame(raf);
      };

      // Iniciar el loop de animación
      this.animationId = requestAnimationFrame(raf);

      console.log('✅ Lenis Smooth Scroll iniciado');
    } catch (error) {
      console.error('❌ Error al cargar Lenis:', error);
    }
  }

  // Scroll a elemento específico
  scrollTo(target: string | HTMLElement | number, options: any = {}): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        ...options
      });
    }
  }

  // Scroll al top
  scrollToTop(): void {
    this.scrollTo(0, { duration: 2 });
  }

  // Parar el scroll
  stop(): void {
    this.lenis?.stop();
  }

  // Iniciar el scroll
  start(): void {
    this.lenis?.start();
  }

  // Destruir Lenis
  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.lenis?.destroy();
    this.lenis = null;
    
    console.log('🗑️ Lenis destruido');
  }

  // Eventos de scroll
  onScroll(callback: (lenis: any) => void): void {
    this.lenis?.on('scroll', callback);
  }

  // Obtener instancia de Lenis
  getInstance(): any {
    return this.lenis;
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}