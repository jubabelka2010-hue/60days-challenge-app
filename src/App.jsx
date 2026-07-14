import React, { useState, useEffect } from 'react';

// --- BASE DE DONNÉES MASSIVE DES EXERCICES ---
const EXERCISES_LIBRARY = [
  { name: "Pompes", type: "reps", target: 10, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Squats", type: "reps", target: 15, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Gainage", type: "time", target: 45, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Fentes", type: "reps", target: 12, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Mountain Climbers", type: "time", target: 30, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Dips", type: "reps", target: 10, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Burpees", type: "reps", target: 8, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Crunchs", type: "reps", target: 20, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Squat Sauté", type: "reps", target: 12, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Planche Latérale", type: "time", target: 40, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Chaise", type: "time", target: 60, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Superman", type: "reps", target: 15, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" }
];

export default function App() {
  // --- ÉTAT GLOBAL ET PERSISTANCE ---
  const [step, setStep] = useState(() => localStorage.getItem('app_step') || 'login');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user_data')) || { email: '', age: '', weight: '', height: '' });
  const [day, setDay] = useState(() => Number(localStorage.getItem('current_day')) || 1);
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem('is_paid') === 'true');
  const [workoutMode, setWorkoutMode] = useState('prep'); // prep, active, rest, finished
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- SAUVEGARDE AUTOMATIQUE ---
  useEffect(() => {
    localStorage.setItem('app_step', step);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('current_day', day);
    localStorage.setItem('is_paid', isPaid);
  }, [step, user, day, isPaid]);

  // --- DESIGN PROFESSIONNEL (Overlay sombre) ---
  const styles = {
    screen: {
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center',
      background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48")',
      backgroundSize: 'cover', backgroundPosition: 'center', position: 'fixed', top: 0, left: 0
    },
    btn: { padding: '20px 50px', background: '#3b82f6', border: 'none', borderRadius: '50px', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }
  };

  // --- LOGIQUE D'ENCHAÎNEMENT ---
  const nextExercise = () => {
    if (currentIndex < EXERCISES_LIBRARY.length - 1) {
      setWorkoutMode('rest');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setWorkoutMode('prep');
      }, 30000); // Repos 30s
    } else {
      setStep('dashboard');
      setDay(day + 1);
      setCurrentIndex(0);
    }
  };

  // --- RENDER DES ÉTAPES ---
  if (step === 'login') return (
    <div style={styles.screen}>
      <h1>CONNEXION</h1>
      <input type="email" placeholder="Email" onChange={(e) => setUser({...user, email: e.target.value})} style={{padding: '15px', borderRadius: '10px'}}/>
      <button style={styles.btn} onClick={() => setStep('profile')}>SUIVANT</button>
    </div>
  );

  if (step === 'profile') return (
    <div style={styles.screen}>
      <h1>PROFIL ATHLÈTE</h1>
      <input type="number" placeholder="Âge" onChange={(e) => setUser({...user, age: e.target.value})} style={{margin: '10px', padding: '10px'}}/>
      <input type="number" placeholder="Poids (kg)" onChange={(e) => setUser({...user, weight: e.target.value})} style={{margin: '10px', padding: '10px'}}/>
      <button style={styles.btn} onClick={() => setStep('dashboard')}>CRÉER COMPTE</button>
    </div>
  );

  if (step === 'dashboard') return (
    <div style={styles.screen}>
      <h1>JOUR {day}</h1>
      {day > 7 && !isPaid ? (
        <div>
          <h2>Programme verrouillé</h2>
          <button style={styles.btn} onClick={() => window.open('https://paypal.me/JubaBelkacemi', '_blank')}>PAYER 4,99 €</button>
        </div>
      ) : (
        <button style={styles.btn} onClick={() => setStep('workout')}>LANCER SÉANCE</button>
      )}
    </div>
  );

  if (step === 'workout') {
    const ex = EXERCISES_LIBRARY[currentIndex];
    return (
      <div style={styles.screen}>
        {workoutMode === 'prep' && (
          <div>
            <h2>PRÉPARATION</h2>
            <img src={ex.gif} alt="exercice" style={{width: '300px', borderRadius: '20px'}}/>
            <button style={styles.btn} onClick={() => setWorkoutMode('active')}>JE SUIS PRÊT</button>
          </div>
        )}
        {workoutMode === 'active' && (
          <div>
            <h1>{ex.name}</h1>
            <h2>Objectif : {ex.target} {ex.type === 'reps' ? 'Reps' : 'Sec'}</h2>
            <button style={{...styles.btn, background: '#22c55e'}} onClick={nextExercise}>J'AI TERMINÉ</button>
          </div>
        )}
        {workoutMode === 'rest' && <h1>REPOS : 30s</h1>}
      </div>
    );
  }

  return null;
}
import React, { useState, useEffect } from 'react';

