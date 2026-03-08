import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const PLAYLIST = [
  { file: "tum-hi-ho.mp3",        title: "Tum Hi Ho",       artist: "Aashiqui 2" },
  { file: "kesariya.mp3",         title: "Kesariya",         artist: "Brahmastra" },
  { file: "raataan-lambiyan.mp3", title: "Raataan Lambiyan", artist: "Shershaah" },
  { file: "pahadi-mashup.mp3",    title: "Pahadi Mashup",    artist: "Folk 🏔️" },
];

const SONG_KEYWORDS = {
  romantic: "tum-hi-ho.mp3", love: "tum-hi-ho.mp3", pyaar: "tum-hi-ho.mp3",
  kesariya: "kesariya.mp3",
  pahadi: "pahadi-mashup.mp3", folk: "pahadi-mashup.mp3", mountains: "pahadi-mashup.mp3",
  sad: "raataan-lambiyan.mp3",
};

const MusicPlayer = forwardRef(({ lastUserMessage }, ref) => {
  const audioRef = useRef(null);
  const [index,   setIndex]   = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(PLAYLIST[0]);

  useEffect(() => {
    audioRef.current = new Audio(`/music/${PLAYLIST[0].file}`);
    audioRef.current.volume = 0.5;
    audioRef.current.addEventListener("ended", () => nextSong());
    return () => audioRef.current?.pause();
  }, []);

  const playSong = (i) => {
    const song = PLAYLIST[i];
    audioRef.current.pause();
    audioRef.current.src = `/music/${song.file}`;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setCurrent(song); setIndex(i); setPlaying(true);
  };

  const nextSong = () => playSong((index + 1) % PLAYLIST.length);
  const prevSong = () => playSong((index - 1 + PLAYLIST.length) % PLAYLIST.length);

  const toggleMusic = () => {
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  useEffect(() => {
    if (!lastUserMessage) return;
    const msg = lastUserMessage.toLowerCase();
    for (const key in SONG_KEYWORDS) {
      if (msg.includes(key)) {
        const i = PLAYLIST.findIndex(s => s.file === SONG_KEYWORDS[key]);
        if (i !== -1) playSong(i);
        break;
      }
    }
  }, [lastUserMessage]);

  useImperativeHandle(ref, () => ({
    startMusicOnce() {
      if (!playing) { audioRef.current?.play().catch(() => {}); setPlaying(true); }
    },
  }));

  return (
    <>
      <style>{`
        @keyframes b1 { from{height:30%} to{height:90%} }
        @keyframes b2 { from{height:55%} to{height:100%} }
        @keyframes b3 { from{height:25%} to{height:70%} }
        .ba{animation:b1 .5s ease-in-out infinite alternate}
        .bb{animation:b2 .7s ease-in-out infinite alternate}
        .bc{animation:b3 .6s ease-in-out infinite alternate}
      `}</style>

      <div className=" mr-8 flex justify-around  mb-2 px-3">
        <div
          className="flex items-center gap-2 px-3 py-[7px]"
          style={{
            background: "rgba(22,22,24,0.96)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "999px",
            boxShadow: "0 2px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Bars */}
          <div className="flex items-end gap-[2px] h-[14px] w-[11px]">
            {[["ba"],["bb"],["bc"]].map(([cls], i) => (
              <div key={i}
                className={`w-[3px] rounded-full bg-[#c83c64] ${playing ? cls : ""}`}
                style={{ height: playing ? undefined : "35%", transition: "height 0.3s" }}
              />
            ))}
          </div>

          {/* Title */}
          <p className="text-[11px] font-medium text-white/80 whitespace-nowrap max-w-[110px] truncate">
            {current.title}
          </p>

          {/* Divider */}
          <div className="w-px h-3 bg-white/10 flex-shrink-0" />

          {/* Controls */}
          <button onClick={prevSong} className="text-white/40 hover:text-white/80 transition text-[10px]">⏮</button>

          <button onClick={toggleMusic}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[9px] flex-shrink-0 transition hover:scale-110 active:scale-95"
            style={{ background: "linear-gradient(135deg,#c83c64,#8b1a38)", boxShadow: "0 0 8px rgba(200,60,100,0.5)" }}>
            {playing ? "⏸" : "▶"}
          </button>

          <button onClick={nextSong} className="text-white/40 hover:text-white/80 transition text-[10px]">⏭</button>
        </div>
      </div>
    </>
  );
});

export default MusicPlayer;