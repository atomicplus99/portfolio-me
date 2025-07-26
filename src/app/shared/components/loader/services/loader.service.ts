import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, timer, map, switchMap, tap, finalize } from 'rxjs';

export interface LoaderState {
  isLoading: boolean;
  progress: number;
  message: string;
  showLogo: boolean;
  showProgress: boolean;
}

export interface LoadingPhase {
  progress: number;
  message: string;
  duration: number;
}

export type LoadingMode = 'normal' | 'quick' | 'realistic';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly destroyRef = inject(DestroyRef);

  // ✅ Signal para estado reactivo
  private readonly loaderState = signal<LoaderState>({
    isLoading: false,
    progress: 0,
    message: 'Inicializando sistema...',
    showLogo: false,
    showProgress: false
  });

  // ✅ BehaviorSubject para observables
  private readonly stateSubject = new BehaviorSubject<LoaderState>(this.loaderState());

  // ✅ API pública limpia
  readonly state = this.loaderState.asReadonly();
  readonly state$ = this.stateSubject.asObservable();

  // ✅ Computed signals
  readonly isLoading = computed(() => this.state().isLoading);
  readonly progress = computed(() => this.state().progress);
  readonly message = computed(() => this.state().message);
  readonly isComplete = computed(() => this.state().progress >= 100);

  // ✅ Configuraciones de carga optimizadas
  private readonly loadingConfigurations: Record<LoadingMode, LoadingPhase[]> = {
    normal: [
      { progress: 15, message: 'Iniciando portfolio...', duration: 500 },
      { progress: 30, message: 'Configurando interacciones...', duration: 400 },
      { progress: 50, message: 'Preparando presentación...', duration: 450 },
      { progress: 70, message: 'Verificando componentes...', duration: 350 },
      { progress: 85, message: 'Optimizando rendimiento...', duration: 300 },
      { progress: 100, message: 'Portfolio cargado', duration: 400 }
    ],
    quick: [
      { progress: 40, message: 'Carga rápida...', duration: 200 },
      { progress: 70, message: 'Aplicando configuración...', duration: 150 },
      { progress: 100, message: 'Sistema listo', duration: 200 }
    ],
    realistic: [
      { progress: 12, message: 'Conectando...', duration: 600 },
      { progress: 25, message: 'Autenticando...', duration: 800 },
      { progress: 45, message: 'Cargando configuración...', duration: 500 },
      { progress: 65, message: 'Inicializando módulos...', duration: 700 },
      { progress: 80, message: 'Preparando interfaz...', duration: 400 },
      { progress: 95, message: 'Optimizando...', duration: 300 },
      { progress: 100, message: 'Completado', duration: 250 }
    ]
  };

  private currentMode: LoadingMode = 'normal';
  private isLoadingActive = false;

  // ✅ Método principal simplificado
  startLoading(mode: LoadingMode = 'normal'): Observable<LoaderState> {
    if (this.isLoadingActive) {
      return this.state$;
    }

    this.currentMode = mode;
    this.isLoadingActive = true;

    // Inicializar estado
    this.updateState({
      isLoading: true,
      progress: 0,
      message: 'Inicializando sistema...',
      showLogo: true,
      showProgress: false
    });

    // ✅ Secuencia reactiva con observables
    return timer(1200).pipe( // Delay inicial para mostrar logo
      tap(() => this.updateState({ showProgress: true })),
      switchMap(() => this.executeLoadingSequence()),
      finalize(() => this.isLoadingActive = false),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  // ✅ Secuencia de carga reactiva
  private executeLoadingSequence(): Observable<LoaderState> {
    const phases = this.loadingConfigurations[this.currentMode];
    
    return new Observable(observer => {
      let currentPhaseIndex = 0;

      const processNextPhase = () => {
        if (currentPhaseIndex >= phases.length) {
          this.completeLoading();
          observer.complete();
          return;
        }

        const phase = phases[currentPhaseIndex];
        
        // Animar progreso suavemente
        this.animateProgressTo(phase.progress, phase.message).subscribe({
          complete: () => {
            setTimeout(() => {
              currentPhaseIndex++;
              processNextPhase();
            }, phase.duration);
          }
        });
      };

      processNextPhase();
    });
  }

  // ✅ Animación de progreso reactiva
  private animateProgressTo(targetProgress: number, message: string): Observable<void> {
    const currentProgress = this.state().progress;
    const duration = 300; // Duración fija para consistencia
    const steps = 20;
    const stepDuration = duration / steps;

    this.updateState({ message });

    return timer(0, stepDuration).pipe(
      map(step => {
        const progress = currentProgress + ((targetProgress - currentProgress) * (step + 1) / steps);
        return Math.min(targetProgress, Math.round(progress));
      }),
      tap(progress => this.updateState({ progress })),
      finalize(() => this.updateState({ progress: targetProgress })),
      map(() => void 0),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  // ✅ Finalización limpia
  private completeLoading(): void {
    timer(600).pipe(
      tap(() => this.updateState({ message: 'Bienvenido!!' })),
      switchMap(() => timer(800)),
      tap(() => this.updateState({
        isLoading: false,
        showLogo: false,
        showProgress: false
      })),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  // ✅ Actualización de estado centralizada
  private updateState(updates: Partial<LoaderState>): void {
    const newState = { ...this.loaderState(), ...updates };
    this.loaderState.set(newState);
    this.stateSubject.next(newState);
  }

  // ✅ Métodos públicos simplificados
  setProgress(progress: number, message?: string): void {
    if (!this.isLoadingActive) return;
    
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const updates: Partial<LoaderState> = { progress: clampedProgress };
    
    if (message) {
      updates.message = message;
    }
    
    this.updateState(updates);
  }

  finishLoading(): void {
    this.updateState({
      progress: 100,
      message: 'Completado'
    });
    
    timer(500).pipe(
      tap(() => this.completeLoading()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  resetLoader(): void {
    this.isLoadingActive = false;
    this.updateState({
      isLoading: false,
      progress: 0,
      message: 'Inicializando sistema...',
      showLogo: false,
      showProgress: false
    });
  }

  // ✅ Métodos de utilidad
  getLoadingMetrics() {
    return {
      currentMode: this.currentMode,
      isActive: this.isLoadingActive,
      configuration: this.loadingConfigurations[this.currentMode],
      state: this.state()
    };
  }

  // ✅ API simplificada para diferentes modos
  startQuickLoading(): Observable<LoaderState> {
    return this.startLoading('quick');
  }

  startRealisticLoading(): Observable<LoaderState> {
    return this.startLoading('realistic');
  }

  startNormalLoading(): Observable<LoaderState> {
    return this.startLoading('normal');
  }
}