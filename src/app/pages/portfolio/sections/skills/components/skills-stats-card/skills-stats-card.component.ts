import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsInfo } from '../../interfaces/skill.interface';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-stats-card.component.html',  // ✅ CORRECTO
  styleUrls: ['./skills-stats-card.component.css']   // ✅ CORRECTO
})
export class StatsCardsComponent {
  @Input() stats!: StatsInfo;

  getLanguageLevelClass(levelColor: string): string {
    const colorMap: { [key: string]: string } = {
      green: 'bg-green-500/20 text-green-400',
      blue: 'bg-blue-500/20 text-blue-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      red: 'bg-red-500/20 text-red-400'
    };
    return colorMap[levelColor] || 'bg-gray-500/20 text-gray-400';
  }

  getAvailabilityClass(statusColor: string): string {
    const colorMap: { [key: string]: string } = {
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      red: 'text-red-400'
    };
    return colorMap[statusColor] || 'text-gray-400';
  }
}