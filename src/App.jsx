import React, { useState, useEffect } from 'react';

function App() {
  // --- ÉTATS ---
  const [email, setEmail] = useState(() => localStorage.getItem('defi_fullscreen_email') || '');
  const [currentPath, setCurrentPath] = useState(() => localStorage.getItem('defi_fullscreen_email') ? '/private-arena' : '/');
  const [inputEmail, setInputEmail] = useState('');
  
  const [currentDay, setCurrentDay] = useState(() => Number(localStorage.getItem('user_day')) || 1);
  const [calories, setCalories] = useState(0);
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [effortSeconds, setEffortSeconds] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restSeconds, setRestSeconds] = useState(30);

  // --- LOGIQUE NUTRITION ET PROGRAMME ---
  const getDayProgram = (day) => {
    const allMovements = [
      { name: "Pompes Classiques", target: 15, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Mains écartées, corps droit, descendez la poitrine près du sol." },
      { name: "Mountain Climbers", target: 60, unit: "Secondes", mode: "time", type: "climber", setup: "En position de planche, ramenez alternativement vos genoux vers la poitrine." },
      { name: "Squats Profonds", target: 20, unit: "Répétitions", mode: "reps", type: "squat", setup: "Pieds largeur d'épaules, descendez les fesses sous la ligne des genoux." },
      { name: "Gainage Planche", target: 60, unit: "Secondes", mode: "time", type: "plank", setup: "Sur les avant-bras, contractez les abdos et fessiers, ne creusez pas le dos." },
      { name: "Pompes Diamant", target: 10, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Formez un diamant avec vos index et pouces sous votre poitrine." }
    ];
    return Array.from({ length: 5 }, (_, i) => allMovements[(day + i) % allMovements.length]);
  };

  const getDayNutrition = (day) => {
    const nutritionLibrary = [
      { breakfast: "Oatmeal & Fruits", lunch: "Poulet grillé et riz", snack: "Amandes", dinner: "Saumon et brocolis" },
      { breakfast: "Omelette 3 œufs", lunch: "Dinde et patate douce", snack: "Yaourt grec", dinner: "Salade de thon" },
      { breakfast: "Smoothie protéiné", lunch: "Bœuf maigre et quinoa", snack: "1 Pomme", dinner: "Soupe de légumes" }
    ];
    return nutritionLibrary[(day - 1) % nutritionLibrary.length];
  };

  const program = getDayProgram(currentDay);
  const currentEx = program[currentExerciseIndex] || program[0];

  // --- EFFETS ET TIMERS ---
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'preparation' && prepSeconds > 0) timer = setInterval(() => setPrepSeconds(s => s - 1), 1000);
    else if (workoutMode === 'preparation' && prepSeconds === 0) setWorkoutMode('effort');
    return () => clearInterval(timer);
  }, [workoutMode, prepSeconds]);

  useEffect(() => {
    let timer = null;
    if (workoutMode === 'effort') {
      if (currentEx.mode === 'time') {
        if (effortSeconds > 0) timer = setInterval(() => setEffortSeconds(s => s - 1), 1000);
        else triggerRestOrFinish();
      } else {
        timer = setInterval(() => setElapsedTime(s => s + 1), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [workoutMode, effortSeconds, currentEx]);

  useEffect(() => {
    let timer = null;
    if (workoutMode === 'rest' && restSeconds > 0) timer = setInterval(() => setRestSeconds(s => s - 1), 1000);
    else if (workoutMode === 'rest' && restSeconds === 0) moveToNextExercise();
    return () => clearInterval(timer);
  }, [workoutMode, restSeconds]);

  // --- ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputEmail.includes('@')) {
      setEmail(inputEmail);
      localStorage.setItem('defi_fullscreen_email', inputEmail);
      setCurrentPath('/private-arena');
    }
  };

  const startFullWorkout = () => {
    setCurrentExerciseIndex(0);
    setPrepSeconds(10);
    setRestSeconds(30);
    setWorkoutMode('preparation');
  };

  const triggerRestOrFinish = () => {
    if (currentExerciseIndex === program.length - 1) setWorkoutMode('finished');
    else setWorkoutMode('rest');
  };

  const moveToNextExercise = () => {
    setCurrentExerciseIndex(prev => prev + 1);
    setPrepSeconds(10);
    setRestSeconds(30);
    setWorkoutMode('preparation');
  };

  // --- STYLES ET RENDU ---
  const screenStyle = { 
    width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(rgba(5, 8, 17, 0.90), rgba(9, 13, 26, 0.97)), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd")', 
    backgroundSize: 'cover', color: '#fff', textAlign: 'center', padding: '20px', overflowY: 'auto' 
  };

  // 1. PAGE DE VENTE (Landin Page)
  if (currentPath === '/') {
    return (
      <div style={screenStyle}>
        <h1 style={{ fontSize: '3.6rem' }}>Défi 60 Jours</h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Transforme tes habitudes et atteins tes objectifs.</p>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
          <input type="email" placeholder="Entrez votre e-mail..." onChange={(e) => setInputEmail(e.target.value)} style={{ padding: '20px', width: '100%', borderRadius: '50px', border: 'none', marginBottom: '10px' }} />
          <button type="submit" style={{ padding: '20px', width: '100%', borderRadius: '50px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 'bold' }}>COMMENCER LE DÉFI (4,99 €)</button>
        </form>
      </div>
    );
  }

  // 2. DASHBOARD / APP
  return (
    <div style={screenStyle}>
      {workoutMode === 'dashboard' && (
        <>
          <h1>JOUR {currentDay}</h1>
          <button onClick={startFullWorkout} style={{ padding: '20px 40px', background: '#3b82f6', border: 'none', borderRadius: '50px', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>LANCER LA SÉANCE</button>
          <button onClick={() => setWorkoutMode('nutrition')} style={{ marginTop: '20px', background: 'transparent', color: '#10b981', border: '1px solid #10b981', padding: '15px 30px', borderRadius: '50px' }}>Mon Plan Alimentaire</button>
        </>
      )}

      {workoutMode === 'nutrition' && (
        <div style={{ maxWidth: '600px' }}>
          <button onClick={() => setWorkoutMode('dashboard')}>← Retour</button>
          <h2>Menu du jour {currentDay}</h2>
          <p>Petit-déjeuner : {getDayNutrition(currentDay).breakfast}</p>
          <p>Déjeuner : {getDayNutrition(currentDay).lunch}</p>
          <p>Dîner : {getDayNutrition(currentDay).dinner}</p>
        </div>
      )}

      {workoutMode === 'preparation' && (
        <div>
          <h2>Préparation...</h2>
          <h1>{prepSeconds}s</h1>
          <p>{currentEx.name}</p>
        </div>
      )}

      {workoutMode === 'effort' && (
        <div>
          <h1>{currentEx.name}</h1>
          <p>{currentEx.mode === 'time' ? `Temps restant : ${effortSeconds}s` : `Chrono : ${elapsedTime}s`}</p>
          <button onClick={triggerRestOrFinish}>Terminer</button>
        </div>
      )}

      {workoutMode === 'finished' && (
        <div>
          <h1>Séance Terminée !</h1>
          <button onClick={() => { setCurrentDay(d => d + 1); setWorkoutMode('dashboard'); }}>Valider le Jour {currentDay}</button>
        </div>
      )}
    </div>
  );
}

export default App;
