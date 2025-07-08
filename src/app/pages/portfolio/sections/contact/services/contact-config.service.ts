import { Injectable } from '@angular/core';
import { ContactConfig } from '../interfaces/contact-interface';


@Injectable({
  providedIn: 'root'
})
export class ContactConfigService {
  private readonly defaultConfig: ContactConfig = {
    header: {
      title: 'Conectemos',
      subtitle: '¿Listo para discutir tu próximo proyecto? Estoy aquí para ayudarte a dar vida a tus ideas con tecnología de vanguardia y soluciones creativas.',
      status: {
        text: 'Disponible para nuevas oportunidades',
        available: true
      }
    },
    form: {
      title: 'Enviar Mensaje',
      subtitle: 'Te responderé en menos de 24 horas',
      submitText: 'Enviar Mensaje',
      successMessage: {
        title: '¡Mensaje enviado con éxito!',
        description: 'Gracias por contactarme. Te responderé en menos de 24 horas.'
      }
    },
    email: {
      recipient: 'abel.ariase.soft@gmail.com',
      subject: 'Consulta desde Portfolio Web'
    },
    methods: [
      {
        name: 'Email',
        value: 'abel.ariase.soft@gmail.com',
        link: 'mailto:abel.ariase.soft@gmail.com?subject=Oportunidad de Colaboración Profesional',
        icon: 'email',
        color: '#3b82f6',
        description: 'Comunicación profesional'
      },
      {
        name: 'WhatsApp',
        value: '+51 991 753 149',
        link: 'https://wa.me/51991753149?text=¡Hola Abel! Me gustaría discutir una oportunidad de proyecto.',
        icon: 'whatsapp',
        color: '#10b981',
        description: 'Mensajería instantánea'
      },
      {
        name: 'LinkedIn',
        value: '/in/abel-arias-dev',
        link: 'https://linkedin.com/in/abel-arias-dev',
        icon: 'linkedin',
        color: '#0ea5e9',
        description: 'Red profesional'
      },
      {
        name: 'GitHub',
        value: '@abelarias-dev',
        link: 'https://github.com/abelarias-dev',
        icon: 'github',
        color: '#64748b',
        description: 'Repositorio de código'
      }
    ]
  };

  getConfig(): ContactConfig {
    return this.defaultConfig;
  }

  createCustomConfig(overrides: Partial<ContactConfig>): ContactConfig {
    return {
      ...this.defaultConfig,
      ...overrides,
      header: { ...this.defaultConfig.header, ...overrides.header },
      form: { ...this.defaultConfig.form, ...overrides.form },
      email: { ...this.defaultConfig.email, ...overrides.email },
      methods: overrides.methods || this.defaultConfig.methods
    };
  }
}