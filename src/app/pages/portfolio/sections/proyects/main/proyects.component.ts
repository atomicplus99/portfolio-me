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
    ProjectDetailsModalComponent
  ],
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  
  @ViewChild('threejsCanvas') threejsCanvasRef!: ThreejsCanvasComponent;

  // Loading and UI State
  public readonly isLoading = signal(true);
  public readonly showStats = signal(false);
  public readonly performanceMode = signal(false);
  public readonly showInstructions = signal(true);
  public readonly showMobileHint = signal(false);
  public readonly hasInteracted = signal(false);

  // Project State
  public readonly selectedProject = signal<Project | null>(null);
  public readonly showDetailModal = signal(false);
  public readonly modalProject = signal<Project | null>(null);

  // Device and Display
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

  // UI State Computed
  protected readonly showPanel = computed(() => {
    return !!this.selectedProject() && !this.showDetailModal();
  });

  protected readonly anyProjectSelected = computed(() => {
    return !!this.selectedProject() || !!this.modalProject();
  });

  constructor(
    private projectsService: ProjectsService,
    private mobileService: MobileDetectionService,
    private threejsService: ThreejsService
  ) {
    this.initializeSignals();
    this.setupEffects();
  }

  private initializeSignals(): void {
    this.isMobile.set(this.mobileService.getIsMobile());
    this.projects.set(this.projectsService.getProjects());
  }

  private setupEffects(): void {
    // Mobile hint effect
    effect(() => {
      if (this.isMobile()) {
        setTimeout(() => {
          if (!this.hasInteracted()) {
            this.showMobileHint.set(true);
          }
        }, 3000);
      }
    });

    // Performance mode effect
    effect(() => {
      if (this.performanceMode()) {
        // Apply performance optimizations
      }
    });

    // Modal and panel coordination
    effect(() => {
      if (this.showDetailModal()) {
        // Hide instructions when modal is open
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
    // Cleanup if needed
  }

  // Project Selection - Panel Flow
  onProjectSelected(projectId: number): void {
    const project = this.projectsService.getProjectById(projectId);
    if (project) {
      this.selectedProject.set(project);
      
      if (this.isMobile() && this.mobileService.getVibrationSupported()) {
        this.mobileService.vibrate([30, 50, 30]);
      }
    }
  }

  // First Interaction
  onFirstInteraction(): void {
    if (!this.hasInteracted()) {
      this.hasInteracted.set(true);
      this.showInstructions.set(false);
      this.showMobileHint.set(false);
    }
  }

  // Cursor Changes
  onCursorChanged(cursor: string): void {
    if (!this.isMobile()) {
      document.body.style.cursor = cursor;
    }
  }

  // Mobile Hint
  onHintDismissed(): void {
    this.showMobileHint.set(false);
  }

  // Panel Actions
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

  // Panel Navigation
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

  // Panel Close
  onCloseProject(): void {
    this.selectedProject.set(null);
    
    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.deselectProject();
    }
    
    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(20);
    }
  }

  // Modal Actions
  onOpenDetailModal(): void {
    const project = this.selectedProject();
    if (project) {
      this.modalProject.set(project);
      this.showDetailModal.set(true);
      // Keep the panel project but hide panel
    }
  }

  onModalClosed(): void {
    this.showDetailModal.set(false);
    this.modalProject.set(null);
    // Panel project remains selected
    
    if (this.isMobile() && this.mobileService.getVibrationSupported()) {
      this.mobileService.vibrate(20);
    }
  }

  onModalProjectChanged(project: Project): void {
    this.modalProject.set(project);
    // Sync with panel project
    this.selectedProject.set(project);
    
    if (this.threejsCanvasRef) {
      this.threejsCanvasRef.selectProject(project.id);
    }
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

  // Modal Navigation (independent from panel)
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
  }

  // Mobile Controls
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

  // Development Controls
  private setupDevelopmentControls(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        // Stats toggle
        if (e.key === 'F1') {
          e.preventDefault();
          this.showStats.update(show => !show);
        }
        
        // Performance mode toggle
        if (e.key === 'F2') {
          e.preventDefault();
          this.onTogglePerformanceMode();
        }
        
        // Modal control
        if (e.key === 'Enter' && this.selectedProject() && !this.showDetailModal()) {
          e.preventDefault();
          this.onOpenDetailModal();
        }
        
        // Close actions
        if (e.key === 'Escape') {
          if (this.showDetailModal()) {
            this.onModalClosed();
          } else if (this.selectedProject()) {
            this.onCloseProject();
          }
        }
        
        // Navigation - Panel mode
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
        
        // Navigation - Modal mode (handled by modal component)
      });
    }
  }

  // Helper Methods
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