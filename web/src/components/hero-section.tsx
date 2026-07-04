"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import dynamic from "next/dynamic";
import { CIRCUIT_PATHS, CIRCUIT_NODES, GLOBE_CONFIG, SAMPLE_ARCS } from '@/data/globe-data';

const World = dynamic(() => import("./ui/globe").then((m) => m.World), {
    ssr: false,
});

function CircuitPattern() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            {CIRCUIT_PATHS.map((path, i) => (
                <path
                    key={`trace-${i}`}
                    d={path.d}
                    stroke="var(--primary-color)"
                    strokeWidth="1"
                    opacity="0.07"
                    fill="none"
                />
            ))}

            {CIRCUIT_NODES.map(([x, y], i) => (
                <g key={`node-${i}`}>
                    <circle cx={x} cy={y} r="3" fill="var(--primary-color)" opacity="0.08" />
                    <circle cx={x} cy={y} r="1.5" fill="var(--primary-color)" opacity="0.18" />
                </g>
            ))}

            {CIRCUIT_PATHS.filter((p) => p.animated).map((path, i) => (
                <circle
                    key={`dot-${i}`}
                    r="2.5"
                    fill="var(--primary-color)"
                    opacity="0.4"
                >
                    <animateMotion
                        dur={`${5 + i * 2}s`}
                        repeatCount="indefinite"
                        path={path.d}
                    />
                </circle>
            ))}
        </svg>
    );
}

function MiniBarChart() {
    const bars = [40, 55, 35, 65, 50, 80, 70];
    return (
        <svg width="56" height="32" viewBox="0 0 56 32" fill="none" aria-hidden="true">
            {bars.map((h, i) => (
                <rect
                    key={i}
                    x={i * 8}
                    y={32 - (h / 100) * 32}
                    width="5"
                    height={(h / 100) * 32}
                    rx="1.5"
                    fill="var(--primary-color)"
                    opacity={0.15 + (i / bars.length) * 0.55}
                />
            ))}
        </svg>
    );
}

function MiniArcProgress({ value }: { value: number }) {
    const r = 13;
    const c = 2 * Math.PI * r;
    const offset = c - (value / 100) * c;
    return (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
            <circle cx="17" cy="17" r={r} stroke="var(--border-color)" strokeWidth="3" />
            <circle
                cx="17"
                cy="17"
                r={r}
                stroke="var(--primary-color)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={offset}
                transform="rotate(-90 17 17)"
                fill="none"
            />
        </svg>
    );
}

function MiniSparkline() {
    return (
        <svg width="56" height="28" viewBox="0 0 56 28" fill="none" aria-hidden="true">
            <defs>
                <linearGradient id="heroSparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--primary-color)" />
                    <stop offset="1" stopColor="var(--primary-color)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points="0,28 0,20 8,16 16,22 24,10 32,14 40,6 48,12 56,4 56,28"
                fill="url(#heroSparkGrad)"
                opacity="0.1"
            />
            <polyline
                points="0,20 8,16 16,22 24,10 32,14 40,6 48,12 56,4"
                stroke="var(--primary-color)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
            />
        </svg>
    );
}

function MiniStatusGrid() {
    const cells = Array.from({ length: 28 }, (_, i) => i !== 12 && i !== 19);
    return (
        <svg width="56" height="28" viewBox="0 0 56 28" fill="none" aria-hidden="true">
            {cells.map((active, i) => (
                <rect
                    key={i}
                    x={(i % 7) * 8}
                    y={Math.floor(i / 7) * 7}
                    width="6"
                    height="5"
                    rx="1"
                    fill={active ? "var(--primary-color)" : "var(--border-color)"}
                    opacity={active ? 0.35 : 0.25}
                />
            ))}
        </svg>
    );
}

interface StatItem {
    numericValue: number;
    prefix: string;
    suffix: string;
    label: string;
    visualization: React.ReactNode;
}

