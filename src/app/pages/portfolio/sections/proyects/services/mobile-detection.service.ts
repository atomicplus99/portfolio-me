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
    const newMobileState = this.detectMobile();
    const currentState = this.isMobile();
    
    if (newMobileState !== currentState) {
      this.isMobile.set(newMobileState);
    }
  }

  vibrate(pattern: number | number[]) {
    if (this.vibrationSupported() && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  private detectMobile(): boolean {
    // ✅ DETECCIÓN MEJORADA Y MÁS PRECISA
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // ✅ DETECCIÓN DE DEVTOOLS MÁS PRECISA
    const isDevTools = window.outerHeight - window.innerHeight > 100 || 
                      window.outerWidth - window.innerWidth > 100;
    
    // ✅ DETECCIÓN POR ANCHO DE PANTALLA
    const isMobileByWidth = screenWidth <= 768; // Breakpoint móvil estándar
    const isTabletByWidth = screenWidth > 768 && screenWidth <= 1024;
    
    // ✅ DETECCIÓN POR USER AGENT
    const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // ✅ LÓGICA DE DETECCIÓN MEJORADA
    if (isDevTools) {
      // En DevTools, priorizar el ancho de pantalla
      return isMobileByWidth;
    } else {
      // En dispositivo real, combinar user agent y ancho
      const isMobile = userAgentMobile || isMobileByWidth;
      return isMobile;
    }
  }

  private detectVibrationSupport(): boolean {
    return 'vibrate' in navigator;
  }

  private getOptimalPixelRatio(): number {
    return Math.min(window.devicePixelRatio || 1, 2);
  }
}