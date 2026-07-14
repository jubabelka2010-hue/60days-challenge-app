import React, { useState, useEffect } from 'react';

function App() {
  // --- ÉTATS ---
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('user_profile')) || null);
  const [email, setEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [currentDay, setCurrentDay] = useState(() => Number(localStorage.getItem('user_day')) || 1);
  const [workoutMode, setWorkoutMode] = useState(profile ? 'dashboard' : 'login');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [hasPaid, setHasPaid] = useState(() => localStorage.getItem('user_paid') === 'true');

  const PAYPAL_LINK = "https://paypal.me/JubaBelkacemi/4.99";

  // --- DONNÉES ---
  const mealPlans = [
    { breakfast: "Flocons d'avoine & Whey", lunch: "Poulet grillé, riz complet, brocolis", dinner: "Saumon, patate douce, asperges" },
    { breakfast: "Omelette 3 œufs, avocat", lunch: "Dinde, quinoa, épinards", dinner: "Steak haché 5%, haricots verts, amandes" },
    { breakfast: "Yaourt grec, fruits rouges", lunch: "Thon, pâtes complètes, salade", dinner: "Cabillaud, riz basmati, courgettes" }
  ];

  const exerciseDB = [
    { name: "Pompes", type: "reps", base: 10, step: 2, img: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJ4Zndqbm05eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxHOGTdzJC/giphy.gif" },
    { name: "Squats", type: "reps", base: 15, step: 3, img: "https://media.giphy.com/media/l41lTjJp90Y6424e4/giphy.gif" },
    { name: "Gainage (sec)", type: "time", base: 30, step: 2, img: "https://media.giphy.com/media/3o7TKK2a2Z1p61t47u/giphy.gif" },
    { name: "Fentes", type: "reps", base: 10, step: 1, img: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { name: "Mountain Climbers", type: "time", base: 30, step: 1, img: "https://media.giphy.com/media/26n6Gx9moCgs1pUuk/giphy.gif" },
    { name: "Burpees", type: "reps", base: 5, step: 1, img: "https://media.giphy.com/media/26n6G5G6GfGk2b0pW/giphy.gif" },
    { name: "Dips Chaise", type: "reps", base: 8, step: 1, img: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { name: "Superman", type: "reps", base: 12, step: 1, img: "https://media.giphy.com/media/3o7TKMGpxxHOGTdzJC/giphy.gif" },
    { name: "Jump Squats", type: "reps", base: 10, step: 1, img: "https://media.giphy.com/media/l41lTjJp90Y6424e4/giphy.gif" },
    { name: "Planche Latérale", type: "time", base: 20, step: 1, img: "https://media.giphy.com/media/3o7TKK2a2Z1p61t47u/giphy.gif" },
    { name: "Crunches", type: "reps", base: 20, step: 2, img: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { name: "High Knees", type: "time", base: 30, step: 2, img: "https://media.giphy.com/media/26n6Gx9moCgs1pUuk/giphy.gif" }
  ];

  // --- LOGIQUE ---
  const calculateCalories = () => {
    if (!profile) return 2000;
    const base = profile.gender === 'male' ? 88.36 + (13.4 * profile.weight) + (4.8 * profile.height) - (5.7 * profile.age) : 447.6 + (9.2 * profile.weight) + (3.1 * profile.height) - (4.3 * profile.age);
    return Math.round(base * 1.375);
  };

  const calculateIntensity = (ex) => ex.base + (currentDay * ex.step);

  const handleNextExercise = () => {
    if (currentExIndex < exerciseDB.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
    } else {
      const nextDay = currentDay + 1;
      if (nextDay > 7 && !hasPaid) {
        setWorkoutMode('paywall');
      } else {
        setCurrentDay(nextDay);
        localStorage.setItem('user_day', nextDay);
        setWorkoutMode('dashboard');
        setCurrentExIndex(0);
      }
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .app-container { min-height: 100vh; background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364); animation: gradient 15s ease infinite; display: flex; justify-content: center; align-items: center; padding: 20px; color: white; font-family: 'Segoe UI', sans-serif; }
      @keyframes gradient { 0% {background-position:0% 50%} 50% {background-position:100% 50%} 100% {background-position:0% 50%} }
      .glass-card { background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); padding: 40px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.2); width: 100%; max-width: 500px; text-align: center; }
      .btn { background: #00d2ff; color: #000; border: none; padding: 15px 30px; border-radius: 50px; font-weight: 800; cursor: pointer; margin-top: 20px; text-decoration: none; display: inline-block; width: 100%; }
      input { width: 90%; padding: 15px; margin: 10px 0; border-radius: 10px; border: none; }
      img { width: 100%; height: 250px; object-fit: cover; border-radius: 20px; margin: 20px 0; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="app-container">
      <div className="glass-card">
        {workoutMode === 'login' && (
          <>
            <h1>🔥 ELITE FIT 60</h1>
            <input type="email" placeholder="Votre email" onChange={(e) => setEmail(e.target.value)} />
            <select onChange={(e) => setProfile({...profile, gender: e.target.value})} style={{width: '90%', padding: '15px', borderRadius: '10px'}}>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
            </select>
            <input type="number" placeholder="Âge" onChange={(e) => setProfile({...profile, age: Number(e.target.value)})} />
            <input type="number" placeholder="Poids (kg)" onChange={(e) => setProfile({...profile, weight: Number(e.target.value)})} />
            <input type="number" placeholder="Taille (cm)" onChange={(e) => setProfile({...profile, height: Number(e.target.value)})} />
            <button className="btn" onClick={() => { localStorage.setItem('user_email', email); localStorage.setItem('user_profile', JSON.stringify(profile)); setWorkoutMode('dashboard'); }}>COMMENCER</button>
          </>
        )}

        {workoutMode === 'dashboard' && profile && (
          <>
            <h1>JOUR {currentDay} / 60</h1>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px', margin: '20px 0' }}>
              <h3>🎯 Ton apport : {calculateCalories()} kcal</h3>
              <p>Petit-déj: {mealPlans[currentDay % 3].breakfast}</p>
              <p>Déjeuner: {mealPlans[currentDay % 3].lunch}</p>
              <p>Dîner: {mealPlans[currentDay % 3].dinner}</p>
            </div>
            <button className="btn" onClick={() => setWorkoutMode('active')}>DÉMARRER LA SÉANCE</button>
          </>
        )}

        {workoutMode === 'active' && (
          <>
            <h3>{exerciseDB[currentExIndex].name}</h3>
            <img src={exerciseDB[currentExIndex].img} alt="exercice" />
            <h1 style={{fontSize: '3rem'}}>{calculateIntensity(exerciseDB[currentExIndex])} {exerciseDB[currentExIndex].type === 'reps' ? 'RÉPS' : 'SEC'}</h1>
            <button className="btn" onClick={handleNextExercise}>EXERCICE SUIVANT ➔</button>
          </>
        )}

        {workoutMode === 'paywall' && (
          <>
            <h1>Bravo pour ces 7 jours ! 🏆</h1>
            <p>Accède au programme complet pour continuer jusqu'au jour 60.</p>
            <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer" className="btn" onClick={() => localStorage.setItem('user_paid', 'true')}>
              PAYER 4,99 € VIA PAYPAL
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
