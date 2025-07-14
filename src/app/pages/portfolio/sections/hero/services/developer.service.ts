import { Injectable, signal } from '@angular/core';
import { CodeSnippet, Developer, Quote } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private readonly developer = signal<Developer>({
    name: 'Abel Arias',
    title: 'Full Stack Developer',
    description: 'Experiencia en el desarrollo de aplicaciones completas de principio a fin. Me adapto a distintos proyectos y tecnologias, buscando siempre soluciones claras, eficientes y orientadas al usuario.',
    location: 'Lima, Perú',
    experience: '1+ años de experiencia',
    email: 'abel.ariase.soft@gmail.com',
    skills: [''],
    status: {
      available: true,
      message: 'Disponibilidad inmediata'
    }
  });

  private readonly quote = signal<Quote>({
    text: 'El mejor código es el que resuelve problemas reales y hace la vida más fácil a las personas.',
    author: 'Abel Arias',
    year: '2025'
  });

 

  readonly developerInfo = this.developer.asReadonly();
  readonly motivationalQuote = this.quote.asReadonly();


  openCV(): void {
    const cvUrl = 'assets/cv/CV-ARIASABEL-2025.pdf';
    const newWindow = window.open(cvUrl, '_blank', 'noopener,noreferrer');

    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const link = document.createElement('a');
      link.href = cvUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
  }

  openContact(): void {
    const dev = this.developer();
    const subject = encodeURIComponent('🚀 Colaboración Profesional - Abel Arias');
    const body = encodeURIComponent(`¡Hola Abel!

He revisado tu portfolio y me impresiona tu trabajo como Full Stack Developer.

Me gustaría explorar una posible colaboración en:
□ Desarrollo de aplicación web
□ Consultoría técnica
□ Proyecto a largo plazo
□ Otro: ___________

¿Podríamos agendar una reunión para discutir los detalles?

Saludos cordiales!`);

    const mailtoUrl = `mailto:${dev.email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  }
}