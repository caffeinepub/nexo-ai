import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: bigint;
    text: string;
    timestamp: Time;
    fromUser: boolean;
    requestType: {
        __kind__: "textRequest";
        textRequest: null;
    } | {
        __kind__: "imageRequest";
        imageRequest: null;
    } | {
        __kind__: "videoResponse";
        videoResponse: bigint;
    } | {
        __kind__: "videoRequest";
        videoRequest: null;
    } | {
        __kind__: "imageResponse";
        imageResponse: bigint;
    };
}
export type Time = bigint;
export interface MessageInput {
    text: string;
    fromUser: boolean;
    requestType: {
        __kind__: "textRequest";
        textRequest: null;
    } | {
        __kind__: "imageRequest";
        imageRequest: null;
    } | {
        __kind__: "videoResponse";
        videoResponse: bigint;
    } | {
        __kind__: "videoRequest";
        videoRequest: null;
    } | {
        __kind__: "imageResponse";
        imageResponse: bigint;
    };
}
export interface Conversation {
    id: string;
    title: string;
    messages: Array<Message>;
    createdAt: Time;
}
export interface backendInterface {
    addConversation(userId: Principal, title: string): Promise<void>;
    addMessage(userId: Principal, conversationId: string, messageInput: MessageInput): Promise<void>;
    clearErrorMessages(userId: Principal, conversationId: string): Promise<void>;
    deleteConversation(userId: Principal, conversationId: string): Promise<void>;
    getAllConversations(_userId: Principal): Promise<Array<Conversation>>;
    getConversation(_userId: Principal, conversationId: string): Promise<Conversation | null>;
    getLastNConversations(_userId: Principal, n: bigint): Promise<Array<Conversation>>;
    getMessagesWithNRows(conversationId: string, numRows: bigint): Promise<Array<Message>>;
    renameConversation(_userId: Principal, from: string, to: string): Promise<void>;
    setMessages(userId: Principal, conversationId: string, newMessages: Array<Message>): Promise<void>;
    titleExists(_userId: Principal, title: string): Promise<boolean>;
}
