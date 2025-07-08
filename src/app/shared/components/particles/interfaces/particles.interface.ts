export interface ParticleConfig {
  count: number;
  size: number;
  opacity: number;
  speed: number;
  colors: {
    hue: number;
    saturation: number;
    lightness: number;
    variance: number;
  };
}

export interface ParticleSystemOptions {
  container: HTMLElement;
  config: ParticleConfig;
  isMobile: boolean;
}