import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AboutMeConfig } from './interfaces/about.interface';
import { AboutMeConfigService } from './services/about-me-config.service';
import { AnimationService } from './services/animation.service';
import { ScrollIndicatorComponent } from "../hero/components/hero-scroll-indicator/hero-scroll-indicator.component";

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    CommonModule // Solo necesitas CommonModule
    ,
    ScrollIndicatorComponent
],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit, OnDestroy {
  isVisible = false;
  visibleElements: boolean[] = [];
  config: AboutMeConfig;
  
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
    this.animationService.initializeStaggeredAnimation(5, 200); // Cambié a 5 elementos
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  }
}