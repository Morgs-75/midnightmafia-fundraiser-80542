import { useState, useEffect } from "react";
import { HeroHeader } from "./HeroHeader";
import { NumberBoard } from "./NumberBoard";
import { CheckoutBar } from "./CheckoutBar";
import { CheckoutModal } from "./CheckoutModal";
import { ThankYouModal } from "./ThankYouModal";
import { InstagramStoryModal } from "./InstagramStoryModal";
import { FloatingBadges } from "./FloatingBadges";
import { UrgencyPopups } from "./UrgencyPopups";
import { UpsellModal } from "./UpsellModal";
import { SweepUpsellModal } from "./SweepUpsellModal";
import { PrizeDrawnPopup } from "./PrizeDrawnPopup";
import { MessageBubble } from "./MessageBubble";
import { QRCodeModal } from "./QRCodeModal";
import { ShareQRButton } from "./ShareQRButton";
import { WelcomeHint } from "./WelcomeHint";
import { TermsModal } from "./TermsModal";
import { PrivacyModal } from "./PrivacyModal";
import { GoalReachedPopup } from "./GoalReachedPopup";
import { NumberData } from "../types";
import {
  generateMockNumbers,
} from "../mockData";
import { useNumbers } from "../../lib/useNumbers";
import { calculateTotal as calculatePricing, PRICE_PER_NUMBER } from "../../lib/pricing";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

// ========================================
// CONFIGURATION - Edit these values
// ========================================
const CONFIG = {
  // Draw date - format: new Date(year, month-1, day, hour, minute)
  // EDIT THIS: Set your prize draw date and time
  drawDate: new Date(2026, 3, 1, 20, 0), // Example: April 1, 2026 at 8:00 PM

  // Prize Draw Popup Display
  // EDIT THIS: Set the date and time shown in the popup
  prizeDrawPopup: {
    date: "01-Apr-26", // Format: dd-mmm-yy
    time: "7:00pm", // Format: h:mm am/pm
  },

  // Team departure date (for display purposes)
  departureDate: "April 16, 2026",

  // Pricing: Use shared pricing constants from lib/pricing.ts
  pricePerNumber: PRICE_PER_NUMBER,
  bulkDeal: {
    quantity: 5,
    price: 100,
  },

  // Instagram handle
  teamInstagramHandle: "@outlaws.midnightmafia",

  // Team info
  teamName: "Midnight Mafia Cheer",
  contactName: "Jemma Morgan",
  contactPhone: "0481 568 152",
  contactEmail: "jemmarmorgan@gmail.com",
};

// ========================================

