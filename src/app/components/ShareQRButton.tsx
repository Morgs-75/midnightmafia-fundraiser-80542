import { motion } from "motion/react";
import { QrCode } from "lucide-react";

interface ShareQRButtonProps {
  onClick: () => void;
}

export function ShareQRButton({ onClick }: ShareQRButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{
        scale: [1, 1.15, 1],
      }}
      transition={{
        scale: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed top-4 left-3 md:top-6 md:left-4 z-40 px-3 py-2 md:px-5 md:py-3 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-full shadow-2xl border-2 md:border-4 border-yellow-400 group flex items-center gap-1 md:gap-2"
      aria-label="Share QR Code"
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-xl"
      />

      {/* Inner glow */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 30px rgba(250, 204, 21, 0.6)",
            "0 0 60px rgba(250, 204, 21, 1)",
            "0 0 30px rgba(250, 204, 21, 0.6)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-0 rounded-full"
      />

      <div className="flex items-center gap-2 relative z-10">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <QrCode className="w-5 h-5 md:w-7 md:h-7 text-yellow-300 drop-shadow-lg" />
        </motion.div>
        <span className="text-white font-bold text-sm md:text-lg drop-shadow-lg" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>
          Share
        </span>
      </div>

      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm border border-yellow-400/50 shadow-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          📱 Share QR Code
        </div>
      </div>
    </motion.button>
  );
}
