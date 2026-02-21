import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface HeroHeaderProps {
  drawDate: Date;
}

export function HeroHeader({ drawDate }: HeroHeaderProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = drawDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft("Draw completed!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [drawDate]);

  const formatDrawDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="relative px-4 py-8 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none" />
      
      <div className="relative">
        {/* SCROLLING PRIZE BANNER */}
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .ticker-inner {
            display: inline-flex;
            animation: ticker 80s linear infinite;
            white-space: nowrap;
          }
          @keyframes glow-pulse {
            0%, 100% { filter: drop-shadow(0 0 6px rgba(250,204,21,0.8)) drop-shadow(0 0 20px rgba(250,204,21,0.5)) drop-shadow(0 0 40px rgba(250,204,21,0.25)); }
            50%       { filter: drop-shadow(0 0 12px rgba(250,204,21,1))  drop-shadow(0 0 40px rgba(250,204,21,0.8)) drop-shadow(0 0 80px rgba(250,204,21,0.5)); }
          }
          .ticker-text {
            animation: glow-pulse 2s ease-in-out infinite;
          }
        `}</style>
        <div className="w-full overflow-hidden bg-black border-y-4 border-yellow-400 py-8 mb-6">
          <div className="ticker-inner">
            {Array(20).fill(null).map((_, i) => (
              <span
                key={i}
                className="ticker-text mx-16 text-yellow-400 text-5xl font-black"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                🏆 Grand Prize $500
              </span>
            ))}
          </div>
        </div>

        {/* COMMENTED OUT FOR NOW - COUNTDOWN TIMER */}
        {/* <div className="inline-flex flex-col items-center gap-2 px-6 py-3 mb-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">{formatDrawDate(drawDate)}</span>
          </div>
          {timeLeft && (
            <div className="text-xl font-bold text-yellow-400" style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 700, letterSpacing: '0.5px' }}>
              {timeLeft}
            </div>
          )}
        </div> */}
        
        <h1 className="text-4xl md:text-5xl mb-4 tracking-tight" style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 900, letterSpacing: '1px' }}>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
            Midnight Mafia Worlds Fundraiser!
          </span>
        </h1>

        <img
          src="/assets/team-photo.png"
          alt="Midnight Mafia team at AASCF Nationals"
          className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl mb-4"
        />
        
        <p className="text-lg md:text-xl text-gray-300 mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Pick your number. Support the team. Win prizes.
        </p>
        
        {/* PRICING SECTION */}
        <div className="mt-8 max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl text-yellow-400 mb-2 font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 700, letterSpacing: '0.5px' }}>
            💰 Pricing 💰
          </h3>
          <p className="text-center text-gray-300 text-base mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Select your numbers directly from the board below!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto text-center">
            {/* Single */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
              <p className="text-white text-lg font-extrabold mb-1 uppercase tracking-wide" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>
                Single Number
              </p>
              <p className="text-yellow-400 text-4xl font-black" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}>
                $25
              </p>
              <p className="text-gray-300 text-sm mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Perfect for a quick entry!
              </p>
            </div>

            {/* Best Deal - 5 for $100 */}
            <motion.div
              className="rounded-xl p-4 pt-6 border-2 relative"
              style={{ background: '#ffff87', borderColor: '#000080' }}
              animate={{ rotate: [0, -2, 2, -2, 2, 0], scale: [1, 1.05, 1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                BEST VALUE
              </motion.div>
              <p className="text-lg font-extrabold mb-1 uppercase tracking-wide" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#000080' }}>
                5 Numbers
              </p>
              <p className="text-4xl font-black" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, color: '#000080' }}>
                $100
              </p>
              <p className="text-sm mt-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#000080' }}>
                Save $25! (Regular $125)
              </p>
            </motion.div>
          </div>
          <p className="text-center text-yellow-300 text-sm mt-4 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ⚡ More numbers = Better odds of winning $500!
          </p>
        </div>
        
      </div>
    </header>
  );
}