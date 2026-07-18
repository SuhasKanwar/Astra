"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { TAG_CONTEXTS } from '@/data/tag-context';

interface ChatInputProps {
    onSend: (message: string) => void;
    suggestedQuery?: string;
    onClearSuggested?: () => void;
    isLoading?: boolean;
}

export default function ChatInput({ onSend, suggestedQuery, onClearSuggested, isLoading }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [mounted, setMounted] = useState(false);

    const [showDropdown, setShowDropdown] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (showDropdown && listRef.current) {
            const activeEl = listRef.current.children[activeIndex] as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [activeIndex, showDropdown]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (suggestedQuery) {
            setInput(suggestedQuery);
            onClearSuggested?.();
            inputRef.current?.focus();
        }
    }, [suggestedQuery, onClearSuggested]);

    const { start, active, supported } = useSpeechRecognition({
        onResult: (text) => {
            setInput((prev) => prev ? prev + ' ' + text : text);
        },
        onError: (err) => console.error(err)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        if (input.trim()) {
            onSend(input);
            setInput('');
            setShowDropdown(false);
        }
    };

    const filteredContexts = TAG_CONTEXTS.filter(ctx =>
        ctx.trigger.toLowerCase().includes(filterText.toLowerCase()) ||
        ctx.label.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        const match = val.match(/@([\w-]*)$/);
        if (match) {
            setFilterText(match[1]);
            setShowDropdown(true);
            setActiveIndex(0);
        } else {
            setShowDropdown(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown || filteredContexts.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % filteredContexts.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + filteredContexts.length) % filteredContexts.length);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            insertTag(filteredContexts[activeIndex].trigger);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    const insertTag = (trigger: string) => {
        const newVal = input.replace(/@[\w-]*$/, trigger + ' ');
        setInput(newVal);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    const renderOverlayText = () => {
        if (!input) return <span className="text-gray-400">Ask or search for anything. Use @ to tag an expert.</span>;

        const parts = input.split(/(@[\w-]+)/g);
        return parts.map((part, i) => {
            if (part.startsWith('@')) {
                return <span key={i} className="text-(--primary-color) bg-blue-50 rounded">{part}</span>;
            }
            return <span key={i} className="text-(--primary-text-color)">{part}</span>;
        });
    };

    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 flex flex-col">
            {showDropdown && filteredContexts.length > 0 && (
                <div className="mb-2 bg-(--surface-color) border border-(--border-color) rounded-2xl shadow-xl overflow-hidden self-start min-w-65 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="px-3 py-2 text-xs font-semibold text-(--secondary-text-color) bg-gray-50 border-b border-(--border-color)">
                        Select a persona
                    </div>
                    <ul ref={listRef} className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {filteredContexts.map((ctx, idx) => (
                            <li
                                key={ctx.id}
                                onClick={() => insertTag(ctx.trigger)}
                                className={`px-3 py-2.5 rounded-xl cursor-pointer flex flex-col transition-colors ${idx === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                <span className={`text-sm font-semibold ${idx === activeIndex ? 'text-(--primary-color)' : 'text-(--primary-text-color)'}`}>
                                    {ctx.label} <span className="font-normal opacity-70 ml-1 text-xs">({ctx.trigger})</span>
                                </span>
                                <span className={`text-xs mt-0.5 ${idx === activeIndex ? 'text-blue-500' : 'text-gray-500'}`}>{ctx.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center bg-(--surface-color) border border-(--border-color) rounded-full px-2 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative z-10 focus-within:border-(--primary-color) focus-within:shadow-[0_12px_40px_rgb(0,0,0,0.12)] focus-within:ring-4 focus-within:ring-(--primary-color)/10 focus-within:-translate-y-1 transition-all duration-300">
                {mounted && supported && (
                    <button
                        type="button"
                        onClick={start}
                        disabled={isLoading}
                        title="Voice Input"
                        className={`p-2 rounded-full transition-colors mr-2 ${active ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                    >
                        {active ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                )}

                <div className="relative flex-1">
                    <div className="absolute inset-0 pointer-events-none whitespace-pre text-sm flex items-center overflow-hidden font-sans m-0 p-0 tracking-normal leading-normal" aria-hidden="true">
                        {renderOverlayText()}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="w-full bg-transparent outline-none text-transparent caret-(--primary-text-color) text-sm relative z-10 font-sans m-0 p-0 tracking-normal leading-normal block disabled:opacity-50"
                        spellCheck={false}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-2 rounded-full transition-colors ml-2 flex items-center justify-center w-9 h-9 mr-1 shrink-0
                        ${input.trim()
                            ? 'bg-(--primary-color) text-white hover:bg-blue-700 shadow-md'
                            : 'bg-gray-100 text-gray-400'}`}
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}