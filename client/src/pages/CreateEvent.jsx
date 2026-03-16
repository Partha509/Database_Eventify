import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";
import {
  UploadCloud, CalendarDays, Clock3,
  LayoutDashboard, Calendar, PlusSquare, TrendingUp,
  MapPin, DollarSign, Type, AlignLeft, PartyPopper, X,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Music", "Tech", "Business", "Sports",
  "Art", "Food", "Wellness", "Comedy", "Workshop",
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateEvent() {
  const navigate          = useNavigate();
  const { darkMode }      = useContext(ThemeContext);
  const { user }          = useAuth();
  const fileInputRef      = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    price: "",
    description: "",
  });
  const [coverImage,    setCoverImage]    = useState(null);
  const [imagePreview,  setImagePreview]  = useState(null);

  const userInitials = user?.fullName && user.fullName.trim().length > 0
    ? user.fullName.trim().slice(0, 2).toUpperCase()
    : user?.user_name && user.user_name.trim().length > 0
      ? user.user_name.trim().slice(0, 2).toUpperCase()
      : "U";

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return alert("File is too large. Max 10MB.");
    setCoverImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setCoverImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const required = ["title", "category", "date", "location", "description"];
    const missing  = required.filter((f) => !formData[f]);
    if (missing.length > 0 || !coverImage) {
      return alert("Please fill in all required fields (*) and upload a cover image.");
    }
    alert("Event Published Successfully!");
    navigate("/");
  };

  // ── Shared styles ──────────────────────────────────────────────────────────

  const inputClasses = `
    w-full px-8 py-5 rounded-2xl outline-none font-bold text-[15px]
    transition-all duration-300 border
    focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400
    ${darkMode
      ? "bg-[#1E0B3B] border-white/5 text-white placeholder:text-slate-600"
      : "bg-white border-slate-100 text-slate-900 placeholder:text-slate-400"
    }
  `;

  // ── Sub-component: Input wrapper ───────────────────────────────────────────

  const InputWrapper = ({ children, label, icon, required }) => (
    <div className="space-y-3">
      <label
        className={`
          text-[11px] font-black uppercase tracking-[0.2em]
          flex items-center gap-2
          ${darkMode ? "text-slate-400" : "text-slate-500"}
        `}
      >
        {icon && React.cloneElement(icon, { size: 14, className: "text-indigo-500" })}
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div
      className={`
        flex min-h-screen w-full transition-colors duration-500 font-sans
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
      `}</style>

      {/* ── Sidebar ── */}
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
          <button
            onClick={() => navigate("/")}
            className={`
              w-full flex items-center gap-4 px-5 py-4
              rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn
              ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            <LayoutDashboard size={20} /> Explore
          </button>
          <button
            onClick={() => navigate("/my-events")}
            className={`
              w-full flex items-center gap-4 px-5 py-4
              rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn
              ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            <Calendar size={20} /> My Events
          </button>
          <button
            onClick={() => navigate("/create-event")}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30"
          >
            <PlusSquare size={20} /> Create Event
          </button>
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 px-12 py-10 relative overflow-y-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-12 gap-10">
          <div>
            <h2 className={`text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              Create Event
            </h2>
            <p className={`font-bold mt-2 text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Fill in the details below to host your experience
            </p>
          </div>

          {/* Profile avatar */}
          <div
            onClick={() => navigate("/profile")}
            className="ml-2 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="max-w-[1100px] mx-auto pb-32">
          <form onSubmit={handlePublish} className="space-y-16">

            {/* Cover image section */}
            <div className={`p-10 rounded-[48px] shadow-3xl ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-50"}`}>
              <InputWrapper label="Cover Image" icon={<PartyPopper />} required>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={`
                    relative group h-[400px] rounded-[36px] border-4 border-dashed
                    transition-all cursor-pointer flex flex-col items-center
                    justify-center text-center p-10 overflow-hidden
                    ${imagePreview
                      ? "border-indigo-500 shadow-xl shadow-indigo-500/10"
                      : darkMode
                        ? "border-white/10 hover:border-indigo-500 bg-[#0F0121]"
                        : "border-slate-100 hover:border-indigo-400 bg-slate-50"
                    }
                  `}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0121]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        onClick={removeImage}
                        className="absolute top-6 right-6 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl ripple-btn opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X size={20} strokeWidth={3} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        className={`
                          w-24 h-24 rounded-3xl flex items-center justify-center
                          mb-8 shadow-2xl transition-colors
                          ${darkMode ? "bg-[#1E0B3B]" : "bg-white"}
                        `}
                      >
                        <UploadCloud size={44} className="text-indigo-500" strokeWidth={1.5} />
                      </div>
                      <h4 className="text-2xl font-black tracking-tight mb-2">
                        Upload event cover image
                      </h4>
                      <p className="text-sm font-bold text-slate-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg"
                    className="hidden"
                  />
                </div>
              </InputWrapper>
            </div>

            {/* Core details section */}
            <div className={`p-12 rounded-[56px] shadow-3xl ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-50"}`}>
              <h3 className="text-3xl font-black mb-12 tracking-tight flex items-center gap-4">
                <AlignLeft className="text-indigo-500" /> Core Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

                {/* Title — full width */}
                <div className="sm:col-span-2">
                  <InputWrapper label="Event Title" icon={<Type />} required>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a catchy event name"
                      className={inputClasses}
                      required
                    />
                  </InputWrapper>
                </div>

                {/* Category */}
                <InputWrapper label="Category" icon={<PartyPopper />} required>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`${inputClasses} appearance-none`}
                    required
                  >
                    <option value="" disabled>Select event category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </InputWrapper>

                {/* Location */}
                <InputWrapper label="Location" icon={<MapPin />} required>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Event address"
                    className={inputClasses}
                    required
                  />
                </InputWrapper>

                {/* Date */}
                <InputWrapper label="Date" icon={<CalendarDays />} required>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </InputWrapper>

                {/* Time */}
                <InputWrapper label="Time" icon={<Clock3 />}>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </InputWrapper>

                {/* Price */}
                <InputWrapper label="Ticket Price (USD)" icon={<DollarSign />}>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={inputClasses}
                  />
                </InputWrapper>

                {/* Description — full width */}
                <div className="sm:col-span-2">
                  <InputWrapper label="Event Description" required>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your experience..."
                      rows={6}
                      className={`${inputClasses} py-6 resize-none no-scrollbar`}
                      required
                    />
                  </InputWrapper>
                </div>
              </div>

              {/* Actions */}
              <div
                className={`
                  flex flex-col sm:flex-row items-center gap-6
                  mt-16 pt-10 border-t
                  ${darkMode ? "border-white/5" : "border-slate-100"}
                `}
              >
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`
                    flex-1 w-full sm:w-auto text-center py-6 rounded-[28px]
                    font-black text-lg transition-all ripple-btn
                    ${darkMode
                      ? "bg-white/5 text-white hover:bg-white/10"
                      : "bg-slate-50 text-slate-600 border border-slate-100"
                    }
                  `}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 w-full sm:w-auto text-center py-6 rounded-[28px] bg-indigo-600 text-white font-black text-lg shadow-2xl shadow-indigo-600/20 ripple-btn hover:bg-indigo-700"
                >
                  Publish Event
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}