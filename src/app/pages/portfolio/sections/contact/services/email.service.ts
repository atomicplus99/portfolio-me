import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';
import { ContactFormData } from '../interfaces/contact-interface';
import { environment } from '../../../../../../environments/environment';

export interface EmailResult {
  success: boolean;
  message: string;
  error?: any;
}

interface RateLimitInfo {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
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

  // 🛡️ Protección contra spam
  private readonly MAX_ATTEMPTS_PER_HOUR = 3; // Máximo 3 intentos por hora
  private readonly MAX_ATTEMPTS_PER_DAY = 10; // Máximo 10 intentos por día
  private readonly COOLDOWN_PERIOD = 60000; // 1 minuto entre envíos
  private readonly HOUR_IN_MS = 3600000; // 1 hora en milisegundos
  private readonly DAY_IN_MS = 86400000; // 1 día en milisegundos
  
  private rateLimitMap = new Map<string, RateLimitInfo>();
  private lastSubmissionTime = 0;

  constructor() {
    this.initializeEmailJS();
    this.cleanupOldRateLimitData();
  }

  // 🧹 Limpiar datos antiguos de rate limiting
  private cleanupOldRateLimitData(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, info] of this.rateLimitMap.entries()) {
        if (now - info.lastAttempt > this.DAY_IN_MS) {
          this.rateLimitMap.delete(key);
        }
      }
    }, this.HOUR_IN_MS);
  }

  // 🛡️ Verificar rate limiting
  private checkRateLimit(userIdentifier: string): { allowed: boolean; message: string; waitTime?: number } {
    const now = Date.now();
    const userInfo = this.rateLimitMap.get(userIdentifier);

    // Verificar cooldown entre envíos
    if (now - this.lastSubmissionTime < this.COOLDOWN_PERIOD) {
      const waitTime = this.COOLDOWN_PERIOD - (now - this.lastSubmissionTime);
      return {
        allowed: false,
        message: `Por favor espera ${Math.ceil(waitTime / 1000)} segundos antes de intentar de nuevo.`,
        waitTime
      };
    }

    if (!userInfo) {
      // Primer intento del usuario
      this.rateLimitMap.set(userIdentifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return { allowed: true, message: 'OK' };
    }

    // Verificar límites por hora
    if (now - userInfo.firstAttempt < this.HOUR_IN_MS) {
      if (userInfo.count >= this.MAX_ATTEMPTS_PER_HOUR) {
        const waitTime = this.HOUR_IN_MS - (now - userInfo.firstAttempt);
        return {
          allowed: false,
          message: `Has alcanzado el límite de ${this.MAX_ATTEMPTS_PER_HOUR} intentos por hora. Intenta de nuevo en ${Math.ceil(waitTime / 3600000)} horas.`,
          waitTime
        };
      }
    } else {
      // Resetear contador si ha pasado más de una hora
      userInfo.count = 0;
      userInfo.firstAttempt = now;
    }

    // Verificar límites por día
    if (userInfo.count >= this.MAX_ATTEMPTS_PER_DAY) {
      const waitTime = this.DAY_IN_MS - (now - userInfo.firstAttempt);
      return {
        allowed: false,
        message: `Has alcanzado el límite de ${this.MAX_ATTEMPTS_PER_DAY} intentos por día. Intenta de nuevo mañana.`,
        waitTime
      };
    }

    // Actualizar contador
    userInfo.count++;
    userInfo.lastAttempt = now;
    this.rateLimitMap.set(userIdentifier, userInfo);

    return { allowed: true, message: 'OK' };
  }

  // 🆔 Generar identificador único del usuario
  private getUserIdentifier(formData: ContactFormData): string {
    const email = formData.email?.toLowerCase().trim() || '';
    const ip = this.getClientIP() || 'unknown';
    return `${email}|${ip}`;
  }

  // 🌐 Obtener IP del cliente (simulado)
  private getClientIP(): string {
    // En un entorno real, esto vendría del servidor
    // Por ahora usamos una simulación basada en user agent
    const userAgent = navigator.userAgent || '';
    return btoa(userAgent.substring(0, 20)).substring(0, 8);
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
    const userIdentifier = this.getUserIdentifier(formData);

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

    // 🛡️ Verificar rate limiting
    const rateLimitResult = this.checkRateLimit(userIdentifier);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        message: rateLimitResult.message
      };
    }

    try {
      // Preparar parámetros con valores seguros
      const templateParams = this.prepareTemplateParams(formData);
      
      // Configurar timeout según dispositivo
      const timeout = deviceInfo.isMobile ? this.MOBILE_TIMEOUT : this.DESKTOP_TIMEOUT;
      
      // Crear promesas con retry automático
      const result = await this.sendWithRetry(templateParams, timeout);
      
      // ✅ Actualizar tiempo del último envío exitoso
      this.lastSubmissionTime = Date.now();
      
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

    // 🛡️ Verificar honeypot (si el campo está lleno, es un bot)
    if (formData.website && formData.website.trim() !== '') {
      return {
        isValid: false,
        message: 'Solicitud rechazada por seguridad'
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