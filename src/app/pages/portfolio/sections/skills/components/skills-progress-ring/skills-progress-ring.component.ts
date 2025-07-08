import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-progress-ring.component.html',
  styleUrls: ['./skills-progress-ring.component.css']
})
export class ProgressRingComponent {
  @Input() level = 0;
  @Input() color = '#3b82f6';
  @Input() isVisible = false;

  getStrokeDashArray(radius: number): number {
    return 2 * Math.PI * radius;
  }

  getStrokeDashOffset(radius: number, level: number, isVisible: boolean): number {
    if (!isVisible) return 2 * Math.PI * radius;
    return 2 * Math.PI * radius * (1 - level / 100);
  }
}
