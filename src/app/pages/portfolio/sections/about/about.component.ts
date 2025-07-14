import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteSectionComponent } from './components/quote-section/quote-section.component';
import { CtaButtonComponent } from './components/cta-button/cta-button.component';
import { AboutConfig } from './interfaces/about.interface';
import { ThreeSceneManager } from './classes/three-scene.classes';
import { AboutConfigService } from './services/about-config.service';
import { ScrollIndicatorComponent } from "../hero/components/hero-scroll-indicator/hero-scroll-indicator.component";




@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    QuoteSectionComponent,
    CtaButtonComponent,
    ScrollIndicatorComponent
],
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeContainer', { static: true }) threeContainer!: ElementRef<HTMLDivElement>;

  isVisible = false;
  config: AboutConfig;
  
  private threeSceneManager!: ThreeSceneManager;

  constructor(
    private aboutConfigService: AboutConfigService
  ) {
    this.config = this.aboutConfigService.getConfig();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 300);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initThreeJS();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.threeSceneManager) {
      this.threeSceneManager.dispose();
    }
  }

  private initThreeJS(): void {
    const container = this.threeContainer.nativeElement;
    
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      setTimeout(() => this.initThreeJS(), 100);
      return;
    }
    
    this.threeSceneManager = new ThreeSceneManager(
      container,
      this.config.geometries
    );
    
    this.threeSceneManager.startAnimation();
  }

  onButtonHover(isHovering: boolean): void {
    if (this.threeSceneManager) {
      this.threeSceneManager.setHoverState(isHovering);
    }
  }
}