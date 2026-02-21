import { motion } from "motion/react";
import { Check } from "lucide-react";
import { NumberData } from "../types";

interface NumberTileProps {
  data: NumberData;
  isSelected: boolean;
  onSelect: (number: number) => void;
  onViewMessage?: (data: NumberData) => void;
}

// Glow colours cycling across tiles
const GLOWS = [
  "255,255,135", // yellow #ffff87
  "236,72,153", // pink #ec4899
  "72,222,236", // blue #48deec
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
          scale: [1, 1.02, 1],
          rotate: [0, wiggleDelay % 2 === 0 ? 0.5 : -0.5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: pulseDelay, ease: "easeInOut" }}
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
        <div style={{
          border: "2px solid #a3e635",
          borderRadius: "50%",
          padding: "clamp(2px, 0.5vw, 4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Check style={{ color: "#a3e635", width: "clamp(1.2rem, 5vw, 2rem)", height: "clamp(1.2rem, 5vw, 2rem)", strokeWidth: 3 }} />
        </div>
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
        background: "#000080",
        border: "1px solid #ffff87",
        gap: "2px",
      }}
    >
      <span style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(0.57rem, 2.3vw, 1.05rem)",
          color: "rgba(255,255,255,1)",
          letterSpacing: "0.05em",
          lineHeight: 1,
          display: "block",
        }}>SOLD</span>
      <span style={{ ...numStyle, fontSize: "clamp(0.4rem, 1.76vw, 0.8rem)" }}>{number}</span>
      {displayName && (
        <span style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "clamp(0.35rem, 1.2vw, 0.6rem)",
          color: "rgba(255,255,255,0.9)",
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
