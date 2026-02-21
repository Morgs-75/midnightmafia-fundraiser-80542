import { motion } from "motion/react";
import { NumberData } from "../types";

interface NumberTileProps {
  data: NumberData;
  isSelected: boolean;
  onSelect: (number: number) => void;
  onViewMessage?: (data: NumberData) => void;
}

// Glow colours cycling across tiles
const GLOWS = [
  "192,162,255", // lavender
  "251,182,225", // pink
  "147,220,252", // sky blue
];

export function NumberTile({ data, isSelected, onSelect, onViewMessage }: NumberTileProps) {
  const { number, status, displayName } = data;

  const isClickable = status === "available";
  const isSold      = status === "sold";
  const isHeld      = status === "held";

  const glowRgb    = GLOWS[number % 3];
  const pulseDelay  = (number * 1.618) % 3;
  const wiggleDelay = (number * 2.303) % 5;

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
    color: "#ffffff",
  };

  const baseStyle: React.CSSProperties = {
    background: "transparent",
    border: `1px solid rgba(${glowRgb},0.8)`,
    boxShadow: `0 0 6px rgba(${glowRgb},0.5), 0 0 14px rgba(${glowRgb},0.25), inset 0 0 6px rgba(${glowRgb},0.05)`,
  };

  // ── AVAILABLE tile ──────────────────────────────────────────────
  if (isClickable && !isSelected) {
    return (
      <motion.div
        onClick={handleClick}
        className="aspect-square flex items-center justify-center rounded-md select-none cursor-pointer"
        style={baseStyle}
        animate={{
          boxShadow: [
            `0 0 4px rgba(${glowRgb},0.4), 0 0 10px rgba(${glowRgb},0.2), inset 0 0 4px rgba(${glowRgb},0.05)`,
            `0 0 10px rgba(${glowRgb},0.9), 0 0 24px rgba(${glowRgb},0.5), inset 0 0 10px rgba(${glowRgb},0.1)`,
            `0 0 4px rgba(${glowRgb},0.4), 0 0 10px rgba(${glowRgb},0.2), inset 0 0 4px rgba(${glowRgb},0.05)`,
          ],
          scale: [1, 1.06, 1],
          rotate: [0, wiggleDelay % 2 === 0 ? 1.5 : -1.5, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: pulseDelay, ease: "easeInOut" }}
      >
        <span style={numStyle}>{number}</span>
      </motion.div>
    );
  }

  // ── SELECTED tile ───────────────────────────────────────────────
  if (isSelected) {
    return (
      <motion.div
        onClick={handleClick}
        className="aspect-square flex items-center justify-center rounded-md select-none cursor-pointer"
        style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.9)" }}
        animate={{
          boxShadow: [
            "0 0 6px rgba(255,255,255,0.5), 0 0 14px rgba(255,255,255,0.25), inset 0 0 6px rgba(255,255,255,0.05)",
            "0 0 14px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.6), inset 0 0 14px rgba(255,255,255,0.15)",
            "0 0 6px rgba(255,255,255,0.5), 0 0 14px rgba(255,255,255,0.25), inset 0 0 6px rgba(255,255,255,0.05)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={numStyle}>{number}</span>
      </motion.div>
    );
  }

  // ── HELD tile ───────────────────────────────────────────────────
  if (isHeld) {
    return (
      <div
        className="aspect-square flex items-center justify-center rounded-md select-none cursor-not-allowed"
        style={{ background: "transparent", border: "1px solid rgba(75,85,99,0.3)", opacity: 0.35 }}
      >
        <span style={{ ...numStyle, color: "#6b7280" }}>{number}</span>
      </div>
    );
  }

  // ── SOLD tile ───────────────────────────────────────────────────
  return (
    <div
      onClick={handleClick}
      className="aspect-square flex flex-col items-center justify-center rounded-md select-none cursor-pointer"
      style={{
        background: "linear-gradient(135deg, rgba(236,72,153,0.55), rgba(219,39,119,0.45))",
        border: "1px solid rgba(236,72,153,0.8)",
        boxShadow: "0 0 8px rgba(236,72,153,0.5), 0 0 18px rgba(236,72,153,0.25)",
        gap: "2px",
      }}
    >
      <span style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(0.35rem, 1.4vw, 0.65rem)",
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.05em",
          lineHeight: 1,
          display: "block",
        }}>SOLD</span>
      <span style={{ ...numStyle, fontSize: "clamp(0.5rem, 2.2vw, 1rem)" }}>{number}</span>
      {displayName && (
        <span style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "clamp(0.35rem, 1.2vw, 0.6rem)",
          color: "rgba(253,164,175,0.95)",
          lineHeight: 1.2,
          textAlign: "center",
          maxWidth: "90%",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {displayName}
        </span>
      )}
    </div>
  );
}
