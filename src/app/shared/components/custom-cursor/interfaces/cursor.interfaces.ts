export interface ParticlePool {
  element: HTMLElement;
  isActive: boolean;
  x: number;
  y: number;
  startTime: number;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export interface CursorConfig {
  maxParticles: number;
  poolSize: number;
  particleDelay: number;
  cornerOffset: number;
  numCorners: number;
  radarLerp: number;
  cornerLerp: number;
  particleLifetime: number;
  burstParticles: number;
  defensiveParticles: number;
  optimizedMode: boolean;
}

export interface TacticalStatus {
  reticlePosition: CursorPosition;
  isTargeting: boolean;
  isFiring: boolean;
  activeParticles: number;
  systemStatus: string;
}

export interface TacticalElements {
  reticle: HTMLElement;
  corners: HTMLElement[];
  radar: HTMLElement;
}

export interface AnimationState {
  cursorPosition: CursorPosition;
  radarPosition: CursorPosition;
  cornerPositions: CursorPosition[];
  isTargeting: boolean;
  isFiring: boolean;
}