use client;
import React, { useState } from "react";

const gumroadLink = process.env.NEXT_PUBLIC_GUMROAD_LINK || "https://gumroad.com/";

export default function Home() {
  const [deckText, setDeckText] = useState("");
  const [vcPersona, setVcPersona] = useState("");
  const [loading, setLoading] = useState(false);
  const [bullets, setBullets] = useState<string[]>([]);
  const [brief, setBrief] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setBullets([]);
    setBrief("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckText, vcPersona }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setBullets(data.bullets || []);
      setBrief(data.brief || "");
    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#131934] via-[#252B4A] to-[#19123A] flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 p-8 glass-card">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-center tracking-tight">VC Briefing Engine</h1>
        <p className="text-sm text-purple-300 mb-6 text-center">Summarize your pitch and get a VC-personalized briefing instantly.</p>
        <textarea
          className="w-full h-32 p-3 rounded-xl border border-blue-900 bg-white/10 text-white focus:outline-none mb-4 resize-none glass-card"
          placeholder="Paste your pitch deck text here..."
          value={deckText}
          onChange={e => setDeckText(e.target.value)}
        />
        <input
          className="w-full p-3 rounded-xl border border-purple-900 bg-white/10 text-white focus:outline-none mb-4 glass-card"
          placeholder="Enter VC firm name (e.g., Sequoia Capital)"
          value={vcPersona}
          onChange={e => setVcPersona(e.target.value)}
        />
        <button
          disabled={loading || !deckText || !vcPersona}
          onClick={handleGenerate}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 mb-4"
        >
          {loading ? "Generating..." : "Generate Brief"}
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
        {(bullets.length > 0 || brief) && (
          <div className="mt-6">
            <div className="bg-white/10 rounded-xl p-4 mb-4 glass-card border border-blue-700">
              <h2 className="text-lg font-bold text-purple-400 mb-2">Key Bullets</h2>
              <ul className="text-white space-y-2 list-disc list-inside">
                {bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-4 glass-card border border-purple-700">
              <h2 className="text-lg font-bold text-blue-400 mb-2">VC Brief</h2>
              <p className="text-white whitespace-pre-line">{brief}</p>
            </div>
          </div>
        )}
        <a
          href={gumroadLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-blue-700 text-white font-bold text-center shadow-lg hover:scale-105 transition-transform"
        >
          Unlock Premium Features →
        </a>
      </div>
      <style jsx global>{`
        .glass-card {
          box-shadow: 0 6px 32px 0 rgba(44, 35, 80, 0.22);
          border-radius: 1.5rem;
          backdrop-filter: blur(18px);
        }
      `}</style>
    </main>
  );
}