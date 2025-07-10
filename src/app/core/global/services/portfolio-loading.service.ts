import { ChangeDetectorRef, Injectable, signal } from "@angular/core";
import { LoadedSections, LoadingScheduleItem } from "../interfaces/global-loading.interface";

@Injectable({
  providedIn: 'root'
})
export class SectionLoadingService {
  
  private loadedSectionsSignal = signal<LoadedSections>({
    about: false,
    aboutMe: false,
    projects: false,
    skills: false,
    contact: false,
    footer: false
  });

  private intersectionObserver?: IntersectionObserver;
  private loadingTimeouts: number[] = [];
  private cdr?: ChangeDetectorRef;

  get loadedSections() {
    return this.loadedSectionsSignal.asReadonly();
  }

  setCdr(cdr: ChangeDetectorRef): void {
    this.cdr = cdr;
  }

  scheduleProgressiveLoading(): void {
    const loadingSchedule: LoadingScheduleItem[] = [
      { section: 'about', delay: 800 },
      { section: 'aboutMe', delay: 1200 },
      { section: 'projects', delay: 1600 },
      { section: 'skills', delay: 2000 },
      { section: 'contact', delay: 2400 },
      { section: 'footer', delay: 2800 }
    ];

    loadingSchedule.forEach(({ section, delay }) => {
      const timeout = window.setTimeout(() => {
        this.loadSection(section);
      }, delay);
      this.loadingTimeouts.push(timeout);
    });
  }

  setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.loadSectionIfNeeded(sectionId);
        }
      });
    }, options);

    const sections = ['about', 'about-me', 'projects', 'skills', 'contact'];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        this.intersectionObserver?.observe(element);
      }
    });
  }

  private loadSectionIfNeeded(sectionId: string): void {
    const sectionMap: Record<string, keyof LoadedSections> = {
      'about': 'about',
      'about-me': 'aboutMe',
      'projects': 'projects',
      'skills': 'skills',
      'contact': 'contact'
    };

    const section = sectionMap[sectionId];
    if (section && !this.loadedSectionsSignal()[section]) {
      this.loadSection(section);
    }
  }

  loadSection(section: keyof LoadedSections): void {
    const currentSections = this.loadedSectionsSignal();
    if (!currentSections[section]) {
      this.loadedSectionsSignal.update(sections => ({
        ...sections,
        [section]: true
      }));
      
      if (this.cdr) {
        this.cdr.markForCheck();
      }
    }
  }

  loadAllSections(): void {
    this.loadedSectionsSignal.set({
      about: true,
      aboutMe: true,
      projects: true,
      skills: true,
      contact: true,
      footer: true
    });
    
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  resetSections(): void {
    this.loadedSectionsSignal.set({
      about: false,
      aboutMe: false,
      projects: false,
      skills: false,
      contact: false,
      footer: false
    });
    
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  isSectionLoaded(section: keyof LoadedSections): boolean {
    return this.loadedSectionsSignal()[section];
  }

  getLoadedSectionsCount(): number {
    const sections = this.loadedSectionsSignal();
    return Object.values(sections).filter(loaded => loaded).length;
  }

  getAllSectionsLoaded(): boolean {
    const sections = this.loadedSectionsSignal();
    return Object.values(sections).every(loaded => loaded);
  }

  cleanup(): void {
    this.intersectionObserver?.disconnect();
    this.loadingTimeouts.forEach(timeout => window.clearTimeout(timeout));
    this.loadingTimeouts = [];
  }

  getLoadingMetrics() {
    return {
      loadedSections: this.loadedSectionsSignal(),
      totalSections: 6,
      loadedCount: this.getLoadedSectionsCount(),
      allLoaded: this.getAllSectionsLoaded(),
      hasObserver: !!this.intersectionObserver,
      pendingTimeouts: this.loadingTimeouts.length
    };
  }
}