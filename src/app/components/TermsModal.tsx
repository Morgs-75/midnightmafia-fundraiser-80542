import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
              <h2
                className="text-xl text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "1px" }}
              >
                Terms of Service
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div
              className="overflow-y-auto px-6 py-5 text-gray-300 text-sm space-y-5 leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <p className="font-bold text-white text-base">
                TERMS OF SERVICE – MIDNIGHT MAFIA NUMBERS BOARD FUNDRAISER
              </p>

              <section>
                <h3 className="font-bold text-white mb-1">1. Organiser</h3>
                <p>
                  This fundraiser is organised by Troy Morgan (the Organiser) for the sole benefit of the cheerleading team known as Midnight Mafia (of Outlaws) (the Team).
                </p>
                <p className="mt-2">
                  Participation in this fundraiser is limited to Team members (Members) who are participating in the international cheerleading competition known as The Cheerleading Worlds, to be held in Orlando, Florida, between 24–27 April 2026.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">2. Purpose of Fundraiser</h3>
                <p>The fundraiser exists solely to support Members attending The Cheerleading Worlds in April 2026.</p>
                <p className="mt-2">100% of proceeds, after payment of the cash prize, belong to the Members.</p>
                <p className="mt-2">No other person or entity will receive any proceeds from the fundraiser.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">3. Fundraiser Structure</h3>
                <p>The fundraiser operates as a numbers board.</p>
                <p className="mt-2 font-semibold text-gray-200">Entry pricing:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>$25 AUD per number, or</li>
                  <li>5 numbers for $100 AUD.</li>
                </ul>
                <p className="mt-2">One prize of $500 AUD will be paid to a single winner.</p>
                <p className="mt-2">All remaining funds raised will be applied exclusively for the benefit of the Members.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">4. Eligibility</h3>
                <p>Participation is open to Australian residents aged 18 years or older only.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">5. How to Enter</h3>
                <p>Numbers are allocated on a first-paid, first-allocated basis.</p>
                <p className="mt-2">A number is not secured until payment has been received and confirmed by the Organiser.</p>
                <p className="mt-2">Requests for specific numbers are subject to availability at the time payment is received.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">6. Payments and Fees</h3>
                <p>Payments are processed via Stripe.</p>
                <p className="mt-2">Stripe transaction fees will be passed on to participants as an addition to the entry price and clearly disclosed prior to payment.</p>
                <p className="mt-2">All other costs associated with establishing or operating the fundraiser platform are borne solely by the Organiser.</p>
                <p className="mt-2">All payments are final and non-refundable, except where required by law.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">7. Prize Draw</h3>
                <p>The winning number will be selected using a random number generator.</p>
                <p className="mt-2">The draw will occur on the earlier of:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>7 days after all numbers on the board are sold, or</li>
                  <li>1 April 2026.</li>
                </ul>
                <p className="mt-2">The draw result is final.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">8. Winner Notification and Prize Payment</h3>
                <p>The winner will be notified directly using the contact details provided at entry.</p>
                <p className="mt-2">The prize of $500 AUD will be paid approximately 3 days after valid banking details are received.</p>
                <p className="mt-2">The Organiser is not responsible for delays caused by incomplete or incorrect information.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">9. Platform Disclaimer</h3>
                <p>
                  This fundraiser is not sponsored, endorsed, administered by, or associated with Instagram, Meta, Stripe, or any other social media or payment platform.
                </p>
                <p className="mt-2">Participants release all such platforms from any responsibility in connection with the fundraiser.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">10. Liability</h3>
                <p>
                  To the maximum extent permitted by law, the Organiser accepts no liability for loss, damage, or injury arising from participation, except where liability cannot be excluded.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">11. Privacy</h3>
                <p>Personal information is collected solely for administering the fundraiser and contacting the winner.</p>
                <p className="mt-2">Information will not be sold or shared with third parties.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">12. Changes or Cancellation</h3>
                <p>The Organiser reserves the right to amend these Terms or cancel the fundraiser if required due to unforeseen circumstances.</p>
                <p className="mt-2">Any refunds required by law will be processed accordingly.</p>
              </section>

              <section>
                <h3 className="font-bold text-white mb-1">13. Governing Law</h3>
                <p>These Terms are governed by the laws of Queensland, Australia.</p>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-800 shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white rounded-xl py-2.5 font-semibold transition-colors"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
