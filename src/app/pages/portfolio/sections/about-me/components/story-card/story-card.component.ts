import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorySection } from '../../interfaces/about.interface';


@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-card.component.html'
})
export class StoryCardComponent {
  @Input() story!: StorySection;
}