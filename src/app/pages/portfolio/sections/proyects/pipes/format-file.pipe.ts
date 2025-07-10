import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatFileSize',
  standalone: true
})
export class FormatFileSizePipe implements PipeTransform {
  
  transform(value: string): string {
    if (!value) return '';
    
    const match = value.match(/^(\d+(?:\.\d+)?)(KB|MB|GB)$/i);
    if (!match) return value;
    
    const [, size, unit] = match;
    const numericSize = parseFloat(size);
    
    if (unit.toUpperCase() === 'KB' && numericSize >= 1000) {
      return `${(numericSize / 1000).toFixed(1)}MB`;
    }
    
    return `${numericSize}${unit}`;
  }
}
