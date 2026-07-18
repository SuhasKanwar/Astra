"use client";

import { useState } from 'react';
import EmptyState from '@/components/bot/EmptyState';
import ChatInput from '@/components/bot/ChatInput';
import ChatMessages, { Message } from '@/components/bot/ChatMessages';
import { httpClient } from '@/lib/api';

export default function BotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [suggestedQuery, setSuggestedQuery] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadConversation = async (id: string) => {
        setConversationId(id);
        setIsLoading(true);
        try {
            const res = await httpClient.get(`/api/conversation/chat/${id}`);
            if (res.data?.success) {
                const mappedMsgs: Message[] = res.data.data.map((c: any) => ({
                    id: c.id,
                    role: c.sender === 'user' ? 'user' : 'bot',
                    text: c.content || ''
                }));
                setMessages(mappedMsgs);
            }
        } catch (err) {
            console.error("Failed to load conversation", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (text: string) => {
        const tempId = Date.now().toString();
        const newUserMsg: Message = { id: tempId, role: 'user', text };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            let activeConvId = conversationId;
            
            if (!activeConvId) {
                const res = await httpClient.post('/api/conversation', {
                    title: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
                    variant: 'chat'
                });
                if (res.data?.success) {
                    activeConvId = res.data.data.id;
                    setConversationId(activeConvId);
                }
            }

            if (activeConvId) {
                const res = await httpClient.post(`/api/conversation/chat/${activeConvId}`, {
                    content: text
                });
                
                if (res.data?.success) {
                    const [userChat, botChat] = res.data.data;
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        const lastUserIdx = newMsgs.findIndex(m => m.id === tempId);
                        if (lastUserIdx !== -1) {
                            newMsgs[lastUserIdx] = { id: userChat.id, role: 'user', text: userChat.content };
                        }
                        newMsgs.push({ id: botChat.id, role: 'bot', text: botChat.content });
                        return newMsgs;
                    });
                } else {
                    setMessages(prev => [...prev, { 
                        id: Date.now().toString(), 
                        role: 'bot', 
                        text: 'I encountered an error processing your request. Please try again later.' 
                    }]);
                }
            }
        } catch (err) {
            console.error("Failed to send message", err);
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'bot', 
                text: 'A network or server error occurred. Please try again later.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-col w-full h-full relative overflow-hidden bg-(--primary-bg-color)">
            <div className="flex-1 overflow-y-auto mt-20 pb-24 hide-scrollbar">
                {messages.length === 0 && !conversationId ? (
                    <EmptyState onTopicSelect={setSuggestedQuery} onSelectConversation={loadConversation} />
                ) : (
                    <ChatMessages messages={messages} isLoading={isLoading} />
                )}
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