import { Injectable, signal } from '@angular/core';
import { Project, ProjectStats } from '../interfaces/proyect.interface';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly projects = signal<Project[]>([
    {
      id: 1,
      name: 'E-COMMERCE de tienda de comida rapida',
      description: 'Este sistema esta distribuido por una tienda virtual en donde se puede visualizar los productos de la tienda y por otro lado un sistema de panel administrativo para gestionar las actualizaciones de productos tales como nuevos productos, cambios de precios, promociones, servicios delivery, etc.',
      type: 'web',
      techStack: ['React', 'Laravel', 'MySQL'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'online',
      imageUrl: 'assets/ecommerce-virtual/'
    },
    {
      id: 6,
      name: 'Sistema de control de asistencia',
      description: 'Este sistema constituye una solución tecnológica para el registro y control de asistencia de estudiantes de la institucion educativa "Andres de los Reyes", operando mediante la captura de códigos QR a través de tablets proporcionados por el gobierno de peru.',
      type: 'web',
      techStack: ['Angular', 'Tailwind', 'NestJS', 'MySQL'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'online',
      imageUrl: 'assets/proyects/sistema-de-control-de-asistencia/LOGIN.png'
    }
  ]);

  getProjects() {
    return this.projects();
  }

  getProjectById(id: number): Project | undefined {
    return this.projects().find(project => project.id === id);
  }

  getProjectStats(): ProjectStats {
    const projects = this.projects();
    const onlineProjects = projects.filter(p => p.status === 'online').length;
    const allTech = projects.flatMap(p => p.techStack);
    const uniqueTech = new Set(allTech).size;

    return {
      totalProjects: projects.length,
      onlineProjects,
      technologiesUsed: uniqueTech
    };
  }

  getProjectsByType(type: Project['type']): Project[] {
    return this.projects().filter(project => project.type === type);
  }

  getProjectColor(type: Project['type']): number {
    const colors = {
      web: 0x22d3ee,
      mobile: 0xa855f7,
      dashboard: 0x10b981
    };
    return colors[type] || 0x22d3ee;
  }

  getTechClassname(tech: string): string {
    if (tech.includes('Angular') || tech.includes('React')) {
      return 'tech-angular';
    } else if (tech.includes('TypeScript') || tech.includes('Dart')) {
      return 'tech-typescript';
    } else if (tech.includes('Node') || tech.includes('Python')) {
      return 'tech-backend';
    }
    return 'tech-default';
  }

  getStatusClass(status: Project['status']): string {
    switch (status) {
      case 'online': return 'status-online';
      case 'development': return 'status-development';
      case 'maintenance': return 'status-maintenance';
      default: return 'status-default';
    }
  }
}