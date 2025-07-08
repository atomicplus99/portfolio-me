
export interface Particle {
  x: number;
  y: number;
  delay: number;
}


export interface LoaderState {
  isLoading: boolean;
  progress: number;
  message: string;
  showLogo: boolean;
  showProgress: boolean;
}