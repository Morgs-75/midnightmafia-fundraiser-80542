import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, ArrowLeft, Send } from "lucide-react";

export function CustomerSupport() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    enquiry: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encode = (data: Record<string, string>) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "customer-support", ...formData }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <div className="max-w-xl mx-auto px-4 py-12">

        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 text-sm"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Board
        </a>

        <h1
          className="text-5xl text-white mb-2"
          style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "1px" }}
        >
          Customer Support
        </h1>
        <p className="text-gray-400 mb-2 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
          For any enquiries relating to the Midnight Mafia Numbers Board Fundraiser, please use the form below or contact us directly.
        </p>
        <p className="text-purple-400 text-sm mb-8" style={{ fontFamily: "Poppins, sans-serif" }}>
          Email: <a href="mailto:jemmarmorgan@gmail.com" className="underline underline-offset-2 hover:text-purple-300">jemmarmorgan@gmail.com</a>
        </p>

        <div className="text-gray-400 text-sm mb-8 space-y-1" style={{ fontFamily: "Poppins, sans-serif" }}>
          <p className="text-gray-300 font-semibold">This email address is provided solely for customer support and enquiries, including:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>Questions about entries or numbers</li>
            <li>Payment or confirmation issues</li>
            <li>Prize draw or winner enquiries</li>
            <li>General fundraiser information</li>
          </ul>
          <p className="mt-3 text-gray-500 text-xs italic">
            Support enquiries are handled on a best-efforts basis by a volunteer assisting with the fundraiser.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/60 border border-green-500/30 rounded-2xl p-8 text-center"
          >
            <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
            <h2
              className="text-3xl text-white mb-2"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Enquiry Received!
            </h2>
            <p className="text-gray-300 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
              Thank you for getting in touch. We'll get back to you as soon as possible.
            </p>
            <a
              href="/"
              className="inline-block mt-6 bg-purple-700 hover:bg-purple-600 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Back to Board
            </a>
          </motion.div>
        ) : (
          <form
            name="customer-support"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input type="hidden" name="form-name" value="customer-support" />
            <p className="hidden">
              <label>Don't fill this out: <input name="bot-field" /></label>
            </p>

            {/* Full Name */}
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-semibold text-gray-300 mb-1.5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Full Name <span className="text-pink-400">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-colors"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-1.5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Email Address <span className="text-pink-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-colors"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-300 mb-1.5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Phone Number <span className="text-pink-400">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-colors"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Enquiry */}
            <div>
              <label
                htmlFor="enquiry"
                className="block text-sm font-semibold text-gray-300 mb-1.5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Your Enquiry <span className="text-pink-400">*</span>
              </label>
              <textarea
                id="enquiry"
                name="enquiry"
                required
                rows={5}
                placeholder="Type your question or issue here"
                value={formData.enquiry}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-colors resize-none"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Privacy notice */}
            <p className="text-xs text-gray-500 italic" style={{ fontFamily: "Poppins, sans-serif" }}>
              Information submitted through this form is used solely to respond to your enquiry and is not retained beyond what is necessary to resolve the issue.
            </p>

            {error && (
              <p className="text-red-400 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-60 text-white rounded-xl py-3 font-semibold transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Send className="w-4 h-4" />
              {submitting ? "Sending..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
