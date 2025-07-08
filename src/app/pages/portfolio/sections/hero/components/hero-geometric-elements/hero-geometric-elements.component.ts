import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewportService } from '../../services/viewport.service';


@Component({
  selector: 'app-geometric-elements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-geometric-elements.component.html',
  styleUrls: ['./hero-geometric-elements.component.css']
})
export class GeometricElementsComponent {
  private readonly viewportService = inject(ViewportService);
  
  readonly showDesktopElements = this.viewportService.showDesktopElements;

  constructor() {}
}
