"use client";

import { useSession } from 'next-auth/react';
import {
    FileBarChart,
    Globe,
    Clock,
    Activity,
    History,
    X,
    ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { httpClient } from '@/lib/api';
import Link from 'next/link';

const TRENDING_TOPICS = [
    { name: "Semiconductor Export Controls", query: "What are the latest semiconductor export controls and their supply chain impact?", icon: <Activity className="w-4 h-4 mr-3 text-blue-500" /> },
    { name: "Suez Canal Rerouting Costs", query: "Analyze the current costs of rerouting shipping away from the Suez Canal.", icon: <Globe className="w-4 h-4 mr-3 text-orange-500" /> },
    { name: "European Energy Price Volatility", query: "Summarize the recent volatility in European energy prices and its industrial effect.", icon: <FileBarChart className="w-4 h-4 mr-3 text-red-500" /> }
];

const RECENT_CHATS = [
    {
        title: "Impact of US elections on semiconductor trade",
        timeText: "2 hours ago",
        dotColor: "bg-blue-500"
    },
    {
        title: "Red Sea shipping delays analysis",
        timeText: "Yesterday",
        dotColor: "bg-purple-500"
    },
    {
        title: "European tariff modeling for Q4",
        timeText: "3 days ago",
        dotColor: "bg-green-500"
    }
];

function HistoryModal({ isOpen, onClose, chats }: { isOpen: boolean, onClose: () => void, chats: typeof RECENT_CHATS }) {
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    const completeHistory = [
        ...chats,
        { title: "Supply chain mapping for vital components", timeText: "1 week ago", dotColor: "bg-blue-500" },
        { title: "Review of global shipping bottlenecks", timeText: "2 weeks ago", dotColor: "bg-purple-500" },
        { title: "Analysis of raw material shortages in LATAM", timeText: "1 month ago", dotColor: "bg-red-500" },
        { title: "Tariff implications for electric vehicles", timeText: "1 month ago", dotColor: "bg-green-500" },
        { title: "Logistics optimization report", timeText: "2 months ago", dotColor: "bg-orange-500" }
    ];

    return (
        <div className={`fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-(--surface-color) border border-(--border-color) rounded-3xl p-6 w-full max-w-2xl shadow-2xl transition-all duration-300 ease-out transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center text-(--primary-text-color)">
                        <History className="w-5 h-5 mr-2 text-(--primary-color)" /> Complete Chat History
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {completeHistory.map((chat, idx) => (
                        <div key={idx} className="flex items-center text-sm justify-between hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${chat.dotColor} mr-4`}></div>
                                <span className="font-medium text-(--primary-text-color)">{chat.title}</span>
                            </div>
                            <span className="flex items-center text-gray-500 text-xs font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <Clock className="w-3 h-3 mr-1.5" /> {chat.timeText}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface EmptyStateProps {
    onTopicSelect?: (query: string) => void;
}

export default function EmptyState({ onTopicSelect }: EmptyStateProps = {}) {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alert, setAlert] = useState<any>(null);
    const userName = session?.user?.name ? session.user.name.split(' ')[0] : "User";

    useEffect(() => {
        const fetchAlert = async () => {
            try {
                const res = await httpClient.get('/api/events/geopolitics?limit=1');
                if (res.data?.success && res.data.data?.length > 0) {
                    setAlert(res.data.data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch alert", err);
            }
        };
        fetchAlert();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-[70vh] justify-center max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-semibold text-(--primary-text-color) mb-2 mt-4">
                <span className="bg-[#E0F2FE] px-4 py-1.5 rounded-3xl text-[#0284C7] inline-block mb-3">
                    Welcome, {userName}! 👋
                </span>
                <br />
                <span className="text-(--secondary-text-color) text-5xl">How can I help you today?</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="border border-(--border-color) bg-(--surface-color) rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center text-(--secondary-text-color) text-sm mb-4 font-medium">
                        <Activity className="w-4 h-4 mr-2" /> Trending Topics
                    </div>
                    <ul className="space-y-3">
                        {TRENDING_TOPICS.map((topic, idx) => (
                            <li
                                key={idx}
                                onClick={() => onTopicSelect?.(topic.query)}
                                className="flex items-center text-sm font-medium cursor-pointer hover:text-(--primary-color) transition-colors"
                            >
                                {topic.icon} {topic.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border border-(--border-color) bg-(--surface-color) rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-(--secondary-text-color) text-sm font-medium">
                            <Globe className="w-4 h-4 mr-2" /> Recent Geopolitical Alert
                        </div>
                        {alert && (
                            <Link href={alert.sourceUrl} target="_blank" className="text-xs text-(--primary-color) hover:underline flex items-center">
                                Source <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center bg-(--primary-bg-color) p-3 rounded-xl border border-(--border-color)">
                        <div className="w-14 h-14 bg-gray-200 rounded-lg mr-4 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                            {alert?.imageUrl ? (
                                <img src={alert.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Activity className="w-6 h-6 text-orange-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-(--primary-text-color) text-sm line-clamp-2 leading-snug">
                                {alert ? alert.title : "Fetching latest global alert..."}
                            </div>
                            {alert && (
                                <div className="text-xs text-(--secondary-text-color) mt-1.5 flex items-center gap-2">
                                    <span className="uppercase font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">{alert.matchedKeyword}</span>
                                    <span>•</span>
                                    <span>{new Date(alert.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-(--border-color) bg-(--surface-color) rounded-2xl p-5 shadow-sm mt-4 mb-10">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center font-semibold text-(--primary-text-color)">
                        <History className="w-5 h-5 mr-2 text-(--secondary-text-color)" /> Recent Chat History
                        <span className="text-(--secondary-text-color) ml-2 font-normal text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                            {RECENT_CHATS.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="border border-(--primary-color) text-(--primary-color) px-4 py-1.5 rounded-full text-sm font-medium flex items-center hover:bg-blue-50 transition-colors"
                    >
                        View complete history
                    </button>
                </div>

                <ul className="space-y-4">
                    {RECENT_CHATS.map((chat, idx) => (
                        <li key={idx} className="flex items-center text-sm justify-between hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${chat.dotColor} mr-3`}></div>
                                <span className="w-64 font-medium text-(--primary-text-color) truncate">{chat.title}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="flex items-center text-gray-500 text-xs font-medium">
                                    <Clock className="w-3 h-3 mr-1" /> {chat.timeText}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <HistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} chats={RECENT_CHATS} />
        </div>
    );
}