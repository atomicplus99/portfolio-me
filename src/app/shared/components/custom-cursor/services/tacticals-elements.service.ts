import { Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';
import { TacticalElements, CursorPosition } from '../interfaces/cursor.interfaces';
import { CursorConfigService } from './cursor-config.service';


@Injectable({
  providedIn: 'root'
})
export class TacticalElementsService {
  private renderer: Renderer2;
  private elementsSignal = signal<TacticalElements | null>(null);
  private cornerPositionsSignal = signal<CursorPosition[]>([]);

  constructor(
    private rendererFactory: RendererFactory2,
    private configService: CursorConfigService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  createElement(): void {
    const config = this.configService.config();
    const zIndexes = this.configService.getZIndexes();

    const reticle = this.createReticle(zIndexes.reticle);
    const corners = this.createCorners(config.numCorners, zIndexes.corners);
    const radar = this.createRadar(zIndexes.radar);

    this.elementsSignal.set({ reticle, corners, radar });
    this.initializeCornerPositions(config.numCorners);
  }

  private createReticle(zIndex: string): HTMLElement {
    const reticle = this.renderer.createElement('div');
    this.renderer.addClass(reticle, 'tactical-reticle');
    this.setBaseElementStyles(reticle, zIndex);
    this.renderer.appendChild(document.body, reticle);
    return reticle;
  }

  private createCorners(numCorners: number, zIndex: string): HTMLElement[] {
    const corners: HTMLElement[] = [];
    
    for (let i = 0; i < numCorners; i++) {
      const corner = this.renderer.createElement('div');
      this.renderer.addClass(corner, 'tactical-corner');
      
      if (i === 0) {
        this.renderer.addClass(corner, 'top-left');
      } else if (i === 1) {
        this.renderer.addClass(corner, 'top-right');
      }
      
      this.setBaseElementStyles(corner, zIndex);
      this.renderer.appendChild(document.body, corner);
      corners.push(corner);
    }
    
    return corners;
  }

  private createRadar(zIndex: string): HTMLElement {
    const radar = this.renderer.createElement('div');
    this.renderer.addClass(radar, 'tactical-radar');
    this.setBaseElementStyles(radar, zIndex);
    this.renderer.appendChild(document.body, radar);
    return radar;
  }

  private setBaseElementStyles(element: HTMLElement, zIndex: string): void {
    this.renderer.setStyle(element, 'position', 'fixed');
    this.renderer.setStyle(element, 'z-index', zIndex);
    this.renderer.setStyle(element, 'pointer-events', 'none');
    this.renderer.setStyle(element, 'top', '0');
    this.renderer.setStyle(element, 'left', '0');
  }

  private initializeCornerPositions(numCorners: number): void {
    const positions: CursorPosition[] = [];
    for (let i = 0; i < numCorners; i++) {
      positions.push({ x: 0, y: 0 });
    }
    this.cornerPositionsSignal.set(positions);
  }

  updateReticlePosition(position: CursorPosition): void {
    const elements = this.elementsSignal();
    if (!elements?.reticle) return;

    this.renderer.setStyle(elements.reticle, 'left', `${position.x}px`);
    this.renderer.setStyle(elements.reticle, 'top', `${position.y}px`);
  }

  updateRadarPosition(position: CursorPosition): void {
    const elements = this.elementsSignal();
    if (!elements?.radar) return;

    this.renderer.setStyle(elements.radar, 'left', `${position.x}px`);
    this.renderer.setStyle(elements.radar, 'top', `${position.y}px`);
  }

  updateCornerPositions(cursorPosition: CursorPosition): void {
    const elements = this.elementsSignal();
    const config = this.configService.config();
    
    if (!elements?.corners.length) return;

    const targetPositions = this.calculateCornerPositions(cursorPosition, config.cornerOffset);
    const currentPositions = this.cornerPositionsSignal();

    const newPositions = currentPositions.map((current, index) => {
      const target = targetPositions[index];
      return {
        x: current.x + (target.x - current.x) * config.cornerLerp,
        y: current.y + (target.y - current.y) * config.cornerLerp
      };
    });

    this.cornerPositionsSignal.set(newPositions);

    
    elements.corners.forEach((corner, index) => {
      const pos = newPositions[index];
      this.renderer.setStyle(corner, 'left', `${pos.x}px`);
      this.renderer.setStyle(corner, 'top', `${pos.y}px`);
    });
  }

  private calculateCornerPositions(cursor: CursorPosition, offset: number): CursorPosition[] {
    return [
      { x: cursor.x - offset, y: cursor.y - offset }, // top-left
      { x: cursor.x + offset, y: cursor.y - offset }  // top-right
    ];
  }

  setHoverState(isHover: boolean): void {
    const elements = this.elementsSignal();
    if (!elements) return;

    const method = isHover ? 'addClass' : 'removeClass';
    
    this.renderer[method](elements.reticle, 'hover');
    elements.corners.forEach(corner => {
      this.renderer[method](corner, 'hover');
    });
  }

  setClickState(isClicked: boolean): void {
    const elements = this.elementsSignal();
    if (!elements) return;

    const method = isClicked ? 'addClass' : 'removeClass';
    
    this.renderer[method](elements.reticle, 'clicked');
    this.renderer[method](elements.radar, 'clicked');
    elements.corners.forEach(corner => {
      this.renderer[method](corner, 'clicked');
    });
  }

  isClickableElement(element: HTMLElement): boolean {
    let currentElement: HTMLElement | null = element;
    
    while (currentElement && currentElement !== document.body) {
      if (this.checkElementClickability(currentElement)) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    
    return false;
  }

  private checkElementClickability(element: HTMLElement): boolean {
    const clickableTags = ['A', 'BUTTON', 'INPUT'];
    const clickableClasses = ['clickable', 'control-button'];
    const clickableAttributes = ['tabindex'];
    const clickableRoles = ['button'];

    
    if (clickableTags.includes(element.tagName)) return true;
    
    
    if (clickableClasses.some(cls => element.classList.contains(cls))) return true;
    
    
    if (clickableAttributes.some(attr => element.hasAttribute(attr))) return true;
    
    
    if (clickableRoles.includes(element.getAttribute('role') || '')) return true;
    
    if (getComputedStyle(element).cursor === 'pointer') return true;

    return false;
  }

  destroyElements(): void {
    const elements = this.elementsSignal();
    if (!elements) return;

    const allElements = [elements.reticle, elements.radar, ...elements.corners];
    allElements.forEach(element => {
      if (element?.parentNode) {
        this.renderer.removeChild(document.body, element);
      }
    });

    this.elementsSignal.set(null);
  }

  getElements() {
    return this.elementsSignal.asReadonly();
  }

  
}