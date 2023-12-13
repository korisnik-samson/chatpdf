'use client'
import React from 'react'
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MessageList from "@/components/MessageList";

const ChatComponent = () => {
    const { input, handleInputChange, handleSubmit, messages } = useChat()

    return (
        <div className="relative max-h-screen overflow-scroll">
            {/* Header */}
            <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
                <h3 className="text-xl font-bold">Chat</h3>
            </div>

            {/* message list */}
            <MessageList />

            <form onSubmit={handleSubmit}>
                <Input value={input} onChange={handleInputChange} placeholder="Ask any question..."
                className="w-full" />

                <Button className="bg-blue-600 ml-2">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}

export default ChatComponent;