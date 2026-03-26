import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { ChatEffects } from './chat.effects';
import { ChatActions } from './chat.actions';
import { OpenAiService } from '../services/openai.service';
import { chatFeatureKey, initialChatState } from './chat.state';
import { ChatMessage } from '../models/chat-message.model';

const userMsg: ChatMessage = {
  id: 'u1',
  role: 'user',
  content: 'Hello AI',
  createdAt: '2024-01-01T10:00:00.000Z'
};

describe('ChatEffects', () => {
  let actions$: Observable<Action>;
  let effects: ChatEffects;
  let openAiServiceSpy: jasmine.SpyObj<OpenAiService>;
  let store: MockStore;

  beforeEach(() => {
    openAiServiceSpy = jasmine.createSpyObj<OpenAiService>('OpenAiService', ['sendMessages']);

    TestBed.configureTestingModule({
      providers: [
        ChatEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            [chatFeatureKey]: {
              ...initialChatState,
              messages: [userMsg]
            }
          }
        }),
        { provide: OpenAiService, useValue: openAiServiceSpy }
      ]
    });

    effects = TestBed.inject(ChatEffects);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch sendMessageSuccess with AI message on successful API call', (done) => {
    openAiServiceSpy.sendMessages.and.returnValue(of('Hi from AI'));

    actions$ = of(ChatActions.sendMessage({ content: 'Hello AI', messageId: 'u1' }));

    effects.sendMessage$.subscribe((resultAction) => {
      expect(resultAction.type).toBe(ChatActions.sendMessageSuccess.type);
      const successAction = resultAction as ReturnType<typeof ChatActions.sendMessageSuccess>;
      expect(successAction.aiMessage.role).toBe('assistant');
      expect(successAction.aiMessage.content).toBe('Hi from AI');
      done();
    });
  });

  it('should dispatch sendMessageFailure on HTTP 401 error', (done) => {
    const httpError = new HttpErrorResponse({ status: 401 });
    openAiServiceSpy.sendMessages.and.returnValue(throwError(() => httpError));

    actions$ = of(ChatActions.sendMessage({ content: 'Test', messageId: 'u2' }));

    effects.sendMessage$.subscribe((resultAction) => {
      expect(resultAction.type).toBe(ChatActions.sendMessageFailure.type);
      const failAction = resultAction as ReturnType<typeof ChatActions.sendMessageFailure>;
      expect(failAction.error).toContain('Unauthorized');
      done();
    });
  });

  it('should dispatch sendMessageFailure on network error (status 0)', (done) => {
    const networkError = new HttpErrorResponse({ status: 0 });
    openAiServiceSpy.sendMessages.and.returnValue(throwError(() => networkError));

    actions$ = of(ChatActions.sendMessage({ content: 'Test', messageId: 'u3' }));

    effects.sendMessage$.subscribe((resultAction) => {
      const failAction = resultAction as ReturnType<typeof ChatActions.sendMessageFailure>;
      expect(failAction.error).toContain('Network');
      done();
    });
  });

  it('should dispatch sendMessageFailure on rate limit (status 429)', (done) => {
    const rateLimitError = new HttpErrorResponse({ status: 429 });
    openAiServiceSpy.sendMessages.and.returnValue(throwError(() => rateLimitError));

    actions$ = of(ChatActions.sendMessage({ content: 'Spam', messageId: 'u4' }));

    effects.sendMessage$.subscribe((resultAction) => {
      const failAction = resultAction as ReturnType<typeof ChatActions.sendMessageFailure>;
      expect(failAction.error).toContain('Rate limit');
      done();
    });
  });

  it('should pass the full conversation history to the OpenAI service', (done) => {
    openAiServiceSpy.sendMessages.and.returnValue(of('Response'));

    actions$ = of(ChatActions.sendMessage({ content: 'Hello AI', messageId: 'u1' }));

    effects.sendMessage$.subscribe(() => {
      const callArgs = openAiServiceSpy.sendMessages.calls.mostRecent().args[0];
      expect(callArgs.length).toBeGreaterThanOrEqual(1);
      expect(callArgs[0].role).toBe('user');
      done();
    });
  });
});
