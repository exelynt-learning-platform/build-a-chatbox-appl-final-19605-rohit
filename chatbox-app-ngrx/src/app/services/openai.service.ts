import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type OpenAiRole = 'user' | 'assistant';

export interface OpenAiMessage {
  role: OpenAiRole;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  private readonly http = inject(HttpClient);

  /**
   * Sends the conversation history to OpenAI and returns the AI's reply text.
   * The Authorization header uses a Bearer token as required by the OpenAI API.
   */
  sendMessages(messages: OpenAiMessage[]): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.openAiApiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: environment.openAiModel,
      messages
    };

    return this.http
      .post<{ choices: Array<{ message: { content: string } }> }>(
        'https://api.openai.com/v1/chat/completions',
        body,
        { headers }
      )
      .pipe(
        map(res => res.choices[0]?.message?.content?.trim() ?? 'No response from AI.')
      );
  }
}