const STATS: StatItem[] = [
    {
        numericValue: 2400,
        prefix: "",
        suffix: "+",
        label: "Supply Routes Tracked",
        visualization: <MiniBarChart />,
    },
    {
        numericValue: 98.7,
        prefix: "",
        suffix: "%",
        label: "Risk Prediction Accuracy",
        visualization: <MiniArcProgress value={98.7} />,
    },
    {
        numericValue: 500,
        prefix: "<",
        suffix: "ms",
        label: "Average Alert Latency",
        visualization: <MiniSparkline />,
    },
    {
        numericValue: 99.9,
        prefix: "",
        suffix: "%",
        label: "Platform Uptime",
        visualization: <MiniStatusGrid />,
    },
];

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subheadingRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const globeWrapperRef = useRef<HTMLDivElement>(null);
    const globeContainerRef = useRef<HTMLDivElement>(null);
    const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            delay: 0.15,
        });

        tl.fromTo(
            headingRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 }
        )
            .fromTo(
                subheadingRef.current,
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7 },
                "-=0.5"
            )
            .fromTo(
                ctaRef.current,
                { y: 25, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                "-=0.4"
            )
            .fromTo(
                globeWrapperRef.current,
                { scale: 0.85, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
                "-=0.6"
            );

        const cards = statsRef.current?.querySelectorAll(".hero-stat-card");
        if (cards && cards.length > 0) {
            tl.fromTo(
                cards,
                { y: 25, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
                "-=0.5"
            );
        }

        counterRefs.current.forEach((el, idx) => {
            if (!el) return;
            const stat = STATS[idx];
            const obj = { val: 0 };
            gsap.to(obj, {
                val: stat.numericValue,
                duration: 2,
                delay: 0.6 + idx * 0.12,
                ease: "power2.out",
                onUpdate: () => {
                    if (stat.numericValue >= 1000) {
                        el.textContent =
                            stat.prefix +
                            Math.round(obj.val).toLocaleString() +
                            stat.suffix;
                    } else if (stat.numericValue % 1 !== 0) {
                        el.textContent =
                            stat.prefix + obj.val.toFixed(1) + stat.suffix;
                    } else {
                        el.textContent =
                            stat.prefix + Math.round(obj.val) + stat.suffix;
                    }
                },
            });
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative overflow-hidden bg-[var(--primary-bg-color)] min-h-screen flex flex-col justify-center px-4 sm:px-8 pt-[6rem] sm:pt-28 pb-6 sm:pb-8" id="hero">
            <CircuitPattern />

            <div className="relative z-10 max-w-[1320px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start gap-6">
                    <h1
                        ref={headingRef}
                        className="text-[clamp(2rem,8vw,2.8rem)] sm:text-[clamp(2.6rem,5.5vw,4.2rem)] font-black leading-[1.08] tracking-[-0.03em] text-[var(--primary-text-color)] m-0"
                        style={{ opacity: 0 }}
                    >
                        SECURING ENERGY.
                        <br />
                        <span className="bg-gradient-to-br from-[var(--primary-color)] via-[var(--secondary-color)] via-60% to-[#818CF8] bg-clip-text text-transparent">
                            PREDICTING DISRUPTIONS.
                        </span>
                    </h1>

                    <p
                        ref={subheadingRef}
                        className="text-[0.95rem] sm:text-[1.1rem] leading-[1.7] text-[var(--secondary-text-color)] max-w-[600px] lg:max-w-[500px] m-0"
                        style={{ opacity: 0 }}
                    >
                        End-to-end supply chain intelligence across geopolitical
                        events, shipping routes, and market signals. Built for
                        speed, accuracy, and global energy security.
                    </p>

                    <div
                        ref={ctaRef}
                        className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full lg:w-auto justify-center lg:justify-start"
                        style={{ opacity: 0 }}
                    >
                        <Link href="/auth/signin" className="group inline-flex items-center justify-center gap-2 px-7 py-[0.85rem] rounded-[10px] bg-[var(--primary-color)] text-[var(--surface-color)] font-bold text-[0.95rem] no-underline border-none transition-all duration-200 ease-in hover:bg-[#1D4ED8] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] w-full sm:w-auto">
                            <span>Get Started</span>
                            <ArrowRight className="w-[18px] h-[18px] transition-transform duration-200 ease-in group-hover:translate-x-[3px]" />
                        </Link>
                        <Link href="#demo" className="inline-flex items-center justify-center gap-2 px-6 py-[0.85rem] rounded-[10px] bg-transparent text-[var(--primary-text-color)] font-semibold text-[0.95rem] no-underline border-[1.5px] border-[var(--border-color)] transition-all duration-200 ease-in hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] w-full sm:w-auto">
                            <Play className="w-4 h-4 text-[var(--primary-color)]" />
                            <span>Watch Demo</span>
                        </Link>
                    </div>
                </div>

                <div
                    ref={globeWrapperRef}
                    className="relative w-full flex items-center justify-center -order-1 lg:order-last"
                    style={{ opacity: 0 }}
                >
                    <div
                        ref={globeContainerRef}
                        className="w-full aspect-square max-w-[380px] sm:max-w-[480px] lg:max-w-[620px] relative"
                    >
                        <World data={SAMPLE_ARCS} globeConfig={GLOBE_CONFIG} />
                    </div>
                </div>
            </div>

            <div ref={statsRef} className="relative z-10 max-w-[1320px] mt-12 mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--border-color)] border border-[var(--border-color)] rounded-[14px] overflow-hidden">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="hero-stat-card flex items-center gap-[0.85rem] p-4 sm:p-[1.25rem_1.5rem] bg-[var(--surface-color)] transition-COLORS duration-200 ease-in hover:bg-[var(--surface-strong-color)]">
                        <div className="flex items-center justify-center shrink-0">
                            {stat.visualization}
                        </div>
                        <div className="flex flex-col">
                            <span
                                ref={(el) => {
                                    counterRefs.current[idx] = el;
                                }}
                                className="text-[1.35rem] font-extrabold text-[var(--primary-text-color)] tracking-[-0.02em] leading-[1.2]"
                            >
                                0
                            </span>
                            <span className="text-[0.72rem] text-[var(--secondary-text-color)] font-medium leading-[1.3] mt-[2px]">
                                {stat.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}