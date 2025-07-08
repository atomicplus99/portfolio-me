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
    ThreejsCanvasComponent
  ],
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  
  @ViewChild('threejsCanvas') threejsCanvasRef!: ThreejsCanvasComponent;

  // Signals para estado reactivo
  public readonly isLoading = signal(true);
  public readonly selectedProject = signal<Project | null>(null);
  public readonly showStats = signal(false);
  public readonly performanceMode = signal(false);
  public readonly showInstructions = signal(true);
  public readonly showMobileHint = signal(false);
  public readonly hasInteracted = signal(false);

  // Signals que se inicializarán después de la inyección de dependencias
  protected readonly isMobile = signal(false);
  protected readonly projects = signal<Project[]>([]);
  
  // Computed signals
  protected readonly projectStats = computed(() => {
    // Verificar que el servicio esté disponible
    if (!this.projectsService) return { totalProjects: 0, onlineProjects: 0, technologiesUsed: 0 };
    return this.projectsService.getProjectStats();
  });

  protected readonly performanceStats = computed(() => {
    // Verificar que el servicio esté disponible
    if (!this.threejsService) return { fps: 0, objectCount: 0, particleCount: 0, renderTime: 0 };
    return this.threejsService.getPerformanceStats();
  });
  
  protected readonly currentProjectIndex = computed(() => {
    const project = this.selectedProject();
    if (!project) return 0;
    return this.projects().findIndex(p => p.id === project.id) + 1;
  });

  constructor(
    private projectsService: ProjectsService,
    private mobileService: MobileDetectionService,
    private threejsService: ThreejsService
  ) {
    // Inicializar signals después de la inyección de dependencias
    this.initializeSignals();
    this.setupEffects();
  }

  private initializeSignals(): void {
    // Inicializar signals con valores de los servicios
    this.isMobile.set(this.mobileService.getIsMobile());
    this.projects.set(this.projectsService.getProjects());
  }

  private setupEffects(): void {
    // Effect para optimizaciones móviles
    effect(() => {
      if (this.isMobile()) {
        // this.performanceMode.set(true);
        
        // Mostrar hint móvil después de 3 segundos
        setTimeout(() => {
          if (!this.hasInteracted()) {
            this.showMobileHint.set(true);
          }
        }, 3000);
      }
    });

    // Effect para reaccionar a cambios en el modo performance
    effect(() => {
      if (this.performanceMode()) {
        // Lógica adicional para modo performance
   
      }
    });
  }

  ngOnInit(): void {
    // Simular carga inicial
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);

    // Configurar controles de desarrollo
    this.setupDevelopmentControls();
  }

  ngOnDestroy(): void {
    // Cleanup se maneja automáticamente por los componentes hijos
  }

  // Event handlers
  onProjectSelected(projectId: number): void {
    const project = this.projectsService.getProjectById(projectId);
    if (project) {
      this.selectedProject.set(project);
      
      // Vibración para móvil
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
    // Aplicar cursor al canvas si es necesario
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

    // Vibración para móvil
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
    
    // Actualizar canvas
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

  // Development controls
  private setupDevelopmentControls(): void {
    // Atajos de teclado para desarrollo
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
        
        if (e.key === 'Escape') {
          this.onCloseProject();
        }
        
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.onNavigate('previous');
        }
        
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.onNavigate('next');
        }
      });
    }
  }

  // Getters públicos para template (opcionales, ya que los signals son directamente accesibles)
  protected getIsLoading = () => this.isLoading();
  protected getSelectedProject = () => this.selectedProject();
  protected getShowStats = () => this.showStats();
  protected getPerformanceMode = () => this.performanceMode();
  protected getShowInstructions = () => this.showInstructions();
  protected getShowMobileHint = () => this.showMobileHint();
}