// --- BASE DE DONNÉES MASSIVE DES EXERCICES ---
const EXERCISES_LIBRARY = [
  { name: "Pompes", type: "reps", target: 10, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Squats", type: "reps", target: 15, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
  { name: "Gainage", type: "time", target: 45, gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZjhx&cid=c5f7d1b3" },
];

// --- NOUVEAU : BASE DE DONNÉES NUTRITIONNELLE ---
const NUTRITION_LIBRARY = [
  { breakfast: "Oatmeal & Fruits", lunch: "Poulet grillé et riz", dinner: "Saumon et brocolis" },
  { breakfast: "Omelette 3 œufs", lunch: "Dinde et patate douce", dinner: "Salade de thon" },
  { breakfast: "Yaourt grec & amandes", lunch: "Bœuf maigre et quinoa", dinner: "Soupe de légumes" },
  { breakfast: "Smoothie protéiné", lunch: "Poisson blanc et asperges", dinner: "Poulet et avocat" },
  { breakfast: "Avocado Toast", lunch: "Crevettes et riz complet", dinner: "Steak haché 5% et salade" },
];

export default function App() {
  const [step, setStep] = useState(() => localStorage.getItem('app_step') || 'login');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user_data')) || { email: '', age: '', weight: '', height: '' });
  const [day, setDay] = useState(() => Number(localStorage.getItem('current_day')) || 1);
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem('is_paid') === 'true');
  const [workoutMode, setWorkoutMode] = useState('prep');
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- LOGIQUE NUTRITION ---
  // Utilise le reste de la division par 5 pour avoir un cycle de 5 menus
  const getNutritionForDay = () => NUTRITION_LIBRARY[(day - 1) % NUTRITION_LIBRARY.length];

  useEffect(() => {
    localStorage.setItem('app_step', step);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('current_day', day);
    localStorage.setItem('is_paid', isPaid);
  }, [step, user, day, isPaid]);

  const styles = {
    screen: {
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center',
      background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48")',
      backgroundSize: 'cover', position: 'fixed', top: 0, left: 0, overflowY: 'auto'
    },
    btn: { padding: '15px 40px', background: '#3b82f6', border: 'none', borderRadius: '50px', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
  };

  // --- ÉCRAN DASHBOARD ---
  if (step === 'dashboard') {
    const meal = getNutritionForDay();
    return (
      <div style={styles.screen}>
        <h1>JOUR {day}</h1>
        <div style={{margin: '20px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px'}}>
          <h3>Menu du jour</h3>
          <p>Petit-déjeuner : {meal.breakfast}</p>
          <p>Déjeuner : {meal.lunch}</p>
          <p>Dîner : {meal.dinner}</p>
        </div>
        
        {day > 7 && !isPaid ? (
          <button style={styles.btn} onClick={() => window.open('https://paypal.me/JubaBelkacemi', '_blank')}>PAYER 4,99 €</button>
        ) : (
          <button style={styles.btn} onClick={() => setStep('workout')}>LANCER LA SÉANCE</button>
        )}
      </div>
    );
  }

  // ... (Garder le reste du code précédent pour login, profile, workout)
  
  // Note : Assure-toi de garder les autres parties du code (login, profile, workout) 
  // comme dans le script précédent.
  return <div style={styles.screen}><h1>Application en cours...</h1></div>;
}
import React, { useState } from 'react';

function App() {
  const [purchased, setPurchased] = useState(false);

  const handleBuy = () => {
    // Simule l'achat pour l'instant (on ajoutera le vrai système Stripe ou PayPal juste après !)
    setPurchased(true);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Défi 60 Jours</h1>
        <p className="subtitle">Transforme tes habitudes et atteins tes objectifs</p>
      </header>

      <main className="main-content">
        <section className="hero-card">
          <h2>Le Programme Complet</h2>
          <p className="price">4,99 € <span className="one-time">accès à vie</span></p>
          
          <ul className="features">
            <li>📅 Plan d'action quotidien sur 60 jours</li>
            <li>📱 Suivi simple et interactif sur mobile & PC</li>
            <li>🔒 Accès sécurisé instantané</li>
          </ul>

          {!purchased ? (
            <button onClick={handleBuy} className="buy-button">
              Commencer le défi maintenant
            </button>
          ) : (
            <div className="success-message">
              <h3>🎉 Félicitations !</h3>
              <p>Ton paiement (simulé) a réussi. Prêt à commencer le Jour 1 ?</p>
            </div>
          )}
        </section>

        <section className="details">
          <h3>Pourquoi ce défi ?</h3>
          <p>Ce programme a été conçu pour t'accompagner pas à pas, chaque jour, avec des actions concrètes et rapides à réaliser pour voir un vrai changement en 60 jours.</p>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Défi 60 Jours. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
import React from 'react';

function App() {
  // Ton lien PayPal.Me configuré pour 4.99 €
  const paypalLink = "https://paypal.me/JubaBelkacemi/4.99";

  return (
    <div className="container">
      <header className="header">
        <h1>Défi 60 Jours</h1>
        <p className="subtitle">Transforme tes habitudes et atteins tes objectifs</p>
      </header>

      <main className="main-content">
        <section className="hero-card">
          <h2>Le Programme Complet</h2>
          <p className="price">4,99 € <span className="one-time">accès à vie</span></p>
          
          <ul className="features">
            <li>📅 Plan d'action quotidien sur 60 jours</li>
            <li>📱 Suivi simple et interactif sur mobile & PC</li>
            <li>🔒 Accès sécurisé instantané</li>
          </ul>

          <div className="payment-area">
            {/* Bouton Unique PayPal / CB */}
            <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="paypal-btn">
              💛 Commencer le Défi (PayPal ou CB)
            </a>
            <p className="cards-accepted">💳 Cartes Bancaires acceptées via PayPal</p>
          </div>

          <p className="payment-note">Après votre paiement, vous recevrez votre accès au défi par e-mail sous quelques minutes.</p>
        </section>

        <section className="details">
          <h3>Pourquoi ce défi ?</h3>
          <p>Ce programme a été conçu pour t'accompagner pas à pas, chaque jour, avec des actions concrètes et rapides à réaliser pour voir un vrai changement en 60 jours.</p>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Défi 60 Jours. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

function App() {
  // 1. CORRECTION DECONNEXION : Détection et routage automatique si déjà connecté
  const [email, setEmail] = useState(() => localStorage.getItem('defi_fullscreen_email') || '');
  const [currentPath, setCurrentPath] = useState(() => {
    const savedEmail = localStorage.getItem('defi_fullscreen_email');
    return savedEmail ? '/private-arena' : '/';
  });
  
  const [inputEmail, setInputEmail] = useState('');
  
  // États de progression globale
  const [currentDay, setCurrentDay] = useState(1);
  const [calories, setCalories] = useState(0);

  // Modes : 'dashboard' | 'nutrition' | 'preparation' | 'effort' | 'rest' | 'finished'
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  // Chronomètres dynamiques
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [effortSeconds, setEffortSeconds] = useState(0); // Mode temps (décompte)
  const [elapsedTime, setElapsedTime] = useState(0); // Mode répétitions (chrono ascendant)
  const [restSeconds, setRestSeconds] = useState(30);

  // Charger les données de la session active
  useEffect(() => {
    if (email) {
      const savedDay = localStorage.getItem(`${email}_fs_day`);
      const savedCalories = localStorage.getItem(`${email}_fs_calories`);
      setCurrentDay(savedDay ? Number(savedDay) : 1);
      setCalories(savedCalories ? Number(savedCalories) : 0);
    }
  }, [email]);

  // Sauvegarder les données de la session active
  useEffect(() => {
    if (email) {
      localStorage.setItem('defi_fullscreen_email', email);
      localStorage.setItem(`${email}_fs_day`, currentDay);
      localStorage.setItem(`${email}_fs_calories`, calories);
    }
  }, [currentDay, calories, email]);

  // Chronomètre de Préparation (10s)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'preparation' && prepSeconds > 0) {
      timer = setInterval(() => setPrepSeconds(s => s - 1), 1000);
    } else if (workoutMode === 'preparation' && prepSeconds === 0) {
      startEffortPhase();
    }
    return () => clearInterval(timer);
  }, [workoutMode, prepSeconds]);

  const program = getDayProgram(currentDay);
  const currentEx = program[currentExerciseIndex] || program[0];

  // Chronomètres d'Effort (Temps vs Répétitions)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'effort') {
      if (currentEx.mode === 'time') {
        if (effortSeconds > 0) {
          timer = setInterval(() => setEffortSeconds(s => s - 1), 1000);
        } else if (effortSeconds === 0) {
          triggerRestOrFinish();
        }
      } else if (currentEx.mode === 'reps') {
        timer = setInterval(() => setElapsedTime(s => s + 1), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [workoutMode, effortSeconds, currentEx?.mode]);

  // Chronomètre de Repos Actif (30s)
  useEffect(() => {
    let timer = null;
    if (workoutMode === 'rest' && restSeconds > 0) {
      timer = setInterval(() => setRestSeconds(s => s - 1), 1000);
    } else if (workoutMode === 'rest' && restSeconds === 0) {
      moveToNextExercise();
    }
    return () => clearInterval(timer);
  }, [workoutMode, restSeconds]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanEmail = inputEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) return alert("Veuillez entrer un e-mail valide.");
    setEmail(cleanEmail);
    localStorage.setItem('defi_fullscreen_email', cleanEmail); // Persistance immédiate
    navigateTo('/private-arena');
  };

  const handleLogout = () => {
    localStorage.removeItem('defi_fullscreen_email');
    setEmail('');
    setInputEmail('');
    setWorkoutMode('dashboard');
    navigateTo('/');
  };

  const startFullWorkout = () => {
    setCurrentExerciseIndex(0);
    resetTimersForExercise(0);
    setWorkoutMode('preparation');
  };

  const resetTimersForExercise = (index) => {
    const ex = program[index];
    setPrepSeconds(10);
    setRestSeconds(30);
    setElapsedTime(0);
    if (ex && ex.mode === 'time') {
      setEffortSeconds(ex.target);
    }
  };

  const startEffortPhase = () => {
    const ex = program[currentExerciseIndex];
    setElapsedTime(0);
    if (ex && ex.mode === 'time') setEffortSeconds(ex.target);
    setWorkoutMode('effort');
  };

  const triggerRestOrFinish = () => {
    if (currentExerciseIndex === program.length - 1) {
      setWorkoutMode('finished');
    } else {
      setWorkoutMode('rest');
    }
  };

  const skipRestPeriod = () => moveToNextExercise();

  const moveToNextExercise = () => {
    const nextIndex = currentExerciseIndex + 1;
    setCurrentExerciseIndex(nextIndex);
    resetTimersForExercise(nextIndex);
    setWorkoutMode('preparation');
  };

  const confirmDayAndClose = () => {
    setCalories(prev => prev + 320);
    setCurrentDay(prev => prev + 1);
    setWorkoutMode('dashboard');
  };

  function getDayProgram(day) {
    const allMovements = [
      { name: "Pompes Classiques", target: 15, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Mains écartées, corps droit, descendez la poitrine près du sol." },
      { name: "Mountain Climbers", target: 60, unit: "Secondes", mode: "time", type: "climber", setup: "En position de planche, ramenez alternativement vos genoux vers la poitrine." },
      { name: "Squats Profonds", target: 20, unit: "Répétitions", mode: "reps", type: "squat", setup: "Pieds largeur d'épaules, descendez les fesses sous la ligne des genoux." },
      { name: "Gainage Planche", target: 60, unit: "Secondes", mode: "time", type: "plank", setup: "Sur les avant-bras, contractez les abdos et fessiers, ne creusez pas le dos." },
      { name: "Pompes Diamant", target: 10, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Formez un diamant avec vos index et pouces sous votre poitrine." }
    ];
    let list = [];
    for (let i = 0; i < 5; i++) {
      let idx = (day + i) % allMovements.length;
      list.push(allMovements[idx]);
    }
    return list;
  }

  function getDayNutrition(day) {
    const menus = [
      {
        breakfast: "Flocons d'avoine (60g), 1 banane, 3 œufs brouillés, Thé vert sans sucre.",
        lunch: "Blanc de poulet grillé (150g), Quinoa (100g), Brocolis vapeur à l'huile d'olive.",
        snack: "1 Poignée d'amandes (30g), 1 Pomme, 1 Shaker de protéines.",
        dinner: "Pavé de saumon au four, Patates douces rôties, Grande salade verte."
      }
    ];
    return menus[(day - 1) % menus.length] || menus[0];
  }

  // Injecter les styles avancés CSS pour l'ATHLÈTE ANATOMIQUE COMPLET en 3D
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      html, body, #root { margin: 0 !important; padding: 0 !important; width: 100vw !important; height: 100vh !important; overflow: hidden !important; background-color: #050811; font-family: 'Poppins', sans-serif; user-select: none; }
      .canvas-3d { perspective: 1000px; width: 100%; height: 260px; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden; background: radial-gradient(circle, rgba(30,41,59,0.2) 0%, rgba(5,8,17,0) 70%); border-radius: 20px; }
      
      /* Structure du Corps Humain Réaliste */
      .human-body { position: relative; width: 120px; height: 200px; transform-style: preserve-3d; transform: rotateX(-10deg) rotateY(30deg); transition: transform 0.5s ease; }
      .h-head { position: absolute; width: 26px; height: 32px; background: #e0a980; border-radius: 40% 40% 50% 50%; top: 0; left: 47px; box-shadow: inset -3px -3px 5px rgba(0,0,0,0.2); }
      .h-torso { position: absolute; width: 44px; height: 65px; background: #2563eb; border-radius: 10px 10px 4px 4px; top: 34px; left: 38px; box-shadow: inset -5px -5px 10px rgba(0,0,0,0.4); }
      .h-pelvis { position: absolute; width: 40px; height: 20px; background: #1e3a8a; border-radius: 2px 2px 8px 8px; top: 100px; left: 40px; }
      
      /* Membres Articulés Complexes */
      .h-arm { position: absolute; width: 14px; height: 35px; background: #e0a980; border-radius: 7px; transform-origin: top center; }
      .h-forearm { position: absolute; width: 12px; height: 35px; background: #e0a980; border-radius: 6px; bottom: -30px; left: 1px; transform-origin: top center; }
      
      .h-thigh { position: absolute; width: 16px; height: 45px; background: #1e4ed8; border-radius: 8px; transform-origin: top center; }
      .h-shin { position: absolute; width: 13px; height: 45px; background: #e0a980; border-radius: 6px; bottom: -40px; left: 1px; transform-origin: top center; }

      /* Positions initiales des membres */
      .left-arm { top: 36px; left: 22px; }
      .right-arm { top: 36px; left: 84px; }
      .left-leg { top: 118px; left: 42px; }
      .right-leg { top: 118px; left: 62px; }

      /* ================= ANIMATION SQUAT REEL ================= */
      @keyframes realSquatTorso {
        0%, 100% { transform: translateY(0) rotateX(-10deg) rotateY(45deg); }
        50% { transform: translateY(40px) rotateX(-25deg) rotateY(45deg); }
      }
      @keyframes realSquatThigh {
        0%, 100% { transform: rotateX(0deg); }
        50% { transform: rotateX(-75deg); }
      }
      @keyframes realSquatShin {
        0%, 100% { transform: rotateX(0deg); }
        50% { transform: rotateX(80deg); }
      }
      @keyframes realSquatArm {
        0%, 100% { transform: rotateX(0deg); }
        50% { transform: rotateX(-60deg); }
      }
      .anim-squat-torso { animation: realSquatTorso 2.5s infinite ease-in-out; }
      .anim-squat-thigh { animation: realSquatThigh 2.5s infinite ease-in-out; }
      .anim-squat-shin { animation: realSquatShin 2.5s infinite ease-in-out; }
      .anim-squat-arm { animation: realSquatArm 2.5s infinite ease-in-out; }

      /* ================= ANIMATION POMPE REELLE ================= */
      @keyframes realPushupBody {
        0%, 100% { transform: translateY(40px) rotateX(75deg) rotateY(0deg) rotateZ(10deg); }
        50% { transform: translateY(75px) rotateX(75deg) rotateY(0deg) rotateZ(10deg); }
      }
      @keyframes realPushupArm {
        0%, 100% { transform: rotateX(-20deg); }
        50% { transform: rotateX(-85deg); }
      }
      @keyframes realPushupForearm {
        0%, 100% { transform: rotateX(15deg); }
        50% { transform: rotateX(85deg); }
      }
      .anim-pushup-body { animation: realPushupBody 2s infinite ease-in-out; }
      .anim-pushup-arm { animation: realPushupArm 2s infinite ease-in-out; }
      .anim-pushup-forearm { animation: realPushupForearm 2s infinite ease-in-out; }

      /* ================= ANIMATION MOUNTAIN CLIMBER ================= */
      @keyframes climberLegL {
        0%, 100% { transform: rotateX(-40deg); }
        50% { transform: rotateX(-10deg); }
      }
      @keyframes climberLegR {
        0%, 100% { transform: rotateX(-10deg); }
        50% { transform: rotateX(-40deg); }
      }
      .anim-climber-body { transform: translateY(50px) rotateX(65deg) rotateY(0deg) rotateZ(15deg); }
      .anim-climber-thigh-L { animation: climberLegL 0.6s infinite linear; }
      .anim-climber-thigh-R { animation: climberLegR 0.6s infinite linear; }

      /* Interface Utilisateur */
      .glass-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 22px; margin-bottom: 15px; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // COMPOSANT HUMANOIDE ANATOMIQUE DE HAUTE QUALITÉ
  const RenderAnatomicalHuman = ({ type }) => {
    if (type === 'pushup' || type === 'plank') {
      const isPlank = type === 'plank';
      return (
        <div className="canvas-3d">
          <div className={`human-body ${isPlank ? '' : 'anim-pushup-body'}`} style={isPlank ? { transform: 'translateY(65px) rotateX(78deg) rotateY(0deg) rotateZ(15deg)' } : {}}>
            <div className="h-head"></div>
            <div className="h-torso"></div>
            <div className="h-pelvis" style={{ top: '98px' }}></div>
            {/* Bras gauche articulé */}
            <div className={`h-arm left-arm ${isPlank ? '' : 'anim-pushup-arm'}`} style={isPlank ? { transform: 'rotateX(-70deg)' } : {}}>
              <div className={`h-forearm ${isPlank ? '' : 'anim-pushup-forearm'}`} style={isPlank ? { transform: 'rotateX(70deg)' } : {}}></div>
            </div>
            {/* Bras droit articulé */}
            <div className={`h-arm right-arm ${isPlank ? '' : 'anim-pushup-arm'}`} style={isPlank ? { transform: 'rotateX(-70deg)' } : {}}>
              <div className={`h-forearm ${isPlank ? '' : 'anim-pushup-forearm'}`} style={isPlank ? { transform: 'rotateX(70deg)' } : {}}></div>
            </div>
            {/* Jambes tendues alignées */}
            <div className="h-thigh left-leg" style={{ transform: 'rotateX(-10deg)' }}>
              <div className="h-shin" style={{ transform: 'rotateX(5deg)' }}></div>
            </div>
            <div className="h-thigh right-leg" style={{ transform: 'rotateX(-10deg)' }}>
              <div className="h-shin" style={{ transform: 'rotateX(5deg)' }}></div>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'squat') {
      return (
        <div className="canvas-3d">
          <div className="human-body anim-squat-torso" style={{ top: '-15px' }}>
            <div className="h-head"></div>
            <div className="h-torso"></div>
            <div className="h-pelvis"></div>
            {/* Bras tendus devant pendant le squat */}
            <div className="h-arm left-arm anim-squat-arm"><div className="h-forearm" style={{ transform: 'rotateX(-10deg)' }}></div></div>
            <div className="h-arm right-arm anim-squat-arm"><div className="h-forearm" style={{ transform: 'rotateX(-10deg)' }}></div></div>
            {/* Jambes qui se plient complètement */}
            <div className="h-thigh left-leg anim-squat-thigh">
              <div className="h-shin anim-squat-shin"></div>
            </div>
            <div className="h-thigh right-leg anim-squat-thigh">
              <div className="h-shin anim-squat-shin"></div>
            </div>
          </div>
        </div>
      );
    }

    // Default: Mountain Climbers
    return (
      <div className="canvas-3d">
        <div className="human-body anim-climber-body">
          <div className="h-head"></div>
          <div className="h-torso"></div>
          <div className="h-pelvis" style={{ top: '98px' }}></div>
          {/* Appui fixe sur les bras */}
          <div className="h-arm left-arm" style={{ transform: 'rotateX(-50deg)' }}><div className="h-forearm" style={{ transform: 'rotateX(40deg)' }}></div></div>
          <div className="h-arm right-arm" style={{ transform: 'rotateX(-50deg)' }}><div className="h-forearm" style={{ transform: 'rotateX(40deg)' }}></div></div>
          {/* Genoux qui courent vers le torso */}
          <div className="h-thigh left-leg anim-climber-thigh-L">
            <div className="h-shin" style={{ transform: 'rotateX(40deg)' }}></div>
          </div>
          <div className="h-thigh right-leg anim-climber-thigh-R">
            <div className="h-shin" style={{ transform: 'rotateX(40deg)' }}></div>
          </div>
        </div>
      </div>
    );
  };

  const screenWrapperStyle = { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, boxSizing: 'border-box', margin: 0, padding: '30px 20px', background: 'linear-gradient(rgba(5, 8, 17, 0.90), rgba(9, 13, 26, 0.97)), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600") center center/cover', color: '#ffffff', textAlign: 'center', overflowY: 'auto' };

  // --- ÉCRAN 1 : CONNEXION ---
  if (!email || currentPath === '/') {
    return (
      <div style={screenWrapperStyle}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <h1 style={{ fontSize: '3.6rem', fontWeight: '900', margin: '20px 0 10px 0', letterSpacing: '-1.5px', lineHeight: '1' }}>Défi 60 Jours</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', marginBottom: '45px' }}>Votre entraînement hybride et votre nutrition sans aucune friction.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="Entrez votre e-mail..." required value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} style={{ padding: '20px 30px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1.1rem', textAlign: 'center', outline: 'none' }} />
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '20px', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase' }}>Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  if (currentPath === '/private-arena') {
    
    // --- ÉCRAN 2 : DASHBOARD ---
    if (workoutMode === 'dashboard') {
      return (
        <div style={screenWrapperStyle}>
          <button onClick={handleLogout} style={{ position: 'absolute', top: '30px', right: '40px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ef4444', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Quitter</button>

          <div style={{ maxWidth: '600px', width: '100%' }}>
            <h1 style={{ fontSize: '5rem', fontWeight: '900', margin: '10px 0 30px 0' }}>JOUR {currentDay}</h1>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '25px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div><span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>CALORIES REÇUES</span><strong style={{ fontSize: '1.8rem', color: '#ff3e6c' }}>{calories} kcal</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <button onClick={startFullWorkout} style={{ background: '#3b82f6', color: 'white', border: 'none', width: '100%', padding: '25px', borderRadius: '100px', fontWeight: '900', fontSize: '1.4rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                🏋️ Lancer ma séance
              </button>
              
              <button onClick={() => setWorkoutMode('nutrition')} style={{ background: 'transparent', color: '#10b981', border: '2px solid #10b981', width: '100%', padding: '20px', borderRadius: '100px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                🍽️ Mon Plan Alimentaire du jour
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 3 : NUTRITION CORRIGÉ (Bouton retour opérationnel) ---
    if (workoutMode === 'nutrition') {
      const diet = getDayNutrition(currentDay);
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '600px', width: '100%', paddingBottom: '40px' }}>
            {/* CORRECTION NAVIGATION : Retour propre au Dashboard */}
            <button onClick={() => setWorkoutMode('dashboard')} style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '50px', marginBottom: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s' }}>
              ← Retour au Dashboard
            </button>
            
            <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', fontWeight: '900' }}>MENU DU JOUR {currentDay}</h2>
            
            <div className="glass-card">
              <span style={{ color: '#ff9f43', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>🌅 Petit-déjeuner</span>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.5', color: '#cbd5e1' }}>{diet.breakfast}</p>
            </div>
            <div className="glass-card">
              <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>☀️ Déjeuner</span>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.5', color: '#cbd5e1' }}>{diet.lunch}</p>
            </div>
            <div className="glass-card">
              <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>⚡ Goûter (Collation)</span>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.5', color: '#cbd5e1' }}>{diet.snack}</p>
            </div>
            <div className="glass-card">
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>🌙 Dîner</span>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.5', color: '#cbd5e1' }}>{diet.dinner}</p>
            </div>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 4 : PREPARATION (10s) ---
    if (workoutMode === 'preparation') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '650px', width: '100%' }}>
            {/* Bouton pour abandonner la séance en cours et revenir sain et sauf au dashboard */}
            <button onClick={() => setWorkoutMode('dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>✕ Annuler la séance</button>
            <br/>
            <span style={{ fontSize: '1rem', color: '#ff9f43', fontWeight: 'bold', letterSpacing: '3px' }}>PRÉPARATION</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '15px 0 10px 0' }}>{currentEx?.name}</h1>
            <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>
              Objectif : {currentEx?.target} {currentEx?.unit}
            </p>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '20px', marginBottom: '35px' }}>
              <RenderAnatomicalHuman type={currentEx?.type} />
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '15px 0 0 0', lineHeight: '1.4' }}>{currentEx?.setup}</p>
            </div>

            <button onClick={startEffortPhase} style={{ background: '#10b981', color: 'white', border: 'none', padding: '18px 50px', borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer' }}>
              ⚡ Je suis prêt ({prepSeconds}s)
            </button>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 5 : EFFORT (Articulations humaines actives) ---
    if (workoutMode === 'effort') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '650px', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: '900', letterSpacing: '4px' }}>🔥 ACTION !</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '10px 0' }}>{currentEx?.name}</h1>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '20px', marginBottom: '35px' }}>
              <RenderAnatomicalHuman type={currentEx?.type} />
            </div>

            {currentEx?.mode === 'time' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'bold' }}>TEMPS RESTANT</span>
                <span style={{ fontSize: '6rem', fontWeight: '900', color: '#10b981', lineHeight: '1', margin: '10px 0 20px 0' }}>{effortSeconds}s</span>
                <button onClick={triggerRestOrFinish} style={{ background: 'transparent', color: '#64748b', border: '1px solid #64748b', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer' }}>Passer</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 'bold', marginBottom: '15px' }}>
                  Fais {currentEx?.target} répétitions à ton propre rythme !
                </span>
                <span style={{ color: '#64748b', marginBottom: '25px', fontSize: '1.1rem' }}>⏱️ Chrono : {elapsedTime}s</span>
                <button onClick={triggerRestOrFinish} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '25px 40px', borderRadius: '100px', fontWeight: '900', fontSize: '1.4rem', cursor: 'pointer', width: '100%', textTransform: 'uppercase', boxShadow: '0 10px 30px rgba(59,130,246,0.3)' }}>
                  ✅ J'ai fini mes répétitions
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- ÉCRAN 6 : REPOS ---
    if (workoutMode === 'rest') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <span style={{ fontSize: '1.1rem', color: '#ff9f43', fontWeight: 'bold', letterSpacing: '2px' }}>RÉCUPÉRATION</span>
            <p style={{ fontSize: '8rem', fontWeight: '900', color: '#ff9f43', margin: '10px 0 20px 0', lineHeight: '1' }}>{restSeconds}s</p>
            <button onClick={skipRestPeriod} style={{ padding: '20px 45px', borderRadius: '50px', border: 'none', background: '#ff9f43', color: '#050811', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', textTransform: 'uppercase' }}>Passer le repos →</button>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 7 : FIN ---
    if (workoutMode === 'finished') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '550px', width: '100%' }}>
            <span style={{ fontSize: '4.5rem' }}>👑</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', margin: '15px 0' }}>Séance Terminée !</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '45px' }}>Tu te rapproches de tes objectifs.</p>
            <button onClick={confirmDayAndClose} style={{ background: '#ffffff', color: '#050811', border: 'none', width: '100%', padding: '22px', borderRadius: '100px', fontWeight: '900', fontSize: '1.25rem', cursor: 'pointer', textTransform: 'uppercase' }}>🏆 Valider ma journée</button>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default App;
