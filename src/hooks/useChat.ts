import { useState, useCallback } from 'react';
import { Message, Conversation, ChatState } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

const useChat = (currentUserId: string) => {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    messages: {},
    loading: false,
    error: null,
  });

  const sendMessage = useCallback(
    (conversationId: string, content: string, attachments: File[] = []) => {
      const newMessage: Message = {
        id: uuidv4(),
        content,
        senderId: currentUserId,
        senderName: 'Current User', // This should come from user context/state
        timestamp: new Date().toISOString(),
        attachments: attachments.map(file => ({
          id: uuidv4(),
          type: file.type.startsWith('image/') ? 'image' : 'document',
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        })),
        readBy: [currentUserId],
      };

      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: [...(prev.messages[conversationId] || []), newMessage],
        },
        conversations: prev.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: newMessage,
                updatedAt: new Date().toISOString(),
              }
            : conv
        ),
      }));
    },
    [currentUserId]
  );

  const selectConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      activeConversation: conversationId,
      conversations: prev.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }));
  }, []);

  const createConversation = useCallback(
    (participants: string[], type: 'direct' | 'group', name?: string) => {
      const newConversation: Conversation = {
        id: uuidv4(),
        type,
        participants: [...participants, currentUserId],
        name,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        conversations: [...prev.conversations, newConversation],
        activeConversation: newConversation.id,
      }));

      return newConversation.id;
    },
    [currentUserId]
  );

  return {
    state,
    sendMessage,
    selectConversation,
    createConversation,
  };
};

export default useChat;