import React, { useState, useEffect } from 'react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [goal, setGoal] = useState(null); // 'perte' ou 'prise'
  const [activeTab, setActiveTab] = useState('sport'); // 'sport' ou 'nutrition'
  
  // Chronomètre et Exercices
  const [timeLeft, setTimeLeft] = useState(30);
  const [isChronoActive, setIsChronoActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // E-mail de session
  const [email, setEmail] = useState(() => localStorage.getItem('defi_current_email') || '');
  const [inputEmail, setInputEmail] = useState('');

  // États dynamiques liés à l'e-mail actif
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [calories, setCalories] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState(["🟢 Recrue"]);
  const [hasPaid, setHasPaid] = useState(false);

  // Charger les données de l'e-mail actif
  useEffect(() => {
    if (email) {
      const savedDay = localStorage.getItem(`${email}_day`);
      const savedCalories = localStorage.getItem(`${email}_calories`);
      const savedBadges = localStorage.getItem(`${email}_badges`);
      const savedPaid = localStorage.getItem(`${email}_has_paid`);

      setCurrentDay(savedDay ? Number(savedDay) : 1);
      setSelectedDay(savedDay ? Number(savedDay) : 1);
      setCalories(savedCalories ? Number(savedCalories) : 0);
      setUnlockedBadges(savedBadges ? JSON.parse(savedBadges) : ["🟢 Recrue"]);
      setHasPaid(savedPaid === 'true');
    }
  }, [email]);

  // Sauvegarder les données de l'e-mail actif
  useEffect(() => {
    if (email) {
      localStorage.setItem('defi_current_email', email);
      localStorage.setItem(`${email}_day`, currentDay);
      localStorage.setItem(`${email}_calories`, calories);
      localStorage.setItem(`${email}_badges`, JSON.stringify(unlockedBadges));
      localStorage.setItem(`${email}_has_paid`, hasPaid);
    }
  }, [currentDay, calories, unlockedBadges, email, hasPaid]);

  // Logique du Chronomètre
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
    const cleanEmail = inputEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) return alert("Veuillez entrer un e-mail valide.");
    setEmail(cleanEmail);
    navigateTo('/programme-secret');
  };

  const handleLogout = () => {
    localStorage.removeItem('defi_current_email');
    setEmail('');
    setInputEmail('');
    setGoal(null);
    navigateTo('/');
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
    
    alert(`🏆 Journée validée ! +${program.estimatedCalories} kcal ajoutées !`);
  };

  // --- BASE DE DONNÉES ET CARACTÉRISTIQUES PRÉCISES DES EXERCICES (Avec Simulation Visuelle CSS) ---
  const getExerciseDetails = (name) => {
    const details = {
      "Pompes classiques au sol": {
        desc: "Mains écartées à la largeur des épaules, coudes orientés à 45° vers l'arrière, corps parfaitement aligné des talons à la tête.",
        animationClass: "anim-pushup"
      },
      "Pompes Diamant serrées": {
        desc: "Mains serrées sous la poitrine formant un losange avec les pouces et les index. Cible en priorité les triceps et l'intérieur des pectoraux.",
        animationClass: "anim-pushup-diamond"
      },
      "Squats classiques": {
        desc: "Pieds largeur des épaules. Descends les fesses vers le bas et l'arrière en gardant le dos droit. Pousse sur les talons.",
        animationClass: "anim-squat"
      },
      "Squats Jumps": {
        desc: "Effectue un squat complet puis pousse de manière explosive pour décoller du sol. Amortis souplement sur l'avant du pied.",
        animationClass: "anim-squat-jump"
      },
      "Dips sur chaise (Triceps)": {
        desc: "Mains posées sur le bord d'un support, fesses dans le vide. Descends verticalement en fléchissant les coudes à 90°.",
        animationClass: "anim-dips"
      },
      "Gainage Planche abdominale": {
        desc: "En appui sur les avant-bras et la pointe des pieds. Rentre le nombril et contracte les fessiers pour protéger le bas du dos.",
        animationClass: "anim-plank"
      },
      "Gainage Militaire dynamique": {
        desc: "Passe de la position sur les avant-bras à la position sur les mains, une par une, en limitant le balancement des hanches.",
        animationClass: "anim-commando"
      },
      "Mountain Climbers rapides": {
        desc: "En position de pompe, ramène alternativement et à un rythme rapide tes genoux vers ta poitrine. Garde les fesses basses.",
        animationClass: "anim-climber"
      },
      "Fentes alternées (Cuisses)": {
        desc: "Fais un grand pas vers l'avant, descends le genou arrière à ras du sol pour former un angle de 90° sur la jambe avant.",
        animationClass: "anim-lunge"
      },
      "Fentes bulgares isolées": {
        desc: "Un pied posé en arrière sur une chaise, descends sur ta jambe avant de manière contrôlée pour cibler intensément les fessiers.",
        animationClass: "anim-bulgarian"
      },
      "Abdos Bicyclette": {
        desc: "Sur le dos, amène de façon fluide ton coude opposé vers le genou qui se plie pendant que l'autre jambe se tend.",
        animationClass: "anim-bicycle"
      },
      "Relevés de bassin (Glutes)": {
        desc: "Allongé sur le dos, pieds à plat près des fesses. Monte le bassin vers le ciel en serrant volontairement les fessiers en haut.",
        animationClass: "anim-bridge"
      },
      "Jumping Jacks cardio": {
        desc: "Saute en écartant simultanément les jambes et en joignant tes mains au-dessus de ta tête. Reviens en position droite.",
        animationClass: "anim-jacks"
      },
      "Superman (Lombaires)": {
        desc: "Allongé sur le ventre, décolle simultanément la poitrine et les cuisses du sol en serrant le haut et le bas de ton dos.",
        animationClass: "anim-superman"
      },
      "Burpees (Sans saut)": {
        desc: "Passe au sol en position de planche, ramène les pieds près des mains d'un coup sec, puis redresse-toi complètement.",
        animationClass: "anim-burpee"
      }
    };
    return details[name] || { desc: "Garde le corps gainé et effectue des répétitions lentes et contrôlées.", animationClass: "anim-generic" };
  };

  // --- ALGORITHME DE GÉNÉRATION DES 60 JOURS ---
  const get60DaysData = (day, objective) => {
    const exerciseCount = Math.min(22, 10 + Math.floor((day - 1) * 0.21));
    const estimatedCalories = 300 + (exerciseCount * 15) + (day * 2);

    const movementsSport = [
      ["Pompes classiques au sol", "12 réps (Largeur épaules)"], 
      ["Squats classiques", "20 réps (Pieds parallèles)"], 
      ["Dips sur chaise (Triceps)", "12 réps (Coudes serrés)"],
      ["Gainage Planche abdominale", "45 sec (Abdos verrouillés)"], 
      ["Mountain Climbers rapides", "40 sec (Rythme soutenu)"], 
      ["Fentes alternées (Cuisses)", "14 réps (Grand pas)"],
      ["Abdos Bicyclette", "20 réps (Contrôle total)"], 
      ["Relevés de bassin (Glutes)", "15 réps (Contraction en haut)"], 
      ["Jumping Jacks cardio", "1 min (Synchro bras/jambes)"],
      ["Superman (Lombaires)", "15 réps (Extension dorsale)"], 
      ["Burpees (Sans saut)", "8 réps (Gainage actif)"], 
      ["Squats Jumps", "10 réps (Impulsion maximale)"],
      ["Pompes Diamant serrées", "8 réps (Mains jointes)"], 
      ["Gainage Militaire dynamique", "45 sec (Bras alternés)"], 
      ["Fentes bulgares isolées", "10 réps / jambe"]
    ];

    const matins = ["Omelette légumes + Thé", "Fromage blanc, amandes + Pomme", "Pancakes avoine maison + Miel", "Œufs brouillés, avocat + Café", "Bol de chia au lait de coco + Banane"];
    const midisPerte = ["Poulet émincé, haricots verts, huile d'olive", "Pavé de saumon grillé et asperges", "Salade thon, œufs durs, concombre"];
    const midisPrise = ["Steak haché 5%, 150g de riz basmati, avocat", "Filet de saumon, 180g de quinoa, brocolis", "Escalope de dinde, pâtes complètes, parmesan"];
    const soirsPerte = ["Soupe de légumes et blancs de poulet", "Cabillaud vapeur, épinards frais", "Omelette 3 blancs d'œufs"];
    const soirsPrise = ["Colin à la vapeur, 120g de riz, courgettes", "Filet de poulet, lentilles, huile de lin", "Omelette complète, 3 tranches de pain de seigle"];
    const mentals = ["💧 Bois 2.5L d'eau aujourd'hui.", "📱 Pas d'écran 1h avant le coucher.", "🚶‍♂️ Fais 15 min de marche après manger.", "🧘 5 min de respiration profonde calme."];

    let exercises = [];
    for (let i = 0; i < exerciseCount; i++) {
      const moveIndex = (day + i * 3) % movementsSport.length;
      exercises.push(movementsSport[moveIndex]);
    }

    const midiSelected = objective === 'perte' ? midisPerte[day % midisPerte.length] : midisPrise[day % midisPrise.length];
    const soirSelected = objective === 'perte' ? soirsPerte[day % soirsPerte.length] : soirsPrise[day % soirsPrise.length];
    const menuHTML = `🥞 Matin : ${matins[day % matins.length]} \n\n☀️ Midi : ${midiSelected} \n\n🌙 Soir : ${soirSelected}`;

    return { menu: menuHTML, exercises, bonus: mentals[day % mentals.length], estimatedCalories };
  };

  // --- STYLES ET ANIMATIONS INTÉGRÉS ---
  const globalAppStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    color: '#0f172a',
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 100%), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200") no-repeat center center fixed',
    backgroundSize: 'cover',
    boxSizing: 'border-box'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '24px',
    padding: '30px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxSizing: 'border-box',
    textAlign: 'center'
  };

  // Injection dynamique d'une feuille de style CSS pour gérer les animations des mouvements simulés
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes pushup { 0%, 100% { transform: translateY(0px) scaleX(1); } 50% { transform: translateY(25px) scaleX(1.02); } }
      @keyframes squat { 0%, 100% { transform: scaleY(1); origin: bottom; } 50% { transform: scaleY(0.65); origin: bottom; } }
      @keyframes jump { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(15px) scaleY(0.8); } 65% { transform: translateY(-40px) scaleY(1.1); } }
      @keyframes climber { 0%, 100% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
      .visual-box { height: 140px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; display: flex; align-items: center; justify-content: center; position: relative; margin: 15px 0; overflow: hidden; }
      .avatar-body { width: 60px; height: 20px; background: #2563eb; border-radius: 10px; position: relative; }
      .anim-pushup .avatar-body { animation: pushup 2s infinite ease-in-out; }
      .anim-pushup-diamond .avatar-body { background: #7c3aed; animation: pushup 1.5s infinite ease-in-out; width: 45px; }
      .anim-squat .avatar-body { width: 30px; height: 50px; transform-origin: bottom; animation: squat 2s infinite ease-in-out; }
      .anim-squat-jump .avatar-body { width: 30px; height: 50px; transform-origin: bottom; animation: jump 1.8s infinite ease-in-out; background: #f43f5e; }
      .anim-climber .avatar-body { width: 55px; height: 25px; animation: climber 0.6s infinite linear; background: #eab308; }
      .anim-plank .avatar-body { width: 70px; height: 15px; background: #10b981; }
      .anim-generic .avatar-body { width: 40px; height: 40px; border-radius: 50%; background: #64748b; animation: pushup 2s infinite linear; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // --- ESPACE PRIVÉ MEMBRE ---
  if (currentPath === '/programme-secret') {
    if (!email) {
      return (
        <div style={globalAppStyle}>
          <div style={cardStyle}>
            <h2 style={{ color: '#ef4444' }}>🔒 Session expirée</h2>
            <button onClick={() => navigateTo('/')} className="paypal-btn" style={{ background: '#003087', color: 'white', marginTop: '15px', padding: '12px 25px', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>Retourner à l'accueil</button>
          </div>
        </div>
      );
    }

    const isDayLocked = selectedDay > 7 && !hasPaid;
    const program = goal ? get60DaysData(selectedDay, goal) : null;

    return (
      <div style={globalAppStyle}>
        {/* COMPTE DE SESSION EN HAUT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)', padding: '10px 15px', borderRadius: '50px', marginBottom: '15px', width: '100%', maxWidth: '520px', color: 'white', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span>👤 Athlète : <strong style={{ color: '#ffc439' }}>{email}</strong></span>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '50px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>Déconnexion</button>
        </div>

        {/* CONTENEUR PRINCIPAL CARD */}
        <div style={cardStyle}>
          
          {/* BARRE DES 60 JOURS DISPONIBLE SEULEMENT QUAND ON EST PAS EN TRAIN DE FAIRE UN EXERCICE */}
          {(!program || (activeTab === 'nutrition' || currentExerciseIndex >= program.exercises.length)) && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textAlign: 'left' }}>📅 Sélectionner une journée :</p>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
                {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
                  const isLocked = dayNum > 7 && !hasPaid;
                  const isCurrent = dayNum === currentDay;
                  const isSelected = dayNum === selectedDay;
                  return (
                    <button
                      key={dayNum}
                      onClick={() => { setSelectedDay(dayNum); setCurrentExerciseIndex(0); setIsChronoActive(false); }}
                      style={{
                        padding: '8px 16px', borderRadius: '12px',
                        border: isSelected ? '2px solid #003087' : '1px solid #e2e8f0',
                        background: isLocked ? '#f1f5f9' : isCurrent ? '#10b981' : isSelected ? '#003087' : '#ffffff',
                        color: isLocked ? '#94a3b8' : isCurrent || isSelected ? '#ffffff' : '#0f172a',
                        fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      {isLocked ? `🔒 J${dayNum}` : `Jour ${dayNum}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION STATS */}
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '15px 20px', color: 'white', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>🔥 BRÛLÉ AU TOTAL</span>
                <strong style={{ fontSize: '1.4rem', color: '#f43f5e' }}>{calories} kcal</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>🎯 TON NIVEAU REEL</span>
                <strong style={{ fontSize: '1.4rem', color: '#10b981' }}>Jour {currentDay} / 60</strong>
              </div>
            </div>
          </div>

          {isDayLocked ? (
            /* PAYWALL REQUIS */
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '20px', borderRadius: '16px' }}>
              <h3 style={{ color: '#b45309', fontSize: '1.2rem', margin: 0 }}>🔒 Fin de la période d'essai</h3>
              <p style={{ margin: '12px 0', color: '#78350f', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Tu as complété l'essai de 7 jours. Débloque le reste de l'aventure et accède aux fiches d'exercices isolées exclusives pour seulement 4,99 € (Paiement unique).
              </p>
              <a href={paypalLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#003087', color: 'white', fontWeight: 'bold', textDecoration: 'none', padding: '14px', borderRadius: '50px', marginBottom: '10px' }}>
                💳 Débloquer tout le Défi (4,99 €)
              </a>
              <button onClick={() => setHasPaid(true)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.7rem' }}>[Simuler l'achat]</button>
            </div>
          ) : !goal ? (
            /* CHOIX DE L'OBJECTIF */
            <div>
              <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>🎯 Choisis ton profil pour le Jour {selectedDay}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => setGoal('perte')} style={{ background: '#ef4444', color: 'white', padding: '14px', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>🔥 Mode Perte de Graisse / Sèche</button>
                <button onClick={() => setGoal('prise')} style={{ background: '#2563eb', color: 'white', padding: '14px', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>💪 Mode Prise de Muscle / Volume</button>
              </div>
            </div>
          ) : (
            /* PROGRAMME DISPONIBLE */
            <div>
              {/* ONGLETS SEULEMENT QUAND ON NE SQUATTE PAS UN EXERCICE ISOLÉ */}
              {currentExerciseIndex >= program.exercises.length && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <button onClick={() => setActiveTab('sport')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: activeTab === 'sport' ? '#003087' : '#f1f5f9', color: activeTab === 'sport' ? 'white' : '#475569' }}>🏋️‍♂️ Lancer l'Entraînement</button>
                  <button onClick={() => setActiveTab('nutrition')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: activeTab === 'nutrition' ? '#003087' : '#f1f5f9', color: activeTab === 'nutrition' ? 'white' : '#475569' }}>🍏 Nutrition</button>
                </div>
              )}

              {activeTab === 'nutrition' && currentExerciseIndex >= program.exercises.length ? (
                /* ONGLET NUTRITION HISTORIQUE */
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: '#0f172a', marginBottom: '10px' }}>🍏 Plan Alimentaire du Jour {selectedDay}</h4>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px', borderLeft: '4px solid #10b981', whiteSpace: 'pre-line', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                    {program.menu}
                  </div>
                  <button onClick={() => setGoal(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}>🔄 Modifier l'objectif d'alimentation</button>
                </div>
              ) : (
                /* ÉCRAN EXERCICE FOCUS DE TYPE PAGE UNIQUE */
                <div>
                  {currentExerciseIndex < program.exercises.length ? (
                    <div>
                      {/* SI LE CHRONO DE REPOS EST ACTIF, PAGE DE REPOS */}
                      {isChronoActive ? (
                        <div style={{ padding: '20px 0' }}>
                          <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>⏳ TEMPS DE REPOS MUSCULAIRE</span>
                          <p style={{ fontSize: '4.5rem', fontWeight: 'bold', color: '#d97706', margin: '10px 0' }}>{timeLeft}s</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px' }}>
                            <button onClick={() => setTimeLeft(prev => prev + 10)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d97706', background: 'white', color: '#d97706', fontWeight: 'bold', cursor: 'pointer' }}>+10s</button>
                            <button onClick={() => setTimeLeft(prev => Math.max(0, prev - 10))} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d97706', background: 'white', color: '#d97706', fontWeight: 'bold', cursor: 'pointer' }}>-10s</button>
                          </div>
                          
                          <button onClick={handleNextExercise} style={{ background: '#d97706', color: 'white', border: 'none', width: '100%', padding: '14px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>🚀 Passer le repos (Exercice suivant) →</button>
                        </div>
                      ) : (
                        /* PAGE 100% EXCLUSIVE DÉDIÉE À L'EXERCICE EN COURS */
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>
                            <span>🚨 FOCUS : MOUVEMENT {currentExerciseIndex + 1} / {program.exercises.length}</span>
                            <span>Jour {selectedDay}</span>
                          </div>

                          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                            {program.exercises[currentExerciseIndex][0]}
                          </h2>
                          
                          <div style={{ background: '#eff6ff', color: '#1e40af', padding: '6px 12px', borderRadius: '8px', display: 'inline-block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '15px' }}>
                            🎯 Objectif : {program.exercises[currentExerciseIndex][1]}
                          </div>

                          {/* 🎬 GUIDE VISUEL ANIMÉ UNIQUE DE L'EXERCICE */}
                          <div className={`visual-box ${getExerciseDetails(program.exercises[currentExerciseIndex][0]).animationClass}`}>
                            <div className="avatar-body"></div>
                            <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold' }}>EXEMPLE EN MOUVEMENT</span>
                          </div>

                          {/* TEXTE EXPLICATIF PRÉCIS DU PLACEMENT */}
                          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '12px 15px', borderRadius: '12px', borderLeft: '4px solid #2563eb', margin: '0 0 25px 0' }}>
                            <strong>Placement requis :</strong> {getExerciseDetails(program.exercises[currentExerciseIndex][0]).desc}
                          </p>

                          <button onClick={handleExerciseDone} style={{ background: '#10b981', color: 'white', border: 'none', width: '100%', padding: '15px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
                            ✅ J'ai terminé mes répétitions
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* TOUT EST FINI : RETOUR À LA VALIDATION DU JOUR */
                    <div>
                      <h3 style={{ color: '#10b981', fontSize: '1.4rem', margin: '10px 0' }}>🎉 Séance du Jour {selectedDay} Terminée !</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Tu as passé en revue l'intégralité des fiches de mouvements programmées pour aujourd'hui.</p>
                      
                      {selectedDay === currentDay ? (
                        <button onClick={handleDayValidation} style={{ background: '#003087', color: 'white', border: 'none', width: '100%', padding: '14px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                          🏆 Enregistrer et Valider ma Journée (+{program.estimatedCalories} kcal)
                        </button>
                      ) : (
                        <p style={{ color: '#059669', background: '#ecfdf5', padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>🔍 Tu consultes une archive historique.</p>
                      )}

                      {/* CODE POUR PERMETTRE DE REVENIR À LA NUTRITION QUAND L'EXO EST FINI */}
                      <div style={{ marginTop: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <button onClick={() => { setCurrentExerciseIndex(0); setActiveTab('nutrition'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}>Voir le menu nutrition de ce jour</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* LIEN RETOUR ACCUEIL VISIBLE SI PAS EN TRAIN DE FAIRE UN EXERCICE */}
          {(currentExerciseIndex >= (program?.exercises?.length || 0)) && (
            <button onClick={() => navigateTo('/')} style={{ background: 'none', border: 'none', color: '#003087', cursor: 'pointer', textDecoration: 'underline', display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>← Revenir à l'accueil</button>
          )}
        </div>
      </div>
    );
  }

  // --- VITRINE D'ACCUEIL PRINCIPALE ---
  return (
    <div style={globalAppStyle}>
      <div style={cardStyle}>
        <header style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0', letterSpacing: '-0.5px' }}>Défi 60 Jours</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>L'application de fitness à écran de focus isolé.</p>
        </header>

        <main>
          <section>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Profite de <strong>7 jours d'essai gratuit</strong>. Entraîne-toi sans distraction avec une seule page par exercice, son guide d'alignement corporel et des démonstrations dynamiques en temps réel.
            </p>

            <form onSubmit={handleStartFreeTrial} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input 
                type="email" placeholder="Saisis ton adresse e-mail..." required value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                style={{ padding: '15px 20px', borderRadius: '50px', border: '1px solid #cbd5e1', fontSize: '1rem', textAlign: 'center', outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                🟢 Rejoindre et Lancer le Jour 1
              </button>
            </form>

            <div style={{ textAlign: 'left', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}><strong>⭐ Nouvelle interface Premium :</strong></p>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                <li>📺 <strong>Mode Focus Unique :</strong> Un seul exercice par écran.</li>
                <li>🎯 <strong>Précision technique :</strong> Spécifications exactes (Diamant, Classique, etc.).</li>
                <li>🎬 Exemples visuels intégrés en mouvement continu.</li>
              </ul>
            </div>
          </section>

          {email && (
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => { navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', fontSize: '0.9rem' }}>
                ⚡ Reprendre ma session ({email})
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '25px', opacity: 0.3 }}>
            <button onClick={() => { setEmail('demo-focus@fitness.com'); setCurrentDay(7); setSelectedDay(7); setHasPaid(false); navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.7rem', textDecoration: 'underline' }}>🔧 Tester directement le mur de paiement (Jour 7)</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
