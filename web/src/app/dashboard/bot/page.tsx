"use client";

import { useState } from 'react';
import EmptyState from '@/components/bot/EmptyState';
import ChatInput from '@/components/bot/ChatInput';
import ChatMessages, { Message } from '@/components/bot/ChatMessages';

export default function BotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [suggestedQuery, setSuggestedQuery] = useState("");

    const handleSend = (text: string) => {
        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text };
        setMessages(prev => [...prev, newUserMsg]);

        setTimeout(() => {
            const newBotMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: "I am Astra. I'm currently running in UI-only mode, but my intelligence systems will be wired up soon to assist you with supply chain analysis!"
            };
            setMessages(prev => [...prev, newBotMsg]);
        }, 1000);
    };

    return (
        <main className="flex flex-col w-full h-full relative overflow-hidden bg-(--primary-bg-color)">
            <div className="flex-1 overflow-y-auto mt-20 pb-24 hide-scrollbar">
                {messages.length === 0 ? (
                    <EmptyState onTopicSelect={setSuggestedQuery} />
                ) : (
                    <ChatMessages messages={messages} />
                )}
            </div>

            <ChatInput
                onSend={handleSend}
                suggestedQuery={suggestedQuery}
                onClearSuggested={() => setSuggestedQuery("")}
            />
        </main>
    );
}