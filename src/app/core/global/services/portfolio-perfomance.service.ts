import { Injectable, NgZone, Renderer2, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppPerformanceService {
  
  private deviceInfoSignal = signal(this.getDeviceInfo());
  private isScrollingSignal = signal(false);
  private scrollTimeout: number | null = null;
  private resizeTimeout: number | null = null;

  constructor(private ngZone: NgZone) {}

  get deviceInfo() {
    return this.deviceInfoSignal.asReadonly();
  }

  get isScrolling() {
    return this.isScrollingSignal.asReadonly();
  }

  private getDeviceInfo() {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency < 4 || 
                     (navigator as any).deviceMemory < 4;
    const isHighRefresh = window.screen && (window.screen as any).refreshRate > 60;
    
    return {
      isMobile,
      isLowEnd,
      isHighRefresh,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isAndroid: /Android/.test(navigator.userAgent),
      supportsPassiveEvents: this.checkPassiveEventSupport()
    };
  }

  private checkPassiveEventSupport(): boolean {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      const testHandler = () => {};
      window.addEventListener('test', testHandler, options as any);
      window.removeEventListener('test', testHandler, options as any);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }

  getCursorConfig() {
    const device = this.deviceInfoSignal();
    return {
      maxParticles: device.isMobile ? 2 : (device.isLowEnd ? 4 : 6),
      particleDelay: device.isMobile ? 350 : 250,
      cornerOffset: device.isMobile ? 15 : 20,
      optimizedMode: device.isLowEnd,
      headerOptimization: {
        enabled: true,
        throttleMouseMove: 16,
        reducedParticles: true,
        disableOnScroll: true
      }
    };
  }


  handleScroll(renderer: Renderer2): void {
    this.isScrollingSignal.set(true);
    
    renderer.addClass(document.body, 'app-scrolling');
    
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = window.setTimeout(() => {
      this.isScrollingSignal.set(false);
      renderer.removeClass(document.body, 'app-scrolling');
    }, 150);
  }

  handleResize(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.resizeTimeout) {
        window.clearTimeout(this.resizeTimeout);
      }
      
      this.resizeTimeout = window.setTimeout(() => {
        this.ngZone.run(() => {
          this.deviceInfoSignal.set(this.getDeviceInfo());
        });
      }, 300);
    });
  }

  handleVisibilityChange(renderer: Renderer2): void {
    if (document.hidden) {
      renderer.addClass(document.body, 'page-hidden');
    } else {
      renderer.removeClass(document.body, 'page-hidden');
    }
  }

  setupPerformanceOptimizations(renderer: Renderer2): void {
    this.ngZone.runOutsideAngular(() => {
      const scrollOptions = this.deviceInfoSignal().supportsPassiveEvents 
        ? { passive: true } 
        : false;

      window.addEventListener('scroll', () => {
        this.handleScroll(renderer);
      }, scrollOptions);

      window.addEventListener('resize', () => {
        this.handleResize();
      }, scrollOptions);

      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange(renderer);
      });
    });
  }

  cleanup(): void {
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }

  getPerformanceMetrics() {
    return {
      deviceInfo: this.deviceInfoSignal(),
      isScrolling: this.isScrollingSignal(),
      cursorConfig: this.getCursorConfig()
    };
  }
}