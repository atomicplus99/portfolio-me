export interface LoaderState {
  isLoading: boolean;
  progress: number;
  message: string;
  showLogo: boolean;
  showProgress: boolean;
  currentPhase: 'initializing' | 'loading' | 'completing' | 'ready';
}