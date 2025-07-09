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
import { TacticalElementsService } from '../../services/tacticals-elements.service';

// NUEVOS SERVICIOS MODULARIZADOS

import { CursorEventHandlerService } from '../../services/cursor-event-handler.service';

import { CursorStatusService } from '../../services/cursor-status.service';

import { CursorConfig, TacticalStatus } from '../../interfaces/cursor.interfaces';
import { CursorPerformanceService } from '../../services/cursor-perfomance.service';
import { CursorLifecycleService } from '../../services/cursor-life-cycle.service';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  template: '',
  styleUrls: ['../css/custom-cursor.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    ParticlePoolService,
    TacticalElementsService,
    AnimationService,
    CursorPerformanceService,
    CursorEventHandlerService,
    CursorLifecycleService,
    CursorStatusService
  ]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  
  // INPUTS
  readonly config = input<Partial<CursorConfig>>();
  readonly disabled = input<boolean>(false);
  readonly optimizedMode = input<boolean>(false);
  
  // OUTPUTS
  readonly statusChange = output<TacticalStatus>();
  readonly targetingChange = output<boolean>();
  readonly firingChange = output<boolean>();

  constructor(
    private renderer: Renderer2,
    private configService: CursorConfigService,
    private deviceDetectionService: DeviceDetectionService,
    // Servicios modularizados
    private performanceService: CursorPerformanceService,
    private eventHandlerService: CursorEventHandlerService,
    private lifecycleService: CursorLifecycleService,
    private statusService: CursorStatusService
  ) {
    this.setupEffects();
  }

  ngOnInit(): void {
    if (this.lifecycleService.shouldInitialize(this.disabled())) {
      this.lifecycleService.initialize();
    }
  }

  ngOnDestroy(): void {
    this.lifecycleService.destroy();
  }

  // CONFIGURACIÓN DE EFFECTS
  private setupEffects(): void {
    // Effect para configuración
    effect(() => {
      const inputConfig = this.config();
      if (inputConfig) {
        this.configService.updateConfig(inputConfig);
      }
    });

    // Effect para modo optimizado
    effect(() => {
      const optimized = this.optimizedMode();
      this.statusService.setOptimizedMode(optimized);
    });

    // Effect para móviles
    effect(() => {
      const isMobile = this.deviceDetectionService.isMobile();
      if (isMobile && this.lifecycleService.isInitialized) {
        this.lifecycleService.destroy();
      } else if (!isMobile && !this.lifecycleService.isInitialized && !this.disabled()) {
        this.lifecycleService.initialize();
      }
    });

    // Effect para disabled
    effect(() => {
      const isDisabled = this.disabled();
      if (isDisabled && this.lifecycleService.isInitialized) {
        this.lifecycleService.destroy();
      } else if (!isDisabled && !this.lifecycleService.isInitialized && this.deviceDetectionService.shouldShowCursor()) {
        this.lifecycleService.initialize();
      }
    });
  }

  // EVENT LISTENERS (simplificados)
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.lifecycleService.isInitialized) return;
    this.eventHandlerService.handleMouseMove(event);
    this.emitStatusChange();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (!this.lifecycleService.isInitialized) return;
    this.eventHandlerService.handleScroll();
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.lifecycleService.isInitialized) return;
    this.eventHandlerService.handleMouseDown(event);
    this.firingChange.emit(true);
    this.emitStatusChange();
  }

  @HostListener('document:mouseup', [])
  onMouseUp(): void {
    if (!this.lifecycleService.isInitialized) return;
    this.eventHandlerService.handleMouseUp();
    this.firingChange.emit(false);
    this.emitStatusChange();
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    if (!this.lifecycleService.isInitialized) return;
    this.eventHandlerService.handleMouseOver(event);
    this.targetingChange.emit(true);
    this.emitStatusChange();
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(event: MouseEvent): void {
    if (!this.lifecycleService.isInitialized) return;
    this.eventHandlerService.handleMouseOut(event);
    this.targetingChange.emit(false);
    this.emitStatusChange();
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    if (!this.lifecycleService.isInitialized) return;
    this.eventHandlerService.handleContextMenu(event);
  }

  // EMISIÓN DE EVENTOS
  private emitStatusChange(): void {
    this.statusService.updateStatus();
    const status = this.statusService.currentStatus;
    this.statusChange.emit(status);
  }

  // API PÚBLICA (simplificada)
  public getTacticalStatus(): TacticalStatus {
    return this.statusService.currentStatus;
  }

  public setOptimizedMode(enabled: boolean): void {
    this.statusService.setOptimizedMode(enabled);
  }

  public updateConfiguration(config: Partial<CursorConfig>): void {
    this.statusService.updateConfiguration(config);
  }

  public resetConfiguration(): void {
    this.statusService.resetConfiguration();
  }

  public getPerformanceMetrics() {
    return this.statusService.getPerformanceMetrics();
  }

  public enable(): void {
    this.lifecycleService.enable();
  }

  public disable(): void {
    this.lifecycleService.disable();
  }

  // DEBUGGING
  public logStatus(): void {
    this.statusService.logCurrentStatus();
  }
}