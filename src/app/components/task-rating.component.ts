import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/task.service';
import { RatingFormComponent } from './rating-form.component';
import { ThankYouComponent } from './thank-you.component';
import { TimeoutComponent } from './timeout.component';
import { SubmissionCompleteComponent } from './submission-complete.component';

@Component({
  selector: 'app-task-rating',
  standalone: true,
  imports: [CommonModule, RatingFormComponent, ThankYouComponent, TimeoutComponent, SubmissionCompleteComponent],
  template: `
    <div class="container">
      <div class="header"><div class="logo">multisupport</div></div>

      <div *ngIf="viewState === 'loading'" class="loading">
        <div class="spinner"></div>
        <p>Загрузка...</p>
      </div>

      <app-rating-form *ngIf="viewState === 'rating-form'" [taskId]="taskId" [preSelectedRating]="preSelectedRating" (ratingSubmitted)="onRatingSubmitted()"></app-rating-form>
      <app-thank-you *ngIf="viewState === 'thank-you'"></app-thank-you>
      <app-submission-complete *ngIf="viewState === 'submission-complete'"></app-submission-complete>
      <app-timeout *ngIf="viewState === 'timeout'"></app-timeout>

      <div *ngIf="viewState === 'error'" class="error">
        <div class="error-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#e74c3c" stroke-width="2" />
            <line x1="15" y1="9" x2="9" y2="15" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" />
            <line x1="9" y1="9" x2="15" y2="15" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <h2>Ошибка</h2>
        <p>{{ errorMessage }}</p>
        <button class="retry-btn" type="button" (click)="retry()">Попробовать снова</button>
      </div>
    </div>
  `,
  styles: [
    `
    .container{max-width:900px;margin:0 auto;padding:20px}
    .header{display:flex;justify-content:center;margin-bottom:20px}
    .logo{position:relative;display:flex;align-items:center;justify-content:center;text-align:center;width:100%;max-width:500px;margin:0 auto;background:#6635f3;color:#fff;font-weight:800;font-size:38px;line-height:1;border-radius:16px;padding:18px 28px}
    .loading{display:flex;flex-direction:column;align-items:center}
    .spinner{width:24px;height:24px;border-radius:50%;border:3px solid #ddd;border-top-color:#6635f3;animation:spin 1s linear infinite;margin:12px}
    @keyframes spin{to{transform:rotate(360deg)}}
    .error{text-align:center;margin-top:24px}
    .retry-btn{margin-top:12px;padding:8px 16px;border-radius:8px;border:none;background:#6635f3;color:#fff;cursor:pointer}

    /* Mobile tweaks */
    @media (max-width: 480px){
      .logo{font-size:26px;padding:14px 18px;border-radius:12px;max-width:60%}
    }
    `,
  ],
})
export class TaskRatingComponent implements OnInit {
  taskId = '';
  preSelectedRating: number | null = null;
  viewState: 'loading' | 'rating-form' | 'thank-you' | 'submission-complete' | 'timeout' | 'error' = 'loading';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskId = params['task'];
      const rate = params['rate'];
      if (rate === 'like') this.preSelectedRating = 10;
      else if (rate === 'dislike') this.preSelectedRating = 3;

      if (!this.taskId) {
        this.viewState = 'error';
        this.errorMessage = 'Некорректная ссылка: отсутствует параметр task';
        return;
      }
      this.checkTaskStatus();
    });
  }

  checkTaskStatus(): void {
    this.taskService.getTaskRating(this.taskId).subscribe({
      next: (res: any) => {
        if (typeof res === 'string') {
          if (res === 'Вы уже оставили отзыв по этой заявке 😊 Спасибо!') this.viewState = 'thank-you';
          else if (res === 'Время ожидания оценки истекло!') this.viewState = 'timeout';
          else this.viewState = 'rating-form';
          return;
        }
        if (typeof res === 'object' && res?.detail) {
          if (res.detail === 'Поле value не найдено или значение в нём null.') this.viewState = 'rating-form';
          else this.viewState = 'rating-form';
          return;
        }
        this.viewState = 'rating-form';
      },
      error: (err) => {
        console.error('API Error:', err);
        this.viewState = 'rating-form';
        this.errorMessage = 'Не удалось получить информацию о задаче, но вы можете оставить оценку';
      },
    });
  }

  onRatingSubmitted(): void { this.viewState = 'submission-complete'; }
  retry(): void { this.viewState = 'loading'; this.errorMessage = ''; this.checkTaskStatus(); }
}



