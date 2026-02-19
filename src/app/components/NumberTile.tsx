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

  // Non-sold tiles: flat div, no 3D transforms
  if (!isSold) {
    return (
      <div
        onClick={handleClick}
        className={`
          aspect-square flex items-center justify-center rounded-md
          select-none cursor-pointer
          ${isHeld
            ? "bg-gray-800 border border-gray-700 opacity-40 cursor-not-allowed"
            : isSelected
            ? "bg-violet-600 border-2 border-violet-300 ring-2 ring-violet-400"
            : "bg-purple-900 border border-purple-700 hover:bg-purple-800"
          }
        `}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(0.6rem, 2.8vw, 1.2rem)",
            color: isHeld ? "#374151" : "#ffffff",
            lineHeight: 1,
            display: "block",
          }}
        >
          {number}
        </span>
      </div>
    );
  }

  // Sold tiles: 3D flip to pink back face
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
          className="aspect-square flex items-center justify-center rounded-md bg-purple-900 border border-purple-700"
        >
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 900, fontSize: "clamp(0.6rem, 2.8vw, 1.2rem)", color: "#ffffff", lineHeight: 1 }}>
            {number}
          </span>
        </div>

        {/* BACK */}
        <div
          onClick={handleClick}
          style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="aspect-square flex flex-col items-center justify-center rounded-md bg-pink-900 border border-pink-500 cursor-pointer gap-0.5"
        >
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 900, fontSize: "clamp(0.6rem, 2.8vw, 1.2rem)", color: "#fce7f3", lineHeight: 1 }}>
            {number}
          </span>
          {displayName && (
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(0.3rem, 1vw, 0.5rem)", color: "#f9a8d4", lineHeight: 1.2, textAlign: "center", maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
