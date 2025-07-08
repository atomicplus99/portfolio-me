import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileData } from '../../interfaces/about.interface';


@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html'
})
export class ProfileCardComponent {
  @Input() profile!: ProfileData;
  @Output() imageError = new EventEmitter<Event>();

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }
}