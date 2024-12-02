import React from 'react';
import { MoreVertical, Phone, Video, X } from 'lucide-react';
import { Conversation } from '../../types/chat';

interface ChatHeaderProps {
  conversation: Conversation;
  currentUserId: string;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  currentUserId,
  onClose,
}) => {
  const getConversationName = () => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(
        (id) => id !== currentUserId
      );
      return otherParticipant || 'Utilisateur inconnu';
    }
    return conversation.name || 'Groupe sans nom';
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="font-semibold">{getConversationName()}</h3>
          {conversation.type === 'group' && (
            <p className="text-sm text-gray-500">
              {conversation.participants.length} participants
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;