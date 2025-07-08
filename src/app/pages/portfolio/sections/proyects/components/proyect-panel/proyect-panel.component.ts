import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechClassPipe } from '../../pipes/tech-class.pipe';
import { Project } from '../../interfaces/proyect.interface';

@Component({
  selector: 'app-project-panel',
  standalone: true,
  imports: [CommonModule, TechClassPipe],
  templateUrl: './proyect-panel.component.html',
  styleUrls: ['./proyect-panel.component.css']
})
export class ProjectPanelComponent {
  @Input() project: Project | null = null;
  @Input() isVisible = false;
  @Input() isMobile = false;
  @Input() currentIndex = 0;
  @Input() totalProjects = 0;
  
  @Output() actionClicked = new EventEmitter<'demo' | 'code'>();
  @Output() navigate = new EventEmitter<'next' | 'previous'>();
  @Output() close = new EventEmitter<void>();

  onActionClick(action: 'demo' | 'code') {
    this.actionClicked.emit(action);
  }

  onNavigate(direction: 'next' | 'previous') {
    this.navigate.emit(direction);
  }

  onClose() {
    this.close.emit();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'status-online';
      case 'development': return 'status-development';
      case 'maintenance': return 'status-maintenance';
      default: return 'status-default';
    }
  }
}