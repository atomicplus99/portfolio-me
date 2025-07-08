import * as THREE from 'three';
import { Project } from './proyect.interface';


export interface HologramObject {
  mesh: THREE.Group;
  project: Project;
  originalPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  isHovered: boolean;
  isSelected: boolean;
}

export interface TouchInfo {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  startTime: number;
}

export interface PerformanceStats {
  fps: number;
  objectCount: number;
  particleCount: number;
  renderTime: number;
}

export interface MatrixRain {
  id: number;
  x: number;
  chars: string;
  delay: number;
}

export interface ParticleData {
  id: number;
  initialDelay: number;
  color: string;
  animationDuration: number;
}