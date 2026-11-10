import React, { useState, useEffect } from 'react';

// Xogta Supabase Database
const SUPABASE_URL = "https://ynzftysdhuzjhhbbjflz.supabase.co";
const SUPABASE_KEY = "sb_publishable_6sCf6MJDA2wUs7FguPgzUA_r8ALfo4g";
const HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// 3-da Lambar ee WhatsApp
const WHATSAPP_NUMBERS = [
  { label: "WhatsApp 1 (Hormuud)", number: "252771795014", display: "77 179 5014" },
  { label: "WhatsApp 2 (Hormuud)", number: "252610970464", display: "61 097 0464" },
  { label: "WhatsApp 3 (Somtel)", number: "252686273958", display: "68 627 3958" }
];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Drama' | 'Filimaan' | 'Kartoonno' | 'Warar'

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aveena_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState('browse'); // 'browse' | 'watch' | 'admin'
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showVipModal, setShowVipModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [vipStep, setVipStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('HORMUUD');
  const [planPrice, setPlanPrice] = useState('3');

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Add / Edit State
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [movieTitle, setMovieTitle] = useState('');
  const [movieCategory, setMovieCategory] = useState('Filimaan'); // Category
  const [movieImage, setMovieImage] = useState('');
  const [movieVideoUrl, setMovieVideoUrl] = useState('');
  const [movieDesc, setMovieDesc] = useState('');
  const [movieIsVip, setMovieIsVip] = useState(false);

  // Nadiifi oo habeey Link-yada (YouTube ama Fembed)
  const formatVideoUrl = (url) => {
    if (!url) return '';
    let clean = url.trim();
    if (clean.includes('<iframe')) {
      const match = clean.match(/src=["'](.*?)["']/);
      if (match) clean = match[1];
    }
    if (clean.includes('youtube.com/watch?v=')) {
      clean = clean.replace('watch?v=', 'embed/');
    } else if (clean.includes('youtu.be/')) {
      clean = clean.replace('youtu.be/', 'youtube.com/embed/');
    }
    return clean;
  };

  // KASOO QAAD FILIMADA SUPABASE
  const fetchMoviesFromSupabase = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/movies?select=*&order=id.desc`, { headers: HEADERS });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMovies(data);
        if (data.length > 0 && !selectedMovie) {
          setSelectedMovie(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesFromSupabase();
  }, []);

  useEffect(() => {
    localStorage.setItem('aveena_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // LOGIN & REGISTER
  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');

    // Admin Credentials
    if (authEmail.trim().toLowerCase() === 'admin@aveena.com' && authPassword === 'admin123') {
      const adminUser = { name: 'Super Admin', email: authEmail, role: 'admin' };
      setCurrentUser(adminUser);
      setShowAuthModal(false);
      setCurrentView('admin');
      resetAuthForm();
      return;
    }

    if (authMode === 'register') {
      if (!authName || !authEmail || !authPassword) {
        setAuthError('Fadlan buuxi meelaha bannaan.');
        return;
      }
      const newUser = { name: authName, email: authEmail, role: 'user' };
      setCurrentUser(newUser);
      setShowAuthModal(false);
      resetAuthForm();
    } else {
      if (authEmail && authPassword) {
        setCurrentUser({ name: authEmail.split('@')[0], email: authEmail, role: 'user' });
        setShowAuthModal(false);
        resetAuthForm();
      } else {
        setAuthError('Gmail-ka ama Password-ka waa khalad!');
      }
    }
  };

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthError('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('browse');
    localStorage.removeItem('aveena_current_user');
  };

  // ADMIN: Save Movie directly to Supabase
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    if (!movieTitle || !movieVideoUrl) {
      alert('Geli Cinwaanka iyo Link-ga Video-ga');
      return;
    }

    const cleanedUrl = formatVideoUrl(movieVideoUrl);

    if (editingMovieId) {
      await fetch(`${SUPABASE_URL}/rest/v1/movies?id=eq.${editingMovieId}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({
          title: movieTitle,
          year: movieCategory, // Category ahaan u keydi
          image: movieImage,
          video_url: cleanedUrl,
          description: movieDesc,
          is_vip: movieIsVip
        })
      });
      alert('Filimka si guul leh ayaa loo beddelay!');
      setEditingMovieId(null);
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/movies`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          title: movieTitle,
          year: movieCategory, // Category ahaan u keydi
          rating: "9.0",
          is_vip: movieIsVip,
          image: movieImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
          description: movieDesc || "Filim cusub oo AVEENA MEDIA.",
          video_url: cleanedUrl
        })
      });
      alert('Filim cusub ayaa toos loogu daray Database-ka!');
    }

    setMovieTitle('');
    setMovieImage('');
    setMovieVideoUrl('');
    setMovieDesc('');
    setMovieIsVip(false);
    fetchMoviesFromSupabase();
  };

  const startEditing = (movie) => {
    setEditingMovieId(movie.id);
    setMovieTitle(movie.title);
    setMovieCategory(movie.year || 'Filimaan');
    setMovieImage(movie.image || '');
    setMovieVideoUrl(movie.video_url || '');
    setMovieDesc(movie.description || '');
    setMovieIsVip(movie.is_vip || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMovie = async (id) => {
    if (confirm('Ma hubtaa inaad tirtirto filimkan?')) {
      await fetch(`${SUPABASE_URL}/rest/v1/movies?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
      });
      fetchMoviesFromSupabase();
    }
  };

  const handleWatchMovie = (movie) => {
    setSelectedMovie(movie);
    setCurrentView('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Kala saarida Qaybaha (Filter Categories)
  const filteredMovies = movies.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'Home' ? true : m.year === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans pb-28 select-none">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('Home'); setCurrentView('browse'); }}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/30">
            <span className="text-base ml-0.5">▶</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-white leading-none">AVEENA</h1>
            <span className="text-[9px] tracking-widest text-blue-400 font-bold block mt-0.5">M E D I A</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-[210px]">
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Raadi filim, drama..."
            className="w-full bg-[#111928] border border-blue-900/30 rounded-full pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Avatar / Admin Entry */}
        <div 
          onClick={() => {
            if (currentUser?.role === 'admin') {
              setCurrentView(currentView === 'admin' ? 'browse' : 'admin');
            } else if (currentUser) {
              handleLogout();
            } else {
              setAuthMode('login');
              setShowAuthModal(true);
            }
          }}
          className="w-9 h-9 rounded-full bg-[#0d1527] border-2 border-amber-400 text-amber-400 font-bold flex items-center justify-center text-sm cursor-pointer shadow-md shadow-amber-400/10">
          {currentUser ? (currentUser.role === 'admin' ? '⚙️' : currentUser.name.charAt(0).toUpperCase()) : 'A'}
        </div>
      </header>

      {/* 2. MAIN VIEWS */}
      {currentView === 'admin' ? (
        /* ADMIN VIEW */
        <div className="max-w-xl mx-auto p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-black text-blue-400">⚙️ Maamulka (Geli Video Cusub)</h2>
            <button onClick={() => setCurrentView('browse')} className="text-xs text-blue-400 font-bold">← Bogga Hore</button>
          </div>

          <div className="bg-[#0f172a] p-5 rounded-3xl border border-blue-900/40 mb-6 shadow-xl">
            <h3 className="font-bold text-sm text-white mb-3">
              {editingMovieId ? '✏️ Wax ka beddel Filimka' : '➕ Ku dar Video / Filim Cusub'}
            </h3>
            
            <form onSubmit={handleSaveMovie} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Cinwaanka Filimka</label>
                <input 
                  type="text" 
                  value={movieTitle} 
                  onChange={(e) => setMovieTitle(e.target.value)}
                  placeholder="Cinwaanka..."
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white focus:outline-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Dooro Qaybta (Category)</label>
                <select
                  value={movieCategory}
                  onChange={(e) => setMovieCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white focus:outline-blue-500">
                  <option value="Filimaan">Filimaan</option>
                  <option value="Drama">Drama</option>
                  <option value="Kartoonno">Kartoonno</option>
                  <option value="Warar">Warar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Link-ga Video-ga (Fembed / YouTube)</label>
                <input 
                  type="text" 
                  value={movieVideoUrl} 
                  onChange={(e) => setMovieVideoUrl(e.target.value)}
                  placeholder="Geli link-ga video-ga..."
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white focus:outline-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Link-ga Sawirka Poster-ka (Optional)</label>
                <input 
                  type="text" 
                  value={movieImage} 
                  onChange={(e) => setMovieImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Faahfaahin kooban</label>
                <textarea 
                  value={movieDesc} 
                  onChange={(e) => setMovieDesc(e.target.value)}
                  placeholder="Faahfaahin..."
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white focus:outline-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="vipOpt" 
                  checked={movieIsVip} 
                  onChange={(e) => setMovieIsVip(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="vipOpt" className="text-xs font-semibold text-slate-300">VIP kaliya miyaa?</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
                  {editingMovieId ? '💾 Keydi Isbeddelka' : '➕ Daabac Video-ga'}
                </button>
                {editingMovieId && (
                  <button type="button" onClick={() => setEditingMovieId(null)} className="px-4 bg-slate-800 text-white font-bold rounded-xl text-xs">
                    Ka noqo
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Movies List */}
          <div className="bg-[#0f172a] p-4 rounded-3xl border border-blue-900/40">
            <h3 className="font-bold text-sm text-white mb-3">Filimada Yaalla ({movies.length})</h3>
            <div className="space-y-2">
              {movies.map(m => (
                <div key={m.id} className="flex justify-between items-center p-2.5 bg-[#070b14] rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <img src={m.image} alt="" className="w-10 h-10 object-cover rounded-xl" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.title}</h4>
                      <span className="text-[10px] text-blue-400">{m.year || 'Filimaan'} • {m.is_vip ? '👑 VIP' : 'Free'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => startEditing(m)} className="text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg text-xs font-bold">✏️</button>
                    <button onClick={() => handleDeleteMovie(m.id)} className="text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg text-xs font-bold">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : currentView === 'browse' ? (
        /* BROWSE VIEW */
        <main className="p-4">
          {/* BANNER (Kaliya Home-ka ayuu ka muuqanayaa) */}
          {activeTab === 'Home' && movies.length > 0 && (
            <div className="relative w-full rounded-3xl overflow-hidden border border-blue-900/40 bg-gradient-to-b from-[#131d35] to-[#0a0f1d] p-5 shadow-2xl mb-6">
              <div className="absolute inset-0 z-0">
                <img 
                  src={movies[0]?.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/60 to-transparent"></div>
              </div>

              <div className="relative z-10 flex flex-col justify-end pt-8">
                <div className="inline-flex items-center gap-1.5 bg-[#0f1f3d]/90 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full w-fit mb-3">
                  KU SOO DHAWOW AVEENA
                </div>

                <h2 className="text-2xl font-black text-white mb-1 leading-tight">
                  {movies[0]?.title}
                </h2>
                <span className="text-xs text-slate-400 font-medium mb-5 block">{movies[0]?.year || 'Filim'}</span>

                <button 
                  onClick={() => handleWatchMovie(movies[0])}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-7 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-blue-600/40 w-fit active:scale-95 transition">
                  <span className="text-sm">▶</span> Daawo Hadda
                </button>
              </div>
            </div>
          )}

          {/* Section Header */}
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>🔥</span> {activeTab === 'Home' ? 'Dhammaan Videos-ka' : `Qaybta: ${activeTab}`}
            </h3>
            <span className="text-xs text-blue-400 font-bold">{filteredMovies.length} Videos</span>
          </div>

          {/* Empty State */}
          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 bg-[#0e1628] rounded-3xl border border-slate-800">
              <span className="text-3xl">🎬</span>
              <p className="text-xs text-slate-400 mt-2">Weli wax video ah laguma darin qaybta <b>{activeTab}</b>.</p>
              <button 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className="mt-3 text-xs bg-blue-600 text-white font-bold px-4 py-2 rounded-xl">
                Gal Admin ahaan si aad ugu darto ➕
              </button>
            </div>
          ) : (
            /* Movie Grid */
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {filteredMovies.map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => handleWatchMovie(movie)}
                  className="group relative bg-[#0e1628] rounded-2xl overflow-hidden border border-slate-800/80 shadow-md hover:border-blue-900 transition cursor-pointer">
                  
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                    <img 
                      src={movie.image} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {movie.is_vip && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                        👑 VIP
                      </span>
                    )}

                    <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/50">
                      <span className="text-xs ml-0.5">▶</span>
                    </div>
                  </div>

                  <div className="p-2.5">
                    <h4 className="font-bold text-xs text-white truncate">{movie.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{movie.year || 'Filim'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        /* WATCH / PLAYER VIEW */
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
          <button 
            onClick={() => setCurrentView('browse')}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mb-3 font-bold">
            ← Ku noqo Liiska Filimada
          </button>

          <div className="relative w-full pt-[56.25%] bg-black rounded-3xl overflow-hidden shadow-2xl border border-blue-900/40">
            <iframe
              src={selectedMovie?.video_url}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Player"
            />
          </div>

          <div className="mt-4 p-4 bg-[#0e1628] rounded-2xl border border-slate-800 shadow-sm">
            <h2 className="text-lg font-black text-white">{selectedMovie?.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{selectedMovie?.description}</p>
          </div>
        </div>
      )}

      {/* 3. VIP MODAL (OFFICIAL LOGOS, HADDA DIR + WHATSAPP) */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-blue-900/40 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowVipModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>

            <h3 className="text-lg font-black text-center text-blue-400 mb-1">Dooro Qorshaha VIP</h3>
            <p className="text-[11px] text-slate-400 text-center mb-4">Daawo dhammaan filimada adoon xayeysiis lahayn</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  vipStep === step ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1: Logos */}
            {vipStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-300">1. Dooro shirkadda aad ku bixinayso:</p>
                
                {/* Hormuud */}
                <button 
                  onClick={() => { setPaymentMethod('HORMUUD'); setVipStep(2); }}
                  className="w-full p-3.5 bg-[#070b14] hover:bg-slate-900 rounded-2xl border border-emerald-500/40 flex items-center justify-between text-left transition">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl p-1 border border-emerald-400 flex items-center justify-center shadow-sm">
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
                      <h4 className="font-bold text-xs text-emerald-400">EVC PLUS (Hormuud)</h4>
                      <p className="text-[11px] font-black text-white">77 179 5014</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold text-sm">➔</span>
                </button>

                {/* Somtel */}
                <button 
                  onClick={() => { setPaymentMethod('SOMTEL'); setVipStep(2); }}
                  className="w-full p-3.5 bg-[#070b14] hover:bg-slate-900 rounded-2xl border border-amber-500/40 flex items-center justify-between text-left transition">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#fed100] rounded-xl flex flex-col items-center justify-center p-1 shadow-sm">
                      <svg viewBox="0 0 40 30" className="w-7 h-5">
                        <path d="M20 5 C26 10 30 18 25 25 C20 30 14 28 12 22 C10 16 15 10 20 5 Z" fill="#231f20"/>
                        <path d="M18 13 C14 19 18 25 22 23 C20 21 18 17 18 13 Z" fill="#fed100"/>
                      </svg>
                      <span className="text-[8px] font-black text-black tracking-tight leading-none">somtel</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-400">eDAHAB (Somtel)</h4>
                      <p className="text-[11px] font-black text-white">61 545 6085</p>
                    </div>
                  </div>
                  <span className="text-amber-400 font-bold text-sm">➔</span>
                </button>
              </div>
            )}

            {/* Step 2: Plans */}
            {vipStep === 2 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-300">2. Dooro Muddada:</p>
                {[
                  { price: '1', period: '1 Bil', label: 'Bille' },
                  { price: '3', period: '3 Bil', label: 'Ugu Caansan' },
                  { price: '12', period: '1 Sano', label: 'Sanadle' }
                ].map((plan) => (
                  <div 
                    key={plan.price}
                    onClick={() => { setPlanPrice(plan.price); setVipStep(3); }}
                    className={`p-3 bg-[#070b14] rounded-2xl border cursor-pointer flex justify-between items-center ${
                      planPrice === plan.price ? 'border-blue-500 bg-blue-950/40' : 'border-slate-800'
                    }`}>
                    <div>
                      <h4 className="font-bold text-xs text-white">${plan.price} <span className="font-normal text-slate-400">/{plan.period}</span></h4>
                      <p className="text-[10px] text-slate-400">{plan.label}</p>
                    </div>
                    <span className="text-blue-400 text-xs font-bold">Dooro ➔</span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Hadda Dir & WhatsApp */}
            {vipStep === 3 && (
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-[#070b14] rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-xs text-slate-300">
                    {paymentMethod === 'HORMUUD' ? 'Hormuud EVC Plus' : 'Somtel eDahab'}
                  </h4>
                  <p className="text-base font-black text-blue-400 mt-1">Lacagta: ${planPrice}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    Ku dir: {paymentMethod === 'HORMUUD' ? '771795014' : '615456085'}
                  </p>
                </div>

                <a 
                  href={`tel:*712*${paymentMethod === 'HORMUUD' ? '771795014' : '615456085'}*${planPrice}%23`}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">
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

      {/* 4. WHATSAPP MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-blue-900/40 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowWhatsAppModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-[#25D366] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-2">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.37C16.32 14.25 15.1 13.65 14.88 13.56C14.65 13.48 14.49 13.44 14.32 13.69C14.16 13.93 13.69 14.49 13.55 14.65C13.41 14.81 13.26 14.84 13.02 14.71C12.77 14.59 11.98 14.33 11.04 13.49C10.31 12.84 9.81 12.04 9.67 11.8C9.53 11.55 9.66 11.42 9.78 11.3C9.89 11.19 10.03 11.01 10.15 10.87C10.27 10.73 10.31 10.63 10.39 10.47C10.47 10.3 10.43 10.16 10.37 10.04C10.31 9.92 9.82 8.71 9.61 8.22C9.41 7.74 9.21 7.8 9.06 7.8C8.92 7.79 8.76 7.79 8.59 7.79C8.43 7.79 8.16 7.85 7.94 8.09C7.71 8.34 7.08 8.93 7.08 10.13C7.08 11.33 7.96 12.49 8.08 12.65C8.2 12.82 9.8 15.28 12.26 16.34C12.85 16.59 13.3 16.74 13.66 16.85C14.25 17.04 14.78 17.01 15.21 16.95C15.69 16.88 16.68 16.35 16.89 15.77C17.09 15.19 17.09 14.7 17.03 14.59C16.97 14.49 16.82 14.43 16.57 14.37Z" />
                </svg>
              </div>
              <h3 className="text-base font-black text-white">Nagala Soo Xiriir WhatsApp</h3>
              <p className="text-xs text-slate-400 mt-0.5">Dooro lambarka aad la hadlayso:</p>
            </div>

            <div className="space-y-2.5">
              {WHATSAPP_NUMBERS.map((item, index) => (
                <a 
                  key={index}
                  href={`https://wa.me/${item.number}?text=Asc%20Aveena%20Media%20VIP%20ayaa%20lacagteeda%20diray`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-[#070b14] hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400 text-lg">🟢</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.label}</h4>
                      <p className="text-[11px] font-black text-emerald-400">{item.display}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-xl font-bold shadow-sm">Fur ➔</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-blue-900/40 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>

            <h3 className="text-lg font-black text-center text-blue-400 mb-1">
              {authMode === 'login' ? 'Gal Koontada (Login)' : 'Diiwaangeli Koonto'}
            </h3>

            {authError && <div className="p-2 bg-red-950/60 border border-red-800 text-red-400 text-xs rounded-xl text-center mb-3">{authError}</div>}

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs text-slate-400 font-semibold">Magacaaga</label>
                  <input 
                    type="text" 
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Magaca..."
                    className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 font-semibold">Gmail</label>
                <input 
                  type="email" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@aveena.com"
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold">Password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2">
                {authMode === 'login' ? 'Gal' : 'Is-diiwaangeli'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. BOTTOM NAVIGATION (NOW 100% WORKING & FILTERING!) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-t border-slate-900 py-2.5 flex justify-around items-center text-[10px] text-slate-400">
        <button 
          onClick={() => { setActiveTab('Home'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Home' && currentView === 'browse' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Drama'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Drama' && currentView === 'browse' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">▶</span>
          <span>Drama</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Filimaan'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Filimaan' && currentView === 'browse' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">🎴</span>
          <span>Filimaan</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Kartoonno'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Kartoonno' && currentView === 'browse' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">📑</span>
          <span>Kartoonno</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Warar'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Warar' && currentView === 'browse' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">📰</span>
          <span>Warar</span>
        </button>

        <button 
          onClick={() => { setVipStep(1); setShowVipModal(true); }}
          className="flex flex-col items-center gap-1 text-amber-400 font-black">
          <span className="text-base">👑</span>
          <span>VIP</span>
        </button>
      </nav>

    </div>
  );
        }
