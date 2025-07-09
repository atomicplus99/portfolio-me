import { CommonModule } from "@angular/common";
import { Component, input, OnInit, signal } from "@angular/core";
import { Particle } from "../../interfaces/loader.interface";

@Component({
  selector: 'app-loading-particles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-particles.component.html',
  styleUrls: ['./loading-particles.component.css']
})
export class LoadingParticlesComponent implements OnInit {
  readonly count = input<number>(15); 
  readonly particles = signal<Particle[]>([]);
  readonly shouldRender = signal(false);

  ngOnInit(): void {
    // ✅ Defer particle generation
    requestIdleCallback(() => {
      this.generateParticles();
      this.shouldRender.set(true);
    });
  }

  private generateParticles(): void {
    const particleCount = Math.min(this.count(), 15); 
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 4
      });
    }
    
    this.particles.set(newParticles);
  }

  trackByIndex(index: number): number {
    return index;
  }
}