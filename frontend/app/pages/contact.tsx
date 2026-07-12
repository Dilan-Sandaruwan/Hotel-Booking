"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inputCls = "w-full px-4 py-3 bg-navy-850/60 border border-gold-500/15 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all";

  return (
    <div className="pt-24 min-h-screen bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="text-center mb-14 animate-fade-in-up">
          <h1 className="text-white text-3xl md:text-4xl mb-4 font-display">
            Contact <span className="text-gold-gradient">LuxeStay</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Have questions about our premium accommodations or partnership opportunities? Reach out to our concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details */}
          <div className="glass p-8 rounded-2xl h-fit space-y-8 animate-fade-in">
            <h3 className="text-gold-500 text-sm font-bold uppercase tracking-wider border-b border-gold-500/10 pb-2">Concierge Desk</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h4 className="text-white text-sm font-semibold">Phone Inquiries</h4>
                  <p className="text-slate-400 text-sm mt-1">+94 11 234 5678</p>
                  <p className="text-slate-500 text-xs">24/7 International Hotline</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">✉</span>
                <div>
                  <h4 className="text-white text-sm font-semibold">Email Desk</h4>
                  <p className="text-slate-400 text-sm mt-1">concierge@luxestay.com</p>
                  <p className="text-slate-500 text-xs">Fast response within 2 hours</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h4 className="text-white text-sm font-semibold">Headquarters</h4>
                  <p className="text-slate-400 text-sm mt-1">LuxeStay Tower, Galle Road,</p>
                  <p className="text-slate-400 text-sm">Colombo 03, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 glass p-8 rounded-2xl animate-fade-in delay-100">
            <h3 className="text-gold-500 text-sm font-bold uppercase tracking-wider border-b border-gold-500/10 pb-2 mb-6">Send Message</h3>

            {submitted && (
              <div className="mb-6 px-5 py-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-2 animate-fade-in">
                <span>✓</span> Thank you! Your message has been sent to our concierge desk.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={inputCls}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry about suite availability"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need..."
                  className={`${inputCls} resize-y`}
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
