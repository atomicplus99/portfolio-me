import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsHeaderComponent } from '../components/skils-header/skils-header.component';
import { SkillsGridComponent } from '../components/skills-grid/skills-grid.component';
import { SkillsService } from '../services/skill.service';
import { Skill, SkillCategory, StatsInfo } from '../interfaces/skill.interface';

import { AnimationService } from '../services/skill-animation.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    SkillsHeaderComponent,
    SkillsGridComponent,
  ],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {


  private readonly isInitialized = signal(false);


  protected readonly skills = signal<Skill[]>([]);
  protected readonly categories = signal<SkillCategory[]>([]);
  protected readonly statsInfo = signal<StatsInfo>({
    languages: [],
    experience: { years: '', description: '' },
    availability: { status: '', description: '', statusColor: 'green' }
  });

  protected readonly visibleCards = computed(() => {
    try {
      return this.animationService?.getVisibleItems() || [];
    } catch {
      return [];
    }
  });
  
  protected readonly skillsCount = computed(() => {
    try {
      return this.skillsService?.getSkillsCount() || {};
    } catch {
      return {};
    }
  });

  protected readonly averageLevel = computed(() => {
    try {
      return this.skillsService?.getAverageLevel() || 0;
    } catch {
      return 0;
    }
  });

  protected readonly totalSkills = computed(() => {
    try {
      return this.skillsService?.getTotalSkills() || 0;
    } catch {
      return 0;
    }
  });

  constructor(
    private skillsService: SkillsService,
    private animationService: AnimationService
  ) {
    this.initializeSignals();
  }

  private initializeSignals(): void {
    this.skills.set(this.skillsService.getSkills());
    this.categories.set(this.skillsService.getCategories());
    this.statsInfo.set(this.skillsService.getStatsInfo());
  }

  ngOnInit(): void {
    this.initializeAnimations();
    this.isInitialized.set(true);
  }

  ngOnDestroy(): void {
    this.animationService.resetAnimation();
  }

  private initializeAnimations(): void {
    const skillsCount = this.skills().length;
    this.animationService.initializeStaggeredAnimation(skillsCount, 800);
  }

  protected getSkillsByCategory(categoryName: string): Skill[] {
    return this.skillsService.getSkillsByCategory(categoryName);
  }

  protected getSkills = (): Skill[] => this.skills();
  protected getCategories = (): SkillCategory[] => this.categories();
  protected getStatsInfo = (): StatsInfo => this.statsInfo();
  protected getVisibleCards = (): boolean[] => this.visibleCards();
}