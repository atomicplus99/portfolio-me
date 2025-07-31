import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  signal, 
  computed, 
  effect,
  inject,
  DestroyRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// ✅ LAZY LOADING - Solo importar lo esencial
import { HeroHeaderComponent } from '../components/proyect-hero-header/proyect-hero-header.component';
import { LoadingOverlayComponent } from '../components/proyect-loading-overlay/proyect-loading-overlay.component';

// ✅ IMPORTS LAZY - Se cargan dinámicamente
type LazyComponents = {
  FloatingParticlesComponent?: any;
  InteractionGuideComponent?: any;
  MobileControlsComponent?: any;
  StatsPanelComponent?: any;
  ProjectPanelComponent?: any;
  MatrixRainComponent?: any;
  ThreejsCanvasComponent?: any;
  ProjectDetailsModalComponent?: any;
  ScrollIndicatorComponent?: any;
};

import { ProjectsService } from '../services/proyect.service';
import { MobileDetectionService } from '../services/mobile-detection.service';
import { ThreejsService } from '../services/three.service';
import { Project } from '../interfaces/proyect.interface';
import { LenisScrollService } from '../../../../../core/global/services/portfolio-scroll.service';
import { StatsPanelComponent } from "../components/proyect-stats-panel/proyect-stats-panel.component";
import { MobileControlsComponent } from "../components/proyect-mobile-controls/proyect-mobile-controls.component";
import { ProjectPanelComponent } from "../components/proyect-panel/proyect-panel.component";
import { InteractionGuideComponent } from "../components/proyect-interaction-guide/proyect-interaction-guide.component";
import { ThreejsCanvasComponent } from "../components/proyect-three-canvas/proyect-three-canvas.component";
import { MatrixRainComponent } from "../components/proyect-matrix-rain/proyect-matrix-rain.component";
import { FloatingParticlesComponent } from "../components/floating-particles/floating-particles.component";
import { ProjectDetailsModalComponent } from "../components/proyect-modal-details/proyect-modal-details.component";
import { ScrollIndicatorComponent } from "../../hero/components/hero-scroll-indicator/hero-scroll-indicator.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    HeroHeaderComponent,
    LoadingOverlayComponent
    // ✅ Otros componentes se cargan dinámicamente
    ,
    StatsPanelComponent,
    MobileControlsComponent,
    ProjectPanelComponent,
    InteractionGuideComponent,
    ThreejsCanvasComponent,
    MatrixRainComponent,
    FloatingParticlesComponent,
    ProjectDetailsModalComponent,
    ScrollIndicatorComponent
],
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Optimización de detección de cambios
})
export class ProjectsComponent implements OnInit, OnDestroy {

  // ✅ INYECCIÓN MODERNA
  private readonly destroyRef = inject(DestroyRef);
  private readonly projectsService = inject(ProjectsService);
  private readonly mobileService = inject(MobileDetectionService);
  private readonly threejsService = inject(ThreejsService);
  private readonly lenisService = inject(LenisScrollService);

  @ViewChild('threejsCanvas') threejsCanvasRef!: any;

  // ✅ SEÑALES PRINCIPALES
  public readonly isLoading = signal(true);
  public readonly showStats = signal(false);
  public readonly performanceMode = signal(false);
  public readonly showInstructions = signal(true);
  public readonly showMobileHint = signal(false);
  public readonly hasInteracted = signal(false);

  public readonly selectedProject = signal<Project | null>(null);
  public readonly showDetailModal = signal(false);
  public readonly modalProject = signal<Project | null>(null);

  // ✅ NUEVAS SEÑALES MÓVILES
  public readonly scrollModeActive = signal(false);
  public readonly mobileCompactMode = signal(false);

  protected readonly isMobile = signal(false);
  protected readonly projects = signal<Project[]>([]);

  // ✅ COMPONENTES LAZY
  protected lazyComponents: LazyComponents = {};
  protected componentsLoaded = signal(false);

