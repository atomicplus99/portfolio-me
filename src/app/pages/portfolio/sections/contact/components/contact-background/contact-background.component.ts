import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechParticle } from '../../interfaces/contact-interface';


@Component({
  selector: 'app-tech-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-background.component.html'
})
export class TechBackgroundComponent {
  @Input() particles: TechParticle[] = [];
}