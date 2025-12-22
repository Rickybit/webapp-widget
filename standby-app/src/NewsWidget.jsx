import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

// Use local proxy path defined in vite.config.js
const RSS_API_URL = '/rss-topics/it.xml';

export const NewsWidget = () => {
    // News State
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newsLoading, setNewsLoading] = useState(true);
    const [newsError, setNewsError] = useState(null);

    // Weather State
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    // Fetch News
    useEffect(() => {
        const fetchNews = async () => {
            setNewsLoading(true);
            setNewsError(null);
            try {
                const response = await fetch(RSS_API_URL);

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const textData = await response.text();
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
                            guid: guid || link || title
                        });
                    }
                });

                if (newsItems.length > 0) {
                    setNews(newsItems);
                } else {
                    throw new Error('No news items found');
                }
            } catch (err) {
                console.error('Failed to fetch news:', err);
                if (news.length === 0) setNewsError(`Unable to load news.`);
            } finally {
                setNewsLoading(false);
            }
        };

        fetchNews();
        const refreshTimer = setInterval(fetchNews, 600000); // 10 mins
        return () => clearInterval(refreshTimer);
    }, []);

    // Rotate Headlines
    useEffect(() => {
        if (news.length === 0) return;
        const rotateTimer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 8000);
        return () => clearInterval(rotateTimer);
    }, [news]);

    // Fetch Weather from OpenWeather
    useEffect(() => {
        const fetchWeather = async () => {
            setWeatherLoading(true);
            try {
                const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
                const city = import.meta.env.VITE_WEATHER_CITY || 'Sendai';

                if (!apiKey) {
                    console.warn('OpenWeather API Key is missing');
                    return;
                }

                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();

                    if (data.main && data.main.temp !== undefined) {
                        setWeather({
                            temp: Math.round(data.main.temp * 10) / 10,
                            condition: data.weather?.[0]?.main,
                        });
                    }
                } else {
                    console.warn('Weather data fetch failed:', response.status);
                }
            } catch (err) {
                console.error('Failed to fetch weather:', err);
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchWeather();
        // Update every 30 minutes
        const weatherTimer = setInterval(fetchWeather, 1800000);
        return () => clearInterval(weatherTimer);
    }, []);

    if (newsLoading && news.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 animate-pulse">
                Loading...
            </div>
        );
    }

    if (newsError && news.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-2">
                <span className="text-red-500 font-bold">Error</span>
                <span className="text-sm">{newsError}</span>
            </div>
        );
    }

    // Determine background color based on temperature
    const getBgColor = (temp) => {
        if (temp === null || temp === undefined) return 'linear-gradient(135deg, #171717 0%, #000000 100%)';

        let color;
        if (temp <= -5.1) {
            color = 'rgb(20, 20, 60)'; // Deep Icy Blue/Black
        } else if (temp <= -0.1) {
            color = 'rgb(60, 100, 180)'; // Frozen Blue
        } else if (temp <= 4.9) {
            color = 'rgb(0, 80, 160)'; // Cold Blue
        } else if (temp <= 9.9) {
            color = 'rgb(0, 120, 200)'; // Chilly Blue
        } else if (temp <= 14.9) {
            color = 'rgb(0, 160, 200)'; // Cool Light Blue
        } else if (temp <= 19.9) {
            color = 'rgb(0, 180, 140)'; // Teal/Fresh
        } else if (temp <= 24.9) {
            color = 'rgb(50, 180, 50)'; // Green/Comfortable
        } else if (temp <= 29.9) {
            color = 'rgb(240, 160, 0)'; // Orange/Warm
        } else if (temp <= 34.9) {
            color = 'rgb(255, 80, 0)'; // Red-Orange/Hot
        } else {
            color = 'rgb(180, 0, 104)'; // Extreme Hot (User Specified)
        }

        return `linear-gradient(135deg, ${color} 0%, #171717 100%)`;
    };

    const currentItem = news[currentIndex] || news[0];

    return (
        <div className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide relative bg-neutral-900/50">

            {/* Page 1: News Rotator */}
            <div className="w-full h-full snap-start flex flex-col p-8 md:p-12 relative overflow-hidden shrink-0">
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)] z-20"></span>
                    <span className="text-neutral-400 text-sm font-semibold tracking-widest uppercase z-20">Latest News</span>
                </div>

                <div className="flex-1 flex flex-col justify-center z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentItem?.guid || currentItem?.title || currentIndex}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col gap-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight md:leading-snug text-white line-clamp-3">
                                {currentItem?.title}
                            </h2>
                            <div className="flex items-center justify-between text-neutral-500 mt-2">
                                <span className="text-sm md:text-base font-medium">Yahoo! News</span>
                                <span className="text-xs md:text-sm font-light">
                                    {currentItem?.pubDate ? format(new Date(currentItem.pubDate), 'HH:mm') : ''}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-800/50">
                    <motion.div
                        key={currentIndex}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 8, ease: "linear" }}
                        className="h-full bg-neutral-600"
                    />
                </div>

                {/* Scroll Indicator Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-600 animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>
            </div>

            {/* Page 2: Weather */}
            <div
                className="w-full h-full snap-start flex flex-col p-8 md:p-12 relative shrink-0 transition-colors duration-1000"
                style={{ background: getBgColor(weather?.temp) }}
            >
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <span className="text-white/60 text-sm font-semibold tracking-widest uppercase z-20">Weather</span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center z-10 gap-4">
                    {weatherLoading ? (
                        <div className="animate-pulse text-white/50">Loading Weather...</div>
                    ) : weather ? (
                        <>
                            <div className="text-white/80 text-lg font-medium tracking-widest uppercase mb-2">
                                {import.meta.env.VITE_WEATHER_CITY || 'Sendai'}
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold text-white mb-2">
                                {weather.temp}°
                            </h2>
                            <p className="text-xl md:text-2xl text-white/80 font-light">
                                Temperature
                            </p>
                        </>
                    ) : (
                        <div className="text-white/50">Weather unavailable</div>
                    )}
                </div>
            </div>

        </div>
    );
};
