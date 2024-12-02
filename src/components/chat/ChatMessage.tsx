import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { File, Image, Link, Download } from 'lucide-react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'document':
        return <File className="w-4 h-4" />;
      case 'link':
        return <Link className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {!isCurrentUser && (
          <p className="text-xs font-medium mb-1">{message.senderName}</p>
        )}
        <p className="break-words">{message.content}</p>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={`flex items-center gap-2 p-2 rounded ${
                  isCurrentUser ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                {getAttachmentIcon(attachment.type)}
                <span className="text-sm flex-1 truncate">{attachment.name}</span>
                <a
                  href={attachment.url}
                  download
                  className={`p-1 rounded hover:bg-opacity-80 ${
                    isCurrentUser ? 'hover:bg-blue-700' : 'hover:bg-gray-300'
                  }`}
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
        
        <p
          className={`text-xs mt-1 ${
            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {format(new Date(message.timestamp), 'HH:mm', { locale: fr })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;