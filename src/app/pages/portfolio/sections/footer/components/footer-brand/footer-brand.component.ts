import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-brand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-brand.component.html',
  styleUrls: ['./footer-brand.component.css']
})
export class FooterBrandComponent {
  @Input() name: string = '';
  @Input() title: string = '';
}