import { Injectable } from '@angular/core';
import { ContactFormData } from '../interfaces/contact-interface';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  
  async sendEmail(formData: ContactFormData, recipientEmail: string): Promise<boolean> {
    try {
      const emailSubject = `[Portfolio Web] ${formData.subject}`;
      const emailBody = this.createEmailBody(formData);
      
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      window.open(mailtoLink);
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private createEmailBody(formData: ContactFormData): string {
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
Hola Abel,

Espero que este mensaje te encuentre bien. Me pongo en contacto contigo desde tu portfolio web para una posible oportunidad de colaboración.

═══════════════════════════════════════════════════════════════

📋 INFORMACIÓN DE CONTACTO:
• Nombre: ${formData.name}
• Email: ${formData.email}
• Fecha: ${currentDate}
• Asunto: ${formData.subject}

═══════════════════════════════════════════════════════════════

💬 MENSAJE:

${formData.message}

═══════════════════════════════════════════════════════════════

Este mensaje fue enviado desde tu portfolio web (portfolio-abel-arias.com).

Espero tu respuesta.

Saludos cordiales,
${formData.name}
    `;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}