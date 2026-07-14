import React, { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState(() => localStorage.getItem('defi_fullscreen_email') || '');
  const [currentPath, setCurrentPath] = useState(localStorage.getItem('defi_fullscreen_email') ? '/private-arena' : '/');
  
  const [currentDay, setCurrentDay] = useState(1);
  const [calories, setCalories] = useState(0);
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  // États des timers
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [effortSeconds, setEffortSeconds] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restSeconds, setRestSeconds] = useState(30);

  // Persistence auto
  useEffect(() => {
    if (email) {
      localStorage.setItem('defi_fullscreen_email', email);
      localStorage.setItem(`${email}_day`, currentDay);
    }
  }, [email, currentDay]);

  // LOGIQUE DE PROGRESSION (Plus de hasard, surcharge progressive)
  function getDayProgram(day) {
    const intensityFactor = Math.floor(day / 7) + 1; // Augmente tous les 7 jours
    return [
      { name: "Pompes Classiques", target: 10 + (intensityFactor * 2), unit: "Reps", mode: "reps", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZGp6ZjhxbmR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTjJp8yYyG2bkc/giphy.gif" },
      { name: "Gainage (Planche)", target: 30 + (intensityFactor * 5), unit: "Sec", mode: "time", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZGp6ZjhxbmR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxHOGTdzJC/giphy.gif" },
      { name: "Squats", target: 15 + (intensityFactor * 3), unit: "Reps", mode: "reps", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZGp6ZjhxbmR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTjJp8yYyG2bkc/giphy.gif" }
    ];
  }

  // --- COMPOSANT D'AFFICHAGE EXERCICE (Avec vrai GIF) ---
  const ExerciseVisualizer = ({ gif }) => (
    <div style={{ margin: '20px auto', borderRadius: '15px', overflow: 'hidden', width: '300px', height: '200px', background: '#000' }}>
      <img src={gif} alt="exercice" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );

  // ... (Garder le reste de la logique de timer identique au précédent)

  // --- ÉCRAN NUTRITION AVEC BOUTON RETOUR ---
  if (workoutMode === 'nutrition') {
    return (
      <div style={{ padding: '40px', color: 'white', minHeight: '100vh', background: '#050811' }}>
        <button onClick={() => setWorkoutMode('dashboard')} style={{ marginBottom: '20px', padding: '10px 20px', background: '#3b82f6', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer' }}>
          ← Retour à l'accueil
        </button>
        <h1>Plan Alimentaire - Jour {currentDay}</h1>
        {/* Ton contenu nutrition ici */}
      </div>
    );
  }

  // ... (Reste de l'application)
}
