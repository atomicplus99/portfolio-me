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
  scrollToNextSection(): void {
    // Scroll simple hacia abajo una pantalla
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
}