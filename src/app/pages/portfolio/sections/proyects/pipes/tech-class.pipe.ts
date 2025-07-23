import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'techClass',
  standalone: true
})
export class TechClassPipe implements PipeTransform {
  
  transform(tech: string): string {
    const techLower = tech.toLowerCase();
    
    // Frontend Frameworks
    if (techLower.includes('angular')) return 'tech-angular';
    if (techLower.includes('react')) return 'tech-react';
    if (techLower.includes('vue')) return 'tech-vue';
    
    // Languages
    if (techLower.includes('typescript')) return 'tech-typescript';
    if (techLower.includes('javascript')) return 'tech-javascript';
    if (techLower.includes('python')) return 'tech-python';
    if (techLower.includes('java') && !techLower.includes('javascript')) return 'tech-java';
    if (techLower.includes('php')) return 'tech-php';
    if (techLower.includes('dart')) return 'tech-dart';
    
    // Backend
    if (techLower.includes('node') || techLower.includes('nodejs')) return 'tech-nodejs';
    if (techLower.includes('nestjs')) return 'tech-nestjs';
    if (techLower.includes('express')) return 'tech-express';
    
    // Databases
    if (techLower.includes('mysql')) return 'tech-mysql';
    if (techLower.includes('postgresql') || techLower.includes('postgres')) return 'tech-postgresql';
    if (techLower.includes('mongodb') || techLower.includes('mongo')) return 'tech-mongodb';
    if (techLower.includes('firebase')) return 'tech-firebase';
    
    // Styling
    if (techLower.includes('tailwind')) return 'tech-tailwind';
    if (techLower.includes('bootstrap')) return 'tech-bootstrap';
    if (techLower.includes('scss') || techLower.includes('sass')) return 'tech-scss';
    if (techLower.includes('css')) return 'tech-css';
    
    // Tools & Others
    if (techLower.includes('docker')) return 'tech-docker';
    if (techLower.includes('aws')) return 'tech-aws';
    if (techLower.includes('git')) return 'tech-git';
    
    return 'tech-default';
  }
}