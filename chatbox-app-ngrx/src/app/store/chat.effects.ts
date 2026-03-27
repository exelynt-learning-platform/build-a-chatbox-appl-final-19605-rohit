import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { OpenAiService, OpenAiMessage } from '../services/openai.service';
import { ChatMessage } from '../models/chat-message.model';
import { ChatActions } from './chat.actions';
import { selectAllMessages } from './chat.selectors';

@Injectable()
export class ChatEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly openAiService = inject(OpenAiService);

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      // Read the store AFTER the reducer has already added the user message
      withLatestFrom(this.store.select(selectAllMessages)),
      switchMap(([, messages]: [unknown, ChatMessage[]]) => {
        // Map store messages to the format the OpenAI API expects
        const history: OpenAiMessage[] = messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

        return this.openAiService.sendMessages(history).pipe(
          map(content =>
            ChatActions.sendMessageSuccess({
              aiMessage: {
                id: crypto.randomUUID(),
                role: 'assistant',
                content,
                createdAt: new Date().toISOString()
              }
            })
          ),
          catchError((err: unknown) => {
            const error = parseError(err);
            return of(ChatActions.sendMessageFailure({ error }));
          })
        );
      })
    )
  );
}

/** Converts an API error into a user-friendly message. */
function parseError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0)   return 'Network error — check your internet connection.';
    if (err.status === 401) return 'Unauthorized — invalid or missing OpenAI API key.';
    if (err.status === 429) return 'Rate limit exceeded — please wait and try again.';
    if (err.status === 500) return 'OpenAI server error — try again shortly.';
    return `OpenAI error (${err.status}) — please try again.`;
  }
  if (err instanceof Error) return err.message;
  return 'Unable to get a response from OpenAI. Please try again.';
}
