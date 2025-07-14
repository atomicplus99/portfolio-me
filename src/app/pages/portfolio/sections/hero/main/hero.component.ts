import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible.set(true);
    }, 150);
  }

  get isVisibleSignal() {
    return this.isVisible.asReadonly();
  }
}