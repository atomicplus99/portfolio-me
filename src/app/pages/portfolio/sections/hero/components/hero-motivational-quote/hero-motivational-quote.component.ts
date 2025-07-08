import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperService } from '../../services/developer.service';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'app-motivational-quote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-motivational-quote.component.html',
  styleUrls: ['./hero-motivational-quote.component.css']
})
export class MotivationalQuoteComponent {
  private readonly developerService = inject(DeveloperService);
  private readonly viewportService = inject(ViewportService);

  readonly showDesktopElements = this.viewportService.showDesktopElements;
  readonly quote = this.developerService.motivationalQuote;

  constructor() {}
}