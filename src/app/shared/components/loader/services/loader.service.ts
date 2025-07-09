import { Injectable, signal } from "@angular/core";
import { LoaderState } from "../interfaces/loader.interface";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly _state = signal<LoaderState>({
    isLoading: false,
    progress: 0,
    message: 'Iniciando...',
    showLogo: false,
    showProgress: false
  });

  readonly state = this._state.asReadonly();

  startLoading(): void {
    this._state.set({
      isLoading: true,
      progress: 0,
      message: 'Cargando...',
      showLogo: true,
      showProgress: true 
    });

    this.runOptimizedSequence();
  }

  private runOptimizedSequence(): void {
    // ✅ Secuencia más rápida
    const messages = [
      'Cargando...',
      'Casi listo...',
      'Completado!'
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 25 + 15; 
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => this.finishLoading(), 300); 
      }

      if (messageIndex < messages.length - 1 && progress > (messageIndex + 1) * 33) {
        messageIndex++;
      }

      this._state.update(state => ({
        ...state,
        progress,
        message: messages[messageIndex]
      }));
    }, 100); 
  }

  private finishLoading(): void {
    this._state.update(state => ({ ...state, isLoading: false }));
  }
}