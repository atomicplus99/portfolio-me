import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-scroll-indicator.component.html',
  styleUrls: ['./hero-scroll-indicator.component.css']
})
export class ScrollIndicatorComponent {
  @Output() scrollClick = new EventEmitter<void>();

  onScrollClick(): void {
    this.scrollClick.emit();
  }
}