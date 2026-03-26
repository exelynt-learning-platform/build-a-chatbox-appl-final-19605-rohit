import { ChatActions } from './chat.actions';
import { chatReducer } from './chat.reducer';
import { ChatState, initialChatState } from './chat.state';
import { ChatMessage } from '../models/chat-message.model';

const mockAiMessage: ChatMessage = {
  id: 'ai-1',
  role: 'assistant',
  content: 'Hello, I am the AI!',
  createdAt: '2024-01-01T10:00:01.000Z'
};

describe('ChatReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const state = chatReducer(undefined, { type: '__unknown__' } as never);
    expect(state).toEqual(initialChatState);
  });

  describe('sendMessage', () => {
    it('should set loading to true', () => {
      const action = ChatActions.sendMessage({ content: 'Hello', messageId: 'msg-1' });
      const state = chatReducer(initialChatState, action);
      expect(state.loading).toBeTrue();
    });

    it('should clear any existing error', () => {
      const errorState: ChatState = { ...initialChatState, error: 'previous error' };
      const action = ChatActions.sendMessage({ content: 'Hi', messageId: 'msg-2' });
      const state = chatReducer(errorState, action);
      expect(state.error).toBeNull();
    });

    it('should immediately add the user message to the messages array', () => {
      const action = ChatActions.sendMessage({ content: 'Hello AI', messageId: 'msg-3' });
      const state = chatReducer(initialChatState, action);
      expect(state.messages.length).toBe(1);
      expect(state.messages[0].id).toBe('msg-3');
      expect(state.messages[0].role).toBe('user');
      expect(state.messages[0].content).toBe('Hello AI');
    });

    it('should preserve existing messages and append the new user message', () => {
      const existing: ChatState = {
        ...initialChatState,
        messages: [mockAiMessage]
      };
      const action = ChatActions.sendMessage({ content: 'Follow up', messageId: 'msg-4' });
      const state = chatReducer(existing, action);
      expect(state.messages.length).toBe(2);
      expect(state.messages[1].content).toBe('Follow up');
    });
  });

  describe('sendMessageSuccess', () => {
    it('should set loading to false', () => {
      const loadingState: ChatState = { ...initialChatState, loading: true };
      const action = ChatActions.sendMessageSuccess({ aiMessage: mockAiMessage });
      const state = chatReducer(loadingState, action);
      expect(state.loading).toBeFalse();
    });

    it('should append the AI message to the messages array', () => {
      const loadingState: ChatState = { ...initialChatState, loading: true };
      const action = ChatActions.sendMessageSuccess({ aiMessage: mockAiMessage });
      const state = chatReducer(loadingState, action);
      expect(state.messages.length).toBe(1);
      expect(state.messages[0]).toEqual(mockAiMessage);
    });
  });

  describe('sendMessageFailure', () => {
    it('should set loading to false', () => {
      const loadingState: ChatState = { ...initialChatState, loading: true };
      const action = ChatActions.sendMessageFailure({ error: 'API error' });
      const state = chatReducer(loadingState, action);
      expect(state.loading).toBeFalse();
    });

    it('should store the error message', () => {
      const action = ChatActions.sendMessageFailure({ error: 'Network failure' });
      const state = chatReducer(initialChatState, action);
      expect(state.error).toBe('Network failure');
    });

    it('should not alter the existing messages', () => {
      const existing: ChatState = { ...initialChatState, messages: [mockAiMessage] };
      const action = ChatActions.sendMessageFailure({ error: 'fail' });
      const state = chatReducer(existing, action);
      expect(state.messages).toEqual([mockAiMessage]);
    });
  });

  describe('clearError', () => {
    it('should set error to null', () => {
      const errorState: ChatState = { ...initialChatState, error: 'some error' };
      const action = ChatActions.clearError();
      const state = chatReducer(errorState, action);
      expect(state.error).toBeNull();
    });
  });
});
