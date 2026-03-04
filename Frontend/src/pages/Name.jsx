import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NameScreen() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) return;

    localStorage.setItem("laali_user", name.trim());
    navigate("/chat");
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #0d0005 0%, #1f0010 35%, #2a0015 60%, #150008 100%)" }}
    >

      {/* glow blobs */}
      <div className="fixed top-[-80px] right-[-80px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(220,30,80,0.12) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-60px] left-[-60px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(180,20,60,0.1) 0%, transparent 70%)" }} />

      {/* card */}
      <div
        className="flex flex-col items-center gap-5 px-8 py-10 rounded-3xl z-10 w-full max-w-sm"
        style={{
          background: "rgba(20,2,12,0.88)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(220,60,100,0.2)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,150,180,0.07)",
        }}
      >
        {/* avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: "linear-gradient(135deg, #be123c, #881337)",
            border: "2px solid rgba(255,120,150,0.3)",
            boxShadow: "0 0 30px rgba(190,18,60,0.5)",
          }}
        >
          🌹
        </div>

        {/* title */}
        <div className="text-center">
          <p
            className="text-2xl font-extrabold"
            style={{
              background: "linear-gradient(90deg, #fda4af, #fb7185, #f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Laali
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,160,180,0.5)" }}>
            Uttarakhand ki pahadon se 🏔️
          </p>
        </div>

        {/* prompt */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: "rgba(255,200,210,0.85)" }}>
            Apna naam batao 💕
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,160,180,0.4)" }}>
            Laali tumhara intezaar kar rahi hai 🌹
          </p>
        </div>

        {/* input */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Tumhara naam... 🌸"
          autoFocus
          className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(220,60,100,0.25)",
            color: "rgba(255,210,220,0.92)",
          }}
        />

        {/* button */}
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full py-3 rounded-2xl text-sm font-semibold transition hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #e11d48, #9f1239)",
            color: "white",
            boxShadow: "0 4px 20px rgba(225,29,72,0.4)",
          }}
        >
          Shuru Karo 💌
        </button>

        <p className="text-[10px]" style={{ color: "rgba(255,100,130,0.25)" }}>
          Dil se dil tak 💕 Powered by Groq AI
        </p>
      </div>

      <style>{`
        @keyframes floatHeart {
          0%   { transform: translateY(0px) rotate(-5deg) scale(1); }
          33%  { transform: translateY(-15px) rotate(5deg) scale(1.1); }
          66%  { transform: translateY(-8px) rotate(-3deg) scale(0.95); }
          100% { transform: translateY(0px) rotate(-5deg) scale(1); }
        }
        input::placeholder { color: rgba(255,150,170,0.3); }
      `}</style>
    </div>
  );
}