import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SectionHeaderComponent } from './components/header-about/header-about.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { StatsGridComponent } from './components/stats-grid/stats-grid.component';
import { StoryCardComponent } from './components/story-card/story-card.component';
import { BackgroundDecorationsComponent } from './components/background-decorations/background-decorations.component';
import { AboutMeConfig } from './interfaces/about.interface';
import { AboutMeConfigService } from './services/about-me-config.service';
import { AnimationService } from './services/animation.service';


@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    CommonModule,
    SectionHeaderComponent,
    ProfileCardComponent,
    StatsGridComponent,
    StoryCardComponent,
    BackgroundDecorationsComponent
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
    this.animationService.initializeStaggeredAnimation(4, 200);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  }

  scrollToNextSection(): void {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
}