import React, { useState, useEffect } from 'react';

// Liste d'exercices avec liens d'animations (exemples)
const EXERCISES = [
  { name: "Pompes", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3", duration: 45 },
  { name: "Squats", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3", duration: 60 },
  { name: "Gainage", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3", duration: 60 },
];

const App = () => {
  const [user, setUser] = useState(() => localStorage.getItem('user_email'));
  const [day, setDay] = useState(1);
  const [isPaid, setIsPaid] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [mode, setMode] = useState('prep'); // 'prep', 'active', 'rest'
  const [timer, setTimer] = useState(10);

  // --- MINUTEUR ---
  useEffect(() => {
    if (timer > 0 && workoutStarted) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && workoutStarted) {
      if (mode === 'prep') { setMode('active'); setTimer(EXERCISES[currentExIndex].duration); }
      else if (mode === 'active') { setMode('rest'); setTimer(30); }
      else { 
        if (currentExIndex < 11) { setCurrentExIndex(i => i + 1); setMode('prep'); setTimer(10); }
        else { setWorkoutStarted(false); setCurrentExIndex(0); }
      }
    }
  }, [timer, workoutStarted, mode, currentExIndex]);

  // --- DESIGN FULLSCREEN ---
  const fullScreenStyle = {
    width: '100vw', height: '100vh', margin: 0, padding: 0, 
    background: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48") center/cover',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    color: 'white', textAlign: 'center', position: 'fixed', top: 0, left: 0
  };

  if (!user) return <div style={fullScreenStyle}><button onClick={() => setUser('ok')}>CONNEXION PRO</button></div>;

  if (day > 7 && !isPaid) return (
    <div style={fullScreenStyle}>
      <h1>PROGRAMME PRO</h1>
      <button onClick={() => window.location.href='https://paypal.me/JubaBelkacemi'}>PAYER 4,99 €</button>
    </div>
  );

  if (workoutStarted) return (
    <div style={fullScreenStyle}>
      <h2>{mode === 'prep' ? 'PRÉPAREZ-VOUS' : mode === 'active' ? EXERCISES[currentExIndex].name : 'REPOS'}</h2>
      {mode !== 'active' && <img src={EXERCISES[currentExIndex].gif} style={{width:'300px'}} alt="exo"/>}
      <h1 style={{fontSize:'5rem'}}>{timer}s</h1>
      {mode === 'rest' && (
        <div>
          <button onClick={() => setTimer(t => t + 10)}>+10s</button>
          <button onClick={() => setTimer(t => Math.max(t - 10, 0))}>-10s</button>
        </div>
      )}
      {mode === 'prep' && <button onClick={() => setTimer(0)}>JE SUIS PRÊT</button>}
    </div>
  );

  return (
    <div style={fullScreenStyle}>
      <h1>JOUR {day}</h1>
      <button onClick={() => setWorkoutStarted(true)} style={{padding:'20px 40px', fontSize:'1.5rem'}}>LANCER LA SÉANCE</button>
    </div>
  );
};

export default App;
