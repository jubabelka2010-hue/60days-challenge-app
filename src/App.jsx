import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user_google')));
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('user_profile')) || {});
  const [currentDay, setCurrentDay] = useState(() => Number(localStorage.getItem('user_day')) || 1);
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [tab, setTab] = useState('workout');
  const [status, setStatus] = useState('viewing');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [chrono, setChrono] = useState(0);
  const [restTime, setRestTime] = useState(30);

  const CLIENT_ID = "TON_CLIENT_ID_GOOGLE"; 
  const PAYPAL_LINK = "https://paypal.me/JubaBelkacemi/4.99";

  // Voici la liste définitive et complète des 12 exercices
  const exerciseDB = [
    { name: "Pompes", base: 10, type: "reps" },
    { name: "Squats", base: 15, type: "reps" },
    { name: "Gainage", base: 30, type: "sec" },
    { name: "Fentes", base: 10, type: "reps" },
    { name: "Mountain Climbers", base: 20, type: "reps" },
    { name: "Burpees", base: 8, type: "reps" },
    { name: "Dips Chaise", base: 10, type: "reps" },
    { name: "Superman", base: 12, type: "reps" },
    { name: "Jump Squats", base: 10, type: "reps" },
    { name: "Planche Latérale", base: 20, type: "sec" },
    { name: "Crunches", base: 15, type: "reps" },
    { name: "High Knees", base: 30, type: "sec" }
  ];

  const getGoal = (ex) => Math.round(ex.base * (1 + (currentDay - 1) * 0.05));

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
      if (nextDay > 7 && localStorage.getItem('user_paid') !== 'true') setWorkoutMode('paywall');
      else { setCurrentDay(nextDay); localStorage.setItem('user_day', nextDay); setWorkoutMode('dashboard'); setCurrentExIndex(0); }
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{background:'#0f2027', color:'white', minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:'sans-serif'}}>
        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px', textAlign:'center'}}>
          {!user ? (
            <><h1>🔥 ELITE FIT 60</h1><GoogleLogin onSuccess={res => { localStorage.setItem('user_google', JSON.stringify(res)); setUser(res); }} /></>
          ) : !profile.age ? (
            <>
              <h2>Ton Profil</h2>
              <input type="number" placeholder="Âge" onChange={e => setProfile({...profile, age: e.target.value})} style={{margin:'5px', padding:'10px'}}/>
              <input type="number" placeholder="Poids (kg)" onChange={e => setProfile({...profile, weight: e.target.value})} style={{margin:'5px', padding:'10px'}}/>
              <select onChange={e => setProfile({...profile, gender: e.target.value})} style={{margin:'5px', padding:'10px'}}><option>Homme</option><option>Femme</option></select>
              <input placeholder="Objectif" onChange={e => setProfile({...profile, goal: e.target.value})} style={{margin:'5px', padding:'10px'}}/>
              <button onClick={() => { localStorage.setItem('user_profile', JSON.stringify(profile)); window.location.reload(); }} style={{padding:'10px 20px', cursor:'pointer', marginTop:'10px'}}>VALIDER</button>
            </>
          ) : (
            <>
              {workoutMode === 'dashboard' && tab === 'workout' && (<><h1>JOUR {currentDay}</h1><button onClick={() => setWorkoutMode('active')} style={{padding:'15px 30px', margin:'20px', cursor:'pointer'}}>LANCER SÉANCE</button></>)}
              {workoutMode === 'dashboard' && tab === 'food' && (<><h1>MENUS J-{currentDay}</h1><div style={{background:'rgba(255,255,255,0.1)', padding:'20px', borderRadius:'10px', margin:'20px'}}>🍳 Déj: {currentDay * 2 + 200}kcal<br/>🥗 Midi: {currentDay * 3 + 400}kcal<br/>🍲 Soir: {currentDay * 2 + 300}kcal</div></>)}
              
              {workoutMode === 'active' && (
                status === 'viewing' ? (<><h2>{exerciseDB[currentExIndex].name}</h2><p style={{margin:'20px', fontSize:'1.5rem'}}>Objectif: {getGoal(exerciseDB[currentExIndex])} {exerciseDB[currentExIndex].type}</p><button onClick={() => setStatus('active')} style={{padding:'15px 30px', cursor:'pointer'}}>JE SUIS PRÊT</button></>) :
                status === 'active' ? (<><h1>{chrono}s</h1><button onClick={() => setStatus('resting')} style={{background:'#ff4757', padding:'15px 30px', cursor:'pointer', border:'none', color:'white'}}>TERMINÉ</button></>) :
                (<><h2 style={{marginBottom:'20px'}}>REPOS : {restTime}s</h2><button onClick={handleNext} style={{padding:'15px 30px', cursor:'pointer'}}>EXERCICE SUIVANT</button></>)
              )}
              
              {workoutMode === 'paywall' && (<><h1>Bravo 7 jours validés ! 🏆</h1><a href={PAYPAL_LINK} target="_blank" rel="noreferrer" onClick={() => localStorage.setItem('user_paid', 'true')} style={{background:'#00d2ff', padding:'15px 30px', textDecoration:'none', color:'black', borderRadius:'50px', marginTop:'20px', display:'inline-block'}}>DÉBLOQUER 4,99 €</a></>)}
              
              <button style={{position:'absolute', top:10, right:10, cursor:'pointer'}} onClick={() => { googleLogout(); localStorage.clear(); window.location.reload(); }}>QUITTER</button>
            </>
          )}
        </div>
        {user && profile.age && (
          <div style={{height:'70px', background:'#1a2a34', display:'flex', justifyContent:'space-around', alignItems:'center'}}>
            <button onClick={() => { setTab('workout'); setWorkoutMode('dashboard'); }} style={{cursor:'pointer'}}>SÉANCES</button>
            <button onClick={() => setTab('food')} style={{cursor:'pointer'}}>NOURRITURE</button>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
export default App;
