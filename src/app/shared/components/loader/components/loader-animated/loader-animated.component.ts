import { CommonModule } from "@angular/common";
import { Component, input, OnInit, signal } from "@angular/core";

@Component({
  selector: 'app-animated-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="elegant-logo-container" 
         [class.visible]="isVisible()"
         [class.font-loaded]="fontLoaded()">
      
      <!-- Main Logo -->
      <div class="elegant-logo-text" 
           [class.font-loaded]="fontLoaded()">
        {{ text() }}
      </div>
      
      <!-- Subtitle -->
      <div class="elegant-subtitle" 
           *ngIf="subtitle()">
        {{ subtitle() }}
      </div>
      
      <!-- Minimal Accent -->
      <div class="logo-accent"></div>
      
    </div>
  `,
  styleUrls: ['./loader-animated.component.css']
})
export class AnimatedLogoComponent implements OnInit {
  readonly text = input<string>('DUQUE');
  readonly subtitle = input<string>('hola');
  readonly isVisible = input<boolean>(false);
  readonly fontLoaded = signal(false);

  ngOnInit() {
    
    this.checkFontLoad();
    
  }

  private checkFontLoad() {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        this.fontLoaded.set(true);
      });
    } else {
      setTimeout(() => this.fontLoaded.set(true), 100);
    }
  }
  
}