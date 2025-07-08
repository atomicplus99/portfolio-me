
// projects/pipes/tech-class.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'techClass',
  standalone: true
})
export class TechClassPipe implements PipeTransform {
  
  transform(tech: string): string {
    if (tech.includes('Angular') || tech.includes('React')) {
      return 'tech-angular';
    } else if (tech.includes('TypeScript') || tech.includes('Dart')) {
      return 'tech-typescript';
    } else if (tech.includes('Node') || tech.includes('Python')) {
      return 'tech-backend';
    }
    return 'tech-default';
  }
}