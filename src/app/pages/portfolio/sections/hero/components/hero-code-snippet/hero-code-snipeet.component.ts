import { Component, OnInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperService } from '../../services/developer.service';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-code-snipeet.component.html',
  styleUrls: ['./hero-code-snipeet.component.css']
})
export class CodeSnippetComponent implements OnInit, OnDestroy {
  private readonly developerService = inject(DeveloperService);
  private readonly viewportService = inject(ViewportService);
  
  private readonly currentCodeIndex = signal(0);
  private codeInterval?: number;

  readonly showDesktopElements = this.viewportService.showDesktopElements;
  readonly currentCode = computed(() => 
    this.developerService.snippets()[this.currentCodeIndex()]
  );

  constructor() {}

  ngOnInit(): void {
    if (this.showDesktopElements()) {
      this.startCodeRotation();
    }
  }

  ngOnDestroy(): void {
    if (this.codeInterval) {
      clearInterval(this.codeInterval);
    }
  }

  private startCodeRotation(): void {
    this.codeInterval = window.setInterval(() => {
      const snippets = this.developerService.snippets();
      this.currentCodeIndex.update(index => (index + 1) % snippets.length);
    }, 4500);
  }
}