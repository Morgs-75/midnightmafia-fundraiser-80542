import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Sparkles, Gift, ChevronDown } from "lucide-react";
import { calculatePrice, calculateStripeFee, calculateTotalWithFees, PRICE_PER_NUMBER } from "../../lib/pricing";

interface CheckoutModalProps {
  isOpen: boolean;
  selectedNumbers: number[];
  pricePerNumber: number;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, selectedNumbers, pricePerNumber, onClose }: CheckoutModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stayAnonymous, setStayAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const count = selectedNumbers.length;
  const subtotal = calculatePrice(count);
  const stripeFee = calculateStripeFee(subtotal);
  const total = calculateTotalWithFees(subtotal);
  const regularPrice = count * PRICE_PER_NUMBER;
  const savings = regularPrice - subtotal;
  const freeNumbers = Math.floor(count / 6); // One free per complete package

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Always validate name
    if (!displayName.trim()) {
      newErrors.displayName = "Please enter your name";
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = "Name must be at least 2 characters";
    } else if (displayName.trim().length > 50) {
      newErrors.displayName = "Name must be less than 50 characters";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate phone (optional, but if provided must be valid)
    if (phone.trim()) {
      // Remove spaces and check if it's a valid Australian phone format
      const phoneDigits = phone.replace(/\s/g, '');
      const phoneRegex = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
      if (!phoneRegex.test(phoneDigits)) {
        newErrors.phone = "Please enter a valid Australian phone number";
      }
    }

    // Validate message length
    if (message.trim().length > 200) {
      newErrors.message = "Message must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Import board ID from config
      const { BOARD_ID } = await import('../../lib/supabase');

      // Step 1: Create hold
      const holdRes = await fetch('/.netlify/functions/create-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: BOARD_ID,
          numbers: selectedNumbers,
          displayName: stayAnonymous ? 'Anonymous' : displayName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      if (!holdRes.ok) {
        if (holdRes.status === 409) {
          throw new Error('One or more of your selected numbers were just taken by someone else. Please select different numbers and try again.');
        }
        const text = await holdRes.text();
        throw new Error(text || 'Failed to reserve your numbers. Please try again.');
      }

      const { holdId } = await holdRes.json();

      // Step 2: Create Square payment link
      const checkoutRes = await fetch('/.netlify/functions/create-square-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdId: holdId,
          quantity: selectedNumbers.length,
          amount: Math.round(total * 100), // Convert to cents, including Stripe fee
        }),
      });

      if (!checkoutRes.ok) {
        const errorText = await checkoutRes.text();
        console.error('Checkout creation failed:', errorText);
        throw new Error('Failed to create payment session. Please try again or contact support.');
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
                  <div className="space-y-3">
                    {/* Name field — always required */}
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Your Name <span className="text-pink-400">*</span>
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => {
                          setDisplayName(e.target.value);
                          if (errors.displayName) setErrors({ ...errors, displayName: undefined });
                        }}
                        placeholder="Enter your name"
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                          errors.displayName ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                        }`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      />
                      {errors.displayName && (
                        <p className="mt-1 text-sm text-red-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {errors.displayName}
                        </p>
                      )}
                    </div>

                    {/* Anonymous opt-in */}
                    <div className="flex items-center gap-3 py-2 px-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <input
                        id="stayAnonymous"
                        type="checkbox"
                        checked={stayAnonymous}
                        onChange={(e) => setStayAnonymous(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900 cursor-pointer"
                      />
                      <label htmlFor="stayAnonymous" className="text-sm text-gray-300 cursor-pointer" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        I would like to remain anonymous
                        <span className="text-gray-500 text-xs block mt-0.5">
                          Your number will show as <span className="text-purple-400">"Anonymous"</span> on the board
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Collapsible Encouragement Message */}
                  <div className="border border-purple-500/30 rounded-lg overflow-hidden">
                    <motion.button
                      type="button"
                      onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 transition-colors flex items-center justify-between"
                      animate={!isMessageExpanded ? {
                        scale: [1, 1.02, 1],
                        x: [0, -2, 2, -2, 2, 0],
                        boxShadow: [
                          "0 0 0 0 rgba(168, 85, 247, 0)",
                          "0 0 15px 3px rgba(168, 85, 247, 0.4)",
                          "0 0 0 0 rgba(168, 85, 247, 0)"
                        ]
                      } : {}}
                      transition={!isMessageExpanded ? {
                        scale: { duration: 2, repeat: Infinity },
                        x: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
                        boxShadow: { duration: 2, repeat: Infinity }
                      } : {}}
                    >
                      <span className="text-sm font-medium text-purple-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        💬 Add Encouragement Message <span className="text-purple-400 text-xs">(Optional)</span>
                      </span>
                      <motion.div
                        animate={{ rotate: isMessageExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-purple-400" />
                      </motion.div>
                    </motion.button>
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
                              onChange={(e) => {
                                setMessage(e.target.value);
                                if (errors.message) setErrors({ ...errors, message: undefined });
                              }}
                              placeholder="Go team! Bring it home! 💪"
                              rows={3}
                              maxLength={200}
                              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                                errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                              }`}
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            />
                            <div className="flex justify-between items-center mt-1">
                              {errors.message && (
                                <p className="text-sm text-red-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  {errors.message}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 ml-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {message.length}/200
                              </p>
                            </div>
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="your@email.com (kept private)"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                      }`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Phone Number <span className="text-gray-500 text-xs">(Optional - for updates & promotions)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="0400 123 456 (kept private)"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'
                      }`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {errors.phone}
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
                            <span>Regular Price ({count} × ${PRICE_PER_NUMBER})</span>
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
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal ({count} {count === 1 ? 'number' : 'numbers'})</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs">
                          <span>Square processing fee</span>
                          <span>${stripeFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold pt-2 border-t border-gray-600 text-base">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
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