import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../interfaces/skill.interface';
import { SkillOrbComponent } from '../skills-orb/skills-orb.component';


@Component({
  selector: 'app-skills-grid',
  standalone: true,
  imports: [CommonModule, SkillOrbComponent],
  template: `
    <div class="relative">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        <app-skill-orb
          *ngFor="let skill of skills; let i = index"
          [skill]="skill"
          [isVisible]="visibleCards[i]"
          [animationDelay]="i * 0.2"
          (imageError)="onImageError($event)">
        </app-skill-orb>
      </div>
    </div>
  `,
  styles: [`
    .grid {
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.5rem;
      }
    }
  `]
})
export class SkillsGridComponent {
  @Input() skills: Skill[] = [];
  @Input() visibleCards: boolean[] = [];

  onImageError(event: Event) {
  }
}