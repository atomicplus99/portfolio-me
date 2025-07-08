import { Injectable, Renderer2, RendererFactory2, signal, computed } from '@angular/core';
import { ParticlePool, CursorPosition } from '../interfaces/cursor.interfaces';
import { CursorConfigService } from './cursor-config.service';

@Injectable({
  providedIn: 'root'
})
export class ParticlePoolService {
  private renderer: Renderer2;
  private particlePoolSignal = signal<ParticlePool[]>([]);
  private lastParticleTimeSignal = signal(0);

  activeParticlesCount = computed(() => 
    this.particlePoolSignal().filter(p => p.isActive).length
  );

  constructor(
    private rendererFactory: RendererFactory2,
    private configService: CursorConfigService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  initializePool(): void {
    const config = this.configService.config();
    const pool: ParticlePool[] = [];

    for (let i = 0; i < config.poolSize; i++) {
      const element = this.createParticleElement();
      pool.push({
        element,
        isActive: false,
        x: 0,
        y: 0,
        startTime: 0
      });
    }

    this.particlePoolSignal.set(pool);
  }

  private createParticleElement(): HTMLElement {
    const element = this.renderer.createElement('div');
    this.renderer.addClass(element, 'interference-particle');
    this.setParticleStyles(element);
    this.renderer.setStyle(element, 'display', 'none');
    this.renderer.appendChild(document.body, element);
    return element;
  }

  private setParticleStyles(element: HTMLElement): void {
    const zIndex = this.configService.getZIndexes().particles;
    
    this.renderer.setStyle(element, 'position', 'fixed');
    this.renderer.setStyle(element, 'z-index', zIndex);
    this.renderer.setStyle(element, 'pointer-events', 'none');
    this.renderer.setStyle(element, 'top', '0');
    this.renderer.setStyle(element, 'left', '0');
  }

  activateParticle(position: CursorPosition): boolean {
    const config = this.configService.config();
    const currentTime = Date.now();
    
    
    if (currentTime - this.lastParticleTimeSignal() < config.particleDelay) {
      return false;
    }

    
    if (this.activeParticlesCount() >= config.maxParticles) {
      return false;
    }

    const particle = this.getInactiveParticle();
    if (!particle) return false;

    this.configureParticle(particle, position, currentTime);
    this.lastParticleTimeSignal.set(currentTime);
    
    return true;
  }

  private getInactiveParticle(): ParticlePool | undefined {
    return this.particlePoolSignal().find(p => !p.isActive);
  }

  private configureParticle(particle: ParticlePool, position: CursorPosition, currentTime: number): void {
    const config = this.configService.config();
    
    particle.isActive = true;
    particle.x = position.x;
    particle.y = position.y;
    particle.startTime = currentTime;

    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    this.renderer.setStyle(particle.element, 'display', 'block');
    this.renderer.setStyle(particle.element, 'left', `${position.x + offsetX}px`);
    this.renderer.setStyle(particle.element, 'top', `${position.y + offsetY}px`);
    this.renderer.setStyle(particle.element, 'opacity', '0.5');
    this.renderer.setStyle(particle.element, 'transform', 'translate(-50%, -50%) scale(1)');

    
  }

  private deactivateParticle(particle: ParticlePool): void {
    particle.isActive = false;
    this.renderer.setStyle(particle.element, 'display', 'none');
  }

  createBurst(position: CursorPosition): void {
    const config = this.configService.config();
    
    for (let i = 0; i < config.burstParticles; i++) {
      setTimeout(() => {
        const angle = (i / config.burstParticles) * Math.PI * 2;
        const distance = 20;
        const burstPosition: CursorPosition = {
          x: position.x + Math.cos(angle) * distance,
          y: position.y + Math.sin(angle) * distance
        };
        this.activateParticle(burstPosition);
      }, i * 100);
    }
  }

  createDefensivePattern(position: CursorPosition): void {
    const config = this.configService.config();
    
    for (let i = 0; i < config.defensiveParticles; i++) {
      setTimeout(() => {
        const angle = (i / config.defensiveParticles) * Math.PI * 2;
        const defensivePosition: CursorPosition = {
          x: position.x + Math.cos(angle) * 30,
          y: position.y + Math.sin(angle) * 30
        };
        this.activateParticle(defensivePosition);
      }, i * 80);
    }
  }

  animateActiveParticles(): void {
    const config = this.configService.config();
    const currentTime = Date.now();
    
    this.particlePoolSignal().forEach(particle => {
      if (!particle.isActive) return;
      
      const age = currentTime - particle.startTime;
      
      if (age >= config.particleLifetime) {
        this.deactivateParticle(particle);
        return;
      }

      const lifeRatio = Math.max(0, 1 - (age / config.particleLifetime));
      
      this.renderer.setStyle(particle.element, 'opacity', `${lifeRatio * 0.5}`);
      this.renderer.setStyle(particle.element, 'transform', 
        `translate(-50%, -50%) scale(${0.5 + lifeRatio * 0.5})`);
    });
  }

  destroyPool(): void {
    this.particlePoolSignal().forEach(particle => {
      if (particle.element.parentNode) {
        this.renderer.removeChild(document.body, particle.element);
      }
    });
    this.particlePoolSignal.set([]);
  }

  getPoolStatus() {
    const pool = this.particlePoolSignal();
    return {
      totalParticles: pool.length,
      activeParticles: this.activeParticlesCount(),
      inactiveParticles: pool.length - this.activeParticlesCount()
    };
  }
}