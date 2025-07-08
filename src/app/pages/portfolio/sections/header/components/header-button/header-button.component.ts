import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'header-button',
  imports: [CommonModule],
  templateUrl: './header-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderButtonComponent {

  isVisible = input(false);
  delay = input('0.6s');

 }
