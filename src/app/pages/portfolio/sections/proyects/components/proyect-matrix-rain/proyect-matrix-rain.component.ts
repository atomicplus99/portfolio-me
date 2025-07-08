import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixRain } from '../../interfaces/hologram.interface';


@Component({
  selector: 'app-matrix-rain',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-matrix-rain.component.html',
  styleUrls: ['./proyect-matrix-rain.component.css']
})
export class MatrixRainComponent implements OnInit {
  @Input() isMobile = false;

  protected readonly matrixRain = signal<MatrixRain[]>([]);

  ngOnInit() {
    this.initializeMatrixRain();
  }

  private initializeMatrixRain(): void {
    const rainCount = this.isMobile ? 8 : 12;
    const matrixChars = '01アカサタナハマヤラワ0123456789ABCDEF';
    
    const newRain: MatrixRain[] = [];
    
    for (let i = 0; i < rainCount; i++) {
      let chars = '';
      const charCount = Math.floor(Math.random() * (this.isMobile ? 10 : 15)) + (this.isMobile ? 5 : 8);
      
      for (let j = 0; j < charCount; j++) {
        chars += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)) + '\n';
      }
      
      newRain.push({
        id: i,
        x: (i / rainCount) * 100,
        chars: chars,
        delay: Math.random() * 10000
      });
    }
    
    this.matrixRain.set(newRain);
  }

  trackByRain(index: number, rain: MatrixRain): number {
    return rain.id;
  }
}