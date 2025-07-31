import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-mobile-controls.component.html',
  styleUrls: ['./proyect-mobile-controls.component.css']
})
export class MobileControlsComponent implements OnInit {
  @Input() isMobile = false;
  @Input() isProjectSelected = false;

  @Output() scrollModeChanged = new EventEmitter<boolean>();

  // 🎮 SEÑALES REACTIVAS
  public readonly scrollMode = signal(true); // Siempre en modo scroll por defecto
  public readonly showScrollHint = signal(false);

  ngOnInit(): void {
    // En móvil, siempre activar modo scroll al inicializar
    if (this.isMobile) {
      this.activateScrollMode();
    }
  }

  // ✅ NUEVO: Activar modo scroll automáticamente cuando se selecciona proyecto
  ngOnChanges(): void {
    if (this.isMobile && !this.scrollMode()) {
      // Si no está en modo scroll, activarlo
      this.activateScrollMode();
    }
  }

  // ✅ NUEVO: Método para activar modo scroll
  private activateScrollMode(): void {
    this.scrollMode.set(true);
    this.scrollModeChanged.emit(true);
    
    // Mostrar hint
    this.showScrollHint.set(true);
    setTimeout(() => this.showScrollHint.set(false), 3000);
  }

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

  hideScrollHint(): void {
    this.showScrollHint.set(false);
  }

  // 📱 MÉTODO PARA OBTENER ESTADO SCROLL (para uso externo)
  getScrollMode(): boolean {
    return this.scrollMode();
  }
}