import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatData } from '../../interfaces/about.interface';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-grid.component.html'
})
export class StatsGridComponent {
  @Input() stats: StatData[] = [];
}