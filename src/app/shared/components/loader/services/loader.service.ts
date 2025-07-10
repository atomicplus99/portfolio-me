import { Injectable, signal } from '@angular/core';

export interface LoaderState {
  isLoading: boolean;
  progress: number;
  message: string;
  showLogo: boolean;
  showProgress: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  private loaderState = signal<LoaderState>({
    isLoading: false,
    progress: 0,
    message: 'Inicializando sistema...',
    showLogo: false,
    showProgress: false
  });

  readonly state = this.loaderState.asReadonly();

  private loadingPhases = [
    { progress: 12, message: 'Configurando entorno...', duration: 500 },
    { progress: 25, message: 'Cargando dependencias...', duration: 600 },
    { progress: 40, message: 'Inicializando servicios...', duration: 450 },
    { progress: 55, message: 'Preparando interfaz...', duration: 500 },
    { progress: 70, message: 'Optimizando rendimiento...', duration: 400 },
    { progress: 85, message: 'Aplicando configuración...', duration: 350 },
    { progress: 95, message: 'Finalizando carga...', duration: 300 },
    { progress: 100, message: 'Sistema listo', duration: 400 }
  ];

  private currentPhaseIndex = 0;
  private loadingTimeout?: number;
  private isLoadingActive = false;

  startLoading(): void {
    if (this.isLoadingActive) return;
    
    this.isLoadingActive = true;
    this.currentPhaseIndex = 0;
    
    this.loaderState.update(state => ({
      ...state,
      isLoading: true,
      showLogo: true,
      progress: 0,
      message: 'Inicializando sistema...'
    }));

    setTimeout(() => {
      this.loaderState.update(state => ({
        ...state,
        showProgress: true
      }));
      
      this.executeLoadingSequence();
    }, 1200);
  }

  private executeLoadingSequence(): void {
    if (this.currentPhaseIndex >= this.loadingPhases.length) {
      this.completeLoading();
      return;
    }

    const phase = this.loadingPhases[this.currentPhaseIndex];
    
    this.animateProgressTo(phase.progress, phase.message);

    this.loadingTimeout = window.setTimeout(() => {
      this.currentPhaseIndex++;
      this.executeLoadingSequence();
    }, phase.duration);
  }

  private animateProgressTo(targetProgress: number, message: string): void {
    const currentProgress = this.loaderState().progress;
    const progressDiff = targetProgress - currentProgress;
    const steps = 30; // Smoother animation
    const stepSize = progressDiff / steps;
    const stepDuration = 12; // 12ms per step = 360ms total

    this.loaderState.update(state => ({
      ...state,
      message
    }));

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(targetProgress, currentProgress + (stepSize * currentStep));
      
      this.loaderState.update(state => ({
        ...state,
        progress: Math.round(newProgress)
      }));

      if (currentStep >= steps || newProgress >= targetProgress) {
        clearInterval(progressInterval);
      }
    }, stepDuration);
  }

  private completeLoading(): void {
    setTimeout(() => {
      this.loaderState.update(state => ({
        ...state,
        message: 'Bienvenido'
      }));

      setTimeout(() => {
        this.loaderState.update(state => ({
          ...state,
          isLoading: false,
          showLogo: false,
          showProgress: false
        }));
        
        this.isLoadingActive = false;
      }, 800);
    }, 600);
  }

  setProgress(progress: number, message?: string): void {
    if (!this.isLoadingActive) return;
    
    const clampedProgress = Math.max(0, Math.min(100, progress));
    
    this.loaderState.update(state => ({
      ...state,
      progress: clampedProgress,
      message: message || state.message
    }));
  }

  quickLoad(): void {
    this.startLoading();
    
    const quickSteps = [30, 60, 85, 100];
    const messages = [
      'Carga rápida...',
      'Aplicando configuración...',
      'Preparando interfaz...',
      'Sistema listo'
    ];

    quickSteps.forEach((progress, index) => {
      setTimeout(() => {
        this.setProgress(progress, messages[index]);
        if (progress === 100) {
          setTimeout(() => this.finishLoading(), 400);
        }
      }, (index + 1) * 250);
    });
  }

  simulateRealisticLoading(): void {
    this.startLoading();
    
    const realisticSteps = [
      { progress: 8, message: 'Conectando...', delay: 400 },
      { progress: 18, message: 'Autenticando...', delay: 600 },
      { progress: 32, message: 'Cargando configuración...', delay: 500 },
      { progress: 48, message: 'Inicializando módulos...', delay: 700 },
      { progress: 65, message: 'Preparando interfaz...', delay: 450 },
      { progress: 80, message: 'Optimizando...', delay: 350 },
      { progress: 92, message: 'Finalizando...', delay: 300 },
      { progress: 100, message: 'Completado', delay: 200 }
    ];

    let totalDelay = 0;
    realisticSteps.forEach(step => {
      totalDelay += step.delay;
      setTimeout(() => {
        this.setProgress(step.progress, step.message);
        if (step.progress === 100) {
          setTimeout(() => this.finishLoading(), 500);
        }
      }, totalDelay);
    });
  }

  finishLoading(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = undefined;
    }

    this.loaderState.update(state => ({
      ...state,
      progress: 100,
      message: 'Completado'
    }));

    this.completeLoading();
  }

  resetLoader(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = undefined;
    }

    this.isLoadingActive = false;
    this.currentPhaseIndex = 0;
    
    this.loaderState.set({
      isLoading: false,
      progress: 0,
      message: 'Inicializando sistema...',
      showLogo: false,
      showProgress: false
    });
  }

  get isLoading(): boolean {
    return this.loaderState().isLoading;
  }

  get progress(): number {
    return this.loaderState().progress;
  }

  get message(): string {
    return this.loaderState().message;
  }

  get isComplete(): boolean {
    return this.loaderState().progress >= 100;
  }

  getLoadingMetrics() {
    return {
      currentStep: this.currentPhaseIndex,
      totalSteps: this.loadingPhases.length,
      isActive: this.isLoadingActive,
      state: this.loaderState()
    };
  }

  destroy(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    this.resetLoader();
  }
}