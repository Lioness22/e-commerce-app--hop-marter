
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AIChatResponse {
  success: boolean;
  data: {
    userMessage: string;
    aiResponse: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/ai';

  sendMessage(message: string): Observable<AIChatResponse> {
    return this.http.post<AIChatResponse>(
      `${this.apiUrl}/chat`,
      { message }
    );
  }
}

