import { CommonModule } from "@angular/common";
import { Component, input, OnInit, OnDestroy, signal } from "@angular/core";

export interface NebulaLayer {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  colorIndex: number;
  layer: number;
  animationDelay: number;
}

@Component({
  selector: 'app-loading-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="galaxy-nebula" *ngIf="shouldRender()">
      
      <!-- Main nebula structure -->
      <div class="nebula-core"></div>
      
      <!-- Layered nebula clouds -->
      <div class="nebula-layer"
           *ngFor="let layer of layers(); trackBy: trackByLayer"
           [class]="'layer-' + layer.layer"
           [style.left.%]="layer.x"
           [style.top.%]="layer.y"
           [style.width.px]="layer.width"
           [style.height.px]="layer.height"
           [style.transform]="'rotate(' + layer.rotation + 'deg)'"
           [style.opacity]="layer.opacity"
           [style.animation-delay.s]="layer.animationDelay"
           [style.--layer-color]="galacticColors[layer.colorIndex]">
      </div>
      
      <!-- Dust lanes -->
      <div class="nebula-dust"
           *ngFor="let dust of dustLanes(); trackBy: trackByDust"
           [style.left.%]="dust.x"
           [style.top.%]="dust.y"
           [style.width.px]="dust.width"
           [style.height.px]="dust.height"
           [style.transform]="'rotate(' + dust.rotation + 'deg)'">
      </div>
      
      <!-- Star field -->
      <div class="nebula-stars"></div>
      
      <!-- Bright center -->
      <div class="nebula-center"></div>
      
    </div>
  `,
  styleUrls: ['./loading-particles.component.css']
})
export class LoadingParticlesComponent implements OnInit, OnDestroy {
  readonly count = input<number>(6);
  
  readonly layers = signal<NebulaLayer[]>([]);
  readonly dustLanes = signal<NebulaLayer[]>([]);
  readonly shouldRender = signal(false);

  // COLORES MASCULINOS - Azules profundos, grises, blancos
  galacticColors = [
    'rgba(30, 58, 138, 0.8)',     // Azul marino profundo
    'rgba(37, 99, 235, 0.9)',     // Azul real intenso
    'rgba(59, 130, 246, 0.7)',    // Azul brillante
    'rgba(71, 85, 105, 0.8)',     // Gris azulado
    'rgba(100, 116, 139, 0.6)',   // Gris acero
    'rgba(148, 163, 184, 0.5)'    // Gris claro
  ];

  ngOnInit(): void {
    this.generateGalaxyLayers();
    this.generateDustLanes();
    this.shouldRender.set(true);
  }

  ngOnDestroy(): void {
    this.layers.set([]);
    this.dustLanes.set([]);
    this.shouldRender.set(false);
  }

  private generateGalaxyLayers(): void {
    const layerCount = this.count();
    const newLayers: NebulaLayer[] = [];
    
    for (let i = 0; i < layerCount; i++) {
      newLayers.push({
        x: 20 + Math.random() * 60,
        y: 15 + Math.random() * 70,
        width: 300 + Math.random() * 600,
        height: 200 + Math.random() * 400,
        rotation: Math.random() * 360,
        opacity: 0.3 + Math.random() * 0.5,
        colorIndex: Math.floor(Math.random() * this.galacticColors.length),
        layer: i % 3,
        animationDelay: Math.random() * 10
      });
    }
    
    this.layers.set(newLayers);
  }

  private generateDustLanes(): void {
    const dustCount = 2;
    const newDust: NebulaLayer[] = [];
    
    for (let i = 0; i < dustCount; i++) {
      newDust.push({
        x: 30 + Math.random() * 40,
        y: 25 + Math.random() * 50,
        width: 200 + Math.random() * 400,
        height: 100 + Math.random() * 200,
        rotation: Math.random() * 180,
        opacity: 0.6 + Math.random() * 0.3,
        colorIndex: 0,
        layer: 0,
        animationDelay: 0
      });
    }
    
    this.dustLanes.set(newDust);
  }

  trackByLayer(index: number): number {
    return index;
  }

  trackByDust(index: number): number {
    return index;
  }
}
