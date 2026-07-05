"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Satellite, Newspaper, CandlestickChart, Bot, Database, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function BotInferenceSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sourcesRef = useRef<(HTMLDivElement | null)[]>([]);
    const brainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const tl = gsap.timeline();

                        tl.fromTo(
                            containerRef.current,
                            { opacity: 0, y: 40 },
                            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
                        );

                        tl.fromTo(
                            sourcesRef.current,
                            { scale: 0, opacity: 0, y: 20 },
                            { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)" },
                            "-=0.5"
                        );

                        tl.fromTo(
                            brainRef.current,
                            { scale: 0.5, opacity: 0, rotate: -45 },
                            { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "power3.out" },
                            "-=0.4"
                        );

                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-4 sm:px-8 bg-(--primary-bg-color) relative overflow-hidden" id="inference">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-(--primary-color) opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <div className="mb-20">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-(--primary-text-color) tracking-tight mb-6">
                        Autonomous Data <span className="text-transparent bg-clip-text bg-linear-to-r from-(--primary-color) to-(--secondary-color)">Inference</span>
                    </h2>
                    <p className="text-(--secondary-text-color) text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                        Astra's agentic swarm continuously ingests and cross-references millions of data points from global sources to synthesize a comprehensive operational picture.
                    </p>
                </div>

                <div 
                    ref={containerRef} 
                    className="relative w-full max-w-5xl h-112.5 sm:h-150 flex items-center justify-center rounded-[3rem] border border-(--border-color) bg-(--surface-color) overflow-hidden shadow-2xl shadow-(--primary-color)/5"
                    style={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-size-[32px_32px] opacity-20 pointer-events-none"></div>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--border-color)" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.8" />
                            </linearGradient>
                            <linearGradient id="lineGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="var(--border-color)" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="var(--secondary-color)" stopOpacity="0.8" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="1.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {[
                            { id: "path1", d: "M 15,20 C 35,20 35,50 50,50", grad: "url(#lineGradLeft)", delay: 0 },
                            { id: "path2", d: "M 85,20 C 65,20 65,50 50,50", grad: "url(#lineGradRight)", delay: 0.5 },
                            { id: "path3", d: "M 15,80 C 35,80 35,50 50,50", grad: "url(#lineGradLeft)", delay: 1 },
                            { id: "path4", d: "M 85,80 C 65,80 65,50 50,50", grad: "url(#lineGradRight)", delay: 1.5 },
                        ].map((path) => (
                            <g key={path.id}>
                                <path d={path.d} fill="none" stroke="var(--border-color)" strokeWidth="0.2" strokeDasharray="1 1" />
                                <motion.path
                                    d={path.d}
                                    fill="none"
                                    stroke={path.grad}
                                    strokeWidth="0.5"
                                    strokeLinecap="round"
                                    filter="url(#glow)"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ 
                                        pathLength: [0, 1, 1], 
                                        opacity: [0, 1, 0],
                                        pathOffset: [0, 0, 1] 
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: path.delay
                                    }}
                                />
                                <circle r="0.8" fill="var(--surface-color)" stroke="var(--primary-color)" strokeWidth="0.3" filter="url(#glow)">
                                    <animateMotion dur="3s" repeatCount="indefinite" path={path.d} begin={`${path.delay}s`} />
                                </circle>
                                <circle r="0.4" fill="var(--secondary-color)">
                                    <animateMotion dur="2.5s" repeatCount="indefinite" path={path.d} begin={`${path.delay + 0.8}s`} />
                                </circle>
                            </g>
                        ))}
                    </svg>
                    <div
                        ref={brainRef}
                        className="relative z-20 w-36 h-36 sm:w-48 sm:h-48 rounded-full flex items-center justify-center group"
                    >
                        <div className="absolute inset-0 bg-linear-to-tr from-(--primary-color) to-(--secondary-color) rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />
                        <div className="absolute inset-0 bg-(--surface-color) rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border border-(--primary-color)/20 backdrop-blur-sm z-10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-b from-(--primary-color)/5 to-transparent" />
                            <Bot className="w-16 h-16 sm:w-20 sm:h-20 text-(--primary-color) drop-shadow-md z-20" />
                        </div>
                        
                        <div className="absolute -inset-3.75 border border-(--primary-color)/30 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />
                        <div className="absolute -inset-7.5 border border-(--secondary-color)/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ borderStyle: 'dotted', borderWidth: '2px' }} />
                        <div className="absolute -inset-11.25 border border-(--primary-color)/10 rounded-full animate-[spin_20s_linear_infinite] border-r-transparent border-l-transparent" />
                    </div>

                    <DataSource
                        refEl={(el) => { sourcesRef.current[0] = el; }}
                        icon={Satellite}
                        label="Satellite Imagery"
                        position="top-[10%] left-[5%] sm:top-[15%] sm:left-[10%]"
                        delay={0}
                    />
                    <DataSource
                        refEl={(el) => { sourcesRef.current[1] = el; }}
                        icon={Newspaper}
                        label="Global News Feeds"
                        position="top-[10%] right-[5%] sm:top-[15%] sm:right-[10%]"
                        delay={0.5}
                    />
                    <DataSource
                        refEl={(el) => { sourcesRef.current[2] = el; }}
                        icon={CandlestickChart}
                        label="Market Signals"
                        position="bottom-[10%] left-[5%] sm:bottom-[15%] sm:left-[10%]"
                        delay={1}
                    />
                    <DataSource
                        refEl={(el) => { sourcesRef.current[3] = el; }}
                        icon={Database}
                        label="Internal Logs"
                        position="bottom-[10%] right-[5%] sm:bottom-[15%] sm:right-[10%]"
                        delay={1.5}
                    />
                </div>
            </div>
        </section>
    );
}

interface DataSourceProps {
    icon: React.ElementType<{ className?: string }>;
    label: string;
    position: string;
    refEl: React.Ref<HTMLDivElement>;
    delay?: number;
}

function DataSource({ icon: Icon, label, position, refEl, delay = 0 }: DataSourceProps) {
    return (
        <div
            ref={refEl}
            className={`absolute z-30 flex flex-col items-center gap-3 ${position} group cursor-default`}
        >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-(--surface-color) border border-(--border-color) shadow-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-(--primary-color)/20 group-hover:border-(--primary-color)/50">
                <div className="absolute inset-0 bg-linear-to-br from-(--primary-color)/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-(--secondary-text-color) group-hover:text-(--primary-color) transition-colors duration-300 relative z-10" />
                
                <div
                    className="absolute w-2 h-2 rounded-full bg-(--primary-color) top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
                    style={{
                        animation: `ping 3s cubic-bezier(0, 0, 0.2, 1) infinite ${delay}s`
                    }}
                />
            </div>
            <span className="text-sm font-bold text-(--primary-text-color) bg-(--surface-strong-color) px-3 py-1.5 rounded-lg border border-(--border-color) shadow-sm whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                {label}
            </span>
        </div>
    );
}