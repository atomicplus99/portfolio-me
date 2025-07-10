// loader-progress-bar.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="elegant-progress-container" 
         [class.visible]="isVisible()">
      
      <!-- Progress Track -->
      <div class="elegant-progress-track">
        
        <!-- Progress Fill -->
        <div class="elegant-progress-fill" 
             [style.width.%]="progress()">
          <div class="progress-shimmer"></div>
        </div>
        
        <!-- Track Overlay -->
        <div class="track-overlay"></div>
        
      </div>
      
      <!-- Progress Message (if enabled) -->
      <div class="progress-message" 
           *ngIf="showText() && message()">
        {{ message() }}
      </div>
      
    </div>
  `,
  styleUrls: ['./loader-progress-bar.component.css']
})
export class ProgressBarComponent {
  readonly progress = input<number>(0);
  readonly message = input<string>('Cargando...');
  readonly isVisible = input<boolean>(false);
  readonly showText = input<boolean>(true);
}