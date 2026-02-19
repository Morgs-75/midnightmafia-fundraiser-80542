import { motion } from "motion/react";
import { NumberData } from "../types";

interface NumberTileProps {
  data: NumberData;
  isSelected: boolean;
  onSelect: (number: number) => void;
  onViewMessage?: (data: NumberData) => void;
}

const numStyle = {
  fontFamily: "Poppins, sans-serif",
  fontSize: "clamp(0.54rem, 2.3vw, 1.08rem)",
  fontWeight: 900,
  WebkitFontSmoothing: "antialiased" as const,
  MozOsxFontSmoothing: "grayscale" as const,
};

const nameStyle = {
  fontFamily: "Poppins, sans-serif",
  fontSize: "clamp(0.35rem, 1.2vw, 0.55rem)",
};

export function NumberTile({ data, isSelected, onSelect, onViewMessage }: NumberTileProps) {
  const { number, status, displayName } = data;

  const isClickable = status === "available";
  const isSold      = status === "sold";
  const isHeld      = status === "held";

  const handleClick = () => {
    if (isClickable)                  onSelect(number);
    else if (isSold && onViewMessage) onViewMessage(data);
  };

  const base = "aspect-square flex items-center justify-center rounded-lg select-none relative overflow-hidden";

  // Non-sold tiles: flat div, no 3D, pixel-perfect rendering
  if (!isSold) {
    return (
      <div
        onClick={handleClick}
        className={`
          ${base}
          ${isHeld
            ? "bg-gray-900 border border-gray-800 cursor-not-allowed opacity-40"
            : isSelected
            ? "bg-gradient-to-br from-violet-500 to-purple-700 border-2 border-violet-300 shadow-lg shadow-violet-500/40 scale-105 cursor-pointer"
            : "bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-700/50 hover:border-purple-400 hover:scale-105 cursor-pointer"
          }
        `}
      >
        {isClickable && !isSelected && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: (number * 1.618) % 4 }}
            style={{ background: "radial-gradient(circle, rgba(192,132,252,1) 0%, transparent 70%)" }}
          />
        )}
        <span
          className={`relative z-10 font-black leading-none ${isSelected ? "text-white" : isHeld ? "text-gray-700" : "text-purple-200"}`}
          style={numStyle}
        >
          {number}
        </span>
      </div>
    );
  }

  // Sold tiles: 3D flip
  return (
    <div style={{ perspective: "600px" }} className="aspect-square">
      <motion.div
        animate={{ rotateY: 180 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className={`${base} bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-700/50`}
        >
          <span className="text-purple-200 font-black leading-none" style={numStyle}>{number}</span>
        </div>

        {/* BACK */}
        <div
          onClick={handleClick}
          style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={`${base} bg-gradient-to-br from-pink-900 to-rose-950 border border-pink-500/50 cursor-pointer flex-col gap-0.5 shadow-[0_0_10px_rgba(249,168,212,0.3)]`}
        >
          <span className="text-pink-200 font-black leading-none" style={numStyle}>{number}</span>
          {displayName && (
            <span className="text-pink-300 leading-tight text-center px-0.5 truncate w-full" style={nameStyle}>
              {displayName}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
