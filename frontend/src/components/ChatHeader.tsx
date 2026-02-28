import React from 'react';
import type { Conversation } from '../backend';
import { MessageSquare, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  conversation: Conversation | null;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <header
      className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
      style={{
        borderBottom: '1px solid oklch(0.22 0.015 220 / 0.5)',
        background: 'oklch(0.11 0.006 220 / 0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {conversation ? (
        <>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'oklch(0.82 0.18 195 / 0.12)',
              border: '1px solid oklch(0.82 0.18 195 / 0.3)',
            }}
          >
            <MessageSquare size={15} style={{ color: 'oklch(0.82 0.18 195)' }} />
          </div>
          <div className="min-w-0">
            <h2
              className="text-sm font-semibold truncate"
              style={{ color: 'oklch(0.9 0 0)' }}
            >
              {conversation.title}
            </h2>
            <p className="text-xs" style={{ color: 'oklch(0.45 0.02 220)' }}>
              {conversation.messages?.length ?? 0} messages
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'oklch(0.82 0.18 195 / 0.08)',
              border: '1px solid oklch(0.28 0.02 220)',
            }}
          >
            <Sparkles size={15} style={{ color: 'oklch(0.82 0.18 195)' }} />
          </div>
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: 'oklch(0.9 0 0)' }}
            >
              NEXO AI
            </h2>
            <p className="text-xs" style={{ color: 'oklch(0.45 0.02 220)' }}>
              Multilingual AI Assistant
            </p>
          </div>
        </>
      )}

      {/* Status indicator */}
      <div className="ml-auto flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: 'oklch(0.75 0.18 145)',
            boxShadow: '0 0 6px oklch(0.75 0.18 145 / 0.8)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
        <span className="text-xs" style={{ color: 'oklch(0.5 0.02 220)' }}>
          Online
        </span>
      </div>
    </header>
  );
}
