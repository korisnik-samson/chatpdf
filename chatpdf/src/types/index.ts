import React from "react";
import { chats } from "@/lib/db/schema";
import { Message } from "ai/react";

export type ProviderProps = {
    children: React.ReactNode
};

export type PDFPage = {
    pageContent: string;
    metadata: {
        loc: { pageNumber: number }
    }
}

export type ChatPageProps = {
    params: {
        chatId: string
    }
}

export type DrizzleChat = typeof chats.$inferSelect;

export type ChatSideBarProps = {
    chats: DrizzleChat[],
    chatId: number
}

export type PDFViewerProps = {
    pdf_url: string
}

export type MessageListProps = {
    messages: Message[];
}

export type Metadata = {
    text: string,
    pageNumber: number
}

export type ChatComponentProps = {
    chatId: number
}