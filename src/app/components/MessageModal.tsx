import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Sparkles, Crown } from "lucide-react";
import { NumberData } from "../types";

interface MessageModalProps {
  isOpen: boolean;
  data: NumberData | null;
  onClose: () => void;
}

export function MessageModal({ isOpen, data, onClose }: MessageModalProps) {
  if (!data) return null;

  const { number, displayName, message, isTeamNumber } = data;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 180 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className={`relative h-full md:h-auto bg-gradient-to-br ${
              isTeamNumber
                ? 'from-purple-900/95 to-black/95'
                : 'from-pink-900/95 to-purple-900/95'
            } rounded-3xl border-2 ${
              isTeamNumber ? 'border-purple-400' : 'border-pink-500'
            } shadow-2xl overflow-hidden`}>

              {/* Sparkle effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                />
              </div>

              {/* Content */}
              <div className="relative p-8">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Number badge */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`relative w-24 h-24 rounded-2xl ${
                      isTeamNumber
                        ? 'bg-gradient-to-br from-purple-700 to-black border-4 border-purple-400'
                        : 'bg-gradient-to-br from-pink-600 to-purple-700 border-4 border-pink-500'
                    } shadow-2xl flex items-center justify-center`}
                  >
                    {isTeamNumber ? (
                      <Crown className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-pink-400" />
                    )}
                    <span
                      className={`text-5xl font-bold ${
                        isTeamNumber ? 'text-purple-300' : 'text-white'
                      }`}
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      {number}
                    </span>
                  </motion.div>
                </div>

                {/* Team badge */}
                {isTeamNumber && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-4"
                  >
                    <span className="inline-block px-4 py-1 bg-purple-600 rounded-full text-yellow-300 text-sm font-bold border border-yellow-400">
                      ⭐ TEAM NUMBER
                    </span>
                  </motion.div>
                )}

                {/* Supporter name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className={`w-5 h-5 ${isTeamNumber ? 'text-purple-400' : 'text-pink-400'}`} />
                    <h2
                      className="text-2xl text-white font-bold"
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      {displayName || 'Anonymous'}
                    </h2>
                    <Heart className={`w-5 h-5 ${isTeamNumber ? 'text-purple-400' : 'text-pink-400'}`} />
                  </div>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Supporter
                  </p>
                </motion.div>

                {/* Message */}
                {message ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`p-6 rounded-2xl ${
                      isTeamNumber
                        ? 'bg-purple-950/50 border border-purple-700/50'
                        : 'bg-black/30 border border-pink-500/30'
                    }`}
                  >
                    <p
                      className="text-lg text-white text-center leading-relaxed"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      "{message}"
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-2xl bg-black/30 border border-gray-700/50"
                  >
                    <p
                      className="text-gray-400 text-center italic"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      No message left
                    </p>
                  </motion.div>
                )}

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Thank you for supporting the team! 🏆
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
