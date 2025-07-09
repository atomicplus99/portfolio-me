import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modalResponsive',
  standalone: true
})
export class ModalResponsivePipe implements PipeTransform {
  
  transform(value: string, context: 'mobile' | 'desktop' | 'tablet' = 'desktop'): string {
    if (!value) return '';
    
    // Acortar texto para móvil
    if (context === 'mobile') {
      return value.length > 60 ? value.substring(0, 60) + '...' : value;
    }
    
    // Texto medio para tablet
    if (context === 'tablet') {
      return value.length > 120 ? value.substring(0, 120) + '...' : value;
    }
    
    return value;
  }
}