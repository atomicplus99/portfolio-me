import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';
import { ContactFormData } from '../interfaces/contact-interface';
import { environment } from '../../../../../../environments/environment';

export interface EmailResult {
  success: boolean;
  message: string;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly MOBILE_TIMEOUT = 20000; // 20 segundos para móvil
  private readonly DESKTOP_TIMEOUT = 10000; // 10 segundos para desktop
  private isInitialized = false;
  private initializationAttempts = 0;
  private readonly MAX_INIT_ATTEMPTS = 3;

  constructor() {
    this.initializeEmailJS();
  }

  private initializeEmailJS(): void {
    this.initializationAttempts++;
    
    try {
      // Detectar si las variables están disponibles
      const config = environment?.emailjs;
      
      if (!config) {
        if (this.initializationAttempts < this.MAX_INIT_ATTEMPTS) {
          setTimeout(() => this.initializeEmailJS(), 1000);
        }
        return;
      }

      if (!config.userId) {
        if (this.initializationAttempts < this.MAX_INIT_ATTEMPTS) {
          setTimeout(() => this.initializeEmailJS(), 1000);
        }
        return;
      }

      emailjs.init(config.userId);
      this.isInitialized = true;

    } catch (error) {
      if (this.initializationAttempts < this.MAX_INIT_ATTEMPTS) {
        setTimeout(() => this.initializeEmailJS(), 2000);
      }
    }
  }

  async sendEmail(formData: ContactFormData): Promise<EmailResult> {
    const deviceInfo = this.getDeviceInfo();

    // Re-verificar inicialización
    if (!this.isInitialized) {
      this.initializeEmailJS();
      // Esperar un momento para la inicialización
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Validaciones
    const validationResult = this.validateRequest(formData);
    if (!validationResult.isValid) {
      return {
        success: false,
        message: validationResult.message
      };
    }

    try {
      // Preparar parámetros con valores seguros
      const templateParams = this.prepareTemplateParams(formData);
      
      // Configurar timeout según dispositivo
      const timeout = deviceInfo.isMobile ? this.MOBILE_TIMEOUT : this.DESKTOP_TIMEOUT;
      
      // Crear promesas con retry automático
      const result = await this.sendWithRetry(templateParams, timeout);
      
      return {
        success: true,
        message: '¡Mensaje enviado correctamente! Te responderé pronto.'
      };

    } catch (error: any) {
      return this.handleEmailError(error, deviceInfo);
    }
  }

  private async sendWithRetry(templateParams: any, timeout: number, maxRetries: number = 2): Promise<any> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {        
        // Re-inicializar EmailJS en cada intento
        if (attempt > 1) {
          emailjs.init(environment.emailjs.userId);
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        const emailPromise = emailjs.send(
          environment.emailjs.serviceId,
          environment.emailjs.templateId,
          templateParams,
          environment.emailjs.userId
        );

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), timeout);
        });

        const result = await Promise.race([emailPromise, timeoutPromise]);
        
        // Si llegamos aquí, fue exitoso
        return result;

      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          // Esperar antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw lastError;
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isDesktop = !isMobile;
    const screenWidth = window.screen?.width || 0;
    
    return {
      isMobile,
      isDesktop,
      screenWidth,
      userAgent: userAgent.substring(0, 100),
      isOnline: navigator.onLine,
      connection: (navigator as any).connection?.effectiveType || 'unknown'
    };
  }

  private validateRequest(formData: ContactFormData): { isValid: boolean; message: string } {
    // Verificar configuración
    const config = environment?.emailjs;
    if (!config || !config.serviceId || !config.templateId || !config.userId) {
      return {
        isValid: false,
        message: 'Configuración de email incompleta'
      };
    }

    // Verificar datos del formulario
    if (!formData || !formData.name?.trim() || !formData.email?.trim() || 
        !formData.subject?.trim() || !formData.message?.trim()) {
      return {
        isValid: false,
        message: 'Todos los campos son obligatorios'
      };
    }

    // Verificar email válido
    if (!this.validateEmail(formData.email)) {
      return {
        isValid: false,
        message: 'Email inválido'
      };
    }

    // Verificar conexión
    if (!navigator.onLine) {
      return {
        isValid: false,
        message: 'Sin conexión a internet'
      };
    }

    return { isValid: true, message: 'Válido' };
  }

  private prepareTemplateParams(formData: ContactFormData) {
    return {
      from_name: (formData.name || '').trim() || 'Usuario sin nombre',
      from_email: (formData.email || '').trim() || 'sin-email@ejemplo.com',
      subject: (formData.subject || '').trim() || 'Sin asunto',
      message: (formData.message || '').trim() || 'Sin mensaje',
      to_email: environment.emailjs.recipient || 'abel.ariase.soft@gmail.com',
      reply_to: (formData.email || '').trim() || environment.emailjs.recipient,
      timestamp: new Date().toISOString(),
      device: this.getDeviceInfo().isMobile ? 'móvil' : 'desktop'
    };
  }

  private handleEmailError(error: any, deviceInfo: any): EmailResult {
    let message = 'Error al enviar el mensaje';

    // Análisis específico del error
    if (error?.message?.includes('Timeout')) {
      message = deviceInfo.isMobile ? 
        'La conexión es lenta. Verifica tu señal e intenta de nuevo.' :
        'Tiempo de espera agotado. Intenta de nuevo.';
    } else if (error?.message?.includes('Network') || error?.message?.includes('Failed to fetch')) {
      message = 'Error de conexión. Verifica tu internet.';
    } else if (error?.status === 400) {
      message = 'Error en los datos del formulario.';
    } else if (error?.status === 401 || error?.status === 403) {
      message = 'Error de autorización del servicio.';
    } else if (error?.status >= 500) {
      message = 'Error del servidor. Intenta más tarde.';
    } else if (!navigator.onLine) {
      message = 'Sin conexión a internet.';
    } else if (error?.name === 'TypeError') {
      message = 'Error de configuración. Contacta al administrador.';
    }

    return {
      success: false,
      message,
      error: {
        type: error?.name || 'Unknown',
        message: error?.message || 'Sin detalles',
        status: error?.status || 0,
        device: deviceInfo.isMobile ? 'móvil' : 'desktop'
      }
    };
  }

  validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  // Método para verificar el estado del servicio
  getServiceStatus(): { isReady: boolean; config: any; info: string } {
    const config = environment?.emailjs;
    const isReady = this.isInitialized && !!config?.serviceId && !!config?.templateId && !!config?.userId;
    
    return {
      isReady,
      config: {
        serviceId: config?.serviceId ? '✅' : '❌',
        templateId: config?.templateId ? '✅' : '❌',
        userId: config?.userId ? '✅' : '❌',
        recipient: config?.recipient ? '✅' : '❌'
      },
      info: `Initialized: ${this.isInitialized}, Attempts: ${this.initializationAttempts}`
    };
  }

  // Método para forzar re-inicialización
  forceReinitialize(): void {
    this.isInitialized = false;
    this.initializationAttempts = 0;
    this.initializeEmailJS();
  }
}