import React, { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState(() => localStorage.getItem('defi_fullscreen_email') || '');
  const [isProfileComplete, setIsProfileComplete] = useState(() => localStorage.getItem('user_stats') !== null);
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('user_stats')) || { age: '', weight: '', height: '', goal: 'fat_loss' });
  
  const [currentPath, setCurrentPath] = useState(() => {
    const savedEmail = localStorage.getItem('defi_fullscreen_email');
    return savedEmail ? '/private-arena' : '/';
  });
  
  const [inputEmail, setInputEmail] = useState('');
  const [currentDay, setCurrentDay] = useState(1);
  const [calories, setCalories] = useState(0);
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [effortSeconds, setEffortSeconds] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restSeconds, setRestSeconds] = useState(30);

  // --- LOGIQUE DE COACHING PERSONNALISÉ ---
  const handleStatsSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user_stats', JSON.stringify(stats));
    setIsProfileComplete(true);
  };

  function getDayProgram(day) {
    const isLoss = stats.goal === 'fat_loss';
    const cardio = [
      { name: "Burpees", target: 12, unit: "Réps", mode: "reps", type: "pushup", setup: "Explosez vers le haut, enchaînez avec une pompe." },
      { name: "Mountain Climbers", target: 45, unit: "Secondes", mode: "time", type: "climber", setup: "Gainage actif, genoux vers la poitrine." },
      { name: "Squats Sauts", target: 15, unit: "Réps", mode: "reps", type: "squat", setup: "Amortissez la réception, repartez directement." }
    ];
    const muscle = [
      { name: "Pompes Diamant", target: 15, unit: "Réps", mode: "reps", type: "pushup", setup: "Ciblage pectoraux et triceps intense." },
      { name: "Squats Profonds", target: 20, unit: "Réps", mode: "reps", type: "squat", setup: "Focus hypertrophie, descendez sous les genoux." },
      { name: "Gainage lesté", target: 60, unit: "Secondes", mode: "time", type: "plank", setup: "Contractez tout le corps, restez immobile." }
    ];
    return isLoss ? cardio : muscle;
  }

  function getDayNutrition(day) {
    return stats.goal === 'fat_loss' 
      ? { breakfast: "Omelette 2 œufs + épinards", lunch: "Poulet grillé + quinoa", snack: "1 pomme + amandes", dinner: "Pavé de cabillaud + asperges" }
      : { breakfast: "Flocons d'avoine + whey + beurre cacahuète", lunch: "Steak haché 5% + riz complet", snack: "Fromage blanc + miel", dinner: "Saumon + patates douces" };
  }

  // --- RESTE DU SCRIPT ORIGINAL (GARDÉ TEL QUEL) ---
  useEffect(() => {
    if (email) {
      const savedDay = localStorage.getItem(`${email}_fs_day`);
      const savedCalories = localStorage.getItem(`${email}_fs_calories`);
      setCurrentDay(savedDay ? Number(savedDay) : 1);
      setCalories(savedCalories ? Number(savedCalories) : 0);
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      localStorage.setItem('defi_fullscreen_email', email);
      localStorage.setItem(`${email}_fs_day`, currentDay);
      localStorage.setItem(`${email}_fs_calories`, calories);
    }
  }, [currentDay, calories, email]);

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

  useEffect(() => {
    let timer = null;
    if (workoutMode === 'effort') {
      if (currentEx.mode === 'time') {
        if (effortSeconds > 0) {
          timer = setInterval(() => setEffortSeconds(s => s - 1), 1000);
        } else if (effortSeconds === 0) {
          triggerRestOrFinish();
        }
      } else if (currentEx.mode === 'reps') {
        timer = setInterval(() => setElapsedTime(s => s + 1), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [workoutMode, effortSeconds, currentEx?.mode]);

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
    localStorage.setItem('defi_fullscreen_email', cleanEmail);
    navigateTo('/private-arena');
  };

  const handleLogout = () => {
    localStorage.removeItem('defi_fullscreen_email');
    localStorage.removeItem('user_stats');
    setEmail('');
    setInputEmail('');
    setWorkoutMode('dashboard');
    setIsProfileComplete(false);
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
    if (ex && ex.mode === 'time') {
      setEffortSeconds(ex.target);
    }
  };

  const startEffortPhase = () => {
    const ex = program[currentExerciseIndex];
    setElapsedTime(0);
    if (ex && ex.mode === 'time') setEffortSeconds(ex.target);
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

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      html, body, #root { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background-color: #050811; font-family: 'Poppins', sans-serif; color: white; }
      .canvas-3d { perspective: 1000px; width: 100%; height: 260px; display: flex; justify-content: center; align-items: center; position: relative; background: radial-gradient(circle, rgba(30,41,59,0.2) 0%, rgba(5,8,17,0) 70%); border-radius: 20px; }
      .human-body { position: relative; width: 120px; height: 200px; transform-style: preserve-3d; transform: rotateX(-10deg) rotateY(30deg); }
      .h-head { position: absolute; width: 26px; height: 32px; background: #e0a980; border-radius: 40%; top: 0; left: 47px; }
      .h-torso { position: absolute; width: 44px; height: 65px; background: #2563eb; border-radius: 10px; top: 34px; left: 38px; }
      .h-arm { position: absolute; width: 14px; height: 35px; background: #e0a980; border-radius: 7px; transform-origin: top center; }
      .h-forearm { position: absolute; width: 12px; height: 35px; background: #e0a980; border-radius: 6px; bottom: -30px; left: 1px; transform-origin: top center; }
      .h-thigh { position: absolute; width: 16px; height: 45px; background: #1e4ed8; border-radius: 8px; transform-origin: top center; }
      .h-shin { position: absolute; width: 13px; height: 45px; background: #e0a980; border-radius: 6px; bottom: -40px; left: 1px; transform-origin: top center; }
      .left-arm { top: 36px; left: 22px; } .right-arm { top: 36px; left: 84px; }
      .left-leg { top: 118px; left: 42px; } .right-leg { top: 118px; left: 62px; }
      .glass-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 22px; margin-bottom: 15px; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const RenderAnatomicalHuman = ({ type }) => (
    <div className="canvas-3d">
      <div className="human-body">
        <div className="h-head"></div><div className="h-torso"></div>
        <div className="h-arm left-arm"><div className="h-forearm"></div></div>
        <div className="h-arm right-arm"><div className="h-forearm"></div></div>
        <div className="h-thigh left-leg"><div className="h-shin"></div></div>
        <div className="h-thigh right-leg"><div className="h-shin"></div></div>
      </div>
    </div>
  );

  const screenWrapperStyle = { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '30px', background: 'linear-gradient(rgba(5, 8, 17, 0.95), rgba(9, 13, 26, 0.95))', color: '#ffffff', textAlign: 'center', overflowY: 'auto' };

  // --- ÉCRANS ---
  if (!email || currentPath === '/') {
    return (
      <div style={screenWrapperStyle}>
        <h1>Défi 60 Jours</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="E-mail" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} style={{ padding: '15px', borderRadius: '50px' }} />
          <button type="submit" style={{ padding: '15px', borderRadius: '50px', background: '#3b82f6', color: 'white' }}>Se connecter</button>
        </form>
      </div>
    );
  }

  if (email && !isProfileComplete) {
    return (
      <div style={screenWrapperStyle}>
        <h2>Profil athlète</h2>
        <form onSubmit={handleStatsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <input type="number" placeholder="Âge" required onChange={(e) => setStats({...stats, age: e.target.value})} />
          <input type="number" placeholder="Poids (kg)" required onChange={(e) => setStats({...stats, weight: e.target.value})} />
          <input type="number" placeholder="Taille (cm)" required onChange={(e) => setStats({...stats, height: e.target.value})} />
          <select onChange={(e) => setStats({...stats, goal: e.target.value})}>
            <option value="fat_loss">Perte de gras</option>
            <option value="muscle_gain">Prise de masse</option>
          </select>
          <button type="submit" style={{ background: '#10b981', padding: '15px' }}>Démarrer mon programme</button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD ET RESTE DU FLUX ORIGINAL ---
  if (workoutMode === 'dashboard') {
    return (
      <div style={screenWrapperStyle}>
        <h1>JOUR {currentDay}</h1>
        <button onClick={startFullWorkout} style={{ padding: '20px', margin: '10px' }}>Lancer la séance</button>
        <button onClick={() => setWorkoutMode('nutrition')} style={{ padding: '20px' }}>Menu du jour</button>
        <button onClick={handleLogout} style={{ marginTop: '20px', color: 'red' }}>Déconnexion</button>
      </div>
    );
  }

  if (workoutMode === 'nutrition') {
    const diet = getDayNutrition(currentDay);
    return (
      <div style={screenWrapperStyle}>
        <button onClick={() => setWorkoutMode('dashboard')}>Retour</button>
        <h2>Menu</h2>
        <p>PDJ: {diet.breakfast}</p><p>Déjeuner: {diet.lunch}</p><p>Goûter: {diet.snack}</p><p>Dîner: {diet.dinner}</p>
      </div>
    );
  }

  if (workoutMode === 'preparation') {
    return (
      <div style={screenWrapperStyle}>
        <h1>{currentEx.name}</h1>
        <RenderAnatomicalHuman type={currentEx.type} />
        <button onClick={startEffortPhase}>Commencer ({prepSeconds}s)</button>
      </div>
    );
  }

  if (workoutMode === 'effort') {
    return (
      <div style={screenWrapperStyle}>
        <h1>{currentEx.name}</h1>
        <RenderAnatomicalHuman type={currentEx.type} />
        <h2>{currentEx.mode === 'time' ? `${effortSeconds}s` : `Répétitions : ${elapsedTime}s`}</h2>
        <button onClick={triggerRestOrFinish}>Terminer</button>
      </div>
    );
  }

  if (workoutMode === 'rest') {
    return <div style={screenWrapperStyle}><h1>Repos</h1><p>{restSeconds}s</p></div>;
  }

  if (workoutMode === 'finished') {
    return <div style={screenWrapperStyle}><h1>Séance terminée !</h1><button onClick={confirmDayAndClose}>Valider</button></div>;
  }

  return null;
}

export default App;

