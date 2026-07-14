import React, { useState, useEffect } from 'react';

function App() {
  // --- 1. ÉTATS : PROFIL & SESSION ---
  const [step, setStep] = useState(() => localStorage.getItem('user_profile') ? 'dashboard' : 'login');
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('user_profile')) || { height: '', weight: '', dob: '' });
  const [email, setEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentDay, setCurrentDay] = useState(1);
  const [calories, setCalories] = useState(0);

  // États du chrono (Exercices)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [effortSeconds, setEffortSeconds] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restSeconds, setRestSeconds] = useState(30);

  // --- 2. LOGIQUE MÉTIER & PERSONNALISATION ---
  const getCoachingPlan = () => {
    const imc = profile.weight / ((profile.height / 100) ** 2);
    const goal = imc > 25 ? 'Perte de gras' : 'Prise de masse';
    const calTarget = goal === 'Perte de gras' ? 1800 : 2800;
    return { goal, calTarget };
  };

  const plan = getCoachingPlan();

  const getDayNutrition = () => {
    return plan.goal === 'Perte de gras' 
      ? { breakfast: "Avoine, baies, thé vert", lunch: "Poulet, brocolis, quinoa", snack: "Amandes, pomme", dinner: "Saumon, salade verte" }
      : { breakfast: "Pancakes avoine/œufs, beurre de cacahuète", lunch: "Steak, pâtes complètes", snack: "Whey, banane", dinner: "Omelette, riz, épinards" };
  };

  // Programme dynamique selon l'objectif
  const getDayProgram = () => {
    const common = [
      { name: "Pompes", target: plan.goal === 'Prise de masse' ? 20 : 12, unit: "Réps", mode: "reps", type: "pushup", setup: "Corps gainé, descente contrôlée." },
      { name: "Squats", target: plan.goal === 'Prise de masse' ? 25 : 15, unit: "Réps", mode: "reps", type: "squat", setup: "Dos droit, fessiers sous les genoux." }
    ];
    return common;
  };

  const program = getDayProgram();
  const currentEx = program[currentExerciseIndex];

  // --- 3. GESTION NAVIGATION & CHRONOS ---
  // (Inclus ici toute la logique de useEffect pour les timers...)
  // [NOTE : Intégrer les useEffects de chronométrage ici...]

  // --- 4. AFFICHAGE ---

  // Écran 1 : Connexion
  if (step === 'login') return (
    <div style={{ padding: '40px', background: '#050811', color: 'white', height: '100vh' }}>
      <h1>Défi 60 Jours</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={() => { localStorage.setItem('user_email', email); setStep('profile'); }}>Continuer</button>
    </div>
  );

  // Écran 2 : Profil
  if (step === 'profile') return (
    <div style={{ padding: '40px', background: '#050811', color: 'white', height: '100vh' }}>
      <h2>Vos données corporelles</h2>
      <input type="number" placeholder="Taille (cm)" onChange={(e) => setProfile({...profile, height: e.target.value})} />
      <input type="number" placeholder="Poids (kg)" onChange={(e) => setProfile({...profile, weight: e.target.value})} />
      <input type="date" onChange={(e) => setProfile({...profile, dob: e.target.value})} />
      <button onClick={() => { localStorage.setItem('user_profile', JSON.stringify(profile)); setStep('dashboard'); }}>Lancer mon coaching</button>
    </div>
  );

  // Écran Dashboard (Menu principal)
  if (workoutMode === 'dashboard') return (
    <div style={{ background: '#050811', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <h1>Dashboard ({plan.goal})</h1>
      <button onClick={() => setWorkoutMode('nutrition')}>🍽️ Alimentation</button>
      <button onClick={() => setWorkoutMode('preparation')}>🏋️ Séance du jour</button>
    </div>
  );

  // Écran Nutrition
  if (workoutMode === 'nutrition') {
    const n = getDayNutrition();
    return (
      <div style={{ color: 'white', padding: '20px' }}>
        <button onClick={() => setWorkoutMode('dashboard')}>← Retour</button>
        <h2>Menu : {plan.calTarget} kcal</h2>
        <p>PDJ: {n.breakfast}</p>
        <p>Déjeuner: {n.lunch}</p>
        <button onClick={() => setWorkoutMode('dashboard')}>Terminé</button>
      </div>
    );
  }

  return null;
}

export default App;
