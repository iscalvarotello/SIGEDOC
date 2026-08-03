import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './countdown-timer.component.html'
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() expiresAt!: string | Date;
  @Output() expired = new EventEmitter<void>();

  private _timer: any;
  private _initialTotalSeconds = 0;

  timeString = signal<string>('00:00');
  progressPercentage = signal<number>(100);

  ngOnInit() {
    const end = new Date(this.expiresAt).getTime();
    const now = new Date().getTime();
    this._initialTotalSeconds = Math.max(0, Math.floor((end - now) / 1000));
    
    this.updateTimer();
    this._timer = setInterval(() => this.updateTimer(), 1000);
  }

  ngOnDestroy() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  private updateTimer() {
    const end = new Date(this.expiresAt).getTime();
    const now = new Date().getTime();
    const remainingMs = end - now;

    if (remainingMs <= 0) {
      this.timeString.set('00:00');
      this.progressPercentage.set(0);
      clearInterval(this._timer);
      this.expired.emit();
      return;
    }

    const remainingSecs = Math.floor(remainingMs / 1000);
    const m = Math.floor(remainingSecs / 60);
    const s = remainingSecs % 60;
    this.timeString.set(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

    if (this._initialTotalSeconds > 0) {
      const p = (remainingSecs / this._initialTotalSeconds) * 100;
      this.progressPercentage.set(Math.max(0, Math.min(100, p)));
    } else {
      this.progressPercentage.set(0);
    }
  }
}
