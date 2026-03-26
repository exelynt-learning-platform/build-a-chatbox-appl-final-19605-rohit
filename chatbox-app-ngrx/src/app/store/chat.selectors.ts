import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState, chatFeatureKey } from './chat.state';

export const selectChatState = createFeatureSelector<ChatState>(chatFeatureKey);

export const selectAllMessages = createSelector(selectChatState, (state) => state.messages);
export const selectChatLoading = createSelector(selectChatState, (state) => state.loading);
export const selectChatError = createSelector(selectChatState, (state) => state.error);
