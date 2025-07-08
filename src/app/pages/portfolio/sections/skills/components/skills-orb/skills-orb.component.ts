import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../interfaces/skill.interface';
import { ProgressRingComponent } from '../skills-progress-ring/skills-progress-ring.component';


@Component({
  selector: 'app-skill-orb',
  standalone: true,
  imports: [CommonModule, ProgressRingComponent],
  templateUrl: './skills-orb.component.html',
  styleUrls: ['./skills-orb.component.css']
})
export class SkillOrbComponent {
  @Input() skill!: Skill;
  @Input() isVisible = false;
  @Input() animationDelay = 0;

  @Output() imageError = new EventEmitter<Event>();

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'block';
      fallback.classList.remove('hidden');
    }
    this.imageError.emit(event);
  }
}