import React, { useState, useEffect } from 'react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [goal, setGoal] = useState(null); // 'perte' ou 'prise'
  const [activeTab, setActiveTab] = useState('sport'); // 'sport' ou 'nutrition'
  
  // Chronomètre
  const [timeLeft, setTimeLeft] = useState(30);
  const [isChronoActive, setIsChronoActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Sauvegardes
  const [email, setEmail] = useState(() => localStorage.getItem('defi_email') || '');
  const [inputEmail, setInputEmail] = useState('');
  const [currentDay, setCurrentDay] = useState(() => Number(localStorage.getItem('defi_day')) || 1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [calories, setCalories] = useState(() => Number(localStorage.getItem('defi_calories')) || 0);
  const [unlockedBadges, setUnlockedBadges] = useState(() => JSON.parse(localStorage.getItem('defi_badges')) || ["🟢 Recrue"]);
  const [hasPaid, setHasPaid] = useState(() => localStorage.getItem('defi_has_paid') === 'true');

  useEffect(() => {
    localStorage.setItem('defi_day', currentDay);
    localStorage.setItem('defi_calories', calories);
    localStorage.setItem('defi_badges', JSON.stringify(unlockedBadges));
    localStorage.setItem('defi_email', email);
    localStorage.setItem('defi_has_paid', hasPaid);
  }, [currentDay, calories, unlockedBadges, email, hasPaid]);

  useEffect(() => {
    let interval = null;
    if (isChronoActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isChronoActive) {
      setIsChronoActive(false);
      handleNextExercise();
    }
    return () => clearInterval(interval);
  }, [isChronoActive, timeLeft]);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const paypalLink = "https://paypal.me/JubaBelkacemi/4.99";

  const handleStartFreeTrial = (e) => {
    e.preventDefault();
    if (!inputEmail.includes('@')) return alert("Email invalide.");
    setEmail(inputEmail);
    setSelectedDay(currentDay);
    navigateTo('/programme-secret');
  };

  const handleExerciseDone = () => {
    setTimeLeft(30);
    setIsChronoActive(true);
  };

  const handleNextExercise = () => {
    setIsChronoActive(false);
    setCurrentExerciseIndex(prev => prev + 1);
  };

  const handleDayValidation = () => {
    const program = get60DaysData(currentDay, goal);
    setCalories(prev => prev + program.estimatedCalories);
    
    let updatedBadges = [...unlockedBadges];
    const nextDay = currentDay + 1;
    
    if (nextDay >= 7 && !updatedBadges.includes("🥉 Déterminé")) updatedBadges.push("🥉 Déterminé");
    if (nextDay >= 15 && !updatedBadges.includes("🥈 Machine")) updatedBadges.push("🥈 Machine");
    if (nextDay >= 30 && !updatedBadges.includes("🥇 Athlète")) updatedBadges.push("🥇 Athlète");
    if (nextDay >= 45 && !updatedBadges.includes("🔥 Inarrêtable")) updatedBadges.push("🔥 Inarrêtable");
    if (nextDay >= 60 && !updatedBadges.includes("👑 Légende")) updatedBadges.push("👑 Légende");
    
    setUnlockedBadges(updatedBadges);
    setCurrentDay(nextDay);
    setSelectedDay(nextDay);
    setCurrentExerciseIndex(0);
    setIsChronoActive(false);
    
    alert(`🎉 Journée validée ! +${program.estimatedCalories} kcal brûlées !`);
  };

  // --- ALGORITHME DE GÉNÉRATION DES 60 JOURS UNIQUES ---
  const get60DaysData = (day, objective) => {
    // Calcul progressif du nombre d'exercices : Jour 1 = 10, Jour 60 = 22
    const exerciseCount = Math.min(22, 10 + Math.floor((day - 1) * 0.21));
    const estimatedCalories = 300 + (exerciseCount * 15) + (day * 2);

    // Listes de composants pour varier chaque jour
    const movementsSport = [
      ["Squats classiques", "20 réps"], ["Pompes au sol", "12 réps"], ["Dips sur chaise", "12 réps"],
      ["Gainage Planche", "45 sec"], ["Mountain Climbers", "40 sec"], ["Fentes alternées", "14 réps"],
      ["Abdos Bicyclette", "20 réps"], ["Relevés de bassin", "15 réps"], ["Jumping Jacks", "1 min"],
      ["Superman (Lombaires)", "15 réps"], ["Burpees (Sans saut)", "8 réps"], ["Squats Jumps", "10 réps"],
      ["Pompes Diamant", "8 réps"], ["Gainage Militaire", "45 sec"], ["Crunchs inversés", "15 réps"],
      ["Fentes bulgares", "10 réps/jambe"], ["Rowing table", "10 réps"], ["Extensions mollets", "25 réps"],
      ["Planche latérale", "30 sec/côté"], ["Commandos abdos", "12 réps"], ["Talons-fesses", "1 min"],
      ["Sauts groupés", "8 réps"], ["Pompes surélevées", "15 réps"], ["Gainage Spider", "12 réps"]
    ];

    const matins = ["Omelette légumes + Thé", "Fromage blanc, amandes + Pomme", "Pancakes avoine maison + Miel", "Œufs brouillés, avocat + Café", "Bol de chia au lait de coco + Banane"];
    const midisPerte = ["Poulet émincé, haricots verts, huile d'olive", "Pavé de saumon grillé et asperges", "Salade thon, œufs durs, concombre", "Crevettes sautées, brocolis au sésame", "Emincé de dinde et purée de courgettes"];
    const midisPrise = ["Steak haché 5%, 150g de riz basmati, avocat", "Filet de saumon, 180g de quinoa, brocolis", "Escalope de dinde, pâtes complètes, parmesan", "Riz sauté aux œufs, poulet grillé, petits pois", "Bœuf braisé, purée de patates douces, noix"];
    const soirsPerte = ["Soupe de légumes et blancs de poulet", "Cabillaud vapeur, épinards frais", "Omelette 3 blancs d'œufs, champignons", "Salade verte au saumon fumé", "Wok de tofu et poivrons croquants"];
    const soirsPrise = ["Colin à la vapeur, 120g de riz, courgettes", "Filet de poulet, lentilles cuisinées, huile de lin", "Omelette complète, 3 tranches de pain de seigle", "Thon au naturel, pommes de terre vapeur", "Pavé de dinde, boulgour aux herbes"];
    const mentals = ["💧 Bois 2.5L d'eau aujourd'hui.", "📱 Pas d'écran 1h avant le coucher.", "🚶‍♂️ Fais 15 min de marche après manger.", "🧘 5 min de respiration profonde calme.", "💤 Va te coucher avant 22h30 ce soir."];

    // Génération pseudo-aléatoire basée sur le numéro du jour pour être toujours unique mais fixe
    let exercises = [];
    for (let i = 0; i < exerciseCount; i++) {
      const moveIndex = (day + i * 3) % movementsSport.length;
      exercises.push(movementsSport[moveIndex]);
    }

    const mIdx = day % matins.length;
    const lIdx = day % midisPerte.length;
    const dIdx = day % soirsPerte.length;
    const bIdx = day % mentals.length;

    const midiSelected = objective === 'perte' ? midisPerte[lIdx] : midisPrise[lIdx];
    const soirSelected = objective === 'perte' ? soirsPerte[dIdx] : soirsPrise[dIdx];
    const menuHTML = `🥞 Matin : ${matins[mIdx]} | ☀️ Midi : ${midiSelected} | 🌙 Soir : ${soirSelected}`;

    return { menu: menuHTML, exercises, bonus: mentals[bIdx], estimatedCalories };
  };

  // --- ESPACE MEMBRE ---
  if (currentPath === '/programme-secret') {
    if (!email) {
      return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>
          <h2>🔒 Inscription requise</h2>
          <button onClick={() => navigateTo('/')} className="paypal-btn" style={{ background: '#003087', color: 'white', marginTop: '15px' }}>Retour à l'accueil</button>
        </div>
      );
    }

    const isDayLocked = selectedDay > 7 && !hasPaid;
    const program = goal ? get60DaysData(selectedDay, goal) : null;

    return (
      <div className="container">
        {/* BARRE 60 JOURS */}
        <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>📅 Calendrier interactif (60 Jours uniques) :</p>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
            {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
              const isLocked = dayNum > 7 && !hasPaid;
              const isCurrent = dayNum === currentDay;
              const isSelected = dayNum === selectedDay;
              return (
                <button
                  key={dayNum}
                  onClick={() => { setSelectedDay(dayNum); setCurrentExerciseIndex(0); setIsChronoActive(false); }}
                  style={{
                    padding: '8px 14px', borderRadius: '8px',
                    border: isSelected ? '2px solid #003087' : '1px solid #cbd5e1',
                    background: isLocked ? '#f1f5f9' : isCurrent ? '#10b981' : isSelected ? '#eff6ff' : '#ffffff',
                    color: isLocked ? '#94a3b8' : isCurrent || isSelected ? '#003087' : '#0f172a',
                    fontWeight: isCurrent || isSelected ? 'bold' : 'normal', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  {isLocked ? `🔒 J${dayNum}` : `Jour ${dayNum}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* METRICS */}
        <section className="hero-card" style={{ background: '#0f172a', color: 'white', textAlign: 'left', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🔥 Calories Brûlées</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f43f5e' }}>{calories} kcal</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🏆 Niveau actuel</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>Jour {currentDay}/60</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid #334155', paddingTop: '10px' }}>
            {unlockedBadges.map((b, idx) => <span key={idx} style={{ background: '#1e293b', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem' }}>{b}</span>)}
          </div>
        </section>

        {isDayLocked ? (
          <section className="hero-card" style={{ border: '2px solid #ffc439', background: '#fffbeb' }}>
            <h2 style={{ color: '#b45309' }}>🔒 Fin de l'essai gratuit (Jour 7 validé !)</h2>
            <p style={{ margin: '15px 0', color: '#78350f', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Tu as tenu bon pendant 7 jours ! C'est maintenant que la vraie transformation commence. Débloque le reste des 60 jours pour augmenter les exercices (jusqu'à 22 mouvements intenses !) et obtenir de nouveaux menus pour seulement 4,99 €.
            </p>
            <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="paypal-btn" style={{ fontSize: '1.1rem' }}>💛 Débloquer les 53 Jours restants</a>
            <button onClick={() => setHasPaid(true)} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.7rem' }}>[Simuler Paiement]</button>
          </section>
        ) : !goal ? (
          <section className="hero-card">
            <h2>🎯 Objectif pour le Jour {selectedDay}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setGoal('perte')} className="paypal-btn" style={{ background: '#ef4444', color: 'white' }}>🔥 Perdre du gras & Sécher</button>
              <button onClick={() => setGoal('prise')} className="paypal-btn" style={{ background: '#2563eb', color: 'white' }}>💪 Prendre de la masse</button>
            </div>
          </section>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => setActiveTab('sport')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'sport' ? '#003087' : '#cbd5e1', color: activeTab === 'sport' ? 'white' : '#0f172a', cursor: 'pointer' }}>🏋️‍♂️ Entraînement ({program.exercises.length} Exos)</button>
              <button onClick={() => setActiveTab('nutrition')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'nutrition' ? '#003087' : '#cbd5e1', color: activeTab === 'nutrition' ? 'white' : '#0f172a', cursor: 'pointer' }}>🍏 Nutrition</button>
            </div>

            {activeTab === 'nutrition' ? (
              <section className="hero-card" style={{ textAlign: 'left' }}>
                <h3 style={{ color: '#003087', marginBottom: '10px' }}>🍏 Menu du Jour {selectedDay}</h3>
                <p style={{ lineHeight: '1.6', color: '#334155', background: '#f8fafc', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>{program.menu}</p>
                <button onClick={() => setGoal(null)} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}>Changer d'objectif</button>
              </section>
            ) : (
              <section className="hero-card" style={{ textAlign: 'left' }}>
                {currentExerciseIndex < program.exercises.length ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', marginBottom: '10px' }}>
                      <span>📋 EXERCICE {currentExerciseIndex + 1} SUR {program.exercises.length}</span>
                      <button onClick={() => setGoal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Modifier profil</button>
                    </div>

                    <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '5px' }}>{program.exercises[currentExerciseIndex][0]}</h2>
                    <p style={{ fontSize: '1.1rem', color: '#2563eb', fontWeight: 'bold', marginBottom: '20px' }}>⏱️ Effort : {program.exercises[currentExerciseIndex][1]}</p>

                    {isChronoActive ? (
                      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
                        <p style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 'bold' }}>⏳ TEMPS DE REPOS</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d97706', margin: '5px 0' }}>{timeLeft}s</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                          <button onClick={() => setTimeLeft(prev => prev + 10)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d97706', background: 'white', color: '#d97706', cursor: 'pointer' }}>+10s</button>
                          <button onClick={() => setTimeLeft(prev => Math.max(0, prev - 10))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d97706', background: 'white', color: '#d97706', cursor: 'pointer' }}>-10s</button>
                        </div>
                        <button onClick={handleNextExercise} className="paypal-btn" style={{ background: '#d97706', color: 'white', fontSize: '0.9rem', width: 'auto', display: 'inline-block', padding: '8px 16px' }}>🚀 Je suis prêt (Suivant)</button>
                      </div>
                    ) : (
                      <button onClick={handleExerciseDone} className="paypal-btn" style={{ background: '#10b981', color: 'white', width: '100%' }}>
                        ✅ Exercice Fait
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#10b981', marginBottom: '10px' }}>🎉 Séance du Jour ${selectedDay} bouclée !</h3>
                    {selectedDay === currentDay ? (
                      <button onClick={handleDayValidation} className="paypal-btn" style={{ background: '#003087', color: 'white', width: '100%', fontSize: '1.2rem' }}>
                        🏆 Valider ma journée (+{program.estimatedCalories} kcal)
                      </button>
                    ) : (
                      <p style={{ color: '#059669', background: '#ecfdf5', padding: '10px', borderRadius: '8px' }}>Tu visionnes une journée passée ou future.</p>
                    )}
                  </div>
                )}

                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #22c55e', marginTop: '15px' }}>
                  <h5 style={{ color: '#166534', margin: 0 }}>🧠 Défi Mental :</h5>
                  <p style={{ color: '#14532d', fontSize: '0.85rem', marginTop: '4px' }}>{program.bonus}</p>
                </div>
              </section>
            )}
          </div>
        )}
        <button onClick={() => navigateTo('/')} style={{ background: 'none', border: 'none', color: '#003087', cursor: 'pointer', textDecoration: 'underline', display: 'block', width: '100%', textAlign: 'center', marginTop: '15px' }}>← Retour</button>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Défi 60 Jours</h1>
        <p className="subtitle">60 entraînements et menus 100% uniques. Difficulté croissante.</p>
      </header>
      <main className="main-content">
        <section className="hero-card">
          <h2>Commence l'aventure gratuitement 🚀</h2>
          <form onSubmit={handleStartFreeTrial} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <input 
              type="email" placeholder="Ton adresse e-mail..." required value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              style={{ padding: '15px 20px', borderRadius: '50px', border: '1px solid #cbd5e1', fontSize: '1rem', textAlign: 'center', outline: 'none' }}
            />
            <button type="submit" className="paypal-btn" style={{ background: '#10b981', color: 'white' }}>🟢 Rejoindre l'essai (7 jours gratuits)</button>
          </form>
          <ul className="features" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
            <li>📈 <strong>Difficulté évolutive :</strong> De 10 à 22 exercices par jour !</li>
            <li>🥗 <strong>Nutrition dynamique :</strong> Menus changeants sur 60 jours.</li>
            <li>⏱️ Chronomètre intelligent réglable pour tes temps morts.</li>
          </ul>
        </section>
        <div style={{ textAlign: 'center', marginTop: '25px', opacity: 0.4 }}>
          <button onClick={() => { setEmail('test@demo.com'); setCurrentDay(7); setSelectedDay(7); setHasPaid(false); navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>🔧 Mode Démo : Voir le mur de paiement (Jour 7)</button>
        </div>
      </main>
    </div>
  );
}

export default App;
