import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterBrandComponent } from './components/footer-brand/footer-brand.component';
import { FooterCenterComponent } from './components/footer-center/footer-center.component';
import { ScrollToTopComponent } from './components/footer-scroll-top/footer-scroll-top.component';
import { FooterBottomComponent } from './components/footer-bottom/footer-bottom.component';
import { FooterConfigService } from './services/footer-config.service';
import { FooterConfig } from './interfaces/footer.interface';



@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FooterBrandComponent,
    FooterCenterComponent,
    ScrollToTopComponent,
    FooterBottomComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  config: FooterConfig;
  currentYear = new Date().getFullYear();
  isVisible = false;

  constructor(private footerConfigService: FooterConfigService) {
    this.config = this.footerConfigService.getConfig();
  }

  ngOnInit(): void {
  setTimeout(() => {
    this.isVisible = true;
  }, 300);
}

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}