import { CommonModule } from "@angular/common";
import { ParticleConfig } from "../../interfaces/particles.interface";
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ParticleSystem } from "../../classes/particle.class";
import { ParticleConfigService } from "../../services/particle-config.service";
import { DeviceDetectorDirective } from "../../directives/device-dectector.directive";

@Component({
  selector: 'app-particles',
  standalone: true,
  imports: [CommonModule, DeviceDetectorDirective],
  templateUrl: '../template/particle.template.html',
  styleUrls: ['../css/particles.css']
})
export class ParticlesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() customConfig?: Partial<ParticleConfig>;
  @ViewChild('particlesCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private particleSystem!: ParticleSystem;
  private isMobile = false;
  private resizeObserver?: ResizeObserver;

  constructor(
    private ngZone: NgZone,
    private particleConfigService: ParticleConfigService
  ) { }

  ngOnInit(): void {
    this.setupResizeObserver();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initializeParticleSystem();
       this.observeContainer(); 
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  onDeviceTypeChange(deviceInfo: { isMobile: boolean; isTablet: boolean }): void {
    this.isMobile = deviceInfo.isMobile;
    if (this.particleSystem) {
      this.reinitializeForDevice();
    }
  }

  private initializeParticleSystem(): void {
    if (!this.canvasRef?.nativeElement) return;

    const container = this.canvasRef.nativeElement.parentElement!;
    const config = this.getParticleConfig();

    this.particleSystem = new ParticleSystem(
      this.canvasRef.nativeElement,
      container,
      config
    );

    this.particleSystem.startAnimation();
  }

  private getParticleConfig(): ParticleConfig {
    const baseConfig = this.particleConfigService.getConfig(this.isMobile);
    return this.customConfig
      ? this.particleConfigService.createCustomConfig({ ...baseConfig, ...this.customConfig })
      : baseConfig;
  }

  private reinitializeForDevice(): void {
    if (this.particleSystem) {
      this.particleSystem.dispose();
    }
    this.initializeParticleSystem();
  }

  private setupResizeObserver(): void {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.particleSystem) {
          this.particleSystem.handleResize();
        }
      });
    }
  }

  private observeContainer(): void {
    if (this.resizeObserver && this.canvasRef?.nativeElement.parentElement) {
      this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement);
    }
  }

  private cleanup(): void {
    if (this.particleSystem) {
      this.particleSystem.dispose();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}