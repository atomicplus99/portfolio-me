import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../services/galaxy-animation.service';
import { InteractionService } from '../services/galaxy-interactor.service';
import { GalaxyService } from '../services/galaxy.service';


@Component({
  selector: 'app-galaxy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galaxy.component.html',
  styleUrls: ['./galaxy.component.css'],
  providers: [GalaxyService, InteractionService, AnimationService]
})
export class GalaxyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('galaxyContainer', { static: true }) containerRef!: ElementRef;

  constructor(
    private galaxyService: GalaxyService,
    private interactionService: InteractionService,
    private animationService: AnimationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeGalaxy();
  }

  ngOnDestroy(): void {
    this.animationService.stopAnimation();
    this.interactionService.removeEventListeners();
    this.galaxyService.dispose();
  }

  private initializeGalaxy(): void {
    const container = this.containerRef.nativeElement;
    
    this.galaxyService.initialize(container);
    this.interactionService.initialize(container, this.galaxyService);
    this.animationService.initialize(this.galaxyService);
    
    this.animationService.startAnimation();
  }
}