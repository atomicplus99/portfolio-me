import { Component, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Particle } from '../../interfaces/loader.interface';


@Component({
  selector: 'app-loading-particles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-particles.component.html',
  styleUrls: [`./loading-particles.component.css`]
})
export class LoadingParticlesComponent implements OnInit {
  readonly count = input<number>(25);
  readonly particles = signal<Particle[]>([]);

  ngOnInit(): void {
    this.generateParticles();
  }

  private generateParticles(): void {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < this.count(); i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 4
      });
    }
    
    this.particles.set(newParticles);
  }
}