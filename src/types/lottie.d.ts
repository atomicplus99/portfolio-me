declare module 'lottie-web' {
  export interface AnimationItem {
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    setSpeed(speed: number): void;
    goToAndStop(value: number, isFrame?: boolean): void;
    goToAndPlay(value: number, isFrame?: boolean): void;
  }

  export interface AnimationConfig {
    container: Element;
    renderer: 'svg' | 'canvas' | 'html';
    loop: boolean;
    autoplay: boolean;
    path?: string;
    animationData?: any;
  }

  export function loadAnimation(config: AnimationConfig): AnimationItem;
  export default { loadAnimation };
}