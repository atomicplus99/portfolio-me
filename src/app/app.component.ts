import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Renderer2,
  DestroyRef,
  signal,
  computed
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take, delay, switchMap, tap, distinctUntilChanged } from 'rxjs/operators';
import { EMPTY, timer } from 'rxjs';

import { ParticlesComponent } from './shared/components/particles/main/ts/particles';
import { HeaderComponent } from './pages/portfolio/sections/header/header.component';
import { HeroComponent } from './pages/portfolio/sections/hero/main/hero.component';
import { LoaderService } from './shared/components/loader/services/loader.service';
import { AboutComponent } from './pages/portfolio/sections/about/about.component';
import { AboutMeComponent } from './pages/portfolio/sections/about-me/about-me.component';
import { ProjectsComponent } from './pages/portfolio/sections/proyects/main/proyects.component';
import { SkillsComponent } from './pages/portfolio/sections/skills/main/skills.component';
import { ContactComponent } from './pages/portfolio/sections/contact/contact.component';
import { FooterComponent } from './pages/portfolio/sections/footer/footer.component';
import { AppLifecycleManagerService } from './core/global/config/app-life-cycle.service';
import { AppConfigurationService } from './core/global/config/app-configuration.service';
import { ElegantLoaderComponent } from './shared/components/loader/loader.component';
import { LenisScrollService } from './core/global/services/portfolio-scroll.service';
import { GalaxyComponent } from './shared/components/galaxy/main/galaxy.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ElegantLoaderComponent,
    HeaderComponent,
    HeroComponent,
    ParticlesComponent,
    AboutComponent,
    AboutMeComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent,
    FooterComponent,
    GalaxyComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // ✅ Servicios readonly
  private readonly lifecycleManager = inject(AppLifecycleManagerService);
  private readonly configurationService = inject(AppConfigurationService);
  private readonly lenisService = inject(LenisScrollService);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly loaderService = inject(LoaderService);

  // ✅ SIGNALS para el template
  readonly loadedSections = computed(() => this.configurationService.loadedSections());
  readonly cursorConfig = computed(() => this.configurationService.cursorConfig());
  readonly isAppReady = computed(() => this.lifecycleManager.isReady);

  // ✅ NUEVO: Signal para detección de desktop
  readonly isDesktop = signal(false);

  // ✅ Signals internos
  private readonly _isInitialized = signal(false);
  private readonly _sectionsValidated = signal(false);

  // ✅ Cache para métricas
  private _cachedMetrics: any;
  private _metricsTimestamp = 0;

  async ngOnInit(): Promise<void> {
    // ✅ Detectar si es desktop
    this.detectScreenSize();
    
    // ✅ Escuchar cambios de tamaño
    this.setupResizeListener();

    const initPromise = this.initializeApp();
    
    initPromise
      .then(() => {
        this._isInitialized.set(true);
        this.setupLoadingWatcher();
      })
      .catch(() => this.handleInitializationError());
  }

  ngAfterViewInit(): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.lifecycleManager.initializeAfterViewInit();
        this.validateSectionsLoaded();
      });
    } else {
      setTimeout(() => {
        this.lifecycleManager.initializeAfterViewInit();
        this.validateSectionsLoaded();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.lifecycleManager.destroyApp(this.renderer);
    this.lenisService.destroy();
  }

  // ✅ NUEVO: Detectar tamaño de pantalla
  private detectScreenSize(): void {
    this.isDesktop.set(window.innerWidth >= 1024);
  }

  // ✅ NUEVO: Listener para resize
  private setupResizeListener(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.detectScreenSize();
    });
    
    resizeObserver.observe(document.body);
    
    // ✅ Cleanup en destroy
    this.destroyRef.onDestroy(() => {
      resizeObserver.disconnect();
    });
  }

  // ✅ Resto de métodos igual...
  scrollToSection = (sectionId: string): void => {
    this.lenisService.scrollTo(`#${sectionId}`);
  }

  scrollToTop = (): void => {
    this.lenisService.scrollToTop();
  }

  setPerformanceMode = (mode: 'high' | 'medium' | 'low'): void => {
    this.configurationService.setPerformanceMode(mode);
  }

  getMetrics() {
    const now = Date.now();
    if (now - this._metricsTimestamp > 1000) {
      this._cachedMetrics = this.lifecycleManager.getAppMetrics();
      this._metricsTimestamp = now;
    }
    return this._cachedMetrics;
  }

  runDiagnostics = () => this.lifecycleManager.runDiagnostics();

  private async initializeApp(): Promise<void> {
    await this.lifecycleManager.initializeApp(this.cdr, this.renderer);
    this.loadAllSectionsLazy();
  }

  private setupLoadingWatcher(): void {
    this.loaderService.state$.pipe(
      distinctUntilChanged((a, b) => a.isLoading === b.isLoading),
      filter(state => !state.isLoading),
      take(1),
      delay(50),
      switchMap(() => this.initializeLenis()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
      error: () => this.handleInitializationError()
    });
  }

  private initializeLenis() {
    try {
      return this.lenisService.initLenis() || EMPTY;
    } catch {
      return EMPTY;
    }
  }

  private loadAllSectionsLazy(): void {
    requestAnimationFrame(() => {
      this.lifecycleManager.loadAllSections();
      this.cdr.detectChanges();
    });
  }

  private validateSectionsLoaded(): void {
    if (this._sectionsValidated()) return;

    const requiredSections = ['about', 'aboutMe', 'projects', 'skills', 'contact', 'footer'] as const;
    const loadedSections = this.loadedSections();
    
    const missingSections = requiredSections.filter(
      section => !loadedSections[section]
    );

    if (missingSections.length > 0) {
      this.retryLoadingSections(missingSections, 1);
    } else {
      this._sectionsValidated.set(true);
    }
  }

  private retryLoadingSections(missingSections: readonly string[], attempt: number): void {
    if (attempt > 3) return;

    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);

    timer(delay).pipe(
      tap(() => this.loadAllSectionsLazy()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      setTimeout(() => this.validateSectionsLoaded(), 100);
    });
  }

  private handleInitializationError(): void {
    timer(500).pipe(
      tap(() => this.loadAllSectionsLazy()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  emergencyReload(): void {
    this._isInitialized.set(false);
    this._sectionsValidated.set(false);
    this.loadAllSectionsLazy();
  }
}
