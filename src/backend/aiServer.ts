import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import type { AIResponse } from './mockFallback';

// 1. Get User Conversations
export const getConversationsServerFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const sessionId = getCookie('nurture_session');
    if (!sessionId) throw new Error('Unauthorized');
    
    try {
      const { getUserBySession, getUserConversations } = await import('./serverHelpers');
      const user = await getUserBySession(sessionId);
      if (!user) throw new Error('Unauthorized');
      
      return await getUserConversations(user.id);
    } catch (e) {
      console.error('Error fetching conversations:', e);
      return [];
    }
  });

// 2. Get Messages in a Conversation
export const getMessagesServerFn = createServerFn({ method: 'GET' })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const sessionId = getCookie('nurture_session');
    if (!sessionId) throw new Error('Unauthorized');
    
    try {
      const { getUserBySession, getConversationMessages } = await import('./serverHelpers');
      const user = await getUserBySession(sessionId);
      if (!user) throw new Error('Unauthorized');
      
      return await getConversationMessages(user.id, conversationId);
    } catch (e) {
      console.error('Error fetching messages:', e);
      return [];
    }
  });

// 3. Send AI Message and get Gemini Response
export const sendAIMessageServerFn = createServerFn({ method: 'POST' })
  .validator((data: { prompt: string; conversationId?: string; file?: { base64: string; mimeType: string; name: string } }) => data)
  .handler(async ({ data }) => {
    const { prompt, conversationId, file } = data;
    
    const sessionId = getCookie('nurture_session');
    if (!sessionId) throw new Error('Unauthorized');
    
    try {
      const { getUserBySession, sendAIMessage } = await import('./serverHelpers');
      const user = await getUserBySession(sessionId);
      if (!user) throw new Error('Unauthorized');
      
      return await sendAIMessage(user.id, prompt, conversationId, file);
    } catch (e: any) {
      console.error('Error in sendAIMessageServerFn:', e);
      throw e;
    }
  });

// 4. Delete Conversation
export const deleteConversationServerFn = createServerFn({ method: 'POST' })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const sessionId = getCookie('nurture_session');
    if (!sessionId) throw new Error('Unauthorized');
    
    try {
      const { getUserBySession, deleteConversation } = await import('./serverHelpers');
      const user = await getUserBySession(sessionId);
      if (!user) throw new Error('Unauthorized');
      
      await deleteConversation(user.id, conversationId);
      return { success: true };
    } catch (e) {
      console.error('Error deleting conversation:', e);
      throw e;
    }
  });

// 5. Toggle Pin Conversation
export const togglePinConversationServerFn = createServerFn({ method: 'POST' })
  .validator((conversationId: string) => conversationId)
  .handler(async ({ data: conversationId }) => {
    const sessionId = getCookie('nurture_session');
    if (!sessionId) throw new Error('Unauthorized');
    
    try {
      const { getUserBySession, togglePinConversation } = await import('./serverHelpers');
      const user = await getUserBySession(sessionId);
      if (!user) throw new Error('Unauthorized');
      
      const pinned = await togglePinConversation(user.id, conversationId);
      return { success: true, pinned };
    } catch (e) {
      console.error('Error toggling pin:', e);
      throw e;
    }
  });
