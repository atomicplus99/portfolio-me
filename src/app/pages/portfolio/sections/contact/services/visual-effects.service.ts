import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TechParticle } from '../interfaces/contact-interface';


@Injectable({
  providedIn: 'root'
})
export class VisualEffectsService {
  private particlesSubject = new BehaviorSubject<TechParticle[]>([]);
  public particles$ = this.particlesSubject.asObservable();
  
  private effectsInterval?: number;

  initializeTechEffects(particleCount: number = 12): void {
    const particles: TechParticle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5
      });
    }
    
    this.particlesSubject.next(particles);
  }

  startTechEffects(): void {
    this.effectsInterval = window.setInterval(() => {
      const currentParticles = this.particlesSubject.value;
      
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * currentParticles.length);
        currentParticles[randomIndex].x = Math.random() * 100;
        currentParticles[randomIndex].y = Math.random() * 100;
      }
      
      this.particlesSubject.next([...currentParticles]);
    }, 4000);
  }

  stopTechEffects(): void {
    if (this.effectsInterval) {
      clearInterval(this.effectsInterval);
      this.effectsInterval = undefined;
    }
  }

  cleanup(): void {
    this.stopTechEffects();
    this.particlesSubject.next([]);
  }
}