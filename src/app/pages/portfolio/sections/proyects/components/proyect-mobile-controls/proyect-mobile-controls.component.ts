import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-mobile-controls.component.html',
  styleUrls: ['./proyect-mobile-controls.component.css']
})
export class MobileControlsComponent {
  @Input() isMobile = false;
  @Input() isProjectSelected = false;
  @Input() isPerformanceMode = false;
  
  @Output() resetView = new EventEmitter<void>();
  @Output() togglePerformanceMode = new EventEmitter<void>();

  onResetView() {
    this.resetView.emit();
  }

  onTogglePerformanceMode() {
    this.togglePerformanceMode.emit();
  }
}