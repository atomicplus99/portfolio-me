import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'header-nav-link',
  imports: [CommonModule],
  templateUrl: './header-nav-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavLinkComponent {

  label = input.required<string>();
  isVisible = input(false);
  delay = input('0s');
  linkClasses = input(`group relative cursor-pointer
     text-white text-sm font-semibold tracking-[0.3em]
     uppercase hover:text-blue-300 transition-all
     duration-800 ease-out`);
  
  linkClick = output<void>();

 }
