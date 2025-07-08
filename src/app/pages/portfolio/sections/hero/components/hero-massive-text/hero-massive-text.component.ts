import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'app-massive-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-massive-text.component.html',
  styleUrls: ['./hero-massive-text.component.css']
})
export class MassiveTextComponent {
  private readonly viewportService = inject(ViewportService);
  
  readonly showDesktopElements = this.viewportService.showDesktopElements;

  constructor() {}
}