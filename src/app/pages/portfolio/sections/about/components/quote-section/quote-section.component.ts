import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quote-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-section.component.html',
  styleUrl: './quote-section.component.css'
})
export class QuoteSectionComponent {
  @Input() titleLines: string[] = [];
  @Input() subtitle: string = '';

  getLineClass(index: number): string {
    const classes = ['text-slate-100', 'text-blue-400'];
    return index > 0 ? classes[Math.min(index - 1, classes.length - 1)] : '';
  }
}