  // ✅ COMPUTED COMPLETOS
  protected readonly projectStats = computed(() => {
    const projects = this.projects();
    if (!projects.length) return { totalProjects: 0, onlineProjects: 0, technologiesUsed: 0 };
    
    return {
      totalProjects: projects.length,
      onlineProjects: projects.filter(p => p.demoUrl).length,
      technologiesUsed: new Set(projects.flatMap(p => (p as any).technologies || [])).size
    };
  });

  protected readonly performanceStats = computed(() => {
    if (!this.threejsService) return { fps: 0, objectCount: 0, particleCount: 0, renderTime: 0 };
    return this.threejsService.getPerformanceStats();
  });

  protected readonly currentProjectIndex = computed(() => {
    const project = this.selectedProject();
    if (!project) return 0;
    return this.projects().findIndex(p => p.id === project.id) + 1;
  });

  protected readonly currentModalProjectIndex = computed(() => {
    const project = this.modalProject();
    if (!project) return 0;
    return this.projects().findIndex(p => p.id === project.id) + 1;
  });

  protected readonly showPanel = computed(() => {
    return !!this.selectedProject() && !this.showDetailModal();
  });

  protected readonly anyProjectSelected = computed(() => {
    return !!this.selectedProject() || !!this.modalProject();
  });

  // ✅ EFECTOS SIMPLIFICADOS
  constructor() {
    this.initializeSignals();
    this.setupOptimizedEffects();
  }

  private initializeSignals(): void {
    this.isMobile.set(this.mobileService.getIsMobile());
    this.projects.set(this.projectsService.getProjects());
    
    // ✅ LISTENER PARA CAMBIOS DE ESTADO MÓVIL
    this.setupMobileStateListener();
  }

  // ✅ NUEVO: Listener para cambios de estado móvil
  private setupMobileStateListener(): void {
    // Actualizar estado móvil en cada cambio de ventana
    const updateMobileState = () => {
      this.mobileService.updateMobileStatus();
      const newMobileState = this.mobileService.getIsMobile();
      
      if (newMobileState !== this.isMobile()) {
        this.isMobile.set(newMobileState);
      }
    };

    // Listener para resize
    window.addEventListener('resize', () => {
      setTimeout(updateMobileState, 100);
    });

    // Listener para orientación
    window.addEventListener('orientationchange', () => {
      setTimeout(updateMobileState, 300);
    });
  }

