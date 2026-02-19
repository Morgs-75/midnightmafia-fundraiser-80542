import { motion } from "motion/react";
import { NumberData } from "../types";

interface NumberTileProps {
  data: NumberData;
  isSelected: boolean;
  onSelect: (number: number) => void;
  onViewMessage?: (data: NumberData) => void;
}

export function NumberTile({ data, isSelected, onSelect, onViewMessage }: NumberTileProps) {
  const { number, status, displayName } = data;

  const isClickable = status === "available";
  const isSold      = status === "sold";
  const isHeld      = status === "held";

  const handleClick = () => {
    if (isClickable)                  onSelect(number);
    else if (isSold && onViewMessage) onViewMessage(data);
  };

  // Base tile classes
  const base = "aspect-square flex items-center justify-center rounded-lg cursor-pointer select-none relative overflow-hidden transition-transform";

  return (
    <div style={{ perspective: "600px" }} className="aspect-square">
      <motion.div
        animate={{ rotateY: isSold ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          onClick={handleClick}
          style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className={`
            ${base}
            ${isHeld
              ? "bg-gray-900 border border-gray-800 cursor-not-allowed opacity-40"
              : isSelected
              ? "bg-gradient-to-br from-violet-500 to-purple-700 border-2 border-violet-300 shadow-lg shadow-violet-500/40 scale-105"
              : "bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-700/50 hover:border-purple-400 hover:scale-105"
            }
          `}
        >
          {/* Glow pulse for available tiles */}
          {isClickable && !isSelected && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: (number * 1.618) % 4 }}
              style={{ background: "radial-gradient(circle, rgba(192,132,252,1) 0%, transparent 70%)" }}
            />
          )}

          <span
            className={`relative z-10 font-black leading-none
              ${isSelected ? "text-white" : isHeld ? "text-gray-700" : "text-purple-200"}
            `}
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(0.72rem, 3.1vw, 1.44rem)",
            }}
          >
            {number}
          </span>
        </div>

        {/* BACK (sold) */}
        <div
          onClick={handleClick}
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className={`${base} bg-gradient-to-br from-pink-900 to-rose-950 border border-pink-500/50 cursor-pointer flex-col gap-0.5
            shadow-[0_0_10px_rgba(249,168,212,0.3)]`}
        >
          <span
            className="text-pink-200 font-black leading-none"
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(0.72rem, 3.1vw, 1.44rem)",
            }}
          >
            {number}
          </span>
          {displayName && (
            <span
              className="text-pink-300 leading-tight text-center px-0.5 truncate w-full text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(0.35rem, 1.2vw, 0.55rem)",
              }}
            >
              {displayName}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
