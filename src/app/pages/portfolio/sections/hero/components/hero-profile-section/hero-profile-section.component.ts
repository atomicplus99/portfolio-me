import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperService } from '../../services/developer.service';
import { ViewportService } from '../../services/viewport.service';
import { ButtonComponent } from '../hero-button/hero-button.component';


@Component({
  selector: 'app-profile-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero-profile-section.component.html',
  styleUrls: ['./hero-profile-section.component.css']
})
export class ProfileSectionComponent {
  private readonly developerService = inject(DeveloperService);
  private readonly viewportService = inject(ViewportService);

  readonly developer = this.developerService.developerInfo;
  readonly isMobile = this.viewportService.isMobile;

  constructor() {}

  onViewCV(): void {
    this.developerService.openCV();
  }
}