import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Sparkles, Trophy, Calendar } from "lucide-react";
import logoImage from "../../assets/6a2c355cdbff31bd04948b947b0cb06414f136cc.png";
import { useState } from "react";
import { QRCodeModal } from "./QRCodeModal";
import { ShareQRButton } from "./ShareQRButton";

export function LandingPage() {
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://midnightmafia.au';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white flex items-center justify-center px-4">
      {/* Share QR Button */}
      <ShareQRButton onClick={() => setIsQRModalOpen(true)} />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={currentUrl}
      />

      {/* Animated background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.2 
          }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(250,204,21,0.3)",
                "0 0 60px rgba(250,204,21,0.6)",
                "0 0 30px rgba(250,204,21,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full overflow-hidden border-4 border-yellow-400 w-64 h-64 md:w-80 md:h-80"
          >
            <img 
              src={logoImage} 
              alt="Midnight Mafia Outlaws Logo" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <motion.h1
            animate={{
              textShadow: [
                "0 0 20px rgba(250,204,21,0.5)",
                "0 0 40px rgba(250,204,21,0.8)",
                "0 0 20px rgba(250,204,21,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl md:text-7xl mb-4 text-yellow-400 leading-tight"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Welcome to<br />Midnight Mafia Bingo
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl text-purple-200 mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Where our bid to Worlds begins...
          </motion.p>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-purple-200" style={{ fontFamily: "Poppins, sans-serif" }}>
                <span className="font-bold text-yellow-400 text-lg">$250</span><br />
                Grand Prize
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-purple-200" style={{ fontFamily: "Poppins, sans-serif" }}>
                <span className="font-bold text-yellow-400 text-lg">April 16</span><br />
                Worlds 2026
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-purple-200" style={{ fontFamily: "Poppins, sans-serif" }}>
                <span className="font-bold text-yellow-400 text-lg">10 for $175</span><br />
                Best Deal
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
          }}
          transition={{ 
            delay: 1.2,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/bingo")}
          className="relative group"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 40px rgba(236,72,153,0.4)",
                "0 0 80px rgba(236,72,153,0.8)",
                "0 0 40px rgba(236,72,153,0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-purple-700 rounded-2xl blur-sm"
          />
          
          <div className="relative px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl border-2 border-yellow-400 shadow-2xl">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <p 
                className="text-4xl md:text-5xl text-white mb-1"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                🎲 Enter Now! 🎲
              </p>
              <p 
                className="text-sm text-pink-100"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Tap to choose your lucky numbers
              </p>
            </motion.div>
          </div>
        </motion.button>

        {/* Team info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-sm text-gray-400"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <p className="mb-2">
            <span className="text-purple-300">@outlaws.midnightmafia</span>
          </p>
          <p className="text-xs">
            Support Midnight Mafia Cheer on their journey to Worlds 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}