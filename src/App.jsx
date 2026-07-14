import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user_google')));
  const [currentDay, setCurrentDay] = useState(() => Number(localStorage.getItem('user_day')) || 1);
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [tab, setTab] = useState('workout');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [hasPaid, setHasPaid] = useState(() => localStorage.getItem('user_paid') === 'true');
  const [status, setStatus] = useState('viewing');
  const [chrono, setChrono] = useState(0);
  const [restTime, setRestTime] = useState(30);

  const CLIENT_ID = "TON_CLIENT_ID_GOOGLE"; // Remplace par ton ID
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
    { breakfast: "Flocons d'avoine & Whey", lunch: "Poulet & Riz complet", dinner: "Saumon & Patate douce" },
    { breakfast: "Omelette & Avocat", lunch: "Dinde & Quinoa", dinner: "Steak 5% & Haricots" },
    { breakfast: "Yaourt grec & Fruits", lunch: "Thon & Pâtes", dinner: "Cabillaud & Courgettes" }
  ];

  const logout = () => { googleLogout(); localStorage.clear(); setUser(null); window.location.reload(); };

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
      else { setCurrentDay(nextDay); localStorage.setItem('user_day', nextDay); setWorkoutMode('dashboard'); setCurrentExIndex(0); }
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * { margin:0; padding:0; box-sizing:border-box; font-family: sans-serif; }
      body { background: #0f2027; color: white; width: 100vw; height: 100vh; overflow: hidden; }
      .app-container { width: 100vw; height: 100vh; display: flex; flex-direction: column; }
      .main { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; }
      .nav { height: 70px; background: #1a2a34; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #333; }
      .btn { background: #00d2ff; color: #000; padding: 15px 30px; border-radius: 50px; cursor: pointer; border: none; font-weight: bold; margin: 10px; }
      .gif { width: 300px; height: 300px; background: #222; border-radius: 20px; margin: 20px; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="app-container">
        <div className="main">
          {!user ? (
            <>
              <h1>🔥 ELITE FIT 60</h1>
              <GoogleLogin onSuccess={res => { localStorage.setItem('user_google', JSON.stringify(res)); setUser(res); }} />
            </>
          ) : (
            <>
              {workoutMode === 'dashboard' && tab === 'workout' && (
                <><h1>JOUR {currentDay}</h1><button className="btn" onClick={() => setWorkoutMode('active')}>LANCER SÉANCE</button></>
              )}
              {workoutMode === 'dashboard' && tab === 'food' && (
                <><h1>REPAS DU JOUR</h1><div className="meal-box">🍳 {mealPlans[currentDay % 3].breakfast} / 🥗 {mealPlans[currentDay % 3].lunch} / 🍲 {mealPlans[currentDay % 3].dinner}</div></>
              )}
              {workoutMode === 'active' && (
                status === 'viewing' ? (<><h2 style={{marginBottom:'20px'}}>{exerciseDB[currentExIndex].name}</h2><div className="gif">{exerciseDB[currentExIndex].gif && <img src={exerciseDB[currentExIndex].gif} style={{width:'100%', height:'100%', borderRadius:'20px'}}/>}</div><button className="btn" onClick={() => setStatus('active')}>JE SUIS PRÊT</button></>) :
                status === 'active' ? (<><h1>{chrono} s</h1><button className="btn" style={{background:'#ff4757'}} onClick={() => setStatus('resting')}>TERMINÉ</button></>) :
                (<><h2 style={{marginBottom:'20px'}}>REPOS : {restTime}s</h2><button className="btn" onClick={handleNext}>SUIVANT</button></>)
              )}
              {workoutMode === 'paywall' && (<><h1>Bravo 7 jours validés ! 🏆</h1><a href={PAYPAL_LINK} target="_blank" className="btn" onClick={() => localStorage.setItem('user_paid', 'true')}>PAYER 4,99 €</a></>)}
              <button className="btn" style={{position:'absolute', top:10, right:10, background:'#555', color:'white'}} onClick={logout}>QUITTER</button>
            </>
          )}
        </div>
        {user && (
          <div className="nav">
            <button className="btn" onClick={() => { setTab('workout'); setWorkoutMode('dashboard'); }}>SÉANCES</button>
            <button className="btn" onClick={() => setTab('food')}>NOURRITURE</button>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
export default App;
