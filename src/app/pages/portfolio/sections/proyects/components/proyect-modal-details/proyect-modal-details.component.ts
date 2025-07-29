import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal, computed, effect, HostListener, OnDestroy } from '@angular/core';
import { TechClassPipe } from '../../pipes/tech-class.pipe';
import { ModalResponsivePipe } from '../../pipes/modal.pipe';
import { FormatFileSizePipe } from '../../pipes/format-file.pipe';
import { FormatDurationPipe } from '../../pipes/format-duration.pipe';
import { TechIconPipe } from '../../pipes/tech-icon.pipe';
import { Project } from '../../interfaces/proyect.interface';
import { ProjectDetailService } from '../../services/proyect-details.service';
import { ProjectGalleryItem } from '../../interfaces/proyect-details.interface';

type TabType = 'overview' | 'gallery';
type ViewportSize = 'mobile' | 'tablet' | 'desktop';

@Component({
  selector: 'app-project-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    TechClassPipe,
    ModalResponsivePipe,
    FormatDurationPipe,
  ],
  templateUrl: './proyect-modal-details.component.html',
  styleUrls: ['./proyect-modal-details.component.css']
})
export class ProjectDetailsModalComponent implements OnDestroy {

  private readonly modalVisible = signal(false);
  private readonly selectedProject = signal<Project | null>(null);
  private readonly projectsList = signal<Project[]>([]);
  private readonly mobileDevice = signal(false);

  private readonly activeTabState = signal<TabType>('overview');
  private readonly galleryIndex = signal(0);
  private readonly lightboxVisible = signal(false);
  private readonly videoPlaying = signal(false);
  private readonly loadingState = signal(false);
  private readonly screenSize = signal<ViewportSize>('desktop');
  private readonly touchX = signal(0);
  private readonly touchY = signal(0);

  protected readonly isModalVisible = computed(() => this.modalVisible());
  protected readonly currentProject = computed(() => this.selectedProject());
  protected readonly allProjects = computed(() => this.projectsList());
  protected readonly isMobileDevice = computed(() => this.mobileDevice());
  protected readonly activeTab = computed(() => this.activeTabState());
  protected readonly currentGalleryIndex = computed(() => this.galleryIndex());
  protected readonly showLightbox = computed(() => this.lightboxVisible());
  protected readonly isVideoPlaying = computed(() => this.videoPlaying());
  protected readonly isLoading = computed(() => this.loadingState());
  protected readonly viewportSize = computed(() => this.screenSize());

  protected readonly currentProjectDetails = computed(() => {
    const project = this.currentProject();
    if (!project) return null;
    return this.projectDetailService.getProjectDetail(project);
  });

  protected readonly currentGalleryItem = computed(() => {
    const details = this.currentProjectDetails();
    const index = this.currentGalleryIndex();
    return details?.gallery[index] || null;
  });

  protected readonly hasNextProject = computed(() => {
    const projects = this.allProjects();
    const current = this.currentProject();
    if (!current || projects.length === 0) return false;
    const currentIndex = projects.findIndex(p => p.id === current.id);
    return currentIndex < projects.length - 1;
  });

  protected readonly hasPreviousProject = computed(() => {
    const projects = this.allProjects();
    const current = this.currentProject();
    if (!current || projects.length === 0) return false;
    const currentIndex = projects.findIndex(p => p.id === current.id);
    return currentIndex > 0;
  });

  protected readonly currentProjectIndex = computed(() => {
    const projects = this.allProjects();
    const current = this.currentProject();
    if (!current) return 0;
    return projects.findIndex(p => p.id === current.id) + 1;
  });

  protected readonly totalProjects = computed(() => this.allProjects().length);

  protected readonly hasGalleryNext = computed(() => {
    const details = this.currentProjectDetails();
    const index = this.currentGalleryIndex();
    return details && index < details.gallery.length - 1;
  });

  protected readonly hasGalleryPrevious = computed(() => {
    return this.currentGalleryIndex() > 0;
  });

  protected readonly modalClasses = computed(() => {
    return {
      'modal-visible': this.isModalVisible(),
      'modal-mobile': this.isMobileDevice(),
      'modal-tablet': this.viewportSize() === 'tablet',
      'modal-desktop': this.viewportSize() === 'desktop'
    };
  });

  @Output() closed = new EventEmitter<void>();
  @Output() projectChanged = new EventEmitter<Project>();
  @Output() actionClicked = new EventEmitter<{ action: 'demo' | 'code', project: Project }>();

  @Input() set isVisible(value: boolean) {
    this.modalVisible.set(value);
  }

