import React, { useState, useEffect } from 'react';

// Xogta Supabase Database-kaaga
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
  const [activeNav, setActiveNav] = useState('Home'); // Home | Movies | Series | Kartoonno | Shorts | VIP
  const [currentView, setCurrentView] = useState('browse'); // browse | watch | admin

  const [selectedMovie, setSelectedMovie] = useState(null);

  // User & Admin Auth
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aveena_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'verify'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Verification OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [tempUser, setTempUser] = useState(null);

  // Modals
  const [showVipModal, setShowVipModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [vipStep, setVipStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('HORMUUD');
  const [planPrice, setPlanPrice] = useState('3');

  // Admin Form Fields (Wax walba oo aad codsatay)
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Series'); // Movies | Series | Kartoonno | Shorts
  const [formEpisode, setFormEpisode] = useState(''); // Episode (tusaale: EP1)
  const [formDuration, setFormDuration] = useState(''); // Daqiiqado (tusaale: 28m)
  const [formPoster, setFormPoster] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formIsVip, setFormIsVip] = useState(false);

  // MATOORKA BEDDELA YOUTUBE SHORTS & FEMBED (100% SHARCI AH)
  const formatVideoUrl = (url) => {
    if (!url) return '';
    let clean = url.trim();

    // Haddii iframe lasoo dhejiyay
    if (clean.includes('<iframe')) {
      const match = clean.match(/src=["'](.*?)["']/);
      if (match) clean = match[1];
    }

    // 1. YouTube Shorts Fix: /shorts/ID -> /embed/ID
    if (clean.includes('/shorts/')) {
      const parts = clean.split('/shorts/')[1];
      const videoId = parts.split(/[?&/]/)[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`;
    }

    // 2. YouTube Caadiga ah: watch?v=ID -> /embed/ID
    if (clean.includes('watch?v=')) {
      const videoId = clean.split('watch?v=')[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // 3. youtu.be/ID -> /embed/ID
    if (clean.includes('youtu.be/')) {
      const videoId = clean.split('youtu.be/')[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return clean;
  };

  // KASOO QAAD SUPABASE
  const loadSupabaseData = async () => {
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
    loadSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem('aveena_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // LOGIN & REGISTER IYO VERIFICATION CODE FLOW
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    // Admin Login
    if (authEmail.trim().toLowerCase() === 'admin@aveena.com' && authPassword === 'admin123') {
      const admin = { name: 'Admin', email: authEmail, role: 'admin' };
      setCurrentUser(admin);
      setShowLoginModal(false);
      setCurrentView('admin');
      resetAuth();
      return;
    }

    // Is-diiwaangelin (Register -> Generate Code)
    if (authMode === 'register') {
      if (!authName || !authEmail || !authPassword) {
        setAuthError('Fadlan buuxi dhammaan meelaha bannaan.');
        return;
      }
      // Samee 4-digit code (Koodh 4 god ah)
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setTempUser({ name: authName, email: authEmail });
      setAuthMode('verify');
      alert(`Koodhkaaga xaqiijinta koontada waa: ${code}`);
      return;
    }

    // Verify Code (Geli Koodhkii)
    if (authMode === 'verify') {
      if (userOtpInput.trim() === generatedOtp) {
        setCurrentUser(tempUser);
        setShowLoginModal(false);
        resetAuth();
        alert('Hambalyo! Koontadaada si guul leh ayaa loo xaqiijiyay.');
      } else {
        setAuthError('Koodhka aad galisay waa khalad!');
      }
      return;
    }

    // Login Caadi ah
    if (authEmail && authPassword) {
      const user = { name: authEmail.split('@')[0], email: authEmail, role: 'user' };
      setCurrentUser(user);
      setShowLoginModal(false);
      resetAuth();
    } else {
      setAuthError('Geli email iyo password sax ah');
    }
  };

  const resetAuth = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setUserOtpInput('');
    setAuthError('');
    setAuthMode('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('browse');
    localStorage.removeItem('aveena_user');
  };

  // ADMIN: SAVE TO SUPABASE
  const handleSaveToDatabase = async (e) => {
    e.preventDefault();
    if (!formTitle || !formVideoUrl) {
      alert('Geli ugu yaraan Cinwaanka iyo Link-ga video-ga');
      return;
    }

    const cleanedUrl = formatVideoUrl(formVideoUrl);

    // Cinwaanka buuxa oo wata Episode-ka
    const fullTitle = formEpisode ? `${formTitle} - ${formEpisode}` : formTitle;

    const payload = {
      title: fullTitle,
      year: formType, // Movies | Series | Kartoonno | Shorts
      rating: formDuration || "25m", // Daqiiqadaha
      is_vip: formIsVip,
      image: formPoster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
      description: formDesc || "Video cusub oo AVEENA MEDIA.",
      video_url: cleanedUrl
    };

    if (editingId) {
      await fetch(`${SUPABASE_URL}/rest/v1/movies?id=eq.${editingId}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify(payload)
      });
      alert('Si guul leh ayaa loo cusboonaysiiyay!');
      setEditingId(null);
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/movies`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(payload)
      });
      alert('Video-ga si toos ah ayaa loogu daray Database-ka!');
    }

    setFormTitle('');
    setFormEpisode('');
    setFormDuration('');
    setFormPoster('');
    setFormVideoUrl('');
    setFormDesc('');
    setFormIsVip(false);
    loadSupabaseData();
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setFormTitle(m.title);
    setFormType(m.year || 'Series');
    setFormDuration(m.rating || '');
    setFormPoster(m.image || '');
    setFormVideoUrl(m.video_url || '');
    setFormDesc(m.description || '');
    setFormIsVip(m.is_vip || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('Ma hubtaa inaad tirtirto video-gan?')) {
      await fetch(`${SUPABASE_URL}/rest/v1/movies?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
      });
      loadSupabaseData();
    }
  };

  const openMovie = (movie) => {
    setSelectedMovie(movie);
    setCurrentView('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Videos by Category
  const getFilteredVideos = () => {
    if (activeNav === 'Home') return movies.filter(m => m.year !== 'Shorts');
    if (activeNav === 'Movies') return movies.filter(m => m.year === 'Movies');
    if (activeNav === 'Series') return movies.filter(m => m.year === 'Series');
    if (activeNav === 'Kartoonno') return movies.filter(m => m.year === 'Kartoonno');
    if (activeNav === 'Shorts') return movies.filter(m => m.year === 'Shorts');
    return movies;
  };

  const filteredList = getFilteredVideos();

  return (
    <div className="min-h-screen bg-[#0a122c] text-white font-sans pb-28 select-none">
      
      {/* 1. TOP HEADER (CLEAN NAVY BLUE) */}
      <header className="sticky top-0 z-40 bg-[#0d183a]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-blue-900/40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveNav('Home'); setCurrentView('browse'); }}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-600/40">
            A
          </div>
          <div>
            <h1 className="text-base font-black tracking-wide text-white leading-none">AVEENA</h1>
            <span className="text-[9px] tracking-widest text-blue-400 font-bold block mt-0.5">MEDIA</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setCurrentView(currentView === 'admin' ? 'browse' : 'admin')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow">
              Panel
            </button>
          )}

          <button 
            onClick={() => { setVipStep(1); setShowVipModal(true); }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow">
            VIP
          </button>

          {currentUser ? (
            <button 
              onClick={handleLogout}
              className="text-xs bg-[#12214d] text-slate-300 font-semibold px-2.5 py-1.5 rounded-xl border border-blue-900/50">
              Ka bax
            </button>
          ) : (
            <button 
              onClick={() => { setAuthMode('login'); setShowLoginModal(true); }}
              className="text-xs bg-[#12214d] text-blue-400 font-bold px-3 py-1.5 rounded-xl border border-blue-900/50">
              Gal
            </button>
          )}
        </div>
      </header>

      {/* 2. MAIN VIEWS */}

      {/* A. ADMIN VIEW */}
      {currentView === 'admin' && currentUser?.role === 'admin' ? (
        <div className="max-w-xl mx-auto p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-blue-400">Maamulka Database-ka</h2>
            <button onClick={() => setCurrentView('browse')} className="text-xs text-blue-400 font-bold">← Bogga Hore</button>
          </div>

          <div className="bg-[#101c42] p-5 rounded-2xl border border-blue-900/50 mb-6 shadow-xl">
            <h3 className="font-bold text-xs text-white mb-3">
              {editingId ? 'Wax ka beddel Video-ga' : 'Ku dar Video / Musalsal Cusub'}
            </h3>
            
            <form onSubmit={handleSaveToDatabase} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Cinwaanka Dramada / Filimka</label>
                <input 
                  type="text" 
                  value={formTitle} 
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Cinwaanka..."
                  className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                  required
                />
              </div>

              {/* Nooca (Category) - Waxaa ku jira Kartoonno */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Nooca (Category)</label>
                <select 
                  value={formType} 
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white">
                  <option value="Series">Series (Musalsal)</option>
                  <option value="Movies">Movies (Filimaan)</option>
                  <option value="Kartoonno">Kartoonno (Cartoons)</option>
                  <option value="Shorts">Shorts (TikTok Style)</option>
                </select>
              </div>

              {/* Qaybta Xalqadda iyo Daqiiqadaha */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Xalqadda (Episode)</label>
                  <input 
                    type="text" 
                    value={formEpisode} 
                    onChange={(e) => setFormEpisode(e.target.value)}
                    placeholder="tusaale: EP 1 ama Qaybta 1"
                    className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Daqiiqadaha (Duration)</label>
                  <input 
                    type="text" 
                    value={formDuration} 
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="tusaale: 28m ama 1h 45m"
                    className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Link-ga Video-ga (Fembed / YouTube Shorts / YouTube)</label>
                <input 
                  type="text" 
                  value={formVideoUrl} 
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Link-ga Sawirka Poster-ka</label>
                <input 
                  type="text" 
                  value={formPoster} 
                  onChange={(e) => setFormPoster(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Faahfaahin</label>
                <textarea 
                  value={formDesc} 
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Sheekada kooban..."
                  className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="vipCk" 
                  checked={formIsVip} 
                  onChange={(e) => setFormIsVip(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="vipCk" className="text-xs text-slate-300 font-medium">Kaliya VIP miyaa?</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
                  {editingId ? 'Keydi Isbeddelka' : 'Daabac Video-ga'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 bg-slate-800 text-white font-bold rounded-xl text-xs">
                    Ka noqo
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List in Database */}
          <div className="bg-[#101c42] p-4 rounded-2xl border border-blue-900/50">
            <h3 className="font-bold text-xs text-white mb-3">Videos-ka Database-ka ku jira ({movies.length})</h3>
            <div className="space-y-2">
              {movies.map(m => (
                <div key={m.id} className="flex justify-between items-center p-2.5 bg-[#0a122c] rounded-xl border border-blue-900/30">
                  <div className="flex items-center gap-2.5">
                    <img src={m.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[140px]">{m.title}</h4>
                      <span className="text-[10px] text-blue-400">{m.year} • {m.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(m)} className="text-blue-400 bg-blue-950 px-2 py-1 rounded text-xs">✏️</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-400 bg-red-950 px-2 py-1 rounded text-xs">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeNav === 'Shorts' ? (
        /* B. TIKTOK STYLE SHORTS (TOOS U SHAQAYNAYA) */
        <div className="max-w-md mx-auto h-[calc(100vh-140px)] overflow-y-scroll snap-y snap-mandatory scrollbar-none p-2">
          {filteredList.length === 0 ? (
            <div className="text-center py-24 text-xs text-slate-400">
              Weli wax Shorts ah laguma darin. Gal Admin si aad YouTube Shorts ugu darto!
            </div>
          ) : (
            filteredList.map((item) => (
              <div 
                key={item.id} 
                className="relative w-full h-full snap-start rounded-3xl overflow-hidden bg-black border border-blue-900/40 mb-4 shadow-2xl flex flex-col justify-between">
                
                {/* Embed Video */}
                <iframe
                  src={item.video_url}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Short"
                />

                <div className="absolute bottom-4 left-4 right-16 z-10 pointer-events-none">
                  <h3 className="font-bold text-sm text-white drop-shadow-md">@{item.title}</h3>
                  <p className="text-xs text-slate-300 drop-shadow-md line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4 z-10">
                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-lg text-white">
                    ❤️
                  </button>
                  <button 
                    onClick={() => setShowWhatsAppModal(true)}
                    className="w-10 h-10 rounded-full bg-emerald-500/80 backdrop-blur flex items-center justify-center text-lg text-white">
                    💬
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : currentView === 'browse' ? (
        /* C. BROWSE MOVIES / SERIES / KARTOONNO */
        <main className="p-4">
          {/* Section Title */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-white">
              {activeNav === 'Home' ? 'Dhammaan Videos-ka' : activeNav}
            </h3>
            <span className="text-xs text-blue-400 font-bold">{filteredList.length} Videos</span>
          </div>

          {/* Videos Grid */}
          {filteredList.length === 0 ? (
            <div className="text-center py-20 bg-[#101c42]/40 rounded-2xl border border-blue-900/30 text-xs text-slate-400">
              Weli wax video ah kuma jiraan qaybta <b>{activeNav}</b>.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredList.map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => openMovie(movie)}
                  className="bg-[#101c42] rounded-2xl overflow-hidden border border-blue-900/40 shadow hover:border-blue-500 transition cursor-pointer">
                  
                  <div className="relative aspect-[3/4] w-full bg-[#0a122c]">
                    <img src={movie.image} alt="" className="w-full h-full object-cover" />
                    {movie.is_vip && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                        VIP
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/70 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
                      {movie.rating || '25m'}
                    </span>
                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow">
                      ▶
                    </div>
                  </div>

                  <div className="p-2.5">
                    <h4 className="font-bold text-xs text-white truncate">{movie.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{movie.year}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        /* D. WATCH / PLAYER VIEW */
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
          <button 
            onClick={() => setCurrentView('browse')}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mb-3 font-bold">
            ← Ku noqo Liiska
          </button>

          <div className="relative w-full pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-blue-900/50">
            <iframe
              src={selectedMovie?.video_url}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Player"
            />
          </div>

          <div className="mt-4 p-4 bg-[#101c42] rounded-2xl border border-blue-900/40">
            <h2 className="text-lg font-black text-white">{selectedMovie?.title}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="text-blue-400 font-bold">{selectedMovie?.year}</span>
              <span>•</span>
              <span>{selectedMovie?.rating}</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">{selectedMovie?.description}</p>
          </div>
        </div>
      )}

      {/* 3. LOGIN & VERIFICATION OTP MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101c42] border border-blue-900/60 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>

            <h3 className="text-base font-black text-white text-center mb-1">
              {authMode === 'login' ? 'Gal Koontadaada' : authMode === 'register' ? 'Is-diiwaangeli' : 'Xaqiijinta Koodhka'}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-4">
              {authMode === 'verify' ? 'Geli koodhkii 4-ta god ahaa ee laguu soo diray' : 'Ku biir Aveena Media'}
            </p>

            {authError && <div className="p-2 bg-red-950/60 border border-red-800 text-red-400 text-xs rounded-xl text-center mb-3">{authError}</div>}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300">Magacaaga</label>
                  <input 
                    type="text" 
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                    required
                  />
                </div>
              )}

              {authMode !== 'verify' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Email</label>
                    <input 
                      type="email" 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <input 
                      type="password" 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-[#0a122c] border border-blue-900/60 rounded-xl text-xs text-white"
                      required
                    />
                  </div>
                </>
              )}

              {/* OTP Input Field */}
              {authMode === 'verify' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300">Koodhka Xaqiijinta (4 Digits)</label>
                  <input 
                    type="text" 
                    maxLength="4"
                    value={userOtpInput}
                    onChange={(e) => setUserOtpInput(e.target.value)}
                    placeholder="1234"
                    className="w-full mt-1 p-3 text-center tracking-widest text-lg font-bold bg-[#0a122c] border border-blue-500 rounded-xl text-white"
                    required
                  />
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md mt-2">
                {authMode === 'login' ? 'Gal' : authMode === 'register' ? 'Dir Koodhka Xaqiijinta' : 'Xaqiiji Koontada'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-blue-900/40 text-center">
              {authMode === 'login' ? (
                <p className="text-xs text-slate-400">
                  Koonto ma lihid? <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-blue-400 font-bold hover:underline">Is-diiwaangeli</button>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Hore ma u lahayd koonto? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-blue-400 font-bold hover:underline">Gal halkan</button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. VIP MODAL (OFFICIAL LOGOS, HADDA DIR + WHATSAPP) */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101c42] border border-blue-900/60 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowVipModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>

            <h3 className="text-base font-black text-center text-blue-400 mb-1">Dooro Qorshaha VIP</h3>
            <p className="text-[11px] text-slate-400 text-center mb-4">Daawo dhammaan filimada adoon xayeysiis lahayn</p>

            {vipStep === 1 && (
              <div className="space-y-3">
                <button 
                  onClick={() => { setPaymentMethod('HORMUUD'); setVipStep(2); }}
                  className="w-full p-3.5 bg-[#0a122c] rounded-2xl border border-emerald-500/40 flex items-center justify-between text-left transition">
                  <div>
                    <h4 className="font-bold text-xs text-emerald-400">EVC PLUS (Hormuud)</h4>
                    <p className="text-[11px] font-black text-white">77 179 5014</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-sm">➔</span>
                </button>

                <button 
                  onClick={() => { setPaymentMethod('SOMTEL'); setVipStep(2); }}
                  className="w-full p-3.5 bg-[#0a122c] rounded-2xl border border-amber-500/40 flex items-center justify-between text-left transition">
                  <div>
                    <h4 className="font-bold text-xs text-amber-400">eDAHAB (Somtel)</h4>
                    <p className="text-[11px] font-black text-white">61 545 6085</p>
                  </div>
                  <span className="text-amber-400 font-bold text-sm">➔</span>
                </button>
              </div>
            )}

            {vipStep === 2 && (
              <div className="space-y-2.5">
                {[
                  { price: '1', period: '1 Bil' },
                  { price: '3', period: '3 Bil' },
                  { price: '12', period: '1 Sano' }
                ].map((plan) => (
                  <div 
                    key={plan.price}
                    onClick={() => { setPlanPrice(plan.price); setVipStep(3); }}
                    className="p-3 bg-[#0a122c] rounded-2xl border border-blue-900/60 cursor-pointer flex justify-between items-center">
                    <span className="font-bold text-xs text-white">${plan.price} /{plan.period}</span>
                    <span className="text-blue-400 text-xs font-bold">Dooro ➔</span>
                  </div>
                ))}
              </div>
            )}

            {vipStep === 3 && (
              <div className="space-y-3 pt-1">
                <div className="p-3.5 bg-[#0a122c] rounded-xl border border-blue-900/50">
                  <p className="text-xs font-bold text-blue-400">Lacagta: ${planPrice}</p>
                  <p className="text-xs text-slate-300">Ku dir: {paymentMethod === 'HORMUUD' ? '771795014' : '615456085'}</p>
                </div>

                <a 
                  href={`tel:*712*${paymentMethod === 'HORMUUD' ? '771795014' : '615456085'}*${planPrice}%23`}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1 shadow">
                  <span>💸</span> Hadda Dir
                </a>

                <button 
                  onClick={() => { setShowVipModal(false); setShowWhatsAppModal(true); }}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1 shadow">
                  <span>💬</span> WhatsApp Kala Xiriir
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. WHATSAPP MODAL (3 LAMBAR) */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101c42] border border-blue-900/60 w-full max-w-sm rounded-3xl p-5 relative shadow-2xl">
            <button onClick={() => setShowWhatsAppModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>

            <h3 className="text-sm font-black text-white text-center mb-3">Nagala Soo Xiriir WhatsApp</h3>
            <div className="space-y-2">
              {WHATSAPP_NUMBERS.map((item, index) => (
                <a 
                  key={index}
                  href={`https://wa.me/${item.number}?text=Asc%20Aveena%20Media%20VIP`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-[#0a122c] hover:bg-[#080e24] border border-blue-900/40 rounded-xl flex items-center justify-between transition">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.label}</h4>
                    <p className="text-[11px] font-black text-emerald-400">{item.display}</p>
                  </div>
                  <span className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-lg font-bold">Fur ➔</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. BOTTOM NAVIGATION (PLAiN TEXT: HOME, MOVIES, SERIES, KARTOONNO, SHORTS, VIP) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0d183a]/95 backdrop-blur-md border-t border-blue-900/40 py-3 flex justify-around items-center text-[10px] text-slate-400 font-bold">
        <button 
          onClick={() => { setActiveNav('Home'); setCurrentView('browse'); }}
          className={`${activeNav === 'Home' && currentView === 'browse' ? 'text-blue-400' : 'hover:text-white'}`}>
          Home
        </button>

        <button 
          onClick={() => { setActiveNav('Movies'); setCurrentView('browse'); }}
          className={`${activeNav === 'Movies' && currentView === 'browse' ? 'text-blue-400' : 'hover:text-white'}`}>
          Movies
        </button>

        <button 
          onClick={() => { setActiveNav('Series'); setCurrentView('browse'); }}
          className={`${activeNav === 'Series' && currentView === 'browse' ? 'text-blue-400' : 'hover:text-white'}`}>
          Series
        </button>

        <button 
          onClick={() => { setActiveNav('Kartoonno'); setCurrentView('browse'); }}
          className={`${activeNav === 'Kartoonno' && currentView === 'browse' ? 'text-blue-400' : 'hover:text-white'}`}>
          Kartoonno
        </button>

        <button 
          onClick={() => { setActiveNav('Shorts'); setCurrentView('browse'); }}
          className={`${activeNav === 'Shorts' ? 'text-blue-400' : 'hover:text-white'}`}>
          Shorts
        </button>

        <button 
          onClick={() => { setVipStep(1); setShowVipModal(true); }}
          className="text-blue-400 font-black">
          VIP
        </button>
      </nav>

    </div>
  );
                    }
