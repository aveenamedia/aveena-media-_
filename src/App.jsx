import React, { useState, useEffect } from 'react';

// Xogta Bilowga ah ee Musalsalada iyo Xalqadaha
const INITIAL_SERIES = [
  {
    id: 1,
    title: "Sodoh",
    category: "Drama",
    genre: "Drama • Somali • Season 1",
    rating: "4.8",
    isVip: false,
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    description: "Musalsal qoys iyo jacayl oo aad u xiiso badan.",
    episodes: [
      { id: 1, title: "Sodoh EP1", epCode: "S1E1", duration: "28m", thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
      { id: 2, title: "Sodoh EP2", epCode: "S1E2", duration: "31m", thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
      { id: 3, title: "Sodoh EP3", epCode: "S1E3", duration: "25m", thumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  },
  {
    id: 2,
    title: "Ishqbaaaz",
    category: "Drama",
    genre: "Drama • Hindi Af Somali • Season 4",
    rating: "4.5",
    isVip: true,
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    description: "Sheeko jacayl iyo loollan qoys oo Hindi ah.",
    episodes: [
      { id: 1, title: "Ishqbaaaz EP1", epCode: "S1E1", duration: "22m", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" },
      { id: 2, title: "Ishqbaaaz EP2", epCode: "S1E2", duration: "24m", thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  },
  {
    id: 3,
    title: "Central Intelligence",
    category: "Filimaan",
    genre: "Action • Comedy • 2026",
    rating: "4.9",
    isVip: false,
    poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80",
    description: "Filim qosol iyo dagaal ah.",
    episodes: [
      { id: 1, title: "Full Movie", epCode: "HD", duration: "1h 48m", thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&auto=format&fit=crop&q=80", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  }
];

// 3-da Lambar ee WhatsApp
const WHATSAPP_NUMBERS = [
  { label: "WhatsApp 1 (Hormuud)", number: "252771795014", display: "77 179 5014" },
  { label: "WhatsApp 2 (Hormuud)", number: "252610970464", display: "61 097 0464" },
  { label: "WhatsApp 3 (Somtel)", number: "252686273958", display: "68 627 3958" }
];

export default function App() {
  const [seriesList, setSeriesList] = useState(() => {
    const saved = localStorage.getItem('aveena_blue_db');
    return saved ? JSON.parse(saved) : INITIAL_SERIES;
  });

  const [activeNav, setActiveNav] = useState('Home'); // Home | Movies | Series | Shorts | VIP
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [currentView, setCurrentView] = useState('home'); // home | detail | player | admin | shorts

  const [selectedShow, setSelectedShow] = useState(seriesList[0]);
  const [activeEpisode, setActiveEpisode] = useState(seriesList[0]?.episodes[0]);

  // Modals
  const [showVipModal, setShowVipModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [vipStep, setVipStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('HORMUUD');
  const [planPrice, setPlanPrice] = useState('3');

  // Admin Auth
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin Show Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Drama');
  const [newGenre, setNewGenre] = useState('Drama • Somali');
  const [newPoster, setNewPoster] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsVip, setNewIsVip] = useState(false);

  // Admin Episode Inputs
  const [selectedShowForEp, setSelectedShowForEp] = useState(seriesList[0]?.id || '');
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpCode, setNewEpCode] = useState('EP 1');
  const [newEpDuration, setNewEpDuration] = useState('25m');
  const [newEpThumb, setNewEpThumb] = useState('');
  const [newEpVideo, setNewEpVideo] = useState('');

  useEffect(() => {
    localStorage.setItem('aveena_blue_db', JSON.stringify(seriesList));
  }, [seriesList]);

  // Admin Login
  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin@aveena.com' && adminPass === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setCurrentView('admin');
      setAdminEmail('');
      setAdminPass('');
    } else {
      alert('Email ama Password khalad ah!');
    }
  };

  // Add Show
  const handleCreateShow = (e) => {
    e.preventDefault();
    if (!newTitle) return alert('Geli cinwaanka!');
    const created = {
      id: Date.now(),
      title: newTitle,
      category: newCat,
      genre: newGenre,
      rating: "4.8",
      isVip: newIsVip,
      poster: newPoster || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      description: newDesc || "Musalsal cusub.",
      episodes: []
    };
    setSeriesList([created, ...seriesList]);
    setNewTitle('');
    setNewPoster('');
    setNewDesc('');
    alert('Musalsalka/Filimka si guul leh ayaa loo abuuray!');
  };

  // Add Episode
  const handleAddEpisode = (e) => {
    e.preventDefault();
    if (!newEpTitle || !newEpVideo) return alert('Geli cinwaanka xalqadda iyo link-ga video-ga');
    const epObj = {
      id: Date.now(),
      title: newEpTitle,
      epCode: newEpCode,
      duration: newEpDuration,
      thumbnail: newEpThumb || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      videoUrl: newEpVideo
    };

    setSeriesList(seriesList.map(s => {
      if (s.id === Number(selectedShowForEp)) {
        return {
          ...s,
          episodes: [...(s.episodes || []), epObj]
        };
      }
      return s;
    }));

    setNewEpTitle('');
    setNewEpThumb('');
    setNewEpVideo('');
    alert('Xalqadda waa lagu daray!');
  };

  const openShowDetail = (show) => {
    setSelectedShow(show);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playEpisode = (ep) => {
    setActiveEpisode(ep);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter List
  const displayedSeries = seriesList.filter(s => {
    if (activeCategoryFilter === 'All') return true;
    return s.category === activeCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-28 select-none">

      {/* 1. TOP HEADER (Blue & White) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-blue-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center justify-center text-sm">
            ⚙️
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/30">
              A
            </div>
            <h1 className="text-xl font-black text-blue-600 tracking-wide">AVEENA <span className="text-slate-800 text-xs font-semibold">MEDIA</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setVipStep(1); setShowVipModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md shadow-blue-600/20">
            VIP
          </button>
          <button 
            onClick={() => setShowWhatsAppModal(true)}
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-sm font-bold">
            💬
          </button>
        </div>
      </header>

      {/* 2. TEXT-ONLY CATEGORY BAR (Bilaa Icon) */}
      {currentView === 'home' && (
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 bg-white border-b border-slate-100 scrollbar-none text-xs">
          {['All', 'Drama', 'Filimaan', 'Kartoonno', 'Warar'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                activeCategoryFilter === cat 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 3. MAIN VIEWS */}

      {/* A. HOME VIEW */}
      {currentView === 'home' && (
        <main>
          {/* Featured Banner */}
          {seriesList.length > 0 && (
            <div className="relative w-full h-80 bg-slate-900 overflow-hidden">
              <img src={seriesList[0]?.poster} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">CUSUB</span>
                <h2 className="text-3xl font-black mb-1">{seriesList[0]?.title}</h2>
                <p className="text-xs text-slate-300 mb-4">{seriesList[0]?.genre}</p>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => openShowDetail(seriesList[0])}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-blue-600/40">
                    Watch Now
                  </button>
                  <button 
                    onClick={() => openShowDetail(seriesList[0])}
                    className="w-12 h-11 bg-white/20 backdrop-blur rounded-xl border border-white/30 flex items-center justify-center font-bold">
                    Info
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Continue Watching Row */}
          <div className="p-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm text-slate-800">Continue watching</h3>
              <span className="text-xs text-blue-600 font-bold">See All</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {seriesList.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => openShowDetail(s)}
                  className="min-w-[160px] bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm cursor-pointer">
                  <div className="relative aspect-video w-full bg-slate-100">
                    <img src={s.poster} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow">
                        ▶
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{s.title}</h4>
                    <p className="text-[10px] text-slate-400">{s.episodes?.length || 0} Episodes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dramas on Going Grid */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm text-slate-800">Dramas On Going</h3>
              <span className="text-xs text-blue-600 font-bold">See All</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {displayedSeries.map((show) => (
                <div 
                  key={show.id}
                  onClick={() => openShowDetail(show)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="relative aspect-[3/4] w-full bg-slate-100">
                    <img src={show.poster} alt="" className="w-full h-full object-cover" />
                    {show.isVip && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                        VIP
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{show.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{show.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* B. SHOW DETAIL VIEW (LEH XALQADAHA OO THUMBNAIL LEH) */}
      {currentView === 'detail' && selectedShow && (
        <div className="max-w-2xl mx-auto p-4 animate-fade-in">
          <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1 text-blue-600 font-bold text-xs mb-3">
            ← Ku noqo
          </button>

          {/* Header Banner */}
          <div className="relative w-full h-64 bg-slate-900 rounded-3xl overflow-hidden shadow-md">
            <img src={selectedShow.poster} alt="" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-5 text-white">
              <h2 className="text-2xl font-black">{selectedShow.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">SERIES</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">{selectedShow.rating}</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">Somali</span>
              </div>
            </div>
          </div>

          {/* Watch Now Button */}
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => {
                if (selectedShow.episodes?.length > 0) playEpisode(selectedShow.episodes[0]);
                else alert('Weli xalqado laguma darin');
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-2xl shadow-md flex items-center justify-center gap-2">
              <span>▶</span> WATCH NOW
            </button>
            <button 
              onClick={() => { setVipStep(1); setShowVipModal(true); }}
              className="px-4 bg-blue-50 text-blue-600 border border-blue-200 font-bold text-xs rounded-2xl">
              VIP
            </button>
          </div>

          {/* Episodes List with Thumbnails & Codes */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm text-slate-800">Episodes</h3>
              <span className="text-xs text-slate-400 font-medium">{selectedShow.episodes?.length || 0} episodes</span>
            </div>

            <div className="space-y-2.5">
              {selectedShow.episodes && selectedShow.episodes.length > 0 ? (
                selectedShow.episodes.map((ep) => (
                  <div 
                    key={ep.id}
                    onClick={() => playEpisode(ep)}
                    className="flex items-center justify-between p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 cursor-pointer transition">
                    
                    <div className="flex items-center gap-3">
                      {/* Individual Episode Thumbnail */}
                      <div className="relative w-24 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <img src={ep.thumbnail || selectedShow.poster} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-xs text-white bg-blue-600/90 rounded-full w-5 h-5 flex items-center justify-center font-bold">▶</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{ep.title}</h4>
                        <span className="text-[10px] text-blue-600 font-semibold">{ep.epCode}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-slate-400 pr-2">{ep.duration}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                  Weli wax xalqado ah laguma darin musalsalkan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* C. PLAYER VIEW */}
      {currentView === 'player' && activeEpisode && (
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
          <button 
            onClick={() => setCurrentView('detail')}
            className="flex items-center gap-1 text-blue-600 font-bold text-xs mb-3">
            ← Ku noqo Xalqadaha
          </button>

          <div className="relative w-full pt-[56.25%] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <iframe
              src={activeEpisode.videoUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title="Player"
            />
          </div>

          <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-black text-slate-900">{selectedShow.title} - {activeEpisode.title}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="text-blue-600 font-bold">{activeEpisode.epCode}</span>
              <span>•</span>
              <span>{activeEpisode.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* D. SHORTS VIEW */}
      {currentView === 'shorts' && (
        <div className="max-w-md mx-auto p-4">
          <h2 className="text-base font-black text-slate-900 mb-4">Shorts</h2>
          <div className="space-y-4">
            <div className="w-full h-96 bg-black rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <iframe
                src="https://fembed.co/embed/bW-8l_ofHNlcv"
                className="w-full h-full border-0"
                allowFullScreen
                title="Shorts"
              />
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200">
              <h3 className="font-bold text-xs text-slate-800">Short Video 1</h3>
              <p className="text-[10px] text-slate-400">Qayb gaaban oo xiiso leh.</p>
            </div>
          </div>
        </div>
      )}

      {/* E. ADMIN VIEW */}
      {currentView === 'admin' && (
        <div className="max-w-2xl mx-auto p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-blue-600">Qaybta Maamulka (Admin)</h2>
            <button onClick={() => setCurrentView('home')} className="text-xs text-blue-600 font-bold">← Bogga Hore</button>
          </div>

          {/* 1. Add Show */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm mb-6">
            <h3 className="font-bold text-xs text-slate-800 mb-3">1. Ku dar Musalsal / Filim Cusub</h3>
            <form onSubmit={handleCreateShow} className="space-y-3">
              <input 
                type="text" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Magaca Musalsalka / Filimka"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={newCat} 
                  onChange={(e) => setNewCat(e.target.value)}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <option value="Drama">Drama</option>
                  <option value="Filimaan">Filimaan</option>
                  <option value="Kartoonno">Kartoonno</option>
                  <option value="Warar">Warar</option>
                </select>
                <input 
                  type="text" 
                  value={newGenre} 
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="Genre (tusaale: Drama • Somali)"
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <input 
                type="text" 
                value={newPoster} 
                onChange={(e) => setNewPoster(e.target.value)}
                placeholder="Link-ga Poster-ka (Sawirka weyn)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <textarea 
                value={newDesc} 
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Sheekada kooban..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs shadow">
                Abuur Musalsalka
              </button>
            </form>
          </div>

          {/* 2. Add Episode to Show */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="font-bold text-xs text-slate-800 mb-3">2. Ku dar Xalqad Musalsal Jira</h3>
            <form onSubmit={handleAddEpisode} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600">Dooro Musalsalka:</label>
                <select 
                  value={selectedShowForEp} 
                  onChange={(e) => setSelectedShowForEp(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  {seriesList.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={newEpTitle} 
                  onChange={(e) => setNewEpTitle(e.target.value)}
                  placeholder="Cinwaanka (tusaale: EP1)"
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
                <input 
                  type="text" 
                  value={newEpCode} 
                  onChange={(e) => setNewEpCode(e.target.value)}
                  placeholder="Koodhka (tusaale: S1E1)"
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={newEpDuration} 
                  onChange={(e) => setNewEpDuration(e.target.value)}
                  placeholder="Daqiiqadaha (tusaale: 28m)"
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input 
                  type="text" 
                  value={newEpThumb} 
                  onChange={(e) => setNewEpThumb(e.target.value)}
                  placeholder="Thumbnail-ka Xalqadda (Link)"
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <input 
                type="text" 
                value={newEpVideo} 
                onChange={(e) => setNewEpVideo(e.target.value)}
                placeholder="Link-ga Video-ga Fembed / YouTube"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow">
                Ku dar Xalqadda
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. VIP MODAL (OFFICIAL LOGOS, HADDA DIR + WHATSAPP) */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowVipModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">✕</button>

            <h3 className="text-lg font-black text-center text-blue-600 mb-1">Dooro Qorshaha VIP</h3>
            <p className="text-[11px] text-slate-400 text-center mb-4">Daawo dhammaan musalsalada adoon xayeysiis lahayn</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  vipStep === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1: Logos */}
            {vipStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700">1. Dooro shirkadda aad ku bixinayso:</p>
                
                {/* Hormuud */}
                <button 
                  onClick={() => { setPaymentMethod('HORMUUD'); setVipStep(2); }}
                  className="w-full p-3.5 bg-emerald-50/60 hover:bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between text-left transition shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl p-1 border border-emerald-200 flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 100 100" className="w-10 h-10">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#2db34a" strokeWidth="8" strokeDasharray="210 60" transform="rotate(-40 50 50)" />
                        <path d="M38 35 v30 M54 35 v30 M38 50 h16" stroke="#2db34a" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="64" cy="42" r="3" fill="#0099ff" />
                        <path d="M70 36 a10 10 0 0 1 0 14" fill="none" stroke="#0099ff" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M76 30 a18 18 0 0 1 0 24" fill="none" stroke="#2db34a" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M82 24 a26 26 0 0 1 0 34" fill="none" stroke="#2db34a" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-emerald-900">EVC PLUS (Hormuud)</h4>
                      <p className="text-[11px] font-black text-emerald-700">77 179 5014</p>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-bold text-sm">➔</span>
                </button>

                {/* Somtel */}
                <button 
                  onClick={() => { setPaymentMethod('SOMTEL'); setVipStep(2); }}
                  className="w-full p-3.5 bg-amber-50/60 hover:bg-amber-50 rounded-2xl border border-amber-300 flex items-center justify-between text-left transition shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#fed100] rounded-xl flex flex-col items-center justify-center p-1 shadow-sm">
                      <svg viewBox="0 0 40 30" className="w-7 h-5">
                        <path d="M20 5 C26 10 30 18 25 25 C20 30 14 28 12 22 C10 16 15 10 20 5 Z" fill="#231f20"/>
                        <path d="M18 13 C14 19 18 25 22 23 C20 21 18 17 18 13 Z" fill="#fed100"/>
                      </svg>
                      <span className="text-[8px] font-black text-black">somtel</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-950">eDAHAB (Somtel)</h4>
                      <p className="text-[11px] font-black text-amber-700">61 545 6085</p>
                    </div>
                  </div>
                  <span className="text-amber-700 font-bold text-sm">➔</span>
                </button>
              </div>
            )}

            {/* Step 2: Plans */}
            {vipStep === 2 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-700">2. Dooro Muddada:</p>
                {[
                  { price: '1', period: '1 Bil', label: 'Bille' },
                  { price: '3', period: '3 Bil', label: 'Ugu Caansan' },
                  { price: '12', period: '1 Sano', label: 'Sanadle' }
                ].map((plan) => (
                  <div 
                    key={plan.price}
                    onClick={() => { setPlanPrice(plan.price); setVipStep(3); }}
                    className={`p-3 bg-slate-50 rounded-xl border cursor-pointer flex justify-between items-center ${
                      planPrice === plan.price ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
                    }`}>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">${plan.price} <span className="font-normal text-slate-400">/{plan.period}</span></h4>
                      <p className="text-[10px] text-slate-400">{plan.label}</p>
                    </div>
                    <span className="text-blue-600 text-xs font-bold">Dooro ➔</span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Hadda Dir & WhatsApp */}
            {vipStep === 3 && (
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs text-slate-900">
                    {paymentMethod === 'HORMUUD' ? 'Hormuud EVC Plus' : 'Somtel eDahab'}
                  </h4>
                  <p className="text-sm font-black text-blue-700 mt-1">Lacagta: ${planPrice}</p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Ku dir: {paymentMethod === 'HORMUUD' ? '771795014' : '615456085'}
                  </p>
                </div>

                <a 
                  href={`tel:*712*${paymentMethod === 'HORMUUD' ? '771795014' : '615456085'}*${planPrice}%23`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">
                  <span>💸</span> Hadda Dir
                </a>

                <button 
                  onClick={() => { setShowVipModal(false); setShowWhatsAppModal(true); }}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.37C16.32 14.25 15.1 13.65 14.88 13.56C14.65 13.48 14.49 13.44 14.32 13.69C14.16 13.93 13.69 14.49 13.55 14.65C13.41 14.81 13.26 14.84 13.02 14.71C12.77 14.59 11.98 14.33 11.04 13.49C10.31 12.84 9.81 12.04 9.67 11.8C9.53 11.55 9.66 11.42 9.78 11.3C9.89 11.19 10.03 11.01 10.15 10.87C10.27 10.73 10.31 10.63 10.39 10.47C10.47 10.3 10.43 10.16 10.37 10.04C10.31 9.92 9.82 8.71 9.61 8.22C9.41 7.74 9.21 7.8 9.06 7.8C8.92 7.79 8.76 7.79 8.59 7.79C8.43 7.79 8.16 7.85 7.94 8.09C7.71 8.34 7.08 8.93 7.08 10.13C7.08 11.33 7.96 12.49 8.08 12.65C8.2 12.82 9.8 15.28 12.26 16.34C12.85 16.59 13.3 16.74 13.66 16.85C14.25 17.04 14.78 17.01 15.21 16.95C15.69 16.88 16.68 16.35 16.89 15.77C17.09 15.19 17.09 14.7 17.03 14.59C16.97 14.49 16.82 14.43 16.57 14.37Z" />
                  </svg>
                  <span>WhatsApp Kala Xiriir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. WHATSAPP MODAL (3 LAMBAR) */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowWhatsAppModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">✕</button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-[#25D366] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-2">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.37C16.32 14.25 15.1 13.65 14.88 13.56C14.65 13.48 14.49 13.44 14.32 13.69C14.16 13.93 13.69 14.49 13.55 14.65C13.41 14.81 13.26 14.84 13.02 14.71C12.77 14.59 11.98 14.33 11.04 13.49C10.31 12.84 9.81 12.04 9.67 11.8C9.53 11.55 9.66 11.42 9.78 11.3C9.89 11.19 10.03 11.01 10.15 10.87C10.27 10.73 10.31 10.63 10.39 10.47C10.47 10.3 10.43 10.16 10.37 10.04C10.31 9.92 9.82 8.71 9.61 8.22C9.41 7.74 9.21 7.8 9.06 7.8C8.92 7.79 8.76 7.79 8.59 7.79C8.43 7.79 8.16 7.85 7.94 8.09C7.71 8.34 7.08 8.93 7.08 10.13C7.08 11.33 7.96 12.49 8.08 12.65C8.2 12.82 9.8 15.28 12.26 16.34C12.85 16.59 13.3 16.74 13.66 16.85C14.25 17.04 14.78 17.01 15.21 16.95C15.69 16.88 16.68 16.35 16.89 15.77C17.09 15.19 17.09 14.7 17.03 14.59C16.97 14.49 16.82 14.43 16.57 14.37Z" />
                </svg>
              </div>
              <h3 className="text-base font-black text-slate-900">Nagala Soo Xiriir WhatsApp</h3>
              <p className="text-xs text-slate-400 mt-0.5">Dooro lambarka aad la hadlayso:</p>
            </div>

            <div className="space-y-2.5">
              {WHATSAPP_NUMBERS.map((item, index) => (
                <a 
                  key={index}
                  href={`https://wa.me/${item.number}?text=Asc%20Aveena%20Media%20VIP`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 text-lg">🟢</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                      <p className="text-[11px] font-black text-emerald-700">{item.display}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-xl font-bold shadow-sm">Fur ➔</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. ADMIN LOGIN MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">✕</button>
            <h3 className="text-base font-black text-blue-600 text-center mb-3">Admin Login</h3>
            <form onSubmit={handleAdminAuth} className="space-y-3">
              <input 
                type="email" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@aveena.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
              <input 
                type="password" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="admin123"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs shadow">
                Gal Admin-ka
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. BOTTOM NAVIGATION (TEXT ONLY - BILAA EMOJIS) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 flex justify-around items-center text-[11px] text-slate-500 font-bold">
        <button 
          onClick={() => { setActiveNav('Home'); setCurrentView('home'); }}
          className={`flex flex-col items-center ${activeNav === 'Home' && currentView === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
          <span>Home</span>
        </button>

        <button 
          onClick={() => { setActiveNav('Movies'); setActiveCategoryFilter('Filimaan'); setCurrentView('home'); }}
          className={`flex flex-col items-center ${activeCategoryFilter === 'Filimaan' && currentView === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
          <span>Movies</span>
        </button>

        <button 
          onClick={() => { setActiveNav('Series'); setActiveCategoryFilter('Drama'); setCurrentView('home'); }}
          className={`flex flex-col items-center ${activeCategoryFilter === 'Drama' && currentView === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
          <span>Series</span>
        </button>

        <button 
          onClick={() => { setActiveNav('Shorts'); setCurrentView('shorts'); }}
          className={`flex flex-col items-center ${currentView === 'shorts' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
          <span>Shorts</span>
        </button>

        <button 
          onClick={() => { setVipStep(1); setShowVipModal(true); }}
          className="flex flex-col items-center text-blue-600 font-black">
          <span>VIP</span>
        </button>
      </nav>

    </div>
  );
                  }
