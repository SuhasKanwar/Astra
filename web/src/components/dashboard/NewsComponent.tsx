"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { HTTP_SERVER_BASE_URL } from "@/lib/config";
import { Loader2, ExternalLink } from "lucide-react";
import AnimatedList from "@/components/ui/animated-list";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
    title: string;
    url: string;
    publishedAt: string;
    source: string;
    author?: string | null;
    content?: string | null;
    description?: string | null;
    image?: string | null;
}

const CATEGORIES = [
    { id: 'energy-markets', label: 'Energy Markets', endpoint: '/api/news/search?q=energy+markets' },
    { id: 'geopolitics', label: 'Geopolitics', endpoint: '/api/news/search?q=geopolitics+energy' },
    { id: 'shipping', label: 'Shipping & Logistics', endpoint: '/api/news/search?q=shipping+logistics+energy' },
    { id: 'supply-chain', label: 'Supply Chain', endpoint: '/api/news/search?q=energy+supply+chain' },
    { id: 'energy-security', label: 'Energy Security', endpoint: '/api/news/search?q=energy+security' },
];

export default function NewsComponent() {
    const { data: session } = useSession();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    useEffect(() => {
        if (!session?.accessToken) return;

        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${HTTP_SERVER_BASE_URL}${activeCategory.endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                if (response.data?.success) {
                    setArticles(response.data.data.articles || []);
                } else {
                    setError("Failed to load news");
                }
            } catch (err) {
                console.error("News fetch error:", err);
                setError("Unable to connect to news service");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [session?.accessToken, activeCategory]);

    if (!session) {
        return (
            <div className="flex justify-center items-center h-48 text-(--secondary-text-color) text-sm font-medium">
                Authenticating...
            </div>
        );
    }

    return (
        <section className="w-full flex flex-col h-full relative">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black tracking-tight text-(--primary-text-color)">
                    Astra <span className="text-(--primary-color)">Intel</span>
                </h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-5 p-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory.id === cat.id
                            ? "bg-(--primary-color) text-white shadow-lg shadow-(--primary-color)/30 scale-105"
                            : "bg-(--surface-strong-color) text-(--secondary-text-color) hover:text-(--primary-color) hover:bg-(--border-color)"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center flex-1 min-h-75">
                    <Loader2 className="w-8 h-8 animate-spin text-(--primary-color)" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 border border-red-200 rounded-xl text-sm font-medium">
                    {error}
                </div>
            ) : articles.length === 0 ? (
                <div className="flex items-center justify-center p-6 text-(--secondary-text-color) bg-(--surface-strong-color) rounded-xl text-sm font-medium">
                    No updates available in this category.
                </div>
            ) : (
                <div className="flex-1 overflow-hidden -mx-2 px-2 relative mask-image-bottom-fade">
                    <AnimatedList
                        items={articles}
                        showGradients={false}
                        displayScrollbar={false}
                        className="w-full max-w-full pb-10"
                        onItemSelect={(article) => window.open(article.url, '_blank')}
                        renderItem={(article: Article, isSelected) => (
                            <motion.div
                                layout
                                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col ${isSelected ? 'bg-(--surface-color) border-(--primary-color) shadow-xl shadow-(--primary-color)/5 scale-[1.02]' : 'bg-(--surface-color) border-(--border-color) hover:border-(--secondary-color)/50 hover:shadow-md'}`}
                            >
                                {article.image && (
                                    <motion.div
                                        layout
                                        animate={{ height: isSelected ? 180 : 80, opacity: isSelected ? 1 : 0.8 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="w-full mb-3 rounded-xl overflow-hidden shrink-0 bg-(--border-color) relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                    </motion.div>
                                )}

                                <motion.div layout className="flex items-center justify-between mb-2 gap-2">
                                    <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-md truncate transition-colors ${isSelected ? 'bg-(--primary-color) text-white shadow-sm' : 'bg-(--primary-color)/10 text-(--primary-color)'}`}>
                                        {article.source || 'News'}
                                    </span>
                                    <span className="text-[10px] text-(--secondary-text-color) font-bold shrink-0">
                                        {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </motion.div>

                                <motion.h3 layout className={`text-sm font-bold text-(--primary-text-color) leading-snug ${isSelected ? '' : 'line-clamp-2'}`}>
                                    {article.title}
                                </motion.h3>

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            {article.description && (
                                                <p className="mt-3 text-[13px] text-(--secondary-text-color) leading-relaxed font-medium">
                                                    {article.description}
                                                </p>
                                            )}

                                            {article.author && (
                                                <div className="mt-3 text-[11px] font-bold text-(--secondary-text-color) flex items-center gap-1.5">
                                                    <div className="w-4 h-4 rounded-full bg-(--border-color) flex items-center justify-center text-[8px] text-(--primary-text-color)">
                                                        {article.author.charAt(0).toUpperCase()}
                                                    </div>
                                                    By <span className="text-(--primary-text-color)">{article.author}</span>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-3 border-t border-(--border-color) flex items-center justify-between">
                                                <div className="flex items-center text-[11px] uppercase tracking-wider font-black text-(--primary-color) hover:text-(--secondary-color) transition-colors cursor-pointer">
                                                    Read full story <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    />
                </div>
            )}
        </section>
    );
}