  private setupOptimizedEffects(): void {
    // ✅ Un solo efecto para móviles
    effect(() => {
      if (this.isMobile() && !this.hasInteracted()) {
        const timer = setTimeout(() => {
          if (!this.hasInteracted()) {
            this.showMobileHint.set(true);
          }
        }, 3000);
        
        // Cleanup automático con destroyRef
        this.destroyRef.onDestroy(() => clearTimeout(timer));
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // ✅ CARGA PROGRESIVA
    await this.loadEssentialComponents();
    this.isLoading.set(false);
    
    // ✅ Cargar componentes pesados después
    this.loadHeavyComponents();
    this.setupDevelopmentControls();
  }

  ngOnDestroy(): void {
    // ✅ LIMPIEZA AUTOMÁTICA con destroyRef
    this.lenisService.start();
    this.cleanupThreeJS();
  }

  // ✅ CARGA PROGRESIVA DE COMPONENTES
  private async loadEssentialComponents(): Promise<void> {
    try {
      // Solo cargar los componentes críticos primero
      const { InteractionGuideComponent } = await import('../components/proyect-interaction-guide/proyect-interaction-guide.component');
      this.lazyComponents.InteractionGuideComponent = InteractionGuideComponent;
    } catch (error) {
      console.warn('Error loading essential components:', error);
    }
  }

  private async loadHeavyComponents(): Promise<void> {
    try {
      // ✅ CARGA PARALELA de componentes pesados
      const [
        { FloatingParticlesComponent },
        { MobileControlsComponent },
        { StatsPanelComponent },
        { ProjectPanelComponent },
        { MatrixRainComponent },
        { ThreejsCanvasComponent },
        { ProjectDetailsModalComponent },
        { ScrollIndicatorComponent }
      ] = await Promise.all([
        import('../components/floating-particles/floating-particles.component'),
        import('../components/proyect-mobile-controls/proyect-mobile-controls.component'),
        import('../components/proyect-stats-panel/proyect-stats-panel.component'),
        import('../components/proyect-panel/proyect-panel.component'),
        import('../components/proyect-matrix-rain/proyect-matrix-rain.component'),
        import('../components/proyect-three-canvas/proyect-three-canvas.component'),
        import('../components/proyect-modal-details/proyect-modal-details.component'),
        import('../../hero/components/hero-scroll-indicator/hero-scroll-indicator.component')
      ]);

      // ✅ Asignar componentes cargados
      Object.assign(this.lazyComponents, {
        FloatingParticlesComponent,
        MobileControlsComponent,
        StatsPanelComponent,
        ProjectPanelComponent,
        MatrixRainComponent,
        ThreejsCanvasComponent,
        ProjectDetailsModalComponent,
        ScrollIndicatorComponent
      });

      this.componentsLoaded.set(true);
    } catch (error) {
      console.warn('Error loading heavy components:', error);
      // Fallback: marcar como cargado para no bloquear la UI
      this.componentsLoaded.set(true);
    }
  }

  // ✅ LIMPIEZA DE THREEJS
  private cleanupThreeJS(): void {
    if (this.threejsService) {
      this.threejsService.dispose?.();
    }
    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.dispose?.();
    }
  }

  // ✅ MÉTODOS PRINCIPALES
  onProjectSelected(projectId: number): void {
    const project = this.projectsService.getProjectById(projectId);
    if (!project) return;

    this.selectedProject.set(project);

    // ✅ Vibración optimizada
    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate([20, 30, 20]);
    }
  }

  onFirstInteraction(): void {
    if (this.hasInteracted()) return;
    
    this.hasInteracted.set(true);
    this.showInstructions.set(false);
    this.showMobileHint.set(false);
  }

  onHintDismissed(): void {
    this.showMobileHint.set(false);
  }

  onCursorChanged(cursor: string): void {
    if (!this.isMobile()) {
      document.body.style.cursor = cursor;
    }
  }

  onCanvasMouseLeave(): void {
    if (!this.isMobile()) {
      document.body.style.cursor = 'default';
    }
  }

  onActionClicked(action: 'demo' | 'code'): void {
    const project = this.selectedProject();
    if (!project) return;

    // ✅ Vibración ligera
    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(30);
    }

    const url = action === 'demo' ? project.demoUrl : project.codeUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  onNavigate(direction: 'next' | 'previous'): void {
    const projects = this.projects();
    const currentProject = this.selectedProject();

    if (!currentProject) {
      this.selectedProject.set(projects[0]);
      return;
    }

    const currentIndex = projects.findIndex(p => p.id === currentProject.id);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % projects.length
      : currentIndex === 0 ? projects.length - 1 : currentIndex - 1;

    const newProject = projects[newIndex];
    this.selectedProject.set(newProject);

    // ✅ Verificar que el canvas esté disponible
    if (this.threejsCanvasRef?.selectProject) {
      this.threejsCanvasRef.selectProject(newProject.id);
    }
  }

  onCloseProject(): void {
    this.selectedProject.set(null);

    if (this.threejsCanvasRef?.deselectProject) {
      this.threejsCanvasRef.deselectProject();
    }

    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(15);
    }
  }

  // ✅ MODAL OPTIMIZADO
  async onOpenDetailModal(): Promise<void> {
    const project = this.selectedProject();
    if (!project) return;

    try {
      await this.scrollToProjectsSection();
      this.lenisService.stop();
      this.modalProject.set(project);
      this.showDetailModal.set(true);
    } catch (error) {
      // Fallback sin scroll
      this.lenisService.stop();
      this.modalProject.set(project);
      this.showDetailModal.set(true);
    }
  }

