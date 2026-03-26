import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, defer, map, of, switchMap, withLatestFrom } from 'rxjs';
import { OpenAiService } from '../services/openai.service';
import { ChatMessage } from '../models/chat-message.model';
import { ChatActions } from './chat.actions';
import { selectAllMessages } from './chat.selectors';

/**
 * NgRx Effects for the chat feature.
 * Intercepts sendMessage, reads the full conversation from the store
 * (which already contains the new user bubble added by the reducer),
 * and calls the OpenAI API with the complete history for context-aware replies.
 */
@Injectable()
export class ChatEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly openAiService = inject(OpenAiService);

  readonly sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      // withLatestFrom reads the store AFTER the reducer has already
      // appended the user message, so the full conversation is available.
      withLatestFrom(this.store.select(selectAllMessages)),
      switchMap(([, messages]: [unknown, ChatMessage[]]) => {
        const conversationHistory = messages.map((m: ChatMessage) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

        return defer(() =>
          this.openAiService.sendMessages(conversationHistory)
        ).pipe(
          map((aiContent: string) => {
            const aiMessage: ChatMessage = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: aiContent,
              createdAt: new Date().toISOString()
            };
            return ChatActions.sendMessageSuccess({ aiMessage });
          }),
          catchError((error: unknown) => {
            let errorMessage =
              'Unable to get a response from OpenAI. Please try again.';

            if (error instanceof HttpErrorResponse) {
              errorMessage = OpenAiService.parseHttpError(error);
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }

            return of(ChatActions.sendMessageFailure({ error: errorMessage }));
          })
        );
      })
    )
  );
}
