import { Injectable, signal } from '@angular/core';
import { LoaderState } from '../interfaces/loader.interface';


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
      message: 'Iniciando...',
      showLogo: false,
      showProgress: false
    });
    
    this.runLoadingSequence();
  }

  private runLoadingSequence(): void {
    // Mostrar logo después de 500ms
    setTimeout(() => {
      this._state.update(state => ({ ...state, showLogo: true }));
    }, 500);

    // Mostrar progreso después de 1s
    setTimeout(() => {
      this._state.update(state => ({ ...state, showProgress: true }));
      this.animateProgress();
    }, 1000);
  }

  private animateProgress(): void {
    const messages = [
      'Cargando recursos...',
      'Inicializando componentes...',
      'Preparando interfaz...',
      'Casi listo...',
      'Completado!'
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => this.finishLoading(), 800);
      }

      if (messageIndex < messages.length - 1 && progress > (messageIndex + 1) * 20) {
        messageIndex++;
      }

      this._state.update(state => ({
        ...state,
        progress,
        message: messages[messageIndex]
      }));
    }, 200);
  }

  private finishLoading(): void {
    this._state.update(state => ({ ...state, isLoading: false }));
  }
}