import React from 'react';
import type { Message } from '../backend';
import { detectLanguage } from '../utils/detectLanguage';
import { Bot, User, ImageIcon, VideoIcon, Download } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  imageUrl?: string;
  videoUrl?: string;
}

export function MessageBubble({ message, imageUrl, videoUrl }: MessageBubbleProps) {
  const isUser = message.fromUser;
  const lang = detectLanguage(message.text);
  const isRTL = lang.isRTL;

  const requestType = message.requestType.__kind__;

  const renderContent = () => {
    if (requestType === 'imageResponse' && imageUrl) {
      return (
        <div className="image-card max-w-sm">
          <div className="relative">
            <img
              src={imageUrl}
              alt="Generated image"
              className="w-full h-auto block"
              style={{ maxHeight: '320px', objectFit: 'cover' }}
            />
            <div className="absolute top-2 right-2">
              <a
                href={imageUrl}
                download="nexo-ai-image.png"
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  color: 'oklch(0.82 0.18 195)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Download size={12} />
                Save
              </a>
            </div>
          </div>
          {message.text && (
            <div className="px-4 py-3">
              <p
                className="text-sm"
                style={{ color: 'oklch(0.7 0.02 220)' }}
                dir={isRTL ? 'rtl' : 'auto'}
              >
                {message.text}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (requestType === 'videoResponse' && videoUrl) {
      return (
        <div className="video-card max-w-lg">
          <div className="relative">
            <img
              src={videoUrl}
              alt="Generated video preview"
              className="w-full h-auto block"
              style={{ maxHeight: '280px', objectFit: 'cover' }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.1)' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  color: 'oklch(0.75 0.15 280)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid oklch(0.75 0.15 280 / 0.4)',
                }}
              >
                <VideoIcon size={12} />
                Animated Preview
              </div>
            </div>
          </div>
          {message.text && (
            <div className="px-4 py-3">
              <p
                className="text-sm"
                style={{ color: 'oklch(0.7 0.02 220)' }}
                dir={isRTL ? 'rtl' : 'auto'}
              >
                {message.text}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Text message
    return (
      <p
        className="text-sm leading-relaxed whitespace-pre-wrap break-words"
        dir={isRTL ? 'rtl' : 'auto'}
        style={{
          color: isUser ? 'oklch(0.95 0 0)' : 'oklch(0.88 0 0)',
          unicodeBidi: 'plaintext',
        }}
      >
        {message.text}
      </p>
    );
  };

  const isImageReq = requestType === 'imageRequest';
  const isVideoReq = requestType === 'videoRequest';
  const isMediaResponse = requestType === 'imageResponse' || requestType === 'videoResponse';

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: isUser
            ? 'oklch(0.82 0.18 195 / 0.2)'
            : 'oklch(0.16 0.01 220)',
          border: isUser
            ? '1px solid oklch(0.82 0.18 195 / 0.4)'
            : '1px solid oklch(0.28 0.02 220)',
        }}
      >
        {isUser ? (
          <User size={14} style={{ color: 'oklch(0.82 0.18 195)' }} />
        ) : (
          <Bot size={14} style={{ color: 'oklch(0.82 0.18 195)' }} />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* Mode badge for requests */}
        {(isImageReq || isVideoReq) && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-1"
            style={{
              background: isImageReq
                ? 'oklch(0.82 0.18 195 / 0.1)'
                : 'oklch(0.75 0.15 280 / 0.1)',
              border: isImageReq
                ? '1px solid oklch(0.82 0.18 195 / 0.3)'
                : '1px solid oklch(0.75 0.15 280 / 0.3)',
              color: isImageReq
                ? 'oklch(0.82 0.18 195)'
                : 'oklch(0.75 0.15 280)',
            }}
          >
            {isImageReq ? <ImageIcon size={10} /> : <VideoIcon size={10} />}
            {isImageReq ? 'Image Prompt' : 'Video Prompt'}
          </div>
        )}

        <div
          className={`px-4 py-3 ${isMediaResponse ? '' : isUser ? 'message-user' : 'message-ai'}`}
          style={
            isMediaResponse
              ? {}
              : {
                  maxWidth: '100%',
                }
          }
        >
          {renderContent()}
        </div>

        {/* Timestamp */}
        <span
          className="text-xs px-1"
          style={{ color: 'oklch(0.4 0.01 220)' }}
        >
          {new Date(Number(message.timestamp) / 1_000_000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
