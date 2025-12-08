import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const RSS_URL = 'https://news.yahoo.co.jp/rss/topics/top-picks.xml';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

export const NewsWidget = () => {
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                if (data.items) {
                    setNews(data.items);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch news:', error);
                setLoading(false);
            }
        };

        fetchNews();

        // Refresh news every 10 minutes
        const refreshTimer = setInterval(fetchNews, 600000);
        return () => clearInterval(refreshTimer);
    }, []);

    useEffect(() => {
        if (news.length === 0) return;

        // Rotate headlines every 8 seconds
        const rotateTimer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 8000);

        return () => clearInterval(rotateTimer);
    }, [news]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 animate-pulse">
                Loading News...
            </div>
        );
    }

    const currentItem = news[currentIndex];

    return (
        <div className="w-full h-full flex flex-col p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                <span className="text-neutral-400 text-sm font-semibold tracking-widest uppercase">Latest News</span>
            </div>

            <div className="flex-1 flex flex-col justify-center z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col gap-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight md:leading-snug text-white line-clamp-3">
                            {currentItem.title}
                        </h2>
                        <div className="flex items-center justify-between text-neutral-500 mt-2">
                            <span className="text-sm md:text-base font-medium">Yahoo! News</span>
                            <span className="text-xs md:text-sm font-light">
                                {format(new Date(currentItem.pubDate), 'HH:mm')}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-800">
                <motion.div
                    key={currentIndex}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="h-full bg-neutral-600"
                />
            </div>
        </div>
    );
};
