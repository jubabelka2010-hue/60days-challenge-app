import React, { useState, useEffect } from 'react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [goal, setGoal] = useState(null); // 'perte' ou 'prise'
  
  // Gestion de l'inscription par e-mail
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('defi_email') || '';
  });
  const [inputEmail, setInputEmail] = useState('');

  // États de progression sauvegardés dans le téléphone
  const [currentDay, setCurrentDay] = useState(() => {
    return Number(localStorage.getItem('defi_day')) || 1;
  });
  const [calories, setCalories] = useState(() => {
    return Number(localStorage.getItem('defi_calories')) || 0;
  });
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    return JSON.parse(localStorage.getItem('defi_badges')) || ["🟢 Recrue"];
  });
  const [hasPaid, setHasPaid] = useState(() => {
    return localStorage.getItem('defi_has_paid') === 'true';
  });

  // Sauvegarde automatique des données
  useEffect(() => {
    localStorage.setItem('defi_day', currentDay);
    localStorage.setItem('defi_calories', calories);
    localStorage.setItem('defi_badges', JSON.stringify(unlockedBadges));
    localStorage.setItem('defi_email', email);
    localStorage.setItem('defi_has_paid', hasPaid);
  }, [currentDay, calories, unlockedBadges, email, hasPaid]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const paypalLink = "https://paypal.me/JubaBelkacemi/4.99";

  // Inscription à l'essai gratuit
  const handleStartFreeTrial = (e) => {
    e.preventDefault();
    if (!inputEmail.includes('@')) {
      alert("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    setEmail(inputEmail);
    navigateTo('/programme-secret');
  };

  // Logique de déblocage des badges
  const checkAndUnlockBadges = (day) => {
    let updatedBadges = [...unlockedBadges];
    if (day >= 7 && !updatedBadges.includes("🥉 Déterminé")) updatedBadges.push("🥉 Déterminé");
    if (day >= 15 && !updatedBadges.includes("🥈 Machine")) updatedBadges.push("🥈 Machine");
    if (day >= 30 && !updatedBadges.includes("🥇 Athlète")) updatedBadges.push("🥇 Athlète");
    if (day >= 45 && !updatedBadges.includes("🔥 Inarrêtable")) updatedBadges.push("🔥 Inarrêtable");
    if (day >= 60 && !updatedBadges.includes("👑 Légende")) updatedBadges.push("👑 Légende");
    setUnlockedBadges(updatedBadges);
  };

  // Validation d'une journée
  const handleDayValidation = () => {
    // Si l'utilisateur arrive à la fin du jour 7 et n'a pas payé, on bloque
    if (currentDay === 7 && !hasPaid) {
      alert("🔒 Vous avez terminé vos 7 jours d'essai gratuit ! Débloquez la suite pour continuer.");
      return;
    }

    const caloriesBurnedToday = 300 + (currentDay % 3) * 50; 
    setCalories(prev => prev + caloriesBurnedToday);

    if (currentDay < 60) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      checkAndUnlockBadges(nextDay);
    } else {
      alert("🏆 INCROYABLE ! Tu as terminé le Défi 60 Jours ! Tu es une véritable Légende !");
    }
  };

  const resetProgress = () => {
    if (window.confirm("Réinitialiser le défi ? Toutes tes statistiques seront effacées (sauf ton statut de paiement).")) {
      setCurrentDay(1);
      setCalories(0);
      setUnlockedBadges(["🟢 Recrue"]);
    }
  };

  // --- GÉNÉRATEUR DYNAMIQUE DE PROGRAMME (Cycle de 4 jours) ---
  const getProgramData = (day, objective) => {
    const cycle = day % 4;
    const estimatedCalories = 300 + (day % 3) * 50;
    let trainingType = "", sportList = [], nutritionTip = "", bonusChallenge = "";

    if (objective === 'perte') {
      if (cycle === 1) {
        trainingType = "🔥 Circuit Brûle-Graisse : Haut du Corps";
        sportList = ["Pompes inclinées (surélevé) : 4 séries de 15 réps", "Dips sur chaise : 3 séries de 12 réps", "Gainage planche abdominale : 4 séries de 45 sec", "Jumping Jacks : 1 min intensive après chaque série"];
        nutritionTip = "🥗 Salade de poulet émincé, concombre, tomates cerises et un filet d'huile d'olive. Zéro sucre aujourd'hui !";
        bonusChallenge = "💧 Bois un grand verre d'eau toutes les 2 heures sans faute.";
      } else if (cycle === 2) {
        trainingType = "🍗 Circuit Brûle-Graisse : Bas du Corps";
        sportList = ["Squats classiques : 4 séries de 25 réps", "Fentes alternées : 3 séries de 12 réps par jambe", "Relevés de bassin au sol : 4 séries de 20 réps", "Course sur place (genoux hauts) : 30 sec à fond à la fin"];
        nutritionTip = "🐟 Pavé de colin à la vapeur, brocolis et une petite patate douce.";
        bonusChallenge = "🚶‍♂️ Fais au moins 8 000 pas aujourd'hui dehors.";
      } else if (cycle === 3) {
        trainingType = "⚡ Cardio Full-Body & Abdos";
        sportList = ["Mountain Climbers : 4 séries de 40 sec", "Squat Jumps : 3 séries de 12 réps", "Abdos bicyclette : 4 séries de 20 réps", "Gainage planche latérale : 30 sec par côté"];
        nutritionTip = "🍳 Omelette de 3 blancs d'œufs, épinards frais et un demi-avocat.";
        bonusChallenge = "📱 Éteins tous tes écrans 1 heure avant de te coucher.";
      } else {
        trainingType = "🧘 Récupération Active & Mobilité";
        sportList = ["Étirements complets du corps : 10 minutes", "Marche rapide en extérieur : 30 minutes", "Cohérence cardiaque (respiration) : 5 minutes"];
        nutritionTip = "🍵 Soupe légère aux légumes avec blanc de dinde et une tasse de thé vert.";
        bonusChallenge = "🔋 Dors au moins 8 heures cette nuit.";
      }
    } else {
      if (cycle === 1) {
        trainingType = "💪 Force & Volume : Poitrine & Bras";
        sportList = ["Pompes classiques : 4 séries de 15 réps (1m30 de repos)", "Dips profonds sur chaises : 4 séries de 10 réps", "Pompes diamant : 3 séries de 8 réps", "Gainage militaire (Planche haut/bas) : 3 séries de 45 sec"];
        nutritionTip = "🥩 Steak haché 5% MG, 150g de riz basmati cuit et haricots verts.";
        bonusChallenge = "🥛 Prends 200g de fromage blanc avec des amandes à 16h.";
      } else if (cycle === 2) {
        trainingType = "🏋️‍♂️ Puissance : Jambes & Mollets";
        sportList = ["Squats complets (descente lente) : 4 séries de 15 réps", "Fentes bulgares (pied sur chaise) : 3 séries de 10 réps/jambe", "Squat Sumo : 4 séries de 15 réps", "Extensions de mollets debout : 4 séries de 25 réps"];
        nutritionTip = "🍗 Escalope de poulet grillée (200g), purée de patates douces (200g).";
        bonusChallenge = "🥑 Ajoute de bonnes graisses (noix, avocat) à ton petit-déjeuner.";
      } else if (cycle === 3) {
        trainingType = "🔱 Renforcement Dos & Abdos";
        sportList = ["Rowing inversé sous une table : 4 séries au max", "Superman (allongé sur le ventre) : 4 séries de 15 réps", "Crunchs abdominaux : 4 séries de 25 réps lentes", "Planche abdo avec sac à dos lesté : 3 séries de 45 sec"];
        nutritionTip = "🐟 Filet de saumon au four, quinoa (150g cuit) et asperges.";
        bonusChallenge = "🍳 Ajoute 2 œufs durs à ton menu aujourd'hui.";
      } else {
        trainingType = "💤 Repos Hypertrophique & Stretching";
        sportList = ["Étirements passifs : 15 minutes", "Marche tranquille à l'extérieur : 25 minutes", "Massage musculaire léger : 10 minutes"];
        nutritionTip = "🍌 Pancakes à la banane et à l'avoine maison avec un filet de miel.";
        bonusChallenge = "☕ Évite le café après 14h pour régénérer les fibres.";
      }
    }

    return { trainingType, sportList, nutritionTip, bonusChallenge, estimatedCalories };
  };

  // --- PAGE SECRÈTE ---
  if (currentPath === '/programme-secret') {
    // Sécurité au cas où quelqu'un tente d'entrer sans e-mail
    if (!email) {
      return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>
          <h2>🔒 Accès restreint</h2>
          <p style={{ margin: '15px 0', color: '#64748b' }}>Veuillez vous inscrire gratuitement sur la page d'accueil pour accéder au programme.</p>
          <button onClick={() => navigateTo('/')} className="paypal-btn" style={{ background: '#003087', color: 'white' }}>Retour à l'accueil</button>
        </div>
      );
    }

    const program = goal ? getProgramData(currentDay, goal) : null;
    const isLocked = currentDay === 7 && !hasPaid; // Bloqué après le jour 7 si non payé

    return (
      <div className="container">
        <header className="header">
          <h1>Mon Espace Défi ⚡</h1>
          <p className="subtitle" style={{ fontSize: '0.9rem', color: '#10b981' }}>👤 Connecté : {email}</p>
        </header>

        <main className="main-content">
          {/* STATS */}
          <section className="hero-card" style={{ background: '#0f172a', color: 'white', textAlign: 'left', padding: '20px' }}>
            <h3 style={{ color: '#ffc439', marginBottom: '15px' }}>📊 Tableau de Bord</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Calories Brûlées</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f43f5e' }}>{calories} kcal</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Progression</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>{currentDay}/60 Jours</p>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>🏅 Mes Badges :</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {unlockedBadges.map((badge, idx) => (
                <span key={idx} style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '50px', fontSize: '0.85rem', border: '1px solid #334155' }}>{badge}</span>
              ))}
            </div>
          </section>

          {isLocked ? (
            /* 🔒 MUR DE PAIEMENT APPRÈS LE JOUR 7 */
            <section className="hero-card" style={{ border: '2px solid #ffc439', background: '#fffbeb' }}>
              <h2 style={{ color: '#b45309' }}>🔒 Essai gratuit de 7 jours terminé !</h2>
              <p style={{ margin: '15px 0', color: '#78350f', lineHeight: '1.6' }}>
                Félicitations pour cette première semaine intensive ! Tu as prouvé ta détermination. Pour débloquer la suite (jours 8 à 60), recevoir tes prochains badges et aller jusqu'au bout de ta transformation, débloque ton accès à vie.
              </p>
              <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>4,99 € seulement</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Paiement unique, aucun abonnement caché</p>
              </div>
              <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="paypal-btn" style={{ fontSize: '1.2rem' }}>
                💛 Débloquer les 53 Jours Restants
              </a>
              <p style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '10px' }}>💳 Cartes Bancaires acceptées via PayPal</p>
              
              {/* Simulation de paiement pour le créateur en phase de test */}
              <button onClick={() => setHasPaid(true)} style={{ marginTop: '30px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>
                [Simuler un paiement réussi pour tester le Jour 8]
              </button>
            </section>
          ) : !goal ? (
            <section className="hero-card">
              <h2>🎯 Choisis ton objectif du jour</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <button onClick={() => setGoal('perte')} className="paypal-btn" style={{ background: '#ef4444', color: 'white', boxShadow: 'none' }}>🔥 Brûler de la graisse & Sécher</button>
                <button onClick={() => setGoal('prise')} className="paypal-btn" style={{ background: '#2563eb', color: 'white', boxShadow: 'none' }}>💪 Prendre de la masse musculaire</button>
              </div>
            </section>
          ) : (
            /* CONTENU DU JOUR UNIQUE */
            <section className="hero-card" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  ⚡ +{program.estimatedCalories} kcal à brûler
                </span>
                <button onClick={() => setGoal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>Changer d'objectif</button>
              </div>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{program.trainingType}</h2>
              
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', margin: '15px 0', borderLeft: '4px solid #3b82f6' }}>
                <h5 style={{ color: '#1e40af' }}>🍏 Menu Nutrition :</h5>
                <p style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>{program.nutritionTip}</p>
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>🏋️‍♂️ Exercices :</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '20px' }}>
                {program.sportList.map((ex, i) => (
                  <li key={i} style={{ marginBottom: '8px', fontSize: '0.9rem', display: 'flex' }}>
                    <span style={{ marginRight: '8px' }}>🔹</span><span>{ex}</span>
                  </li>
                ))}
              </ul>

              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', margin: '15px 0', borderLeft: '4px solid #22c55e' }}>
                <h5 style={{ color: '#166534' }}>🎯 Défi Mental :</h5>
                <p style={{ color: '#14532d', fontSize: '0.9rem' }}>{program.bonusChallenge}</p>
              </div>

              <button onClick={handleDayValidation} className="paypal-btn" style={{ background: '#003087', color: 'white', marginTop: '20px', width: '100%' }}>
                ✅ Valider la journée (+{program.estimatedCalories} kcal)
              </button>

              <button onClick={resetProgress} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', marginTop: '25px', display: 'block', width: '100%', textAlign: 'center' }}>⚠️ Réinitialiser ma progression</button>
            </section>
          )}

          <button onClick={() => navigateTo('/')} style={{ background: 'none', border: 'none', color: '#003087', cursor: 'pointer', textDecoration: 'underline', display: 'block', width: '100%', textAlign: 'center', marginTop: '15px' }}>← Retour à l'accueil</button>
        </main>
      </div>
    );
  }

  // --- PAGE D'ACCUEIL (VITRINE) ---
  return (
    <div className="container">
      <header className="header">
        <h1>Défi 60 Jours</h1>
        <p className="subtitle">Transforme ton corps et ton esprit gratuitement pendant 7 jours</p>
      </header>

      <main className="main-content">
        <section className="hero-card">
          <h2>Démarre ton essai gratuit de 7 jours 🚀</h2>
          <p style={{ color: '#64748b', margin: '10px 0 25px 0', lineHeight: '1.5' }}>
            Teste le programme complet, suis tes séances et commence à collecter tes badges dès maintenant. Aucune carte bancaire requise.
          </p>
          
          {/* Formulaire d'inscription par e-mail */}
          <form onSubmit={handleStartFreeTrial} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
            <input 
              type="email" 
              placeholder="Entre ton adresse e-mail..." 
              required
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              style={{ padding: '15px 20px', borderRadius: '50px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', textAlign: 'center' }}
            />
            <button type="submit" className="paypal-btn" style={{ background: '#10b981', color: 'white', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
              🟢 Commencer l'essai gratuit
            </button>
          </form>

          <ul className="features" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <li>🆓 <strong>7 Jours d'essai 100% Gratuits</strong> (sans engagement)</li>
            <li>🏋️‍♂️ Séances et menus différents chaque matin</li>
            <li>🔥 Compteur interactif de calories brûlées</li>
            <li>🔒 Accès complet de 60 jours pour seulement 4,99 € après l'essai</li>
          </ul>
        </section>

        {/* Option pour ceux qui ont déjà un compte en cours */}
        {email && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button onClick={() => navigateTo('/programme-secret')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
              ⚡ Reprendre mon défi en cours ({email})
            </button>
          </div>
        )}

        {/* Bouton pour simuler et tester le blocage pour toi */}
        <div style={{ textAlign: 'center', marginTop: '30px', opacity: 0.5 }}>
          <button onClick={() => { setEmail('test@demo.com'); setCurrentDay(7); setHasPaid(false); navigateTo('/programme-secret'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'dashed underline' }}>
            🔧 Mode Test Rapide : Aller directement au Mur de Paiement (Jour 7)
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
