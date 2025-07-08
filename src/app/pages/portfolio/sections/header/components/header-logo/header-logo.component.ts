import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'header-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderLogoComponent {

  text = input('DUQUE');
  isVisible = input(false);
  logoClick = output<void>();

 }
