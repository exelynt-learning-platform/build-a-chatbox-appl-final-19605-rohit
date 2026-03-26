import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ChatMessage } from '../models/chat-message.model';

/**
 * All NgRx actions for the chat feature.
 * sendMessage carries a pre-generated messageId so the reducer can
 * add the user bubble immediately without waiting for the API response.
 */
export const ChatActions = createActionGroup({
  source: 'Chat',
  events: {
    /** Dispatched when the user submits a message. */
    'Send Message': props<{ content: string; messageId: string }>(),
    /** Dispatched when the OpenAI API responds successfully. */
    'Send Message Success': props<{ aiMessage: ChatMessage }>(),
    /** Dispatched when the OpenAI API call fails. */
    'Send Message Failure': props<{ error: string }>(),
    /** Clears any visible error banner. */
    'Clear Error': emptyProps()
  }
});
