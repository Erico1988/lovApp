import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, Users } from 'lucide-react';
import { Conversation } from '../../types/chat';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
}) => {
  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(
        (id) => id !== currentUserId
      );
      return otherParticipant || 'Utilisateur inconnu';
    }
    return conversation.name || 'Groupe sans nom';
  };

  return (
    <div className="border-r h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeConversationId === conversation.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                {conversation.type === 'direct' ? (
                  <User className="w-10 h-10 text-gray-400" />
                ) : (
                  <Users className="w-10 h-10 text-gray-400" />
                )}
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <div className="font-medium">
                  {getConversationName(conversation)}
                </div>
                {conversation.lastMessage && (
                  <div className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.content}
                  </div>
                )}
              </div>
              
              {conversation.lastMessage && (
                <div className="text-xs text-gray-400">
                  {format(new Date(conversation.lastMessage.timestamp), 'HH:mm', {
                    locale: fr,
                  })}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;