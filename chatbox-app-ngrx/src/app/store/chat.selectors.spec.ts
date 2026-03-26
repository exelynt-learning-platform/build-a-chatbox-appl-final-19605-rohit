import { ChatMessage } from '../models/chat-message.model';
import { selectAllMessages, selectChatError, selectChatLoading } from './chat.selectors';
import { ChatState } from './chat.state';

const userMsg: ChatMessage = {
  id: 'u1',
  role: 'user',
  content: 'Hello',
  createdAt: '2024-01-01T10:00:00.000Z'
};

const aiMsg: ChatMessage = {
  id: 'a1',
  role: 'assistant',
  content: 'Hi there!',
  createdAt: '2024-01-01T10:00:01.000Z'
};

const mockState = {
  chat: {
    messages: [userMsg, aiMsg],
    loading: true,
    error: 'Something went wrong'
  } as ChatState
};

describe('ChatSelectors', () => {
  it('selectAllMessages should return the messages array', () => {
    const result = selectAllMessages.projector(mockState.chat);
    expect(result).toEqual([userMsg, aiMsg]);
  });

  it('selectAllMessages should return empty array when no messages', () => {
    const result = selectAllMessages.projector({ ...mockState.chat, messages: [] });
    expect(result).toEqual([]);
  });

  it('selectChatLoading should return the loading flag', () => {
    const result = selectChatLoading.projector(mockState.chat);
    expect(result).toBeTrue();
  });

  it('selectChatLoading should return false when not loading', () => {
    const result = selectChatLoading.projector({ ...mockState.chat, loading: false });
    expect(result).toBeFalse();
  });

  it('selectChatError should return the error message', () => {
    const result = selectChatError.projector(mockState.chat);
    expect(result).toBe('Something went wrong');
  });

  it('selectChatError should return null when there is no error', () => {
    const result = selectChatError.projector({ ...mockState.chat, error: null });
    expect(result).toBeNull();
  });
});
