import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AboutMeConfigService } from './services/about-me-config.service';
import { AnimationService } from './services/animation.service';
import { ScrollIndicatorComponent } from "../hero/components/hero-scroll-indicator/hero-scroll-indicator.component";


export interface AboutMeHeader {
  title: string;
  subtitle?: string;
}

export interface AboutMeProfile {
  name: string;
  title: string;
  location: string;
  image: string;
  fallbackText: string;
}

export interface AboutMeStat {
  value: string;
  label: string;
}

export interface AboutMeStory {
  title: string;
  paragraphs: string[];
}

export interface AboutMeConfig {
  header: AboutMeHeader;
  profile: AboutMeProfile;
  stats: AboutMeStat[];
  story: AboutMeStory;
  techStack?: string[]; // Opcional para mostrar tecnologías
}
@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    CommonModule,
    ScrollIndicatorComponent
  ],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit, OnDestroy {
  isVisible = false;
  visibleElements: boolean[] = [];
  config: AboutMeConfig;
  isModalOpen = false; // Conservado para funcionalidad futura
  imageLoaded = false; // Para controlar la visibilidad del fallback

  private subscriptions = new Subscription();

  constructor(
    private aboutMeConfigService: AboutMeConfigService,
    private animationService: AnimationService
  ) {
    this.config = this.aboutMeConfigService.getConfig();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
      this.initializeAnimations();
    }, 300);

    this.setupAnimationSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.animationService.reset();
  }

  private setupAnimationSubscription(): void {
    const animationSub = this.animationService.visibleElements$.subscribe(
      elements => this.visibleElements = elements
    );
    this.subscriptions.add(animationSub);
  }

  private initializeAnimations(): void {
    // Ahora tenemos 4 elementos: header, profile-section, stats-grid, info-card
    this.animationService.initializeStaggeredAnimation(4, 200);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    this.imageLoaded = false;
  }

  onImageLoad(event: Event): void {
    const target = event.target as HTMLImageElement;
    this.imageLoaded = true;
  }

  // Métodos del modal conservados para funcionalidad futura
  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }
}