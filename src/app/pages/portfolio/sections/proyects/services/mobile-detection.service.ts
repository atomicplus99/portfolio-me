import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  private readonly isMobile = signal(this.detectMobile());
  private readonly vibrationSupported = signal(this.detectVibrationSupport());
  private readonly pixelRatio = signal(this.getOptimalPixelRatio());

  getIsMobile() {
    return this.isMobile();
  }

  getVibrationSupported() {
    return this.vibrationSupported();
  }

  getPixelRatio() {
    return this.pixelRatio();
  }

  updateMobileStatus() {
    this.isMobile.set(this.detectMobile());
  }

  vibrate(pattern: number | number[]) {
    if (this.vibrationSupported() && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  private detectMobile(): boolean {
    // Obtener el ancho real del viewport
    const screenWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );

    const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const widthMobile = screenWidth <= 1024;

    // En modo responsive, priorizar el ancho sobre userAgent
    const isResponsiveMode = window.innerWidth !== window.screen.width;
    const isMobile = isResponsiveMode ? widthMobile : (userAgentMobile || widthMobile);

    console.log('Detection - screenWidth:', screenWidth, 'userAgent:', userAgentMobile, 'responsive:', isResponsiveMode, 'result:', isMobile);

    return isMobile;
  }

  private detectVibrationSupport(): boolean {
    return 'vibrate' in navigator;
  }

  private getOptimalPixelRatio(): number {
    return Math.min(window.devicePixelRatio || 1, 2);
  }
}