import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./loader-animated.component.html`,
  styleUrls: ['./loader-animated.component.css']
})
export class AnimatedLogoComponent {
  readonly text = input<string>('DUQUE');
  readonly subtitle = input<string>('');
  readonly isVisible = input<boolean>(false);
}