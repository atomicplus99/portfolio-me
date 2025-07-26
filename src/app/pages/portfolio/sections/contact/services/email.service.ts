import { Injectable } from '@angular/core';

import emailjs from 'emailjs-com';
import { ContactFormData } from '../interfaces/contact-interface';
import { environment } from '../../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor() {
    emailjs.init(environment.emailjs.userId); // Inicialización con User ID
  }

  async sendEmail(formData: ContactFormData): Promise<boolean> {
    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: environment.emailjs.recipient || 'abel.ariase.soft@gmail.com'
      };

      const response = await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        templateParams
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}