import React from 'react';
import { ChatPageProps } from '@/types'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";

const ChatPage = async ({ params: { chatId } }: ChatPageProps) => {
    const { userId } = await auth();
    
    if (!userId) return redirect('/sign-in')
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))

    if (!_chats) return redirect('/')
    if (!_chats.find(chat => chat.id === parseInt(chatId))) return redirect('/')

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId))

    return (
        <div className="flex max-h-screen no-scrollbar overflow-scroll">
            <div className="flex w-full max-h-screen no-scrollbar overflow-scroll">
                {/* chat sidebar */}
                <div className="flex-[1] max-w-xs">
                     <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
                </div>

                {/* pdf viewer */}
                <div className="max-h-screen p-4 no-scrollbar overflow-scroll flex-[5]">
                     <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
                </div>

                {/* chat component */}
                <div className="flex-[3] border-l-4 border-l-slate-200">
                     <ChatComponent chatId={parseInt(chatId)} />
                </div>
            </div>
        </div>
    );
}

export default ChatPage;