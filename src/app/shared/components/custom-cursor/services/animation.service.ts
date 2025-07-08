import { Injectable, signal } from '@angular/core';
import { AnimationState, CursorPosition } from '../interfaces/cursor.interfaces';
import { CursorConfigService } from './cursor-config.service';

import { ParticlePoolService } from './particle-pool.service';
import { TacticalElementsService } from './tacticals-elements.service';


@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private animationId: number | null = null;
  private isRunningSignal = signal(false);
  
  private animationStateSignal = signal<AnimationState>({
    cursorPosition: { x: 0, y: 0 },
    radarPosition: { x: 0, y: 0 },
    cornerPositions: [],
    isTargeting: false,
    isFiring: false
  });

  get isRunning() {
    return this.isRunningSignal.asReadonly();
  }

  get animationState() {
    return this.animationStateSignal.asReadonly();
  }

  constructor(
    private configService: CursorConfigService,
    private tacticalElementsService: TacticalElementsService,
    private particlePoolService: ParticlePoolService
  ) {}

  startAnimation(): void {
    if (this.isRunningSignal()) return;
    
    this.isRunningSignal.set(true);
    this.animate();
  }

  stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunningSignal.set(false);
  }

  updateCursorPosition(position: CursorPosition): void {
    this.animationStateSignal.update(state => ({
      ...state,
      cursorPosition: position
    }));
  }

  updateTargetingState(isTargeting: boolean): void {
    this.animationStateSignal.update(state => ({
      ...state,
      isTargeting
    }));
  }

  updateFiringState(isFiring: boolean): void {
    this.animationStateSignal.update(state => ({
      ...state,
      isFiring
    }));
  }

  private animate(): void {
    if (!this.isRunningSignal()) return;

    this.updateAnimationFrame();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private updateAnimationFrame(): void {
    const state = this.animationStateSignal();
    const config = this.configService.config();

    
    const newRadarPosition = this.calculateRadarPosition(state, config.radarLerp);
    
    this.animationStateSignal.update(currentState => ({
      ...currentState,
      radarPosition: newRadarPosition
    }));

    
    this.tacticalElementsService.updateReticlePosition(state.cursorPosition);
    this.tacticalElementsService.updateRadarPosition(newRadarPosition);
    this.tacticalElementsService.updateCornerPositions(state.cursorPosition);

    
    this.particlePoolService.animateActiveParticles();
  }

  private calculateRadarPosition(state: AnimationState, lerpFactor: number): CursorPosition {
    return {
      x: state.radarPosition.x + (state.cursorPosition.x - state.radarPosition.x) * lerpFactor,
      y: state.radarPosition.y + (state.cursorPosition.y - state.radarPosition.y) * lerpFactor
    };
  }

  

  updateParticleDelay(delay: number): void {
    this.configService.updateConfig({ particleDelay: delay });
  }

  performSmoothTransition(
    fromPosition: CursorPosition, 
    toPosition: CursorPosition, 
    duration: number = 300
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const smoothStep = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const interpolatedPosition: CursorPosition = {
          x: fromPosition.x + (toPosition.x - fromPosition.x) * easeProgress,
          y: fromPosition.y + (toPosition.y - fromPosition.y) * easeProgress
        };
        
        this.updateCursorPosition(interpolatedPosition);
        
        if (progress < 1) {
          requestAnimationFrame(smoothStep);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(smoothStep);
    });
  }

  updateCornerOffset(offset: number): void {
    this.configService.updateConfig({ cornerOffset: offset });
  }

  optimizeForPerformance(): void {
    this.configService.enableOptimizedMode();
  }

  resetPerformanceSettings(): void {
    this.configService.disableOptimizedMode();
  }
}