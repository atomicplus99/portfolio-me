import { CommonModule } from "@angular/common";
import { Component, input, OnInit, signal } from "@angular/core";

export interface MinimalParticle {
  x: number;
  y: number;
  delay: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
  color: string;
}

@Component({
  selector: 'app-loading-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portfolio-particles-container" 
         *ngIf="shouldRender()">
      
      <!-- Dynamic Particles -->
      <div class="portfolio-particle"
           *ngFor="let particle of particles(); trackBy: trackByIndex"
           [style.left.px]="particle.x"
           [style.top.px]="particle.y"
           [style.animation-delay.s]="particle.delay"
           [style.animation-duration.s]="particle.speed"
           [style.--particle-size.px]="particle.size"
           [style.--particle-opacity]="particle.opacity"
           [style.--particle-color]="particle.color"
           [style.transform]="'rotate(' + particle.direction + 'deg)'">
      </div>
      
    </div>
  `,
  styleUrls: ['./loading-particles.component.css']
})
export class LoadingParticlesComponent implements OnInit {
  readonly count = input<number>(30);
  
  readonly particles = signal<MinimalParticle[]>([]);
  readonly shouldRender = signal(false);

  private blueColors = [
    'rgba(59, 130, 246, 0.9)',   // Blue-500
    'rgba(96, 165, 250, 0.8)',   // Blue-400  
    'rgba(147, 197, 253, 0.7)',  // Blue-300
    'rgba(191, 219, 254, 0.6)',  // Blue-200
    'rgba(37, 99, 235, 1)',      // Blue-600
    'rgba(29, 78, 216, 0.9)'     // Blue-700
  ];

  ngOnInit(): void {
    requestIdleCallback(() => {
      this.generatePortfolioParticles();
      this.shouldRender.set(true);
    });
  }

  private generatePortfolioParticles(): void {
    const particleCount = Math.min(this.count(), 40); // Max 40 particles
    const newParticles: MinimalParticle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * (window.innerWidth + 200) - 100; // Extend beyond viewport
      const y = Math.random() * (window.innerHeight + 200) - 100;
      
      newParticles.push({
        x: x,
        y: y,
        delay: Math.random() * 10, // 0-10s random start
        size: 1 + Math.random() * 5, // 1-6px variety
        opacity: 0.4 + Math.random() * 0.6, // 0.4-1.0 opacity
        speed: 6 + Math.random() * 8, // 6-14s animation speed
        direction: Math.random() * 360, // Random rotation
        color: this.blueColors[Math.floor(Math.random() * this.blueColors.length)]
      });
    }
    
    this.particles.set(newParticles);
  }

  trackByIndex(index: number): number {
    return index;
  }
}