import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-center.component.html',
  styleUrls: ['./footer-center.component.css']
})
export class FooterCenterComponent {
  @Input() techIcon: string = '';
  @Input() techBadge: string = '';
  @Input() location: string = '';
}