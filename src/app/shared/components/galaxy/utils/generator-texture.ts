import * as THREE from 'three';

export class TextureGenerator {
  static createStarTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const centerX = 32;
    const centerY = 32;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 32);
    gradient.addColorStop(0, 'rgba(79, 195, 247, 1)');
    gradient.addColorStop(0.2, 'rgba(41, 182, 246, 0.9)');
    gradient.addColorStop(0.5, 'rgba(33, 150, 243, 0.6)');
    gradient.addColorStop(0.8, 'rgba(25, 118, 210, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }
}