  private async scrollToProjectsSection(): Promise<void> {
    return new Promise((resolve) => {
      this.lenisService.scrollTo('#projects', {
        duration: 0.3,
        easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        onComplete: () => resolve()
      });
    });
  }

  onModalClosed(): void {
    this.showDetailModal.set(false);
    this.modalProject.set(null);
    this.lenisService.start();

    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(15);
    }
  }

  onModalProjectChanged(project: Project): void {
    this.modalProject.set(project);
    this.selectedProject.set(project);

    if (this.threejsCanvasRef?.selectProject) {
      this.threejsCanvasRef.selectProject(project.id);
    }
  }

  onModalActionClicked(event: { action: 'demo' | 'code', project: Project }): void {
    const { action, project } = event;

    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(30);
    }

    const url = action === 'demo' ? project.demoUrl : project.codeUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  onModalNavigate(direction: 'next' | 'previous'): void {
    const projects = this.projects();
    const currentProject = this.modalProject();

    if (!currentProject) return;

    const currentIndex = projects.findIndex(p => p.id === currentProject.id);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % projects.length
      : currentIndex === 0 ? projects.length - 1 : currentIndex - 1;

    const newProject = projects[newIndex];
    this.modalProject.set(newProject);
    this.selectedProject.set(newProject);

    if (this.threejsCanvasRef?.selectProject) {
      this.threejsCanvasRef.selectProject(newProject.id);
    }
  }

  onResetView(): void {
    if (this.threejsCanvasRef?.resetView) {
      this.threejsCanvasRef.resetView();
    }
  }

  onTogglePerformanceMode(): void {
    this.performanceMode.update(mode => !mode);

    if (this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(30);
    }
  }

  // ✅ NUEVOS MÉTODOS PARA MOBILE CONTROLS
  onScrollModeChanged(scrollMode: boolean): void {
    this.scrollModeActive.set(scrollMode);
  }

  onMobileSizeChanged(compactMode: boolean): void {
    this.mobileCompactMode.set(compactMode);
  }

  // ✅ CONTROLES DE DESARROLLO OPTIMIZADOS
  private setupDevelopmentControls(): void {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'F1':
          e.preventDefault();
          this.showStats.update(show => !show);
          break;
        case 'F2':
          e.preventDefault();
          this.onTogglePerformanceMode();
          break;
        case 'Enter':
          if (this.selectedProject() && !this.showDetailModal()) {
            e.preventDefault();
            this.onOpenDetailModal();
          }
          break;
        case 'Escape':
          if (this.showDetailModal()) {
            this.onModalClosed();
          } else if (this.selectedProject()) {
            this.onCloseProject();
          }
          break;
        case 'ArrowLeft':
          if (!this.showDetailModal()) {
            e.preventDefault();
            this.onNavigate('previous');
          }
          break;
        case 'ArrowRight':
          if (!this.showDetailModal()) {
            e.preventDefault();
            this.onNavigate('next');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // ✅ Cleanup automático
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });
  }

  // ✅ GETTERS PARA TEMPLATE
  protected getIsLoading = () => this.isLoading();
  protected getSelectedProject = () => this.selectedProject();
  protected getModalProject = () => this.modalProject();
  protected getShowStats = () => this.showStats();
  protected getPerformanceMode = () => this.performanceMode();
  protected getShowInstructions = () => this.showInstructions();
  protected getShowMobileHint = () => this.showMobileHint();
  protected getShowDetailModal = () => this.showDetailModal();
  protected getShowPanel = () => this.showPanel();
  protected getComponentsLoaded = () => this.componentsLoaded();
  protected getScrollModeActive = () => this.scrollModeActive();
  protected getMobileCompactMode = () => this.mobileCompactMode();
  protected getCurrentProjectIndex = () => this.currentProjectIndex();
  protected getAnyProjectSelected = () => this.anyProjectSelected();
}