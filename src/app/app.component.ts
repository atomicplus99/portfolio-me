import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Renderer2
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Componentes
import { ParticlesComponent } from './shared/components/particles/main/ts/particles';
import { HeaderComponent } from './pages/portfolio/sections/header/header.component';
import { CustomCursorComponent } from './shared/components/custom-cursor/main/ts/custom-cursor.component';
import { HeroComponent } from './pages/portfolio/sections/hero/main/hero.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './shared/components/loader/services/loader.service';
import { AvatarComponent } from './shared/components/avatar/main/avatar.component';
import { AboutComponent } from './pages/portfolio/sections/about/about.component';
import { AboutMeComponent } from './pages/portfolio/sections/about-me/about-me.component';
import { ProjectsComponent } from './pages/portfolio/sections/proyects/main/proyects.component';
import { SkillsComponent } from './pages/portfolio/sections/skills/main/skills.component';
import { ContactComponent } from './pages/portfolio/sections/contact/contact.component';
import { FooterComponent } from './pages/portfolio/sections/footer/footer.component';
import { AppLifecycleManagerService } from './core/global/config/app-life-cycle.service';
import { AppConfigurationService } from './core/global/config/app-configuration.service';


@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    HeaderComponent,
    CustomCursorComponent,
    HeroComponent,
    ParticlesComponent,
    AvatarComponent,
    AboutComponent,
    AboutMeComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  // SERVICIOS PRINCIPALES (solo 2!)
  private readonly lifecycleManager = inject(AppLifecycleManagerService);
  private readonly configurationService = inject(AppConfigurationService);

  // DEPENDENCIAS BÁSICAS
  readonly loaderService = inject(LoaderService);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);

  // GETTERS PARA EL TEMPLATE (ultra simples)
  get loadedSections() {
    return this.configurationService.loadedSections();
  }

  get cursorConfig() {
    return this.configurationService.cursorConfig();
  }

  get particleConfig() {
    return this.configurationService.particleConfig();
  }

  get isAppReady(): boolean {
    return this.lifecycleManager.isReady;
  }

  // CICLO DE VIDA (ultra simplificado)
  async ngOnInit(): Promise<void> {
    await this.lifecycleManager.initializeApp(this.cdr, this.renderer);
  }

  ngAfterViewInit(): void {
    this.lifecycleManager.initializeAfterViewInit();
    setTimeout(() => {
    }, 3000);

  }

  ngOnDestroy(): void {
    this.lifecycleManager.destroyApp(this.renderer);
  }

  // EVENTOS (delegados completamente)
  onCursorStatusChange(status: any): void {
    this.lifecycleManager.handleCursorStatusChange(status, this.renderer);
  }

  onTargetingChange(isTargeting: boolean): void {
    this.lifecycleManager.handleTargetingChange(isTargeting, this.renderer);
  }

  onHeaderInteraction(isActive: boolean): void {
    this.lifecycleManager.handleHeaderInteraction(isActive, this.renderer);
  }

  // API PÚBLICA (ultra simple)
  optimizePerformance(): void {
    this.lifecycleManager.optimizePerformance();
  }

  loadAllSections(): void {
    this.lifecycleManager.loadAllSections();
  }

  resetSections(): void {
    this.lifecycleManager.resetSections();
  }

  // DEBUGGING (una sola línea)
  logStatus(): void {
    this.lifecycleManager.logAppStatus();
  }

  // MÉTRICAS (delegado)
  getMetrics() {
    return this.lifecycleManager.getAppMetrics();
  }

  // DIAGNÓSTICOS (delegado)
  runDiagnostics() {
    return this.lifecycleManager.runDiagnostics();
  }

  // CONFIGURACIÓN MANUAL (si es necesario)
  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    this.configurationService.setPerformanceMode(mode);
  }
}