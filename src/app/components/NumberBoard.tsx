import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NumberData } from "../types";
import { NumberTile } from "./NumberTile";
import { MessageModal } from "./MessageModal";

interface NumberBoardProps {
  numbers: NumberData[];
  selectedNumbers: number[];
  onSelectNumber: (number: number) => void;
}

export function NumberBoard({ numbers, selectedNumbers, onSelectNumber }: NumberBoardProps) {
  const [selectedMessage, setSelectedMessage] = useState<NumberData | null>(null);
  const soldCount = numbers.filter(n => n.status === "sold").length;

  return (
    <section className="px-4 pt-2 pb-8">
      <h2 className="text-3xl mb-6 text-center text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
        Choose Your Lucky Numbers
      </h2>


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
