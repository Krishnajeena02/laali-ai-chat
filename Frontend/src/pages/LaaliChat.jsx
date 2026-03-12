import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import laaliImg from "../assets/WhatsApp Image 2026-03-08 at 2.10.25 AM (1).jpeg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const SONGS = [
  "/music/tum-hi-ho.mp3",
  "/music/kesariya.mp3",
  "/music/raataan-lambiyan.mp3",
  "/music/pahadi-mashup.mp3",
  "/music/bekhayali.mp3",
  "/music/hawayein.mp3",
];

const SUGGESTIONS = [
  "Laali, kas chhe tu? 🌸",
  "Ke karn chhe 🏔️",
  "Aaj din kas go? ☀️",
];

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
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <div key={h.id} style={{
          position: "absolute", left: h.left, bottom: "-30px",
          fontSize: h.size, opacity: h.opacity,
          animation: `floatUp ${h.dur} ${h.delay} ease-in infinite`,
          color: "red",
        }}>♥</div>
      ))}
    </div>
  );
}

export default function ChatScreen() {
  const navigate = useNavigate();
  const name = localStorage.getItem("laali_user");

  useEffect(() => { if (!name) navigate("/"); }, [name, navigate]);

  const [messages, setMessages] = useState([{
    role: "model",
    text: `hey ${name} Laata 🌸 Main Laali chhu bageshwer bati 🏔️ tu kak chhe, kacchu ghar ke chhu dhinay? 😊`,
  }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [typing,  setTyping]  = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const audio     = useRef(null);
  const index     = useRef(0);
  const started   = useRef(false);

  useEffect(() => {
    audio.current = new Audio(SONGS[0]);
    audio.current.volume = 0.15;

    audio.current.addEventListener("ended", () => {
      index.current = (index.current + 1) % SONGS.length;
      audio.current.src = SONGS[index.current];
      audio.current.play();
    });

    const start = () => {
      if (started.current) return;
      started.current = true;
      audio.current.play().catch(() => {});
    };

    document.addEventListener("click", start);
    document.addEventListener("touchstart", start);

    return () => {
      audio.current.pause();
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { name, message: msg });
      setMessages((prev) => [...prev, { role: "model", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "model",
        text: "Arre! krishna ne iduge baat kariye karau ab ni karun mi baat 😅",
      }]);
    } finally {
      setTyping(false);
      setLoading(false);
      inputRef.current?.focus();
    }
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
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1); opacity: 1; }
        }
        .dot-pulse { animation: dotPulse 1.4s ease-in-out infinite; }
        body { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,60,100,0.2); border-radius: 2px; }
      `}</style>

      <div className="h-[100dvh] overflow-hidden bg-[#080808] flex items-center justify-center sm:p-4 relative">

        <div className="fixed -top-28 -right-28 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(200,60,100,0.10) 0%, transparent 70%)" }} />
        <div className="fixed -bottom-24 -left-24 w-[380px] h-[380px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(160,40,80,0.08) 0%, transparent 70%)" }} />

        <span className="hidden sm:block"><FloatingHearts /></span>
        <div
          className="relative z-10 w-full flex flex-col bg-[#0f0f0f] border-white/[0.07]
            h-[100dvh] rounded-none border-0
            sm:h-[90vh] sm:max-h-[720px] sm:max-w-[500px] sm:rounded-[28px] sm:border"
          style={{ boxShadow: "0 0 0 1px rgba(200,60,100,0.1), 0 30px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)" }}
        >

          <div className="flex  items-center gap-3 px-4 py-3 sm:px-5 sm:py-5 flex-shrink-0 border-b border-white/[0.05]"
            // style={{ background: "linear-gradient(180deg, rgba(200,60,100,0.06) 0%, transparent 100%)" }}    
            >
            <div className="relative flex-shrink-0">
              <img
                src={laaliImg}
                alt="Laali"
                className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full object-cover object-top block border-[1.5px] border-[rgba(200,60,100,0.4)]"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Laali&background=c83c64&color=fff&size=100"; }}
              />
              <span className="absolute bottom-0.5 right-0.5 w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] bg-[#3ecf6a] rounded-full border-2 border-[#0f0f0f]"
                style={{ boxShadow: "0 0 6px #3ecf6a" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[18px] sm:text-[20px] font-bold leading-none tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif" }}>Laali</p>
              <p className="text-white/35 text-[11px] mt-1 font-light truncate">Chatting with {name} 💕</p>
            </div>
            <span className="hidden xs:inline-flex sm:inline-flex text-[11px] px-3 py-[5px] rounded-full whitespace-nowrap font-light text-[rgba(255,160,180,0.7)] border border-[rgba(200,60,100,0.2)] bg-[rgba(200,60,100,0.10)]">
              🏔️ {name}
            </span>
          </div>

          <div className="flex-1 bg-black overflow-y-auto px-3 py-4 sm:px-4 sm:py-[18px] flex flex-col gap-3 relative">
            <span className="sm:hidden"><FloatingHearts /></span>
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "model" && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex-shrink-0 border border-[rgba(200,60,100,0.3)]"
                    style={{ boxShadow: "0 0 10px rgba(200,60,100,0.2)" }}>
                    <img
                      src={laaliImg}
                      alt="Laali"
                      className="w-full h-full rounded-full object-cover object-top block"
                      onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Laali&background=c83c64&color=fff&size=100"; }}
                    />
                  </div>
                )}
                <p className={`max-w-[80%] sm:max-w-[75%] px-3 py-2 sm:px-[15px] sm:py-[11px] text-sm sm:text-[14.5px] leading-relaxed break-words font-light
                  ${m.role === "user"
                    ? "text-white rounded-[16px_4px_16px_16px] border border-white/[0.08]"
                    : "text-white/80 rounded-[4px_16px_16px_16px] border border-white/[0.07] bg-[#181818]"}`}
                  style={m.role === "user" ? {
                    background: "linear-gradient(135deg, #c83c64 0%, #8b1a38 100%)",
                    boxShadow: "0 4px 20px rgba(200,60,100,0.30)",
                  } : { boxShadow: "0 2px 12px rgba(0,0,0,0.40)" }}
                >{m.text}</p>
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex-shrink-0 border border-[rgba(200,60,100,0.3)]">
                  <img
                    src={laaliImg}
                    alt="Laali"
                    className="w-full h-full rounded-full object-cover object-top block"
                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Laali&background=c83c64&color=fff&size=100"; }}
                  />
                </div>
                <div className="bg-[#181818] border border-white/[0.07] rounded-[4px_16px_16px_16px] px-4 py-[13px] flex gap-[5px] items-center">
                  {[0, 200, 400].map((d, i) => (
                    <div key={i} className="dot-pulse w-[7px] h-[7px] rounded-full bg-[rgba(200,60,100,0.7)]"
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-3 bg-black sm:px-[14px] pb-2 flex flex-wrap gap-[5px]">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="text-[11px] sm:text-xs px-3 py-[5px] rounded-full cursor-pointer transition-all
                    bg-[rgba(200,60,100,0.08)] border border-[rgba(200,60,100,0.18)] text-[rgba(255,160,180,0.7)]
                    hover:bg-[rgba(200,60,100,0.16)] hover:border-[rgba(200,60,100,0.4)] hover:text-[rgba(255,200,210,0.9)]">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div className="px-3 pb-4 pt-2 sm:px-4 sm:pb-[14px] sm:pt-[10px] border-t border-white/[0.05] flex gap-2 sm:gap-[10px] items-center flex-shrink-0 bg-black/20"
            style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="kro yrr apu girlfriend hai baat... 💬"
              disabled={loading}
              className="flex-1 bg-[#181818] border border-white/[0.08] rounded-[22px] px-4 py-[10px] sm:px-[18px] sm:py-[11px]
                text-sm font-light text-white/85 outline-none transition placeholder:text-white/20
                focus:border-[rgba(200,60,100,0.4)] focus:shadow-[0_0_0_3px_rgba(200,60,100,0.08)]"
              style={{ caretColor: "#c83c64" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-base sm:text-lg flex-shrink-0
                cursor-pointer transition-all hover:scale-[1.08] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color:"red",
                background: "white",
                // boxShadow: "0 4px 18px rgba(200,60,100,0.4)",
              }}
            >❤</button>
          </div>

          <p className="text-center pb-2 sm:pb-3 text-[11px] sm:text-[10.5px] font-light text-white tracking-wider flex-shrink-0">
            Made with <span className="text-red-500 ">❤</span> By Krishna Singh Jeena •
          </p>

        </div>
      </div>
    </>
  );
}