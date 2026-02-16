import { motion, AnimatePresence } from "motion/react";
import { X, MousePointerClick, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

export function WelcomeHint() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('hasSeenWelcomeHint');
    if (!hasSeenHint) {
      // Show after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenWelcomeHint', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-full max-w-[85vw] sm:max-w-md md:max-w-lg mx-3"
          >
            <div className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-2xl md:rounded-3xl border-2 md:border-4 border-yellow-400 shadow-2xl overflow-hidden">
              {/* Animated glow */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 60px rgba(250, 204, 21, 0.6)",
                    "0 0 100px rgba(250, 204, 21, 1)",
                    "0 0 60px rgba(250, 204, 21, 0.6)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0"
              />

              {/* Sparkle effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative p-4 sm:p-6 md:p-8">
                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Icon */}
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center mb-4 md:mb-6"
                >
                  <div className="relative">
                    <MousePointerClick className="w-12 h-12 md:w-16 md:h-16 text-yellow-300 drop-shadow-lg" />
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-yellow-300 rounded-full blur-xl"
                    />
                  </div>
                </motion.div>

                {/* Title */}
                <h2
                  className="text-2xl md:text-3xl text-white text-center mb-4 md:mb-6 font-bold"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  💡 Did You Know?
                </h2>

                {/* Tips */}
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  {/* Tip 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-black/30 rounded-xl border border-pink-500/30"
                  >
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-pink-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Click Sold Numbers
                      </p>
                      <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Tap any pink/purple number to read encouragement messages from supporters!
                      </p>
                    </div>
                  </motion.div>

                  {/* Tip 2 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-black/30 rounded-xl border border-purple-500/30"
                  >
                    <span className="text-xl md:text-2xl flex-shrink-0">⭐</span>
                    <div>
                      <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Click Team Numbers
                      </p>
                      <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Tap the ⭐ TEAM numbers to hear from the team members themselves!
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold text-base md:text-lg shadow-lg"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Got it! Let's Go! 🎯
                </motion.button>

                <p className="text-center text-gray-400 text-xs mt-2 md:mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  This message won't show again
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
