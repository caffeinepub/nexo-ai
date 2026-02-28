import React, { useState } from 'react';
import { Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useGetAllConversations, useAddConversation, useDeleteConversation } from '../hooks/useQueries';
import type { Conversation } from '../backend';

interface SidebarProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewChat: (id: string) => void;
}

function generateConversationTitle(): string {
  const adjectives = ['New', 'Quick', 'Deep', 'Smart', 'Creative', 'Curious', 'Bold'];
  const nouns = ['Chat', 'Session', 'Conversation', 'Dialogue', 'Exchange', 'Discussion'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj} ${noun} ${num}`;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function Sidebar({ selectedId, onSelect, onNewChat }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: conversations = [], isLoading } = useGetAllConversations();
  const addConversation = useAddConversation();
  const deleteConversation = useDeleteConversation();

  const handleNewChat = async () => {
    const title = generateConversationTitle();
    try {
      await addConversation.mutateAsync(title);
      onNewChat(title);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteConversation.mutateAsync(id);
      if (selectedId === id) {
        onSelect('');
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt)
  );

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 relative"
      style={{
        width: collapsed ? '60px' : '260px',
        minWidth: collapsed ? '60px' : '260px',
        background: 'oklch(0.11 0.006 220)',
        borderRight: '1px solid oklch(0.22 0.015 220 / 0.6)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: '1px solid oklch(0.22 0.015 220 / 0.5)' }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img
              src="/assets/generated/nexo-logo.dim_256x256.png"
              alt="NEXO AI"
              className="w-8 h-8 rounded-lg flex-shrink-0"
              style={{
                filter: 'drop-shadow(0 0 8px oklch(0.82 0.18 195 / 0.7))',
              }}
            />
            <div className="min-w-0">
              <h1
                className="text-base font-bold tracking-wide leading-none nexo-glow-text"
                style={{ letterSpacing: '0.08em' }}
              >
                NEXO AI
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'oklch(0.45 0.02 220)' }}
              >
                Your AI Assistant
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'oklch(0.55 0.18 195 / 0.7)' }}
              >
                Founded by Abishek
              </p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center w-full">
            <img
              src="/assets/generated/nexo-logo.dim_256x256.png"
              alt="NEXO AI"
              className="w-8 h-8 rounded-lg"
              style={{
                filter: 'drop-shadow(0 0 8px oklch(0.82 0.18 195 / 0.7))',
              }}
            />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors"
          style={{
            color: 'oklch(0.5 0.02 220)',
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.82 0.18 195)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.5 0.02 220)';
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-3">
        <button
          onClick={handleNewChat}
          disabled={addConversation.isPending}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm transition-all"
          style={{
            background: 'oklch(0.82 0.18 195 / 0.12)',
            border: '1px solid oklch(0.82 0.18 195 / 0.3)',
            color: 'oklch(0.82 0.18 195)',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.82 0.18 195 / 0.2)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 15px oklch(0.82 0.18 195 / 0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.82 0.18 195 / 0.12)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          {addConversation.isPending ? (
            <Loader2 size={16} className="animate-spin flex-shrink-0" />
          ) : (
            <Plus size={16} className="flex-shrink-0" />
          )}
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {!collapsed && (
          <p
            className="text-xs font-semibold uppercase tracking-widest px-2 mb-2"
            style={{ color: 'oklch(0.38 0.015 220)', letterSpacing: '0.12em' }}
          >
            Recent
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2
              size={20}
              className="animate-spin"
              style={{ color: 'oklch(0.82 0.18 195 / 0.5)' }}
            />
          </div>
        ) : sortedConversations.length === 0 ? (
          !collapsed && (
            <div className="text-center py-8 px-3">
              <MessageSquare
                size={24}
                className="mx-auto mb-2"
                style={{ color: 'oklch(0.35 0.015 220)' }}
              />
              <p
                className="text-xs"
                style={{ color: 'oklch(0.4 0.015 220)' }}
              >
                No conversations yet.
                <br />
                Start a new chat!
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-1">
            {sortedConversations.map((conv: Conversation) => (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`sidebar-item group ${selectedId === conv.id ? 'active' : ''}`}
                title={collapsed ? conv.title : undefined}
              >
                <MessageSquare
                  size={15}
                  className="flex-shrink-0"
                  style={{
                    color: selectedId === conv.id
                      ? 'oklch(0.82 0.18 195)'
                      : 'oklch(0.45 0.02 220)',
                  }}
                />
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate leading-tight"
                        style={{
                          color: selectedId === conv.id
                            ? 'oklch(0.92 0 0)'
                            : 'oklch(0.72 0.01 220)',
                        }}
                      >
                        {conv.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'oklch(0.4 0.01 220)' }}
                      >
                        {formatDate(conv.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, conv.id)}
                      disabled={deletingId === conv.id}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all"
                      style={{ color: 'oklch(0.55 0.02 220)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.65 0.22 25)';
                        (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.65 0.22 25 / 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.55 0.02 220)';
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      }}
                    >
                      {deletingId === conv.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div
          className="px-4 py-3"
          style={{ borderTop: '1px solid oklch(0.22 0.015 220 / 0.5)' }}
        >
          <p className="text-xs text-center" style={{ color: 'oklch(0.35 0.01 220)' }}>
            © {new Date().getFullYear()} NEXO AI
          </p>
        </div>
      )}
    </aside>
  );
}
