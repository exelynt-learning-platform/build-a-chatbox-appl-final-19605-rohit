import { ChatMessage } from '../models/chat-message.model';

export const chatFeatureKey = 'chat';

export interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

export const initialChatState: ChatState = {
  messages: [],
  loading: false,
  error: null
};
