import { useState } from "react";
import { NumberData } from "../types";
import { NumberTile } from "./NumberTile";
import { MessageModal } from "./MessageModal";
import { Crown, Sparkles, Circle } from "lucide-react";

interface NumberBoardProps {
  numbers: NumberData[];
  selectedNumbers: number[];
  onSelectNumber: (number: number) => void;
}

export function NumberBoard({ numbers, selectedNumbers, onSelectNumber }: NumberBoardProps) {
  const [selectedMessage, setSelectedMessage] = useState<NumberData | null>(null);
  const teamNumberCount = numbers.filter(n => n.isTeamNumber).length;
  
  return (
    <section className="px-4 py-8">
      <h2 className="text-3xl mb-6 text-center text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Choose Your Lucky Numbers
      </h2>
      
      {/* Legend */}
      <div className="max-w-4xl mx-auto mb-6 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-700/40 to-black border-2 border-purple-400 rounded flex items-center justify-center relative">
              <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            </div>
            <span className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Team Entry <span className="text-purple-400 font-semibold">({teamNumberCount})</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-600/30 to-purple-700/30 border-2 border-pink-500 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-pink-400" />
            </div>
            <span className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Sold <span className="text-pink-400 text-xs">(click to view message)</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900/80 border-2 border-gray-700 rounded flex items-center justify-center">
              <Circle className="w-3 h-3 text-gray-300" />
            </div>
            <span className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>Available</span>
          </div>
        </div>
        
        {/* Team message */}
        <div className="mt-3 pt-3 border-t border-gray-800 text-center">
          <p className="text-xs text-purple-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Crown className="w-3 h-3 inline mb-1" /> The team has {teamNumberCount} free numbers for a chance to keep ALL the money! 🎯
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 max-w-4xl mx-auto" data-number-board>
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

      {/* Message Modal */}
      <MessageModal
        isOpen={selectedMessage !== null}
        data={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </section>
  );
}