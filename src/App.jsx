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
  const [activeTab, setActiveTab] = useState('Home');

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
  const [movieImage, setMovieImage] = useState('');
  const [movieVideoUrl, setMovieVideoUrl] = useState('');
  const [movieDesc, setMovieDesc] = useState('');
  const [movieIsVip, setMovieIsVip] = useState(false);

  // KASOO QAAD FILIMADA SUPABASE
  const fetchMoviesFromSupabase = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/movies?select=*&order=id.desc`, { headers: HEADERS });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMovies(data);
        if (!selectedMovie) setSelectedMovie(data[0]);
      } else {
        // Haddii Supabase faaruq tahay ku dar kuwii asalka ahaa
        setMovies([
          {
            id: 1,
            title: "How to train your dragon",
            year: "2019",
            rating: "8.5",
            is_vip: false,
            image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
            description: "Hiccup iyo Toothless oo bilaabaya tacabirkoodii ugu weynaa.",
            video_url: "https://fembed.co/embed/bW-8l_ofHNlcv"
          },
          {
            id: 2,
            title: "Central Intelligence",
            year: "2016",
            rating: "7.8",
            is_vip: true,
            image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
            description: "Dwayne Johnson iyo Kevin Hart oo ku jira filim qosol iyo dagaal ah.",
            video_url: "https://fembed.co/embed/bW-8l_ofHNlcv"
          }
        ]);
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
        setAuthError('Fadlan buuxi dhammaan meelaha bannaan.');
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

  // ADMIN SAVE MOVIE
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    if (!movieTitle || !movieVideoUrl) {
      alert('Geli Cinwaanka iyo Link-ga Video-ga');
      return;
    }

    if (editingMovieId) {
      await fetch(`${SUPABASE_URL}/rest/v1/movies?id=eq.${editingMovieId}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({
          title: movieTitle,
          image: movieImage,
          video_url: movieVideoUrl,
          description: movieDesc,
          is_vip: movieIsVip
        })
      });
      alert('Filimka si toos ah ayaa wax looga beddelay!');
      setEditingMovieId(null);
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/movies`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          title: movieTitle,
          year: "2026",
          rating: "9.0",
          is_vip: movieIsVip,
          image: movieImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
          description: movieDesc || "Filim cusub oo AVEENA MEDIA.",
          video_url: movieVideoUrl
        })
      });
      alert('Filim cusub ayaa la daabacay!');
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
    setMovieImage(movie.image || '');
    setMovieVideoUrl(movie.video_url || '');
    setMovieDesc(movie.description || '');
    setMovieIsVip(movie.is_vip || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMovie = async (id) => {
    if (confirm('Ma hubtaa inaad filimkan tirtirto?')) {
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

  // Filter Search
  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans pb-28 select-none">
      
      {/* 1. TOP HEADER (EXACT LIKE SCREENSHOT) */}
      <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-900">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('browse')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/30">
            <span className="text-base ml-0.5">▶</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-white leading-none">AVEENA</h1>
            <span className="text-[9px] tracking-widest text-blue-400 font-bold block mt-0.5">M E D I A</span>
          </div>
        </div>

        {/* Search Bar */}
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

        {/* User Avatar Circle */}
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

      {/* 2. MAIN VIEW */}
      {currentView === 'admin' ? (
        /* ADMIN VIEW */
        <div className="max-w-xl mx-auto p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-black text-blue-400">⚙️ Maamulka (Admin Panel)</h2>
            <button onClick={() => setCurrentView('browse')} className="text-xs text-blue-400 font-bold">← Bogga Hore</button>
          </div>

          <div className="bg-[#0f172a] p-5 rounded-3xl border border-blue-900/40 mb-6 shadow-xl">
            <h3 className="font-bold text-sm text-white mb-3">
              {editingMovieId ? '✏️ Wax ka beddel Filimka' : '➕ Ku dar Filim Cusub'}
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
                <label className="text-xs font-semibold text-slate-400">Link-ga Video-ga Fembed</label>
                <input 
                  type="text" 
                  value={movieVideoUrl} 
                  onChange={(e) => setMovieVideoUrl(e.target.value)}
                  placeholder="https://fembed.co/embed/..."
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white focus:outline-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Link-ga Sawirka (Poster Image)</label>
                <input 
                  type="text" 
                  value={movieImage} 
                  onChange={(e) => setMovieImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 p-2.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Faahfaahin</label>
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
                  {editingMovieId ? '💾 Keydi Isbeddelka' : '➕ Daabac Filimka'}
                </button>
                {editingMovieId && (
                  <button type="button" onClick={() => setEditingMovieId(null)} className="px-4 bg-slate-800 text-white font-bold rounded-xl text-xs">
                    Ka noqo
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Movies List */}
          <div className="bg-[#0f172a] p-4 rounded-3xl border border-blue-900/40">
            <h3 className="font-bold text-sm text-white mb-3">Filimada Yaalla ({movies.length})</h3>
            <div className="space-y-2">
              {movies.map(m => (
                <div key={m.id} className="flex justify-between items-center p-2.5 bg-[#070b14] rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <img src={m.image} alt="" className="w-10 h-10 object-cover rounded-xl" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.title}</h4>
                      <span className="text-[10px] text-blue-400">{m.is_vip ? '👑 VIP' : 'Free'}</span>
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
        /* BROWSE VIEW (EXACT LIKE SCREENSHOT) */
        <main className="p-4">
          {/* HERO BANNER CARD */}
          {movies.length > 0 && (
            <div className="relative w-full rounded-3xl overflow-hidden border border-blue-900/40 bg-gradient-to-b from-[#131d35] to-[#0a0f1d] p-5 shadow-2xl">
              {/* Background Poster Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={movies[0]?.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/60 to-transparent"></div>
              </div>

              <div className="relative z-10 flex flex-col justify-end pt-8">
                {/* Badge: KU SOO DHAWOW AVEENA */}
                <div className="inline-flex items-center gap-1.5 bg-[#0f1f3d]/90 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full w-fit mb-3">
                  KU SOO DHAWOW AVEENA
                </div>

                <h2 className="text-2xl font-black text-white mb-1 leading-tight">
                  {movies[0]?.title}
                </h2>
                <span className="text-xs text-slate-400 font-medium mb-5 block">Film</span>

                {/* Big Blue Button: Daawo Hadda */}
                <button 
                  onClick={() => handleWatchMovie(movies[0])}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-7 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-blue-600/40 w-fit active:scale-95 transition">
                  <span className="text-sm">▶</span> Daawo Hadda
                </button>

                {/* Carousel Indicator Pills */}
                <div className="flex items-center gap-2 mt-8">
                  <span className="w-9 h-3 bg-blue-600 rounded-full"></span>
                  <span className="w-8 h-3 bg-blue-600/80 rounded-full"></span>
                  <span className="w-8 h-3 bg-blue-600/80 rounded-full"></span>
                  <span className="w-8 h-3 bg-blue-600/80 rounded-full"></span>
                  <span className="w-8 h-3 bg-blue-600/80 rounded-full"></span>
                  <span className="w-8 h-3 bg-blue-600/80 rounded-full"></span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION HEADER: Dhammaan Videos-ka */}
          <div className="flex justify-between items-center mt-6 mb-3 px-1">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>🔥</span> Dhammaan Videos-ka
            </h3>
            <span className="text-xs text-blue-400 font-bold">{filteredMovies.length} Videos</span>
          </div>

          {/* MOVIE GRID (EXACT CARDS) */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {filteredMovies.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => handleWatchMovie(movie)}
                className="group relative bg-[#0e1628] rounded-2xl overflow-hidden border border-slate-800/80 shadow-md hover:border-blue-900 transition cursor-pointer">
                
                {/* Poster */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Golden VIP Badge */}
                  {movie.is_vip && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                      👑 VIP
                    </span>
                  )}

                  {/* Little Blue Play Circle Button (Like Screenshot) */}
                  <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/50">
                    <span className="text-xs ml-0.5">▶</span>
                  </div>
                </div>

                {/* Title */}
                <div className="p-2.5">
                  <h4 className="font-bold text-xs text-white truncate">{movie.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{movie.year || '2026'}</p>
                </div>
              </div>
            ))}
          </div>
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
              allow="autoplay; fullscreen; encrypted-media"
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

      {/* 5. BOTTOM NAVIGATION BAR (EXACT AS SCREENSHOT) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-t border-slate-900 py-2.5 flex justify-around items-center text-[10px] text-slate-400">
        <button 
          onClick={() => { setActiveTab('Home'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Home' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Drama'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Drama' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">▶</span>
          <span>Drama</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Filimaan'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Filimaan' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">🎴</span>
          <span>Filimaan</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Kartoonno'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Kartoonno' ? 'text-blue-500 font-bold' : ''}`}>
          <span className="text-base">📑</span>
          <span>Kartoonno</span>
        </button>

        <button 
          onClick={() => { setActiveTab('Warar'); setCurrentView('browse'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'Warar' ? 'text-blue-500 font-bold' : ''}`}>
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
