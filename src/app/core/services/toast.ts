
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();
  private toastTimeout?: ReturnType<typeof setTimeout>;

  show(
    message: string,
    type: ToastMessage['type'] = 'success',
    duration: number = 3000
  ): void {

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastSubject.next({ message, type });
    this.toastTimeout = setTimeout(() => {
      this.clear();
    }, duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }
  error(message: string): void {
    this.show(message, 'error');
  }
  warning(message: string): void {
    this.show(message, 'warning');
  }
  info(message: string): void {
    this.show(message, 'info');
  }
  clear(): void {
    this.toastSubject.next(null);
    this.toastTimeout = undefined;
  }
}

