import { CommonModule } from "@angular/common";
import { Component, input, OnInit, signal } from "@angular/core";

@Component({
  selector: 'app-animated-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-animated.component.html',
  styleUrls: ['./loader-animated.component.css']
})
export class AnimatedLogoComponent implements OnInit {
  readonly text = input<string>('DUQUE');
  readonly subtitle = input<string>('');
  readonly isVisible = input<boolean>(false);
  readonly fontLoaded = signal(false);

  ngOnInit() {
    this.checkFontLoad();
  }

  private checkFontLoad() {

    if (document.fonts) {
      document.fonts.ready.then(() => {
        this.fontLoaded.set(true);
      });
    } else {
      setTimeout(() => this.fontLoaded.set(true), 100);
    }
  }
}