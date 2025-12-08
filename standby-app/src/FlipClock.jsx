import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FlipCard = ({ number, title }) => {
    const [prevNumber, setPrevNumber] = useState(number);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (number !== prevNumber) {
            setIsFlipping(true);
            const timer = setTimeout(() => {
                setIsFlipping(false);
                setPrevNumber(number);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [number, prevNumber]);

    return (
        <div className="flex flex-col items-center mx-2">
            <div className="relative bg-neutral-800 rounded-lg text-8xl md:text-[10rem] font-bold font-mono text-white w-32 md:w-48 h-40 md:h-60 shadow-xl border border-neutral-700">

                {/* Top Half (Static) */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-neutral-800 rounded-t-lg overflow-hidden border-b border-black/20 flex items-end justify-center">
                    <span className="translate-y-1/2 block">{number}</span>
                </div>

                {/* Bottom Half (Static) */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-neutral-800 rounded-b-lg overflow-hidden flex items-start justify-center">
                    <span className="-translate-y-1/2 block">{prevNumber}</span>
                </div>

                {/* Flipper (Animation) */}
                <AnimatePresence mode="popLayout">
                    {isFlipping && (
                        <motion.div
                            key={number}
                            className="absolute top-0 left-0 w-full h-1/2 bg-neutral-800 rounded-t-lg overflow-hidden origin-bottom border-b border-black/20 flex items-end justify-center z-10 backface-hidden"
                            initial={{ rotateX: 0 }}
                            animate={{ rotateX: -180 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                        >
                            <span className="translate-y-1/2 block">{prevNumber}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                    {isFlipping && (
                        <motion.div
                            key={`${number}-bottom`}
                            className="absolute bottom-0 left-0 w-full h-1/2 bg-neutral-800 rounded-b-lg overflow-hidden origin-top flex items-start justify-center z-10 backface-hidden"
                            initial={{ rotateX: 180 }}
                            animate={{ rotateX: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                        >
                            <span className="-translate-y-1/2 block">{number}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Split Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/40 z-20 -translate-y-1/2" />
            </div>
            {title && <span className="text-neutral-500 mt-4 uppercase tracking-wider text-sm font-semibold">{title}</span>}
        </div>
    );
};

export const FlipClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num) => num.toString().padStart(2, '0');

    const hours = formatNumber(time.getHours());
    const minutes = formatNumber(time.getMinutes());
    const seconds = formatNumber(time.getSeconds());

    return (
        <div className="flex items-center justify-center p-8">
            <FlipCard number={hours} title="Hours" />
            <div className="text-6xl text-neutral-600 font-bold mb-12">:</div>
            <FlipCard number={minutes} title="Minutes" />
            <div className="hidden md:block text-6xl text-neutral-600 font-bold mb-12">:</div>
            <div className="hidden md:block">
                <FlipCard number={seconds} title="Seconds" />
            </div>
        </div>
    );
};
