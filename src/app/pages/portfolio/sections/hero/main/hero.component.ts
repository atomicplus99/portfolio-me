import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

import { ProfileSectionComponent } from '../components/hero-profile-section/hero-profile-section.component';
import { MassiveTextComponent } from '../components/hero-massive-text/hero-massive-text.component';
import { ScrollIndicatorComponent } from '../components/hero-scroll-indicator/hero-scroll-indicator.component';
import { ViewportService } from '../services/viewport.service';

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
  styleUrls: ['./hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Mejor performance
})
export class HeroComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
   readonly viewportService = inject(ViewportService);
  // ✅ Signal optimizado - solo lectura pública
  readonly isVisible = signal(false);

  ngAfterViewInit(): void {
    // ✅ Usar observables en lugar de setTimeout
    timer(100).pipe( // Reducido de 150ms a 100ms
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.isVisible.set(true);
    });
  }
}