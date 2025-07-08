import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactMethod } from '../../interfaces/contact-interface';


@Component({
  selector: 'app-contact-methods',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-methods.component.html'
})
export class ContactMethodsComponent {
  @Input() methods: ContactMethod[] = [];
  @Output() methodClick = new EventEmitter<ContactMethod>();
  @Output() methodHover = new EventEmitter<string>();
}