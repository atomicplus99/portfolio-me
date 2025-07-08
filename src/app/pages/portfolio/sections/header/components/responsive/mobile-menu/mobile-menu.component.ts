import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NavigationItem } from '../../../interfaces/header.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header-responsive-mobile-menu',
  imports: [CommonModule],
  templateUrl: './mobile-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {

  items = input.required<NavigationItem[]>();
  isOpen = input(false);
  navClick = output<string>();
  menuClose = output<void>();

  trackById = (index: number, item: NavigationItem) => item.id;

 }
