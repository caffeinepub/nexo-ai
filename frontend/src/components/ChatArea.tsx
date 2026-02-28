import React, { useEffect, useRef } from 'react';
import type { Conversation } from '../backend';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Sparkles, MessageSquare } from 'lucide-react';
import { generatePlaceholderImage } from '../utils/generatePlaceholderImage';
import { generatePlaceholderVideo } from '../utils/generatePlaceholderVideo';

interface ChatAreaProps {
  conversation: Conversation | null;
  isLoading: boolean;
  isTyping: boolean;
}

// Cache generated media to avoid regenerating on re-renders
const imageCache = new Map<string, string>();
const videoCache = new Map<string, string>();

function getOrGenerateImage(prompt: string): string {
  if (!imageCache.has(prompt)) {
    imageCache.set(prompt, generatePlaceholderImage(prompt));
  }
  return imageCache.get(prompt)!;
}

function getOrGenerateVideo(prompt: string): string {
  if (!videoCache.has(prompt)) {
    videoCache.set(prompt, generatePlaceholderVideo(prompt));
  }
  return videoCache.get(prompt)!;
}

export function ChatArea({ conversation, isLoading, isTyping }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'oklch(0.82 0.18 195 / 0.1)',
              border: '1px solid oklch(0.82 0.18 195 / 0.3)',
              boxShadow: '0 0 30px oklch(0.82 0.18 195 / 0.15)',
            }}
          >
            <Sparkles size={36} style={{ color: 'oklch(0.82 0.18 195)' }} />
          </div>
          <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'oklch(0.9 0 0)' }}
            >
              Welcome to NEXO AI
            </h2>
            <p style={{ color: 'oklch(0.55 0.02 220)' }} className="text-sm max-w-xs">
              Start a new conversation or select one from the sidebar to begin.
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: 'oklch(0.55 0.18 195 / 0.7)' }}
            >
              Founded by Abishek
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mt-4">
          {[
            { icon: '💬', title: 'Chat', desc: 'Ask anything in any language' },
            { icon: '🎨', title: 'Images', desc: 'Generate stunning visuals' },
            { icon: '🎬', title: 'Videos', desc: 'Create animated content' },
          ].map((f) => (
            <div
              key={f.title}
              className="nexo-glass rounded-xl p-4 text-center"
              style={{ border: '1px solid oklch(0.28 0.02 220 / 0.6)' }}
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div
                className="text-sm font-semibold mb-1"
                style={{ color: 'oklch(0.85 0 0)' }}
              >
                {f.title}
              </div>
              <div className="text-xs" style={{ color: 'oklch(0.5 0.02 220)' }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const messages = [...(conversation.messages ?? [])].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp)
  );

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <MessageSquare size={32} style={{ color: 'oklch(0.4 0.02 220)' }} />
          <p style={{ color: 'oklch(0.5 0.02 220)' }} className="text-sm">
            No messages yet. Start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {messages.map((message) => {
          const kind = message.requestType.__kind__;
          let imageUrl: string | undefined;
          let videoUrl: string | undefined;

          if (kind === 'imageResponse') {
            // Find the preceding imageRequest to get the prompt
            const msgIndex = messages.findIndex((m) => m.id === message.id);
            const prevMsg = msgIndex > 0 ? messages[msgIndex - 1] : null;
            const prompt = prevMsg?.text ?? message.text;
            imageUrl = getOrGenerateImage(prompt);
          }

          if (kind === 'videoResponse') {
            const msgIndex = messages.findIndex((m) => m.id === message.id);
            const prevMsg = msgIndex > 0 ? messages[msgIndex - 1] : null;
            const prompt = prevMsg?.text ?? message.text;
            videoUrl = getOrGenerateVideo(prompt);
          }

          return (
            <MessageBubble
              key={String(message.id)}
              message={message}
              imageUrl={imageUrl}
              videoUrl={videoUrl}
            />
          );
        })}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
