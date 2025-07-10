import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit, signal, NgZone } from '@angular/core';
import { HeaderLogoComponent } from './components/header-logo/header-logo.component';
import { HeaderDesktopNavComponent } from './components/header-desktop-nav/header-desktop-nav.component';
import { HeaderRightNavComponent } from './components/header-right-nav/header-right-nav.component';
import { MobileMenuComponent } from './components/responsive/mobile-menu/mobile-menu.component';
import { Subject } from 'rxjs';
import { NavigationItem } from './interfaces/header.interfaces';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderLogoComponent, HeaderDesktopNavComponent, HeaderRightNavComponent, MobileMenuComponent ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private readonly navigationService = inject(NavigationService);
  private readonly ngZone = inject(NgZone);
  private readonly destroy$ = new Subject<void>();
  private resizeTimeout: number | null = null;

  readonly isVisible = signal(false);
  readonly mobileMenuOpen = signal(false);

  readonly navigationItems: NavigationItem[] = [
    { id: 'proyectos', label: 'PROYECTOS', delay: '0.1s' },
    { id: 'experiencia', label: 'EXPERIENCIA', delay: '0.2s' },
    { id: 'sobre-mi', label: 'SOBRE MI', delay: '0.3s' }
  ];

  ngOnInit(): void {
    setTimeout(() => this.isVisible.set(true), 50);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
    }
  }

  navigateToSection(sectionId: string): void {
    this.navigationService.navigateToSection(sectionId);
    this.closeMobileMenu();
  }

  navigateToHome(): void {
    this.navigationService.navigateToHome();
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
     console.log('Toggle clicked!');
    this.mobileMenuOpen.update(current => !current);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.resizeTimeout) {
        window.clearTimeout(this.resizeTimeout);
      }
      
      this.resizeTimeout = window.setTimeout(() => {
        this.ngZone.run(() => {
          const target = event.target as Window;
          if (target.innerWidth >= 1024 && this.mobileMenuOpen()) {
            this.closeMobileMenu();
          }
        });
      }, 150);
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.mobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }
}