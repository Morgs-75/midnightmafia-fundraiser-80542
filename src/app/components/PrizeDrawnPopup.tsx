import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { X, Trophy } from "lucide-react";

interface PrizeDrawnPopupProps {
  drawDate: string; // Format: "01-Apr-26"
  drawTime: string; // Format: "7:00pm"
}

export function PrizeDrawnPopup({ drawDate, drawTime }: PrizeDrawnPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds initially
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Show popup again every 2 minutes
    const interval = setInterval(() => {
      setIsVisible(true);
    }, 120000); // 2 minutes = 120,000ms

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Auto-close after 10 seconds if user doesn't close it
  useEffect(() => {
    if (isVisible) {
      const autoCloseTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(autoCloseTimer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setIsVisible(false)}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.5, y: 100 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-xl"
          >
            <motion.div 
              className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl p-10 md:p-12 border-4 border-yellow-400 shadow-2xl shadow-yellow-500/50"
              animate={{
                boxShadow: [
                  "0 0 40px rgba(250, 204, 21, 0.5)",
                  "0 0 80px rgba(250, 204, 21, 0.8)",
                  "0 0 40px rgba(250, 204, 21, 0.5)",
                ],
                borderColor: [
                  "rgb(250, 204, 21)",
                  "rgb(255, 237, 213)",
                  "rgb(250, 204, 21)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Multiple glow layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-pink-400/30 to-purple-400/30 rounded-3xl blur-2xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-3xl" />
              
              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 bg-black/30 rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="relative text-center">
                {/* Trophy icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, -15, 15, -15, 0],
                    scale: [1, 1.15, 1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                    <Trophy className="w-10 h-10 text-yellow-900" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mb-6 tracking-tight leading-tight"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(250, 204, 21, 0.5)",
                      "0 0 40px rgba(250, 204, 21, 0.8)",
                      "0 0 20px rgba(250, 204, 21, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Prize Draw
                </motion.h2>

                {/* Message - MASSIVE */}
                <motion.div
                  className="bg-black/60 rounded-3xl py-8 px-6 md:px-10 border-4 border-yellow-400/50 mb-8"
                  animate={{
                    scale: [1, 1.03, 1],
                    borderColor: [
                      "rgba(250, 204, 21, 0.5)",
                      "rgba(250, 204, 21, 1)",
                      "rgba(250, 204, 21, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] leading-tight"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    As Soon As All<br />Numbers Are Sold!
                  </motion.div>
                </motion.div>

                {/* Sparkle text - BIGGER */}
                <motion.p
                  className="text-lg md:text-xl text-purple-200 font-bold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨ Don't miss your chance to win! ✨
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}