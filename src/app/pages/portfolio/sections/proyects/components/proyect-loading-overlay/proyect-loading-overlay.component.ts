import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-loading-overlay.component.html',
  styleUrls: ['./proyect-loading-overlay.component.css']
})
export class LoadingOverlayComponent {
  @Input() isVisible = false;
  @Input() loadingText = 'Cargando proyectos...';
  @Input() subText = 'Inicializando experiencia 3D...';
}