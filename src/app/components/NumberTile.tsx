import { motion } from "motion/react";
import { NumberData } from "../types";
import { Sparkles, Crown } from "lucide-react";

interface NumberTileProps {
  data: NumberData;
  isSelected: boolean;
  onSelect: (number: number) => void;
  onViewMessage?: (data: NumberData) => void;
}

export function NumberTile({ data, isSelected, onSelect, onViewMessage }: NumberTileProps) {
  const { number, status, displayName, isTeamNumber } = data;
  // Force cache bust - updated colors to pink/purple

  // Random delay for pulsing animation (0-5 seconds)
  const pulseDelay = Math.random() * 5;

  const getStatusStyles = () => {
    if (isTeamNumber) {
      // Team numbers get special purple/black mafia styling
      return "bg-gradient-to-br from-purple-700/40 to-black border-2 border-purple-400 shadow-lg shadow-purple-500/40";
    }
    
    switch (status) {
      case "sold":
        return "bg-gradient-to-br from-pink-600/30 to-purple-700/30 border-2 border-pink-500 shadow-lg shadow-pink-500/30";
      case "held":
        return "bg-gray-800/60 border-2 border-pink-500/40 opacity-50";
      case "available":
      default:
        return isSelected
          ? "bg-gradient-to-br from-purple-600/40 to-pink-600/40 border-2 border-purple-400"
          : "bg-gray-900/80 border-2 border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20";
    }
  };

  const isClickable = status === "available";
  const isSold = status === "sold";

  const handleClick = () => {
    if (isClickable) {
      onSelect(number);
    } else if (isSold && onViewMessage) {
      onViewMessage(data);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative aspect-square rounded-lg transition-all duration-200 ${getStatusStyles()} ${
        isSold ? 'cursor-pointer hover:scale-105' : ''
      }`}
      animate={
        isClickable && !isSelected
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(168, 85, 247, 0)",
                "0 0 20px 5px rgba(168, 85, 247, 0.4)",
                "0 0 0 0 rgba(168, 85, 247, 0)"
              ]
            }
          : {}
      }
      transition={
        isClickable && !isSelected
          ? {
              duration: 2,
              repeat: Infinity,
              delay: pulseDelay,
              repeatDelay: 3
            }
          : isSold
          ? { rotate: { duration: 0.6 } }
          : {}
      }
      whileHover={isClickable ? { scale: 1.05 } : isSold ? { scale: 1.05 } : {}}
      whileTap={
        isClickable
          ? { scale: 0.95 }
          : isSold
          ? { scale: 0.95, rotate: 360 }
          : {}
      }
    >
      {/* Team badge for team numbers */}
      {isTeamNumber && (
        <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full px-2 py-0.5 shadow-lg border border-yellow-400">
          <span className="text-xs font-bold text-yellow-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ⭐ TEAM
          </span>
        </div>
      )}
      
      {/* Sparkle for regular sold numbers */}
      {status === "sold" && !isTeamNumber && (
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-pink-400" />
        </div>
      )}
      
      <div className="flex flex-col items-center justify-center h-full p-2">
        <span
          className={`text-2xl md:text-3xl ${
            isTeamNumber
              ? "text-purple-300"
              : status === "sold"
              ? "text-pink-400"
              : status === "held"
              ? "text-gray-500"
              : isSelected
              ? "text-white"
              : "text-gray-300"
          }`}
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          {number}
        </span>
        
        {status === "sold" && (isTeamNumber || displayName) && (
          <span className={`text-xs mt-1 truncate max-w-full px-1 ${
            isTeamNumber ? "text-purple-200/90 font-bold" : "text-pink-300/80"
          }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isTeamNumber ? "TEAM" : displayName}
          </span>
        )}
      </div>
    </motion.button>
  );
}