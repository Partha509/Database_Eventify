import React, { useState, useMemo, useContext, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Calendar, PlusSquare, Search, Bell,
  MapPin, ArrowRight, TrendingUp, Filter, X, SearchX,
  MessageCircle, Send, Paperclip, Ticket, PartyPopper,
  ChevronLeft, ChevronRight, ChevronDown, Settings, Sparkles,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All", "Music", "Tech", "Business", "Sports",
  "Art", "Food", "Wellness", "Comedy",
];

const FEATURED_EVENTS = [
  {
    id: 1,
    title: "Summer Music Festival 2026",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80",
    price: 89,
    date: "Jun 15, 2026",
    location: "Golden Gate Park, SF",
    category: "Music",
  },
  {
    id: 2,
    title: "Tech Summit 2026",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    price: 299,
    date: "Jul 22, 2026",
    location: "Moscone Center, SF",
    category: "Tech",
  },
  {
    id: 3,
    title: "Championship Game Night",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    price: 125,
    date: "Aug 05, 2026",
    location: "Oracle Park, SF",
    category: "Sports",
  },
  {
    id: 4,
    title: "International Food Gala",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
    price: 85,
    date: "Aug 10, 2026",
    location: "Ferry Building, SF",
    category: "Food",
  },
  {
    id: 5,
    title: "Modern Art Exhibition",
    image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200&q=80",
    price: 40,
    date: "Sep 01, 2026",
    location: "SFMOMA, SF",
    category: "Art",
  },
];

