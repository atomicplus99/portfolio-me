import { Component, OnInit, OnDestroy, ViewChild, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingParticlesComponent } from '../components/floating-particles/floating-particles.component';
import { HeroHeaderComponent } from '../components/proyect-hero-header/proyect-hero-header.component';
import { LoadingOverlayComponent } from '../components/proyect-loading-overlay/proyect-loading-overlay.component';
import { InteractionGuideComponent } from '../components/proyect-interaction-guide/proyect-interaction-guide.component';
import { MobileControlsComponent } from '../components/proyect-mobile-controls/proyect-mobile-controls.component';
import { StatsPanelComponent } from '../components/proyect-stats-panel/proyect-stats-panel.component';
import { ProjectPanelComponent } from '../components/proyect-panel/proyect-panel.component';
import { MatrixRainComponent } from '../components/proyect-matrix-rain/proyect-matrix-rain.component';
import { ThreejsCanvasComponent } from '../components/proyect-three-canvas/proyect-three-canvas.component';

import { ProjectsService } from '../services/proyect.service';
import { MobileDetectionService } from '../services/mobile-detection.service';
import { ThreejsService } from '../services/three.service';
import { Project } from '../interfaces/proyect.interface';
import { ProjectDetailsModalComponent } from '../components/proyect-modal-details/proyect-modal-details.component';
import { LenisScrollService } from '../../../../../core/global/services/portfolio-scroll.service';
import { ScrollIndicatorComponent } from "../../hero/components/hero-scroll-indicator/hero-scroll-indicator.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FloatingParticlesComponent,
    HeroHeaderComponent,
    LoadingOverlayComponent,
    InteractionGuideComponent,
    MobileControlsComponent,
    StatsPanelComponent,
    ProjectPanelComponent,
    MatrixRainComponent,
    ThreejsCanvasComponent,
    ProjectDetailsModalComponent,
    ScrollIndicatorComponent
],
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @ViewChild('threejsCanvas') threejsCanvasRef!: ThreejsCanvasComponent;

  public readonly isLoading = signal(true);
  public readonly showStats = signal(false);
  public readonly performanceMode = signal(false);
  public readonly showInstructions = signal(true);
  public readonly showMobileHint = signal(false);
  public readonly hasInteracted = signal(false);

  public readonly selectedProject = signal<Project | null>(null);
  public readonly showDetailModal = signal(false);
  public readonly modalProject = signal<Project | null>(null);

  protected readonly isMobile = signal(false);
  protected readonly projects = signal<Project[]>([]);

  protected readonly projectStats = computed(() => {
    if (!this.projectsService) return { totalProjects: 0, onlineProjects: 0, technologiesUsed: 0 };
    return this.projectsService.getProjectStats();
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

  constructor(
    private projectsService: ProjectsService,
    private mobileService: MobileDetectionService,
    private threejsService: ThreejsService,
    private lenisService: LenisScrollService
  ) {
    this.initializeSignals();
    this.setupEffects();
  }
  private isInProjectsSection(): boolean {
    if (typeof window === 'undefined') return true;

    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return true;

    const rect = projectsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isAtSectionStart = rect.top >= -100 && rect.top <= 200;


    return isAtSectionStart;
  }

  private initializeSignals(): void {
    this.isMobile.set(this.mobileService.getIsMobile());
    this.projects.set(this.projectsService.getProjects());
  }

  private setupEffects(): void {
    effect(() => {
      if (this.isMobile()) {
        setTimeout(() => {
          if (!this.hasInteracted()) {
            this.showMobileHint.set(true);
          }
        }, 3000);
      }
    });

    effect(() => {
      if (this.performanceMode()) {
      }
    });

    effect(() => {
      if (this.showDetailModal()) {
        this.showInstructions.set(false);
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);

    this.setupDevelopmentControls();
  }

  ngOnDestroy(): void {
    // Asegurar que Lenis esté activo al destruir el componente
    this.lenisService.start();
  }

  private async scrollToProjectsSection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isInProjectsSection()) {
        resolve();
        return;
      }

      // Scroll súper sutil y rápido
      this.lenisService.scrollTo('#projects', {
        duration: 0.2,
        easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        onComplete: () => resolve()
      });
    });
  }

  onProjectSelected(projectId: number): void {
    const project = this.projectsService.getProjectById(projectId);
    if (project) {
      this.selectedProject.set(project);

      if (this.isMobile() && this.mobileService.getVibrationSupported()) {
        this.mobileService.vibrate([30, 50, 30]);
      }
    }
  }

  onFirstInteraction(): void {
    if (!this.hasInteracted()) {
      this.hasInteracted.set(true);
      this.showInstructions.set(false);
      this.showMobileHint.set(false);
    }
  }

  onCursorChanged(cursor: string): void {
    if (!this.isMobile()) {
      document.body.style.cursor = cursor;
    }
  }

  onHintDismissed(): void {
    this.showMobileHint.set(false);
  }

  onActionClicked(action: 'demo' | 'code'): void {
    const project = this.selectedProject();
    if (!project) return;

    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate([50, 100, 50]);
    }

    if (action === 'demo' && project.demoUrl) {
      window.open(project.demoUrl, '_blank');
    } else if (action === 'code' && project.codeUrl) {
      window.open(project.codeUrl, '_blank');
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
    let newIndex: number;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % projects.length;
    } else {
      newIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    }

    this.selectedProject.set(projects[newIndex]);

    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.selectProject(projects[newIndex].id);
    }
  }

  onCloseProject(): void {
    this.selectedProject.set(null);

    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.deselectProject();
    }

    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(20);
    }
  }

  async onOpenDetailModal(): Promise<void> {
    const project = this.selectedProject();
    if (!project) return;

    try {
      await this.scrollToProjectsSection();
      await new Promise(resolve => setTimeout(resolve, 100));
      this.lenisService.stop();

      // Paso 4: Abrir modal
      this.modalProject.set(project);
      this.showDetailModal.set(true);

    } catch (error) {
      // En caso de error, asegurar que el modal se abra
      this.modalProject.set(project);
      this.showDetailModal.set(true);
    }
  }

  onModalClosed(): void {
    // Cerrar modal
    this.showDetailModal.set(false);
    this.modalProject.set(null);

    // Restaurar scroll (mantener posición actual)
    this.lenisService.start();

    // Vibración en móvil
    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(20);
    }
  }

  onModalProjectChanged(project: Project): void {
    // Solo cambiar proyecto, NO afectar el scroll
    this.modalProject.set(project);
    this.selectedProject.set(project);

    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.selectProject(project.id);
    }

    // NO llamar a stop/start de Lenis aquí
  }

  onModalActionClicked(event: { action: 'demo' | 'code', project: Project }): void {
    const { action, project } = event;

    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate([50, 100, 50]);
    }

    if (action === 'demo' && project.demoUrl) {
      window.open(project.demoUrl, '_blank');
    } else if (action === 'code' && project.codeUrl) {
      window.open(project.codeUrl, '_blank');
    }
  }

  onModalNavigate(direction: 'next' | 'previous'): void {
    const projects = this.projects();
    const currentProject = this.modalProject();

    if (!currentProject) return;

    const currentIndex = projects.findIndex(p => p.id === currentProject.id);
    let newIndex: number;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % projects.length;
    } else {
      newIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    }

    const newProject = projects[newIndex];
    this.modalProject.set(newProject);
    this.selectedProject.set(newProject); // Sync with panel

    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.selectProject(newProject.id);
    }

    // NO afectar Lenis durante navegación interna
  }

  onResetView(): void {
    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.resetView();
    }
  }

  onTogglePerformanceMode(): void {
    this.performanceMode.update(mode => !mode);

    if (this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(50);
    }
  }

  private setupDevelopmentControls(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
          e.preventDefault();
          this.showStats.update(show => !show);
        }

        if (e.key === 'F2') {
          e.preventDefault();
          this.onTogglePerformanceMode();
        }

        if (e.key === 'Enter' && this.selectedProject() && !this.showDetailModal()) {
          e.preventDefault();
          this.onOpenDetailModal();
        }

        if (e.key === 'Escape') {
          if (this.showDetailModal()) {
            this.onModalClosed();
          } else if (this.selectedProject()) {
            this.onCloseProject();
          }
        }

        if (!this.showDetailModal()) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.onNavigate('previous');
          }

          if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.onNavigate('next');
          }
        }

      });
    }
  }

  protected getIsLoading = () => this.isLoading();
  protected getSelectedProject = () => this.selectedProject();
  protected getModalProject = () => this.modalProject();
  protected getShowStats = () => this.showStats();
  protected getPerformanceMode = () => this.performanceMode();
  protected getShowInstructions = () => this.showInstructions();
  protected getShowMobileHint = () => this.showMobileHint();
  protected getShowDetailModal = () => this.showDetailModal();
  protected getShowPanel = () => this.showPanel();
}