import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HeaderNavLinkComponent } from '../header-nav-link/header-nav-link.component';
import { HeaderBurgerButtonComponent } from '../header-burger-button/header-burger-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header-right-nav',
  imports: [HeaderNavLinkComponent, HeaderBurgerButtonComponent, CommonModule],
  templateUrl: './header-right-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderRightNavComponent { 

  isVisible = input(false);
  menuOpen = input(false);
  contactClick = output<void>();
  menuToggle = output<void>();
}
