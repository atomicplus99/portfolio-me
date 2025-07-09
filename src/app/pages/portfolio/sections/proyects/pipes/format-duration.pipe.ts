import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatDuration',
  standalone: true
})
export class FormatDurationPipe implements PipeTransform {
  
  transform(value: string): string {
    if (!value) return '';
    
    // Formatear duraciones como "3 meses" a un formato más descriptivo
    const durationMap: Record<string, string> = {
      '1 mes': '4 semanas',
      '2 meses': '8 semanas',
      '3 meses': '12 semanas',
      '4 meses': '16 semanas',
      '5 meses': '20 semanas',
      '6 meses': '24 semanas'
    };
    
    return durationMap[value] || value;
  }
}