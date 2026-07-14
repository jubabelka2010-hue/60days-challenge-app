import React, { useState, useEffect } from 'react';

function App() {
  // --- ÉTATS ---
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user_email') || '');
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('user_profile')) || null);
  const [currentDay, setCurrentDay] = useState(Number(localStorage.getItem('user_day')) || 1);
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [tab, setTab] = useState('workout');
  const [currentEx, setCurrentEx] = useState(0);
  const [chrono, setChrono] = useState(0);
  const [status, setStatus] = useState('viewing');

  const PAYPAL_LINK = "https://paypal.me/JubaBelkacemi/4.99";

  const exercises = [
    "Pompes", "Squats", "Gainage", "Fentes", "Mountain Climbers", "Burpees", 
    "Dips Chaise", "Superman", "Jump Squats", "Planche Latérale", "Crunches", "High Knees"
  ];

  // --- LOGIQUE ---
  useEffect(() => {
    let timer;
    if (status === 'active') timer = setInterval(() => setChrono(c => c + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const saveProfile = (e) => {
    e.preventDefault();
    const data = { age: e.target.age.value, weight: e.target.weight.value, gender: e.target.gender.value, goal: e.target.goal.value };
    localStorage.setItem('user_profile', JSON.stringify(data));
    setProfile(data);
  };

  if (!userEmail) return (
    <div style={{textAlign:'center', marginTop:'50px'}}>
      <h1>Elite Fit 60</h1>
      <input type="email" placeholder="Ton email" onBlur={(e) => {localStorage.setItem('user_email', e.target.value); setUserEmail(e.target.value);}} />
    </div>
  );

  if (!profile) return (
    <form onSubmit={saveProfile} style={{textAlign:'center', marginTop:'50px'}}>
      <h2>Ton Profil</h2>
      <input name="age" type="number" placeholder="Âge" required /><br/>
      <input name="weight" type="number" placeholder="Poids (kg)" required /><br/>
      <select name="gender"><option>Homme</option><option>Femme</option></select><br/>
      <input name="goal" placeholder="Objectif (ex: Perte de gras)" required /><br/>
      <button type="submit">VALIDER</button>
    </form>
  );

  return (
    <div style={{background:'#0f2027', color:'white', minHeight:'100vh', padding:'20px'}}>
      {workoutMode === 'dashboard' && tab === 'workout' && (
        <div style={{textAlign:'center'}}>
          <h1>JOUR {currentDay}</h1>
          <button onClick={() => setWorkoutMode('active')}>LANCER SÉANCE</button>
        </div>
      )}

      {workoutMode === 'active' && (
        <div style={{textAlign:'center'}}>
          <h2>{exercises[currentEx]}</h2>
          <p>Temps: {chrono}s</p>
          {status === 'viewing' ? <button onClick={() => setStatus('active')}>DÉMARRER</button> : <button onClick={() => {if(currentEx < 11) {setCurrentEx(currentEx+1); setChrono(0); setStatus('viewing');} else {setCurrentDay(currentDay+1); localStorage.setItem('user_day', currentDay+1); setWorkoutMode(currentDay >= 7 ? 'paywall' : 'dashboard');}}}>TERMINÉ</button>}
        </div>
      )}

      {workoutMode === 'paywall' && (
        <div style={{textAlign:'center'}}>
          <h1>Bravo !</h1>
          <a href={PAYPAL_LINK} target="_blank" rel="noreferrer">DÉBLOQUER LA SUITE (4,99 €)</a>
        </div>
      )}

      <div style={{position:'fixed', bottom:0, width:'100%', display:'flex', justifyContent:'space-around', background:'#1a2a34', padding:'10px'}}>
        <button onClick={() => {setTab('workout'); setWorkoutMode('dashboard');}}>SÉANCES</button>
        <button onClick={() => setTab('food');}>NOURRITURE</button>
        <button onClick={() => {localStorage.clear(); window.location.reload();}}>QUITTER</button>
      </div>
    </div>
  );
}

export default App;
