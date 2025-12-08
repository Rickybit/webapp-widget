import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { FlipClock } from './FlipClock';
import { NewsWidget } from './NewsWidget';

const WidgetCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay
      }}
      className="bg-neutral-800 rounded-[3rem] w-full h-full flex flex-col items-center justify-center shadow-2xl border border-neutral-700/50 overflow-hidden relative"
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center overflow-hidden text-white font-sans p-4 md:p-8">

      {/* グリッドレイアウト - Full container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full h-full max-w-[1920px] max-h-[1080px]">

        {/* 左側：時計ウィジェット (Flip Clock) */}
        <WidgetCard delay={0.1}>
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 z-0" />
          <div className="z-10 w-full h-full flex items-center justify-center scale-75 md:scale-100 origin-center">
            <FlipClock />
          </div>
          {/* Date Display: Bottom Left */}
          <div className="absolute bottom-8 left-10 z-20">
            <div className="text-3xl md:text-4xl font-light text-neutral-400 tracking-wide">
              {format(time, 'MMMM d', { locale: enUS })}
            </div>
            <div className="text-lg text-neutral-600 font-medium uppercase tracking-[0.2em] mt-1">
              {format(time, 'EEEE', { locale: enUS })}
            </div>
          </div>
        </WidgetCard>

        {/* 右側：News Widget */}
        <WidgetCard delay={0.2}>
          <div className="absolute inset-0 bg-neutral-800 z-0" />
          <div className="z-10 w-full h-full">
            <NewsWidget />
          </div>
        </WidgetCard>

      </div>
    </div>
  );
}