  @Input() set project(value: Project | null) {
    this.selectedProject.set(value);
    if (value) {
      this.resetModalState();
    }
  }

  @Input() set projects(value: Project[]) {
    this.projectsList.set(value);
  }

  @Input() set isMobile(value: boolean) {
    this.mobileDevice.set(value);
    this.updateViewportSize();
  }

  constructor(private projectDetailService: ProjectDetailService) {
    this.setupEffects();
    this.updateViewportSize();
  }

  ngOnDestroy(): void {
    const modalBody = document.querySelector('.modal-body') as HTMLElement;
    if (modalBody) {
      modalBody.removeEventListener('wheel', this.handleWheel);
    }
  }

  private resetModalState(): void {
    this.activeTabState.set('overview');
    this.galleryIndex.set(0);
    this.lightboxVisible.set(false);
    this.videoPlaying.set(false);
  }


  private setupEffects(): void {
    effect(() => {
      if (this.isModalVisible()) {
         document.body.style.overflow = 'hidden';
         this.enableModalWheelScroll(); 
      } else {
        document.body.style.overflow = '';
      }
    });

    effect(() => {
      const tab = this.activeTab();
      if (tab !== 'gallery') {
        this.videoPlaying.set(false);
      }
    });

    effect(() => {
      if (this.isMobileDevice()) {
        this.screenSize.set('mobile');
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.updateViewportSize();
  }

  private updateViewportSize(): void {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 768) {
        this.screenSize.set('mobile');
        this.mobileDevice.set(true);
      } else if (width <= 1024) {
        this.screenSize.set('tablet');
        this.mobileDevice.set(false);
      } else {
        this.screenSize.set('desktop');
        this.mobileDevice.set(false);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isModalVisible()) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.onClose();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (this.activeTab() === 'gallery') {
          this.onGalleryPrevious();
        } else {
          this.onPreviousProject();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.activeTab() === 'gallery') {
          this.onGalleryNext();
        } else {
          this.onNextProject();
        }
        break;
      case 'Tab':
        event.preventDefault();
        this.onTabCycle(event.shiftKey);
        break;
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!this.isMobileDevice()) return;

    // Solo capturar touch en header para navegación entre proyectos
    const target = event.target as HTMLElement;
    const isInHeader = target.closest('.modal-header');

    if (!isInHeader) return;

    const touch = event.touches[0];
    this.touchX.set(touch.clientX);
    this.touchY.set(touch.clientY);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.isMobileDevice()) return;

    // Solo procesar touch en header para navegación entre proyectos
    const target = event.target as HTMLElement;
    const isInHeader = target.closest('.modal-header');

    if (!isInHeader) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchX();
    const deltaY = touch.clientY - this.touchY();

    // Solo navegación horizontal entre proyectos
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        this.onPreviousProject();
      } else {
        this.onNextProject();
      }
    }
  }

  private enableModalWheelScroll(): void {
  setTimeout(() => {
    const modalBody = document.querySelector('.modal-body') as HTMLElement;
    if (modalBody) {
      // Desktop: wheel scroll
      modalBody.addEventListener('wheel', (e) => {
        e.preventDefault();
        modalBody.scrollTop += e.deltaY;
      }, { passive: false });

      // Mobile: touch scroll MEJORADO
      let startY = 0;
      let isScrolling = false;

      modalBody.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isScrolling = false;
      }, { passive: true });

      modalBody.addEventListener('touchmove', (e) => {
        if (!isScrolling) {
          isScrolling = true;
        }
        
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        modalBody.scrollTop += deltaY * 100.5; // Multiplicador para suavidad
        startY = currentY;
      }, { passive: true });

      modalBody.addEventListener('touchend', () => {
        isScrolling = false;
      }, { passive: true });
    }
  }, 100);
}

  onClose(): void {
    this.modalVisible.set(false);
    this.closed.emit();

    const modalBody = document.querySelector('.modal-body') as HTMLElement;
    if (modalBody) {
      modalBody.removeEventListener('wheel', this.handleWheel);
    }
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.scrollTop += e.deltaY;
  };

  onNextProject(): void {
    const projects = this.allProjects();
    const current = this.currentProject();
    if (!current || !this.hasNextProject()) return;

    const currentIndex = projects.findIndex(p => p.id === current.id);
    const nextProject = projects[currentIndex + 1];

    this.selectedProject.set(nextProject);
    this.projectChanged.emit(nextProject);
  }

  onPreviousProject(): void {
    const projects = this.allProjects();
    const current = this.currentProject();
    if (!current || !this.hasPreviousProject()) return;

    const currentIndex = projects.findIndex(p => p.id === current.id);
    const previousProject = projects[currentIndex - 1];

    this.selectedProject.set(previousProject);
    this.projectChanged.emit(previousProject);
  }

  onTabChange(tab: TabType): void {
    this.activeTabState.set(tab);
    // Scroll al inicio cuando cambies de tab
    setTimeout(() => {
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }, 100);
  }

  private onTabCycle(reverse: boolean = false): void {
    const tabs: TabType[] = ['overview', 'gallery'];
    const currentIndex = tabs.indexOf(this.activeTab());

    let nextIndex: number;
    if (reverse) {
      nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    } else {
      nextIndex = (currentIndex + 1) % tabs.length;
    }

    this.activeTabState.set(tabs[nextIndex]);
  }

  onGalleryNext(): void {
    if (!this.hasGalleryNext()) return;
    this.galleryIndex.update(index => index + 1);
  }

  onGalleryPrevious(): void {
    if (!this.hasGalleryPrevious()) return;
    this.galleryIndex.update(index => index - 1);
  }

  onGalleryItemClick(index: number): void {
    this.galleryIndex.set(index);
    const item = this.currentGalleryItem();
    if (item?.type === 'image' || item?.type === 'gif') {
      this.lightboxVisible.set(true);
    }
  }

  onCloseLightbox(): void {
    this.lightboxVisible.set(false);
  }

  onVideoPlay(): void {
    this.videoPlaying.set(true);
  }

  onVideoPause(): void {
    this.videoPlaying.set(false);
  }

  showLightboxModal(): void {
    this.lightboxVisible.set(true);
  }

  onActionClick(action: 'demo' | 'code'): void {
    const project = this.currentProject();
    if (!project) return;

    this.actionClicked.emit({ action, project });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'status-online';
      case 'development': return 'status-development';
      case 'maintenance': return 'status-maintenance';
      default: return 'status-default';
    }
  }

  getTabLabel(tab: TabType): string {
    const labels = {
      overview: 'Resumen',
      gallery: 'Galería'
    };
    return labels[tab] || 'Resumen';
  }

  get isVisible(): boolean {
    return this.isModalVisible();
  }

  get isMobile(): boolean {
    return this.isMobileDevice();
  }

  getTabTypes(): TabType[] {
    return ['overview', 'gallery'];
  }

  trackByGalleryItem(index: number, item: ProjectGalleryItem): string {
    return item.id;
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }

  trackByFeature(index: number, feature: string): string {
    return `feature-${index}-${feature.slice(0, 10)}`;
  }

  trackByObjective(index: number, objective: string): string {
    return `objective-${index}-${objective.slice(0, 10)}`;
  }

  trackByLearning(index: number, learning: string): string {
    return `learning-${index}-${learning.slice(0, 10)}`;
  }

  getImagePlaceholder(): string {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg width="400" height="300" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af"%3ECargando...%3C/text%3E%3C/svg%3E';
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getImagePlaceholder();
  }

  getContextualDescription(text: string): string {
    const viewport = this.viewportSize();
    if (viewport === 'mobile') {
      return text.length > 100 ? text.substring(0, 100) + '...' : text;
    } else if (viewport === 'tablet') {
      return text.length > 200 ? text.substring(0, 200) + '...' : text;
    }
    return text;
  }

  getResponsiveFeatureCount(): number {
    const details = this.currentProjectDetails();
    if (!details) return 0;

    const viewport = this.viewportSize();
    const totalFeatures = details.keyFeatures.length;

    if (viewport === 'mobile') {
      return Math.min(totalFeatures, 6);
    } else if (viewport === 'tablet') {
      return Math.min(totalFeatures, 8);
    }

    return totalFeatures;
  }

  getAriaLabel(context: string, data?: any): string {
    switch (context) {
      case 'close-modal':
        return 'Cerrar modal de detalles del proyecto';
      case 'next-project':
        return `Siguiente proyecto. ${this.hasNextProject() ? 'Disponible' : 'No disponible'}`;
      case 'previous-project':
        return `Proyecto anterior. ${this.hasPreviousProject() ? 'Disponible' : 'No disponible'}`;
      case 'gallery-next':
        return `Siguiente imagen. ${this.hasGalleryNext() ? 'Disponible' : 'No disponible'}`;
      case 'gallery-previous':
        return `Imagen anterior. ${this.hasGalleryPrevious() ? 'Disponible' : 'No disponible'}`;
      case 'tab':
        return `Pestaña ${data}. ${this.activeTab() === data ? 'Activa' : 'Inactiva'}`;
      default:
        return '';
    }
  }
}