"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Card from "@/components/ui/card";
import { ShieldCheck, Zap, Activity, BrainCircuit, Globe2, LineChart } from "lucide-react";

const FEATURES = [
    {
        title: "Real-time Monitoring",
        description: "Track global supply chain movements instantly with live satellite data feeds.",
        icon: Activity,
    },
    {
        title: "Predictive Analytics",
        description: "Anticipate disruptions before they happen using our advanced ML models.",
        icon: BrainCircuit,
    },
    {
        title: "Global Coverage",
        description: "Complete visibility across all major shipping routes and energy corridors.",
        icon: Globe2,
    },
    {
        title: "Actionable Insights",
        description: "Receive deduced, prioritized alerts on potential security risks.",
        icon: Zap,
    },
    {
        title: "Risk Mitigation",
        description: "Automatically generate strategies to reroute and secure energy assets.",
        icon: ShieldCheck,
    },
    {
        title: "Market Intelligence",
        description: "Correlate geopolitical events with market signals for complete awareness.",
        icon: LineChart,
    },
];

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            cardsRef.current,
                            { y: 50, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-4 sm:px-8 bg-(--primary-bg-color) relative z-10" id="features">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-(--primary-text-color) tracking-tight mb-4">
                        Unmatched <span className="text-transparent bg-clip-text bg-linear-to-r from-(--primary-color) to-(--secondary-color)">Intelligence</span>
                    </h2>
                    <p className="text-(--secondary-text-color) text-lg max-w-2xl mx-auto">
                        Astra equips you with next-generation tools to secure and optimize your energy supply chain operations globally.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, idx) => (
                        <div
                            key={idx}
                            ref={(el) => {
                                cardsRef.current[idx] = el;
                            }}
                            style={{ opacity: 0 }}
                        >
                            <Card className="h-full p-8 flex flex-col items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
                                <div className="p-3 bg-(--primary-color)/10 rounded-xl">
                                    <feature.icon className="w-8 h-8 text-(--primary-color)" />
                                </div>
                                <h3 className="text-xl font-bold text-(--primary-text-color)">
                                    {feature.title}
                                </h3>
                                <p className="text-(--secondary-text-color) leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}