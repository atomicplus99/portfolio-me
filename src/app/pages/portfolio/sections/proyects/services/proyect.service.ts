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
     id: 2,
     name: 'Sistema de control de asistencia',
     description: 'Este sistema constituye una solución tecnológica para el registro y control de asistencia de estudiantes de la institucion educativa "Andres de los Reyes", operando mediante la captura de códigos QR a través de tablets proporcionados por el gobierno de peru.',
     type: 'web',
     techStack: ['Angular', 'Tailwind', 'NestJS', 'MySQL'],
     demoUrl: '#',
     codeUrl: '#',
     status: 'online',
     imageUrl: 'assets/proyects/sistema-de-control-de-asistencia/LOGIN.png'
   },
   {
     id: 3,
     name: 'Sistema de guias de remision remitente',
     description: 'Este sistema consta de registros automaticos de guias de remision remitente para compras directas por el cliente',
     type: 'web',
     techStack: ['Excel', 'Macros', 'VBA'],
     demoUrl: '#',
     codeUrl: '#',
     status: 'online',
     imageUrl: 'assets/proyects/sistema-guias/LOGIN.png'
   },
   {
     id: 4,
     name: 'Gifs App',
     description: 'Esta aplicacion consta de una vista de gifs, donde el usuario puede pasar el rato buscando gifs divertidos junto con familiares y amigos.',
     type: 'web',
     techStack: ['Angular', 'Tailwind'],
     demoUrl: '#',
     codeUrl: '#',
     status: 'online',
     imageUrl: 'assets/proyects/gifs-app/LOGIN.png'
   },
 ]);

 // Array de colores predefinidos para alternar aleatoriamente
 private readonly colors = [
   0x22d3ee, // cyan
   0xa855f7, // purple
   0x10b981, // emerald
   0xf59e0b, // amber
   0xef4444, // red
   0x3b82f6, // blue
   0x8b5cf6, // violet
   0xf97316, // orange
   0x06b6d4, // cyan
   0x84cc16, // lime
   0xec4899, // pink
   0x6366f1  // indigo
 ];

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
   // Genera un índice aleatorio basado en el tipo para consistencia
   const randomIndex = Math.floor(Math.random() * this.colors.length);
   return this.colors[randomIndex];
 }

 // Método alternativo para color aleatorio por ID del proyecto
 getProjectColorById(projectId: number): number {
   // Usa el ID del proyecto como semilla para consistencia
   const index = projectId % this.colors.length;
   return this.colors[index];
 }

 // Método para color completamente aleatorio (cambia en cada llamada)
 getRandomColor(): number {
   const randomIndex = Math.floor(Math.random() * this.colors.length);
   return this.colors[randomIndex];
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