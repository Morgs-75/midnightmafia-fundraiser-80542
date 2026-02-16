import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Trophy, Plane, X, Share2 } from "lucide-react";
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

  const getShareMessage = () => {
    const numbersText = numbers.sort((a, b) => a - b).join(", ");
    const shareText = `I'm a proud supporter of Midnight Mafia! 💜⭐\n\nI claimed number${numbers.length > 1 ? 's' : ''}: ${numbersText}\n\nHelp them reach their goal for Worlds 2026!`;
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://midnightmafia.au";
    return { shareText, shareUrl, fullMessage: `${shareText}\n\n${shareUrl}` };
  };

  const handleShareInstagram = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      setShowQRCode(true);
    } else {
      const { fullMessage } = getShareMessage();
      if (navigator.share) {
        navigator.share({ title: "Support Midnight Mafia Cheer", text: fullMessage });
      } else {
        navigator.clipboard.writeText(fullMessage);
        alert("Copied! Paste in your Instagram story 💜");
      }
    }
  };

  const handleShareFacebook = () => {
    const { shareUrl } = getShareMessage();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const { shareText, shareUrl } = getShareMessage();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const { fullMessage } = getShareMessage();
    window.open(`https://wa.me/?text=${encodeURIComponent(fullMessage)}`, '_blank');
  };

  const handleCopyLink = async () => {
    const { fullMessage } = getShareMessage();
    try {
      await navigator.clipboard.writeText(fullMessage);
      alert("Message and link copied! 💜");
    } catch (err) {
      console.log("Clipboard failed:", err);
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

                      {/* Social Sharing */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-6 pb-2"
                      >
                        <p className="text-purple-200 text-sm mb-3 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          📱 Share Your Support
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                          {/* Instagram */}
                          <motion.button
                            onClick={handleShareInstagram}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                            title="Instagram"
                          >
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                          </motion.button>

                          {/* Facebook */}
                          <motion.button
                            onClick={handleShareFacebook}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                            title="Facebook"
                          >
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          </motion.button>

                          {/* Twitter/X */}
                          <motion.button
                            onClick={handleShareTwitter}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                            title="Twitter/X"
                          >
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </motion.button>

                          {/* WhatsApp */}
                          <motion.button
                            onClick={handleShareWhatsApp}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                            title="WhatsApp"
                          >
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          </motion.button>

                          {/* Copy Link */}
                          <motion.button
                            onClick={handleCopyLink}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                            title="Copy Link"
                          >
                            <Share2 className="w-6 h-6 text-white" />
                          </motion.button>
                        </div>
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