import React, { useState, useEffect } from 'react';

function App() {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('user_profile')) || null);
  const [currentDay, setCurrentDay] = useState(() => Number(localStorage.getItem('user_day')) || 1);
  const [workoutMode, setWorkoutMode] = useState(profile ? 'dashboard' : 'login');
  const [tab, setTab] = useState('workout'); 
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [hasPaid, setHasPaid] = useState(() => localStorage.getItem('user_paid') === 'true');
  const [status, setStatus] = useState('viewing');
  const [chrono, setChrono] = useState(0);
  const [restTime, setRestTime] = useState(30);

  const PAYPAL_LINK = "https://paypal.me/JubaBelkacemi/4.99";

  const exerciseDB = [
    { name: "Pompes", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJ4Zndqbm05eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxHOGTdzJC/giphy.gif" },
    { name: "Squats", gif: "https://media.giphy.com/media/l41lTjJp90Y6424e4/giphy.gif" },
    { name: "Gainage", gif: "" },
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

  const mealPlans = [
    { breakfast: "Flocons d'avoine & Whey", lunch: "Poulet grillé, riz complet, brocolis", dinner: "Saumon, patate douce, asperges" },
    { breakfast: "Omelette 3 œufs, avocat", lunch: "Dinde, quinoa, épinards", dinner: "Steak haché 5%, haricots verts, amandes" },
    { breakfast: "Yaourt grec, fruits rouges", lunch: "Thon, pâtes complètes, salade", dinner: "Cabillaud, riz basmati, courgettes" }
  ];

  const logout = () => { localStorage.clear(); window.location.reload(); };

  useEffect(() => {
    let interval;
    if (status === 'active') interval = setInterval(() => setChrono(c => c + 1), 1000);
    else if (status === 'resting' && restTime > 0) interval = setInterval(() => setRestTime(r => r - 1), 1000);
    return () => clearInterval(interval);
  }, [status, restTime]);

  const handleNext = () => {
    if (currentExIndex < exerciseDB.length - 1) {
      setCurrentExIndex(i => i + 1);
      setStatus('viewing'); setChrono(0); setRestTime(30);
    } else {
      const nextDay = currentDay + 1;
      if (nextDay > 7 && !hasPaid) setWorkoutMode('paywall');
      else {
        setCurrentDay(nextDay); localStorage.setItem('user_day', nextDay);
        setWorkoutMode('dashboard'); setCurrentExIndex(0);
      }
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
      body, html { width: 100%; height: 100%; overflow: hidden; background: #0f2027; }
      .app-container { width: 100vw; height: 100vh; display: flex; flex-direction: column; color: white; }
      .main-content { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center; overflow: hidden; }
      .nav-bar { height: 70px; background: #1a2a34; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #333; }
      .btn { background: #00d2ff; color: #000; padding: 15px 30px; border-radius: 50px; font-weight: bold; cursor: pointer; border: none; margin: 10px; }
      .meal-box { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px; width: 90%; border-radius: 10px; }
      .gif-container { width: 300px; height: 300px; background: rgba(255,255,255,0.05); display: flex; justify-content: center; align-items: center; border-radius: 20px; margin: 20px 0; }
      input { padding: 15px; margin: 10px; width: 250px; border-radius: 10px; border: none; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="app-container">
      <div className="main-content">
        {workoutMode === 'login' && (
          <>
            <h1>🔥 ELITE FIT 60</h1>
            <input type="number" placeholder="Âge" onChange={(e) => setProfile({...profile, age: e.target.value})} />
            <input type="number" placeholder="Poids (kg)" onChange={(e) => setProfile({...profile, weight: e.target.value})} />
            <input type="number" placeholder="Taille (cm)" onChange={(e) => setProfile({...profile, height: e.target.value})} />
            <button className="btn" onClick={() => { localStorage.setItem('user_profile', JSON.stringify(profile)); setWorkoutMode('dashboard'); }}>COMMENCER</button>
          </>
        )}

        {workoutMode === 'dashboard' && tab === 'workout' && (
          <>
            <h1>JOUR {currentDay} / 60</h1>
            <button className="btn" onClick={() => setWorkoutMode('active')}>LANCER SÉANCE</button>
          </>
        )}

        {workoutMode === 'dashboard' && tab === 'food' && (
          <>
            <h1>PROGRAMME DU JOUR</h1>
            <div className="meal-box">🍳 {mealPlans[currentDay % 3].breakfast}</div>
            <div className="meal-box">🥗 {mealPlans[currentDay % 3].lunch}</div>
            <div className="meal-box">🍲 {mealPlans[currentDay % 3].dinner}</div>
          </>
        )}

        {workoutMode === 'active' && tab === 'workout' && (
          <>
            {status === 'viewing' && (
              <>
                <h2>{exerciseDB[currentExIndex].name}</h2>
                <div className="gif-container">
                  {exerciseDB[currentExIndex].gif ? <img src={exerciseDB[currentExIndex].gif} style={{width:'100%', height:'100%', borderRadius:'20px'}}/> : <p>Pas d'animation</p>}
                </div>
                <button className="btn" onClick={() => setStatus('active')}>JE SUIS PRÊT</button>
              </>
            )}
            {status === 'active' && (
              <>
                <h1>{chrono} s</h1>
                <button className="btn" style={{background: '#ff4757'}} onClick={() => setStatus('resting')}>J'AI TERMINÉ</button>
              </>
            )}
            {status === 'resting' && (
              <>
                <h2>REPOS : {restTime}s</h2>
                <button className="btn" onClick={handleNext}>EXERCICE SUIVANT</button>
              </>
            )}
          </>
        )}

        {workoutMode === 'paywall' && (
          <>
            <h1>Bravo, 7 jours validés ! 🏆</h1>
            <a href={PAYPAL_LINK} target="_blank" className="btn" onClick={() => localStorage.setItem('user_paid', 'true')}>PAYER 4,99 €</a>
          </>
        )}

        {workoutMode !== 'login' && <button className="btn" style={{position:'absolute', top:10, right:10, background:'#444', color:'white'}} onClick={logout}>Quitter</button>}
      </div>

      {workoutMode !== 'login' && (
        <div className="nav-bar">
          <button className="btn" onClick={() => setTab('workout')}>SÉANCES</button>
          <button className="btn" onClick={() => setTab('food')}>NOURRITURE</button>
        </div>
      )}
    </div>
  );
}

export default App;
