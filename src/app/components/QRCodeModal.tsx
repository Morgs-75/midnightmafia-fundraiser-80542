import { motion, AnimatePresence } from "motion/react";
import { X, Download, Share2, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 1024;
    canvas.height = 1024;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "midnight-mafia-bingo-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-full max-w-md mx-4"
          >
            <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-3xl border-2 border-purple-500/50 shadow-2xl overflow-hidden">
              {/* Glow effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(168, 85, 247, 0.4)",
                    "0 0 80px rgba(168, 85, 247, 0.6)",
                    "0 0 40px rgba(168, 85, 247, 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0"
              />

              <div className="relative p-6 md:p-8">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-50"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 md:w-5 md:h-5 text-white" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Share2 className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  </motion.div>
                  <h2
                    className="text-3xl text-white mb-2"
                    style={{ fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Share This Fundraiser
                  </h2>
                  <p
                    className="text-purple-200 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Scan to support Midnight Mafia Cheer!
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-2xl p-6 mb-6 flex justify-center">
                  <QRCodeSVG
                    id="qr-code"
                    value={url}
                    size={256}
                    level="H"
                    includeMargin={true}
                    fgColor="#000000"
                  />
                </div>

                {/* URL Display */}
                <div className="bg-black/30 rounded-xl p-3 mb-4 border border-purple-500/30">
                  <p
                    className="text-purple-200 text-sm text-center break-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {url}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyLink}
                    className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg flex items-center justify-center gap-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Link
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadQR}
                    className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl text-gray-900 font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <Download className="w-5 h-5" />
                    Download QR Code
                  </motion.button>
                </div>

                {/* Info text */}
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-4 text-center"
                >
                  <p
                    className="text-yellow-300 text-xs"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    💜 Share with friends & family to help reach our goal!
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
