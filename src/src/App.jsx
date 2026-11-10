import React, { useState } from 'react';

export default function App() {
  // Video Link-gaagii Fembed
  const [videoUrl, setVideoUrl] = useState("https://fembed.co/embed/bW-8l_ofHNlcv");
  const [server, setServer] = useState("Fembed Server");

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-3xl flex justify-between items-center py-4 border-b border-zinc-800">
        <h1 className="text-2xl font-black text-red-600 tracking-wider">AVEENA MEDIA</h1>
        <button className="bg-red-600 text-xs px-3 py-1.5 rounded-full font-bold hover:bg-red-700">
          VIP ACCESS
        </button>
      </header>

      {/* Main Video Box */}
      <main className="w-full max-w-3xl mt-6">
        <div className="relative w-full pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
          <iframe
            src={videoUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Video Player"
          />
        </div>

        {/* Video Info Card */}
        <div className="mt-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Episode 1 (Qaybta 1-aad)</h2>
            <p className="text-xs text-zinc-400 mt-1">Status: Active • HD 1080p</p>
          </div>
          <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-md border border-zinc-700">
            {server}
          </span>
        </div>
      </main>
    </div>
  );
            }
