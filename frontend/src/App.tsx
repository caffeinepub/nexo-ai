import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { InputBar } from './components/InputBar';
import { ChatHeader } from './components/ChatHeader';
import { useGetConversation, useGetAllConversations } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const { data: conversations = [] } = useGetAllConversations();
  const { data: selectedConversation, isLoading: isConvLoading } = useGetConversation(
    selectedConversationId
  );

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      const sorted = [...conversations].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt)
      );
      setSelectedConversationId(sorted[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSelectConversation = (id: string) => {
    if (id) setSelectedConversationId(id);
  };

  const handleNewChat = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleMessageSent = () => {
    // Typing indicator is managed by InputBar's isSending state
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: 'oklch(0.1 0 0)',
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, oklch(0.82 0.18 195 / 0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, oklch(0.75 0.15 280 / 0.04) 0%, transparent 50%),
          url('/assets/generated/nexo-bg.dim_1920x1080.png')
        `,
        backgroundSize: 'auto, auto, cover',
        backgroundPosition: 'center, center, center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        selectedId={selectedConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <ChatHeader conversation={selectedConversation ?? null} />

        {/* Messages */}
        <ChatArea
          conversation={selectedConversation ?? null}
          isLoading={isConvLoading}
          isTyping={isTyping}
        />

        {/* Input */}
        <InputBar
          conversationId={selectedConversationId}
          onMessageSent={handleMessageSent}
          disabled={isConvLoading}
        />
      </main>

      {/* Footer attribution */}
      <div
        className="fixed bottom-0 right-0 px-3 py-1.5 text-xs z-50"
        style={{
          color: 'oklch(0.35 0.01 220)',
          background: 'oklch(0.1 0 0 / 0.8)',
          backdropFilter: 'blur(8px)',
          borderTopLeftRadius: '8px',
        }}
      >
        Built with{' '}
        <span style={{ color: 'oklch(0.65 0.22 25)' }}>♥</span>{' '}
        using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== 'undefined' ? window.location.hostname : 'nexo-ai'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'oklch(0.82 0.18 195)' }}
          className="hover:underline"
        >
          caffeine.ai
        </a>
      </div>

      <Toaster />
    </div>
  );
}
