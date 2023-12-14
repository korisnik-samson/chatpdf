import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { content_a, content_b } from "@/constants";
import { Message } from "ai/react";

const config = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
});

const openai = new OpenAIApi(config)

export async function POST(req: Request) {
    try {
        const { messages, chatId } = await req.json();
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId))

        if (_chats.length != 1) return NextResponse.json({
            'error': 'chat not found'}, { status: 404 })

        const fileKey = _chats[0].fileKey
        const lastMessage = messages[messages.length - 1];
        const context = await getContext(lastMessage.content, fileKey)

        const prompt = {
            role: 'system',
            content: `${content_a}
                ${context}
                ${content_b}`,
        }

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: {
                prompt, ...messages.filter((message: Message) => message.role === 'user')
            },
            stream: true
        })

        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream)

    } catch (error: any) {
        console.log('OpenAI Error: ', error.message)
    }
}