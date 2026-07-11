"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { httpClient } from "@/lib/api";
import { Loader2, Flame, Wind, Mountain, AlertCircle, Activity } from "lucide-react";
import { WorldMap } from "@/components/ui/world-map";

interface NaturalEvent {
    id: string;
    title: string;
    description: string;
    link: string;
    closed: string | null;
    categoryId: string;
    categoryTitle: string;
    sourceId: string;
    sourceUrl: string;
    magnitudeValue: number | null;
    magnitudeUnit: string;
    date: string;
    geometryType: string;
    longitude: number;
    latitude: number;
}

export default function NaturalEventsWidget() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<NaturalEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    useEffect(() => {
        if (!session?.accessToken) return;

        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get('/api/events/natural');

                if (response.data?.success) {
                    setEvents(response.data.data || []);
                } else {
                    setError("Failed to load events");
                }
            } catch (err) {
                console.error("EONET fetch error:", err);
                setError("Unable to connect to NASA EONET");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [session?.accessToken]);

    const getCategoryIcon = (category?: string) => {
        if (!category) return AlertCircle;
        const cat = category.toLowerCase();
        if (cat.includes("wildfire")) return Flame;
        if (cat.includes("storm")) return Wind;
        if (cat.includes("volcano")) return Mountain;
        return AlertCircle;
    };

    if (!session) return null;

    const mapDots = events.map(ev => ({
        start: { lat: ev.latitude, lng: ev.longitude },
        end: { lat: ev.latitude, lng: ev.longitude }
    }));

    return (
        <section className="group w-full flex flex-col h-full bg-(--surface-color) border border-(--border-color) rounded-[1.5rem] shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between p-6 pb-4 shrink-0 bg-(--surface-strong-color) border-b border-(--border-color)">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-(--primary-text-color) flex items-center gap-2">
                            Live Natural Global <span className="text-(--primary-color)">Events</span>
                        </h2>
                        <p className="text-[11px] text-(--secondary-text-color) font-bold uppercase tracking-wider mt-0.5">NASA EONET</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center flex-1 min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-(--primary-color)" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 text-sm font-medium flex-1">
                    {error}
                </div>
            ) : events.length === 0 ? (
                <div className="flex items-center justify-center p-6 text-(--secondary-text-color) text-sm font-medium flex-1">
                    No active natural events detected.
                </div>
            ) : (
                <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                    <div className="w-full flex-1 relative bg-(--surface-strong-color) flex items-center justify-center">
                        <div className="relative w-full h-full z-10 p-4 flex items-center justify-center">
                            <WorldMap
                                dots={mapDots}
                                lineColor="#ef4444"
                                mapDotColor="#555555"
                                onDotHover={setHoveredIdx}
                                onDotClick={(idx) => {
                                    if (events[idx]?.sourceUrl) {
                                        window.open(events[idx].sourceUrl, '_blank');
                                    }
                                }}
                                isBlinking={false}
                            />
                        </div>
                    </div>

                    {hoveredIdx !== null && events[hoveredIdx] && (
                        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80 bg-(--surface-color)/95 backdrop-blur-md rounded-xl border border-(--border-color) shadow-xl p-4 z-20 transition-all pointer-events-none">
                            <div className="flex justify-between items-start mb-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-500">
                                        {(() => {
                                            const Icon = getCategoryIcon(events[hoveredIdx].categoryTitle);
                                            return <Icon className="w-3 h-3" />;
                                        })()}
                                        {events[hoveredIdx].categoryTitle}
                                    </div>
                                    {events[hoveredIdx].magnitudeValue && (
                                        <span className="text-[10px] font-bold text-(--primary-color) bg-(--primary-color)/10 px-2 py-1 rounded-md">
                                            {events[hoveredIdx].magnitudeValue} {events[hoveredIdx].magnitudeUnit}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-(--secondary-text-color) font-bold whitespace-nowrap">
                                    {new Date(events[hoveredIdx].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-(--primary-text-color) leading-snug mb-2">
                                {events[hoveredIdx].title}
                            </h3>
                            {events[hoveredIdx].description && (
                                <p className="text-xs text-(--secondary-text-color) leading-relaxed mb-3 line-clamp-2">
                                    {events[hoveredIdx].description}
                                </p>
                            )}
                            <div className="flex items-center justify-between text-[11px] font-semibold mt-auto pt-2 border-t border-(--border-color)">
                                <span className="text-(--secondary-text-color) tracking-wide">
                                    {Math.abs(events[hoveredIdx].latitude).toFixed(2)}°{events[hoveredIdx].latitude >= 0 ? 'N' : 'S'}, {Math.abs(events[hoveredIdx].longitude).toFixed(2)}°{events[hoveredIdx].longitude >= 0 ? 'E' : 'W'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}