import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import ApiClient from "../api";
import {
  ChevronLeft, Mail, Phone, MapPin, Moon, Sun,
  Bell, ShieldCheck, HelpCircle, LogOut, Edit3,
  Settings, AlertCircle, LayoutDashboard, Calendar,
  PlusSquare, User,
} from "lucide-react";
import {
  AnimationStyles, FadeIn, ScalePop, InViewFade,
  CountUp, SkeletonProfileCard, SkeletonInfoSection, usePageLoad,
} from "../components/ui";

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
        fill="white" stroke="white" strokeWidth="0.5"
      />
    </svg>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({ darkMode, navigate }) {
  return (
    <nav
      className={`
        md:hidden fixed bottom-0 left-0 right-0 z-50
        flex items-center justify-around px-4 pt-3 pb-4
        border-t backdrop-blur-xl
        ${darkMode ? "bg-[#0F0121]/95 border-white/5" : "bg-white/95 border-slate-100"}
      `}
    >
      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
          <LayoutDashboard size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Explore</span>
      </button>

      <button onClick={() => navigate("/my-events")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
          <Calendar size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Events</span>
      </button>

      <button onClick={() => navigate("/create-event")} className="flex flex-col items-center gap-1 px-3 py-1 -mt-6">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-600/40 border-4 border-white dark:border-[#0F0121]">
          <PlusSquare size={22} className="text-white" />
        </div>
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mt-1">Create</span>
      </button>

      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
          <Bell size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Alerts</span>
      </button>

      <button className="flex flex-col items-center gap-1 px-3 py-1">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-600 shadow-lg shadow-indigo-600/30">
          <User size={18} className="text-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">Profile</span>
      </button>
    </nav>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Profile() {
  const navigate                                  = useNavigate();
  const { darkMode, setDarkMode }                 = useContext(ThemeContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser]                           = useState(null);
  const loaded                                    = usePageLoad(400);

  const api = new ApiClient();

  const profileStats = [
    { label: "Hosted",    value: "12"  },
    { label: "Attended",  value: "28"  },
    { label: "Following", value: "145" },
  ];

  const moreOptions = [
    { icon: <Bell size={20} />,        label: "Notifications"      },
    { icon: <ShieldCheck size={20} />, label: "Privacy & Security" },
    { icon: <HelpCircle size={20} />,  label: "Help & Support"     },
  ];

  // ── Load user ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const loadProfile = async () => {
      const data = await api.getProfile();
      if (data) setUser(data);
    };
    loadProfile();
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await api.logout();
    navigate("/login");
  };

  return (
    <div
      className={`
        min-h-screen w-full transition-colors duration-500 font-sans
        ${darkMode ? "bg-[#0F0121] text-white" : "bg-[#F8FAFC] text-slate-900"}
      `}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); }
        .ripple-btn:after {
          content: ""; display: block; position: absolute;
          width: 100%; height: 100%; top: 0; left: 0; pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat; background-position: 50%;
          transform: scale(10, 10); opacity: 0;
          transition: transform .5s, opacity 1s;
        }
        .ripple-btn:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .mobile-bottom-nav { padding-bottom: calc(0.5rem + env(safe-area-inset-bottom)); }
        }
      `}</style>
      <AnimationStyles />

      <div className="px-4 sm:px-8 lg:px-12 py-5 sm:py-8 lg:py-12 pb-28 md:pb-16 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <FadeIn delay={0}>
          <header className="mb-8 sm:mb-12">
            <button
              onClick={() => navigate(-1)}
              className={`
                flex items-center gap-2 font-black text-xs uppercase
                tracking-widest transition-colors mb-5 sm:mb-6
                ${darkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-indigo-600"}
              `}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Profile</h1>
            <p className="text-slate-500 font-bold mt-1 text-sm sm:text-base">
              Manage your account and preferences
            </p>
          </header>
        </FadeIn>

        {/* ── Content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

          {/* Left — profile card */}
          <div className="lg:col-span-4">
            {!loaded ? (
              <SkeletonProfileCard darkMode={darkMode} />
            ) : (
              <ScalePop delay={80}>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] sm:rounded-[45px] p-7 sm:p-10 text-white shadow-2xl shadow-indigo-500/20 text-center relative overflow-hidden">

                  {/* Avatar */}
                  <div className="relative inline-block mb-5 sm:mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/10 text-3xl sm:text-4xl font-black backdrop-blur-md">
                      {user?.user_name?.charAt(0) || "U"}
                    </div>
                    <button className="absolute bottom-0 right-0 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-lg hover:scale-110 transition-transform">
                      <Edit3 size={16} />
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-1">
                    {user?.user_name || "Loading..."}
                  </h2>
                  <p className="text-indigo-200 font-bold text-sm mb-7 sm:mb-10">
                    Event Enthusiast
                  </p>

                  {/* Stats with CountUp */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-7 sm:mb-10">
                    {profileStats.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl py-3 sm:py-4 border border-white/10"
                      >
                        <p className="text-lg sm:text-xl font-black">
                          <CountUp value={stat.value} delay={200 + i * 100} duration={1000} />
                        </p>
                        <p className="text-[9px] sm:text-[10px] uppercase font-black text-indigo-200 tracking-widest">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all border border-white/10">
                    <Settings size={16} /> Settings
                  </button>
                </div>
              </ScalePop>
            )}
          </div>

          {/* Right — sections */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-8">

            {!loaded ? (
              <>
                <SkeletonInfoSection darkMode={darkMode} rows={3} />
                <SkeletonInfoSection darkMode={darkMode} rows={1} />
                <SkeletonInfoSection darkMode={darkMode} rows={3} />
              </>
            ) : (
              <>
                {/* Personal info */}
                <InViewFade delay={0}>
                  <section
                    className={`
                      p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-sm border
                      ${darkMode ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-100"}
                    `}
                  >
                    <h3 className="text-base sm:text-lg font-black mb-6 sm:mb-8">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">

                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                          <Mail size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            Email
                          </p>
                          <p className="font-bold text-sm truncate">{user?.email || "—"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                          <Phone size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            Phone
                          </p>
                          <p className="font-bold text-sm">{user?.phone || "—"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-5 sm:col-span-2">
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            Location
                          </p>
                          <p className="font-bold text-sm">Not specified</p>
                        </div>
                      </div>

                    </div>
                  </section>
                </InViewFade>

                {/* Preferences */}
                <InViewFade delay={80}>
                  <section
                    className={`
                      p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-sm border
                      ${darkMode ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-100"}
                    `}
                  >
                    <h3 className="text-base sm:text-lg font-black mb-5 sm:mb-8">Preferences</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </div>
                        <div>
                          <p className="font-black text-sm sm:text-base">Dark Mode</p>
                          <p className="text-xs sm:text-sm text-slate-500 font-bold">
                            Toggle theme appearance
                          </p>
                        </div>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`
                          w-12 sm:w-14 h-7 sm:h-8 rounded-full transition-all relative shrink-0
                          ${darkMode ? "bg-indigo-600" : "bg-slate-200"}
                        `}
                      >
                        <div
                          className={`
                            absolute top-0.5 sm:top-1 w-6 h-6 bg-white rounded-full
                            transition-all shadow-sm
                            ${darkMode ? "left-[22px] sm:left-7" : "left-0.5 sm:left-1"}
                          `}
                        />
                      </button>
                    </div>
                  </section>
                </InViewFade>

                {/* More options */}
                <InViewFade delay={160}>
                  <section
                    className={`
                      p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-sm border
                      ${darkMode ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-100"}
                    `}
                  >
                    <h3 className="text-base sm:text-lg font-black mb-5 sm:mb-8">More Options</h3>
                    <div className="space-y-2 sm:space-y-4">
                      {moreOptions.map((opt, i) => (
                        <div
                          key={i}
                          className={`
                            flex items-center gap-4 sm:gap-5 p-4 sm:p-5
                            rounded-xl sm:rounded-2xl cursor-pointer
                            transition-all hover:translate-x-1
                            ${darkMode ? "hover:bg-white/5" : "hover:bg-slate-50"}
                          `}
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                            {React.cloneElement(opt.icon, { size: 18 })}
                          </div>
                          <span className="font-bold text-sm sm:text-base">{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </InViewFade>

                {/* Logout */}
                <InViewFade delay={240}>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full py-4 sm:py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl sm:rounded-3xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 transition-all active:scale-95 ripple-btn"
                  >
                    <LogOut size={18} /> Log Out
                  </button>
                </InViewFade>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <MobileBottomNav darkMode={darkMode} navigate={navigate} />

      {/* ── Logout confirm modal ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowLogoutConfirm(false)}
          />

          {/* Mobile: bottom sheet | Desktop: centered modal */}
          <ScalePop>
            <div
              className={`
                relative w-full sm:max-w-sm
                rounded-t-[32px] sm:rounded-[3rem]
                p-7 sm:p-10
                shadow-2xl border text-center
                ${darkMode ? "bg-[#1E0B3B] border-white/10" : "bg-white border-slate-100"}
              `}
            >
              {/* Drag handle — mobile only */}
              <div className="sm:hidden flex justify-center mb-5">
                <div className={`w-10 h-1 rounded-full ${darkMode ? "bg-white/20" : "bg-slate-200"}`} />
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-5 sm:mb-6">
                <AlertCircle size={32} />
              </div>

              <h3 className="text-xl sm:text-2xl font-black mb-2">Log Out?</h3>
              <p className="text-slate-500 font-bold mb-7 sm:mb-8 text-sm sm:text-base leading-relaxed">
                Are you sure? You'll need to sign back in to access your data.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 sm:py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl sm:rounded-2xl font-black shadow-lg shadow-rose-500/25 transition-all active:scale-95 text-sm uppercase tracking-widest ripple-btn"
                >
                  Yes, Log Me Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`
                    w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black
                    transition-all active:scale-95 text-sm uppercase tracking-widest ripple-btn
                    ${darkMode ? "bg-white/5 text-white" : "bg-slate-100 text-slate-600"}
                  `}
                >
                  Cancel
                </button>
              </div>
            </div>
          </ScalePop>
        </div>
      )}
    </div>
  );
}