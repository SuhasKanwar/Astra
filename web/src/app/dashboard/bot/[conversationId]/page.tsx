"use client";

import { useState, useEffect, useRef, use } from 'react';
import ChatInput from '@/components/bot/ChatInput';
import ChatMessages, { Message } from '@/components/bot/ChatMessages';
import { httpClient } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useToast } from '@/context/ToastProvider';

export default function ActiveConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
    const { conversationId } = use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const isInitialLoad = useRef(true);
    const { error: showError } = useToast();

    useEffect(() => {
        let isCancelled = false;

        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const chatRes = await httpClient.get(`/api/conversation/chat/${conversationId}`);
                if (chatRes.data?.success) {
                    const mappedMsgs: Message[] = chatRes.data.data.map((c: any) => ({
                        id: c.id,
                        role: c.sender === 'user' ? 'user' : 'bot',
                        text: c.content || ''
                    }));
                    if (!isCancelled) {
                        setMessages(prev => {
                            const merged = [...mappedMsgs];
                            prev.forEach(msg => {
                                if (!merged.find(m => m.id === msg.id)) {
                                    merged.push(msg);
                                }
                            });
                            return merged;
                        });
                    }
                }

                if (!isCancelled && isInitialLoad.current) {
                    isInitialLoad.current = false;
                    const q = searchParams.get('q');
                    if (q) {
                        router.replace(`/dashboard/bot/${conversationId}`);
                        await handleSend(q);
                    }
                }
            } catch (err) {
                console.error("Failed to load conversation", err);
                if (!isCancelled) showError("Failed to load chat", "Could not load the chat history.");
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        fetchHistory();

        return () => {
            isCancelled = true;
        };
    }, [conversationId]);

    const handleSend = async (text: string) => {
        const tempId = Date.now().toString();
        const newUserMsg: Message = { id: tempId, role: 'user', text };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            const res = await httpClient.post(`/api/conversation/chat/${conversationId}`, {
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
                showError("Failed to process message", "The AI service encountered an error.");
            }
        } catch (err) {
            console.error("Failed to send message", err);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'bot',
                text: 'A network or server error occurred. Please try again later.'
            }]);
            showError("Network error", "A network or server error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-col w-full h-full relative overflow-hidden bg-(--primary-bg-color)">
            <div className="absolute top-0 left-5 inset-x-0 z-20 flex items-center px-6 py-6 pointer-events-none">
                <button
                    onClick={() => router.push('/dashboard/bot')}
                    className="pointer-events-auto group flex items-center space-x-2 px-4 py-2 bg-white/70 hover:bg-white/95 rounded-full border border-gray-200/50 shadow-sm transition-all hover:shadow-md text-gray-600 backdrop-blur-md"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-gray-500" />
                    <span className="text-sm font-semibold">Back</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-24 pb-24 hide-scrollbar">
                <ChatMessages messages={messages} isLoading={isLoading} />
            </div>

            <ChatInput
                onSend={handleSend}
                isLoading={isLoading}
            />
        </main>
    );
}