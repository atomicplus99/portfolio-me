import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit, inject } from '@angular/core';


import { AboutComponent } from './pages/portfolio/sections/about/about.component';

import { ParticlesComponent } from './shared/components/particles/main/ts/particles';

import { ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './pages/portfolio/sections/contact/contact.component';
import { HeaderComponent } from './pages/portfolio/sections/header/header.component';
import { CustomCursorComponent } from './shared/components/custom-cursor/main/ts/custom-cursor.component';
import { AboutMeComponent } from './pages/portfolio/sections/about-me/about-me.component';
import { FooterComponent } from './pages/portfolio/sections/footer/footer.component';

import { HeroComponent } from './pages/portfolio/sections/hero/main/hero.component';
import { ProjectsComponent } from './pages/portfolio/sections/proyects/main/proyects.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './shared/components/loader/services/loader.service';
import { SkillsComponent } from './pages/portfolio/sections/skills/main/skills.component';
import { AvatarComponent } from './shared/components/avatar/main/avatar.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    LoaderComponent,
    AvatarComponent,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    ParticlesComponent,
    SkillsComponent,
    ReactiveFormsModule,
    ContactComponent,
    FooterComponent,
    AboutMeComponent,
    HeaderComponent,
    CustomCursorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly loaderService = inject(LoaderService);

  // Configuración del cursor
  cursorConfig = {
    maxParticles: 6,
    particleDelay: 250,
    cornerOffset: 20,
    optimizedMode: false
  };

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loaderService.startLoading();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.cdr.detectChanges();
  }

  onCursorStatusChange(status: any) { }

  onTargetingChange(isTargeting: boolean) { }
}