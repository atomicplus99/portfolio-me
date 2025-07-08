import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-progress-bar.component.html',
  styleUrls: ['./loader-progress-bar.component.css']
})
export class ProgressBarComponent {
  readonly progress = input<number>(0);
  readonly message = input<string>('Cargando...');
  readonly isVisible = input<boolean>(false);
  readonly showText = input<boolean>(true);
}
