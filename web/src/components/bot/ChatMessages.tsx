"use client";

import { useEffect, useRef } from 'react';
import { User, Sparkles } from 'lucide-react';
import { md } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export interface Message {
    id: string;
    role: 'user' | 'bot';
    text: string;
}

interface ChatMessagesProps {
    messages: Message[];
    isLoading?: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const renderMessageText = (text: string) => {
        const processedText = text.replace(/(@[\w-]+)/g, '<span class="bg-blue-50 text-(--primary-color) px-1.5 py-0.5 rounded font-medium border border-blue-100 mx-0.5">$1</span>');
        return md.render(processedText).trim();
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 py-8 pb-32 max-w-6xl mx-auto w-full">
            <div className="space-y-8">
                {messages.map((msg, index) => (
                    <div 
                        key={msg.id} 
                        className={`flex animate-chat-message ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className={`flex w-full max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden ${msg.role === 'user' ? 'bg-(--primary-color) text-white ml-4 shadow-md' : 'bg-linear-to-br from-(--primary-color) to-purple-600 text-white mr-4 shadow-md'}`}>
                                {msg.role === 'user' ? (
                                    session?.user?.image ? (
                                        <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )
                                ) : (
                                    <Sparkles className="w-5 h-5" />
                                )}
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <div className={`px-6 py-4 rounded-3xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-(--primary-color) text-white rounded-tr-sm self-end'
                                    : 'bg-(--surface-color) border border-(--border-color) text-(--primary-text-color) rounded-tl-sm self-start inline-block'
                                    }`}>
                                    <div
                                        className={`leading-relaxed text-[15px] max-w-none [&>*:last-child]:mb-0 [&>*:first-child]:mt-0 whitespace-normal
                                            ${msg.role === 'bot'
                                                ? '[&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mb-2 [&>strong]:text-(--primary-text-color)'
                                                : '[&>p]:mb-0'
                                            }
                                        `}
                                        dangerouslySetInnerHTML={{ __html: renderMessageText(msg.text) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-chat-message">
                        <div className="flex w-full max-w-[70%] flex-row">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden bg-linear-to-br from-(--primary-color) to-purple-600 text-white mr-4 shadow-md">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="px-5 py-4 rounded-3xl shadow-sm bg-(--surface-color) border border-(--border-color) text-(--primary-text-color) rounded-tl-sm self-start inline-block">
                                    <div className="flex space-x-1.5 h-4 items-center px-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}