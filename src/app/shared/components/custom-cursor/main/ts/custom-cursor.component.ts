import { 
  Component, 
  OnInit, 
  OnDestroy, 
  HostListener, 
  ViewEncapsulation,
  effect,
  input,
  output,
  Renderer2
} from '@angular/core';

import { CursorConfigService } from '../../services/cursor-config.service'; 
import { DeviceDetectionService } from '../../services/device-detection.service'; 
import { ParticlePoolService } from '../../services/particle-pool.service'; 

import { AnimationService } from '../../services/animation.service';

import { CursorConfig, TacticalStatus, CursorPosition } from '../../interfaces/cursor.interfaces';
import { TacticalElementsService } from '../../services/tacticals-elements.service';


@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  template: '',
  styleUrls: ['../css/custom-cursor.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    ParticlePoolService,
    TacticalElementsService,
    AnimationService
  ]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  
  
  readonly config = input<Partial<CursorConfig>>();
  readonly disabled = input<boolean>(false);
  readonly optimizedMode = input<boolean>(false);
  readonly statusChange = output<TacticalStatus>();
  readonly targetingChange = output<boolean>();
  readonly firingChange = output<boolean>();

  private globalStyleElement?: HTMLStyleElement;
  private initialized = false;

  constructor(
    private renderer: Renderer2,
    private configService: CursorConfigService,
    private deviceDetectionService: DeviceDetectionService,
    private particlePoolService: ParticlePoolService,
    private tacticalElementsService: TacticalElementsService,
    private animationService: AnimationService
  ) {
    
    effect(() => {
      const inputConfig = this.config();
      if (inputConfig) {
        this.configService.updateConfig(inputConfig);
      }
    });

    
    effect(() => {
      const optimized = this.optimizedMode();
      if (optimized) {
        this.configService.enableOptimizedMode();
      } else {
        this.configService.disableOptimizedMode();
      }
    });

    
    effect(() => {
      const isMobile = this.deviceDetectionService.isMobile();
      if (isMobile && this.initialized) {
        this.destroy();
      } else if (!isMobile && !this.initialized && !this.disabled()) {
        this.initialize();
      }
    });

    
    effect(() => {
      const isDisabled = this.disabled();
      if (isDisabled && this.initialized) {
        this.destroy();
      } else if (!isDisabled && !this.initialized && this.deviceDetectionService.shouldShowCursor()) {
        this.initialize();
      }
    });
  }

  ngOnInit(): void {
    if (this.shouldInitialize()) {
      this.initialize();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private shouldInitialize(): boolean {
    return !this.disabled() && this.deviceDetectionService.shouldShowCursor();
  }

  private initialize(): void {
    if (this.initialized) return;

    this.injectGlobalStyles();
    this.particlePoolService.initializePool();
    this.tacticalElementsService.createElement();
    this.animationService.startAnimation();
    
    this.initialized = true;
    this.emitStatusChange();
  }

  private destroy(): void {
    if (!this.initialized) return;

    this.animationService.stopAnimation();
    this.tacticalElementsService.destroyElements();
    this.particlePoolService.destroyPool();
    this.removeGlobalStyles();
    
    this.initialized = false;
  }

  private injectGlobalStyles(): void {
    this.globalStyleElement = this.renderer.createElement('style');
    this.renderer.setAttribute(this.globalStyleElement, 'type', 'text/css');
    
    const globalCSS = this.getGlobalCSS();
    const textNode = this.renderer.createText(globalCSS);
    this.renderer.appendChild(this.globalStyleElement, textNode);
    this.renderer.appendChild(document.head, this.globalStyleElement);
  }

  private getGlobalCSS(): string {
    const mediaQuery = this.deviceDetectionService.getMediaQuery();
    
    return `
      @media ${mediaQuery} {
        .tactical-reticle, .interference-particle { display: none !important; }
        *, *::before, *::after, html, body { cursor: auto !important; }
      }
    `;
  }

  private removeGlobalStyles(): void {
    if (this.globalStyleElement?.parentNode) {
      this.renderer.removeChild(document.head, this.globalStyleElement);
      this.globalStyleElement = undefined;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.initialized) return;

    const position: CursorPosition = {
      x: event.clientX,
      y: event.clientY
    };

    this.animationService.updateCursorPosition(position);
    this.particlePoolService.activateParticle(position);
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.initialized) return;

    this.animationService.updateFiringState(true);
    this.tacticalElementsService.setClickState(true);
    
    const position: CursorPosition = {
      x: event.clientX,
      y: event.clientY
    };

    this.particlePoolService.createBurst(position);
    this.firingChange.emit(true);
    this.emitStatusChange();
  }

  @HostListener('document:mouseup', [])
  onMouseUp(): void {
    if (!this.initialized) return;

    this.animationService.updateFiringState(false);
    this.tacticalElementsService.setClickState(false);
    this.firingChange.emit(false);
    this.emitStatusChange();
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    if (!this.initialized) return;

    const target = event.target as HTMLElement;
    if (target && this.tacticalElementsService.isClickableElement(target)) {
      this.handleTargetingStart();
    }
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(event: MouseEvent): void {
    if (!this.initialized) return;

    const target = event.target as HTMLElement;
    if (target && this.tacticalElementsService.isClickableElement(target)) {
      this.handleTargetingEnd();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    if (!this.initialized) return;
    
    event.preventDefault();
    
    const position: CursorPosition = {
      x: event.clientX,
      y: event.clientY
    };

    this.particlePoolService.createDefensivePattern(position);
  }

  private handleTargetingStart(): void {
    this.animationService.updateTargetingState(true);
    this.tacticalElementsService.setHoverState(true);
    
    
    this.animationService.updateParticleDelay(120);
    this.animationService.updateCornerOffset(30);
    
    this.targetingChange.emit(true);
    this.emitStatusChange();
  }

  private handleTargetingEnd(): void {
    this.animationService.updateTargetingState(false);
    this.tacticalElementsService.setHoverState(false);
    
    
    this.animationService.updateParticleDelay(200);
    
    this.targetingChange.emit(false);
    this.emitStatusChange();
  }

  private emitStatusChange(): void {
    const status = this.getTacticalStatus();
    this.statusChange.emit(status);
  }

  
  public getTacticalStatus(): TacticalStatus {
    const animationState = this.animationService.animationState();
    const particleStatus = this.particlePoolService.getPoolStatus();

    return {
      reticlePosition: animationState.cursorPosition,
      isTargeting: animationState.isTargeting,
      isFiring: animationState.isFiring,
      activeParticles: particleStatus.activeParticles,
      systemStatus: this.initialized ? 'operational' : 'inactive'
    };
  }

  public setOptimizedMode(enabled: boolean): void {
    this.configService.updateConfig({ optimizedMode: enabled });
    if (enabled) {
      this.animationService.optimizeForPerformance();
    } else {
      this.animationService.resetPerformanceSettings();
    }
  }

  public updateConfiguration(config: Partial<CursorConfig>): void {
    this.configService.updateConfig(config);
  }

  public resetConfiguration(): void {
    this.configService.resetToDefaults();
  }

  public getPerformanceMetrics() {
    return {
      isRunning: this.animationService.isRunning(),
      particlePool: this.particlePoolService.getPoolStatus(),
      config: this.configService.config()
    };
  }

  public enable(): void {
    if (this.deviceDetectionService.shouldShowCursor()) {
      this.initialize();
    }
  }

  public disable(): void {
    this.destroy();
  }
}