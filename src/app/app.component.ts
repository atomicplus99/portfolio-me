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

import { ParticlesComponent } from './shared/components/particles/main/ts/particles';
import { HeaderComponent } from './pages/portfolio/sections/header/header.component';
import { CustomCursorComponent } from './shared/components/custom-cursor/main/ts/custom-cursor.component';
import { HeroComponent } from './pages/portfolio/sections/hero/main/hero.component';

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
import { ElegantLoaderComponent } from './shared/components/loader/loader.component';
import { LenisScrollService } from './core/global/services/portfolio-scroll.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ElegantLoaderComponent,
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

  private readonly lifecycleManager = inject(AppLifecycleManagerService);
  private readonly configurationService = inject(AppConfigurationService);

  readonly loaderService = inject(LoaderService);
  private readonly lenisService = inject(LenisScrollService);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);

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
    await this.lifecycleManager.initializeApp(this.cdr, this.renderer);
    this.forceLoadAllSections();
  }

  ngAfterViewInit(): void {
    this.lifecycleManager.initializeAfterViewInit();
    
    setTimeout(() => {
      this.ensureAllSectionsLoaded();
    }, 100);

    this.initLenisWhenReady();
  }

  ngOnDestroy(): void {
    this.lifecycleManager.destroyApp(this.renderer);
    this.lenisService.destroy();
  }

  private async initLenisWhenReady(): Promise<void> {
    const checkLoader = async () => {
      if (!this.loaderService.state().isLoading) {
        setTimeout(async () => {
          await this.lenisService.initLenis();
        }, 100);
      } else {
        setTimeout(checkLoader, 200);
      }
    };
    
    await checkLoader();
  }

  scrollToSection(sectionId: string): void {
    this.lenisService.scrollTo(`#${sectionId}`);
  }

  scrollToTop(): void {
    this.lenisService.scrollToTop();
  }

  private forceLoadAllSections(): void {
    setTimeout(() => {
      this.lifecycleManager.loadAllSections();
      this.cdr.detectChanges();
    }, 100);
  }

  private ensureAllSectionsLoaded(): void {
    const loaded = this.loadedSections;
    const requiredSections = ['about', 'aboutMe', 'projects', 'skills', 'contact', 'footer'];
    
    const missing = requiredSections.filter(section => !loaded[section as keyof typeof loaded]);
    
    if (missing.length > 0) {
      this.lifecycleManager.loadAllSections();
      this.cdr.detectChanges();
    } 
  }

  onCursorStatusChange(status: any): void {
    this.lifecycleManager.handleCursorStatusChange(status, this.renderer);
  }

  onTargetingChange(isTargeting: boolean): void {
    this.lifecycleManager.handleTargetingChange(isTargeting, this.renderer);
  }

  onHeaderInteraction(isActive: boolean): void {
    this.lifecycleManager.handleHeaderInteraction(isActive, this.renderer);
  }

  optimizePerformance(): void {
    this.lifecycleManager.optimizePerformance();
  }

  loadAllSections(): void {
    this.lifecycleManager.loadAllSections();
    this.cdr.detectChanges();
  }

  resetSections(): void {
    this.lifecycleManager.resetSections();
  }

  getMetrics() {
    return this.lifecycleManager.getAppMetrics();
  }

  runDiagnostics() {
    return this.lifecycleManager.runDiagnostics();
  }

  setPerformanceMode(mode: 'high' | 'medium' | 'low'): void {
    this.configurationService.setPerformanceMode(mode);
  }

  emergencyLoadSections(): void {
    this.lifecycleManager.loadAllSections();
    this.cdr.detectChanges();
  }
}