import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

// Use local proxy path defined in vite.config.js
const RSS_API_URL = '/rss-topics/it.xml';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true';

const WEATHER_CODES = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense',
    61: 'Rain: Slight',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy',
    71: 'Snow: Slight',
    73: 'Snow: Moderate',
    75: 'Snow: Heavy',
    77: 'Snow grains',
    80: 'Rain showers: Slight',
    81: 'Rain showers: Moderate',
    82: 'Rain showers: Violent',
    85: 'Snow showers: Slight',
    86: 'Snow showers: Heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};

const getWeatherDescription = (code) => WEATHER_CODES[code] || 'Unknown';

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
                if (news.length === 0) setNewsError('Unable to load news.');
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

    // Fetch Weather
    useEffect(() => {
        const fetchWeather = async () => {
            setWeatherLoading(true);
            try {
                const response = await fetch(WEATHER_API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setWeather({
                        temp: data.current_weather.temperature,
                        code: data.current_weather.weathercode
                    });
                }
            } catch (err) {
                console.error('Failed to fetch weather:', err);
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchWeather();
        const weatherTimer = setInterval(fetchWeather, 1800000); // 30 mins
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
            <div className="w-full h-full snap-start flex flex-col p-8 md:p-12 relative bg-gradient-to-br from-blue-900 via-neutral-900 to-neutral-900 shrink-0">
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase z-20">Weather</span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center z-10 gap-4">
                    {weatherLoading ? (
                        <div className="animate-pulse text-neutral-500">Loading Weather...</div>
                    ) : weather ? (
                        <>
                            <div className="text-blue-200 text-lg font-medium tracking-widest uppercase mb-2">Tokyo</div>
                            <h2 className="text-5xl md:text-7xl font-bold text-white mb-2">
                                {weather.temp}°
                            </h2>
                            <p className="text-xl md:text-2xl text-blue-100 font-light">
                                {getWeatherDescription(weather.code)}
                            </p>
                        </>
                    ) : (
                        <div className="text-neutral-500">Weather unavailable</div>
                    )}
                </div>
            </div>

        </div>
    );
};
