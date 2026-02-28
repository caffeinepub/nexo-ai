import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Conversation, MessageInput } from '../backend';
import { Principal } from '@dfinity/principal';

// Anonymous principal for unauthenticated users
const ANON_PRINCIPAL = Principal.anonymous();

function usePrincipal() {
  const { identity } = useInternetIdentity();
  return identity?.getPrincipal() ?? ANON_PRINCIPAL;
}

// ─── Conversations ────────────────────────────────────────────────────────────

export function useGetAllConversations() {
  const { actor, isFetching } = useActor();
  const principal = usePrincipal();

  return useQuery<Conversation[]>({
    queryKey: ['conversations', principal.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllConversations(principal);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetConversation(conversationId: string | null) {
  const { actor, isFetching } = useActor();
  const principal = usePrincipal();

  return useQuery<Conversation | null>({
    queryKey: ['conversation', conversationId, principal.toString()],
    queryFn: async () => {
      if (!actor || !conversationId) return null;
      const result = await actor.getConversation(principal, conversationId);
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!conversationId,
    refetchInterval: 3000,
  });
}

export function useAddConversation() {
  const { actor } = useActor();
  const principal = usePrincipal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addConversation(principal, title);
      return title;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useDeleteConversation() {
  const { actor } = useActor();
  const principal = usePrincipal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteConversation(principal, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export function useAddMessage() {
  const { actor } = useActor();
  const principal = usePrincipal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageInput,
    }: {
      conversationId: string;
      messageInput: MessageInput;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addMessage(principal, conversationId, messageInput);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['conversation', variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
