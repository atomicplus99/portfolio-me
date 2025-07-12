import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GalaxyService } from './galaxy.service';

@Injectable()
export class InteractionService {
  private container!: HTMLElement;
  private galaxyService!: GalaxyService;
  private mouse = new THREE.Vector2();
  private mouseTarget = new THREE.Vector2();
  private isMouseDown = false;

  private boundMouseDown = this.onMouseDown.bind(this);
  private boundMouseMove = this.onMouseMove.bind(this);
  private boundMouseUp = this.onMouseUp.bind(this);
  private boundWheel = this.onWheel.bind(this);
  private boundTouchStart = this.onTouchStart.bind(this);
  private boundTouchMove = this.onTouchMove.bind(this);
  private boundTouchEnd = this.onTouchEnd.bind(this);
  private boundResize = this.onWindowResize.bind(this);

  initialize(container: HTMLElement, galaxyService: GalaxyService): void {
    this.container = container;
    this.galaxyService = galaxyService;
    this.addEventListeners();
  }

  getMouseTarget(): THREE.Vector2 {
    return this.mouseTarget;
  }

  private addEventListeners(): void {
    this.container.addEventListener('mousedown', this.boundMouseDown);
    this.container.addEventListener('mousemove', this.boundMouseMove);
    this.container.addEventListener('mouseup', this.boundMouseUp);
    this.container.addEventListener('wheel', this.boundWheel);
    this.container.addEventListener('touchstart', this.boundTouchStart);
    this.container.addEventListener('touchmove', this.boundTouchMove);
    this.container.addEventListener('touchend', this.boundTouchEnd);
    window.addEventListener('resize', this.boundResize);
  }

  removeEventListeners(): void {
    this.container.removeEventListener('mousedown', this.boundMouseDown);
    this.container.removeEventListener('mousemove', this.boundMouseMove);
    this.container.removeEventListener('mouseup', this.boundMouseUp);
    this.container.removeEventListener('wheel', this.boundWheel);
    this.container.removeEventListener('touchstart', this.boundTouchStart);
    this.container.removeEventListener('touchmove', this.boundTouchMove);
    this.container.removeEventListener('touchend', this.boundTouchEnd);
    window.removeEventListener('resize', this.boundResize);
  }

  private onMouseDown(event: MouseEvent): void {
    this.isMouseDown = true;
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onMouseMove(event: MouseEvent): void {
    const newMouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    if (this.isMouseDown) {
      const deltaX = newMouse.x - this.mouse.x;
      const deltaY = newMouse.y - this.mouse.y;

      this.mouseTarget.x += deltaX * 1.5;
      this.mouseTarget.y += deltaY * 1.5;
    }

    this.mouse.copy(newMouse);
  }

  private onMouseUp(): void {
    this.isMouseDown = false;
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();

    const camera = this.galaxyService.getCamera();
    const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
    camera.position.multiplyScalar(zoomFactor);

    const distance = camera.position.length();
    if (distance < 200) {
      camera.position.normalize().multiplyScalar(200);
    } else if (distance > 1000) {
      camera.position.normalize().multiplyScalar(1000);
    }
  }

  private onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.isMouseDown = true;
      this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length === 1 && this.isMouseDown) {
      const newMouse = new THREE.Vector2(
        (event.touches[0].clientX / window.innerWidth) * 2 - 1,
        -(event.touches[0].clientY / window.innerHeight) * 2 + 1
      );

      const deltaX = newMouse.x - this.mouse.x;
      const deltaY = newMouse.y - this.mouse.y;

      this.mouseTarget.x += deltaX * 1.5;
      this.mouseTarget.y += deltaY * 1.5;

      this.mouse.copy(newMouse);
    }
  }

  private onTouchEnd(): void {
    this.isMouseDown = false;
  }

  private onWindowResize(): void {
    this.galaxyService.updateCameraAspect();
  }
}