export function BingoGame() {
  // Load numbers from Supabase
  const { numbers: supabaseNumbers, loading: numbersLoading } = useNumbers();

  // Use Supabase data, fallback to mock data during loading or if empty
  const [numbers, setNumbers] = useState<NumberData[]>(
    generateMockNumbers(),
  );

  // Update local state when Supabase data loads
  useEffect(() => {
    if (!numbersLoading && supabaseNumbers.length > 0) {
      setNumbers(supabaseNumbers);
    }
  }, [numbersLoading, supabaseNumbers]);
  const [selectedNumbers, setSelectedNumbers] = useState<
    number[]
  >([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isSweepUpsellOpen, setIsSweepUpsellOpen] =
    useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] =
    useState(false);
  const [purchaseComplete, setPurchaseComplete] =
    useState(false);
  const [hasSeenSweepUpsell, setHasSeenSweepUpsell] =
    useState(false);
  const [isSweepBonusMode, setIsSweepBonusMode] =
    useState(false);
  const [lastPurchase, setLastPurchase] = useState<{
    numbers: number[];
    displayName: string;
    message: string;
  } | null>(null);

  // QR Code modal state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://midnightmafia.au";

  // State for message bubbles
  const [messageBubbles, setMessageBubbles] = useState<
    Array<{
      id: string;
      number: number;
      displayName: string;
      message: string;
      gridPosition: { row: number; col: number };
    }>
  >([]);

  // Calculate total raised from sold numbers
  const totalRaised = numbers.filter((n) => n.status === "sold").length * CONFIG.pricePerNumber;

  const handleSelectNumber = (number: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(number)) {
        return prev.filter((n) => n !== number);
      } else {
        // In sweep bonus mode, limit to 6 numbers
        if (isSweepBonusMode && prev.length >= 6) {
          return prev;
        }
        // Maximum 10 numbers can be selected
        if (prev.length >= 10) {
          return prev;
        }
        return [...prev, number];
      }
    });
  };

  // Auto-checkout when 6 numbers selected in sweep bonus mode
  useEffect(() => {
    if (isSweepBonusMode && selectedNumbers.length === 6) {
      // Automatically open checkout after a short delay
      const timer = setTimeout(() => {
        setIsCheckoutOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSweepBonusMode, selectedNumbers.length]);

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const handleCheckout = () => {
    const count = selectedNumbers.length;
    // Show upsell for 2-4 numbers: offer upgrade to 5 for $100
    if (count >= 2 && count <= 4) {
      setIsUpsellOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleUpsellAccept = () => {
    const count = selectedNumbers.length;

    const availableNumbers = numbers
      .filter(
        (n) =>
          n.status === "available" &&
          !selectedNumbers.includes(n.number),
      )
      .map((n) => n.number);

    let numbersToAdd = 0;

    // 2-4 numbers: Upgrade to 5 for $100
    if (count >= 2 && count <= 4) {
      numbersToAdd = 5 - count;
    }

    const additionalNumbers = availableNumbers.slice(0, numbersToAdd);
    setSelectedNumbers((prev) => [...prev, ...additionalNumbers]);

    // Close upsell and open checkout
    setIsUpsellOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpsellDecline = () => {
    // Proceed with current selection
    setIsUpsellOpen(false);
    setIsCheckoutOpen(true);
  };

  // Note: Payment flow redirects to Square and returns to success.html
  // Numbers are updated via webhook + Supabase realtime
  // No need for manual state updates here

  const handleThankYouClose = () => {
    setIsThankYouOpen(false);
    // Skip sweep upsell - no longer relevant with new pricing
    // Just show Instagram modal after Thank You
    setTimeout(() => {
      setIsInstagramModalOpen(true);
    }, 500);
  };

  const handleSweepAccept = () => {
    // Close the modal and enter sweep bonus mode
    setIsSweepUpsellOpen(false);
    setIsSweepBonusMode(true);
    setSelectedNumbers([]); // Clear any previous selections
  };

  const handleSweepDecline = () => {
    setIsSweepUpsellOpen(false);
    // Show Instagram story modal after declining
    setIsInstagramModalOpen(true);
  };

  const handleClaimBonus = (
    popupType: "flash" | "bonus" | "alert",
  ) => {
    // Auto-select available numbers based on the popup type
    const availableNumbers = numbers
      .filter((n) => n.status === "available")
      .map((n) => n.number);

    if (popupType === "flash" || popupType === "bonus") {
      // For flash/bonus deal: auto-select 5 numbers for $100
      const numbersToSelect = availableNumbers.slice(0, 5);
      setSelectedNumbers(numbersToSelect);
      setIsCheckoutOpen(true);
    } else if (popupType === "alert") {
      // For alert: just open checkout with any current selection
      setIsCheckoutOpen(true);
    }
  };

  const createConfetti = () => {
    // Simple confetti effect using motion
    const confettiContainer = document.getElementById(
      "confetti-container",
    );
    if (!confettiContainer) return;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti-piece";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.backgroundColor = [
        "#ffd700",
        "#ff1493",
        "#bf40ff",
      ][Math.floor(Math.random() * 3)];
      confettiContainer.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  };

  useEffect(() => {
    if (purchaseComplete) {
      const timer = setTimeout(
        () => setPurchaseComplete(false),
        5000,
      );
      return () => clearTimeout(timer);
    }
  }, [purchaseComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* Share QR Button */}
      <ShareQRButton onClick={() => setIsQRModalOpen(true)} />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={currentUrl}
      />

      {/* Welcome Hint Popup */}
      <WelcomeHint />


      {/* Prize Drawn Popup */}
      <PrizeDrawnPopup
        drawDate={CONFIG.prizeDrawPopup.date}
        drawTime={CONFIG.prizeDrawPopup.time}
      />

      {/* Goal Reached Popup */}
      <GoalReachedPopup totalRaised={totalRaised} goalAmount={1000} />

      {/* Confetti Container */}
      

      {/* Sweep Bonus Mode Banner */}
      {isSweepBonusMode && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl p-4 md:p-6 shadow-2xl z-50 border-2 border-yellow-400"
        >
          <div className="text-center space-y-2">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <p
                className="text-xl md:text-3xl text-yellow-300 font-black leading-tight"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                🎉 CONGRATULATIONS ON ACCEPTING YOUR BONUS! 🎉
              </p>
            </motion.div>
            <motion.p
              className="text-lg md:text-2xl text-white font-bold"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(255, 255, 255, 0.5)",
                  "0 0 30px rgba(255, 255, 255, 0.8)",
                  "0 0 20px rgba(255, 255, 255, 0.5)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Pick the next 6 numbers for only $100!
            </motion.p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
              <p
                className="text-base md:text-lg text-yellow-100"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Select {6 - selectedNumbers.length} more{" "}
                {selectedNumbers.length === 5
                  ? "number"
                  : "numbers"}
              </p>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Banner */}
      {purchaseComplete && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg p-4 shadow-2xl z-50 border-2 border-yellow-400"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <p
                className="font-semibold text-white"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Purchase Complete! 🎉
              </p>
              <p
                className="text-sm text-yellow-100"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Thank you for supporting the team!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <HeroHeader drawDate={CONFIG.drawDate} />

      <NumberBoard
        numbers={numbers}
        selectedNumbers={selectedNumbers}
        onSelectNumber={handleSelectNumber}
      />

      {/* Instagram Story Modal - Show after sweep upsell is closed */}
      {lastPurchase && (
        <InstagramStoryModal
          isOpen={isInstagramModalOpen}
          numbers={lastPurchase.numbers}
          displayName={lastPurchase.displayName}
          message={lastPurchase.message}
          teamHandle={CONFIG.teamInstagramHandle}
          onClose={() => setIsInstagramModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="px-4 py-12 text-center border-t border-gray-800 mt-12">
        <p
          className="text-gray-400 mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          All proceeds support {CONFIG.teamName}'s journey to
          Worlds Championship
        </p>
        <p
          className="text-sm text-purple-400 mb-3"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ✈️ Team departs {CONFIG.departureDate}
        </p>
        <p
          className="text-sm text-gray-500"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Payments secured by Square · Questions? Contact{" "}
          {CONFIG.contactPhone} or {CONFIG.contactEmail}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
          <a
            href="/terms-of-service"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </a>
          <span className="text-gray-700">·</span>
          <a
            href="/privacy-policy"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-gray-700">·</span>
          <a
            href="/customer-support"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
          >
            Customer Support
          </a>
        </div>
      </footer>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />

      {/* Checkout Components */}
      <CheckoutBar
        selectedNumbers={selectedNumbers}
        pricePerNumber={CONFIG.pricePerNumber}
        onCheckout={handleCheckout}
        onClearSelection={handleClearSelection}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        selectedNumbers={selectedNumbers}
        pricePerNumber={CONFIG.pricePerNumber}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedNumbers([]); // Clear selection when closing checkout
        }}
      />

      <UpsellModal
        isOpen={isUpsellOpen}
        selectedNumbers={selectedNumbers}
        pricePerNumber={CONFIG.pricePerNumber}
        onClose={() => {
          setIsUpsellOpen(false);
          setSelectedNumbers([]); // Clear selection when closing upsell
        }}
        onAccept={handleUpsellAccept}
        onDecline={handleUpsellDecline}
      />

      <SweepUpsellModal
        isOpen={isSweepUpsellOpen}
        selectedNumbers={selectedNumbers}
        pricePerNumber={CONFIG.pricePerNumber}
        onClose={() => setIsSweepUpsellOpen(false)}
        onAccept={handleSweepAccept}
        onDecline={handleSweepDecline}
      />

      {/* Thank You Modal */}
      {lastPurchase && (
        <ThankYouModal
          isOpen={isThankYouOpen}
          displayName={lastPurchase.displayName}
          numbers={lastPurchase.numbers}
          onClose={handleThankYouClose}
        />
      )}

      {/* Message Bubbles */}
      {messageBubbles.map((bubble) => (
        <MessageBubble
          key={bubble.id}
          number={bubble.number}
          displayName={bubble.displayName}
          message={bubble.message}
          gridPosition={bubble.gridPosition}
          onComplete={() => {
            setMessageBubbles((prev) =>
              prev.filter((b) => b.id !== bubble.id),
            );
          }}
        />
      ))}

      {/* CSS for confetti animation */}
      <style>{`
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear forwards;
        }
        
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}