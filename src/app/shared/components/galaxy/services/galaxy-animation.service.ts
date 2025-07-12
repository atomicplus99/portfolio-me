import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GalaxyService } from './galaxy.service';
import { InteractionService } from './galaxy-interactor.service';


@Injectable()
export class AnimationService {
  private galaxyService!: GalaxyService;
  private interactionService!: InteractionService;
  private animationId!: number;
  private clock = new THREE.Clock();

  initialize(galaxyService: GalaxyService): void {
    this.galaxyService = galaxyService;
  }

  setInteractionService(interactionService: InteractionService): void {
    this.interactionService = interactionService;
  }

  startAnimation(): void {
    this.animate();
  }

  stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();
    const galaxy = this.galaxyService.getGalaxy();

    if (galaxy) {
      galaxy.rotation.y = elapsedTime * 0.10;

      if (this.interactionService) {
        const mouseTarget = this.interactionService.getMouseTarget();
        galaxy.rotation.x += (mouseTarget.y * 0.3 - (galaxy.rotation.x - 0.5)) * 0.02;
        galaxy.rotation.y += (mouseTarget.x * 0.4 - galaxy.rotation.y + elapsedTime * 0.01) * 0.02;
      }
    }

    const scene = this.galaxyService.getScene();
    const camera = this.galaxyService.getCamera();
    const renderer = this.galaxyService.getRenderer();

    renderer.render(scene, camera);
  }
}