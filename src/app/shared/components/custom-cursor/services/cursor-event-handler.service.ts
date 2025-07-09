import { Injectable } from '@angular/core';
import { CursorPosition } from '../interfaces/cursor.interfaces';
import { AnimationService } from './animation.service';

import { TacticalElementsService } from './tacticals-elements.service';
import { CursorPerformanceService } from './cursor-perfomance.service';


@Injectable()
export class CursorEventHandlerService {

  constructor(
    private animationService: AnimationService,
    private tacticalElementsService: TacticalElementsService,
    private performanceService: CursorPerformanceService
  ) {}

  // MOUSE MOVE
  handleMouseMove(event: MouseEvent): void {
    // Throttling check
    if (this.performanceService.shouldThrottleMouseMove()) {
      return;
    }

    this.performanceService.runOutsideAngular(() => {
      const position: CursorPosition = {
        x: event.clientX,
        y: event.clientY
      };

      // Detectar si está sobre header
      const target = event.target as Element;
      const overHeader = this.performanceService.isMouseOverHeader(target);
      this.performanceService.updateHeaderState(overHeader);

      // Actualizar posición del cursor
      this.animationService.updateCursorPosition(position);

    });
  }

  // MOUSE DOWN
  handleMouseDown(event: MouseEvent): void {
    this.animationService.updateFiringState(true);
    this.tacticalElementsService.setClickState(true);
    
    const position: CursorPosition = {
      x: event.clientX,
      y: event.clientY
    };


  }

  // MOUSE UP
  handleMouseUp(): void {
    this.animationService.updateFiringState(false);
    this.tacticalElementsService.setClickState(false);
  }

  // MOUSE OVER
  handleMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && this.tacticalElementsService.isClickableElement(target)) {
      this.handleTargetingStart();
    }
  }

  // MOUSE OUT
  handleMouseOut(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && this.tacticalElementsService.isClickableElement(target)) {
      this.handleTargetingEnd();
    }
  }

  // CONTEXT MENU
  handleContextMenu(event: MouseEvent): void {
    event.preventDefault();
    
    // No crear patrón defensivo si está sobre header
    if (this.performanceService.isOverHeader) return;
    
    const position: CursorPosition = {
      x: event.clientX,
      y: event.clientY
    };

   
  }

  // SCROLL
  handleScroll(): void {
    this.performanceService.handleScrollStart();
  }

  // TARGETING
  private handleTargetingStart(): void {
    this.animationService.updateTargetingState(true);
    this.tacticalElementsService.setHoverState(true);
    
    // Configuración menos agresiva si está sobre header
    if (this.performanceService.isOverHeader) {
      this.animationService.updateParticleDelay(600);
      this.animationService.updateCornerOffset(15);
    } else {
      this.animationService.updateParticleDelay(120);
      this.animationService.updateCornerOffset(30);
    }
  }

  private handleTargetingEnd(): void {
    this.animationService.updateTargetingState(false);
    this.tacticalElementsService.setHoverState(false);
    
    // Restaurar delay según contexto
    const baseDelay = this.performanceService.isOverHeader ? 400 : 200;
    this.animationService.updateParticleDelay(baseDelay);
  }
}