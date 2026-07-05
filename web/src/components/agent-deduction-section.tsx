"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Cpu, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import Card from "@/components/ui/card";

const DEDUCTIONS = [
    {
        id: 1,
        time: "10:42 AM",
        event: "Severe weather system forming near Malacca Strait",
        action: "Rerouting 3 vessels to alternate paths. ETA impact: +4hrs.",
        status: "resolved"
    },
    {
        id: 2,
        time: "11:15 AM",
        event: "Unscheduled port closure at Rotterdam",
        action: "Analyzing alternative discharge ports. Alerting stakeholders.",
        status: "processing"
    },
    {
        id: 3,
        time: "12:30 PM",
        event: "Geopolitical tension spike in Red Sea region",
        action: "Escalating risk profile. Recommending immediate diversion.",
        status: "alert"
    }
];

export default function AgentDeductionSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const deductionItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            deductionItemsRef.current,
                            { x: -50, opacity: 0 },
                            { x: 0, opacity: 1, duration: 0.6, stagger: 0.3, ease: "power2.out" }
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
        <section ref={sectionRef} className="py-24 px-4 sm:px-8 bg-(--surface-strong-color) relative border-t border-(--border-color)" id="agents">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                    <div className="absolute -inset-4 bg-(--primary-color)/5 rounded-4xl blur-xl z-0" />
                    <Card className="relative z-10 p-1 sm:p-2 bg-(--surface-color) rounded-[27px] overflow-hidden h-112.5 flex flex-col">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-(--border-color) bg-(--primary-bg-color)/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="mx-auto flex items-center gap-2 text-xs font-mono text-(--secondary-text-color)">
                                <Cpu className="w-3.5 h-3.5" />
                                astra-agent-core // execution_log
                            </div>
                        </div>

                        <div ref={listRef} className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col gap-4 font-mono text-sm">
                            {DEDUCTIONS.map((deduction, idx) => (
                                <div
                                    key={deduction.id}
                                    ref={(el) => { deductionItemsRef.current[idx] = el; }}
                                    className="flex flex-col gap-2 pb-4 border-b border-(--border-color)/50 last:border-0"
                                    style={{ opacity: 0 }}
                                >
                                    <div className="flex items-center gap-3 text-(--secondary-text-color)">
                                        <span className="opacity-60">[{deduction.time}]</span>
                                        {deduction.status === 'resolved' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {deduction.status === 'processing' && <Cpu className="w-4 h-4 text-(--secondary-color) animate-pulse" />}
                                        {deduction.status === 'alert' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                        <span className={deduction.status === 'alert' ? 'text-red-500 font-semibold' : ''}>
                                            INFERENCE: {deduction.event}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 pl-20 sm:pl-24 text-(--primary-text-color)">
                                        <ArrowRight className="w-4 h-4 text-(--primary-color) shrink-0 mt-0.5" />
                                        <span className="text-gray-300">
                                            <span className="text-(--primary-color)">AGENT_ACTION</span>: {deduction.action}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="order-1 lg:order-2 flex flex-col gap-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-(--primary-text-color) tracking-tight">
                        From Raw Data <br /> to <span className="text-(--primary-color)">Strategic Action</span>
                    </h2>
                    <p className="text-(--secondary-text-color) text-lg leading-relaxed">
                        Astra doesn't just show you data; it interprets it. Our dedicated agent models analyze inferences to deduce logical outcomes, preempt risks, and automatically execute mitigation strategies before human intervention is required.
                    </p>
                </div>

            </div>
        </section>
    );
}