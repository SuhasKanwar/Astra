"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { httpClient } from "@/lib/api";
import { ChevronLeft, ChevronRight, ExternalLink, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

interface GeopoliticalEvent {
    id: string;
    title: string;
    description: string;
    sourceUrl: string;
    latitude: number;
    longitude: number;
    date: string;
    categoryTitle: string;
    matchedKeyword: string;
}

export default function GeopoliticalEventsCarousel() {
    const [events, setEvents] = useState<GeopoliticalEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get('/api/events/geopolitics');
                if (response.data?.success) {
                    setEvents(response.data.data || []);
                } else {
                    setError("Failed to load events");
                }
            } catch (err) {
                console.error("Geopolitical events fetch error:", err);
                setError("An error occurred while fetching events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="w-full h-48 rounded-xl border border-(--border-color) bg-(--surface-color) flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-(--primary-color) border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || events.length === 0) {
        return null;
    }

    return (
        <section className="w-full flex flex-col mt-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-(--primary-color)/10 rounded-lg">
                        <Globe2 className="w-5 h-5 text-(--primary-color)" />
                    </div>
                    <h2 className="text-xl font-bold text-(--primary-text-color)">Global Supply Chain <span className="text-(--primary-color)">Events</span></h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-lg bg-(--surface-strong-color) border border-(--border-color) hover:bg-(--surface-color) hover:text-(--primary-color) transition-colors text-(--secondary-text-color)"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-lg bg-(--surface-strong-color) border border-(--border-color) hover:bg-(--surface-color) hover:text-(--primary-color) transition-colors text-(--secondary-text-color)"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {events.map((event, idx) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="min-w-[300px] w-[300px] sm:min-w-[340px] sm:w-[340px] snap-start shrink-0 flex flex-col p-5 rounded-2xl border border-(--border-color) bg-(--surface-color) shadow-sm hover:border-(--primary-color)/50 transition-colors group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-(--primary-color)/5 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

                        <div className="flex justify-between items-start mb-3 gap-2 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-(--primary-color)/10 text-(--primary-color) px-2.5 py-1 rounded-md">
                                {event.matchedKeyword}
                            </span>
                            <span className="text-[11px] text-(--secondary-text-color) font-medium">
                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        <h3 className="text-[15px] font-bold text-(--primary-text-color) leading-snug mb-2 line-clamp-2 relative z-10">
                            {event.title}
                        </h3>

                        <p className="text-xs text-(--secondary-text-color) leading-relaxed mb-4 line-clamp-3 relative z-10 flex-1">
                            {event.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-(--border-color) relative z-10">
                            <Link
                                href={event.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold text-(--primary-color) hover:text-(--primary-color-hover) transition-colors"
                            >
                                Read full report <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}