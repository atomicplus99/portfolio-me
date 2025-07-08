import { Injectable, signal } from '@angular/core';
import { CodeSnippet, Developer, Quote } from '../interfaces/hero.interface';


@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private readonly developer = signal<Developer>({
    name: 'Abel Arias',
    title: 'Full Stack Developer',
    description: 'Especializado en Angular, React y Node.js. Transformo ideas en soluciones digitales innovadoras.',
    location: 'Lima, Perú',
    experience: '2+ años experiencia',
    email: 'abel.arias@email.com',
    skills: ['Angular', 'React', 'Node.js'],
    status: {
      available: true,
      message: 'Disponible para proyectos'
    }
  });

  private readonly quote = signal<Quote>({
    text: 'El código limpio no se escribe siguiendo un conjunto de reglas. Se escribe con pasión.',
    author: 'Robert C. Martin',
    year: '2025'
  });

  private readonly codeSnippets = signal<CodeSnippet[]>([
    {
      lines: [
        { text: "@Component({", class: "text-red-400" },
        { text: "  selector: 'app-hero',", class: "text-green-300" },
        { text: "  standalone: true,", class: "text-blue-300" },
        { text: "  templateUrl: './hero.html'", class: "text-green-300" },
        { text: "})", class: "text-red-400" }
      ]
    },
    {
      lines: [
        { text: "interface Developer {", class: "text-purple-400" },
        { text: "  name: string;", class: "text-blue-300" },
        { text: "  skills: string[];", class: "text-cyan-300" },
        { text: "  experience: number;", class: "text-blue-300" },
        { text: "}", class: "text-purple-400" }
      ]
    },
    {
      lines: [
        { text: "const dev: Developer = {", class: "text-yellow-400" },
        { text: "  name: 'Abel Arias',", class: "text-green-300" },
        { text: "  skills: ['Angular', 'React'],", class: "text-cyan-300" },
        { text: "  experience: 2", class: "text-blue-300" },
        { text: "};", class: "text-yellow-400" }
      ]
    },
    {
      lines: [
        { text: "async function build() {", class: "text-yellow-400" },
        { text: "  const code = await write();", class: "text-blue-300" },
        { text: "  const tests = validate(code);", class: "text-cyan-300" },
        { text: "  return deploy(tests);", class: "text-green-300" },
        { text: "}", class: "text-yellow-400" }
      ]
    },
    {
      lines: [
        { text: "class Portfolio {", class: "text-purple-400" },
        { text: "  constructor() {", class: "text-yellow-400" },
        { text: "    this.createMagic();", class: "text-blue-300" },
        { text: "  }", class: "text-yellow-400" },
        { text: "}", class: "text-purple-400" }
      ]
    }
  ]);

  readonly developerInfo = this.developer.asReadonly();
  readonly motivationalQuote = this.quote.asReadonly();
  readonly snippets = this.codeSnippets.asReadonly();

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
    const subject = encodeURIComponent('Contacto desde Portfolio - Abel Arias');
    const body = encodeURIComponent(`Hola Abel,

Me interesa conocer más sobre tus servicios como Full Stack Developer.

Saludos!`);
    
    const mailtoUrl = `mailto:${dev.email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  }
}