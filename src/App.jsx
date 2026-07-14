import React, { useState, useEffect } from 'react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [email, setEmail] = useState(() => localStorage.getItem('defi_fullscreen_email') || '');
  const [inputEmail, setInputEmail] = useState('');
  
  // États de progression
  const [currentDay, setCurrentDay] = useState(1);
  const [calories, setCalories] = useState(0);
  const [hasPaid, setHasPaid] = useState(false);

  // Moteur du flux d'entraînement
  // Modes : 'dashboard' | 'preparation' | 'effort' | 'rest' | 'finished'
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [restSeconds, setRestSeconds] = useState(30);

  // Charger la session active
  useEffect(() => {
    if (email) {
      const savedDay = localStorage.getItem(`${email}_fs_day`);
      const savedCalories = localStorage.getItem(`${email}_fs_calories`);
      const savedPaid = localStorage.getItem(`${email}_fs_paid`);

      setCurrentDay(savedDay ? Number(savedDay) : 1);
      setCalories(savedCalories ? Number(savedCalories) : 0);
      setHasPaid(savedPaid === 'true');
    }
  }, [email]);

  // Sauvegarder la session active
  useEffect(() => {
    if (email) {
      localStorage.setItem('defi_fullscreen_email', email);
      localStorage.setItem(`${email}_fs_day`, currentDay);
      localStorage.setItem(`${email}_fs_calories`, calories);
      localStorage.setItem(`${email}_fs_paid`, hasPaid);
    }
  }, [currentDay, calories, email, hasPaid]);

  // Gestionnaire du compte à rebours de préparation (10 secondes)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'preparation' && prepSeconds > 0) {
      timer = setInterval(() => setPrepSeconds(s => s - 1), 1000);
    } else if (workoutMode === 'preparation' && prepSeconds === 0) {
      setWorkoutMode('effort');
    }
    return () => clearInterval(timer);
  }, [workoutMode, prepSeconds]);

  // Gestionnaire du chronomètre de repos (30 secondes)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'rest' && restSeconds > 0) {
      timer = setInterval(() => setRestSeconds(s => s - 1), 1000);
    } else if (workoutMode === 'rest' && restSeconds === 0) {
      moveToNextExercise();
    }
    return () => clearInterval(timer);
  }, [workoutMode, restSeconds]);

  // Forcer la navigation fluide
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

  // Lancement complet de la session
  const startFullWorkout = () => {
    setCurrentExerciseIndex(0);
    setPrepSeconds(10);
    setWorkoutMode('preparation');
  };

  const validateExerciseSeries = () => {
    const program = getDayProgram(currentDay);
    if (currentExerciseIndex === program.length - 1) {
      // Fin complète de tous les exercices du jour
      setWorkoutMode('finished');
    } else {
      setRestSeconds(30);
      setWorkoutMode('rest');
    }
  };

  const moveToNextExercise = () => {
    setCurrentExerciseIndex(prev => prev + 1);
    setPrepSeconds(10);
    setWorkoutMode('preparation');
  };

  const confirmDayAndClose = () => {
    setCalories(prev => prev + 280);
    setCurrentDay(prev => prev + 1);
    setWorkoutMode('dashboard');
  };

  // Base de données des exercices structurée
  const getDayProgram = (day) => {
    const allMovements = [
      { name: "Pompes au sol classiques", target: "15 Répétitions", type: "pushup", setup: "Mains écartées à la largeur des épaules, alignement parfait du corps." },
      { name: "Squats profonds", target: "20 Répétitions", type: "squat", setup: "Pieds largeur d'épaules, descendez les fesses sous la ligne des genoux." },
      { name: "Pompes Diamant serrées", target: "10 Répétitions", type: "diamond", setup: "Mains jointes sous la poitrine formant un losange, coudes serrés." },
      { name: "Fentes alternées dynamiques", target: "16 Répétitions", type: "lunge", setup: "Faites un grand pas en avant, fléchissez le genou arrière à 90°." },
      { name: "Gainage Planche abdominale", target: "45 Secondes", type: "plank", setup: "Appui sur les avant-bras, contractez intensément les abdos." },
      { name: "Mountain Climbers rapides", target: "40 Secondes", type: "climber", setup: "En position de pompe, ramenez alternativement les genoux au buste." },
      { name: "Dips arrière sur support", target: "12 Répétitions", type: "dips", setup: "Mains sur le bord d'un appui, descendez les fesses verticalement." },
      { name: "Squats Jumps explosifs", target: "12 Répétitions", type: "jump", setup: "Effectuez un squat complet puis sautez de façon explosive." },
      { name: "Superman extension dorsale", target: "15 Répétitions", type: "superman", setup: "Allongé sur le ventre, décollez simultanément le buste et les cuisses." },
      { name: "Burpees d'élite", target: "8 Répétitions", type: "burpee", setup: "Basculez au sol en planche, ramenez les pieds et redressez-vous." }
    ];

    // Génère une rotation cohérente de 10 mouvements selon le jour choisi
    let list = [];
    for (let i = 0; i < 10; i++) {
      let idx = (day + i) % allMovements.length;
      list.push(allMovements[idx]);
    }
    return list;
  };

  // Injection immédiate des styles CSS réinitialisant l'écran du navigateur pour un plein écran absolu
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      html, body, #root {
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        background-color: #090d16;
        font-family: 'Poppins', -apple-system, sans-serif;
      }

      /* Styles des Personnages Articulés CSS */
      .character-container {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 0 auto;
      }

      /* Base anatomique du coach virtuel */
      .head { width: 30px; height: 30px; background: #e0a96d; border-radius: 50%; position: absolute; left: 85px; top: 30px; }
      .torso { width: 16px; height: 65px; background: #3b82f6; position: absolute; left: 92px; top: 62px; border-radius: 8px; transform-origin: top center; }
      .arm-left { width: 10px; height: 50px; background: #2563eb; position: absolute; left: 84px; top: 64px; border-radius: 5px; transform-origin: top center; }
      .arm-right { width: 10px; height: 50px; background: #2563eb; position: absolute; left: 106px; top: 64px; border-radius: 5px; transform-origin: top center; }
      .leg-left { width: 12px; height: 60px; background: #1e3a8a; position: absolute; left: 88px; top: 124px; border-radius: 6px; transform-origin: top center; }
      .leg-right { width: 12px; height: 60px; background: #1e3a8a; position: absolute; left: 100px; top: 124px; border-radius: 6px; transform-origin: top center; }

      /* Animation Spécifique : Pompes */
      @keyframes pushupMotion {
        0%, 100% { transform: translateY(0) rotate(-75deg); }
        50% { transform: translateY(35px) rotate(-85deg); }
      }
      .anim-body-pushup { transform: rotate(75deg); position: absolute; top: -10px; left: 30px; animation: pushupMotion 2s infinite ease-in-out; }

      /* Animation Spécifique : Squat */
      @keyframes torsoSquat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(40px); } }
      @keyframes legsSquat { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.5); } }
      .anim-torso-squat { animation: torsoSquat 2s infinite ease-in-out; }
      .anim-legs-squat { animation: legsSquat 2s infinite ease-in-out; }

      /* Animation Spécifique : Climber */
      @keyframes legClimb { 0%, 100% { transform: rotate(15deg); } 50% { transform: rotate(-45deg); } }
      .anim-leg-climb-1 { animation: legClimb 0.6s infinite linear; }
      .anim-leg-climb-2 { animation: legClimb 0.6s infinite linear reverse; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Composant interne générant les animations anatomiques épurées selon l'exercice en cours
  const RenderCoachAnimation = ({ type }) => {
    if (type === 'pushup' || type === 'diamond') {
      return (
        <div className="character-container" style={{ transform: 'rotate(-10deg) scale(1.2)' }}>
          <div className="anim-body-pushup">
            <div className="head" style={{ left: '140px', top: '20px' }}></div>
            <div className="torso" style={{ left: '80px', top: '30px', width: '60px', height: '18px', transform: 'none' }}></div>
            <div className="leg-left" style={{ left: '20px', top: '32px', width: '65px', height: '14px', transform: 'none' }}></div>
            <div className="arm-left" style={{ left: '120px', top: '45px', width: '12px', height: '40px', transform: 'none' }}></div>
          </div>
          <div style={{ position: 'absolute', bottom: '50px', width: '100%', height: '4px', background: '#475569' }}></div>
        </div>
      );
    }

    if (type === 'squat' || type === 'jump' || type === 'lunge') {
      return (
        <div className="character-container" style={{ transform: 'scale(1.2)' }}>
          <div className="anim-torso-squat" style={{ position: 'relative', zIndex: 2 }}>
            <div className="head" style={{ top: '10px' }}></div>
            <div className="torso" style={{ top: '42px' }}></div>
            <div className="arm-left" style={{ top: '45px', transform: 'rotate(-45deg)' }}></div>
          </div>
          <div className="anim-legs-squat" style={{ position: 'absolute', top: '105px', width: '100%', height: '80px', transformOrigin: 'bottom center' }}>
            <div className="leg-left" style={{ top: '0', left: '88px' }}></div>
            <div className="leg-right" style={{ top: '0', left: '100px' }}></div>
          </div>
          <div style={{ position: 'absolute', bottom: '15px', left: '50px', width: '100px', height: '4px', background: '#475569' }}></div>
        </div>
      );
    }

    // Par défaut / Mouvements de type cardio/gainage alterné
    return (
      <div className="character-container" style={{ transform: 'scale(1.2)' }}>
        <div style={{ transform: 'rotate(75deg)', position: 'absolute', top: '20px', left: '30px' }}>
          <div className="head" style={{ left: '130px', top: '20px' }}></div>
          <div className="torso" style={{ left: '75px', top: '28px', width: '60px', height: '18px' }}></div>
          <div className="arm-left" style={{ left: '115px', top: '44px', width: '12px', height: '35px' }}></div>
          <div className="anim-leg-climb-1" style={{ position: 'absolute', left: '20px', top: '28px', transformOrigin: 'right center' }}>
            <div className="leg-left" style={{ left: 0, top: 0, width: '55px', height: '14px' }}></div>
          </div>
          <div className="anim-leg-climb-2" style={{ position: 'absolute', left: '20px', top: '34px', transformOrigin: 'right center' }}>
            <div className="leg-right" style={{ left: 0, top: 0, width: '55px', height: '14px', background: '#3b82f6' }}></div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '45px', width: '100%', height: '4px', background: '#475569' }}></div>
      </div>
    );
  };

  // Styles CSS en ligne structurants pour garantir l'absence totale de blancs autour
  const screenWrapperStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    boxSizing: 'border-box',
    margin: 0,
    padding: '40px 20px',
    background: 'linear-gradient(rgba(11, 18, 32, 0.82), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1600") no-repeat center center/cover',
    color: '#ffffff',
    textAlign: 'center'
  };

  // --- INTERFACE 1 : ÉCRAN D'ACCUEIL / CONNEXION ---
  if (!email || currentPath === '/') {
    return (
      <div style={screenWrapperStyle}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <span style={{ fontSize: '0.9rem', background: '#ff3e6c', color: 'white', padding: '6px 16px', borderRadius: '50px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Système Ultra-Focus Pro</span>
          <h1 style={{ fontSize: '3.8rem', fontWeight: '900', margin: '20px 0 10px 0', letterSpacing: '-1.5px', lineHeight: '1' }}>Défi 60 Jours</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.5' }}>Zéro distraction. Un écran exclusif par mouvement. Entraînez-vous à haute intensité.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" placeholder="Entrez votre e-mail de session..." required value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              style={{ padding: '20px 30px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1.1rem', textAlign: 'center', outline: 'none', backdropFilter: 'blur(10px)' }}
            />
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '20px', borderRadius: '50px', fontWeight: '900', fontSize: '1.15rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Démarrer le Défi Gratuit
            </button>
          </form>

          {email && (
            <button onClick={() => navigateTo('/private-arena')} style={{ background: 'none', border: 'none', color: '#3b82f6', marginTop: '25px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', fontSize: '0.95rem' }}>
              ⚡ Reprendre ma session active ({email})
            </button>
          )}
        </div>
      </div>
    );
  }

  const program = getDayProgram(currentDay);
  const currentEx = program[currentExerciseIndex];

  // --- INTERFACE 2 : MODE INTERNE ENTRAÎNEMENT ---
  if (currentPath === '/private-arena') {
    
    // ÉCRAN UNIQUE A : TABLEAU DE BORD DU JOUR / ENTRÉE
    if (workoutMode === 'dashboard') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ position: 'absolute', top: '30px', left: '40px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>🏆 ARENA</span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.8rem', color: '#94a3b8' }}>{email}</span>
          </div>
          <button onClick={handleLogout} style={{ position: 'absolute', top: '30px', right: '40px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ef4444', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Quitter</button>

          <div style={{ maxWidth: '600px', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>PROCHAINE ÉTAPE DE TON ÉVOLUTION</span>
            <h1 style={{ fontSize: '5rem', fontWeight: '900', margin: '10px 0 30px 0', letterSpacing: '-2px' }}>JOUR {currentDay}</h1>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '25px', marginBottom: '40px', display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>CALORIES BRÛLÉES</span>
                <strong style={{ fontSize: '1.8rem', color: '#ff3e6c' }}>{calories} kcal</strong>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>VOLUME SÉANCE</span>
                <strong style={{ fontSize: '1.8rem', color: '#3b82f6' }}>10 Exercices focus</strong>
              </div>
            </div>

            <button onClick={startFullWorkout} style={{ background: '#3b82f6', color: 'white', border: 'none', width: '100%', padding: '25px', borderRadius: '100px', fontWeight: '900', fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🏋️ Lancer ma séance du jour
            </button>
          </div>
        </div>
      );
    }

    // ÉCRAN UNIQUE B : PREPARATION REQUIS (10 SECONDES AVEC GUIDAGE TECHNIQUE)
    if (workoutMode === 'preparation') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '650px', width: '100%' }}>
            <span style={{ fontSize: '1rem', color: '#ff9f43', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }}>PRÉPARE-TOI AU SOL</span>
            
            <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '15px 0 5px 0' }}>{currentEx.name}</h1>
            <p style={{ color: '#ff9f43', fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 40px 0' }}>Cible : {currentEx.target}</p>

            {/* COACH VISUEL EN ACTION DÈS LA PHASE DE PRÉPARATION */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '30px', marginBottom: '40px' }}>
              <RenderCoachAnimation type={currentEx.type} />
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '500px', margin: '20px auto 0 auto', lineHeight: '1.6' }}>
                <strong>Placement :</strong> {currentEx.setup}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'bold' }}>TOP CHRONO DANS</span>
              <span style={{ fontSize: '5.5rem', fontWeight: '900', color: '#ffffff', lineHeight: '1' }}>{prepSeconds}s</span>
            </div>
          </div>
        </div>
      );
    }

    // ÉCRAN UNIQUE C : EFFORT EN ACTION ("TOP !")
    if (workoutMode === 'effort') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '650px', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: '900', letterSpacing: '4px' }}>🔥 TOP ! ACTION !</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '10px 0 0 0' }}>{currentEx.name}</h1>
            <span style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '8px 24px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '15px', marginBottom: '35px' }}>
              OBJECTIF À ATTEINDRE : {currentEx.target}
            </span>

            {/* RAPPEL CONTINU DU GUIDE VISUEL DE CADENCE */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '30px', marginBottom: '40px' }}>
              <RenderCoachAnimation type={currentEx.type} />
            </div>

            <button onClick={validateExerciseSeries} style={{ background: '#10b981', color: 'white', border: 'none', width: '100%', padding: '25px', borderRadius: '100px', fontWeight: '900', fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4)', textTransform: 'uppercase' }}>
              ✅ J'AI TERMINÉ TOUTES MES RÉPÉTITIONS
            </button>
            
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '20px' }}>Mouvement {currentExerciseIndex + 1} sur 10 validés aujourd'hui</p>
          </div>
        </div>
      );
    }

    // ÉCRAN UNIQUE D : RÉCUPÉRATION / REPOS MUSCULAIRE
    if (workoutMode === 'rest') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <span style={{ fontSize: '1rem', color: '#ff9f43', fontWeight: 'bold', letterSpacing: '2px' }}>RÉCUPÉRATION REQUIS</span>
            <p style={{ fontSize: '8rem', fontWeight: '900', color: '#ff9f43', margin: '10px 0 20px 0', lineHeight: '1' }}>{restSeconds}s</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
              <button onClick={() => setRestSeconds(prev => prev + 10)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>+10s repos</button>
              <button onClick={() => setRestSeconds(0)} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid #ff9f43', background: '#ff9f43', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Passer →</button>
            </div>

            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Prochain exercice planifié : <strong style={{ color: 'white' }}>{program[currentExerciseIndex + 1]?.name}</strong>
            </div>
          </div>
        </div>
      );
    }

    // ÉCRAN UNIQUE E : CLÔTURE DE LA SÉANCE
    if (workoutMode === 'finished') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '550px', width: '100%' }}>
            <span style={{ fontSize: '4rem' }}>👑</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', margin: '15px 0' }}>Séance du Jour {currentDay} Terminée !</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
              Tu as complété les 10 fiches d'exercices isolées prévues avec une exécution technique parfaite.
            </p>

            <button onClick={confirmDayAndClose} style={{ background: '#ffffff', color: '#090d16', border: 'none', width: '100%', padding: '22px', borderRadius: '100px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🏆 Enregistrer l'effort et fermer la journée
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default App;
