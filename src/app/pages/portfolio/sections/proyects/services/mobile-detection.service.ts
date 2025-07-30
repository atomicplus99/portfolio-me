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
      console.log(`🔄 Mobile detection changed: ${currentState} → ${newMobileState}`);
      this.isMobile.set(newMobileState);
    }
  }

  vibrate(pattern: number | number[]) {
    if (this.vibrationSupported() && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  private detectMobile(): boolean {
    // ✅ DETECCIÓN MEJORADA PARA F12
    const screenWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );

    const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const widthMobile = screenWidth <= 1024;

    // ✅ DETECCIÓN ESPECÍFICA DE DEVTOOLS
    const isDevTools = window.outerHeight - window.innerHeight > 100 || 
                      window.outerWidth - window.innerWidth > 100;
    
    // ✅ PRIORIZAR ANCHO SOBRE USER AGENT EN DEVTOOLS
    if (isDevTools) {
      console.log(`🛠️ DevTools detected - Using width-based detection: ${widthMobile ? 'Mobile' : 'Desktop'} (width: ${screenWidth}px)`);
      return widthMobile;
    }

    // ✅ DETECCIÓN NORMAL
    const isMobile = userAgentMobile || widthMobile;
    console.log(`📱 Normal detection: UserAgent=${userAgentMobile}, Width=${widthMobile}, Final=${isMobile}`);
    
    return isMobile;
  }

  private detectVibrationSupport(): boolean {
    return 'vibrate' in navigator;
  }

  private getOptimalPixelRatio(): number {
    return Math.min(window.devicePixelRatio || 1, 2);
  }
}