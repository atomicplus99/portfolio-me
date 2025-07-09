import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ContactHeaderComponent } from './components/contact-header/contact-header.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

import { TechBackgroundComponent } from './components/contact-background/contact-background.component';
import { ContactConfig, ContactFormData, ContactMethod, TechParticle } from './interfaces/contact-interface';
import { ContactConfigService } from './services/contact-config.service';
import { EmailService } from './services/email.service';
import { VisualEffectsService } from './services/visual-effects.service';
import { ContactMethodsComponent } from './components/contact-methods/contact-methods.component';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ContactHeaderComponent,
    ContactFormComponent,
    ContactMethodsComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  @ViewChild('contactForm') contactFormComponent!: ContactFormComponent;
  
  config: ContactConfig;
  isSubmitting = false;
  showSuccess = false;
  techParticles: TechParticle[] = [];
  
  private subscriptions = new Subscription();

  constructor(
    private contactConfigService: ContactConfigService,
    private emailService: EmailService,
    private visualEffectsService: VisualEffectsService
  ) {
    this.config = this.contactConfigService.getConfig();
  }

  ngOnInit(): void {
    this.initializeEffects();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.visualEffectsService.cleanup();
  }

  private initializeEffects(): void {
    this.visualEffectsService.initializeTechEffects(12);
    this.visualEffectsService.startTechEffects();
  }

  private setupSubscriptions(): void {
    const particlesSub = this.visualEffectsService.particles$.subscribe(
      particles => this.techParticles = particles
    );
    this.subscriptions.add(particlesSub);
  }

  async onFormSubmit(formData: ContactFormData): Promise<void> {
    this.isSubmitting = true;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = await this.emailService.sendEmail(formData, this.config.email.recipient);
      
      if (success) {
        this.showSuccess = true;
        this.contactFormComponent.resetForm();
        
        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  openContactMethod(method: ContactMethod): void {
    this.createContactEffect();
    
    setTimeout(() => {
      window.open(method.link, '_blank');
    }, 200);
  }

  private createContactEffect(): void {
    
  }

  onInputFocus(fieldName: string): void {
   
  }

  onInputBlur(fieldName: string): void {
  
  }

  onCardHover(methodName: string): void {
  
  }
}