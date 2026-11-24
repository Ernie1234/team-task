// Socket.IO payloads: chat messages, presence and typing

export type ChatType = "workspace" | "project" | "direct";

export interface MessageAttachment {
  url: string; // "/uploads/chat/..." on the API server; see fileUrl()
  name: string;
  size: number;
  mimeType: string;
}

export interface Message {
  _id: string;
  content: string;
  chatType: ChatType;
  // null if the sender's account was deleted
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  } | null;
  workspace?: string;
  project?: string;
  participants?: string[];
  messageType: "text" | "image" | "file" | "system";
  attachments?: MessageAttachment[];
  replyTo?: Pick<Message, "_id" | "content" | "sender" | "attachments" | "isDeleted"> | null;
  isEdited: boolean;
  isDeleted: boolean;
  reactions: Array<{
    // Populated by the server on reaction updates; a plain id otherwise
    user: string | { _id: string; name: string; profilePicture?: string };
    emoji: string;
  }>;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  // Only on this device's optimistic copy, until the server confirms it
  clientId?: string;
  clientStatus?: "sending" | "failed";
  clientError?: string;
  clientProgress?: number;
}

// Every chat event carries the room it belongs to
export interface NewMessageEvent {
  message: Message;
  roomId: string;
  clientId?: string;
}
export interface OnlineUser {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  isOnline: boolean;
  lastSeen?: string;
}

// Live presence for one user, as sent by the server
export interface PresenceUpdate {
  userId: string;
  isOnline: boolean;
  lastSeen: string | null;
}

export interface TypingUser {
  userId: string;
  userName: string;
  profilePicture?: string;
}
