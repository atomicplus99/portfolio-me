import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
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
    TechBackgroundComponent
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  @ViewChild('contactForm') contactFormComponent!: ContactFormComponent;

  config: ContactConfig;
  
  // Estados del formulario
  isSubmitting = false;
  showSuccess = false;
  showError = false;
  statusMessage = '';
  
  // Efectos visuales
  techParticles: TechParticle[] = [];
  
  // Subscripciones
  private subscriptions = new Subscription();
  private submitTimeout: any;

  constructor(
    private contactConfigService: ContactConfigService,
    private emailService: EmailService,
    private visualEffectsService: VisualEffectsService,
    private cdr: ChangeDetectorRef
  ) {
    this.config = this.contactConfigService.getConfig();
  }

  ngOnInit(): void {
    this.initializeEffects();
    this.setupSubscriptions();
    this.checkEmailServiceStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.visualEffectsService.cleanup();
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
    }
  }

  private initializeEffects(): void {
    try {
      this.visualEffectsService.initializeTechEffects(12);
      this.visualEffectsService.startTechEffects();
    } catch (error) {
    }
  }

  private setupSubscriptions(): void {
    try {
      const particlesSub = this.visualEffectsService.particles$.subscribe(
        particles => {
          this.techParticles = particles;
          this.cdr.detectChanges();
        }
      );
      this.subscriptions.add(particlesSub);
    } catch (error) {
    }
  }

  private checkEmailServiceStatus(): void {
    const status = this.emailService.getServiceStatus();
    if (!status.isReady) {
      setTimeout(() => {
        this.emailService.forceReinitialize();
      }, 1000);
    }
  }

  private getDeviceInfo() {
    return {
      type: window.screen?.width > 1024 ? 'desktop' : 'mobile',
      screenWidth: window.screen?.width || 0,
      userAgent: navigator.userAgent?.substring(0, 50) || 'unknown',
      online: navigator.onLine,
      timestamp: new Date().toISOString()
    };
  }

  async onFormSubmit(formData: ContactFormData): Promise<void> {
    // Limpiar timeouts previos
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
    }

    // Resetear estados
    this.resetNotifications();
    this.isSubmitting = true;
    this.cdr.detectChanges();

    // Timeout de seguridad para el estado de loading
    this.submitTimeout = setTimeout(() => {
      if (this.isSubmitting) {
        this.isSubmitting = false;
        this.showError = true;
        this.statusMessage = 'Timeout: El envío tardó demasiado. Intenta de nuevo.';
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.showError = false;
          this.statusMessage = '';
          this.cdr.detectChanges();
        }, 8000);
      }
    }, 25000); // 25 segundos timeout total

    try {
      // Validar antes de enviar
      if (!this.validateFormData(formData)) {
        throw new Error('Datos del formulario inválidos');
      }

      // Verificar servicio
      const serviceStatus = this.emailService.getServiceStatus();
      if (!serviceStatus.isReady) {
        this.emailService.forceReinitialize();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Enviar email
      const result = await this.emailService.sendEmail(formData);
      
      // Limpiar timeout
      if (this.submitTimeout) {
        clearTimeout(this.submitTimeout);
        this.submitTimeout = null;
      }

      if (result.success) {
        // ✅ ÉXITO
        this.showSuccess = true;
        this.statusMessage = result.message;
        
        // Resetear formulario
        if (this.contactFormComponent) {
          this.contactFormComponent.resetForm();
        }
        
        // Auto-hide después de 6 segundos
        setTimeout(() => {
          this.showSuccess = false;
          this.statusMessage = '';
          this.cdr.detectChanges();
        }, 6000);
        
      } else {
        // ❌ ERROR CONTROLADO
        this.showError = true;
        this.statusMessage = result.message;
        
        // Auto-hide después de 10 segundos
        setTimeout(() => {
          this.showError = false;
          this.statusMessage = '';
          this.cdr.detectChanges();
        }, 10000);
      }

    } catch (error: any) {
      // ❌ ERROR INESPERADO      
      // Limpiar timeout
      if (this.submitTimeout) {
        clearTimeout(this.submitTimeout);
        this.submitTimeout = null;
      }
      
      this.showError = true;
      this.statusMessage = this.getErrorMessage(error);
      
      // Auto-hide después de 10 segundos
      setTimeout(() => {
        this.showError = false;
        this.statusMessage = '';
        this.cdr.detectChanges();
      }, 10000);
      
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
      
      // Limpiar timeout por seguridad
      if (this.submitTimeout) {
        clearTimeout(this.submitTimeout);
        this.submitTimeout = null;
      }
    }
  }

  private validateFormData(formData: ContactFormData): boolean {
    return !!(
      formData &&
      formData.name?.trim() &&
      formData.email?.trim() &&
      formData.subject?.trim() &&
      formData.message?.trim() &&
      this.emailService.validateEmail(formData.email)
    );
  }

  private getErrorMessage(error: any): string {
    if (error?.message?.includes('inválidos')) {
      return 'Por favor completa todos los campos correctamente.';
    } else if (error?.message?.includes('Timeout')) {
      return 'La conexión tardó demasiado. Intenta de nuevo.';
    } else if (!navigator.onLine) {
      return 'Sin conexión a internet. Verifica tu conectividad.';
    } else {
      return 'Error inesperado. Por favor intenta de nuevo en unos momentos.';
    }
  }

  private resetNotifications(): void {
    this.showSuccess = false;
    this.showError = false;
    this.statusMessage = '';
  }

  // Método público para reinicializar el servicio
  reinitializeService(): void {
    this.emailService.forceReinitialize();
    this.checkEmailServiceStatus();
  }

  openContactMethod(method: ContactMethod): void {
    this.createContactEffect();

    setTimeout(() => {
      try {
        if (method.link.startsWith('mailto:') || method.link.startsWith('tel:')) {
          window.location.href = method.link;
        } else {
          window.open(method.link, '_blank', 'noopener,noreferrer');
        }
      } catch (error) {
        // Fallback: intentar copiar al clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(method.link).catch(() => {});
        }
      }
    }, 200);
  }

  private createContactEffect(): void {
    // Implementación de efectos visuales
  }

  onInputFocus(fieldName: string): void {
    // Implementación de efectos de foco
  }

  onInputBlur(fieldName: string): void {
    // Implementación de efectos de blur
  }

  onCardHover(methodName: string): void {
    // Implementación de efectos de hover
  }

  // Getters para el template
  get currentStatus() {
    return {
      isSubmitting: this.isSubmitting,
      showSuccess: this.showSuccess,
      showError: this.showError,
      statusMessage: this.statusMessage
    };
  }

  get canSubmit(): boolean {
    return !this.isSubmitting && navigator.onLine;
  }
}