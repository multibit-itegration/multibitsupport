import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, ExtendedRatingPayload } from '../services/task.service';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rating-form">
      <div class="question-card">
        <div class="question-title">Как вы оцениваете решение вашей задачи?</div>
        <div class="rating-buttons">
          <ng-container *ngFor="let n of ten() ; let last = last">
            <button
              type="button"
              class="btn"
              [class.selected]="selectedRating === n"
              [class.pre-selected]="!userHasSelected && preSelectedRating === n"
              (click)="onRatingChange(n)"
              [disabled]="isSubmitting"
            >
              {{ n }}
            </button>
            <span *ngIf="last" class="rating-caption">высшая оценка</span>
          </ng-container>
        </div>
      </div>

      <button class="cta-hint" type="button" (click)="toggleExtendedForm()">
        <span *ngIf="showExtendedForm" class="close-extended" (click)="$event.stopPropagation(); showExtendedForm=false">✕</span>
        «Помогите нам стать лучше — заполните расширенную форму оценки»
      </button>

      <div *ngIf="showExtendedForm" class="extended-form">
        <div class="section">
          <div class="section-title">1. Общая оценка технической поддержки (1–10)</div>
          <div class="section-sub">Как вы оцениваете работу технической поддержки?<br>(1 — очень плохо, 10 — отлично)</div>
          <div class="scale-row">
            <button class="chip" *ngFor="let n of ten()" [class.selected]="extendedRating.support === n" (click)="extendedRating.support = n">{{ n }}</button>
          </div>
        </div>

        <div class="section">
          <div class="section-title">2.Насколько вероятно, что вы порекомендуете нашу компанию друзьям или коллегам?</div>
          <div class="section-sub">(1 — точно не порекомендую, 10 — обязательно порекомендую)</div>
          <div class="scale-row">
            <button class="chip" *ngFor="let n of ten()" [class.selected]="extendedRating.nps === n" (click)="extendedRating.nps = n">{{ n }}</button>
          </div>
        </div>

        <div class="section">
          <div class="section-title">3. Недоделки (да/нет)</div>
          <div class="btn-row">
            <button class="chip" [class.active]="extendedRating.hasIssues === true" (click)="extendedRating.hasIssues = true">Да</button>
            <button class="chip" [class.active]="extendedRating.hasIssues === false" (click)="extendedRating.hasIssues = false">Нет</button>
          </div>
        </div>

        <div class="section">
          <div class="section-title">4. Похвала (список сотрудников)</div>
          <div class="section-sub">Хотите отметить кого-то из сотрудников?</div>
          <div class="praise-input-wrapper">
            <input
              class="text-input"
              type="text"
              placeholder="Начните вводить имя сотрудника"
              [(ngModel)]="praiseQuery"
              (input)="onPraiseInput()"
              (focus)="onPraiseInput()"
            />
            <span *ngIf="praiseQuery" class="close-praise" (click)="resetPraiseUser()">✕</span>
          </div>
          <div *ngIf="showUsersDropdown" class="dropdown">
            <button class="dropdown-item" *ngFor="let u of filteredUsers" (click)="selectPraiseUser(u)">{{ u.FIO }}</button>
          </div>
        </div>

        <div class="section">
          <div class="section-title">5. Что нужно сделать, чтобы стать лучше?</div>
          <textarea class="textarea" rows="6" placeholder="Ваши предложения" [(ngModel)]="extendedRating.improvements"></textarea>
        </div>
      </div>

      <div class="submit-section">
        <button class="submit-btn" type="button" (click)="onSubmit()" [disabled]="isSubmitting">
          <span *ngIf="isSubmitting">Отправка...</span>
          <span *ngIf="!isSubmitting">Отправить</span>
        </button>
        <div *ngIf="submitError" class="error-message">{{ submitError }}</div>
      </div>
    </div>
  `,
  styles: [
    `
    .praise-input-wrapper{position:relative;display:flex;align-items:center}
    .close-praise{position:absolute;right:18px;font-size:24px;color:#6635f3;cursor:pointer;user-select:none;transition:color .2s;z-index:2}
    .close-praise:hover{color:#3b82f6}
    .rating-form{background:transparent;width:100%}
    .question-card{background:#6635f3;border:2px solid #3B82F6;border-radius:12px;padding:22px 28px;margin-bottom:16px}
    .question-title{color:#fff;font-size:22px;font-weight:800;margin-bottom:18px}
    .rating-buttons{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;align-items:center;margin-bottom:16px}
    .rating-buttons button{width:44px;height:44px;min-width:44px;flex:0 0 44px;border:2px solid #EEE;background:#fff;border-radius:999px;font-size:16px;font-weight:600;color:#5a2fcf;cursor:pointer;transition:border-color .2s ease,background-color .2s ease,color .2s ease;display:flex;align-items:center;justify-content:center;padding:0}
    .rating-buttons button:active{transform:none}
    .rating-buttons button:hover{border-color:#5a2fcf}
    .rating-buttons button.selected,.rating-buttons button.pre-selected{background:#a6ff73;border-color:#5a2fcf;color:#000}
    .rating-buttons button:disabled{opacity:.6;cursor:not-allowed}
    .rating-caption{color:#fff;opacity:.9;font-size:14px;white-space:nowrap;margin-left:8px;margin-right:0;align-self:center;margin-top:0}
    .cta-hint{border:2px dashed #6635F3;color:#000;padding:18px;border-radius:10px;margin:8px 0 18px;text-align:center;background:transparent;width:100%;cursor:pointer;position:relative;display:flex;align-items:center;justify-content:center}
    .close-extended{position:absolute;right:24px;font-size:28px;color:#6635f3;cursor:pointer;user-select:none;transition:color .2s;z-index:2}
    .close-extended:hover{color:#3b82f6}
    .extended-form{background:#6635f3;border:2px solid #3B82F6;border-radius:12px;padding:32px 28px;color:#fff;font-size:17px}
    .section{margin-bottom:16px}
    .section-title{font-weight:700;margin-bottom:8px;font-size:21px}
    .section-sub{opacity:.9;font-size:15px;margin-bottom:14px}
    .btn-row{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:nowrap}
    .scale-row{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
    .chip{background:#fff;color:#5a2fcf;border:2px solid #EEE;border-radius:999px;width:44px;height:44px;min-width:44px;flex:0 0 44px;padding:0;display:flex;align-items:center;justify-content:center;font-weight:700;cursor:pointer;transition:border-color .2s ease,background-color .2s ease,color .2s ease,transform .12s ease}
    .chip:hover{border-color:#5a2fcf}
    .chip.selected,.chip.active{background:#a6ff73;color:#000;border-color:#5a2fcf;transform:scale(1.12);z-index:1}
    .text-input,.textarea{width:100%;border-radius:8px;border:2px solid #EEE;padding:10px 12px}
    .dropdown{background:#fff;border:1px solid #DDD;border-radius:8px;margin-top:6px;max-height:180px;overflow:auto}
    .dropdown-item{display:block;width:100%;text-align:left;padding:8px 12px;border:none;background:#fff;cursor:pointer}
    .dropdown-item:hover{background:#f4f4f5}
    .submit-section{text-align:center;margin-top:32px}
    .submit-btn{background:#6635f3;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s ease}
    .submit-btn:hover:not(:disabled){background:#5a2fcf}
    .submit-btn:disabled{opacity:.6;cursor:not-allowed}
    .error-message{margin-top:16px;color:#e74c3c;font-size:14px;background:#fdf2f2;padding:8px 12px;border-radius:6px;border:1px solid #fecaca}

    /* Responsive: small screens */
    @media (max-width: 480px){
      .question-card{padding:16px;border-radius:10px}
      .question-title{font-size:18px;margin-bottom:12px}
      .rating-buttons{gap:10px;flex-wrap:wrap}
      .rating-buttons button{width:36px;height:36px;min-width:36px;flex:0 0 36px;font-size:14px;border-radius:50%}
      .rating-caption{font-size:12px;margin-left:6px}
      .rating-caption{display:none}

      .cta-hint{padding:12px;font-size:14px}
      .close-extended{right:16px}

      .extended-form{padding:20px;border-radius:10px;font-size:16px}
      .section-title{font-size:18px}
      .section-sub{font-size:14px}
      .scale-row{gap:10px}
      .btn-row{gap:10px}
      .chip{width:36px;height:36px;min-width:36px;flex:0 0 36px;font-size:14px;border-radius:50%}

      .text-input,.textarea{font-size:16px}
      .submit-btn{width:100%}
    }
    `,
  ],
})
export class RatingFormComponent implements OnInit {
  @Input() taskId = '';
  @Input() preSelectedRating: number | null = null;
  @Output() ratingSubmitted = new EventEmitter<void>();

  selectedRating = 5;
  showExtendedForm = false;
  isSubmitting = false;
  submitError = '';
  userHasSelected = false;

  extendedRating: ExtendedRatingPayload & { praiseUserId?: number | null } = {
    support: null,
    nps: null,
    hasIssues: null,
    praise: '',
    praiseUserId: null,
    improvements: '',
  };

  users: any[] = [];
  filteredUsers: any[] = [];
  praiseQuery = '';
  selectedPraiseUserId: number | null = null;
  showUsersDropdown = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (this.preSelectedRating !== null) this.selectedRating = this.preSelectedRating;
    this.taskService.getUsers().subscribe({
      next: (res: any) => {
        const excluded = new Set([136, 132, 131, 70]);
        const list = (res.users ?? []) as any[];
        this.users = list.filter(u => !excluded.has(u.id));
        this.filteredUsers = this.users;
      },
      error: () => {
        this.users = [];
        this.filteredUsers = [];
      },
    });
  }

  ten(): number[] { return [1,2,3,4,5,6,7,8,9,10]; }

  onRatingChange(n: number): void {
    this.selectedRating = n;
    this.userHasSelected = true;
  }
  toggleExtendedForm(): void { this.showExtendedForm = !this.showExtendedForm; }

  onPraiseInput(): void {
    const q = (this.praiseQuery || '').toLowerCase().trim();
    this.selectedPraiseUserId = null;
    this.extendedRating.praiseUserId = null;
    this.extendedRating.praise = this.praiseQuery;
    if (!q) {
      this.filteredUsers = this.users;
      this.showUsersDropdown = this.filteredUsers.length > 0;
      return;
    }
    this.filteredUsers = this.users.filter(u => (u.FIO || '').toLowerCase().includes(q));
    this.showUsersDropdown = this.filteredUsers.length > 0;
  }

  selectPraiseUser(u: any): void {
    this.praiseQuery = u.FIO;
    this.selectedPraiseUserId = u.id;
    this.extendedRating.praiseUserId = u.id;
    this.extendedRating.praise = u.FIO;
    this.showUsersDropdown = false;
  }

  resetPraiseUser(): void {
    this.selectedPraiseUserId = null;
    this.extendedRating.praiseUserId = null;
    this.praiseQuery = '';
    this.showUsersDropdown = false;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitError = '';

    const payload = this.showExtendedForm
      ? {
          ...this.extendedRating,
          praiseUserId: this.selectedPraiseUserId ?? this.extendedRating.praiseUserId ?? null,
          praise: this.praiseQuery || this.extendedRating.praise || '',
        }
      : null;

    this.taskService.submitRating(this.taskId, this.selectedRating, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.ratingSubmitted.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Ошибка при отправке оценки. Попробуйте еще раз.';
        console.error('Error submitting rating:', err);
      },
    });
  }

  resetForm(): void {
    this.selectedRating = this.preSelectedRating ?? 5;
    this.showExtendedForm = false;
    this.isSubmitting = false;
    this.submitError = '';
    this.userHasSelected = false;
    this.extendedRating = { support: null, nps: null, hasIssues: null, praise: '', praiseUserId: null, improvements: '' };
    this.praiseQuery = '';
    this.selectedPraiseUserId = null;
    this.filteredUsers = this.users;
    this.showUsersDropdown = false;
  }
}


