import * as THREE from 'three';

export interface ScrollGeometry {
  mesh: THREE.Mesh;
  initialPosition: THREE.Vector3;
  initialRotation: THREE.Euler;
  initialScale: THREE.Vector3;
  type: 'cube' | 'sphere' | 'octahedron' | 'torus';
}

export interface GeometryConfig {
  type: 'cube' | 'sphere' | 'octahedron' | 'torus';
  position: THREE.Vector3;
  color: number;
  size: number;
}

export interface AboutConfig {
  quote: {
    title: string[];
    subtitle: string;
  };
  cta: {
    text: string;
    email: string;
    subject: string;
  };
  geometries: GeometryConfig[];
}