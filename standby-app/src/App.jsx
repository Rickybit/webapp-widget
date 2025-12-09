import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

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
      className="bg-neutral-800 rounded-[3rem] w-full h-full flex flex-col items-center justify-center shadow-2xl border border-neutral-700/50"
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
    <div className="bg-black min-h-screen w-full flex items-center justify-center p-4 overflow-hidden text-white font-sans">
      
      {/* グリッドレイアウト */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl h-[80vh] md:h-[60vh]">
        
        {/* 左側：時計ウィジェット */}
        <WidgetCard delay={0.1}>
          <div className="text-[12rem] leading-none font-bold tracking-tighter text-white/90">
             {format(time, 'HH:mm')}
          </div>
          <motion.div 
            className="w-1/2 h-2 bg-neutral-600 rounded-full mt-4 overflow-hidden"
          >
             <motion.div 
               className="h-full bg-blue-500"
               animate={{ width: `${(time.getSeconds() / 60) * 100}%` }}
               transition={{ type: "spring", stiffness: 100 }}
             />
          </motion.div>
        </WidgetCard>

        {/* 右側：日付ウィジェット */}
        <WidgetCard delay={0.2}>
          <div className="text-4xl text-neutral-400 font-medium">
            {format(time, 'yyyy年', { locale: ja })}
          </div>
          <div className="text-8xl font-bold mt-2 text-red-500">
            {format(time, 'M月d日', { locale: ja })}
          </div>
          <div className="text-5xl mt-4 font-semibold text-white">
            {format(time, 'EEEE', { locale: ja })}
          </div>
        </WidgetCard>
        
      </div>
    </div>
  );
}
