import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interaction-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyect-interaction-guide.component.html',
  styleUrls: ['./proyect-interaction-guide.component.css']
})
export class InteractionGuideComponent {
  @Input() isVisible = true;
  @Input() isMobile = false;
  @Input() showMobileHint = false;
  
  @Output() hintDismissed = new EventEmitter<void>();

  dismissHint() {
    this.hintDismissed.emit();
  }
}