import React, { useState, useRef, useCallback } from 'react';
import { Send, ImageIcon, VideoIcon, MessageSquare, Loader2 } from 'lucide-react';
import { useAddMessage } from '../hooks/useQueries';
import { generateSimulatedResponse } from '../utils/generateSimulatedResponse';
import type { MessageInput } from '../backend';

type Mode = 'text' | 'image' | 'video';

interface InputBarProps {
  conversationId: string | null;
  onMessageSent?: () => void;
  disabled?: boolean;
}

export function InputBar({ conversationId, onMessageSent, disabled }: InputBarProps) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('text');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useAddMessage();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || !conversationId || isSending) return;

    setIsSending(true);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Build user message input
      let userRequestType: MessageInput['requestType'];
      if (mode === 'image') {
        userRequestType = { __kind__: 'imageRequest', imageRequest: null };
      } else if (mode === 'video') {
        userRequestType = { __kind__: 'videoRequest', videoRequest: null };
      } else {
        userRequestType = { __kind__: 'textRequest', textRequest: null };
      }

      const userMessage: MessageInput = {
        text,
        fromUser: true,
        requestType: userRequestType,
      };

      await addMessage.mutateAsync({ conversationId, messageInput: userMessage });

      // Simulate AI response delay
      await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

      // Generate simulated response
      const responseText = generateSimulatedResponse(text, mode);

      let aiRequestType: MessageInput['requestType'];
      if (mode === 'image') {
        aiRequestType = { __kind__: 'imageResponse', imageResponse: BigInt(0) };
      } else if (mode === 'video') {
        aiRequestType = { __kind__: 'videoResponse', videoResponse: BigInt(0) };
      } else {
        aiRequestType = { __kind__: 'textRequest', textRequest: null };
      }

      const aiMessage: MessageInput = {
        text: responseText,
        fromUser: false,
        requestType: aiRequestType,
      };

      await addMessage.mutateAsync({ conversationId, messageInput: aiMessage });
      onMessageSent?.();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  }, [input, conversationId, isSending, mode, addMessage, onMessageSent]);

  const canSend = input.trim().length > 0 && !!conversationId && !isSending && !disabled;

  const modeConfig = {
    text: {
      icon: <MessageSquare size={14} />,
      label: 'Chat',
      sendLabel: 'Send',
      placeholder: 'Ask NEXO AI anything... (supports all languages)',
    },
    image: {
      icon: <ImageIcon size={14} />,
      label: 'Image',
      sendLabel: 'Generate Image',
      placeholder: 'Describe the image you want to generate...',
    },
    video: {
      icon: <VideoIcon size={14} />,
      label: 'Video',
      sendLabel: 'Generate Video',
      placeholder: 'Describe the video you want to generate...',
    },
  };

  const current = modeConfig[mode];

  return (
    <div
      className="px-4 pb-4 pt-2"
      style={{ borderTop: '1px solid oklch(0.22 0.015 220 / 0.5)' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Mode selector */}
        <div className="flex items-center gap-2 mb-3">
          {(['text', 'image', 'video'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`mode-btn ${mode === m ? 'active' : ''}`}
              disabled={isSending}
            >
              {modeConfig[m].icon}
              {modeConfig[m].label}
            </button>
          ))}
          {mode !== 'text' && (
            <span
              className="text-xs ml-auto"
              style={{ color: 'oklch(0.45 0.02 220)' }}
            >
              {mode === 'image' ? '🎨 AI Image Generation' : '🎬 AI Video Generation'}
            </span>
          )}
        </div>

        {/* Input container */}
        <div
          className="nexo-glass-strong rounded-2xl flex flex-col gap-2 p-3"
          style={{
            border: isSending
              ? '1px solid oklch(0.82 0.18 195 / 0.4)'
              : '1px solid oklch(0.28 0.02 220 / 0.8)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: isSending ? '0 0 20px oklch(0.82 0.18 195 / 0.15)' : 'none',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={!conversationId ? 'Select or create a conversation to start...' : current.placeholder}
            disabled={!conversationId || isSending || disabled}
            dir="auto"
            rows={1}
            className="w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none"
            style={{
              color: 'oklch(0.92 0 0)',
              minHeight: '24px',
              maxHeight: '160px',
              caretColor: 'oklch(0.82 0.18 195)',
            }}
          />

          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: 'oklch(0.4 0.01 220)' }}
            >
              {input.length > 0 && `${input.length} chars`}
              {!conversationId && (
                <span style={{ color: 'oklch(0.5 0.02 220)' }}>
                  Create a conversation first
                </span>
              )}
            </span>

            <button
              onClick={handleSend}
              disabled={!canSend}
              className="nexo-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                minWidth: mode === 'text' ? '80px' : '140px',
                justifyContent: 'center',
              }}
            >
              {isSending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{mode === 'image' ? 'Generating...' : mode === 'video' ? 'Rendering...' : 'Thinking...'}</span>
                </>
              ) : (
                <>
                  {mode === 'text' ? <Send size={14} /> : mode === 'image' ? <ImageIcon size={14} /> : <VideoIcon size={14} />}
                  <span>{current.sendLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p
          className="text-center text-xs mt-2"
          style={{ color: 'oklch(0.38 0.01 220)' }}
        >
          NEXO AI can make mistakes. Supports all languages including Arabic, Chinese, Japanese, and more.
        </p>
      </div>
    </div>
  );
}
