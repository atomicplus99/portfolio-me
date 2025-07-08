import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-about.component.html'
})
export class SectionHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() titleVisible: boolean = false;
  @Input() subtitleVisible: boolean = false;
}