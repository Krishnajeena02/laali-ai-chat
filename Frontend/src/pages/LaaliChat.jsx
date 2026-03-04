import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const SUGGESTIONS = [
  "Laali, kaisi ho? 🌸",
  "Kuch sunao apne gaon ke baare mein 🏔️",
  "Mujhe Kumaoni mein kuch sikho 😄",
  "Aaj ka din kaisa raha? ☀️",
];

export default function ChatScreen() {
  const navigate = useNavigate();
  const name = localStorage.getItem("laali_user");

  useEffect(() => {
    if (!name) navigate("/");
  }, [name, navigate]);

  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `Namaskaar ${name}! 🌸 Main Laali hoon Uttarakhand ki pahadon se 🏔️ Kaisa chha tum? 😊`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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
      setMessages((prev) => [...prev, { role: "model", text: "Arre! Kuch gadbad ho gayi 😅 Phir se try karo!" }]);
    } finally {
      setTyping(false);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d0a3e] to-[#1a1a4e] flex items-center justify-center p-4 relative overflow-hidden">

      {/* bg blobs */}
      <div className="fixed top-[-100px] right-[-100px] w-96 h-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-80px] left-[-80px] w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none animate-pulse" />

      {/* chat box */}
      <div className="w-full max-w-[500px] h-[90vh] max-h-[720px] flex flex-col rounded-3xl border border-pink-500/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl overflow-hidden z-10">

        {/* header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b border-pink-500/10">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/30">
              🌸
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a0a2e]" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-extrabold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              Laali
            </p>
            <p className="text-[11px] text-pink-200/50">
              Chatting with {name} 💕
            </p>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-200/70">
            🏔️ Uttarakhand
          </span>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "model" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm flex-shrink-0">
                  🌸
                </div>
              )}
              <p className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed break-words rounded-2xl
                ${m.role === "user"
                  ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-br-sm"
                  : "bg-white/[0.07] border border-pink-300/10 text-pink-50/90 rounded-bl-sm"
                }`}>
                {m.text}
              </p>
            </div>
          ))}

          {/* typing dots */}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm">
                🌸
              </div>
              <div className="bg-white/[0.07] border border-pink-300/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 bg-pink-400/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-pink-400/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-pink-400/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-200/70 hover:bg-pink-500/20 transition cursor-pointer">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* input */}
        <div className="px-4 pb-5 pt-2 border-t border-pink-500/[0.08] flex gap-3 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Laali se kuch bolo... 💬"
            disabled={loading}
            className="flex-1 bg-white/[0.06] border border-pink-400/20 rounded-2xl px-4 py-3 text-sm text-pink-50/90 placeholder-pink-300/30 focus:outline-none focus:border-pink-400/40 transition"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-lg shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition disabled:opacity-40 cursor-pointer">
            💌
          </button>
        </div>

        <p className="text-center text-[10px] text-pink-400/25 pb-3">
          Made with 💕 for Laali • Powered by Groq AI
        </p>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(236,72,153,0.2); border-radius: 2px; }
        input::placeholder { color: rgba(216,180,254,0.3); }
      `}</style>
    </div>
  );
}