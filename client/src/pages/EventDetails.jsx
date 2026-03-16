import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";
import {
  Calendar, Clock, MapPin, Users, ArrowLeft,
  Bell, Ticket, PartyPopper, Info,
  LayoutDashboard, PlusSquare, CheckCircle,
  X, ChevronRight, ChevronLeft, Minus, Plus,
  User, Mail, Phone, Sparkles,
  Shield, Download, Share2, QrCode,
  Smartphone,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL_EVENTS = [
  {
    id: 1,
    title: "Summer Music Festival 2026",
    price: 9790,
    date: "Monday, June 15, 2026",
    time: "6:00 PM",
    location: "Golden Gate Park, San Francisco",
    category: "Music",
    attendees: "2,547+ going",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070",
    description:
      "Experience the ultimate summer music festival featuring top artists from around the world. " +
      "Three days of non-stop music, food, and celebration in the heart of San Francisco. " +
      "Join thousands of music lovers for an unforgettable experience.",
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Event Starting Soon",
    desc: "Summer Music Festival starts in 2 hours",
    time: "2 hours ago",
    color: "bg-indigo-600",
    icon: <Calendar size={18} />,
    unread: true,
  },
  {
    id: 2,
    title: "Registration Confirmed",
    desc: "Your ticket for Tech Summit 2026 is confirmed",
    time: "5 hours ago",
    color: "bg-blue-600",
    icon: <Ticket size={18} />,
    unread: true,
  },
  {
    id: 3,
    title: "Event Update",
    desc: "New speaker added to AI Conference",
    time: "1 day ago",
    color: "bg-orange-500",
    icon: <Bell size={18} />,
    unread: false,
  },
  {
    id: 4,
    title: "Event Success",
    desc: "Your event 'Startup Meetup' reached 100 attendees!",
    time: "2 days ago",
    color: "bg-emerald-500",
    icon: <PartyPopper size={18} />,
    unread: false,
  },
];

// ─── Logo SVG ─────────────────────────────────────────────────────────────────

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="22" height="19" rx="3.5" fill="white" fillOpacity="0.15" />
      <rect x="3" y="6" width="22" height="19" rx="3.5" stroke="white" strokeWidth="1.8" />
      <rect x="3" y="6" width="22" height="7"  rx="3.5" fill="white" fillOpacity="0.25" />
      <rect x="3" y="9.5" width="22" height="3.5" fill="white" fillOpacity="0.25" />
      <line x1="9"  y1="3" x2="9"  y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="3" x2="19" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M14 14.5L15.2 17.2L18.2 17.5L16.1 19.4L16.7 22.3L14 20.8L11.3 22.3L11.9 19.4L9.8 17.5L12.8 17.2L14 14.5Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// ─── bKash Logo ───────────────────────────────────────────────────────────────

function BkashLogo({ size = 24 }) {
  return (
    <img
      src="https://www.bkash.com/sites/all/themes/bkashtheme/img/bkash-logo.png"
      alt="bKash"
      width={size * 2.5}
      height={size}
      style={{ objectFit: "contain" }}
      onError={(e) => {
        // Fallback if CDN fails
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "flex";
      }}
    />
  );
}

// ─── BDT Currency Helper ──────────────────────────────────────────────────────

const USD_TO_BDT = 110;
const toBDT      = (usd) => Math.round(usd * USD_TO_BDT);
const fmtBDT     = (usd) => `৳${toBDT(usd).toLocaleString()}`;

// ─── Detail Item ──────────────────────────────────────────────────────────────

function DetailItem({ icon, label, value, dm }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          text-indigo-500 shrink-0
          ${dm ? "bg-[#0F0121]" : "bg-indigo-50"}
        `}
      >
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">
          {label}
        </p>
        <p className={`font-bold text-sm leading-snug ${dm ? "text-white" : "text-slate-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Checkout Panel ───────────────────────────────────────────────────────────

function CheckoutPanel({ event, dm, onClose, onConfirmed }) {
  const [step,     setStep]     = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [loading,  setLoading]  = useState(false);
  const [details,  setDetails]  = useState({
    name: "",
    email: "",
    phone: "",
    bkashNumber: "",
    bkashPin: "",
  });

  const serviceFee = 550;
  const subtotal   = event.price * quantity;
  const total      = subtotal + serviceFee;

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      // Notify parent that booking is confirmed
      onConfirmed();
    }, 2000);
  };

  const inputClass = `
    w-full px-5 py-4 rounded-2xl outline-none font-bold text-sm
    transition-all border focus:ring-4 focus:border-indigo-400
    ${dm
      ? "bg-[#0F0121] border-white/10 text-white placeholder:text-slate-600 focus:ring-indigo-500/10"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500/10"
    }
  `;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
        onClick={step < 3 ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-[520px] z-[100]
          flex flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.4)]
          animate-in slide-in-from-right duration-500
          ${dm ? "bg-[#0F0121]" : "bg-white"}
        `}
      >
        {/* Panel header */}
        <div
          className={`
            px-8 py-6 flex items-center justify-between
            border-b shrink-0
            ${dm ? "border-white/5" : "border-slate-100"}
          `}
        >
          <div className="flex items-center gap-4">
            {step > 1 && step < 3 && (
              <button
                onClick={() => setStep(step - 1)}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${dm
                    ? "bg-white/5 text-white hover:bg-white/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <h2 className={`text-xl font-black ${dm ? "text-white" : "text-slate-900"}`}>
                {step === 1 && "Order Summary"}
                {step === 2 && "Your Details"}
                {step === 3 && "Booking Confirmed!"}
              </h2>
              <p className="text-slate-400 font-bold text-xs mt-0.5">
                {step === 1 && "Review your order before checkout"}
                {step === 2 && "Fill in your info and pay via bKash"}
                {step === 3 && "Your tickets are on their way"}
              </p>
            </div>
          </div>

          {step < 3 && (
            <button
              onClick={onClose}
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all
                ${dm
                  ? "bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"
                  : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                }
              `}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Step indicators */}
        {step < 3 && (
          <div
            className={`
              px-8 py-4 flex items-center gap-3 shrink-0 border-b
              ${dm ? "border-white/5" : "border-slate-100"}
            `}
          >
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center
                      text-[11px] font-black transition-all
                      ${s < step
                        ? "bg-emerald-500 text-white"
                        : s === step
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : dm
                            ? "bg-white/10 text-slate-500"
                            : "bg-slate-100 text-slate-400"
                      }
                    `}
                  >
                    {s < step ? <CheckCircle size={14} /> : s}
                  </div>
                  <span
                    className={`
                      text-[11px] font-black uppercase tracking-widest
                      ${s === step ? "text-indigo-500" : "text-slate-400"}
                    `}
                  >
                    {s === 1 ? "Summary" : "Payment"}
                  </span>
                </div>
                {s < 2 && (
                  <div
                    className={`
                      flex-1 h-[2px] rounded-full
                      ${step > 1 ? "bg-emerald-500" : dm ? "bg-white/10" : "bg-slate-100"}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6">

          {/* ── Step 1: Order Summary ── */}
          {step === 1 && (
            <div className="space-y-6">

              {/* Event card */}
              <div
                className={`
                  rounded-[28px] overflow-hidden border
                  ${dm ? "border-white/5" : "border-slate-100"}
                `}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className={`p-5 ${dm ? "bg-[#1E0B3B]" : "bg-slate-50"}`}>
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">
                    {event.category}
                  </span>
                  <h3 className={`text-base font-black mt-1 ${dm ? "text-white" : "text-slate-900"}`}>
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-slate-400 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {event.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
              <div
                className={`
                  p-5 rounded-[24px] border flex items-center justify-between
                  ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-slate-50 border-slate-100"}
                `}
              >
                <div>
                  <p className={`font-black text-sm ${dm ? "text-white" : "text-slate-900"}`}>
                    Number of Tickets
                  </p>
                  <p className="text-slate-400 text-xs font-bold mt-0.5">
                    ৳{event.price.toLocaleString()} per ticket
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all
                      ${dm
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }
                    `}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={`text-xl font-black w-6 text-center ${dm ? "text-white" : "text-slate-900"}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all
                      ${dm
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }
                    `}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Price breakdown */}
              <div
                className={`
                  p-5 rounded-[24px] border space-y-3
                  ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-slate-50 border-slate-100"}
                `}
              >
                <h4 className={`font-black text-sm mb-4 ${dm ? "text-white" : "text-slate-900"}`}>
                  Price Breakdown
                </h4>
                <div className="flex justify-between text-sm font-bold text-slate-400">
                  <span>৳{event.price.toLocaleString()} × {quantity} ticket{quantity > 1 ? "s" : ""}</span>
                  <span className={dm ? "text-white" : "text-slate-700"}>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-400">
                  <span>Service fee</span>
                  <span className={dm ? "text-white" : "text-slate-700"}>৳{serviceFee.toLocaleString()}</span>
                </div>
                <div className={`h-px ${dm ? "bg-white/5" : "bg-slate-200"}`} />
                <div className="flex justify-between">
                  <span className={`font-black text-base ${dm ? "text-white" : "text-slate-900"}`}>Total</span>
                  <span className="font-black text-base text-indigo-500">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-3 justify-center text-slate-400 text-xs font-bold">
                <Shield size={14} className="text-emerald-500" />
                <span>Secure checkout</span>
                <span>·</span>
                <span>Free cancellation up to 48hrs before</span>
              </div>
            </div>
          )}

          {/* ── Step 2: Details + bKash Payment ── */}
          {step === 2 && (
            <div className="space-y-6">

              {/* Personal info */}
              <div
                className={`
                  p-6 rounded-[24px] border space-y-4
                  ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-slate-50 border-slate-100"}
                `}
              >
                <h4 className={`font-black text-sm flex items-center gap-2 ${dm ? "text-white" : "text-slate-900"}`}>
                  <User size={16} className="text-indigo-500" /> Personal Info
                </h4>
                <input
                  name="name"
                  value={details.name}
                  onChange={handleDetailChange}
                  placeholder="Full name"
                  className={inputClass}
                />
                <input
                  name="email"
                  type="email"
                  value={details.email}
                  onChange={handleDetailChange}
                  placeholder="Email address"
                  className={inputClass}
                />
                <input
                  name="phone"
                  type="tel"
                  value={details.phone}
                  onChange={handleDetailChange}
                  placeholder="Phone number"
                  className={inputClass}
                />
              </div>

              {/* bKash payment */}
              <div
                className={`
                  rounded-[24px] border overflow-hidden
                  ${dm ? "border-white/5" : "border-slate-100"}
                `}
              >
                {/* bKash header */}
                <div className="bg-[#E2136E] px-6 py-5 flex items-center gap-4">
                  <div className="w-16 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg px-2">
                    <img
                      src="https://www.bkash.com/sites/all/themes/bkashtheme/img/bkash-logo.png"
                      alt="bKash"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = '<span style="color:#E2136E;font-weight:900;font-size:14px">bKash</span>';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-base">Pay with bKash</h4>
                    <p className="text-pink-200 font-bold text-xs mt-0.5">
                      Bangladesh's #1 Mobile Payment
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Smartphone size={28} className="text-pink-200" />
                  </div>
                </div>

                {/* bKash form */}
                <div
                  className={`
                    p-6 space-y-4
                    ${dm ? "bg-[#1E0B3B]" : "bg-slate-50"}
                  `}
                >
                  {/* How it works */}
                  <div
                    className={`
                      p-4 rounded-2xl border-l-4 border-[#E2136E]
                      ${dm ? "bg-[#E2136E]/10" : "bg-pink-50"}
                    `}
                  >
                    <p className={`text-xs font-black mb-2 ${dm ? "text-white" : "text-slate-800"}`}>
                      How to pay with bKash:
                    </p>
                    <ol className="text-xs font-bold text-slate-400 space-y-1 list-decimal list-inside">
                      <li>Enter your bKash account number</li>
                      <li>Enter your bKash PIN</li>
                      <li>Click Pay — you'll get an OTP on your phone</li>
                      <li>Confirm the OTP to complete payment</li>
                    </ol>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-[#E2136E] tracking-widest">
                      bKash Account Number
                    </label>
                    <div className="relative">
                      <span
                        className={`
                          absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm
                          ${dm ? "text-slate-400" : "text-slate-500"}
                        `}
                      >
                        +880
                      </span>
                      <input
                        name="bkashNumber"
                        type="tel"
                        value={details.bkashNumber}
                        onChange={handleDetailChange}
                        placeholder="01XXXXXXXXX"
                        maxLength={11}
                        className={`${inputClass} pl-14`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-[#E2136E] tracking-widest">
                      bKash PIN
                    </label>
                    <input
                      name="bkashPin"
                      type="password"
                      value={details.bkashPin}
                      onChange={handleDetailChange}
                      placeholder="Enter your 5-digit PIN"
                      maxLength={5}
                      className={inputClass}
                    />
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Shield size={11} className="text-emerald-500 shrink-0" />
                    Your PIN is encrypted and never stored. Powered by bKash secure gateway.
                  </p>
                </div>
              </div>

              {/* Total reminder */}
              <div
                className={`
                  p-5 rounded-[24px] border flex items-center justify-between
                  ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-100"}
                `}
              >
                <div>
                  <p className="text-slate-400 text-xs font-bold">Total to pay</p>
                  <p className={`text-2xl font-black ${dm ? "text-white" : "text-slate-900"}`}>
                    ৳{total.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                  <Shield size={14} />
                  SSL Secured
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center space-y-6 py-4">

              {/* Success icon */}
              <div className="relative">
                <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10">
                  <CheckCircle size={52} className="text-white" strokeWidth={2} />
                </div>
              </div>

              <div>
                <h3 className={`text-3xl font-black tracking-tight ${dm ? "text-white" : "text-slate-900"}`}>
                  You're going! 🎉
                </h3>
                <p className="text-slate-400 font-bold mt-2 max-w-[280px] leading-relaxed">
                  Your tickets for{" "}
                  <span className={`font-black ${dm ? "text-white" : "text-slate-900"}`}>
                    {event.title}
                  </span>{" "}
                  are confirmed.
                </p>
              </div>

              {/* Ticket card */}
              <div
                className={`
                  w-full rounded-[28px] overflow-hidden border
                  ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-slate-50 border-slate-200"}
                `}
              >
                {/* Ticket top */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                      Eventify Ticket
                    </span>
                  </div>
                  <h4 className="text-lg font-black leading-tight">{event.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-indigo-200 text-xs font-bold">
                    <span>{event.date}</span>
                    <span>·</span>
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* Dashed tear line */}
                <div className="flex items-center px-6">
                  <div className={`w-5 h-5 rounded-full -ml-9 shrink-0 ${dm ? "bg-[#0F0121]" : "bg-white"}`} />
                  <div className="flex-1 border-t-2 border-dashed border-slate-300/50 mx-2" />
                  <div className={`w-5 h-5 rounded-full -mr-9 shrink-0 ${dm ? "bg-[#0F0121]" : "bg-white"}`} />
                </div>

                {/* Ticket bottom */}
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="text-left space-y-1">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Location</p>
                    <p className={`text-xs font-black ${dm ? "text-white" : "text-slate-900"}`}>
                      {event.location}
                    </p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Tickets</p>
                    <p className={`text-xs font-black ${dm ? "text-white" : "text-slate-900"}`}>
                      {quantity} × General Admission
                    </p>
                    {/* bKash payment badge */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-4 h-4 bg-[#E2136E] rounded-full flex items-center justify-center">
                        <span className="text-white text-[6px] font-black">b</span>
                      </div>
                      <span className="text-[10px] font-black text-[#E2136E]">Paid via bKash</span>
                    </div>
                  </div>

                  {/* QR code */}
                  <div
                    className={`
                      w-20 h-20 rounded-2xl flex items-center justify-center shrink-0
                      ${dm ? "bg-white/10" : "bg-slate-200"}
                    `}
                  >
                    <QrCode size={40} className={dm ? "text-white/60" : "text-slate-400"} />
                  </div>
                </div>
              </div>

              {/* Booking reference */}
              <div
                className={`
                  w-full p-4 rounded-2xl border text-center
                  ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-slate-50 border-slate-100"}
                `}
              >
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Booking Reference
                </p>
                <p className={`text-lg font-black mt-1 tracking-widest ${dm ? "text-white" : "text-slate-900"}`}>
                  EVT-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full">
                <button
                  className={`
                    flex-1 py-4 rounded-2xl font-black text-sm
                    flex items-center justify-center gap-2 transition-all
                    ${dm
                      ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  <Download size={16} /> Save Ticket
                </button>
                <button
                  className={`
                    flex-1 py-4 rounded-2xl font-black text-sm
                    flex items-center justify-center gap-2 transition-all
                    ${dm
                      ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  <Share2 size={16} /> Share
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-xl shadow-indigo-600/20"
              >
                Back to Event
              </button>
            </div>
          )}
        </div>

        {/* Panel footer CTA */}
        {step < 3 && (
          <div
            className={`
              px-8 py-6 border-t shrink-0
              ${dm ? "border-white/5 bg-[#0A0318]/50" : "border-slate-100 bg-slate-50/80"}
            `}
          >
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="w-full py-5 rounded-[22px] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Continue to Payment
                <ChevronRight size={20} />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`
                  w-full py-5 rounded-[22px] font-black text-base text-white
                  shadow-xl transition-all active:scale-95
                  flex items-center justify-center gap-3
                  ${loading
                    ? "bg-[#E2136E]/50 cursor-not-allowed"
                    : "bg-[#E2136E] hover:bg-[#c4115e] shadow-pink-600/20"
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing bKash Payment...
                  </>
                ) : (
                  <>
                    <img
                      src="https://www.bkash.com/sites/all/themes/bkashtheme/img/bkash-logo.png"
                      alt="bKash"
                      className="h-5 object-contain brightness-0 invert"
                      onError={(e) => e.target.style.display = "none"}
                    />
                    Pay ৳{total.toLocaleString()} via bKash
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EventDetails() {
  const { id }                          = useParams();
  const navigate                        = useNavigate();
  const { darkMode, setDarkMode }       = useContext(ThemeContext);
  const { user }                        = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isBooked,     setIsBooked]     = useState(false);

  const event = ALL_EVENTS.find((e) => e.id === parseInt(id)) || ALL_EVENTS[0];
  if (!event) {
    return (
      <div className="p-20 text-center font-black text-2xl">
        Event Not Found
      </div>
    );
  }

  const dm = darkMode;

  const userInitials = user?.fullName && user.fullName.trim().length > 0
    ? user.fullName.trim().slice(0, 2).toUpperCase()
    : user?.user_name && user.user_name.trim().length > 0
      ? user.user_name.trim().slice(0, 2).toUpperCase()
      : "U";

  return (
    <div
      className={`
        flex min-h-screen w-full overflow-hidden
        transition-colors duration-500 font-sans
        ${dm ? "bg-[#0F0121] text-white" : "bg-[#F8FAFC] text-slate-900"}
      `}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0,0,0); }
        .ripple-btn:after {
          content: ""; display: block; position: absolute;
          width: 100%; height: 100%; top: 0; left: 0; pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat; background-position: 50%;
          transform: scale(10,10); opacity: 0;
          transition: transform .5s, opacity 1s;
        }
        .ripple-btn:active:after { transform: scale(0,0); opacity: .3; transition: 0s; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside
        className={`
          w-72 border-r transition-all duration-500
          flex flex-col sticky top-0 h-screen z-50 shrink-0
          ${dm ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}
        `}
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 shrink-0">
            <LogoIcon />
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-black tracking-tighter ${dm ? "text-white" : "text-indigo-600"}`}>
              Eventify
            </span>
            <span className={`text-xs font-bold ${dm ? "text-slate-400" : "text-indigo-400"}`}>
              Ticketing & Management
            </span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-8">
          <button
            onClick={() => navigate("/")}
            className={`
              w-full flex items-center gap-4 px-5 py-4
              rounded-[22px] font-bold text-[15px] transition-all ripple-btn
              ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            <LayoutDashboard size={20} /> Explore
          </button>
          <button
            onClick={() => navigate("/my-events")}
            className={`
              w-full flex items-center gap-4 px-5 py-4
              rounded-[22px] font-bold text-[15px] transition-all ripple-btn
              ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            <Calendar size={20} /> My Events
          </button>
          <button
            onClick={() => navigate("/create-event")}
            className={`
              w-full flex items-center gap-4 px-5 py-4
              rounded-[22px] font-bold text-[15px] transition-all ripple-btn
              ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            <PlusSquare size={20} /> Create Event
          </button>
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 overflow-x-hidden no-scrollbar">

        {/* Header */}
        <header
          className={`
            px-10 py-5 flex justify-between items-center
            sticky top-0 z-[60] backdrop-blur-md border-b
            ${dm ? "border-white/5" : "border-slate-100"}
          `}
        >
          <button
            onClick={() => navigate("/")}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-2xl
              font-black text-sm shadow-sm transition-all ripple-btn
              ${dm
                ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }
            `}
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </button>

          <div
            onClick={() => navigate("/profile")}
            className="ml-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="px-10 py-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left column */}
            <div className="lg:col-span-8 space-y-8 min-w-0">
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute bottom-6 left-6">
                  <div className="bg-[#0F0121]/75 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-white font-black text-sm border border-white/10 shadow-xl">
                    ⏱ Starts in 109d 4h
                  </div>
                </div>
                <div className="absolute top-6 left-6">
                  <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <h1 className={`text-4xl font-black tracking-tight leading-tight ${dm ? "text-white" : "text-slate-900"}`}>
                  {event.title}
                </h1>
                <div className={`p-7 rounded-[24px] ${dm ? "bg-[#1E0B3B]" : "bg-white border border-slate-100 shadow-sm"}`}>
                  <h3 className={`text-lg font-black mb-4 flex items-center gap-3 ${dm ? "text-white" : "text-slate-900"}`}>
                    <Info size={20} className="text-indigo-500" />
                    About this Event
                  </h3>
                  <p className={`text-sm font-medium leading-relaxed ${dm ? "text-slate-400" : "text-slate-600"}`}>
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column — Booking card */}
            <div className="lg:col-span-4 min-w-0 w-full">
              <div
                className={`
                  p-7 rounded-[28px] sticky top-24
                  ${dm
                    ? "bg-[#1E0B3B] border border-white/5"
                    : "bg-white border border-slate-100 shadow-md"
                  }
                `}
              >
                <div className="mb-6">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                    Starting from
                  </p>
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-black ${dm ? "text-white" : "text-slate-900"}`}>
                      ৳{event.price.toLocaleString()}
                    </span>
                    <span className="text-slate-400 font-bold text-sm mb-1">/ person</span>
                  </div>
                </div>

                <div className={`h-px mb-6 ${dm ? "bg-white/5" : "bg-slate-100"}`} />

                <h3 className="text-sm font-black uppercase tracking-widest mb-5 text-slate-400">
                  Event Details
                </h3>

                <div className="space-y-5 mb-7">
                  <DetailItem icon={<Calendar />} label="Date"      value={event.date}      dm={dm} />
                  <DetailItem icon={<Clock />}    label="Time"      value={event.time}      dm={dm} />
                  <DetailItem icon={<MapPin />}   label="Location"  value={event.location}  dm={dm} />
                  <DetailItem icon={<Users />}    label="Attendees" value={event.attendees} dm={dm} />
                </div>

                <div className={`h-px mb-6 ${dm ? "bg-white/5" : "bg-slate-100"}`} />

                {/* Reserve / Reserved button */}
                <button
                  onClick={() => !isBooked && setShowCheckout(true)}
                  className={`
                    w-full py-4 rounded-2xl font-black text-base
                    transition-all ripple-btn active:scale-95 shadow-lg
                    flex items-center justify-center gap-2
                    ${isBooked
                      ? "bg-emerald-500 text-white shadow-emerald-500/20 cursor-default"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                    }
                  `}
                >
                  {isBooked
                    ? <><CheckCircle size={20} /> Ticket Reserved</>
                    : <><Ticket size={20} /> Reserve Ticket</>
                  }
                </button>

                <p className="text-center text-xs text-slate-400 font-medium mt-3">
                  Free cancellation up to 48hrs before
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Checkout slide-over panel ── */}
      {showCheckout && (
        <CheckoutPanel
          event={event}
          dm={dm}
          onClose={() => setShowCheckout(false)}
          onConfirmed={() => setIsBooked(true)}
        />
      )}
    </div>
  );
}