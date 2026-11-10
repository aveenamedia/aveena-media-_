import React, { useState, useEffect } from 'react';

// Xogta Filimada Bilowga ah
const INITIAL_MOVIES = [
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
      { id: 2, title: "E2 Episode 2", duration: "25m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  },
  {
    id: 2,
    title: "How to Train Your Dragon",
    year: "2019",
    rating: "8.5",
    isVip: false,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    description: "Hiccup iyo Toothless oo dib u bilaabaya tacabirkoodii ugu weynaa.",
    episodes: [
      { id: 1, title: "Full Movie", duration: "1h 45m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
    ]
  },
  {
    id: 3,
    title: "The Foreigner",
    year: "2017",
    rating: "7.5",
    isVip: true,
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    description: "Jackie Chan oo aargoosi u raadinaya gabadhiisa oo lagu dilay qarax.",
    episodes: [
      { id: 1, title: "Full Movie VIP", duration: "1h 54m", videoUrl: "https://fembed.co/embed/bW-8l_ofHNlcv" }
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
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('aveena_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('aveena_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aveena_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState('browse'); // 'browse' | 'watch' | 'admin'
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [selectedEpisode, setSelectedEpisode] = useState(movies[0]?.episodes[0]);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showVipModal, setShowVipModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [vipStep, setVipStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('HORMUUD'); // 'HORMUUD' | 'SOMTEL'
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

  useEffect(() => {
    localStorage.setItem('aveena_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('aveena_users', JSON.stringify(users));
  }, [users]);

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
        setAuthError('Fadlan buuxi dhammaan meelaha bannaan.');
        return;
      }
      const existingUser = users.find(u => u.email.toLowerCase() === authEmail.toLowerCase());
      if (existingUser) {
        setAuthError('Email-kan mar hore ayaa la isticmaalay!');
        return;
      }
      const newUser = { name: authName, email: authEmail, password: authPassword, role: 'user', isVip: false };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setShowAuthModal(false);
      resetAuthForm();
    } else {
      const foundUser = users.find(u => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword);
      if (foundUser) {
        setCurrentUser(foundUser);
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

  // ADMIN: Add or Update Movie
  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!movieTitle || !movieVideoUrl) {
      alert('Geli ugu yaraan Cinwaanka iyo Link-ga Fembed');
      return;
    }

    if (editingMovieId) {
      // Update existing movie
      setMovies(movies.map(m => {
        if (m.id === editingMovieId) {
          return {
            ...m,
            title: movieTitle,
            image: movieImage || m.image,
            description: movieDesc,
            isVip: movieIsVip,
            episodes: [
              { ...m.episodes[0], videoUrl: movieVideoUrl }
            ]
          };
        }
        return m;
      }));
      setEditingMovieId(null);
      alert('Filimka si guul leh ayaa wax looga beddelay!');
    } else {
      // Add new movie
      const created = {
        id: Date.now(),
        title: movieTitle,
        year: "2026",
        rating: "9.0",
        isVip: movieIsVip,
        image: movieImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
        description: movieDesc || "Filim cusub oo AVEENA MEDIA lagu soo kordhiyay.",
        episodes: [
          { id: 1, title: "Qaybta 1-aad (Full)", duration: "25m", videoUrl: movieVideoUrl }
        ]
      };
      setMovies([created, ...movies]);
      alert('Filim cusub ayaa lagu daray!');
    }

    // Reset Form
    setMovieTitle('');
    setMovieImage('');
    setMovieVideoUrl('');
    setMovieDesc('');
    setMovieIsVip(false);
  };

  // Populate form for editing
  const startEditing = (movie) => {
    setEditingMovieId(movie.id);
    setMovieTitle(movie.title);
    setMovieImage(movie.image);
    setMovieVideoUrl(movie.episodes[0]?.videoUrl || '');
    setMovieDesc(movie.description);
    setMovieIsVip(movie.isVip);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingMovieId(null);
    setMovieTitle('');
    setMovieImage('');
    setMovieVideoUrl('');
    setMovieDesc('');
    setMovieIsVip(false);
  };

  const handleDeleteMovie = (id) => {
    if (confirm('Ma hubtaa inaad filimkan tirtirto?')) {
      setMovies(movies.filter(m => m.id !== id));
    }
  };

  const handleWatchMovie = (movie, episode = null) => {
    setSelectedMovie(movie);
    setSelectedEpisode(episode || movie.episodes[0]);
    setCurrentView('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // USSD Codes
  const getDialCode = () => {
    if (paymentMethod === 'HORMUUD') {
      return `*712*771795014*${planPrice}#`;
    } else {
      return `*712*615456085*${planPrice}#`; // Somtel / Kii hore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 select-none">
      
      {/* 1. TOP HEADER (Blue & White) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('browse')}>
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">
            A
          </div>
          <h1 className="text-xl font-black tracking-wide text-blue-600">AVEENA <span className="text-slate-800 text-xs font-semibold">MEDIA</span></h1>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setCurrentView(currentView === 'admin' ? 'browse' : 'admin')}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow">
              ⚙️ Admin
            </button>
          )}

          <button 
            onClick={() => { setVipStep(1); setShowVipModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-md shadow-blue-600/20">
            👑 VIP
          </button>

          {currentUser ? (
            <button 
              onClick={handleLogout}
              className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200">
              Ka bax
            </button>
          ) : (
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-200">
              Gal
            </button>
          )}
        </div>
      </header>

      {/* 2. MAIN VIEWS */}
      {currentView === 'admin' ? (
        /* ADMIN VIEW */
        <div className="max-w-2xl mx-auto p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-blue-700">⚙️ Maamulka (Admin Panel)</h2>
            <button onClick={() => setCurrentView('browse')} className="text-xs text-blue-600 font-bold">← Bogga Hore</button>
          </div>

          {/* Form: Add or Edit */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm mb-6">
            <h3 className="font-bold text-sm text-slate-800 mb-3">
              {editingMovieId ? '✏️ Wax ka beddel Filimka' : '➕ Ku dar Filim Cusub'}
            </h3>
            
            <form onSubmit={handleSaveMovie} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Cinwaanka Filimka</label>
                <input 
                  type="text" 
                  value={movieTitle} 
                  onChange={(e) => setMovieTitle(e.target.value)}
                  placeholder="Cinwaanka..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Link-ga Video-ga Fembed</label>
                <input 
                  type="text" 
                  value={movieVideoUrl} 
                  onChange={(e) => setMovieVideoUrl(e.target.value)}
                  placeholder="https://fembed.co/embed/..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Link-ga Sawirka (Poster Image)</label>
                <input 
                  type="text" 
                  value={movieImage} 
                  onChange={(e) => setMovieImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Faahfaahin</label>
                <textarea 
                  value={movieDesc} 
                  onChange={(e) => setMovieDesc(e.target.value)}
                  placeholder="Faahfaahin kooban..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="vipOption" 
                  checked={movieIsVip} 
                  onChange={(e) => setMovieIsVip(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="vipOption" className="text-xs font-semibold text-slate-700">Miyaa laga dhigaa VIP?</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
                  {editingMovieId ? '💾 Keydi Isbeddelka' : '➕ Daabac Filimka'}
                </button>
                {editingMovieId && (
                  <button type="button" onClick={cancelEditing} className="px-4 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                    Ka noqo
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Movies List with Edit & Delete */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Liiska Filimada ({movies.length})</h3>
            <div className="space-y-2.5">
              {movies.map(m => (
                <div key={m.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <img src={m.image} alt="" className="w-11 h-11 object-cover rounded-lg shadow-sm" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{m.title}</h4>
                      <span className="text-[10px] text-blue-600 font-semibold">{m.isVip ? '👑 VIP' : 'Bilaash'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => startEditing(m)}
                      className="text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-blue-200">
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMovie(m.id)}
                      className="text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-200">
                      Tirtir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : currentView === 'browse' ? (
        /* BROWSE VIEW */
        <main>
          {/* Banner */}
          <div className="relative w-full h-80 bg-slate-900 overflow-hidden">
            <img 
              src={movies[0]?.image} 
              alt="Banner" 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Featured Streaming</span>
              <h2 className="text-2xl font-black mb-1">{movies[0]?.title}</h2>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-md mb-3">{movies[0]?.description}</p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleWatchMovie(movies[0])}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30">
                  ▶ Daawad Hadda
                </button>
                <button 
                  onClick={() => { setVipStep(1); setShowVipModal(true); }}
                  className="bg-white/20 backdrop-blur text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/30">
                  👑 VIP Qorshaha
                </button>
              </div>
            </div>
          </div>

          {/* Movies List */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <span className="w-2 h-4 bg-blue-600 rounded-full"></span> Filimada & Musalsalada
              </h3>
              <span className="text-xs text-blue-600 font-bold">{movies.length} Filim</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
              {movies.map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => handleWatchMovie(movie)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer">
                  
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <img 
                      src={movie.image} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {movie.isVip && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                        VIP
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                      ★ {movie.rating}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{movie.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{movie.year} • {movie.episodes.length} Qayb</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* WATCH VIEW */
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
          <button 
            onClick={() => setCurrentView('browse')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mb-3 font-bold">
            ← Ku noqo Liiska Filimada
          </button>

          <div className="relative w-full pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <iframe
              src={selectedEpisode?.videoUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title="Player"
            />
          </div>

          <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">{selectedMovie.title} - {selectedEpisode?.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{selectedMovie.description}</p>
          </div>

          <div className="mt-5">
            <h3 className="font-bold text-sm mb-2 text-slate-800">Qaybaha (Episodes)</h3>
            <div className="space-y-2">
              {selectedMovie.episodes.map((ep) => (
                <div 
                  key={ep.id}
                  onClick={() => setSelectedEpisode(ep)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedEpisode?.id === ep.id 
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                  <div className="flex items-center gap-2 text-xs">
                    <span>▶</span>
                    <span>{ep.title}</span>
                  </div>
                  <span className="text-[11px] opacity-75">{ep.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. VIP PAYMENT MODAL (Hormuud & Somtel) */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowVipModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">✕</button>

            <h3 className="text-lg font-black text-center text-blue-600 mb-1">Dooro Qorshaha VIP</h3>
            <p className="text-[11px] text-slate-400 text-center mb-4">Daawo dhammaan filimada adoon xayeysiis lahayn</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  vipStep === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1: Network Selection */}
            {vipStep === 1 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-700">1. Dooro shirkadda aad ku bixinayso:</p>
                
                {/* Hormuud EVC Plus */}
                <button 
                  onClick={() => { setPaymentMethod('HORMUUD'); setVipStep(2); }}
                  className="w-full p-3 bg-emerald-50 rounded-2xl border border-emerald-200 hover:border-emerald-600 flex items-center justify-between text-left transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow">
                      H
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-emerald-800">EVC PLUS (Hormuud)</h4>
                      <p className="text-[10px] text-emerald-600">Lambarka: 771795014</p>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-bold text-xs">➔</span>
                </button>

                {/* Somtel eDahab */}
                <button 
                  onClick={() => { setPaymentMethod('SOMTEL'); setVipStep(2); }}
                  className="w-full p-3 bg-amber-50 rounded-2xl border border-amber-200 hover:border-amber-600 flex items-center justify-between text-left transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base shadow">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-900">eDAHAB (Somtel)</h4>
                      <p className="text-[10px] text-amber-600">Lambarkii Hore</p>
                    </div>
                  </div>
                  <span className="text-amber-700 font-bold text-xs">➔</span>
                </button>
              </div>
            )}

            {/* Step 2: Plan Selection */}
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

            {/* Step 3: USSD & Hadda Dir + WhatsApp */}
            {vipStep === 3 && (
              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-700 font-semibold">3. Bixi Lacagta ({paymentMethod === 'HORMUUD' ? 'Hormuud' : 'Somtel'}):</p>
                
                <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
                  <span className="text-[10px] text-slate-500">Koodhka Tooska ah:</span>
                  <div className="text-lg font-black text-blue-700 my-1 tracking-wider">
                    {getDialCode()}
                  </div>
                  
                  {/* Batoonka "Hadda Dir" */}
                  <a 
                    href={`tel:${getDialCode().replace('#', '%23')}`}
                    className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md mt-1">
                    📞 Hadda Dir (Wac Koodhka)
                  </a>
                </div>

                {/* Batoonka WhatsApp Kala Xiriir */}
                <div className="pt-1">
                  <p className="text-[11px] text-slate-500 mb-2">Marka aad lacagta dirto kaddib:</p>
                  <button 
                    onClick={() => { setShowVipModal(false); setShowWhatsAppModal(true); }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl shadow flex items-center justify-center gap-2">
                    <span>💬</span> WhatsApp Kala Xiriir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. WHATSAPP CHOOSER MODAL (3 LAMBAR) */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl animate-fade-in">
            <button onClick={() => setShowWhatsAppModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">✕</button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-2">
                💬
              </div>
              <h3 className="text-base font-black text-slate-900">Nagala Soo Xiriir WhatsApp</h3>
              <p className="text-xs text-slate-400 mt-0.5">Dooro lambarka aad doonayso inaad la hadasho:</p>
            </div>

            <div className="space-y-2.5">
              {WHATSAPP_NUMBERS.map((item, index) => (
                <a 
                  key={index}
                  href={`https://wa.me/${item.number}?text=Asc%20Aveena%20Media%20VIP%20ayaan%20lacagteeda%20diray`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-between transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 text-base">🟢</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                      <p className="text-[11px] font-semibold text-emerald-700">{item.display}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold">Fur ➔</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING WHATSAPP BUTTON (Furaya 3-da Lambar) */}
      <button 
        onClick={() => setShowWhatsAppModal(true)}
        className="fixed bottom-20 right-4 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center text-xl">
        💬
      </button>

      {/* 6. BOTTOM NAVIGATION (Blue & White) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 flex justify-around items-center text-[10px] text-slate-500">
        <button 
          onClick={() => setCurrentView('browse')}
          className={`flex flex-col items-center gap-0.5 ${currentView === 'browse' ? 'text-blue-600 font-bold' : ''}`}>
          <span className="text-sm">🏠</span>
          <span>Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('browse')}
          className="flex flex-col items-center gap-0.5 hover:text-blue-600">
          <span className="text-sm">🎬</span>
          <span>Filimaan</span>
        </button>
        <button 
          onClick={() => { setVipStep(1); setShowVipModal(true); }}
          className="flex flex-col items-center gap-0.5 text-blue-600 font-bold">
          <span className="text-sm">👑</span>
          <span>VIP</span>
        </button>
        {currentUser ? (
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 text-slate-600 font-semibold">
            <span className="text-sm">👤</span>
            <span>{currentUser.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button 
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
            className="flex flex-col items-center gap-0.5 text-slate-600 font-semibold">
            <span className="text-sm">🔑</span>
            <span>Gal</span>
          </button>
        )}
      </nav>

    </div>
  );
          }
