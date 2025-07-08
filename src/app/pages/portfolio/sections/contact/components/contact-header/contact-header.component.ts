import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-header.component.html'
})
export class ContactHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() status: { text: string; available: boolean } = { text: '', available: true };
}
