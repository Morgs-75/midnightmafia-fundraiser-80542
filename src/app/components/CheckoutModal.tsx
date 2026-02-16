import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Sparkles, Gift, TrendingUp, Zap, ChevronDown } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  selectedNumbers: number[];
  pricePerNumber: number;
  onClose: () => void;
  onConfirm: (data: { displayName: string; message: string; email: string }) => void;
}

// Helper to calculate price with bulk deal
// Buy 4 for $100, get the 5th FREE
// Special deal: 10 numbers = $175
// Once you have 5 numbers, you can get 6 more for $100 each package (11 = $200)
const calculatePrice = (count: number, pricePerNumber: number) => {
  if (count === 0) return 0;

  // First tier: 1-4 numbers at $25 each
  if (count <= 4) {
    return count * pricePerNumber;
  }

  // First package: 5 numbers for $100 (buy 4, get 1 free)
  if (count === 5) {
    return 100;
  }

  // 6-9 numbers: $100 for first 5, then $25 each for remainder
  if (count >= 6 && count <= 9) {
    return 100 + ((count - 5) * pricePerNumber);
  }

  // Special deal: 10 numbers = $175
  if (count === 10) {
    return 175;
  }

  // After 10 numbers, calculate based on packages
  // 11 numbers = $200 (5 + 6 for $100 each)
  // count = 5 + additional
  // First 5 = $100, then packages of 6 for $100 each
  const additional = count - 5;
  const additionalPackages = Math.floor(additional / 6);
  const remainder = additional % 6;

  // Base: $100 for first 5 numbers
  // Additional complete packages: additionalPackages * $100
  // Remainder numbers: remainder * $25 each
  return 100 + (additionalPackages * 100) + (remainder * pricePerNumber);
};

// Calculate Stripe fees (1.75% + $0.30 AUD)
const calculateStripeFee = (subtotal: number) => {
  return (subtotal * 0.0175) + 0.30;
};

// Calculate total including Stripe fees
const calculateTotalWithFees = (subtotal: number) => {
  const fee = calculateStripeFee(subtotal);
  return subtotal + fee;
};

