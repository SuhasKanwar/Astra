"use client";

import { useState } from 'react';
import EmptyState from '@/components/bot/EmptyState';
import ChatInput from '@/components/bot/ChatInput';
import { httpClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastProvider';

export default function BotPage() {
    const [suggestedQuery, setSuggestedQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { error: showError } = useToast();

    const loadConversation = (id: string) => {
        router.push(`/dashboard/bot/${id}`);
    };

    const handleSend = async (text: string) => {
        setIsLoading(true);
        try {
            const res = await httpClient.post('/api/conversation', {
                title: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
                variant: 'chat'
            });
            if (res.data?.success) {
                const newId = res.data.data.id;
                router.push(`/dashboard/bot/${newId}?q=${encodeURIComponent(text)}`);
            }
        } catch (err) {
            console.error("Failed to create conversation", err);
            showError("Failed to start chat", "Please try again later.");
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-col w-full h-full relative overflow-hidden bg-(--primary-bg-color)">
            <div className="flex-1 overflow-y-auto mt-20 pb-24 hide-scrollbar">
                <EmptyState onTopicSelect={setSuggestedQuery} onSelectConversation={loadConversation} />
            </div>

            <ChatInput
                onSend={handleSend}
                suggestedQuery={suggestedQuery}
                onClearSuggested={() => setSuggestedQuery("")}
                isLoading={isLoading}
            />
        </main>
    );
}