import React, { useState, useEffect } from 'react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [email, setEmail] = useState(() => localStorage.getItem('defi_fullscreen_email') || '');
  const [inputEmail, setInputEmail] = useState('');
  
  // États de progression globale
  const [currentDay, setCurrentDay] = useState(1);
  const [calories, setCalories] = useState(0);

  // Modes : 'dashboard' | 'nutrition' | 'preparation' | 'effort' | 'rest' | 'finished'
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  // Chronomètres dynamiques
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [effortSeconds, setEffortSeconds] = useState(0); // Pour le mode "temps" (décompte)
  const [elapsedTime, setElapsedTime] = useState(0); // Pour le mode "répétitions" (chronomètre ascendant)
  const [restSeconds, setRestSeconds] = useState(30);

  // Charger la session active
  useEffect(() => {
    if (email) {
      const savedDay = localStorage.getItem(`${email}_fs_day`);
      const savedCalories = localStorage.getItem(`${email}_fs_calories`);
      setCurrentDay(savedDay ? Number(savedDay) : 1);
      setCalories(savedCalories ? Number(savedCalories) : 0);
    }
  }, [email]);

  // Sauvegarder la session active
  useEffect(() => {
    if (email) {
      localStorage.setItem('defi_fullscreen_email', email);
      localStorage.setItem(`${email}_fs_day`, currentDay);
      localStorage.setItem(`${email}_fs_calories`, calories);
    }
  }, [currentDay, calories, email]);

  // Chronomètre de Préparation (10s)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'preparation' && prepSeconds > 0) {
      timer = setInterval(() => setPrepSeconds(s => s - 1), 1000);
    } else if (workoutMode === 'preparation' && prepSeconds === 0) {
      startEffortPhase();
    }
    return () => clearInterval(timer);
  }, [workoutMode, prepSeconds]);

  const program = getDayProgram(currentDay);
  const currentEx = program[currentExerciseIndex] || program[0];

  // Chronomètres d'Effort (Temps vs Répétitions)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'effort') {
      if (currentEx.mode === 'time') {
        // Mode Temps : Décompte jusqu'à 0
        if (effortSeconds > 0) {
          timer = setInterval(() => setEffortSeconds(s => s - 1), 1000);
        } else if (effortSeconds === 0) {
          triggerRestOrFinish();
        }
      } else if (currentEx.mode === 'reps') {
        // Mode Répétitions : Chronomètre ascendant libre
        timer = setInterval(() => setElapsedTime(s => s + 1), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [workoutMode, effortSeconds, currentEx.mode]);

  // Chronomètre de Repos Actif (30s)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'rest' && restSeconds > 0) {
      timer = setInterval(() => setRestSeconds(s => s - 1), 1000);
    } else if (workoutMode === 'rest' && restSeconds === 0) {
      moveToNextExercise();
    }
    return () => clearInterval(timer);
  }, [workoutMode, restSeconds]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanEmail = inputEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) return alert("Veuillez entrer un e-mail valide.");
    setEmail(cleanEmail);
    navigateTo('/private-arena');
  };

  const handleLogout = () => {
    localStorage.removeItem('defi_fullscreen_email');
    setEmail('');
    setInputEmail('');
    setWorkoutMode('dashboard');
    navigateTo('/');
  };

  const startFullWorkout = () => {
    setCurrentExerciseIndex(0);
    resetTimersForExercise(0);
    setWorkoutMode('preparation');
  };

  const resetTimersForExercise = (index) => {
    const ex = program[index];
    setPrepSeconds(10);
    setRestSeconds(30);
    setElapsedTime(0);
    if (ex.mode === 'time') {
      setEffortSeconds(ex.target); // ex: 60 secondes
    }
  };

  const startEffortPhase = () => {
    const ex = program[currentExerciseIndex];
    setElapsedTime(0);
    if (ex.mode === 'time') setEffortSeconds(ex.target);
    setWorkoutMode('effort');
  };

  const triggerRestOrFinish = () => {
    if (currentExerciseIndex === program.length - 1) {
      setWorkoutMode('finished');
    } else {
      setWorkoutMode('rest');
    }
  };

  const skipRestPeriod = () => moveToNextExercise();

  const moveToNextExercise = () => {
    const nextIndex = currentExerciseIndex + 1;
    setCurrentExerciseIndex(nextIndex);
    resetTimersForExercise(nextIndex);
    setWorkoutMode('preparation');
  };

  const confirmDayAndClose = () => {
    setCalories(prev => prev + 320);
    setCurrentDay(prev => prev + 1);
    setWorkoutMode('dashboard');
  };

  // --- BASE DE DONNÉES INTELLIGENTE DES EXERCICES ---
  // "mode: 'time'" = Chronomètre automatique qui se termine tout seul.
  // "mode: 'reps'" = Tu valides toi-même quand tu as fini tes répétitions.
  function getDayProgram(day) {
    const allMovements = [
      { name: "Pompes Classiques", target: 15, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Mains largeur d'épaules, frôlez le sol avec votre poitrine." },
      { name: "Mountain Climbers", target: 60, unit: "Secondes", mode: "time", type: "climber", setup: "Position pompe, montez les genoux rapidement vers la poitrine." },
      { name: "Squats Profonds", target: 20, unit: "Répétitions", mode: "reps", type: "squat", setup: "Pieds écartés, descendez le bassin sous la ligne de vos genoux." },
      { name: "Gainage Planche", target: 60, unit: "Secondes", mode: "time", type: "diamond", setup: "Sur les avant-bras, corps parfaitement droit, contractez les abdos." }, // On utilise le modèle pompe statique pour le gainage
      { name: "Pompes Diamant", target: 10, unit: "Répétitions", mode: "reps", type: "diamond", setup: "Mains collées formant un diamant sous le sternum." },
      { name: "Fentes Alternées", target: 20, unit: "Répétitions", mode: "reps", type: "lunge", setup: "Buste droit, fléchissez la jambe arrière vers le sol." },
      { name: "Gainage Commando", target: 45, unit: "Secondes", mode: "time", type: "climber", setup: "Passez de la position sur les avant-bras à l'appui sur les mains." },
      { name: "Sauts Squats (Jumps)", target: 15, unit: "Répétitions", mode: "reps", type: "jump", setup: "Descendez en squat et explosez vers le haut en sautant." },
      { name: "Superman Dorsal", target: 45, unit: "Secondes", mode: "time", type: "diamond", setup: "Allongé sur le ventre, maintenez buste et jambes décollés." },
      { name: "Burpees d'Élite", target: 10, unit: "Répétitions", mode: "reps", type: "jump", setup: "Pompe, ramené groupé, saut vertical explosif." }
    ];

    let list = [];
    for (let i = 0; i < 10; i++) {
      let idx = (day + i) % allMovements.length;
      list.push(allMovements[idx]);
    }
    return list;
  }

  // --- BASE DE DONNÉES NUTRITIONNELLE ---
  function getDayNutrition(day) {
    const menus = [
      {
        breakfast: "Flocons d'avoine (60g), 1 banane, 3 œufs brouillés, Thé vert sans sucre.",
        lunch: "Blanc de poulet grillé (150g), Quinoa (100g), Brocolis vapeur à l'huile d'olive.",
        snack: "1 Poignée d'amandes (30g), 1 Pomme, 1 Shaker de protéines (ou fromage blanc).",
        dinner: "Pavé de saumon au four, Patates douces rôties, Grande salade verte."
      },
      {
        breakfast: "Pancakes sains (Avoine/Œufs/Banane), 1 cuillère de beurre de cacahuète, Café noir.",
        lunch: "Steak haché 5% (150g), Pâtes complètes (100g), Haricots verts.",
        snack: "Yaourt grec nature, myrtilles, cerneaux de noix.",
        dinner: "Omelette (3 œufs), Épinards frais, 2 tranches de pain complet."
      },
      {
        breakfast: "Muesli sans sucre ajouté avec lait d'amande, 2 œufs à la coque, 1 Kiwi.",
        lunch: "Filet de dinde (150g), Riz basmati (100g), Courgettes sautées.",
        snack: "Galettes de riz, avocat écrasé, filet de citron.",
        dinner: "Cabillaud en papillote, Fondue de poireaux, un filet d'huile d'olive."
      }
    ];
    return menus[(day - 1) % menus.length];
  }

  // Injection globale de la perspective 3D et des styles (Zéro bordure garantie)
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      html, body, #root { margin: 0 !important; padding: 0 !important; width: 100vw !important; height: 100vh !important; overflow: hidden !important; background-color: #050811; font-family: 'Poppins', -apple-system, sans-serif; user-select: none; }
      .canvas-3d { perspective: 800px; width: 100%; height: 220px; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden; }
      .humanoid-3d { position: relative; width: 150px; height: 150px; transform-style: preserve-3d; transform: rotateX(-15deg) rotateY(35deg); }
      .head-3d { position: absolute; width: 28px; height: 28px; background: radial-gradient(circle at 30% 30%, #ffd0a0, #d4986a); border-radius: 50%; box-shadow: inset -2px -2px 6px rgba(0,0,0,0.4); }
      .chest-3d { position: absolute; width: 32px; height: 50px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 8px; box-shadow: inset -3px -3px 8px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3); }
      .hip-3d { position: absolute; width: 30px; height: 22px; background: linear-gradient(135deg, #1e3a8a, #0f172a); border-radius: 4px; box-shadow: inset -2px -2px 5px rgba(0,0,0,0.5); }
      .limb-3d { position: absolute; background: linear-gradient(to bottom, #f3f4f6, #9ca3af); border-radius: 6px; box-shadow: inset -2px -2px 5px rgba(0,0,0,0.4); transform-origin: top center; }
      @keyframes squatChest { 0%, 100% { transform: translateY(0) rotateX(-15deg) rotateY(35deg); } 50% { transform: translateY(45px) rotateX(-25deg) rotateY(35deg); } }
      @keyframes squatThigh { 0%, 100% { transform: rotateX(0deg); } 50% { transform: rotateX(-80deg); } }
      @keyframes squatCalf { 0%, 100% { transform: rotateX(0deg); } 50% { transform: rotateX(85deg); } }
      .anim-squat-chest { animation: squatChest 2.2s infinite ease-in-out; }
      .anim-squat-thigh { animation: squatThigh 2.2s infinite ease-in-out; }
      .anim-squat-calf { animation: squatCalf 2.2s infinite ease-in-out; }
      @keyframes pushupBody { 0%, 100% { transform: translateY(0) rotateX(75deg) rotateY(0deg) rotateZ(15deg); } 50% { transform: translateY(28px) rotateX(75deg) rotateY(0deg) rotateZ(15deg); } }
      @keyframes pushupArm { 0%, 100% { transform: rotateX(-30deg) rotateY(20deg); } 50% { transform: rotateX(-110deg) rotateY(45deg); } }
      .anim-pushup-body { animation: pushupBody 2s infinite ease-in-out; }
      .anim-pushup-arm { animation: pushupArm 2s infinite ease-in-out; }
      @keyframes climberLegLeft { 0%, 100% { transform: rotateX(10deg); } 50% { transform: rotateX(-65deg); } }
      @keyframes climberLegRight { 0%, 100% { transform: rotateX(-65deg); } 50% { transform: rotateX(10deg); } }
      .anim-climber-body { transform: translateY(15px) rotateX(65deg) rotateY(0deg) rotateZ(10deg); }
      .anim-climber-leg-L { animation: climberLegLeft 0.7s infinite linear; }
      .anim-climber-leg-R { animation: climberLegRight 0.7s infinite linear; }
      .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 20px; text-align: left; margin-bottom: 15px; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // RENDU DU COACH 3D
  const Render3DCoach = ({ type }) => {
    if (type === 'diamond' || type === 'pushup') {
      return (
        <div className="canvas-3d">
          <div className="humanoid-3d anim-pushup-body" style={{ top: '-10px', left: '10px' }}>
            <div className="head-3d" style={{ top: '-32px', left: '2px' }}></div>
            <div className="chest-3d" style={{ top: '0', left: '0' }}></div>
            <div className="limb-3d anim-pushup-arm" style={{ width: '10px', height: '45px', left: '-12px', top: '5px' }}></div>
            <div className="limb-3d anim-pushup-arm" style={{ width: '10px', height: '45px', right: '-12px', top: '5px', animationDelay: '0s' }}></div>
            <div className="hip-3d" style={{ top: '50px', left: '1px' }}></div>
            <div className="limb-3d" style={{ width: '11px', height: '65px', left: '2px', top: '72px' }}></div>
            <div className="limb-3d" style={{ width: '11px', height: '65px', right: '2px', top: '72px' }}></div>
          </div>
          <div style={{ position: 'absolute', bottom: '25px', width: '220px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}></div>
        </div>
      );
    }
    if (type === 'squat' || type === 'jump' || type === 'lunge') {
      return (
        <div className="canvas-3d">
          <div className="humanoid-3d anim-squat-chest">
            <div className="head-3d" style={{ top: '-30px', left: '2px' }}></div>
            <div className="chest-3d" style={{ top: '0', left: '0' }}></div>
            <div className="limb-3d" style={{ width: '10px', height: '45px', left: '-12px', top: '5px', transform: 'rotateX(-60deg)' }}></div>
            <div className="limb-3d" style={{ width: '10px', height: '45px', right: '-12px', top: '5px', transform: 'rotateX(-60deg)' }}></div>
            <div className="hip-3d" style={{ top: '50px', left: '1px' }}></div>
            <div className="limb-3d anim-squat-thigh" style={{ width: '12px', height: '40px', left: '2px', top: '70px', background: '#2563eb' }}>
              <div className="limb-3d anim-squat-calf" style={{ width: '11px', height: '40px', left: '0', top: '38px', background: '#1e3a8a' }}></div>
            </div>
            <div className="limb-3d anim-squat-thigh" style={{ width: '12px', height: '40px', right: '2px', top: '70px', background: '#2563eb' }}>
              <div className="limb-3d anim-squat-calf" style={{ width: '11px', height: '40px', right: '0', top: '38px', background: '#1e3a8a' }}></div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '25px', width: '220px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}></div>
        </div>
      );
    }
    return (
      <div className="canvas-3d">
        <div className="humanoid-3d anim-climber-body">
          <div className="head-3d" style={{ top: '-32px', left: '2px' }}></div>
          <div className="chest-3d" style={{ top: '0', left: '0' }}></div>
          <div className="limb-3d" style={{ width: '11px', height: '50px', left: '-12px', top: '5px', transform: 'rotateX(-15deg)' }}></div>
          <div className="limb-3d" style={{ width: '11px', height: '50px', right: '-12px', top: '5px', transform: 'rotateX(-15deg)' }}></div>
          <div className="hip-3d" style={{ top: '50px', left: '1px' }}></div>
          <div className="limb-3d anim-climber-leg-L" style={{ width: '11px', height: '55px', left: '2px', top: '70px', background: '#2563eb' }}></div>
          <div className="limb-3d anim-climber-leg-R" style={{ width: '11px', height: '55px', right: '2px', top: '70px', background: '#1e4ed8' }}></div>
        </div>
        <div style={{ position: 'absolute', bottom: '25px', width: '220px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}></div>
      </div>
    );
  };

  const screenWrapperStyle = { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, boxSizing: 'border-box', margin: 0, padding: '30px 20px', background: 'linear-gradient(rgba(5, 8, 17, 0.88), rgba(9, 13, 26, 0.96)), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600") no-repeat center center/cover', color: '#ffffff', textAlign: 'center', overflowY: 'auto' };

  // --- ÉCRAN 1 : CONNEXION ---
  if (!email || currentPath === '/') {
    return (
      <div style={screenWrapperStyle}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <h1 style={{ fontSize: '3.6rem', fontWeight: '900', margin: '20px 0 10px 0', letterSpacing: '-1.5px', lineHeight: '1' }}>Défi 60 Jours</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', marginBottom: '45px' }}>Zéro distraction. Ton coach 3D et ta nutrition au même endroit.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="Entrez votre e-mail..." required value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} style={{ padding: '20px 30px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1.1rem', textAlign: 'center', outline: 'none' }} />
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '20px', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase' }}>Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  if (currentPath === '/private-arena') {
    
    // --- ÉCRAN 2 : DASHBOARD ---
    if (workoutMode === 'dashboard') {
      return (
        <div style={screenWrapperStyle}>
          <button onClick={handleLogout} style={{ position: 'absolute', top: '30px', right: '40px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ef4444', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Quitter</button>

          <div style={{ maxWidth: '600px', width: '100%' }}>
            <h1 style={{ fontSize: '5rem', fontWeight: '900', margin: '10px 0 30px 0' }}>JOUR {currentDay}</h1>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '25px', marginBottom: '30px', display: 'flex', justifyContent: 'space-around', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div><span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>CALORIES</span><strong style={{ fontSize: '1.8rem', color: '#ff3e6c' }}>{calories} kcal</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* BOUTON SÉANCE SPORT */}
              <button onClick={startFullWorkout} style={{ background: '#3b82f6', color: 'white', border: 'none', width: '100%', padding: '25px', borderRadius: '100px', fontWeight: '900', fontSize: '1.4rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                🏋️ Lancer ma séance
              </button>
              
              {/* NOUVEAU : BOUTON NUTRITION */}
              <button onClick={() => setWorkoutMode('nutrition')} style={{ background: 'transparent', color: '#10b981', border: '2px solid #10b981', width: '100%', padding: '20px', borderRadius: '100px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                🍽️ Mon Plan Alimentaire du jour
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- NOUVEAU : ÉCRAN NUTRITION ---
    if (workoutMode === 'nutrition') {
      const diet = getDayNutrition(currentDay);
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '600px', width: '100%', paddingBottom: '40px' }}>
            <button onClick={() => setWorkoutMode('dashboard')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', marginBottom: '30px', cursor: 'pointer', fontWeight: 'bold' }}>
              ← Retour au Dashboard
            </button>
            <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', fontWeight: '900' }}>MENU DU JOUR {currentDay}</h2>
            
            <div className="glass-card">
              <span style={{ color: '#ff9f43', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>🌅 Petit-déjeuner</span>
              <p style={{ margin: '10px 0 0 0', fontSize: '1.1rem', lineHeight: '1.5' }}>{diet.breakfast}</p>
            </div>
            <div className="glass-card">
              <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>☀️ Déjeuner</span>
              <p style={{ margin: '10px 0 0 0', fontSize: '1.1rem', lineHeight: '1.5' }}>{diet.lunch}</p>
            </div>
            <div className="glass-card">
              <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>⚡ Goûter (Collation)</span>
              <p style={{ margin: '10px 0 0 0', fontSize: '1.1rem', lineHeight: '1.5' }}>{diet.snack}</p>
            </div>
            <div className="glass-card">
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>🌙 Dîner</span>
              <p style={{ margin: '10px 0 0 0', fontSize: '1.1rem', lineHeight: '1.5' }}>{diet.dinner}</p>
            </div>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 3 : PREPARATION (10s) ---
    if (workoutMode === 'preparation') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '650px', width: '100%' }}>
            <span style={{ fontSize: '1rem', color: '#ff9f43', fontWeight: 'bold', letterSpacing: '3px' }}>PRÉPARATION</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '15px 0 10px 0' }}>{currentEx.name}</h1>
            <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>
              Objectif : {currentEx.target} {currentEx.unit}
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '32px', padding: '20px', marginBottom: '35px' }}>
              <Render3DCoach type={currentEx.type} />
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '15px 0 0 0' }}>{currentEx.setup}</p>
            </div>

            <button onClick={startEffortPhase} style={{ background: '#10b981', color: 'white', border: 'none', padding: '18px 50px', borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer' }}>
              ⚡ Je suis prêt ({prepSeconds}s)
            </button>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 4 : EFFORT (HYBRIDE) ---
    if (workoutMode === 'effort') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '650px', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: '900', letterSpacing: '4px' }}>🔥 ACTION !</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '10px 0' }}>{currentEx.name}</h1>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '32px', padding: '20px', marginBottom: '35px' }}>
              <Render3DCoach type={currentEx.type} />
            </div>

            {/* LOGIQUE D'AFFICHAGE SELON LE MODE DE L'EXERCICE */}
            {currentEx.mode === 'time' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'bold' }}>TEMPS RESTANT</span>
                <span style={{ fontSize: '6rem', fontWeight: '900', color: '#10b981', lineHeight: '1', margin: '10px 0 20px 0' }}>{effortSeconds}s</span>
                <button onClick={triggerRestOrFinish} style={{ background: 'transparent', color: '#64748b', border: '1px solid #64748b', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer' }}>Passer</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 'bold', marginBottom: '20px' }}>
                  Fais {currentEx.target} Répétitions à ton rythme !
                </span>
                <span style={{ color: '#64748b', marginBottom: '20px' }}>Temps écoulé : {elapsedTime}s</span>
                <button onClick={triggerRestOrFinish} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '25px 40px', borderRadius: '100px', fontWeight: '900', fontSize: '1.3rem', cursor: 'pointer', width: '100%', textTransform: 'uppercase' }}>
                  ✅ J'ai fini mes répétitions
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- ÉCRAN 5 : REPOS ---
    if (workoutMode === 'rest') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <span style={{ fontSize: '1.1rem', color: '#ff9f43', fontWeight: 'bold', letterSpacing: '2px' }}>RÉCUPÉRATION</span>
            <p style={{ fontSize: '8rem', fontWeight: '900', color: '#ff9f43', margin: '10px 0 20px 0', lineHeight: '1' }}>{restSeconds}s</p>
            <button onClick={skipRestPeriod} style={{ padding: '20px 45px', borderRadius: '50px', border: 'none', background: '#ff9f43', color: '#050811', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', textTransform: 'uppercase' }}>Passer le repos →</button>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 6 : FIN ---
    if (workoutMode === 'finished') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '550px', width: '100%' }}>
            <span style={{ fontSize: '4.5rem' }}>👑</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', margin: '15px 0' }}>Séance Terminée !</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '45px' }}>Tu as tout explosé aujourd'hui.</p>
            <button onClick={confirmDayAndClose} style={{ background: '#ffffff', color: '#050811', border: 'none', width: '100%', padding: '22px', borderRadius: '100px', fontWeight: '900', fontSize: '1.25rem', cursor: 'pointer', textTransform: 'uppercase' }}>🏆 Valider ma journée</button>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default App;

