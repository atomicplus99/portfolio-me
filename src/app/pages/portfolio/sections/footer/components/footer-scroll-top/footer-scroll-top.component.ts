import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-scroll-top.component.html',
  styleUrls: ['./footer-scroll-top.component.css']
})
export class ScrollToTopComponent {
  @Output() scrollClick = new EventEmitter<void>();
}
