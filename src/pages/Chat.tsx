import React, { useState } from 'react';
import { MessageSquarePlus, Users } from 'lucide-react';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import useChat from '../hooks/useChat';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const { currentUser } = useAuth();
  const { state, sendMessage, selectConversation, createConversation } = useChat(currentUser?.id || '');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const handleNewChat = () => {
    // Exemple de création d'une nouvelle conversation
    const newConversationId = createConversation(
      ['user2'], // ID des participants
      'direct', // type de conversation
      undefined // nom (optionnel pour les conversations directes)
    );
    selectConversation(newConversationId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar des conversations */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            >
              <MessageSquarePlus className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <ConversationList
          conversations={state.conversations}
          activeConversationId={state.activeConversation}
          onSelectConversation={selectConversation}
          currentUserId={currentUser?.id || ''}
        />
      </div>

      {/* Zone principale de chat */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        {state.activeConversation ? (
          <ChatWindow
            conversation={state.conversations.find(c => c.id === state.activeConversation)!}
            messages={state.messages[state.activeConversation] || []}
            currentUserId={currentUser?.id || ''}
            onSendMessage={(content, attachments) => 
              sendMessage(state.activeConversation!, content, attachments)
            }
            onClose={() => selectConversation('')}
          />
        ) : (
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Vos conversations
            </h3>
            <p className="text-gray-500 mb-4">
              Sélectionnez une conversation ou commencez-en une nouvelle
            </p>
            <button
              onClick={handleNewChat}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquarePlus className="w-5 h-5 mr-2" />
              Nouvelle conversation
            </button>
          </div>
        )}
      </div>

      {/* Modal pour nouvelle conversation */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Nouvelle conversation</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants
              </label>
              <input
                type="text"
                placeholder="Rechercher des utilisateurs..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleNewChat();
                  setShowNewChatModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;