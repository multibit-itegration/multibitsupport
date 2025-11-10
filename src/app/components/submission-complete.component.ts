import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submission-complete',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="thank-you">
      <div class="thank-you-message">Спасибо за оставленный отзыв! 🤝</div>
      <div class="download-section">
        <button class="download-btn" type="button" (click)="downloadPdf()">
          <span class="download-text">Памятка по обслуживанию</span>
          <svg class="download-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    .thank-you{max-width:800px;margin:0 auto;padding:20px}
    .thank-you-message{background:#6635f3;color:#fff;padding:30px;border-radius:8px;text-align:center;font-size:18px;font-weight:500;margin-bottom:20px;line-height:1.5}
    .download-section{display:flex;justify-content:center}
    .download-btn{background:#fff;border:2px solid #6635F3;color:#6635f3;padding:16px 24px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s ease;display:flex;align-items:center;gap:8px;min-width:250px;justify-content:space-between}
    .download-btn:hover{background:#f9fafb;border-color:#5a2fcf;transform:translateY(-2px);box-shadow:0 4px 12px #6635f333}
    .download-text{flex:1;text-align:left}
    .download-icon{flex-shrink:0}
    
    /* Mobile */
    @media (max-width: 480px){
      .thank-you{padding:12px}
      .thank-you-message{padding:18px;font-size:16px;border-radius:10px}
      .download-btn{min-width:0;width:100%;padding:14px 16px;font-size:15px;border-radius:10px}
      .download-text{font-size:15px}
      .download-icon{width:18px;height:18px}
    }
    `,
  ],
})
export class SubmissionCompleteComponent {
  downloadPdf(): void {
    const a = document.createElement('a');
    a.href = '/assets/maintenance-guide.pdf';
    a.download = 'Памятка по обслуживанию.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