const ALL_UPCOMING = [
  { id: 6,  title: "Rock Legends Live",         image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",  price: 125, date: "2026-08-05", category: "Music"    },
  { id: 7,  title: "AI Expo 2026",              image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",  price: 199, date: "2026-04-18", category: "Tech"     },
  { id: 8,  title: "World Cup Qualifier",       image: "https://static.independent.co.uk/2025/03/05/12/43/GettyImages-2200004063.jpeg?crop=1024,682.7,x0,y0.2&trim=0,0,0,0&width=1200",  price: 500,  date: "2026-09-12", category: "Sports"   },
  { id: 9,  title: "Startup Pitch Night",       image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",    price: 50,  date: "2026-02-28", category: "Business" },
  { id: 10, title: "Jazz Night",                image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80",  price: 65,  date: "2026-05-20", category: "Music"    },
  { id: 11, title: "Street Food Festival",      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",  price: 25,  date: "2026-06-01", category: "Food"     },
  { id: 12, title: "Yoga & Mindfulness Expo",   image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",    price: 55,  date: "2026-06-20", category: "Wellness" },
  { id: 13, title: "Stand-Up Comedy Night",     image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",  price: 45,  date: "2026-07-04", category: "Comedy"   },
  { id: 14, title: "Blockchain World Forum",    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",  price: 249, date: "2026-07-15", category: "Tech"     },
  { id: 15, title: "Tennis Open 2026",          image: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&q=80",    price: 110, date: "2026-08-22", category: "Sports"   },
  { id: 16, title: "Abstract Art Showcase",     image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",    price: 35,  date: "2026-09-01", category: "Art"      },
  { id: 17, title: "Mental Health Summit",      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",  price: 60,  date: "2026-09-05", category: "Wellness" },
  { id: 18, title: "Improv Comedy Festival",    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",  price: 55,  date: "2026-09-18", category: "Comedy"   },
  { id: 19, title: "Business Networking Mixer", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",    price: 45,  date: "2026-05-10", category: "Business" },
  { id: 20, title: "Electronic Music Night",    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",  price: 90,  date: "2026-06-28", category: "Music"    },
];

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Event Starting Soon",
    desc: "Summer Music Festival starts in 2 hours",
    time: "2 hours ago",
    color: "bg-indigo-600",
    icon: <Calendar size={20} />,
    unread: true,
  },
  {
    id: 2,
    title: "Registration Confirmed",
    desc: "Your ticket for Tech Summit 2026 is confirmed",
    time: "5 hours ago",
    color: "bg-blue-600",
    icon: <Ticket size={20} />,
    unread: true,
  },
  {
    id: 3,
    title: "Event Update",
    desc: "New speaker added to AI Conference",
    time: "1 day ago",
    color: "bg-orange-500",
    icon: <Bell size={20} />,
    unread: false,
  },
  {
    id: 4,
    title: "Event Success",
    desc: "Your event 'Startup Meetup' reached 100 attendees!",
    time: "2 days ago",
    color: "bg-emerald-500",
    icon: <PartyPopper size={20} />,
    unread: false,
  },
];

const INITIAL_VISIBLE = 6;

// ─── Styles ───────────────────────────────────────────────────────────────────

const getGlobalStyles = (priceRange, darkMode) => `
  .no-scrollbar::-webkit-scrollbar { display: none; }

  input[type='range'] { -webkit-appearance: none; background: transparent; }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    background: linear-gradient(
      to right,
      #6366f1 ${(priceRange / 1000) * 100}%,
      ${darkMode ? "#1E0B3B" : "#f1f5f9"} ${(priceRange / 1000) * 100}%
    );
    border-radius: 10px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    margin-top: -7px;
    border: 3px solid ${darkMode ? "#0F0121" : "white"};
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  }

  .ripple-btn {
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
  }
  .ripple-btn:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.5s, opacity 1s;
  }
  .ripple-btn:active:after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }

  .search-overlay-enter {
    animation: slideUpOverlay 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes slideUpOverlay {
    from { opacity: 0; transform: translateY(60px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0px)  scale(1);    }
  }

  .featured-fade-exit  { animation: featuredFadeOut 0.3s ease forwards; }
  .featured-fade-enter { animation: featuredFadeIn  0.4s ease forwards; }

  @keyframes featuredFadeOut {
    from { opacity: 1; transform: translateY(0);     }
    to   { opacity: 0; transform: translateY(-20px); }
  }
  @keyframes featuredFadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0);     }
  }

  .event-card-appear {
    animation: cardAppear 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  .show-more-card {
    animation: showMoreCard 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes showMoreCard {
    from { opacity: 0; transform: translateY(48px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
`;

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

// ─── Shared Event Card ─────────────────────────────────────────────────────────

function EventCard({ event, darkMode, navigate, index = 0, extraClass = "event-card-appear" }) {
  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`
        group rounded-[48px] p-5 ${extraClass}
        transition-all duration-500 cursor-pointer hover:-translate-y-3
        ${darkMode
          ? "bg-[#1E0B3B] hover:shadow-[0_40px_80px_-15px_rgba(99,102,241,0.15)]"
          : "bg-white border border-slate-50 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]"
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative h-72 rounded-[36px] overflow-hidden mb-8 shadow-inner">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
        />
        <div
          className={`
            absolute top-5 right-5 px-5 py-3 rounded-2xl
            shadow-2xl backdrop-blur-xl border border-white/20
            ${darkMode ? "bg-[#0F0121]/80 text-white" : "bg-white/90 text-slate-900"}
          `}
        >
          <span className="font-black text-base">${event.price}</span>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pb-4">
        <span className="text-[11px] font-black uppercase text-indigo-500 px-4 py-2 bg-indigo-500/10 rounded-xl tracking-widest">
          {event.category}
        </span>
        <h4
          className={`
            text-xl font-black mt-6 mb-8 tracking-tight leading-snug
            group-hover:text-indigo-500 transition-colors
            ${darkMode ? "text-white" : "text-slate-900"}
          `}
        >
          {event.title}
        </h4>
        <div
          className={`
            flex items-center justify-between pt-6 border-t-2
            ${darkMode ? "border-white/5" : "border-slate-50"}
          `}
        >
          <span className="font-black text-[12px] uppercase flex items-center gap-3 text-slate-400">
            <Calendar size={18} /> {event.date}
          </span>
          <button className="text-indigo-600 font-black text-[13px] uppercase tracking-[0.1em] flex items-center gap-2 hover:gap-4 transition-all">
            Buy Now <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ darkMode, navigate }) {
  const navBase = `
    w-full flex items-center gap-4 px-5 py-4
    rounded-[22px] font-bold text-[15px]
    transition-all duration-300 ripple-btn
  `;
  const active   = "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30";
  const inactive = darkMode
    ? "text-slate-400 hover:text-white hover:bg-white/5"
    : "text-slate-500 hover:bg-slate-50";

  return (
    <aside
      className={`
        w-72 border-r transition-all duration-500
        flex flex-col sticky top-0 h-screen z-50 shrink-0
        ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}
      `}
    >
      {/* Logo */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 shrink-0">
          <LogoIcon />
        </div>
        <div className="flex flex-col">
          <span className={`text-2xl font-black tracking-tighter ${darkMode ? "text-white" : "text-indigo-600"}`}>
            Eventify
          </span>
          <span className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-indigo-400"}`}>
            Ticketing & Management
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-6 space-y-3 mt-8">
        <button onClick={() => navigate("/")}             className={`${navBase} ${active}`}>
          <LayoutDashboard size={20} /> Explore
        </button>
        <button onClick={() => navigate("/my-events")}    className={`${navBase} ${inactive}`}>
          <Calendar size={20} /> My Events
        </button>
        <button onClick={() => navigate("/create-event")} className={`${navBase} ${inactive}`}>
          <PlusSquare size={20} /> Create Event
        </button>
      </nav>
    </aside>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({ darkMode, showNotif, setShowNotif }) {
  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setShowNotif(!showNotif)}
        className={`
          p-4 rounded-[22px] ripple-btn shadow-sm
          transition-all flex items-center justify-center
          ${showNotif
            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
            : darkMode
              ? "bg-[#1E0B3B] text-slate-300 hover:bg-white/5"
              : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
          }
        `}
      >
        <Bell size={24} />
      </button>

      {/* Badge */}
      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white text-[11px] font-black flex items-center justify-center rounded-full border-[3px] border-white shadow-lg">
        3
      </span>

      {/* Dropdown */}
      {showNotif && (
        <div
          className={`
            absolute top-20 right-0 w-[450px] z-[100] border
            rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]
            animate-in fade-in zoom-in-95 duration-300
            ${darkMode ? "bg-[#1E0B3B] border-white/10" : "bg-white border-slate-100"}
          `}
        >
          <div className="p-10">
            <button
              onClick={() => setShowNotif(false)}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-black text-xs uppercase tracking-widest"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className={`text-3xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                  Notifications
                </h2>
                <p className="text-slate-500 font-bold mt-1">Stay updated</p>
              </div>
              <button className="text-indigo-600 font-black text-sm hover:underline underline-offset-4 decoration-2">
                Mark all read
              </button>
            </div>

            <div className="space-y-5 max-h-[480px] overflow-y-auto no-scrollbar pr-2">
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`
                    p-7 rounded-[32px] border flex gap-6
                    transition-all cursor-pointer hover:translate-x-2
                    ${darkMode
                      ? "bg-[#0F0121] border-white/5 hover:bg-white/5"
                      : "bg-[#F8FAFC] border-slate-100 shadow-sm hover:bg-white hover:border-indigo-100"
                    }
                  `}
                >
                  <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-white shrink-0 shadow-2xl ${n.color}`}>
                    {n.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-black text-base ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {n.title}
                      </h4>
                      {n.unread && (
                        <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5" />
                      )}
                    </div>
                    <p className="text-slate-500 text-[13px] font-bold mt-1.5 leading-relaxed">
                      {n.desc}
                    </p>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 block">
                      {n.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({
  darkMode, navigate,
  searchQuery, setSearchQuery,
  showNotif, setShowNotif,
  userInitials, isSearchActive, setIsSearchActive,
}) {
  return (
    <header className="flex items-center justify-between mb-12 gap-10 max-w-full mx-auto">
      {/* Search */}
      <div className="relative flex-1 max-w-3xl group">
        <Search
          size={22}
          className={`
            absolute left-8 top-1/2 -translate-y-1/2 z-10 transition-colors
            ${isSearchActive ? "text-indigo-500" : "text-slate-400"}
          `}
        />
        <input
          type="text"
          value={searchQuery}
          placeholder="Search for events, artists, or venues..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchActive(true)}
          className={`
            w-full pl-20 pr-14 py-5 rounded-[28px] shadow-sm
            focus:ring-4 focus:ring-indigo-500/10 outline-none
            font-bold text-base transition-all duration-300
            ${isSearchActive
              ? darkMode
                ? "bg-[#1E0B3B] border-2 border-indigo-500/50 text-white placeholder:text-slate-500 shadow-xl shadow-indigo-500/10"
                : "bg-white border-2 border-indigo-400/50 text-slate-900 shadow-xl shadow-indigo-500/10"
              : darkMode
                ? "bg-[#1E0B3B] border-none text-white placeholder:text-slate-500"
                : "bg-white border-slate-200 text-slate-900"
            }
          `}
        />
        {/* X — only way to close overlay */}
        {isSearchActive && (
          <button
            onClick={() => { setSearchQuery(""); setIsSearchActive(false); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors z-10"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5 relative">
        <NotificationPanel
          darkMode={darkMode}
          showNotif={showNotif}
          setShowNotif={setShowNotif}
        />
        <div
          onClick={() => navigate("/profile")}
          className="ml-2 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Featured Carousel ────────────────────────────────────────────────────────

function FeaturedEvents({ darkMode, navigate, isSearchActive }) {
  const [current,   setCurrent]   = useState(0);
  const [sliding,   setSliding]   = useState(false);
  const [direction, setDirection] = useState("next");
  const timerRef   = useRef(null);
  const slidingRef = useRef(false);
  const currentRef = useRef(0);
  const total      = FEATURED_EVENTS.length;

  useEffect(() => { currentRef.current = current; }, [current]);

  const goTo = useCallback((index, dir = "next") => {
    if (slidingRef.current) return;
    slidingRef.current = true;
    setDirection(dir);
    setSliding(true);
    setTimeout(() => {
      setCurrent(index);
      setSliding(false);
      slidingRef.current = false;
    }, 400);
  }, []);

  const goNext = useCallback(() => goTo((currentRef.current + 1) % total, "next"), [goTo, total]);
  const goPrev = useCallback(() => goTo((currentRef.current - 1 + total) % total, "prev"), [goTo, total]);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      goTo((currentRef.current + 1) % total, "next");
    }, 4000);
  }, [goTo, total]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []); // eslint-disable-line

  const event = FEATURED_EVENTS[current];

  return (
    <section
      className={`mb-16 max-w-full ${isSearchActive ? "featured-fade-exit pointer-events-none" : "featured-fade-enter"}`}
      style={{ display: isSearchActive ? "none" : "block" }}
    >
      {/* Heading + arrows */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Featured Events
        </h2>
        <div className="flex items-center gap-3">
          <button
            onMouseDown={(e) => { e.preventDefault(); goPrev(); }}
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center
              transition-all ripple-btn shadow-sm
              ${darkMode
                ? "bg-[#1E0B3B] text-slate-300 hover:bg-indigo-600 hover:text-white border border-white/5"
                : "bg-white text-slate-500 hover:bg-indigo-600 hover:text-white border border-slate-100"
              }
            `}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); goNext(); }}
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center
              transition-all ripple-btn shadow-sm
              ${darkMode
                ? "bg-[#1E0B3B] text-slate-300 hover:bg-indigo-600 hover:text-white border border-white/5"
                : "bg-white text-slate-500 hover:bg-indigo-600 hover:text-white border border-slate-100"
              }
            `}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Handpicked label */}
      <div className="flex items-center gap-4 mb-10">
        <h3 className={`text-xs font-black uppercase tracking-[0.4em] whitespace-nowrap ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          Handpicked For You
        </h3>
        <div className={`h-[2px] flex-1 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} />
      </div>

      {/* Carousel card */}
      <div
        className="relative w-full h-[480px] rounded-[50px] overflow-hidden shadow-2xl cursor-pointer"
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        onClick={() => navigate(`/event/${event.id}`)}
      >
        {/* Image */}
        <img
          key={current}
          src={event.image}
          alt={event.title}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-all duration-700 ease-in-out
            ${sliding
              ? direction === "next" ? "opacity-0 scale-105" : "opacity-0 scale-95"
              : "opacity-100 scale-100"
            }
          `}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0121] via-[#0F0121]/30 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-8 left-8 z-10 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-lg border border-white/20">
          <Sparkles size={14} className="text-white animate-pulse" />
          <span className="text-[11px] font-black uppercase text-white tracking-widest">Featured</span>
        </div>

        {/* Category badge */}
        <div className="absolute top-8 right-8 z-10">
          <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[11px] font-black uppercase text-white tracking-widest">
            {event.category}
          </span>
        </div>

        {/* Slide counter */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-2 rounded-full text-[11px] font-black backdrop-blur-md border border-white/20 text-white bg-black/20">
            {current + 1} / {total}
          </span>
        </div>

        {/* Event info */}
        <div className="absolute bottom-10 left-10 right-10 text-white z-10">
          <div
            key={`info-${current}`}
            className={`transition-all duration-500 ${sliding ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            <div className="flex items-center gap-2 text-indigo-300 font-black text-sm mb-3 uppercase tracking-widest">
              <MapPin size={14} /> {event.location}
            </div>
            <h4 className="text-5xl font-black mb-6 leading-tight tracking-tight">
              {event.title}
            </h4>
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-10">
                <div>
                  <p className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Ticket Price</p>
                  <span className="text-4xl font-black">${event.price}</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Date</p>
                  <span className="text-lg font-black">{event.date}</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/event/${event.id}`); }}
                className={`
                  px-8 py-4 rounded-2xl flex items-center gap-3
                  font-black text-sm shadow-xl transition-all ripple-btn
                  ${darkMode
                    ? "bg-white/10 backdrop-blur-md text-white hover:bg-indigo-600 border border-white/20"
                    : "bg-white text-slate-950 hover:bg-indigo-600 hover:text-white"
                  }
                `}
              >
                Get Tickets <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {FEATURED_EVENTS.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i, i > current ? "next" : "prev"); }}
              className={`
                rounded-full transition-all duration-300
                ${i === current ? "w-8 h-3 bg-white shadow-lg" : "w-3 h-3 bg-white/40 hover:bg-white/70"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────

function SearchOverlay({
  darkMode, navigate,
  filteredEvents, searchQuery, isSearchActive,
  showFilters, setShowFilters,
  selectedCategory, setSelectedCategory,
  priceRange, setPriceRange,
  startDate, setStartDate,
  endDate, setEndDate,
  setSearchQuery,
}) {
  if (!isSearchActive) return null;

  return (
    <section className="mb-16 max-w-full search-overlay-enter">
      {/* Heading */}
      <div className="mb-8">
        <h2 className={`text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Discover Events
        </h2>
        <p className={`font-bold mt-2 text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Browse experiences happening near you
        </p>
      </div>

      {/* Filter toggle + category pills */}
      <div className="flex items-center gap-5 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            p-5 rounded-2xl shadow-lg transition-all ripple-btn
            ${showFilters
              ? "bg-indigo-600 text-white shadow-indigo-600/30"
              : darkMode
                ? "bg-[#1E0B3B] text-slate-400"
                : "bg-white text-slate-400 border border-slate-100"
            }
          `}
        >
          {showFilters ? <X size={24} /> : <Filter size={24} />}
        </button>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar flex-1 py-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-10 py-4 rounded-2xl text-[12px] font-black uppercase
                tracking-[0.15em] transition-all whitespace-nowrap shadow-sm ripple-btn
                ${selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                  : darkMode
                    ? "bg-[#1E0B3B] text-slate-400 hover:text-white"
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div
          className={`
            p-10 rounded-[48px] shadow-3xl mb-10
            grid grid-cols-1 md:grid-cols-2 gap-12
            animate-in slide-in-from-top-4 duration-500
            ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}
          `}
        >
          {/* Date range */}
          <div className="space-y-5">
            <label className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">
              Select Date Range
            </label>
            <div className="flex gap-6">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`
                  flex-1 p-4 rounded-2xl outline-none font-bold text-sm border
                  ${darkMode ? "bg-[#0F0121] text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"}
                `}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`
                  flex-1 p-4 rounded-2xl outline-none font-bold text-sm border
                  ${darkMode ? "bg-[#0F0121] text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"}
                `}
              />
            </div>
          </div>

          {/* Price cap */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                Price Cap
              </label>
              <span className="text-indigo-400 font-black text-lg">${priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full cursor-pointer h-2 bg-indigo-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setPriceRange(1000);
                  setStartDate("");
                  setEndDate("");
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400"
              >
                Clear All Filters
              </button>
              <span className="text-[10px] font-bold text-slate-400">0 – 1000 USD</span>
            </div>
          </div>
        </div>
      )}

      {/* Result count */}
      <p className={`font-bold mb-8 text-base ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
        {searchQuery && (
          <span className={`ml-2 font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
            for "{searchQuery}"
          </span>
        )}
      </p>

      {/* Cards or empty state */}
      {filteredEvents.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-24 rounded-[48px] ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}`}>
          <SearchX size={56} className="text-slate-300 mb-6" />
          <p className={`text-xl font-black ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            No events found
          </p>
          <p className="text-slate-400 font-bold mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              darkMode={darkMode}
              navigate={navigate}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Event Grid ───────────────────────────────────────────────────────────────

function EventGrid({ darkMode, navigate, filteredEvents, isSearchActive }) {
  const [showAll, setShowAll] = useState(false);

  const visibleEvents = showAll ? filteredEvents : filteredEvents.slice(0, INITIAL_VISIBLE);
  const hiddenCount   = filteredEvents.length - INITIAL_VISIBLE;

  return (
    <section
      className={`
        pb-32 max-w-full transition-all duration-300
        ${isSearchActive ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className={`text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Discover Events
          </h2>
          <p className={`font-bold mt-2 text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Browse experiences happening near you
          </p>
        </div>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-500/5 px-4 py-2 rounded-full">
          {filteredEvents.length} Events Available
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {visibleEvents.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            darkMode={darkMode}
            navigate={navigate}
            index={index}
            extraClass={index >= INITIAL_VISIBLE ? "show-more-card" : "event-card-appear"}
          />
        ))}
      </div>

      {/* Show More button */}
      {filteredEvents.length > INITIAL_VISIBLE && (
        <div className="flex justify-center mt-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`
              group flex items-center gap-4 px-14 py-6
              rounded-[28px] font-black text-base
              transition-all duration-500 ripple-btn
              shadow-xl hover:shadow-2xl hover:-translate-y-1
              ${darkMode
                ? "bg-[#1E0B3B] text-white border border-white/10 hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-indigo-600/20"
                : "bg-white text-slate-900 border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-indigo-600/20"
              }
            `}
          >
            {showAll ? (
              <>
                Show Less
                <ChevronDown size={20} className="rotate-180 transition-transform duration-300" />
              </>
            ) : (
              <>
                Show {hiddenCount} More Events
                <ChevronDown size={20} className="transition-transform duration-300 group-hover:translate-y-1" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

// ─── AI Chat Widget ───────────────────────────────────────────────────────────

function AIChatWidget({ darkMode, isChatOpen, setIsChatOpen }) {
  return (
    <div className="fixed bottom-12 left-12 z-[100] flex flex-col items-start">
      {isChatOpen && (
        <div
          className={`
            w-[420px] h-[680px] mb-8 rounded-[3.5rem]
            shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]
            overflow-hidden flex flex-col transition-all duration-500
            animate-in slide-in-from-left-12 border backdrop-blur-3xl
            ${darkMode ? "bg-[#120626]/95 border-white/10" : "bg-white/95 border-slate-200"}
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-10 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-inner">
                  <Sparkles className="text-white" size={26} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[4px] border-indigo-700 shadow-lg animate-pulse" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg tracking-tight">Eventify AI</h4>
                <p className="text-indigo-100/70 font-bold text-[11px] uppercase tracking-widest">Always active</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
                <Settings size={18} />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-3 bg-white/10 rounded-xl text-white hover:bg-rose-500 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-8 flex flex-col items-center justify-center text-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all" />
              <div className="w-36 h-36 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative z-10">
                <div className="w-20 h-20 border-2 border-white/20 rounded-full animate-[spin_8s_linear_infinite] flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]" />
                </div>
              </div>
            </div>
            <div>
              <h3 className={`text-3xl font-black mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}>
                How can I help?
              </h3>
              <p className="text-slate-500 font-bold max-w-[240px] leading-relaxed mx-auto">
                Discover concerts, tech summits, or get help with your ticket booking instantly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {["Find Music", "My Tickets"].map((btn) => (
                <button
                  key={btn}
                  className={`
                    py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all
                    ${darkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-100 hover:bg-slate-100"}
                  `}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className={`p-8 border-t ${darkMode ? "border-white/5 bg-[#0A0318]/50" : "border-slate-100 bg-slate-50/50"}`}>
            <div
              className={`
                flex items-center gap-4 px-6 py-4 rounded-[2.5rem] shadow-2xl border transition-all
                ${darkMode
                  ? "bg-[#1E0B3B] border-white/10 focus-within:border-indigo-500"
                  : "bg-white border-slate-200 focus-within:border-indigo-400"
                }
              `}
            >
              <Paperclip size={20} className="text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors" />
              <input
                type="text"
                placeholder="Message AI..."
                className="bg-transparent flex-1 outline-none text-[15px] font-bold py-2"
              />
              <button className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 active:scale-95 transition-all">
                <Send size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.5)] hover:scale-110 active:scale-90 transition-all ripple-btn border-4 border-white/10"
      >
        {isChatOpen ? <X size={36} strokeWidth={2.5} /> : <MessageCircle size={36} strokeWidth={2.5} />}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Eventpage() {
  const navigate   = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { user }   = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery,      setSearchQuery]       = useState("");
  const [showFilters,      setShowFilters]       = useState(false);
  const [priceRange,       setPriceRange]        = useState(1000);
  const [startDate,        setStartDate]         = useState("");
  const [endDate,          setEndDate]           = useState("");
  const [isChatOpen,       setIsChatOpen]        = useState(false);
  const [showNotif,        setShowNotif]         = useState(false);
  const [isSearchActive,   setIsSearchActive]    = useState(false);

  const userInitials = useMemo(() => {
    if (user?.fullName   && user.fullName.trim().length   > 0) return user.fullName.trim().slice(0, 2).toUpperCase();
    if (user?.user_name  && user.user_name.trim().length  > 0) return user.user_name.trim().slice(0, 2).toUpperCase();
    return "U";
  }, [user]);

  const filteredEvents = useMemo(() => {
    return ALL_UPCOMING.filter((event) => {
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch   = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice    = event.price <= priceRange;
      const eventDate       = new Date(event.date);
      const matchesStart    = !startDate || eventDate >= new Date(startDate);
      const matchesEnd      = !endDate   || eventDate <= new Date(endDate);
      return matchesCategory && matchesSearch && matchesPrice && matchesStart && matchesEnd;
    });
  }, [selectedCategory, searchQuery, priceRange, startDate, endDate]);

  return (
    <div
      className={`
        flex min-h-screen w-full transition-colors duration-500 font-sans
        ${darkMode ? "bg-[#0F0121] text-white" : "bg-[#F8FAFC] text-slate-900"}
      `}
    >
      <style>{getGlobalStyles(priceRange, darkMode)}</style>

      <Sidebar darkMode={darkMode} navigate={navigate} />

      <main className="flex-1 min-w-0 px-12 py-10 relative overflow-x-hidden no-scrollbar">
        <TopBar
          darkMode={darkMode}
          navigate={navigate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotif={showNotif}
          setShowNotif={setShowNotif}
          userInitials={userInitials}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
        />

        <SearchOverlay
          darkMode={darkMode}
          navigate={navigate}
          filteredEvents={filteredEvents}
          searchQuery={searchQuery}
          isSearchActive={isSearchActive}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setSearchQuery={setSearchQuery}
        />

        <FeaturedEvents
          darkMode={darkMode}
          navigate={navigate}
          isSearchActive={isSearchActive}
        />

        <EventGrid
          darkMode={darkMode}
          navigate={navigate}
          filteredEvents={filteredEvents}
          isSearchActive={isSearchActive}
        />

        <AIChatWidget
          darkMode={darkMode}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />
      </main>
    </div>
  );
}