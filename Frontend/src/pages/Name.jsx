import { useState } from "react";
import { useNavigate } from "react-router-dom";
import laaliImg from "../assets/WhatsApp Image 2026-03-08 at 2.10.25 AM (1).jpeg";

function FloatingHearts() {
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + i * 7.5}%`,
    delay: `${i * 0.9}s`,
    dur: `${8 + (i % 4) * 2}s`,
    size: i % 3 === 0 ? 14 : i % 3 === 1 ? 10 : 8,
    opacity: i % 3 === 0 ? 0.12 : 0.07,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <div key={h.id} style={{
          position: "absolute",
          left: h.left,
          bottom: "-30px",
          fontSize: h.size,
          opacity: h.opacity,
          animation: `floatUp ${h.dur} ${h.delay} ease-in infinite`,
          color: "red",
        }}>♥</div>
      ))}
    </div>
  );
}

export default function NameScreen() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) return;
    localStorage.setItem("laali_user", name.trim());
    navigate("/chat");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@700&display=swap');
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(1.4); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        body { font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* ✅ Full screen on mobile, centered on desktop */}
      <div className="min-h-screen min-h-[100dvh] bg-[#080808] flex items-center justify-center relative overflow-hidden sm:p-4">

        {/* Blobs — desktop only */}
        <div className="hidden sm:block fixed -top-28 -right-28 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(200,60,100,0.10) 0%, transparent 70%)" }} />
        <div className="hidden sm:block fixed -bottom-24 -left-24 w-[380px] h-[380px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(160,40,80,0.08) 0%, transparent 70%)" }} />

        <FloatingHearts />

        {/* ✅ Card
            Mobile:  full screen, no border radius, scrollable
            Desktop: centered card with rounded corners */}
        <div
          className="
            relative z-10 flex flex-col items-center w-full bg-[#0f0f0f] border-white/[0.07]
            min-h-[100dvh] rounded-none border-0 justify-center px-6 py-10
            sm:min-h-0 sm:rounded-[28px] sm:border sm:max-w-sm sm:px-8 sm:py-10
          "
          style={{
            boxShadow: "0 0 0 1px rgba(200,60,100,0.1), 0 30px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
            animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >

          {/* Avatar */}
          <div className="relative mb-5">
            <img
              src={laaliImg}
              alt="Laali"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover object-top block border-[1.5px] border-[rgba(200,60,100,0.4)]"
              style={{ boxShadow: "0 0 30px rgba(200,60,100,0.3)" }}
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=Laali&background=c83c64&color=fff&size=200";
              }}
            />
            <span
              className="absolute bottom-1 right-1 w-[13px] h-[13px] bg-[#3ecf6a] rounded-full border-2 border-[#0f0f0f]"
              style={{ boxShadow: "0 0 6px #3ecf6a" }}
            />
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <p
              className="text-2xl sm:text-3xl font-bold leading-none tracking-wide text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Laali
            </p>
            <p className="text-xs sm:text-sm mt-2 font-light text-white/35">
             Kumaouni 🏔️
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/[0.05] mb-5" />

          {/* Prompt */}
          <div className="text-center mb-5">
            <p className="text-sm font-medium text-white/70">
              Naam kichhu tumar 💕
            </p>
            <p className="text-xs mt-1 font-light text-white/50">
              aao 2-4 fasak marnu 🌹
            </p>
          </div>

          {/* Input */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Tumar naam... 🌸"
            autoFocus
            className="w-full bg-[#181818] border border-white/[0.08] rounded-[22px] px-5 py-3 sm:py-[11px]
              text-sm font-light text-white/85 outline-none transition mb-4
              focus:border-[rgba(200,60,100,0.4)] focus:shadow-[0_0_0_3px_rgba(200,60,100,0.08)]"
            style={{ caretColor: "#c83c64" }}
          />

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full py-3 rounded-[22px] text-sm font-semibold text-white transition-all mb-5
              hover:scale-[1.03] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #c83c64 0%, #8b1a38 100%)",
              boxShadow: "0 4px 18px rgba(200,60,100,0.4)",
            }}
          >
            Shuru Karo 💌
          </button>

          {/* Footer */}
          <p className="text-[10px] font-light text-white/70 tracking-wider"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            Made with 💕 By Krishna Singh Jeena • Powered by Gemini AI
          </p>

        </div>
      </div>
    </>
  );
}