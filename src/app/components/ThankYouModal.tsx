import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Trophy, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface ThankYouModalProps {
  isOpen: boolean;
  displayName: string;
  numbers: number[];
  onClose: () => void;
}

export function ThankYouModal({ isOpen, displayName, numbers, onClose }: ThankYouModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowContent(false);
      // Delay content animation slightly for dramatic effect
      const timer = setTimeout(() => setShowContent(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleShare = async () => {
    const numbersText = numbers.sort((a, b) => a - b).join(", ");
    const shareText = `I'm a proud supporter of Midnight Mafia! 💜⭐\n\nI claimed number${numbers.length > 1 ? 's' : ''}: ${numbersText}\n\nHelp them reach their goal for Worlds 2026!`;
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://midnightmafia.au";
    const fullMessage = `${shareText}\n\n${shareUrl}`;

    // Check if on mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // On desktop, show QR code
    if (!isMobile) {
      setShowQRCode(true);
      return;
    }

    // On mobile, try Web Share API first (works great for Instagram stories)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Support Midnight Mafia Cheer",
          text: fullMessage,
        });
      } catch (err) {
        // User cancelled or error occurred - fallback to copying link
        console.log("Share cancelled or failed:", err);
        try {
          await navigator.clipboard.writeText(fullMessage);
          alert("Message and link copied! Paste it in your Instagram story 💜");
        } catch (clipErr) {
          console.log("Clipboard failed:", clipErr);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(fullMessage);
        alert("Message and link copied! Paste it in your Instagram story 💜");
      } catch (clipErr) {
        console.log("Clipboard failed:", clipErr);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[60] max-h-[90vh] overflow-y-auto"
          >
            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-500/50">
              {/* Animated background sparkles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative px-8 py-12 pb-16 text-center">
                <AnimatePresence>
                  {showContent && (
                    <>
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="flex justify-center mb-6"
                      >
                        <div className="relative">
                          {/* Pulsing glow */}
                          <motion.div
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-red-500 rounded-full blur-3xl"
                          />
                          
                          {/* Heart icon with beating animation */}
                          <motion.div 
                            className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-full p-8 border-4 border-white/30 shadow-2xl"
                            animate={{
                              scale: [1, 1.15, 1],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Heart className="w-24 h-24 text-white fill-white" />
                          </motion.div>

                          {/* Little hearts floating out */}
                          {[...Array(8)].map((_, i) => {
                            const angle = (i * 360) / 8;
                            const radians = (angle * Math.PI) / 180;
                            const distance = 100;
                            const x = Math.cos(radians) * distance;
                            const y = Math.sin(radians) * distance;
                            
                            return (
                              <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2"
                                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                animate={{
                                  x: [0, x],
                                  y: [0, y],
                                  opacity: [0, 1, 0],
                                  scale: [0, 1, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.25,
                                  ease: "easeOut"
                                }}
                              >
                                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* Thank You Text */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h2 
                          className="text-5xl md:text-6xl text-white mb-4 leading-tight"
                          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                        >
                          Thank You
                          {displayName !== "Anonymous" && (
                            <><br />{displayName}!</>
                          )}
                          {displayName === "Anonymous" && "!"}
                        </h2>
                        
                        <div className="flex items-center justify-center gap-2 mb-6">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          <Sparkles className="w-6 h-6 text-yellow-300" />
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                        </div>
                      </motion.div>

                      {/* Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4 mb-8"
                      >
                        <p 
                          className="text-xl text-white leading-relaxed max-w-md mx-auto"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          Your support is <span className="text-yellow-300 font-bold">greatly appreciated</span> and gives us the opportunity to compete on the <span className="text-yellow-300 font-bold">World Stage</span>.
                        </p>

                        {/* Icons row */}
                        <div className="flex items-center justify-center gap-4 pt-4">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                          >
                            <Plane className="w-8 h-8 text-purple-300" />
                          </motion.div>
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-8 h-8 text-pink-300" />
                          </motion.div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          >
                            <Trophy className="w-8 h-8 text-yellow-400" />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Continue Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <button
                          onClick={onClose}
                          className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-black text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-yellow-300"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          Continue
                        </button>
                      </motion.div>

                      {/* Small footer text */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm text-purple-200 mt-6"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        🏆 Midnight Mafia Cheer · Worlds 2026
                      </motion.p>

                      {/* Referral Link */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-6 pb-2"
                      >
                        <motion.button
                          onClick={handleShare}
                          className="relative px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full text-white font-bold shadow-lg border-2 border-white/50 overflow-hidden group"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                          animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              "0 0 20px rgba(236, 72, 153, 0.5)",
                              "0 0 30px rgba(236, 72, 153, 0.8)",
                              "0 0 20px rgba(236, 72, 153, 0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Animated gradient overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          
                          {/* Floating sparkles */}
                          <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                            }}
                          >
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                          </motion.div>

                          <motion.div
                            className="absolute -bottom-1 -left-1"
                            animate={{
                              rotate: [360, 0],
                              scale: [1, 1.3, 1],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                            }}
                          >
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                          </motion.div>

                          <span className="relative z-10 text-base font-bold">
                            📱 Share Your Support
                          </span>
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* QR Code Modal for Desktop */}
          <AnimatePresence>
            {showQRCode && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[70]"
                  onClick={() => setShowQRCode(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[calc(100%-3rem)] max-w-md"
                >
                  <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-3xl border-2 border-purple-500/50 shadow-2xl p-6">
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-50"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>

                    <div className="text-center">
                      <h3 className="text-2xl text-white mb-2 font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        Scan to Share
                      </h3>
                      <p className="text-purple-200 text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Open your phone camera and scan this QR code
                      </p>

                      <div className="bg-white rounded-2xl p-6 mb-4 flex justify-center">
                        <QRCodeSVG
                          value={typeof window !== "undefined" ? window.location.origin : "https://midnightmafia.au"}
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      </div>

                      <div className="bg-black/40 rounded-xl p-3 mb-4">
                        <p className="text-purple-200 text-xs text-left whitespace-pre-line" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {`I'm a proud supporter of Midnight Mafia! 💜⭐\n\nI claimed number${numbers.length > 1 ? 's' : ''}: ${numbers.sort((a, b) => a - b).join(", ")}\n\nHelp them reach their goal for Worlds 2026!`}
                        </p>
                      </div>

                      <p className="text-purple-200 text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        📱 Share to Instagram, Facebook, Twitter & more!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}