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
  DestroyRef
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take, delay, switchMap, tap } from 'rxjs/operators';
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
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Mejor performance
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // ✅ Servicios inyectados de forma limpia
  private readonly lifecycleManager = inject(AppLifecycleManagerService);
  private readonly configurationService = inject(AppConfigurationService);
  private readonly lenisService = inject(LenisScrollService);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  // ✅ Servicios públicos para el template
  readonly loaderService = inject(LoaderService);

  // ✅ Getters limpios para el template
  get loadedSections() {
    return this.configurationService.loadedSections();
  }

  get cursorConfig() {
    return this.configurationService.cursorConfig();
  }

  get isAppReady(): boolean {
    return this.lifecycleManager.isReady;
  }

  async ngOnInit(): Promise<void> {
    try {
      // ✅ Inicialización secuencial y limpia
      await this.initializeApp();
      this.setupLoadingWatcher();
    } catch (error) {
      // ✅ Fallback en caso de error
      this.handleInitializationError();
    }
  }

  ngAfterViewInit(): void {
    // ✅ Solo las operaciones esenciales después del renderizado
    this.lifecycleManager.initializeAfterViewInit();
    this.validateSectionsLoaded();
  }

  ngOnDestroy(): void {
    // ✅ Limpieza ordenada
    this.lifecycleManager.destroyApp(this.renderer);
    this.lenisService.destroy();
  }

  // ✅ Métodos públicos para el template
  scrollToSection(sectionId: string): void {
    this.lenisService.scrollTo(`#${sectionId}`);
  }

  scrollToTop(): void {
    this.lenisService.scrollToTop();
  }

  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    this.configurationService.setPerformanceMode(mode);
  }

  // ✅ Métodos de diagnóstico
  getMetrics() {
    return this.lifecycleManager.getAppMetrics();
  }

  runDiagnostics() {
    return this.lifecycleManager.runDiagnostics();
  }

  // ✅ Métodos privados optimizados
  private async initializeApp(): Promise<void> {
    
    await this.lifecycleManager.initializeApp(this.cdr, this.renderer);
    this.loadAllSections();
  }

  private setupLoadingWatcher(): void {
    this.loaderService.state$.pipe(
      filter(state => !state.isLoading),
      take(1), // Solo la primera vez
      delay(100), // Pequeño delay para estabilidad
      switchMap(() => this.initializeLenis()),
      takeUntilDestroyed(this.destroyRef) // ✅ Auto cleanup
    ).subscribe({
      next: () => console.log(''),
      error: (error) => console.error()
    });
  }

  private initializeLenis() {
    // ✅ Convertir a observable para mejor manejo
    return this.lenisService.initLenis() || EMPTY;
  }

  private loadAllSections(): void {
    // ✅ Un solo método consolidado para cargar secciones
    this.lifecycleManager.loadAllSections();
    this.cdr.detectChanges();
  }

  private validateSectionsLoaded(): void {
    // ✅ Validación una sola vez, sin timeouts
    const requiredSections = ['about', 'aboutMe', 'projects', 'skills', 'contact', 'footer'] as const;
    const loadedSections = this.loadedSections;
    
    const missingSections = requiredSections.filter(
      section => !loadedSections[section]
    );

    if (missingSections.length > 0) {
      this.loadAllSections(); // Intentar cargar las faltantes
    }
  }

  private handleInitializationError(): void {
    // ✅ Fallback robusto
    
    timer(1000).pipe(
      tap(() => this.loadAllSections()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  // ✅ Método de emergencia simplificado (solo si es necesario)
  emergencyReload(): void {
    this.loadAllSections();
  }
}