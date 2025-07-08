import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-bottom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-bottom.component.html',
  styleUrls: ['./footer-bottom.component.css']
})
export class FooterBottomComponent {
  @Input() brandName: string = '';
  @Input() version: string = '';
  @Input() currentYear: number = new Date().getFullYear();
}