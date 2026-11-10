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

export default function App() {
  // Xogaha lagu keydiyo Browser-ka (LocalStorage)
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
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipStep, setVipStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('EVC PLUS');
  const [planPrice, setPlanPrice] = useState('3');

  // Form Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin New Movie Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsVip, setNewIsVip] = useState(false);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('aveena_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('aveena_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('aveena_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // LOGIN & REGISTER HANDLER
  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');

    // 1. ADMIN LOGIN CHECK
    if (authEmail.trim().toLowerCase() === 'admin@aveena.com' && authPassword === 'admin123') {
      const adminUser = { name: 'Super Admin', email: authEmail, role: 'admin' };
      setCurrentUser(adminUser);
      setShowAuthModal(false);
      setCurrentView('admin');
      resetAuthForm();
      return;
    }

    // 2. USER REGISTER
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
      // 3. REGULAR USER LOGIN
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

  // ADMIN: Add New Movie
  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!newTitle || !newVideoUrl) {
      alert('Geli ugu yaraan Cinwaanka iyo Link-ga Fembed');
      return;
    }
    const created = {
      id: Date.now(),
      title: newTitle,
      year: "2026",
      rating: "9.0",
      isVip: newIsVip,
      image: newImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      description: newDesc || "Filim cusub oo AVEENA MEDIA lagu soo kordhiyay.",
      episodes: [
        { id: 1, title: "Qaybta 1-aad (Full)", duration: "25m", videoUrl: newVideoUrl }
      ]
    };
    setMovies([created, ...movies]);
    setNewTitle('');
    setNewImage('');
    setNewVideoUrl('');
    setNewDesc('');
    setNewIsVip(false);
    alert('Filimka si guul leh ayaa loogu daray!');
  };

  // Delete Movie (Admin)
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 select-none">
      
      {/* 1. TOP HEADER (Blue & White) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('browse')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">
            A
          </div>
          <h1 className="text-xl font-black tracking-wide text-blue-600">AVEENA <span className="text-slate-800 text-xs font-semibold">MEDIA</span></h1>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setCurrentView(currentView === 'admin' ? 'browse' : 'admin')}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow">
              ⚙️ Admin Panel
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
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200">
              Ka bax
            </button>
          ) : (
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg border border-blue-200">
              Gal / Login
            </button>
          )}
        </div>
      </header>

      {/* 2. VIEWS */}
      {currentView === 'admin' ? (
        /* ADMIN DASHBOARD */
        <div className="max-w-2xl mx-auto p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-blue-700">⚙️ Qaybta Maamulka (Admin Panel)</h2>
            <button onClick={() => setCurrentView('browse')} className="text-xs text-blue-600 font-bold">← Bogga Hore</button>
          </div>

          {/* Form to Add New Movie */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm mb-6">
            <h3 className="font-bold text-sm text-slate-800 mb-3">➕ Ku dar Filim / Musalsal Cusub</h3>
            <form onSubmit={handleAddMovie} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Cinwaanka Filimka</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Tusaale: Filim Cusub 2026"
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Link-ga Video-ga Fembed</label>
                <input 
                  type="text" 
                  value={newVideoUrl} 
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://fembed.co/embed/..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Link-ga Sawirka Poster-ka (Ikhtiyaari)</label>
                <input 
                  type="text" 
                  value={newImage} 
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Faahfaahin kooban</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Sheekada filimka..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="vipCheck" 
                  checked={newIsVip} 
                  onChange={(e) => setNewIsVip(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="vipCheck" className="text-xs font-semibold text-slate-700">Kaliya VIP miyaa daawan kara?</label>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20">
                Daabac Filimka
              </button>
            </form>
          </div>

          {/* Manage Existing Movies */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Filimada Hadda Yaalla ({movies.length})</h3>
            <div className="space-y-2">
              {movies.map(m => (
                <div key={m.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={m.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{m.title}</h4>
                      <span className="text-[10px] text-slate-400">{m.episodes.length} Qaybood</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMovie(m.id)}
                    className="text-red-600 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded-lg">
                    Tirtir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : currentView === 'browse' ? (
        /* BROWSE VIEW */
        <main>
          {/* HERO BANNER (Blue Accent) */}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2">
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

          {/* MOVIE GRID (White Cards, Blue Borders) */}
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
                  
                  {/* Poster */}
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
        /* WATCH / PLAYER VIEW */
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
          <button 
            onClick={() => setCurrentView('browse')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mb-3 font-bold">
            ← Ku noqo Liiska Filimada
          </button>

          {/* Video Player */}
          <div className="relative w-full pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <iframe
              src={selectedEpisode?.videoUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              title="Player"
            />
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">{selectedMovie.title} - {selectedEpisode?.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{selectedMovie.description}</p>
          </div>

          {/* Episode List */}
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

      {/* 3. LOGIN & REGISTER MODAL (White & Blue) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl animate-fade-in">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">✕</button>

            <h3 className="text-xl font-black text-center text-blue-600 mb-1">
              {authMode === 'login' ? 'Soo Dhawoow!' : 'Sameyso Koonto Cusub'}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-5">
              {authMode === 'login' ? 'Geli Gmail iyo Password-kaaga' : 'Ku biir Aveena Media si aad wax u daawato'}
            </p>

            {authError && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3.5">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Magacaaga oo buuxa</label>
                  <input 
                    type="text" 
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Magacaaga"
                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700">Gmail / Email</label>
                <input 
                  type="email" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="tusaale@gmail.com"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-600"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-blue-500/25">
                {authMode === 'login' ? 'Gal (Login)' : 'Diiwaangeli Koontada'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              {authMode === 'login' ? (
                <p className="text-xs text-slate-500">
                  Koonto ma lihid? {' '}
                  <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-blue-600 font-bold hover:underline">
                    Is-diiwaangeli
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Hore ma u lahayd koonto? {' '}
                  <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-blue-600 font-bold hover:underline">
                    Gal halkan
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. VIP MODAL (Somali EVC Plus & eDahab Flow) */}
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

            {vipStep === 1 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-700">1. Dooro habka lacag-bixinta:</p>
                <button 
                  onClick={() => { setPaymentMethod('EVC PLUS'); setVipStep(2); }}
                  className="w-full p-3 bg-blue-50/50 rounded-xl border border-blue-200 hover:border-blue-600 flex items-center justify-between text-left">
                  <div>
                    <h4 className="font-bold text-xs text-blue-600">EVC PLUS</h4>
                    <p className="text-[10px] text-slate-400">Hormuud Mobile Money</p>
                  </div>
                  <span className="text-blue-600 text-xs">➔</span>
                </button>
                <button 
                  onClick={() => { setPaymentMethod('EDAHAB'); setVipStep(2); }}
                  className="w-full p-3 bg-yellow-50/50 rounded-xl border border-yellow-200 hover:border-yellow-600 flex items-center justify-between text-left">
                  <div>
                    <h4 className="font-bold text-xs text-yellow-600">EDAHAB</h4>
                    <p className="text-[10px] text-slate-400">Somtel Mobile Money</p>
                  </div>
                  <span className="text-yellow-600 text-xs">➔</span>
                </button>
              </div>
            )}

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

            {vipStep === 3 && (
              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-700 font-semibold">3. Wac lambarkan si aad u bixiso:</p>
                <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
                  <span className="text-[10px] text-slate-500">Koodhka Bixinta ({paymentMethod}):</span>
                  <div className="text-lg font-black text-blue-700 my-1">
                    *712*615456085*{planPrice}#
                  </div>
                  <a 
                    href={`tel:*712*615456085*${planPrice}%23`}
                    className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl shadow-md mt-1">
                    📞 Wac Hadda
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/252615456085?text=Asc%20Aveena%20Media%20VIP"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-4 z-40 bg-green-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center text-lg">
        💬
      </a>

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
