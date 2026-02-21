import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, Gift, Sparkles } from "lucide-react";

interface CheckoutBarProps {
  selectedNumbers: number[];
  pricePerNumber: number;
  onCheckout: () => void;
  onClearSelection: () => void;
}

// $25 per number; 5 for $100 (save $25); 6+: $100 + $25 each above 5
const calculatePrice = (count: number, pricePerNumber: number) => {
  if (count === 0) return 0;
  if (count <= 4) return count * pricePerNumber;
  return 100 + ((count - 5) * pricePerNumber);
};

// Gross up fee so net received = subtotal after Square's 1.6% + $0.10 + 10% GST on fee
const calculateStripeFee = (subtotal: number) => {
  return Math.round(((subtotal * 0.0176 + 0.11) / 0.9824) * 100) / 100;
};

// Calculate total including Square fees
const calculateTotalWithFees = (subtotal: number) => {
  const fee = calculateStripeFee(subtotal);
  return subtotal + fee;
};

// Updated layout: Checkout button moved to top row
export function CheckoutBar({ selectedNumbers, pricePerNumber, onCheckout, onClearSelection }: CheckoutBarProps) {
  const count = selectedNumbers.length;
  const subtotal = calculatePrice(count, pricePerNumber);
  const total = calculateTotalWithFees(subtotal);
  const isOneAwayFromBonus = count % 5 === 4;
  const isAtFiveNumbers = count === 5;
  const bulkSets = Math.floor(count / 5);
  const savings = count > 0 ? (count * pricePerNumber) - subtotal : 0;

  return (
    <AnimatePresence>
      {selectedNumbers.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-pink-900 border-t-2 border-purple-500 shadow-2xl shadow-purple-900/50 z-50"
        >
          <div className="px-4 py-4 max-w-4xl mx-auto">
            {/* Special message when at 8 numbers */}
            {count === 8 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg border border-green-500/50 flex items-center gap-2"
              >
                <Gift className="w-5 h-5 text-green-400 animate-pulse" />
                <p className="text-sm text-green-300 font-semibold" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                  🎁 Click two extra numbers for FREE!
                </p>
              </motion.div>
            )}

            {/* Special message when at 9 numbers */}
            {count === 9 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg border border-green-500/50 flex items-center gap-2"
              >
                <Gift className="w-5 h-5 text-green-400 animate-pulse" />
                <p className="text-sm text-green-300 font-semibold" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                  🎁 Click one extra number for FREE!
                </p>
              </motion.div>
            )}

            {/* Bonus message when at 4, 9, 14, etc. */}
            {isOneAwayFromBonus && count !== 9 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg border border-yellow-500/50 flex items-center gap-2"
              >
                <Gift className="w-5 h-5 text-yellow-400 animate-pulse" />
                <p className="text-sm text-yellow-300 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  🎁 Click for a BONUS number! Next number is FREE
                </p>
              </motion.div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={onClearSelection}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={onCheckout}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Checkout</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-purple-200" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {count} {count === 1 ? 'number' : 'numbers'} selected
                    {bulkSets > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                        {bulkSets} FREE!
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-purple-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    #{selectedNumbers.sort((a, b) => a - b).join(', #')}
                  </p>
                </div>

                <div className="text-right">
                  {savings > 0 && (
                    <p className="text-xs text-yellow-400 line-through opacity-70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ${count * pricePerNumber}
                    </p>
                  )}
                  <p className="text-2xl text-yellow-400" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}>
                    ${total.toFixed(2)}
                  </p>
                  <p className="text-xs text-purple-300 opacity-75" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Includes payment fee
                  </p>
                  {savings > 0 && (
                    <p className="text-xs text-green-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Save ${savings}!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}