// projects/components/hero-header/hero-header.component.ts
import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStats } from '../../interfaces/proyect.interface';


@Component({
  selector: 'app-hero-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-hero-header.component.html',
  styleUrls: ['./proyect-hero-header.component.css']
})
export class HeroHeaderComponent {
  @Input() stats: ProjectStats = {
    totalProjects: 0,
    onlineProjects: 0,
    technologiesUsed: 0
  };
}
