"use client"
import React from 'react'
import { ChatSideBarProps } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ModeToggle from "@/components/ModeToggle";

const ChatSideBar = ({ chats, chatId }: ChatSideBarProps) => {
    return (
        <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
            <Link href='/'>
                <div className="w-full">
                    <Button className="border-dashed border-white border">
                        <PlusCircle className='mr-2 w-4 h-4' />
                        New Chat
                    </Button>
                    {/* <ModeToggle /> */}
                </div>
            </Link>

            <div className="flex flex-col gap-2 mt-4">
                {chats.map(chat => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className={
                            cn('rounded-lg p-3 text-slate-300 flex items-center', {
                                'bg-blue-600 text-white': chat.id === chatId,
                                'hover:text-white': chat.id !== chatId
                            })
                        }>
                            <MessageCircle className="mr-2" />
                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                                {chat.pdfName}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                    <Link href='/'>Home</Link>
                    <Link href='/'>Source</Link>
                    {/* Stripe or PayPal Button */}
                </div>
            </div>
        </div>
    );
}

export default ChatSideBar;