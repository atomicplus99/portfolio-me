import { Directive, EventEmitter, NgZone, OnInit, Output } from "@angular/core";

@Directive({
  selector: '[appDeviceDetector]',
  standalone: true
})
export class DeviceDetectorDirective implements OnInit {
  @Output() deviceType = new EventEmitter<{ isMobile: boolean; isTablet: boolean }>();

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.detectDevice();
    this.setupResizeListener();
  }

  private detectDevice(): void {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
    this.deviceType.emit({ isMobile, isTablet });
  }

  private setupResizeListener(): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', () => {
        this.ngZone.run(() => this.detectDevice());
      });
    });
  }
}