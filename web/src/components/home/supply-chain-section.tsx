"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Ship, Anchor, MapPin } from "lucide-react";
import { WorldMap } from "@/components/ui/world-map";

export default function SupplyChainSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            containerRef.current,
                            { opacity: 0, scale: 0.9 },
                            { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-4 sm:px-8 bg-(--surface-strong-color) relative overflow-hidden" id="supply-chain">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-(--primary-text-color) tracking-tight">
                        Visualize Global <br className="hidden lg:block" /> <span className="text-transparent bg-clip-text bg-linear-to-r from-(--primary-color) to-(--secondary-color)">Movements</span>
                    </h2>
                    <p className="text-(--secondary-text-color) text-lg leading-relaxed">
                        Track your assets across the globe in real-time. Astra's advanced supply chain visualization provides an interactive, live map of shipments, routes, and potential bottlenecks.
                    </p>

                    <ul className="space-y-4 mt-4">
                        {[
                            "Live tracking of maritime and land freight",
                            "Dynamic route optimization suggestions",
                            "Instant disruption alerts based on weather & geopolitics"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-(--primary-text-color) font-medium">
                                <div className="w-6 h-6 rounded-full bg-(--secondary-color)/20 flex items-center justify-center text-(--secondary-color)">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    ref={containerRef}
                    className="lg:w-1/2 w-full relative h-100 sm:h-125 bg-linear-to-br from-(--surface-color) to-(--surface-strong-color) rounded-4xl border border-(--border-color) flex items-center justify-center overflow-hidden"
                    style={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 pointer-events-none z-0"></div>

                    <div className="relative w-full h-full z-10 p-4 flex items-center justify-center">
                        <WorldMap
                            lineColor="var(--primary-color)"
                            dots={[
                                {
                                    start: {
                                        lat: 64.2008,
                                        lng: -149.4937,
                                    },
                                    end: {
                                        lat: 34.0522,
                                        lng: -118.2437,
                                    },
                                },
                                {
                                    start: { lat: 64.2008, lng: -149.4937 },
                                    end: { lat: -15.7975, lng: -47.8919 },
                                },
                                {
                                    start: { lat: -15.7975, lng: -47.8919 },
                                    end: { lat: 38.7223, lng: -9.1393 },
                                },
                                {
                                    start: { lat: 51.5074, lng: -0.1278 },
                                    end: { lat: 28.6139, lng: 77.209 },
                                },
                                {
                                    start: { lat: 28.6139, lng: 77.209 },
                                    end: { lat: 43.1332, lng: 131.9113 },
                                },
                                {
                                    start: { lat: 28.6139, lng: 77.209 },
                                    end: { lat: -1.2921, lng: 36.8219 },
                                },
                            ]}
                        />
                    </div>

                    <div className="absolute top-6 right-6 bg-(--surface-color)/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-(--border-color) flex items-center gap-2 text-sm font-semibold text-(--primary-text-color)">
                        <Ship className="w-4 h-4 text-(--secondary-color)" />
                        Vessel Transit: Active
                    </div>
                    <div className="absolute bottom-6 left-6 bg-(--surface-color)/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-(--border-color) flex items-center gap-2 text-sm font-semibold text-(--primary-text-color)">
                        <MapPin className="w-4 h-4 text-(--primary-color)" />
                        3 Checkpoints Secured
                    </div>
                </div>

            </div>
        </section>
    );
}