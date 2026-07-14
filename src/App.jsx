import React, { useState, useEffect } from 'react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [goal, setGoal] = useState(null); // 'perte' ou 'prise'
  const [activeTab, setActiveTab] = useState('sport'); // 'sport' ou 'nutrition'
  const [showTutorial, setShowTutorial] = useState(false); // Afficher/Masquer le tuto
  
  // Chronomètre
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
    setShowTutorial(false); // Ferme le tuto pour l'exercice suivant
  };

  const handleNextExercise = () => {
    setIsChronoActive(false);
    setCurrentExerciseIndex(prev => prev + 1);
    setShowTutorial(false);
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
    
    alert(`🏆 Journée validée avec succès ! +${program.estimatedCalories} kcal ajoutées à ton compteur !`);
  };

  // --- BASE DE DONNÉES DES TUTOS DES MOUVEMENTS ---
  const getTutorial = (exerciseName) => {
    const tutorials = {
      "Squats classiques": "Positionne tes pieds à la largeur des épaules. Descends les fesses vers l'arrière comme pour t'asseoir sur une chaise, en gardant le dos droit et les genoux alignés avec tes pointes de pieds. Remonte en poussant dans tes talons.",
      "Squats Jumps": "Fais un squat classique et, au moment de remonter, pousse de manière explosive pour sauter le plus haut possible. Amortis délicatement la descente directement en position de squat.",
      "Pompes au sol": "Place tes mains légèrement plus larges que tes épaules. Aligne tes pieds, tes fesses et ta tête. Descends la poitrine près du sol en serrant les abdominaux, puis repousse le sol.",
      "Pompes Diamant": "Place tes mains sous ta poitrine en formant un losange (diamant) avec tes index et tes pouces. Descends en gardant les coudes proches du corps. Cible intensément les triceps.",
      "Dips sur chaise": "Assieds-toi sur le bord d'une chaise, place tes mains de chaque côté de tes hanches. Avance tes pieds et descends tes fesses vers le sol en fléchissant tes coudes à 90°, puis remonte à la force des bras.",
      "Gainage Planche": "Installe-toi sur les avant-bras et la pointe des pieds. Contracte tes abdominaux et tes fessiers pour former une ligne droite. Ne laisse pas ton bas du dos se creuser.",
      "Gainage Militaire": "Démarre en position de planche sur les avant-bras, puis lève-toi une main après l'autre pour finir en position de pompes. Redescends ensuite sur les avant-bras. Reste bien stable.",
      "Mountain Climbers": "En position de pompe, ramène rapidement tes genoux un par un vers ta poitrine de manière alternée, comme si tu grimpais une montagne en courant. Garde les fesses basses.",
      "Fentes alternées": "Fais un grand pas en avant. Descends le genou arrière vers le sol sans qu'il ne le touche, en créant un angle de 90° avec ta jambe avant. Repousse pour revenir au centre, puis change de jambe.",
      "Fentes bulgares": "Pose un pied en arrière sur une chaise. Avance l'autre pied. Descends verticalement en pliant la jambe avant. Excellent pour isoler le fessier et la cuisse.",
      "Abdos Bicyclette": "Allongé sur le dos, mains derrière les oreilles. Amène ton coude gauche vers ton genou droit replié, tout en tendant la jambe gauche. Alterne le mouvement de façon fluide.",
      "Relevés de bassin": "Allongé sur le dos, genoux pliés et pieds au sol. Décolle tes fesses du tapis le plus haut possible en contractant volontairement tes fessiers au maximum pendant 1 seconde en haut.",
      "Jumping Jacks": "Tiens-toi debout, pieds joints et bras le long du corps. Saute en écartant les pieds et en croisant tes mains au-dessus de ta tête, puis resaute pour revenir à la position de départ.",
      "Superman (Lombaires)": "Allongé sur le ventre, bras tendus devant toi. Décolle simultanément tes bras, ta poitrine et tes jambes du sol en contractant ton dos et tes fessiers. Tiens la position.",
      "Burpees (Sans saut)": "Debout, accroupis-toi pour poser tes mains au sol, jette tes pieds en arrière pour te retrouver en planche, ramène tes pieds près de tes mains d'un coup sec et redresse-toi debout."
    };
    return tutorials[exerciseName] || "Effectue ce mouvement de manière contrôlée avec une bonne exécution. Expire pendant l'effort.";
  };

  // --- ALGORITHME DE GÉNÉRATION DES 60 JOURS ---
  const get60DaysData = (day, objective) => {
    const exerciseCount = Math.min(22, 10 + Math.floor((day - 1) * 0.21));
    const estimatedCalories = 300 + (exerciseCount * 15) + (day * 2);

    const movementsSport = [
      ["Squats classiques", "20 réps"], ["Pompes au sol", "12 réps"], ["Dips sur chaise", "12 réps"],
      ["Gainage Planche", "45 sec"], ["Mountain Climbers", "40 sec"], ["Fentes alternées", "14 réps"],
      ["Abdos Bicyclette", "20 réps"], ["Relevés de bassin", "15 réps"], ["Jumping Jacks", "1 min"],
      ["Superman (Lombaires)", "15 réps"], ["Burpees (Sans saut)", "8 réps"], ["Squats Jumps", "10 réps"],
      ["Pompes Diamant", "8 réps"], ["Gainage Militaire", "45 sec"], ["Fentes bulgares", "10 réps/jambe"]
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

  // --- APPLICATION STYLES INDÉPENDANTS (CSS Injecté pour professionnaliser le rendu) ---
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
    overflowX: 'hidden',
    // Fond avec dégradé sombre ultra pro + image de fitness en arrière-plan discret
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200") no-repeat center center fixed',
    backgroundSize: 'cover'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.97)',
    borderRadius: '24px',
    padding: '30px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxSizing: 'border-box'
  };

  // --- ESPACE PRIVÉ MEMBRE ---
  if (currentPath === '/programme-secret') {
    if (!email) {
      return (
        <div style={globalAppStyle}>
          <div style={cardStyle} className="text-center">
            <h2 style={{ color: '#ef4444' }}>🔒 Session expirée</h2>
            <button onClick={() => navigateTo('/')} className="paypal-btn" style={{ background: '#003087', color: 'white', marginTop: '15px' }}>Retourner à l'accueil</button>
          </div>
        </div>
      );
    }

    const isDayLocked = selectedDay > 7 && !hasPaid;
    const program = goal ? get60DaysData(selectedDay, goal) : null;

    return (
      <div style={globalAppStyle}>
        {/* COMPTE DE SESSION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)', padding: '10px 15px', borderRadius: '50px', marginBottom: '15px', width: '100%', maxWidth: '520px', color: 'white', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span>👤 Atleth : <strong style={{ color: '#ffc439' }}>{email}</strong></span>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '50px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>Déconnexion</button>
        </div>

        {/* CONTENEUR PRINCIPAL */}
        <div style={cardStyle}>
          {/* BARRE HORIZONTALE DES 60 JOURS */}
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textAlign: 'left' }}>📅 Programme d'entraînement (Sélectionne ton Jour) :</p>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', scrollbarWidth: 'thin' }}>
            {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
              const isLocked = dayNum > 7 && !hasPaid;
              const isCurrent = dayNum === currentDay;
              const isSelected = dayNum === selectedDay;
              return (
                <button
                  key={dayNum}
                  onClick={() => { setSelectedDay(dayNum); setCurrentExerciseIndex(0); setIsChronoActive(false); setShowTutorial(false); }}
                  style={{
                    padding: '8px 16px', borderRadius: '12px',
                    border: isSelected ? '2px solid #003087' : '1px solid #e2e8f0',
                    background: isLocked ? '#f1f5f9' : isCurrent ? '#10b981' : isSelected ? '#003087' : '#ffffff',
                    color: isLocked ? '#94a3b8' : isCurrent || isSelected ? '#ffffff' : '#0f172a',
                    fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                  }}
                >
                  {isLocked ? `🔒 J${dayNum}` : `Jour ${dayNum}`}
                </button>
              );
            })}
          </div>

          {/* SECTION TABLEAU DE BORD STATS */}
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '15px 20px', color: 'white', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>🔥 Brûlé au total</span>
                <strong style={{ fontSize: '1.4rem', color: '#f43f5e' }}>{calories} kcal</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>🎯 Niveau réel</span>
                <strong style={{ fontSize: '1.4rem', color: '#10b981' }}>Jour {currentDay} / 60</strong>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid #1e293b', paddingTop: '10px', marginTop: '10px' }}>
              {unlockedBadges.map((b, idx) => <span key={idx} style={{ background: '#1e293b', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', border: '1px solid #334155', color: '#ffc439' }}>{b}</span>)}
            </div>
          </div>

          {isDayLocked ? (
            /* LOCK PAYWALL */
            <div style={{ textAlign: 'center', background: '#fffbeb', border: '1px solid #fef3c7', padding: '20px', borderRadius: '16px' }}>
              <h3 style={{ color: '#b45309', fontSize: '1.2rem', margin: 0 }}>🔒 Prolongation requise !</h3>
              <p style={{ margin: '12px 0', color: '#78350f', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Tu as brillement passé tes 7 premiers jours d'essai gratuit. Débloque instantanément l'accès aux **53 jours restants** avec tes circuits évolutifs (jusqu'à 22 exercices) pour un paiement unique.
              </p>
              <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="paypal-btn" style={{ display: 'block', background: '#003087', color: 'white', fontWeight: 'bold', textDecoration: 'none', padding: '14px', borderRadius: '50px', marginBottom: '10px' }}>
                💳 Débloquer tout le Défi (4,99 €)
              </a>
              <button onClick={() => setHasPaid(true)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.7rem', textDecoration: 'underline' }}>[Simuler l'achat]</button>
            </div>
          ) : !goal ? (
            /* OBJECTIF DU JOUR */
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>🎯 Configure ton profil du Jour {selectedDay}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => setGoal('perte')} className="paypal-btn" style={{ background: '#ef4444', color: 'white', padding: '14px', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>🔥 Mode Perte de Graisse / Sèche</button>
                <button onClick={() => setGoal('prise')} className="paypal-btn" style={{ background: '#2563eb', color: 'white', padding: '14px', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>💪 Mode Prise de Muscle / Volume</button>
              </div>
            </div>
          ) : (
            /* INTERFACE ACTIVE */
            <div>
              {/* ONGLETS PRO */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('sport')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', background: activeTab === 'sport' ? '#003087' : '#f1f5f9', color: activeTab === 'sport' ? 'white' : '#475569' }}>🏋️‍♂️ Circuit ({program.exercises.length} Exos)</button>
                <button onClick={() => setActiveTab('nutrition')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', background: activeTab === 'nutrition' ? '#003087' : '#f1f5f9', color: activeTab === 'nutrition' ? 'white' : '#475569' }}>🍏 Nutrition</button>
              </div>

              {/* CONTENU ONGLET NUTRITION */}
              {activeTab === 'nutrition' ? (
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: '#0f172a', marginBottom: '10px', fontSize: '1.1rem' }}>🍏 Plan Alimentaire Rééquilibré</h4>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px', borderLeft: '4px solid #10b981', whiteSpace: 'pre-line', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                    {program.menu}
                  </div>
                  <button onClick={() => setGoal(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}>🔄 Modifier l'objectif de la journée</button>
                </div>
              ) : (
                /* CONTENU ONGLET SPORT */
                <div style={{ textAlign: 'left' }}>
                  {currentExerciseIndex < program.exercises.length ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>
                        <span>🔥 Mouvement {currentExerciseIndex + 1} / {program.exercises.length}</span>
                        <button onClick={() => setGoal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Changer Profil</button>
                      </div>

                      <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 5px 0' }}>{program.exercises[currentExerciseIndex][0]}</h3>
                      <p style={{ fontSize: '1.1rem', color: '#2563eb', fontWeight: 'bold', margin: '0 0 15px 0' }}>🎯 Intensité : {program.exercises[currentExerciseIndex][1]}</p>

                      {/* ❓ DESIGN DU TUTO TECHNIQUE INTERACTIF */}
                      <div style={{ marginBottom: '20px' }}>
                        <button 
                          onClick={() => setShowTutorial(!showTutorial)} 
                          style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          {showTutorial ? '🔼 Masquer les consignes' : '❓ Comment faire cet exercice ?'}
                        </button>
                        
                        {showTutorial && (
                          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px 15px', borderRadius: '10px', marginTop: '8px', fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.5' }}>
                            <strong>💡 Instructions de posture :</strong> {getTutorial(program.exercises[currentExerciseIndex][0])}
                          </div>
                        )}
                      </div>

                      {/* CHRONOMÈTRE DE REPOS */}
                      {isChronoActive ? (
                        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '20px', borderRadius: '16px', textAlign: 'center', marginBottom: '15px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 'bold', letterSpacing: '0.5px' }}>⏳ RÉCUPÉRATION MUSCULAIRE</span>
                          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#d97706', margin: '5px 0' }}>{timeLeft}s</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                            <button onClick={() => setTimeLeft(prev => prev + 10)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #d97706', background: 'white', color: '#d97706', fontWeight: 'bold', cursor: 'pointer' }}>+10s</button>
                            <button onClick={() => setTimeLeft(prev => Math.max(0, prev - 10))} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #d97706', background: 'white', color: '#d97706', fontWeight: 'bold', cursor: 'pointer' }}>-10s</button>
                          </div>
                          
                          <button onClick={handleNextExercise} className="paypal-btn" style={{ background: '#d97706', color: 'white', border: 'none', width: '100%', padding: '12px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 Je suis prêt (Passer le repos)</button>
                        </div>
                      ) : (
                        <button onClick={handleExerciseDone} className="paypal-btn" style={{ background: '#10b981', color: 'white', border: 'none', width: '100%', padding: '14px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                          ✅ Exercice Validé
                        </button>
                      )}
                    </div>
                  ) : (
                    /* COMPLÉTION DE TOUS LES EXERCICES DU JOUR */
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ color: '#10b981', margin: '10px 0' }}>🎉 Séance Validée à 100% !</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Tu as brillamment surmonté les {program.exercises.length} mouvements programmés pour aujourd'hui !</p>
                      
                      {selectedDay === currentDay ? (
                        <button onClick={handleDayValidation} className="paypal-btn" style={{ background: '#003087', color: 'white', border: 'none', width: '100%', padding: '14px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                          🏆 Enregistrer ma journée (+{program.estimatedCalories} kcal)
                        </button>
                      ) : (
                        <p style={{ color: '#059669', background: '#ecfdf5', padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>🔍 Consultation d'une archive historique.</p>
                      )}
                    </div>
                  )}

                  {/* DÉFI MENTAL DU JOUR */}
                  <div style={{ background: '#f0fdf4', padding: '12px 15px', borderRadius: '12px', borderLeft: '4px solid #22c55e', marginTop: '15px' }}>
                    <h5 style={{ color: '#166534', margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>🧠 DÉFI COGNITIF / MENTAL :</h5>
                    <p style={{ color: '#14532d', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>{program.bonus}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <button onClick={() => navigateTo('/')} style={{ background: 'none', border: 'none', color: '#003087', cursor: 'pointer', textDecoration: 'underline', display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>← Revenir au menu d'accueil</button>
        </div>
      </div>
    );
  }

  // --- VITRINE PAGE D'ACCUEIL ---
  return (
    <div style={globalAppStyle}>
      <div style={cardStyle} className="text-center">
        <header style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0' }}>Défi 60 Jours</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Un programme à intensité variable unique au monde.</p>
        </header>

        <main>
          <section style={{ textAlign: 'center' }}>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Bénéficie de <strong>7 jours d'accès gratuit</strong> immédiat. Confectionne tes menus, active ton chrono connecté et maîtrise chaque posture grâce à nos fiches descriptives intégrées.
            </p>

            <form onSubmit={handleStartFreeTrial} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input 
                type="email" placeholder="Indique ton adresse e-mail..." required value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                style={{ padding: '15px 20px', borderRadius: '50px', border: '1px solid #cbd5e1', fontSize: '1rem', textAlign: 'center', outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
              <button type="submit" className="paypal-btn" style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                🟢 Démarrer mon Essai Gratuit (Jour 1)
              </button>
            </form>

            <div style={{ textAlign: 'left', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}><strong>🔥 Inclus dans l'application :</strong></p>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                <li>📈 Difficulté ascendante automatique (10 à 22 exercices).</li>
                <li>❓ Fiches descriptives et guidage technique sur chaque mouvement.</li>
                <li>🍏 Plans alimentaires diététiques changeants sur 60 jours.</li>
              </ul>
            </div>
          </section>

          {email && (
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => { setSelectedDay(currentDay); navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', fontSize: '0.9rem' }}>
                ⚡ Poursuivre sur le compte de {email}
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '25px', opacity: 0.3 }}>
            <button onClick={() => { setEmail('demo-premium@fitness.com'); setCurrentDay(7); setSelectedDay(7); setHasPaid(false); navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.7rem', textDecoration: 'underline' }}>🔧 Mode Démo : Simuler le mur de paiement (Jour 7)</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
