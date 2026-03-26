import { createReducer, on } from '@ngrx/store';
import { ChatActions } from './chat.actions';
import { initialChatState } from './chat.state';

/**
 * Pure reducer for the chat feature slice.
 * On sendMessage the user's bubble is added immediately (optimistic update),
 * so the UI feels instant regardless of API latency.
 */
export const chatReducer = createReducer(
  initialChatState,

  on(ChatActions.sendMessage, (state, { content, messageId }) => ({
    ...state,
    loading: true,
    error: null,
    messages: [
      ...state.messages,
      {
        id: messageId,
        role: 'user' as const,
        content,
        createdAt: new Date().toISOString()
      }
    ]
  })),

  on(ChatActions.sendMessageSuccess, (state, { aiMessage }) => ({
    ...state,
    loading: false,
    messages: [...state.messages, aiMessage]
  })),

  on(ChatActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ChatActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
