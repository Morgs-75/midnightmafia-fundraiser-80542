import { motion } from "motion/react";
import { NumberData } from "../types";

interface NumberTileProps {
  data: NumberData;
  isSelected: boolean;
  onSelect: (number: number) => void;
  onViewMessage?: (data: NumberData) => void;
}

// Three colour schemes cycling across tiles
const PALETTES = [
  { bg: "linear-gradient(135deg, #9333ea, #581c87)", glow: "147,51,234",  text: "#f3e8ff" }, // purple
  { bg: "linear-gradient(135deg, #ec4899, #9d174d)", glow: "236,72,153",  text: "#fce7f3" }, // pink
  { bg: "linear-gradient(135deg, #0ea5e9, #075985)", glow: "14,165,233",  text: "#e0f2fe" }, // sky blue
];

export function NumberTile({ data, isSelected, onSelect, onViewMessage }: NumberTileProps) {
  const { number, status, displayName } = data;

  const isClickable = status === "available";
  const isSold      = status === "sold";
  const isHeld      = status === "held";

  const palette   = PALETTES[number % 3];
  const glowRgb   = palette.glow;
  const pulseDelay  = (number * 1.618) % 3;       // stagger glows
  const wiggleDelay = (number * 2.303) % 5;        // stagger wiggles

  const handleClick = () => {
    if (isClickable)                  onSelect(number);
    else if (isSold && onViewMessage) onViewMessage(data);
  };

  const numStyle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 900,
    fontSize: "clamp(0.6rem, 2.8vw, 1.2rem)",
    lineHeight: 1,
    display: "block",
  };

  // ── AVAILABLE tile ──────────────────────────────────────────────
  if (isClickable && !isSelected) {
    return (
      <motion.div
        onClick={handleClick}
        className="aspect-square flex items-center justify-center rounded-md select-none cursor-pointer"
        style={{ background: palette.bg, border: `1px solid rgba(${glowRgb},0.5)` }}
        animate={{
          filter: [
            `drop-shadow(0 0 3px rgba(${glowRgb},0.4)) drop-shadow(0 0 8px rgba(${glowRgb},0.2))`,
            `drop-shadow(0 0 8px rgba(${glowRgb},0.9)) drop-shadow(0 0 20px rgba(${glowRgb},0.5))`,
            `drop-shadow(0 0 3px rgba(${glowRgb},0.4)) drop-shadow(0 0 8px rgba(${glowRgb},0.2))`,
          ],
          scale: [1, 1.06, 1],
          rotate: [0, wiggleDelay % 2 === 0 ? 1.5 : -1.5, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: pulseDelay,
          ease: "easeInOut",
        }}
      >
        <span style={{ ...numStyle, color: palette.text }}>{number}</span>
      </motion.div>
    );
  }

  // ── SELECTED tile ───────────────────────────────────────────────
  if (isSelected) {
    return (
      <motion.div
        onClick={handleClick}
        className="aspect-square flex items-center justify-center rounded-md select-none cursor-pointer"
        style={{ background: "#000000", border: "2px solid rgba(255,255,255,0.9)" }}
        animate={{
          filter: [
            "drop-shadow(0 0 4px rgba(255,255,255,0.6)) drop-shadow(0 0 10px rgba(255,255,255,0.3))",
            "drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 25px rgba(255,255,255,0.6))",
            "drop-shadow(0 0 4px rgba(255,255,255,0.6)) drop-shadow(0 0 10px rgba(255,255,255,0.3))",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ ...numStyle, color: "#ffffff" }}>{number}</span>
      </motion.div>
    );
  }

  // ── HELD tile ───────────────────────────────────────────────────
  if (isHeld) {
    return (
      <div
        className="aspect-square flex items-center justify-center rounded-md select-none cursor-not-allowed"
        style={{ background: "#111827", border: "1px solid #1f2937", opacity: 0.4 }}
      >
        <span style={{ ...numStyle, color: "#4b5563" }}>{number}</span>
      </div>
    );
  }

  // ── SOLD tile (3D flip) ─────────────────────────────────────────
  return (
    <div style={{ perspective: "600px" }} className="aspect-square">
      <motion.div
        animate={{ rotateY: 180 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            background: palette.bg,
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ ...numStyle, color: palette.text }}>{number}</span>
        </div>

        {/* BACK */}
        <div
          onClick={handleClick}
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #9d174d, #500724)",
            border: "1px solid rgba(249,168,212,0.5)",
            boxShadow: "0 0 10px rgba(249,168,212,0.3)",
            borderRadius: "6px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "2px", cursor: "pointer",
          }}
        >
          <span style={{ ...numStyle, color: "#fce7f3" }}>{number}</span>
          {displayName && (
            <span style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(0.3rem, 1vw, 0.5rem)",
              color: "#f9a8d4", lineHeight: 1.2,
              textAlign: "center", maxWidth: "90%",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {displayName}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
