import React, { useState, useEffect } from 'react';

const App = () => {
  // --- ÉTATS PERSISTANTS (Gardent les infos même après fermeture du navigateur) ---
  const [user, setUser] = useState(() => localStorage.getItem('user_email') || null);
  const [day, setDay] = useState(() => Number(localStorage.getItem('current_day')) || 1);
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem('is_paid') === 'true');
  const [activeTab, setActiveTab] = useState('workout');

  // --- SAUVEGARDE AUTOMATIQUE ---
  useEffect(() => {
    localStorage.setItem('user_email', user || '');
    localStorage.setItem('current_day', day);
    localStorage.setItem('is_paid', isPaid);
  }, [user, day, isPaid]);

  // --- LOGIQUE DES EXERCICES ---
  const getExerciseCount = (d) => {
    if (d <= 7) return 10;
    if (d <= 25) return 13;
    if (d <= 50) return 17;
    return 20;
  };

  // --- LOGIQUE DES BADGES ---
  const getBadge = (d) => {
    if (d === 7) return "🏅 Badge Débutant (Jour 7)";
    if (d === 20) return "🔥 Badge Guerrier (Jour 20)";
    if (d === 30) return "⚡ Badge Athlète (Jour 30)";
    if (d === 40) return "🦾 Badge Machine (Jour 40)";
    if (d === 50) return "👑 Badge Légende (Jour 50)";
    if (d === 60) return "🏆 Badge Ultime (Jour 60)";
    return null;
  };

  // --- STYLES CSS INLIGNES (Design Sportif Sombre) ---
  const styles = {
    container: { background: '#0a0a0a', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'Arial, sans-serif' },
    card: { background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' },
    button: { background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', width: '100%' },
    payButton: { background: '#eab308', color: '#000', border: 'none', padding: '15px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem', marginTop: '20px' }
  };

  // --- ÉCRAN CONNEXION ---
  if (!user) {
    return (
      <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>PRO ATHLÈTE</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>Connectez-vous pour commencer votre transformation.</p>
        <input 
          type="email" 
          placeholder="Votre email..." 
          style={{ padding: '15px', borderRadius: '10px', width: '250px', marginBottom: '10px', border: 'none' }}
          onChange={(e) => this.inputVal = e.target.value}
        />
        <button style={styles.button} onClick={() => setUser(this.inputVal || 'athlète@sport.com')}>Commencer maintenant</button>
      </div>
    );
  }

  // --- ÉCRAN DASHBOARD ---
  return (
    <div style={styles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Jour {day}</h1>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Déconnexion</button>
      </header>

      {/* BADGE */}
      {getBadge(day) && <div style={{ background: '#eab308', padding: '15px', borderRadius: '10px', color: '#000', fontWeight: 'bold', marginBottom: '20px' }}>{getBadge(day)}</div>}

      {/* SYSTÈME DE PAIEMENT */}
      {day > 7 && !isPaid ? (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '40px', border: '2px dashed #eab308', borderRadius: '20px' }}>
          <div style={{ fontSize: '4rem' }}>🔒</div>
          <h2>Contenu verrouillé</h2>
          <p>Le programme complet est accessible pour 4,99 €.</p>
          <button style={styles.payButton} onClick={() => window.open("https://paypal.me/JubaBelkacemi", "_blank")}>Payer 4,99 € via PayPal</button>
          <p style={{ marginTop: '20px', fontSize: '0.9rem', cursor: 'pointer', color: '#3b82f6' }} onClick={() => setIsPaid(true)}>Déjà payé ? Cliquez ici pour débloquer.</p>
        </div>
      ) : (
        <div>
          {/* NAVIGATION */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button style={{ ...styles.button, background: activeTab === 'workout' ? '#3b82f6' : '#222' }} onClick={() => setActiveTab('workout')}>Séances</button>
            <button style={{ ...styles.button, background: activeTab === 'nutrition' ? '#10b981' : '#222' }} onClick={() => setActiveTab('nutrition')}>Nutrition</button>
          </div>

          {/* CONTENU */}
          {activeTab === 'workout' ? (
            <div style={styles.card}>
              <h3>Séance du jour : {getExerciseCount(day)} exercices</h3>
              <p>Échauffement inclus : 3 exercices (Rotations, Jumping Jacks, Gainage dynamique).</p>
              <p>Variations : Exercices adaptés selon votre progression (Cycle de 5 jours).</p>
              <button style={{ ...styles.button, background: '#22c55e' }} onClick={() => setDay(day + 1)}>Valider la séance et passer au Jour {day + 1}</button>
            </div>
          ) : (
            <div style={styles.card}>
              <h3>Plan Nutritionnel</h3>
              <p>{day % 2 === 0 ? "Option Sèche : Salade composée, Protéines maigres (Poulet/Poisson), Légumes verts." : "Option Prise de masse : Riz complet, Viande blanche, Avocat, Shaker de protéines."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
