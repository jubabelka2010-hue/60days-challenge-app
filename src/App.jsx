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
        desc: "Place tes mains au sol bien à plat, écartées à la largeur des épaules. Oriente tes coudes à 45° vers l'arrière lors de la descente. Reste parfaitement droit.",
        animationClass: "anim-pushup"
      },
      "Pompes Diamant serrées": {
        desc: "Rapproche tes mains sous la poitrine pour former un losange avec tes pouces et tes index. Descends les coudes près du corps pour cibler les triceps.",
        animationClass: "anim-pushup-diamond"
      },
      "Squats classiques": {
        desc: "Pieds écartés à la largeur des épaules. Descends les fesses vers le bas et l'arrière comme pour t'asseoir sur une chaise basse. Garde le buste fier.",
        animationClass: "anim-squat"
      },
      "Squats Jumps": {
        desc: "Descends en squat puis pousse sur tes jambes de manière explosive pour décoller du sol. Amortis ton retour en pliant immédiatement les genoux.",
        animationClass: "anim-squat-jump"
      },
      "Dips sur chaise (Triceps)": {
        desc: "Pose tes mains sur le bord d'une chaise, les fesses dans le vide. Descends verticalement en pliant tes coudes jusqu'à former un angle de 90°.",
        animationClass: "anim-dips"
      },
      "Gainage Planche abdominale": {
        desc: "Mets-toi en appui sur les avant-bras et les pointes de pieds. Aspire ton nombril vers la colonne et contracte fort tes cuisses et tes fessiers.",
        animationClass: "anim-plank"
      },
      "Gainage Militaire dynamique": {
        desc: "Démarre en planche sur les avant-bras, monte sur la main droite puis la main gauche pour finir bras tendus. Redescends et alterne.",
        animationClass: "anim-commando"
      },
      "Mountain Climbers rapides": {
        desc: "En position de pompe haute, ramène rapidement tes genoux vers ta poitrine l'un après l'autre comme si tu courais au sol. Garde le bassin stable.",
        animationClass: "anim-climber"
      },
      "Fentes alternées (Cuisses)": {
        desc: "Fais un grand pas en avant. Descends le genou arrière à ras du sol. Ta jambe avant doit former un angle droit parfait. Pousse pour revenir.",
        animationClass: "anim-lunge"
      },
      "Fentes bulgares isolées": {
        desc: "Place un pied en arrière sur une chaise. Descends tout le poids de ton corps sur ta jambe avant de manière lente et contrôlée.",
        animationClass: "anim-bulgarian"
      },
      "Abdos Bicyclette": {
        desc: "Allongé sur le dos, décolle les épaules. Amène ton coude gauche vers ton genou droit replié pendant que ta jambe gauche se tend. Alterne.",
        animationClass: "anim-bicycle"
      },
      "Relevés de bassin (Glutes)": {
        desc: "Allongé sur le dos, genoux pliés, pieds à plat. Pousse sur tes talons pour monter ton bassin vers le ciel en serrant volontairement tes fessiers.",
        animationClass: "anim-bridge"
      },
      "Jumping Jacks cardio": {
        desc: "Saute en écartant tes pieds et en touchant tes mains au-dessus de ta tête. Saute à nouveau pour refermer tes jambes et ramener tes bras.",
        animationClass: "anim-jacks"
      },
      "Superman (Lombaires)": {
        desc: "Allongé sur le ventre, bras et jambes tendus. Décolle simultanément ta poitrine et tes cuisses du sol. Bloque une seconde en haut.",
        animationClass: "anim-superman"
      },
      "Burpees (Sans saut)": {
        desc: "Accroupis-toi, lance tes pieds en arrière pour te retrouver en planche, ramène tes pieds près de tes mains et redresse-toi complètement.",
        animationClass: "anim-burpee"
      }
    };
    return details[name] || { desc: "Garde ton corps parfaitement gainé et effectue des mouvements fluides et rythmés.", animationClass: "anim-generic" };
  };

  // --- ALGORITHME DE GÉNÉRATION DES 60 JOURS ---
  const get60DaysData = (day, objective) => {
    const exerciseCount = Math.min(20, 8 + Math.floor((day - 1) * 0.25));
    const estimatedCalories = 300 + (exerciseCount * 15) + (day * 2);

    const movementsSport = [
      ["Pompes classiques au sol", "12 répétitions"], 
      ["Squats classiques", "20 répétitions"], 
      ["Dips sur chaise (Triceps)", "12 répétitions"],
      ["Gainage Planche abdominale", "45 secondes"], 
      ["Mountain Climbers rapides", "40 secondes"], 
      ["Fentes alternées (Cuisses)", "14 répétitions"],
      ["Abdos Bicyclette", "20 répétitions"], 
      ["Relevés de bassin (Glutes)", "15 répétitions"], 
      ["Jumping Jacks cardio", "1 minute"],
      ["Superman (Lombaires)", "15 répétitions"], 
      ["Burpees (Sans saut)", "8 répétitions"], 
      ["Squats Jumps", "10 répétitions"],
      ["Pompes Diamant serrées", "8 répétitions"], 
      ["Gainage Militaire dynamique", "45 secondes"], 
      ["Fentes bulgares isolées", "10 réps / jambe"]
    ];

    const matins = ["Omelette 3 œufs aux épinards + Thé vert", "Fromage blanc 0%, éclats d'amandes + 1 Pomme", "Pancakes à la farine d'avoine maison + Filet de miel", "Œufs brouillés, 1/2 avocat + Café noir", "Bol de pudding de chia au lait d'amande + 1 Banane"];
    const midisPerte = ["Émincé de poulet grillé, haricots verts vapeur, filet d'huile d'olive", "Pavé de saumon sauvage saisi au citron et asperges vertes", "Salade de thon au naturel, œufs durs, concombres et tomates cerises"];
    const midisPrise = ["Steak haché de bœuf 5%, 150g de riz basmati pesé cuit, avocat entier", "Filet de saumon, 180g de quinoa gourmand, têtes de brocolis", "Escalope de dinde rôtie, pâtes complètes al dente, copeaux de parmesan"];
    const soirsPerte = ["Velouté maison de légumes de saison et blancs de poulet cubes", "Dos de cabillaud poché, tombée d'épinards frais à l'ail", "Omelette de 3 blancs d'œufs et herbes fines, salade verte"];
    const soirsPrise = ["Colin d'Alaska à la vapeur, 120g de riz complet, courgettes sautées", "Filet de poulet tendre, lentilles corail mijotées, huile de lin", "Omelette complète aux champignons, 3 tranches de pain de seigle"];
    const mentals = ["💧 Fixe-toi pour objectif de boire 2.5L d'eau pure aujourd'hui.", "📱 Éteins tous tes écrans connectés au moins 1h avant ton coucher.", "🚶‍♂️ Prends le temps de faire 15 min de marche active après ton repas.", "🧘 Prends une pause de 5 min pour faire de la respiration ventrale calme."];

    let exercises = [];
    for (let i = 0; i < exerciseCount; i++) {
      const moveIndex = (day + i * 3) % movementsSport.length;
      exercises.push(movementsSport[moveIndex]);
    }

    return {
      matin: matins[day % matins.length],
      midi: objective === 'perte' ? midisPerte[day % midisPerte.length] : midisPrise[day % midisPrise.length],
      soir: objective === 'perte' ? soirsPerte[day % soirsPerte.length] : soirsPrise[day % soirsPrise.length],
      exercises,
      bonus: mentals[day % mentals.length],
      estimatedCalories
    };
  };

  // --- DESIGN SYSTEM & INJECTION DES FEUILLES DE STYLE ANIMÉES ---
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes floatGym1 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.04; } 50% { transform: translate(40px, -30px) scale(1.1); opacity: 0.08; } }
      @keyframes floatGym2 { 0%, 100% { transform: translate(0, 0) scale(1.1); opacity: 0.06; } 50% { transform: translate(-30px, 40px) scale(0.95); opacity: 0.03; } }
      @keyframes pushupAnimation { 0%, 100% { transform: translateY(0px) scaleX(1); } 50% { transform: translateY(50px) scaleX(1.05); } }
      @keyframes squatAnimation { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.55); } }
      @keyframes jumpAnimation { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(20px) scaleY(0.85); } 60% { transform: translateY(-90px) scaleY(1.1); } }
      @keyframes climberAnimation { 0%, 100% { transform: translateX(-15px) rotate(-5deg); } 50% { transform: translateX(15px) rotate(5deg); } }
      
      body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Poppins', system-ui, sans-serif; overflow-x: hidden; }
      .app-fullscreen-container { min-height: 100vh; width: 100vw; display: flex; flex-direction: column; position: relative; box-sizing: border-box; background: #fafafa; overflow: hidden; }
      
      .bg-silhouette-1 { position: absolute; top: 15%; left: 5%; width: 350px; height: 350px; background: url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600') no-repeat center/cover; filter: grayscale(100%) blur(8px); border-radius: 50%; pointer-events: none; animation: floatGym1 12s infinite ease-in-out; }
      .bg-silhouette-2 { position: absolute; bottom: 10%; right: 5%; width: 400px; height: 400px; background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600') no-repeat center/cover; filter: grayscale(100%) blur(12px); border-radius: 50%; pointer-events: none; animation: floatGym2 16s infinite ease-in-out; }
      
      .content-fullscreen-wrapper { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; max-width: 900px; margin: 0 auto; padding: 40px 24px; z-index: 10; box-sizing: border-box; }
      
      .giant-visual-display { width: 100%; height: 320px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; display: flex; align-items: center; justify-content: center; position: relative; margin: 25px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.02); overflow: hidden; }
      .giant-avatar-core { width: 140px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 20px; position: relative; box-shadow: 0 10px 25px rgba(29, 78, 216, 0.3); }
      
      .anim-pushup .giant-avatar-core { animation: pushupAnimation 2s infinite ease-in-out; }
      .anim-pushup-diamond .giant-avatar-core { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); animation: pushupAnimation 1.4s infinite ease-in-out; width: 110px; }
      .anim-squat .giant-avatar-core { width: 50px; height: 110px; transform-origin: bottom; animation: squatAnimation 2.2s infinite ease-in-out; }
      .anim-squat-jump .giant-avatar-core { width: 50px; height: 110px; transform-origin: bottom; animation: jumpAnimation 1.8s infinite ease-in-out; background: linear-gradient(135deg, #f43f5e 0%, #be123c 100%); }
      .anim-climber .giant-avatar-core { width: 120px; height: 45px; animation: climberAnimation 0.5s infinite linear; background: linear-gradient(135deg, #eab308 0%, #a16207 100%); }
      .anim-plank .giant-avatar-core { width: 160px; height: 30px; background: linear-gradient(135deg, #10b981 0%, #047857 100%); }
      .anim-generic .giant-avatar-core { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #64748b 0%, #334155 100%); animation: pushupAnimation 2.5s infinite ease-in-out; }
      
      .food-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.01); display: flex; align-items: center; gap: 20px; width: 100%; box-sizing: border-box; }
      
      .btn-premium-cta { background: #0f172a; color: white; border: none; padding: 18px 36px; border-radius: 50px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: all 0.2s ease; width: 100%; text-align: center; box-shadow: 0 10px 20px rgba(15,23,42,0.15); }
      .btn-premium-cta:hover { transform: translateY(-2px); box-shadow: 0 15px 25px rgba(15,23,42,0.25); }
      
      .nav-pill-box { display: flex; gap: 10px; background: #e2e8f0; padding: 6px; border-radius: 50px; width: 100%; max-width: 500px; margin: 0 auto 30px auto; }
      .nav-pill-btn { flex: 1; border: none; padding: 12px; border-radius: 50px; font-weight: bold; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; background: transparent; color: #64748b; }
      .nav-pill-btn.active { background: white; color: #0f172a; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // --- ESPACE PRIVÉ MEMBRE (PLEIN ÉCRAN) ---
  if (currentPath === '/programme-secret') {
    if (!email) {
      return (
        <div className="app-fullscreen-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ color: '#ef4444', fontSize: '2rem' }}>🔒 Session expirée</h2>
            <button onClick={() => navigateTo('/')} className="btn-premium-cta" style={{ marginTop: '20px' }}>Retourner à l'accueil</button>
          </div>
        </div>
      );
    }

    const isDayLocked = selectedDay > 7 && !hasPaid;
    const program = goal ? get60DaysData(selectedDay, goal) : null;

    return (
      <div className="app-fullscreen-container">
        {/* Silhouettes de fond dynamiques */}
        <div className="bg-silhouette-1"></div>
        <div className="bg-silhouette-2"></div>

        {/* HEADER DE NAVIGATION PRO SUR TOUTE LA LARGEUR */}
        <header style={{ width: '100%', borderBottom: '1px solid #e2e8f0', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a', letterSpacing: '-0.5px' }}>🏆 DÉFI 60 JOURS</span>
            <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '500' }}>Athlète : {email}</span>
          </div>
          <button onClick={handleLogout} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 18px', borderRadius: '50px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Déconnexion</button>
        </header>

        {/* ZONE DE CONTENU PRINCIPALE - FORMAT CONCENTRÉ PLEIN ÉCRAN */}
        <div className="content-fullscreen-wrapper">
          
          {/* SÉLECTEUR DE JOURS - FORMAT BARRE HORIZONTALE PRO */}
          {(!program || (activeTab === 'nutrition' || currentExerciseIndex >= program.exercises.length)) && (
            <div style={{ width: '100%', marginBottom: '35px' }}>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
                {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
                  const isLocked = dayNum > 7 && !hasPaid;
                  const isCurrent = dayNum === currentDay;
                  const isSelected = dayNum === selectedDay;
                  return (
                    <button
                      key={dayNum}
                      onClick={() => { setSelectedDay(dayNum); setCurrentExerciseIndex(0); setIsChronoActive(false); }}
                      style={{
                        padding: '12px 24px', borderRadius: '50px',
                        border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                        background: isLocked ? '#f1f5f9' : isCurrent ? '#10b981' : isSelected ? '#0f172a' : '#ffffff',
                        color: isLocked ? '#94a3b8' : isCurrent || isSelected ? '#ffffff' : '#0f172a',
                        fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                      }}
                    >
                      {isLocked ? `🔒 Jour ${dayNum}` : `Jour ${dayNum}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TABLEAU DE BORD DES STATISTIQUES GLOBAL */}
          <div style={{ width: '100%', display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>ÉNERGIE BRÛLÉE ACTIVÉE</span>
              <strong style={{ fontSize: '1.8rem', color: '#f43f5e', fontWeight: '800' }}>{calories} kcal</strong>
            </div>
            <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>AVANCEMENT PROGRAMME</span>
              <strong style={{ fontSize: '1.8rem', color: '#10b981', fontWeight: '800' }}>Progression J-{currentDay}</strong>
            </div>
          </div>

          {/* AFFICHAGE DES PAGES UNIQUES DYNAMIQUES */}
          {isDayLocked ? (
            /* PAGE UNIQUE : WALL DE PAIEMENT */
            <div style={{ width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', padding: '40px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '3rem' }}>💎</span>
              <h3 style={{ color: '#0f172a', fontSize: '1.8rem', margin: '15px 0 10px 0', fontWeight: '800' }}>Débloquez l'accès Premium Intégral</h3>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 30px auto' }}>
                Félicitations pour vos 7 premiers jours ! Pour continuer les 60 jours en profitant de l'interface plein écran, des animations d'exercices isolés et des fiches nutrition, débloquez l'accès complet.
              </p>
              <div style={{ maxWidth: '350px', margin: '0 auto' }}>
                <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="btn-premium-cta" style={{ display: 'block', textDecoration: 'none', marginBottom: '15px', background: '#2563eb' }}>
                  Acheter le Pass Unique (4,99 €)
                </a>
                <button onClick={() => setHasPaid(true)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.75rem' }}>[ Simuler la validation de l'achat ]</button>
              </div>
            </div>
          ) : !goal ? (
            /* PAGE UNIQUE : SÉLECTION DE L'OBJECTIF PHYSIQUE */
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>Définissez votre cap pour le Jour {selectedDay}</h3>
              <p style={{ color: '#64748b', marginBottom: '30px' }}>Les exercices et plans de nutrition s'adaptent instantanément à votre métabolisme.</p>
              <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <button onClick={() => setGoal('perte')} className="btn-premium-cta" style={{ background: '#f43f5e', flex: 1 }}>🔥 Sèche / Perte de Poids</button>
                <button onClick={() => setGoal('prise')} className="btn-premium-cta" style={{ background: '#2563eb', flex: 1 }}>💪 Volume / Prise de Muscle</button>
              </div>
            </div>
          ) : (
            /* MODE RUNNING : ENTRAÎNEMENT OU NUTRITION */
            <div style={{ width: '100%' }}>
              
              {/* ONGLET DE SÉLECTION APPARENT UNIQUEMENT SI SÉANCE NON LANCÉE */}
              {currentExerciseIndex >= program.exercises.length && (
                <div className="nav-pill-box">
                  <button onClick={() => setActiveTab('sport')} className={`nav-pill-btn ${activeTab === 'sport' ? 'active' : ''}`}>🏋️ Entraînement Focus</button>
                  <button onClick={() => setActiveTab('nutrition')} className={`nav-pill-btn ${activeTab === 'nutrition' ? 'active' : ''}`}>🍏 Nutrition Pro</button>
                </div>
              )}

              {activeTab === 'nutrition' && currentExerciseIndex >= program.exercises.length ? (
                /* ==================== PAGE NUTRITION 100% UNIQUE ==================== */
                <div style={{ width: '100%', animation: 'fadeIn 0.4s ease' }}>
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Plan de Nutrition Idéal</h2>
                    <p style={{ color: '#64748b' }}>Ajusté spécifiquement pour vos besoins de la journée {selectedDay}</p>
                  </div>

                  <div className="food-card">
                    <div style={{ fontSize: '2rem', background: '#fef3c7', padding: '15px', borderRadius: '16px' }}>🥞</div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Repas du Matin / Petit-Déjeuner</strong>
                      <span style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.5' }}>{program.matin}</span>
                    </div>
                  </div>

                  <div className="food-card">
                    <div style={{ fontSize: '2rem', background: '#dbeafe', padding: '15px', borderRadius: '16px' }}>☀️</div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Déjeuner de Mi-Journée</strong>
                      <span style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.5' }}>{program.midi}</span>
                    </div>
                  </div>

                  <div className="food-card">
                    <div style={{ fontSize: '2rem', background: '#e0f2fe', padding: '15px', borderRadius: '16px' }}>🌙</div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Dîner de Fin de Journée</strong>
                      <span style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.5' }}>{program.soir}</span>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', borderLeft: '4px solid #3b82f6', marginTop: '25px', color: '#334155', fontSize: '0.95rem' }}>
                    <strong>💡 Objectif Mental Complémentaire :</strong> {program.bonus}
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button onClick={() => setGoal(null)} style={{ background: 'none', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Changer d'objectif métabolique</button>
                  </div>
                </div>
              ) : (
                /* ==================== PAGE EXERCICE FOCUS UNIQUE ==================== */
                <div style={{ width: '100%' }}>
                  {currentExerciseIndex < program.exercises.length ? (
                    <div style={{ width: '100%' }}>
                      
                      {isChronoActive ? (
                        /* SOUS-PAGE : REPOS EN PLEIN ÉCRAN */
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                          <span style={{ fontSize: '1rem', color: '#d97706', fontWeight: 'bold', letterSpacing: '2px' }}>RÉCUPÉRATION EN COURS</span>
                          <p style={{ fontSize: '7rem', fontWeight: '900', color: '#d97706', margin: '15px 0', cubicBezier: 'linear' }}>{timeLeft}s</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
                            <button onClick={() => setTimeLeft(prev => prev + 10)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid #d97706', background: 'transparent', color: '#d97706', fontWeight: 'bold', cursor: 'pointer' }}>+ 10s Repos</button>
                            <button onClick={() => setTimeLeft(prev => Math.max(0, prev - 10))} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid #d97706', background: 'transparent', color: '#d97706', fontWeight: 'bold', cursor: 'pointer' }}>- 10s Repos</button>
                          </div>
                          
                          <button onClick={handleNextExercise} className="btn-premium-cta" style={{ background: '#d97706', maxWidth: '400px' }}>Ignorer le repos & passer à la suite →</button>
                        </div>
                      ) : (
                        /* LA PAGE UNIQUE DE L'EXERCICE TOTAL */
                        <div style={{ width: '100%', animation: 'fadeIn 0.3s ease' }}>
                          
                          {/* INFOS HAUT DE PAGE */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 'bold', letterSpacing: '1px' }}>MOUVEMENT TECHNIQUE {currentExerciseIndex + 1} / {program.exercises.length}</span>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>SESSION JOUR {selectedDay}</span>
                          </div>

                          {/* NOM DE L'EXERCICE GÉANT */}
                          <h1 style={{ fontSize: '2.5rem', color: '#0f172a', margin: '0 0 10px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>
                            {program.exercises[currentExerciseIndex][0]}
                          </h1>

                          {/* CADRE REPETITIONS ET CADENCE */}
                          <div style={{ background: '#eff6ff', color: '#1e40af', padding: '10px 20px', borderRadius: '50px', display: 'inline-block', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '20px' }}>
                            🎯 Objectif d'effort : {program.exercises[currentExerciseIndex][1]}
                          </div>

                          {/* DÉMONSTRATION VISUELLE ANIMÉE GRANDE TAILLE */}
                          <div className={`giant-visual-display ${getExerciseDetails(program.exercises[currentExerciseIndex][0]).animationClass}`}>
                            <div className="giant-avatar-core"></div>
                            <span style={{ position: 'absolute', bottom: '15px', right: '20px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' }}>EXEMPLE DE CADENCE TECHNIQUE EN MOUVEMENT CONTINU</span>
                          </div>

                          {/* DESCRIPTION TEXTUELLE ET POSITIONNEMENT ANATOMIQUE EXCLUSIF */}
                          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '20px', marginBottom: '35px' }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: '700' }}>Instructions de placement corporel requis :</h4>
                            <p style={{ margin: 0, color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
                              {getExerciseDetails(program.exercises[currentExerciseIndex][0]).desc}
                            </p>
                          </div>

                          {/* BOUTON DE VALIDATION UNIQUE */}
                          <button onClick={handleExerciseDone} className="btn-premium-cta" style={{ background: '#10b981', fontSize: '1.2rem', padding: '20px' }}>
                            ✅ J'ai validé ma série avec succès
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* TOUT EST FINI : RETOUR À LA VALIDATION DU JOUR */
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <span style={{ fontSize: '3.5rem' }}>🎉</span>
                      <h3 style={{ color: '#10b981', fontSize: '2rem', margin: '15px 0', fontWeight: '800' }}>Séance du Jour {selectedDay} Complétée !</h3>
                      <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 30px auto', lineHeight: '1.5' }}>Vous avez terminé avec rigueur l'ensemble des fiches d'exercices isolées prévues pour aujourd'hui.</p>
                      
                      {selectedDay === currentDay ? (
                        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                          <button onClick={handleDayValidation} className="btn-premium-cta" style={{ background: '#0f172a' }}>
                            🏆 Enregistrer et Clôturer ma Journée (+{program.estimatedCalories} kcal)
                          </button>
                        </div>
                      ) : (
                        <p style={{ color: '#047857', background: '#ecfdf5', padding: '15px 30px', borderRadius: '50px', fontWeight: 'bold', display: 'inline-block' }}>🔍 Vous consultez l'historique archivé de cette journée.</p>
                      )}

                      <div style={{ marginTop: '25px' }}>
                        <button onClick={() => { setCurrentExerciseIndex(0); setActiveTab('nutrition'); }} style={{ background: 'none', border: 'none', color: '#3182ce', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.95rem' }}>Consulter le plan de nutrition lié à ce jour</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* LIEN DE RETOUR GÉNÉRAL SÉCURISÉ */}
          {(currentExerciseIndex >= (program?.exercises?.length || 0)) && (
            <button onClick={() => navigateTo('/')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', marginTop: '40px', fontSize: '0.9rem' }}>← Quitter le tableau de bord principal</button>
          )}
        </div>
      </div>
    );
  }

  // --- VITRINE D'ACCUEIL COMPLÈTE (PLEIN ÉCRAN PREMIUM) ---
  return (
    <div className="app-fullscreen-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="bg-silhouette-1"></div>
      <div className="bg-silhouette-2"></div>

      <div className="content-fullscreen-wrapper" style={{ textAlign: 'center', maxWidth: '650px' }}>
        <header style={{ marginBottom: '35px' }}>
          <span style={{ fontSize: '1rem', background: '#e2e8f0', color: '#0f172a', padding: '6px 16px', borderRadius: '50px', fontWeight: 'bold', letterSpacing: '1px' }}>FITNESS HIGH-TECH V2</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0f172a', margin: '15px 0 10px 0', letterSpacing: '-1.5px', lineHeight: '1.1' }}>Défi 60 Jours</h1>
          <p style={{ color: '#475569', fontSize: '1.2rem', fontWeight: '400', maxWidth: '500px', margin: '0 auto' }}>L'application d'entraînement en immersion par écrans de focus uniques.</p>
        </header>

        <main style={{ width: '100%' }}>
          <section style={{ background: 'white', border: '1px solid #e2e8f0', padding: '35px', borderRadius: '32px', boxShadow: '0 15px 35px rgba(0,0,0,0.02)' }}>
            <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '25px' }}>
              Bénéficiez de <strong>7 jours d'accès gratuit immédiat</strong>. Entraînez-vous sans distraction : une seule page plein écran par mouvement avec guide rythmique dynamique automatisé.
            </p>

            <form onSubmit={handleStartFreeTrial} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input 
                type="email" placeholder="Saisissez votre adresse e-mail..." required value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                style={{ padding: '18px 25px', borderRadius: '50px', border: '1px solid #cbd5e1', fontSize: '1.1rem', textAlign: 'center', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'all 0.2s' }}
              />
              <button type="submit" className="btn-premium-cta" style={{ background: '#10b981' }}>
                🚀 Lancer mon Essai Gratuit & Activer le Jour 1
              </button>
            </form>
          </section>

          {/* REPRENDRE SA SESSION */}
          {email && (
            <div style={{ marginTop: '25px' }}>
              <button onClick={() => { navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1rem' }}>
                ⚡ Reprendre ma session en cours ({email})
              </button>
            </div>
          )}

          {/* SIMULATEUR DE TEST RAPIDE */}
          <div style={{ marginTop: '40px', opacity: 0.4 }}>
            <button onClick={() => { setEmail('demo-fullscreen@fitness.com'); setCurrentDay(7); setSelectedDay(7); setHasPaid(false); navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>🔧 Mode Démo rapide : Tester directement le mur de paiement du Jour 7</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

