
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingParticlesComponent } from './components/loading-particles/loading-particles.component';
import { AnimatedLogoComponent } from './components/loader-animated/loader-animated.component';
import { ProgressBarComponent } from './components/loader-progress-bar/loader-progress-bar.component';
import { LoaderService } from './services/loader.service';



@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    CommonModule,
    LoadingParticlesComponent,
    AnimatedLogoComponent,
    ProgressBarComponent
  ],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  readonly loaderService = inject(LoaderService);
  readonly logoText = input<string>('DUQUE');
  readonly subtitle = input<string>('Full Stack Developer');
  readonly particleCount = input<number>(10);
}