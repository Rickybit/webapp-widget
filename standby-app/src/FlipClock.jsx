import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

const FlipCard = ({ number, title }) => {
    // Keep track of the *displayed* number (the one we are transitioning FROM)
    const [currentNumber, setCurrentNumber] = useState(number);
    // Keep track of the *next* number (the one we are transitioning TO)
    const [nextNumber, setNextNumber] = useState(number);

    // Using a ref to track if we are currently animating to prevent overlapping animations
    const isFlipping = useRef(false);
    // Simple state to force re-render for animation triggering
    const [flipState, setFlipState] = useState(false);

    useEffect(() => {
        if (number !== currentNumber && number !== nextNumber) {
            // New number arrived. Start transition.
            setNextNumber(number);
            isFlipping.current = true;
            setFlipState(true);
        }
    }, [number, currentNumber, nextNumber]);

    const handleAnimationComplete = () => {
        // Animation done. The "Next" number becomes the "Current" number.
        setCurrentNumber(nextNumber);
        isFlipping.current = false;
        setFlipState(false);
    };

    // Derived state for display
    // If not flipping, we just show currentNumber everywhere (or nextNumber since they match)
    // If flipping, we need the specific arrangement:
    // Top Static: nextNumber
    // Bottom Static: currentNumber
    // Top Flap: currentNumber -> flips down to reveal Top Static
    // Bottom Flap: nextNumber -> flips down to cover Bottom Static

    const showAnimation = isFlipping.current || flipState;

    return (
        <div className="flex flex-col items-center mx-2">
            <div
                className="relative bg-neutral-800 rounded-lg text-8xl md:text-[10rem] font-bold font-mono text-white w-32 md:w-48 h-40 md:h-60 shadow-xl border border-neutral-700"
                style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >

                {/* Top Half (Static) - Shows the NEXT number (Background) */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-neutral-800 rounded-t-lg overflow-hidden border-b border-black/20 flex items-end justify-center">
                    <span className="translate-y-1/2 block">{showAnimation ? nextNumber : currentNumber}</span>
                </div>

                {/* Bottom Half (Static) - Shows the CURRENT number (Background) */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-neutral-800 rounded-b-lg overflow-hidden flex items-start justify-center">
                    <span className="-translate-y-1/2 block">{currentNumber}</span>
                </div>

                {/* Flipper Top (Animation) - Shows CURRENT number, reveals NEXT */}
                {showAnimation && (
                    <motion.div
                        key={`top-${currentNumber}-${nextNumber}`}
                        className="absolute top-0 left-0 w-full h-1/2 bg-neutral-800 rounded-t-lg overflow-hidden origin-bottom border-b border-black/20 flex items-end justify-center z-20"
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: -180 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                    >
                        <span className="translate-y-1/2 block">{currentNumber}</span>
                    </motion.div>
                )}

                {/* Flipper Bottom (Animation) - Shows NEXT number, covers CURRENT */}
                {showAnimation && (
                    <motion.div
                        key={`bottom-${currentNumber}-${nextNumber}`}
                        className="absolute bottom-0 left-0 w-full h-1/2 bg-neutral-800 rounded-b-lg overflow-hidden origin-top flex items-start justify-center z-20"
                        initial={{ rotateX: 180 }}
                        animate={{ rotateX: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                        onAnimationComplete={handleAnimationComplete}
                    >
                        <span className="-translate-y-1/2 block">{nextNumber}</span>
                    </motion.div>
                )}

                {/* Split Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/40 z-30 -translate-y-1/2" />
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
