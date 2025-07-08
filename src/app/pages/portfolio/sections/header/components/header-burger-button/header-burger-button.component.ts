import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'header-burger-button',
  imports: [CommonModule],
  templateUrl: './header-burger-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderBurgerButtonComponent {

  isVisible = input(false);
  isActive = input(false);
  delay = input('0.7s');
  toggle = output<void>();

 }
