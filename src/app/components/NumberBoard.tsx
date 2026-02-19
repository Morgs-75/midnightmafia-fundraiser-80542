import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NumberData } from "../types";
import { NumberTile } from "./NumberTile";
import { MessageModal } from "./MessageModal";
import { Sparkles, Circle } from "lucide-react";

interface NumberBoardProps {
  numbers: NumberData[];
  selectedNumbers: number[];
  onSelectNumber: (number: number) => void;
}

export function NumberBoard({ numbers, selectedNumbers, onSelectNumber }: NumberBoardProps) {
  const [selectedMessage, setSelectedMessage] = useState<NumberData | null>(null);
  const soldCount = numbers.filter(n => n.status === "sold").length;

  return (
    <section className="px-4 py-8">
      <h2 className="text-3xl mb-6 text-center text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
        Choose Your Lucky Numbers
      </h2>

      {/* Legend */}
      <div className="max-w-4xl mx-auto mb-6 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-600/30 to-purple-700/30 border-2 border-pink-500 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-pink-400" />
            </div>
            <span className="text-gray-300" style={{ fontFamily: "Poppins, sans-serif" }}>
              Sold <span className="text-pink-400 text-xs">(click to view message)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900/80 border-2 border-gray-700 rounded flex items-center justify-center">
              <Circle className="w-3 h-3 text-gray-300" />
            </div>
            <span className="text-gray-300" style={{ fontFamily: "Poppins, sans-serif" }}>Available</span>
          </div>
        </div>
      </div>

      {/* Board wrapper — relative for overlay, overflow:visible for puzzle tabs */}
      <div className="relative max-w-4xl mx-auto">
        <div
          className="grid grid-cols-10 gap-1"
          data-number-board
        >
          {numbers.map((numberData) => (
            <NumberTile
              key={numberData.number}
              data={numberData}
              isSelected={selectedNumbers.includes(numberData.number)}
              onSelect={onSelectNumber}
              onViewMessage={setSelectedMessage}
            />
          ))}
        </div>

        {/* "Thank You" overlay — fades in when all 200 are sold */}
        <AnimatePresence>
          {soldCount >= 200 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="text-center">
                <p
                  className="text-6xl font-black text-white drop-shadow-2xl"
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    textShadow: "0 0 40px rgba(255,215,0,0.8)",
                  }}
                >
                  THANK YOU
                </p>
                <p className="text-white text-xl mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  All 200 numbers sold!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={selectedMessage !== null}
        data={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </section>
  );
}
