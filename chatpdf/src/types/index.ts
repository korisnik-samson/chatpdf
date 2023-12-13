import React from "react";
import { chats, DrizzleChat } from "@/lib/db/schema";

export type Props = {
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

export type ChatSideBarProps = {
    chats: DrizzleChat[],
    chatId: number
}

export type PDFViewerProps = {
    pdf_url: string
}