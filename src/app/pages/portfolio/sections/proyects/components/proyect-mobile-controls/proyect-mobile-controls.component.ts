import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-mobile-controls.component.html',
  styleUrls: ['./proyect-mobile-controls.component.css']
})
export class MobileControlsComponent {
  @Input() isMobile = false;
  @Input() isProjectSelected = false;
  @Input() isPerformanceMode = false;

  @Output() resetView = new EventEmitter<void>();
  @Output() togglePerformanceMode = new EventEmitter<void>();
  @Output() scrollModeChanged = new EventEmitter<boolean>();
  @Output() mobileSizeChanged = new EventEmitter<boolean>();

  // 🎮 SEÑALES REACTIVAS
  public readonly scrollMode = signal(false);
  public readonly mobileCompactMode = signal(false);
  public readonly showScrollHint = signal(false);

  toggleScrollMode(): void {
    const newScrollMode = !this.scrollMode();
    this.scrollMode.set(newScrollMode);
    this.scrollModeChanged.emit(newScrollMode);

    // Mostrar hint la primera vez
    if (newScrollMode && !this.showScrollHint()) {
      this.showScrollHint.set(true);
      // Auto-ocultar después de 3 segundos
      setTimeout(() => this.showScrollHint.set(false), 3000);
    }
  }

  toggleMobileSize(): void {
    const newCompactMode = !this.mobileCompactMode();
    this.mobileCompactMode.set(newCompactMode);
    this.mobileSizeChanged.emit(newCompactMode);
  }

  onResetView(): void {
    if (!this.scrollMode()) {
      this.resetView.emit();
    }
  }

  onTogglePerformanceMode(): void {
    this.togglePerformanceMode.emit();
  }

  hideScrollHint(): void {
    this.showScrollHint.set(false);
  }

  // 📱 MÉTODO PARA OBTENER ESTADO SCROLL (para uso externo)
  getScrollMode(): boolean {
    return this.scrollMode();
  }

  getMobileCompactMode(): boolean {
    return this.mobileCompactMode();
  }
}