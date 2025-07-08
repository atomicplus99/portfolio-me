import { Injectable, signal } from '@angular/core';
import { Project, ProjectStats } from '../interfaces/proyect.interface';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly projects = signal<Project[]>([
    {
      id: 1,
      name: 'E-COMMERCE NEXUS',
      description: 'Plataforma de comercio cuántico con IA predictiva y realidad aumentada integrada para experiencias inmersivas de compra.',
      type: 'web',
      techStack: ['Angular', 'TypeScript', 'Node.js', 'MongoDB'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'online',
      imageUrl: 'assets/images/ecommerce-project.jpg'
    },
    {
      id: 2,
      name: 'NEURAL DASHBOARD',
      description: 'Interface de comando para análisis de datos multidimensionales en tiempo real con capacidades de machine learning.',
      type: 'dashboard',
      techStack: ['React', 'D3.js', 'Python', 'TensorFlow'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'online',
      imageUrl: 'assets/images/dashboard-project.jpg'
    },
    {
      id: 3,
      name: 'QUANTUM MOBILE',
      description: 'Aplicación móvil con computación cuántica para criptografía avanzada y comunicaciones seguras.',
      type: 'mobile',
      techStack: ['Flutter', 'Dart', 'Firebase', 'Quantum-SDK'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'development',
      imageUrl: 'assets/images/mobile-project.jpg'
    },
    {
      id: 4,
      name: 'BLOCKCHAIN HUB',
      description: 'Centro de comando para gestión de contratos inteligentes descentralizados y DeFi protocols.',
      type: 'web',
      techStack: ['Vue.js', 'Solidity', 'Web3', 'IPFS'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'online',
      imageUrl: 'assets/images/blockchain-project.jpg'
    },
    {
      id: 5,
      name: 'AI INTERFACE',
      description: 'Terminal de comunicación directa con sistemas de inteligencia artificial para procesamiento de lenguaje natural.',
      type: 'dashboard',
      techStack: ['Svelte', 'OpenAI', 'FastAPI', 'Redis'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'online',
      imageUrl: 'assets/images/ai-project.jpg'
    },
    {
      id: 6,
      name: 'CYBER DEFENSE',
      description: 'Sistema de monitoreo y defensa en tiempo real contra amenazas cibernéticas con análisis predictivo.',
      type: 'web',
      techStack: ['Next.js', 'Rust', 'GraphQL', 'Docker'],
      demoUrl: '#',
      codeUrl: '#',
      status: 'maintenance',
      imageUrl: 'assets/images/cyber-project.jpg'
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