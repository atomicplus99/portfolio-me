import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticleData } from '../../interfaces/hologram.interface';

@Component({
  selector: 'app-floating-particles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-particles.component.html',
  styleUrls: ['./floating-particles.component.css']
})
export class FloatingParticlesComponent implements OnInit {
  
  @Input() isMobile = false;

  // Signal para las partículas - NOMBRE CORRECTO
  private readonly _particles = signal<ParticleData[]>([]);

  ngOnInit() {
    this.generateParticles();
  }

  private generateParticles() {
    const particleCount = this.isMobile ? 10 : 20;
    const colors = [
      'rgba(59, 130, 246, 0.2)',
      'rgba(139, 92, 246, 0.15)',
      'rgba(34, 197, 94, 0.15)',
      'rgba(168, 85, 247, 0.15)',
      'rgba(34, 211, 238, 0.2)'
    ];

    const newParticles: ParticleData[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      initialDelay: i * -2,
      color: colors[i % colors.length],
      animationDuration: 15 + (i % 10)
    }));

    this._particles.set(newParticles);
  }

  trackByParticle(index: number, particle: ParticleData): number {
    return particle.id;
  }

  // Getter público para acceder al signal desde el template
  get particles() {
    return this._particles;
  }
}