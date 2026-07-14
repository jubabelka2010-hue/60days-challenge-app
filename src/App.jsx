import React, { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('user_profile')) || null);
  const [view, setView] = useState(localStorage.getItem('user_email') ? (localStorage.getItem('user_profile') ? 'dashboard' : 'profile') : 'login');
  
  // États workout
  const [currentDay, setCurrentDay] = useState(Number(localStorage.getItem('user_day')) || 1);
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [status, setStatus] = useState('viewing');
  const [chrono, setChrono] = useState(0);
  const [restTime, setRestTime] = useState(30);

  const exercises = [
    "Pompes", "Squats", "Gainage", "Fentes", "Mountain Climbers", "Burpees",
    "Dips Chaise", "Superman", "Jump Squats", "Planche Latérale", "Crunches", "High Knees"
  ];

  useEffect(() => {
    let timer;
    if (status === 'active') timer = setInterval(() => setChrono(c => c + 1), 1000);
    else if (status === 'resting') timer = setInterval(() => setRestTime(r => r > 0 ? r - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const handleNext = () => {
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(i => i + 1);
      setStatus('viewing'); setChrono(0); setRestTime(30);
    } else {
      const nextDay = currentDay + 1;
      if (nextDay > 7 && !localStorage.getItem('user_paid')) setWorkoutMode('paywall');
      else { setCurrentDay(nextDay); localStorage.setItem('user_day', nextDay); setWorkoutMode('dashboard'); setCurrentExIndex(0); }
    }
  };

  if (view === 'login') return (
    <div style={{textAlign:'center', marginTop:'50px', background:'#0f2027', color:'white', height:'100vh'}}>
      <h1>ELITE FIT 60</h1>
      <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('user_email', email); setView('profile'); }}>
        <input type="email" placeholder="Ton email" onChange={(e) => setEmail(e.target.value)} required /><br/>
        <button type="submit">COMMENCER</button>
      </form>
    </div>
  );

  if (view === 'profile') return (
    <form onSubmit={(e) => { e.preventDefault(); const p = {age: e.target.age.value, weight: e.target.weight.value, goal: e.target.goal.value}; localStorage.setItem('user_profile', JSON.stringify(p)); setProfile(p); setView('dashboard'); }} style={{textAlign:'center', marginTop:'50px', background:'#0f2027', color:'white', height:'100vh'}}>
      <h2>Ton Profil</h2>
      <input name="age" type="number" placeholder="Âge" required /><br/>
      <input name="weight" type="number" placeholder="Poids" required /><br/>
      <input name="goal" placeholder="Objectif" required /><br/>
      <button type="submit">VALIDER</button>
    </form>
  );

  return (
    <div style={{background:'#0f2027', color:'white', minHeight:'100vh', padding:'20px', textAlign:'center'}}>
      {workoutMode === 'dashboard' && (
        <><h1>JOUR {currentDay}</h1>
        <button onClick={() => setWorkoutMode('active')}>LANCER SÉANCE</button></>
      )}

      {workoutMode === 'active' && (
        status === 'viewing' ? (<><h2>{exercises[currentExIndex]}</h2><button onClick={() => setStatus('active')}>JE SUIS PRÊT</button></>) :
        status === 'active' ? (<><h1>{chrono}s</h1><button onClick={() => setStatus('resting')}>TERMINÉ</button></>) :
        (<><h2 style={{marginBottom:'20px'}}>REPOS : {restTime}s</h2><button onClick={handleNext}>EXERCICE SUIVANT</button></>)
      )}

      {workoutMode === 'paywall' && (
        <><h1>Bravo 7 jours !</h1>
        <a href="https://paypal.me/JubaBelkacemi/4.99" target="_blank" rel="noreferrer" onClick={() => localStorage.setItem('user_paid', 'true')}>DÉBLOQUER 4,99 €</a></>
      )}

      <div style={{marginTop:'50px'}}>
        <button onClick={() => {localStorage.clear(); window.location.reload();}}>QUITTER</button>
      </div>
    </div>
  );
}

export default App;
