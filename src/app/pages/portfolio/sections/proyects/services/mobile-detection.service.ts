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
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 1024);
  }

  private detectVibrationSupport(): boolean {
    return 'vibrate' in navigator;
  }

  private getOptimalPixelRatio(): number {
    return Math.min(window.devicePixelRatio || 1, 2);
  }
}