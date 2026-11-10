import React, { useState } from 'react';

// Xogta Filimada iyo Qaybaha (Episodes)
const MOVIES = [
  {
    id: 1,
    title: "My Bias My Boss",
    year: "2026",
    rating: "9.5",
    isVip: false,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
    description: "Sheeko jacayl iyo qosol leh oo dhexmarta gabar shaqaale ah iyo maamulaheeda cusub.",
    episodes: [
      { id: 1, title: "E1 Episode 1", duration: "22m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
      { id: 2, title: "E2 Episode 2", duration: "25m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
      { id: 3, title: "E3 Episode 3", duration: "21m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
      { id: 4, title: "E4 Episode 4", duration: "24m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
    ]
  },
  {
    id: 2,
    title: "How to Train Your Dragon",
    year: "2019",
    rating: "8.5",
    isVip: false,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    description: "Hiccup iyo Toothless oo dib u bilaabaya tacabirkoodii ugu weynaa ee qoyska iyo xayawaanka.",
    episodes: [
      { id: 1, title: "Full Movie (Qaybta 1)", duration: "1h 45m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  },
  {
    id: 3,
    title: "The Foreigner",
    year: "2017",
    rating: "7.5",
    isVip: true,
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    description: "Jackie Chan oo aargoosi u raadinaya gabadhiisa oo lagu dilay qarax argagaxiso.",
    episodes: [
      { id: 1, title: "Full Movie VIP", duration: "1h 54m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  },
  {
    id: 4,
    title: "Merry Berry Love",
    year: "2026",
    rating: "9.0",
    isVip: false,
    image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&auto=format&fit=crop&q=80",
    description: "Jacayl dhexmaray beeraley iyo gabar magaalo ka timid.",
    episodes: [
      { id: 1, title: "Episode 1", duration: "21m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
      { id: 2, title: "Episode 2", duration: "22m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('browse'); // 'browse' ama 'watch'
  const [selectedMovie, setSelectedMovie] = useState(MOVIES[0]);
  const [selectedEpisode, setSelectedEpisode] = useState(MOVIES[0].episodes[0]);
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipStep, setVipStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('EVC PLUS');
  const [planPrice, setPlanPrice] = useState('3');
  const [senderNumber, setSenderNumber] = useState('');

  // Furida filimka si toos ah
  const handleWatchMovie = (movie, episode = null) => {
    setSelectedMovie(movie);
    setSelectedEpisode(episode || movie.episodes[0]);
    setCurrentView('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24 select-none">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('browse')}>
          <h1 className="text-xl font-extrabold tracking-wider text-red-600">AVEENA <span className="text-white text-xs font-medium">MEDIA</span></h1>
        </div>
        <button 
          onClick={() => { setVipStep(1); setShowVipModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg shadow-blue-600/30">
          👑 VIP
        </button>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      {currentView === 'browse' ? (
        <main>
          {/* HERO BANNER */}
          <div className="relative w-full h-96 bg-zinc-900 overflow-hidden">
            <img 
              src={MOVIES[0].image} 
              alt="Banner" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Featured Musalsal</span>
              <h2 className="text-3xl font-black mb-2">{MOVIES[0].title}</h2>
              <p className="text-xs text-zinc-300 line-clamp-2 max-w-md mb-4">{MOVIES[0].description}</p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleWatchMovie(MOVIES[0])}
                  className="bg-white text-black font-bold text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-zinc-200">
                  ▶ Daawad
                </button>
                <button 
                  onClick={() => { setVipStep(1); setShowVipModal(true); }}
                  className="bg-zinc-800/80 backdrop-blur text-white font-semibold text-sm px-4 py-2.5 rounded-lg border border-zinc-700">
                  + VIP Info
                </button>
              </div>
            </div>
          </div>

          {/* LATEST UPLOADS / MOVIE CARDS */}
          <div className="p-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-red-600 rounded-full"></span> Filimada Ugu Cusub
              </h3>
              <span className="text-xs text-zinc-500">Dhammaan</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
              {MOVIES.map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => handleWatchMovie(movie)}
                  className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/60 active:scale-95 transition-all cursor-pointer">
                  
                  {/* Poster Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img 
                      src={movie.image} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {/* VIP Badge */}
                    {movie.isVip && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded shadow">
                        VIP
                      </span>
                    )}
                    {/* Rating Badge */}
                    <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      ★ {movie.rating}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <div className="p-2.5">
                    <h4 className="font-bold text-xs truncate">{movie.title}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{movie.year} • {movie.episodes.length} Qaybood</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* WATCH / PLAYER VIEW */
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
          {/* Back Button */}
          <button 
            onClick={() => setCurrentView('browse')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs mb-3 font-semibold">
            ← Ku noqo Liiska Filimada
          </button>

          {/* Player Box */}
          <div className="relative w-full pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            <iframe
              src={selectedEpisode.videoUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title="Player"
            />
          </div>

          {/* Episode Info */}
          <div className="mt-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800/80">
            <h2 className="text-xl font-bold">{selectedMovie.title} - {selectedEpisode.title}</h2>
            <p className="text-xs text-zinc-400 mt-1">{selectedMovie.description}</p>
          </div>

          {/* Episodes List Selector */}
          <div className="mt-6">
            <h3 className="font-bold text-sm mb-3 text-zinc-300">Qaybaha Filimkan (Episodes)</h3>
            <div className="space-y-2">
              {selectedMovie.episodes.map((ep) => (
                <div 
                  key={ep.id}
                  onClick={() => setSelectedEpisode(ep)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedEpisode.id === ep.id 
                      ? 'bg-red-600/10 border-red-600 text-red-500 font-bold' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">▶</span>
                    <span className="text-xs">{ep.title}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">{ep.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. VIP PAYMENT MODAL (Somali EVC Plus & eDahab Flow) */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            {/* Close */}
            <button 
              onClick={() => setShowVipModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg">✕</button>

            <h3 className="text-lg font-black text-center mb-1 text-white">Dooro Qorshaha VIP</h3>
            <p className="text-[11px] text-zinc-400 text-center mb-4">Daawo dhammaan filimada adoon xayeysiis lahayn</p>

            {/* Steps Stepper */}
            <div className="flex items-center justify-center gap-2 mb-5">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  vipStep === step ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {step}
                </div>
              ))}
            </div>

            {/* STEP 1: DOORASHADA LACAG-BIXINTA */}
            {vipStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-300">Marxlada 1aad: Dooro adeegga lacagta</p>
                <button 
                  onClick={() => { setPaymentMethod('EVC PLUS'); setVipStep(2); }}
                  className="w-full p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-600 flex items-center justify-between text-left">
                  <div>
                    <h4 className="font-bold text-sm text-blue-500">EVC PLUS</h4>
                    <p className="text-[10px] text-zinc-500">Ku bixi Hormuud Mobile Money</p>
                  </div>
                  <span>➔</span>
                </button>
                <button 
                  onClick={() => { setPaymentMethod('EDAHAB'); setVipStep(2); }}
                  className="w-full p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-yellow-600 flex items-center justify-between text-left">
                  <div>
                    <h4 className="font-bold text-sm text-yellow-500">EDAHAB</h4>
                    <p className="text-[10px] text-zinc-500">Ku bixi Somtel Mobile Money</p>
                  </div>
                  <span>➔</span>
                </button>
              </div>
            )}

            {/* STEP 2: DOORASHADA MUDDADA / PLAN */}
            {vipStep === 2 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-300">Marxlada 2aad: Dooro Muddada</p>
                {[
                  { price: '1', period: '1 Bil', label: 'Bille' },
                  { price: '3', period: '3 Bil', label: 'Ugu Caansan (Recommended)' },
                  { price: '12', period: '1 Sano', label: 'Sanadle' }
                ].map((plan) => (
                  <div 
                    key={plan.price}
                    onClick={() => { setPlanPrice(plan.price); setVipStep(3); }}
                    className={`p-3.5 bg-zinc-900 rounded-xl border cursor-pointer flex justify-between items-center ${
                      planPrice === plan.price ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800'
                    }`}>
                    <div>
                      <h4 className="font-bold text-sm">${plan.price} <span className="text-xs font-normal text-zinc-400">/{plan.period}</span></h4>
                      <p className="text-[10px] text-zinc-400">{plan.label}</p>
                    </div>
                    <span className="text-blue-500 text-xs font-bold">Dooro ➔</span>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: NUMBERKA IYO USSD CODE */}
            {vipStep === 3 && (
              <div className="space-y-3 text-center">
                <p className="text-xs text-zinc-300 font-semibold">Marxlada 3aad: Bixi Lacagta</p>
                <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Koodhka Bixinta ({paymentMethod}):</span>
                  <div className="text-lg font-black text-blue-400 my-2 select-all">
                    *712*615456085*{planPrice}#
                  </div>
                  <a 
                    href={`tel:*712*615456085*${planPrice}%23`}
                    className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg mt-1">
                    📞 Wac Hadda si aad u bixiso
                  </a>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Marka aad lacagta bixiso, adeegga VIP-da si toos ah ayaa lagugu furayaa.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/252615456085?text=Asc%20Aveena%20Media%20VIP%20aan%20rabaa"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-4 z-40 bg-green-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center">
        💬
      </a>

      {/* 5. BOTTOM MOBILE NAVIGATION BAR */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 py-2.5 flex justify-around items-center text-[10px] text-zinc-400">
        <button 
          onClick={() => setCurrentView('browse')}
          className={`flex flex-col items-center gap-1 ${currentView === 'browse' ? 'text-red-500 font-bold' : ''}`}>
          <span>🏠</span>
          <span>Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('browse')}
          className="flex flex-col items-center gap-1 hover:text-white">
          <span>🎬</span>
          <span>Filimaan</span>
        </button>
        <button 
          onClick={() => setCurrentView('browse')}
          className="flex flex-col items-center gap-1 hover:text-white">
          <span>📺</span>
          <span>Musalsal</span>
        </button>
        <button 
          onClick={() => { setVipStep(1); setShowVipModal(true); }}
          className="flex flex-col items-center gap-1 text-blue-500 font-bold">
          <span>👑</span>
          <span>VIP</span>
        </button>
      </nav>

    </div>
  );
                    }
