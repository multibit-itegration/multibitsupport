import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ExtendedRatingPayload {
  support: number | null;
  nps: number | null;
  hasIssues: boolean | null;
  praise?: string;
  praiseUserId?: number | null;
  improvements?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  apiUrl = 'http://217.198.6.143:8000/task/rate/';
  submitUrl = 'http://217.198.6.143:8000/task/datatag/';
  usersUrl = 'http://217.198.6.143:8000/user/list/';
  useMockData = false;

  fieldIds = {
    performer: 104006,
    overallRating: 103944,
    nps: 103958,
    supportRating: 103942,
    hasIssues: 103946,
    praise: 103948,
    improvements: 103950,
  } as const;

  getTaskRating(taskId: string): Observable<any> {
    if (this.useMockData) return this.getMockResponse(taskId);
    return this.http.get(`${this.apiUrl}?task_id=${taskId}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(this.usersUrl);
  }

  submitRating(taskId: string, rating: number, ext: ExtendedRatingPayload | null): Observable<any> {
    if (this.useMockData) return of({ success: true }).pipe(delay(1000));

    const customFieldData: any[] = [
      { field: { id: this.fieldIds.performer }, value: taskId },
      { field: { id: this.fieldIds.overallRating }, value: rating },
    ];

    if (ext) {
      if (ext.support !== null) customFieldData.push({ field: { id: this.fieldIds.supportRating }, value: ext.support });
      if (ext.nps !== null) customFieldData.push({ field: { id: this.fieldIds.nps }, value: ext.nps });
      if (ext.hasIssues !== null) customFieldData.push({ field: { id: this.fieldIds.hasIssues }, value: ext.hasIssues ? 'да' : 'нет' });
      if (ext.praiseUserId !== undefined && ext.praiseUserId !== null) customFieldData.push({ field: { id: this.fieldIds.praise }, value: ext.praiseUserId });
      else if (ext.praise && ext.praise.trim()) customFieldData.push({ field: { id: this.fieldIds.praise }, value: ext.praise.trim() });
      if (ext.improvements && ext.improvements.trim()) customFieldData.push({ field: { id: this.fieldIds.improvements }, value: ext.improvements.trim() });
    }

    const payload = { items: [{ customFieldData }] };
    return this.http.post(`${this.submitUrl}?task_id=${taskId}`, payload);
  }

  getMockResponse(taskId: string): Observable<any> {
    return of(this.getMockDataForTask(taskId)).pipe(delay(500));
  }

  getMockDataForTask(taskId: string): any {
    const messages = [
      { detail: 'Поле value не найдено или значение в нём null.' },
      { detail: 'Вы уже оставили отзыв по этой заявке 😊 Спасибо!' },
      { detail: 'Время ожидания оценки истекло!' },
    ];
    const n = parseInt(taskId, 10);
    return n % 3 === 0 ? messages[0] : n % 3 === 1 ? messages[1] : messages[2];
  }

  setMockMode(enabled: boolean): void {
    this.useMockData = enabled;
  }
}


