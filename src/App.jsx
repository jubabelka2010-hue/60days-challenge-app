import React, { useState, useEffect } from 'react';

function App() {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('user_profile')) || null);
  const [currentDay, setCurrentDay] = useState(() => Number(localStorage.getItem('user_day')) || 1);
  const [workoutMode, setWorkoutMode] = useState(profile ? 'dashboard' : 'login');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [hasPaid, setHasPaid] = useState(() => localStorage.getItem('user_paid') === 'true');
  
  const [chrono, setChrono] = useState(0);
  const [restTime, setRestTime] = useState(30);
  const [status, setStatus] = useState('viewing'); 

  const PAYPAL_LINK = "https://paypal.me/JubaBelkacemi/4.99";

  const mealPlans = [
    { breakfast: "Flocons d'avoine & Whey", lunch: "Poulet grillé, riz complet, brocolis", dinner: "Saumon, patate douce, asperges" },
    { breakfast: "Omelette 3 œufs, avocat", lunch: "Dinde, quinoa, épinards", dinner: "Steak haché 5%, haricots verts, amandes" },
    { breakfast: "Yaourt grec, fruits rouges", lunch: "Thon, pâtes complètes, salade", dinner: "Cabillaud, riz basmati, courgettes" }
  ];

  const exerciseDB = [
    { name: "Pompes", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJ4Zndqbm05eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxHOGTdzJC/giphy.gif" },
    { name: "Squats", gif: "https://media.giphy.com/media/l41lTjJp90Y6424e4/giphy.gif" },
    { name: "Gainage", gif: "https://media.giphy.com/media/3o7TKK2a2Z1p61t47u/giphy.gif" },
    { name: "Fentes", gif: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { name: "Mountain Climbers", gif: "https://media.giphy.com/media/26n6Gx9moCgs1pUuk/giphy.gif" },
    { name: "Burpees", gif: "https://media.giphy.com/media/26n6G5G6GfGk2b0pW/giphy.gif" },
    { name: "Dips Chaise", gif: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { name: "Superman", gif: "https://media.giphy.com/media/3o7TKMGpxxHOGTdzJC/giphy.gif" },
    { name: "Jump Squats", gif: "https://media.giphy.com/media/l41lTjJp90Y6424e4/giphy.gif" },
    { name: "Planche Latérale", gif: "https://media.giphy.com/media/3o7TKK2a2Z1p61t47u/giphy.gif" },
    { name: "Crunches", gif: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { name: "High Knees", gif: "https://media.giphy.com/media/26n6Gx9moCgs1pUuk/giphy.gif" }
  ];

  useEffect(() => {
    let interval;
    if (status === 'active') interval = setInterval(() => setChrono(c => c + 1), 1000);
    else if (status === 'resting' && restTime > 0) interval = setInterval(() => setRestTime(r => r - 1), 1000);
    return () => clearInterval(interval);
  }, [status, restTime]);

  const handleNext = () => {
    if (currentExIndex < exerciseDB.length - 1) {
      setCurrentExIndex(i => i + 1);
      setStatus('viewing');
      setChrono(0);
      setRestTime(30);
    } else {
      const nextDay = currentDay + 1;
      if (nextDay > 7 && !hasPaid) setWorkoutMode('paywall');
      else {
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
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, html { width: 100%; height: 100%; overflow: hidden; }
      .app-container { width: 100vw; height: 100vh; background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364); display: flex; justify-content: center; align-items: center; color: white; font-family: sans-serif; }
      .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; }
      .btn { background: #00d2ff; color: #000; padding: 15px 40px; border-radius: 50px; font-weight: bold; cursor: pointer; border: none; margin-top: 20px; font-size: 1.2rem; }
      .meal-grid { display: grid; gap: 15px; margin: 30px 0; width: 100%; max-width: 400px; }
      .meal-box { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; font-size: 1rem; }
      img { width: 300px; height: 300px; object-fit: cover; border-radius: 20px; margin: 20px 0; }
      input { width: 80%; max-width: 300px; padding: 15px; margin: 10px 0; border-radius: 10px; border: none; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="app-container">
      <div className="glass-card">
        {workoutMode === 'login' && (
          <>
            <h1 style={{marginBottom: '30px'}}>🔥 ELITE FIT 60</h1>
            <input type="number" placeholder="Âge" onChange={(e) => setProfile({...profile, age: e.target.value})} />
            <input type="number" placeholder="Poids (kg)" onChange={(e) => setProfile({...profile, weight: e.target.value})} />
            <input type="number" placeholder="Taille (cm)" onChange={(e) => setProfile({...profile, height: e.target.value})} />
            <button className="btn" onClick={() => { localStorage.setItem('user_profile', JSON.stringify(profile)); setWorkoutMode('dashboard'); }}>COMMENCER</button>
          </>
        )}

        {workoutMode === 'dashboard' && (
          <>
            <h1>JOUR {currentDay} / 60</h1>
            <div className="meal-grid">
              <div className="meal-box">🍳 {mealPlans[currentDay % 3].breakfast}</div>
              <div className="meal-box">🥗 {mealPlans[currentDay % 3].lunch}</div>
              <div className="meal-box">🍲 {mealPlans[currentDay % 3].dinner}</div>
            </div>
            <button className="btn" onClick={() => setWorkoutMode('active')}>LANCER LA SÉANCE</button>
          </>
        )}

        {workoutMode === 'active' && status === 'viewing' && (
          <>
            <h2>{exerciseDB[currentExIndex].name}</h2>
            <img src={exerciseDB[currentExIndex].gif} alt="exo" />
            <button className="btn" onClick={() => setStatus('active')}>JE SUIS PRÊT</button>
          </>
        )}

        {workoutMode === 'active' && status === 'active' && (
          <>
            <h1>{chrono} s</h1>
            <button className="btn" style={{background: '#ff4757'}} onClick={() => setStatus('resting')}>J'AI TERMINÉ</button>
          </>
        )}

        {workoutMode === 'active' && status === 'resting' && (
          <>
            <h2>REPOS : {restTime}s</h2>
            <div style={{display: 'flex', gap: '20px'}}>
              <button className="btn" onClick={() => setRestTime(r => Math.max(0, r - 10))}>-10s</button>
              <button className="btn" onClick={() => setRestTime(r => r + 10)}>+10s</button>
            </div>
            {restTime === 0 && <button className="btn" onClick={handleNext}>EXERCICE SUIVANT</button>}
          </>
        )}

        {workoutMode === 'paywall' && (
          <>
            <h1>Bravo, 7 jours validés ! 🏆</h1>
            <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer" className="btn" onClick={() => localStorage.setItem('user_paid', 'true')}>PAYER 4,99 €</a>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