export function CheckoutModal({ isOpen, selectedNumbers, pricePerNumber, onClose, onConfirm }: CheckoutModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [displayPublicly, setDisplayPublicly] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);

  const count = selectedNumbers.length;
  const subtotal = calculatePrice(count, pricePerNumber);
  const stripeFee = calculateStripeFee(subtotal);
  const total = calculateTotalWithFees(subtotal);
  const regularPrice = count * pricePerNumber;
  const savings = regularPrice - subtotal;
  const freeNumbers = Math.floor(count / 6); // One free per complete package

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Import board ID from config
      const { BOARD_ID } = await import('../../lib/supabase');

      // Check if promo code is used
      if (promoCode.trim().toUpperCase() === 'OUTLAWS') {
        // Use promo code flow - skip Stripe, create purchase directly
        const promoRes = await fetch('/.netlify/functions/create-promo-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boardId: BOARD_ID,
            numbers: selectedNumbers,
            displayName: displayPublicly ? displayName.trim() : 'Anonymous',
            email: email.trim(),
            phone: phone.trim(),
            message: message.trim(),
            promoCode: 'OUTLAWS',
          }),
        });

        if (!promoRes.ok) {
          const error = await promoRes.json();
          throw new Error(error.error || 'Failed to process promo code');
        }

        // Success! Reload to show updated board
        alert('✅ Success! Your team numbers have been claimed.');
        window.location.reload();
        return;
      }

      // Normal payment flow
      // Step 1: Create hold
      const holdRes = await fetch('/.netlify/functions/create-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: BOARD_ID,
          numbers: selectedNumbers,
          displayName: displayPublicly ? displayName.trim() : 'Anonymous',
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      if (!holdRes.ok) {
        const text = await holdRes.text();
        throw new Error(text || 'Failed to create hold');
      }

      const { holdId } = await holdRes.json();

      // Step 2: Create Stripe Checkout session
      const checkoutRes = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdId: holdId,
          quantity: selectedNumbers.length,
          amount: Math.round(total * 100), // Convert to cents, including Stripe fee
        }),
      });

      if (!checkoutRes.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await checkoutRes.json();

      // Step 3: Redirect to Stripe Checkout
      window.location.href = url;

    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to process checkout'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-purple-500/30 shadow-2xl z-50 overflow-hidden"
          >
            <div className="relative h-full flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="relative px-6 py-4 border-b border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="relative text-center mb-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-3xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      Secure Your Numbers
                    </h2>
                  </div>
                  <p className="text-purple-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Numbers: #{selectedNumbers.sort((a, b) => a - b).join(', #')}
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Your Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />

                    {/* Display publicly checkbox */}
                    <div className="mt-3 flex items-start gap-3">
                      <input
                        id="displayPublicly"
                        type="checkbox"
                        checked={displayPublicly}
                        onChange={(e) => setDisplayPublicly(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                      />
                      <label htmlFor="displayPublicly" className="text-sm text-gray-300 cursor-pointer" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Display my name publicly on the board <span className="text-gray-500 text-xs block mt-1">(If unchecked, your number will show as "Anonymous")</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Collapsible Encouragement Message */}
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                      className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        💬 Add Encouragement Message <span className="text-gray-500 text-xs">(Optional)</span>
                      </span>
                      <motion.div
                        animate={{ rotate: isMessageExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isMessageExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-gray-800/30">
                            <textarea
                              id="message"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Go team! Bring it home! 💪"
                              rows={3}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Email <span className="text-pink-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com (kept private)"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Phone Number <span className="text-gray-500 text-xs">(Optional - for updates & promotions)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0400 123 456 (kept private)"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="promoCode" className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Promo Code <span className="text-gray-500 text-xs">(Optional - Team members only)</span>
                    </label>
                    <input
                      id="promoCode"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter team code"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors uppercase"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                    {promoCode.trim().toUpperCase() === 'OUTLAWS' && (
                      <p className="mt-2 text-sm text-green-400 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ⭐ Team code valid! Your purchase will be FREE.
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    {savings > 0 && (
                      <div className="px-4 py-3 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Gift className="w-5 h-5 text-yellow-400" />
                          <p className="text-sm font-semibold text-yellow-300" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                            Bulk Deal Applied!
                          </p>
                        </div>
                        <div className="space-y-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          <div className="flex justify-between text-gray-300">
                            <span>Regular Price ({count} × ${pricePerNumber})</span>
                            <span>${regularPrice}</span>
                          </div>
                          <div className="flex justify-between text-green-400 font-semibold">
                            <span>Discount ({freeNumbers} FREE!)</span>
                            <span>-${savings}</span>
                          </div>
                          <div className="flex justify-between text-white font-bold pt-2 border-t border-yellow-500/30">
                            <span>Subtotal</span>
                            <span>${subtotal}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Breakdown */}
                    <div className="px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="space-y-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {promoCode.trim().toUpperCase() === 'OUTLAWS' ? (
                          <>
                            <div className="flex justify-between text-gray-300 line-through opacity-50">
                              <span>Subtotal ({count} {count === 1 ? 'number' : 'numbers'})</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-400 font-semibold">
                              <span>Team Discount</span>
                              <span>-${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white font-bold pt-2 border-t border-gray-600 text-xl">
                              <span>Total</span>
                              <span>$0.00</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-gray-300">
                              <span>Subtotal ({count} {count === 1 ? 'number' : 'numbers'})</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs">
                              <span>Payment processing fee</span>
                              <span>${stripeFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white font-bold pt-2 border-t border-gray-600 text-base">
                              <span>Total</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
                    >
                      {isSubmitting ? (
                        <span>Processing...</span>
                      ) : promoCode.trim().toUpperCase() === 'OUTLAWS' ? (
                        <span>Claim your Team Number!</span>
                      ) : (
                        <span>Complete Purchase - ${total.toFixed(2)}</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span style={{ fontFamily: 'Poppins, sans-serif' }}>Payments secured by Stripe</span>
                  </div>

                  <p className="text-xs text-center text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    All proceeds support the team's journey to Worlds 🏆
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}