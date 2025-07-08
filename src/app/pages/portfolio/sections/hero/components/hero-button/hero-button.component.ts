import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-button.component.html',
  styleUrls: ['./hero-button.component.css']
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() showIcon: boolean = true;
  @Input() additionalClasses: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}