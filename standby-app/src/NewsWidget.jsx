import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

// Use local proxy path defined in vite.config.js
const RSS_API_URL = '/rss-topics/top-picks.xml';

export const NewsWidget = () => {
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(RSS_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const textData = await response.text();

                // Parse XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(textData, "text/xml");

                const items = xmlDoc.querySelectorAll("item");
                const newsItems = [];

                items.forEach(item => {
                    const title = item.querySelector("title")?.textContent;
                    const pubDate = item.querySelector("pubDate")?.textContent;
                    const link = item.querySelector("link")?.textContent;
                    const guid = item.querySelector("guid")?.textContent;

                    if (title) {
                        newsItems.push({
                            title,
                            pubDate,
                            link,
                            guid: guid || link || title // Fallback ID
                        });
                    }
                });

                if (newsItems.length > 0) {
                    setNews(newsItems);
                } else {
                    throw new Error('No news items found in RSS feed');
                }

            } catch (err) {
                console.error('Failed to fetch news:', err);
                if (news.length === 0) {
                    setError('Unable to load news.');
                }
            } finally {
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

    if (loading && news.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 animate-pulse">
                Loading News...
            </div>
        );
    }

    if (error && news.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-2">
                <span className="text-red-500 font-bold">Error</span>
                <span className="text-sm">{error}</span>
            </div>
        );
    }

    // Safety check
    if (news.length === 0) return null;

    const currentItem = news[currentIndex] || news[0];

    return (
        <div className="w-full h-full flex flex-col p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)] z-20"></span>
                <span className="text-neutral-400 text-sm font-semibold tracking-widest uppercase z-20">Latest News</span>
            </div>

            <div className="flex-1 flex flex-col justify-center z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.guid || currentItem.title || currentIndex}
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
                                {currentItem.pubDate ? format(new Date(currentItem.pubDate), 'HH:mm') : ''}
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
