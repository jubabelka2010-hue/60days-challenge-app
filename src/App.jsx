import React, { useState, useEffect } from 'react';

const EXERCISES = [
  { name: "Pompes", type: "reps", target: 10, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Squats", type: "reps", target: 15, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Gainage", type: "time", target: 60, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
];

const App = () => {
  const [step, setStep] = useState('login'); // login -> profile -> success -> dashboard -> workout
  const [user, setUser] = useState({ email: '', age: '', weight: '', height: '' });
  const [day, setDay] = useState(1);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [mode, setMode] = useState('prep'); // prep -> active -> rest

  const bgStyle = {
    width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0,
    background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48")',
    backgroundSize: 'cover', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    color: 'white', textAlign: 'center', padding: '20px'
  };

  // --- LOGIQUE D'ENCHAÎNEMENT ---
  const finishExercise = () => {
    if (currentExIndex < EXERCISES.length - 1) {
      setMode('rest');
      setTimeout(() => {
        setCurrentExIndex(i => i + 1);
        setMode('prep');
      }, 30000); // Repos de 30s
    } else {
      setStep('dashboard');
    }
  };

  // --- VUES ---
  if (step === 'login') return (
    <div style={bgStyle}>
      <h1>CONNEXION</h1>
      <input type="email" placeholder="Email" onChange={(e) => setUser({...user, email: e.target.value})} style={{padding:'15px', borderRadius:'10px', marginBottom:'10px'}} />
      <button onClick={() => setStep('profile')} style={{padding:'15px 30px', borderRadius:'50px'}}>Suivant</button>
    </div>
  );

  if (step === 'profile') return (
    <div style={bgStyle}>
      <h1>VOTRE PROFIL</h1>
      <input type="number" placeholder="Âge" onChange={(e) => setUser({...user, age: e.target.value})} style={{margin:'5px', padding:'10px'}} />
      <input type="number" placeholder="Poids (kg)" onChange={(e) => setUser({...user, weight: e.target.value})} style={{margin:'5px', padding:'10px'}} />
      <input type="number" placeholder="Taille (cm)" onChange={(e) => setUser({...user, height: e.target.value})} style={{margin:'5px', padding:'10px'}} />
      <button onClick={() => setStep('success')} style={{marginTop:'20px'}}>Créer mon compte</button>
    </div>
  );

  if (step === 'success') return (
    <div style={bgStyle}>
      <h1>Félicitations, votre profil a été créé !</h1>
      <button onClick={() => setStep('dashboard')} style={{padding:'20px'}}>Commencer</button>
    </div>
  );

  if (step === 'dashboard') return (
    <div style={bgStyle}>
      <h1>JOUR {day}</h1>
      {day > 7 ? 
        <button onClick={() => window.location.href='https://paypal.me/JubaBelkacemi'}>Payer 4,99€ pour débloquer</button> :
        <button onClick={() => {setStep('workout'); setMode('prep');}} style={{padding:'20px 50px'}}>LANCER LA SÉANCE</button>
      }
    </div>
  );

  if (step === 'workout') {
    const ex = EXERCISES[currentExIndex];
    return (
      <div style={bgStyle}>
        {mode === 'prep' && (
          <>
            <h2>PRÉPARATION</h2>
            <img src={ex.gif} style={{width:'300px'}} />
            <button onClick={() => setMode('active')}>JE SUIS PRÊT</button>
          </>
        )}
        {mode === 'active' && (
          <>
            <h1>{ex.name}</h1>
            <h2>Objectif : {ex.target} {ex.type === 'reps' ? 'Répétitions' : 'Secondes'}</h2>
            <button onClick={finishExercise} style={{padding:'20px 40px', fontSize:'2rem', background:'green'}}>J'AI TERMINÉ</button>
          </>
        )}
        {mode === 'rest' && <h1>REPOS : 30s</h1>}
      </div>
    );
  }

  return null;
};

export default App;
