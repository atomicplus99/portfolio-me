import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewportService } from '../services/viewport.service';
import { ProfileSectionComponent } from '../components/hero-profile-section/hero-profile-section.component';
import { MassiveTextComponent } from '../components/hero-massive-text/hero-massive-text.component';
import { ScrollIndicatorComponent } from '../components/hero-scroll-indicator/hero-scroll-indicator.component';




@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    ProfileSectionComponent,
    MassiveTextComponent,
    ScrollIndicatorComponent,
],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
   readonly isVisible = signal(false);

  constructor(private readonly viewportService: ViewportService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible.set(true);
    }, 150);
  }

  scrollToNext(): void {
    const nextSection = document.querySelector(
      '#about, .about-section, section:nth-child(2), [data-section="about"]'
    ) as HTMLElement;
        
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  }

  get isVisibleSignal() {
    return this.isVisible.asReadonly();
  }
}