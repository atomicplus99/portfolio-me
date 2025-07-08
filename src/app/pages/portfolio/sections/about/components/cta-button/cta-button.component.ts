import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cta-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta-button.component.html',
  styleUrls: ['./cta-button.component.css']
})
export class CtaButtonComponent {
  @Input() text: string = 'Hablemos';
  @Input() email: string = '';
  @Input() subject: string = '';
  @Output() hoverChange = new EventEmitter<boolean>();

  handleClick(): void {
    window.open(`mailto:${this.email}?subject=${this.subject}`, '_blank');
  }
}