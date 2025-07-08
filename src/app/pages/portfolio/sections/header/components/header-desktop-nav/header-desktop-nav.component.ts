import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HeaderNavLinkComponent } from '../header-nav-link/header-nav-link.component';
import { CommonModule } from '@angular/common';
import { NavigationItem } from '../../interfaces/header.interfaces';

@Component({
  selector: 'header-desktop-nav',
  imports: [HeaderNavLinkComponent, CommonModule],
  templateUrl: './header-desktop-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderDesktopNavComponent {

  items = input.required<NavigationItem[]>();
  isVisible = input(false);
  navClick = output<string>();

  trackById = (index: number, item: NavigationItem) => item.id;
}
