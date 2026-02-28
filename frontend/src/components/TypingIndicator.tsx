import React from 'react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: 'oklch(0.16 0.01 220)',
          border: '1px solid oklch(0.28 0.02 220)',
        }}
      >
        <Bot size={14} style={{ color: 'oklch(0.82 0.18 195)' }} />
      </div>
      <div
        className="px-4 py-3 message-ai flex items-center gap-1.5"
        style={{ minWidth: '64px' }}
      >
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}
