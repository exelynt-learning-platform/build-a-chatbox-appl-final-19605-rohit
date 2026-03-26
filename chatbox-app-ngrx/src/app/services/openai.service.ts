import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface OpenAiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAiChatCompletionResponse {
  choices: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
  }>;
}

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://api.openai.com/v1/chat/completions';

  /**
   * Sends the full conversation history to OpenAI so the model has context
   * for each reply. Throws descriptive Error instances for common HTTP codes
   * so NgRx Effects can display them in the error banner.
   *
   * @param messages Full conversation history (user + assistant turns).
   */
  sendMessages(messages: OpenAiMessage[]): Observable<string> {
    if (!environment.openAiApiKey) {
      throw new Error(
        'OpenAI API key is missing. Add it to src/environments/environment.ts.'
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.openAiApiKey}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      model: environment.openAiModel,
      messages
    };

    return this.http
      .post<OpenAiChatCompletionResponse>(this.endpoint, payload, { headers })
      .pipe(
        map(
          (response) =>
            response.choices?.[0]?.message?.content?.trim() ??
            'No response from AI.'
        )
      );
  }

  /**
   * Maps an Angular HttpErrorResponse to a human-readable string.
   */
  static parseHttpError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Network error — check your internet connection.';
    }
    if (error.status === 401) {
      return 'Unauthorized — invalid or missing OpenAI API key.';
    }
    if (error.status === 429) {
      return 'Rate limit exceeded — please wait a moment and try again.';
    }
    if (error.status === 500) {
      return 'OpenAI server error — try again shortly.';
    }
    const detail: string =
      (error.error as { error?: { message?: string } })?.error?.message ?? '';
    return `API error (${error.status})${detail ? ': ' + detail : '.'}`;
  }
}
