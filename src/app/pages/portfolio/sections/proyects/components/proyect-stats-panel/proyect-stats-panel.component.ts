import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceStats } from '../../interfaces/hologram.interface';


@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-stats-panel.component.html',
  styleUrls: ['./proyect-stats-panel.component.css']
})
export class StatsPanelComponent {
  @Input() isVisible = false;
  @Input() stats!: PerformanceStats;
  @Input() isMobile = false;
  @Input() isPerformanceMode = false;
}