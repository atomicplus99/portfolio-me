import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingParticlesComponent } from './components/loading-particles/loading-particles.component';
import { AnimatedLogoComponent } from './components/loader-animated/loader-animated.component';
import { ProgressBarComponent } from './components/loader-progress-bar/loader-progress-bar.component';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-elegant-loader',
  standalone: true,
  imports: [
    CommonModule,
    LoadingParticlesComponent,
    AnimatedLogoComponent,
    ProgressBarComponent
  ],
  template: `
    <div class="elegant-loader" 
         [class.fade-out]="!loaderService.state().isLoading">
      
      <!-- Subtle Background -->
      <div class="elegant-background">
        <div class="gradient-overlay"></div>
        <div class="minimal-stars"></div>
      </div>
      
      <!-- Minimal Particles -->
      <app-loading-particles 
      [count]="5"
      *ngIf="loaderService.state().isLoading">
      </app-loading-particles>
      
      <!-- Main Content -->
      <div class="elegant-content">
        
        <!-- Logo Section -->
        <div class="logo-section">
          <app-animated-logo 
            [text]="logoText()"
            [subtitle]="subtitle()"
            [isVisible]="loaderService.state().showLogo">
          </app-animated-logo>
        </div>
        
        <!-- Progress Section -->
        <div class="progress-section" 
             *ngIf="loaderService.state().showProgress">
          
          <!-- Status Bar -->
          <div class="status-bar">
            <div class="status-indicator">
              <div class="indicator-dot"></div>
              <span class="status-label">Sistema</span>
            </div>
            <div class="progress-percentage">
              {{ loaderService.state().progress }}%
            </div>
          </div>
          
          <!-- Progress Component -->
          <app-progress-bar
            [progress]="loaderService.state().progress"
            [message]="loaderService.state().message"
            [isVisible]="loaderService.state().showProgress"
            [showText]="false">
          </app-progress-bar>
          
          <!-- Message Display -->
          <div class="message-display">
            {{ loaderService.state().message }}
          </div>
          
        </div>
        
      </div>
      
      <!-- Elegant Frame -->
      <div class="elegant-frame">
        <div class="frame-border"></div>
      </div>
      
    </div>
  `,
  styleUrls: ['./loader.component.css']
})
export class ElegantLoaderComponent {
  readonly loaderService = inject(LoaderService);
  readonly logoText = input<string>('DUQUE');
  readonly subtitle = input<string>('Full Stack Developer');
}