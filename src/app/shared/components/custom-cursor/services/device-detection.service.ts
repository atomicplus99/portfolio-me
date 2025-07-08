import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {
  private isMobileSignal = signal(false);

  get isMobile() {
    return this.isMobileSignal.asReadonly();
  }

  constructor() {
    this.detectDevice();
    this.setupResizeListener();
  }

  private detectDevice(): void {
    const isMobile = this.checkIfMobile();
    this.isMobileSignal.set(isMobile);
  }

  private checkIfMobile(): boolean {
    
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    
    const hasUserAgentMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const hasSmallScreen = window.innerWidth <= 768;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return hasUserAgentMobile || (hasSmallScreen && hasTouchScreen);
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      this.detectDevice();
    });
  }

  shouldShowCursor(): boolean {
    return !this.isMobileSignal();
  }

  getMediaQuery(): string {
    return '(max-width: 768px)';
  }
}