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

  // Modes : 'dashboard' | 'nutrition' | 'preparation' | 'effort' | 'rest' | 'finished' | 'payment'
  const [workoutMode, setWorkoutMode] = useState('dashboard');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Chronomètres dynamiques
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [effortSeconds, setEffortSeconds] = useState(0); // Mode temps (décompte)
  const [elapsedTime, setElapsedTime] = useState(0); // Mode répétitions (chrono ascendant)
  const [restSeconds, setRestSeconds] = useState(30);

  // ===================== NOUVEAU : PROFIL UTILISATEUR =====================
  const [profile, setProfile] = useState(null); // { weight, age, height, gender, goal }
  const [profileForm, setProfileForm] = useState({ weight: '', age: '', height: '', gender: 'homme', goal: 'perte_poids', displayName: '', avatar: '🙂' });

  // ===================== NOUVEAU : PAIEMENT / DEBLOCAGE =====================
  const [isUnlocked, setIsUnlocked] = useState(false);
  const PAYWALL_DAY = 7;
  const PAYPAL_LINK = 'https://paypal.me/JubaBelkacemi';

  // ===================== NOUVEAU : BADGES =====================
  const BADGE_DAYS = [7, 15, 20, 30, 40, 60];
  const BADGE_LABELS = {
    7: { icon: '🔓', label: 'Cap des 7 jours' },
    15: { icon: '🥉', label: '15 jours de constance' },
    20: { icon: '🥈', label: '20 jours, mental d\'acier' },
    30: { icon: '🥇', label: 'Mi-parcours : 30 jours' },
    40: { icon: '💎', label: '40 jours, presque au bout' },
    60: { icon: '👑', label: 'Défi terminé !' }
  };
  const [badges, setBadges] = useState([]);

  // ===================== NOUVEAU : SUIVI DU CLIC SUR "PAYER" =====================
  // Le bouton "J'ai payé" ne doit apparaître qu'après que la personne ait cliqué sur "Payer"
  const [paymentClicked, setPaymentClicked] = useState(false);

  // ===================== NOUVEAU : PIÈCES + PERSONNAGES (BOUTIQUE) =====================
  const [coins, setCoins] = useState(0);
  const [ownedCharacters, setOwnedCharacters] = useState(['c1']); // le premier personnage est offert
  const [equippedCharacter, setEquippedCharacter] = useState('c1');
  const CHARACTERS = [
    { id: 'c1', name: 'Débutant', cost: 10, icon: '🙂' },
    { id: 'c2', name: 'Sportif', cost: 25, icon: '🏃' },
    { id: 'c3', name: 'Ninja Agile', cost: 40, icon: '🥷' },
    { id: 'c4', name: 'Chevalier', cost: 60, icon: '🛡️' },
    { id: 'c5', name: 'Pirate', cost: 90, icon: '🏴‍☠️' },
    { id: 'c6', name: 'Sorcier', cost: 130, icon: '🧙' },
    { id: 'c7', name: 'Super-Héros', cost: 180, icon: '🦸' },
    { id: 'c8', name: 'Champion Légendaire', cost: 230, icon: '👑' }
  ];

  // ===================== NOUVEAU : PARCOURS / SAISONS / JOUR ACTIF =====================
  const [viewSeason, setViewSeason] = useState(1); // 1 = jours 1-30, 2 = jours 31-60
  const [activeDay, setActiveDay] = useState(1); // jour affiché pendant une séance/un menu (peut différer de currentDay si on "refait" un jour passé)
  const [dayModal, setDayModal] = useState(null); // numéro du jour dont la popup est ouverte, ou null

  // Avatars disponibles pour le profil (pas d'upload de photo possible sans serveur, donc choix d'un avatar emoji)
  const AVATAR_OPTIONS = ['🙂', '😎', '💪', '🔥', '🐯', '🦁', '🧑‍🚀', '🥷'];

  // ===================== NOUVEAU : TÂCHE MENTALE DU JOUR =====================
  const MENTAL_TASKS = [
    "Marche 5000 pas aujourd'hui, où que tu sois.",
    "Pas de téléphone dans la dernière heure avant de dormir.",
    "Bois au moins 1,5L d'eau aujourd'hui, note chaque verre.",
    "Écris 3 choses pour lesquelles tu es reconnaissant(e).",
    "Fais 10 minutes d'étirements avant de dormir.",
    "Aucune boisson sucrée aujourd'hui.",
    "Couche-toi avant 23h ce soir.",
    "Prends 5 minutes pour respirer calmement, sans écran.",
    "Prépare tes repas de demain à l'avance.",
    "Fais une pause de 10 min dehors, à la lumière naturelle.",
    "Note ton poids et une photo de progression.",
    "Supprime les grignotages entre les repas aujourd'hui.",
    "Range ton téléphone à un autre endroit pendant 2h.",
    "Fais 5000 pas de plus que ta moyenne habituelle.",
    "Dis-toi 3 fois aujourd'hui : « Je tiens mes engagements »."
  ];

  // Charger les données de la session active
  useEffect(() => {
    if (email) {
      const savedDay = localStorage.getItem(`${email}_fs_day`);
      const savedCalories = localStorage.getItem(`${email}_fs_calories`);
      setCurrentDay(savedDay ? Number(savedDay) : 1);
      setCalories(savedCalories ? Number(savedCalories) : 0);

      const savedProfile = localStorage.getItem(`${email}_fs_profile`);
      setProfile(savedProfile ? JSON.parse(savedProfile) : null);

      const savedPaid = localStorage.getItem(`${email}_fs_paid`);
      setIsUnlocked(savedPaid === 'true');

      const savedBadges = localStorage.getItem(`${email}_fs_badges`);
      setBadges(savedBadges ? JSON.parse(savedBadges) : []);

      const savedPayClicked = localStorage.getItem(`${email}_fs_pay_clicked`);
      setPaymentClicked(savedPayClicked === 'true');

      const savedCoins = localStorage.getItem(`${email}_fs_coins`);
      setCoins(savedCoins ? Number(savedCoins) : 0);

      const savedChars = localStorage.getItem(`${email}_fs_characters`);
      setOwnedCharacters(savedChars ? JSON.parse(savedChars) : ['c1']);

      const savedEquipped = localStorage.getItem(`${email}_fs_equipped`);
      setEquippedCharacter(savedEquipped || 'c1');

      setActiveDay(savedDay ? Number(savedDay) : 1);
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

  // Sauvegarder le profil dès qu'il change
  useEffect(() => {
    if (email && profile) {
      localStorage.setItem(`${email}_fs_profile`, JSON.stringify(profile));
    }
  }, [profile, email]);

  // Sauvegarder le statut de paiement
  useEffect(() => {
    if (email) {
      localStorage.setItem(`${email}_fs_paid`, isUnlocked ? 'true' : 'false');
    }
  }, [isUnlocked, email]);

  // Sauvegarder les badges
  useEffect(() => {
    if (email) {
      localStorage.setItem(`${email}_fs_badges`, JSON.stringify(badges));
    }
  }, [badges, email]);

  // Sauvegarder le clic sur "Payer"
  useEffect(() => {
    if (email) {
      localStorage.setItem(`${email}_fs_pay_clicked`, paymentClicked ? 'true' : 'false');
    }
  }, [paymentClicked, email]);

  // Sauvegarder les pièces et les personnages
  useEffect(() => {
    if (email) {
      localStorage.setItem(`${email}_fs_coins`, coins);
      localStorage.setItem(`${email}_fs_characters`, JSON.stringify(ownedCharacters));
      localStorage.setItem(`${email}_fs_equipped`, equippedCharacter);
    }
  }, [coins, ownedCharacters, equippedCharacter, email]);

  // Attribution automatique des badges + verrouillage au jour du paywall
  useEffect(() => {
    if (!email) return;
    BADGE_DAYS.forEach((d) => {
      if (currentDay >= d && !badges.includes(d)) {
        setBadges((prev) => (prev.includes(d) ? prev : [...prev, d]));
      }
    });
    if (currentDay >= PAYWALL_DAY && !isUnlocked && workoutMode === 'dashboard') {
      setWorkoutMode('payment');
    }
  }, [currentDay, email, isUnlocked]);

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

  // NOTE : ces deux fonctions doivent être définies AVANT l'appel à getDayProgram juste en dessous,
  // sinon ça provoque une erreur "Cannot access before initialization" et un écran blanc.
  const calculateBMI = (p) => {
    if (!p || !p.height || !p.weight) return null;
    const heightM = p.height / 100;
    return p.weight / (heightM * heightM);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return 'inconnu';
    if (bmi < 18.5) return 'maigreur';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'surpoids';
    return 'obesite';
  };

  const program = getDayProgram(activeDay, profile);
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

    const existingProfile = localStorage.getItem(`${cleanEmail}_fs_profile`);
    if (!existingProfile) {
      navigateTo('/profile-setup');
    } else {
      navigateTo('/private-arena');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('defi_fullscreen_email');
    setEmail('');
    setInputEmail('');
    setWorkoutMode('dashboard');
    navigateTo('/');
  };

  // ===================== NOUVEAU : SOUMISSION DU PROFIL =====================
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const w = Number(profileForm.weight);
    const a = Number(profileForm.age);
    const h = Number(profileForm.height);
    if (!w || !a || !h) return alert("Merci de remplir ton poids, ton âge et ta taille.");
    const newProfile = {
      weight: w, age: a, height: h, gender: profileForm.gender, goal: profileForm.goal,
      displayName: profileForm.displayName?.trim() || email.split('@')[0],
      avatar: profileForm.avatar || '🙂'
    };
    setProfile(newProfile);
    if (email) localStorage.setItem(`${email}_fs_profile`, JSON.stringify(newProfile));
    navigateTo('/private-arena');
  };

  // ===================== NOUVEAU : MODIFIER LE PROFIL EXISTANT (nom + avatar) =====================
  const handleProfileEditSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = { ...profile, displayName: profileForm.displayName?.trim() || profile.displayName, avatar: profileForm.avatar || profile.avatar };
    setProfile(updatedProfile);
    if (email) localStorage.setItem(`${email}_fs_profile`, JSON.stringify(updatedProfile));
    setWorkoutMode('dashboard');
  };

  // ===================== NOUVEAU : DEBLOCAGE PAIEMENT =====================
  const confirmPayment = () => {
    setIsUnlocked(true);
    setWorkoutMode('dashboard');
  };

  const startFullWorkout = () => {
    if (currentDay >= PAYWALL_DAY && !isUnlocked) {
      setWorkoutMode('payment');
      return;
    }
    setActiveDay(currentDay);
    setCurrentExerciseIndex(0);
    resetTimersForExercise(0);
    setWorkoutMode('preparation');
  };

  // ===================== NOUVEAU : OUVRIR UN JOUR DU PARCOURS (checkpoint) =====================
  const openDayModal = (day) => {
    if (day > currentDay) return; // jour verrouillé, pas encore atteint
    if (day >= PAYWALL_DAY && !isUnlocked) {
      setDayModal(null);
      setWorkoutMode('payment');
      return;
    }
    setDayModal(day);
  };

  const launchDayWorkout = (day) => {
    setActiveDay(day);
    setDayModal(null);
    setCurrentExerciseIndex(0);
    resetTimersForExercise(0);
    setWorkoutMode('preparation');
  };

  const launchDayMenu = (day) => {
    setActiveDay(day);
    setDayModal(null);
    setWorkoutMode('nutrition');
  };

  // ===================== NOUVEAU : ACHETER UN PERSONNAGE DANS LA BOUTIQUE =====================
  const buyCharacter = (character) => {
    if (ownedCharacters.includes(character.id)) {
      setEquippedCharacter(character.id);
      return;
    }
    if (coins < character.cost) {
      alert("Pas assez de pièces pour ce personnage.");
      return;
    }
    setCoins(prev => prev - character.cost);
    setOwnedCharacters(prev => [...prev, character.id]);
    setEquippedCharacter(character.id);
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

  // Estimation des calories brûlées pour un jour donné (sert aussi à calculer les pièces gagnées)
  const estimateSessionCalories = (day) => {
    return Math.round(250 * (1 + (Math.min(day, 60) - 1) * (0.5 / 59)));
  };

  const confirmDayAndClose = () => {
    const sessionCalories = estimateSessionCalories(activeDay);
    const earnedCoins = Math.max(1, Math.round(sessionCalories / 10));
    setCalories(prev => prev + sessionCalories);
    setCoins(prev => prev + earnedCoins);
    // On ne fait avancer le jour du parcours que si c'est bien la séance du jour courant
    // (si la personne rejoue un jour déjà terminé, elle gagne quand même des pièces, mais ça n'avance pas le parcours)
    if (activeDay === currentDay) {
      setCurrentDay(prev => prev + 1);
    }
    setWorkoutMode('dashboard');
  };

  // ===================== ÉTENDU : PROGRAMME DE 12 EXERCICES MINIMUM =====================
  // Pool élargi de mouvements couvrant tout le corps, avec profil d'intensité par objectif
  function getDayProgram(day, userProfile) {
    const allMovements = [
      { name: "Pompes Classiques", base: 12, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Mains écartées, corps droit, descendez la poitrine près du sol." },
      { name: "Mountain Climbers", base: 40, unit: "Secondes", mode: "time", type: "climber", setup: "En position de planche, ramenez alternativement vos genoux vers la poitrine." },
      { name: "Squats Profonds", base: 15, unit: "Répétitions", mode: "reps", type: "squat", setup: "Pieds largeur d'épaules, descendez les fesses sous la ligne des genoux." },
      { name: "Gainage Planche", base: 40, unit: "Secondes", mode: "time", type: "plank", setup: "Sur les avant-bras, contractez les abdos et fessiers, ne creusez pas le dos." },
      { name: "Pompes Diamant", base: 8, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Formez un diamant avec vos index et pouces sous votre poitrine." },
      { name: "Fentes Avant", base: 12, unit: "Répétitions (par jambe)", mode: "reps", type: "squat", setup: "Faites un grand pas en avant, descendez le genou arrière près du sol." },
      { name: "Squat Sauté", base: 10, unit: "Répétitions", mode: "reps", type: "squat", setup: "Descendez en squat puis sautez explosivement vers le haut." },
      { name: "Planche Latérale", base: 30, unit: "Secondes (par côté)", mode: "time", type: "plank", setup: "Sur un avant-bras, corps aligné, hanches levées." },
      { name: "Burpees", base: 8, unit: "Répétitions", mode: "reps", type: "climber", setup: "Squat, planche, pompe, saut vertical : enchaînez le mouvement complet." },
      { name: "Superman", base: 15, unit: "Répétitions", mode: "reps", type: "plank", setup: "Allongé sur le ventre, levez bras et jambes simultanément." },
      { name: "Crunchs Abdominaux", base: 20, unit: "Répétitions", mode: "reps", type: "plank", setup: "Allongé sur le dos, genoux pliés, contractez les abdos vers le haut." },
      { name: "Jumping Jacks", base: 45, unit: "Secondes", mode: "time", type: "climber", setup: "Écartez bras et jambes en sautant, revenez position de départ." },
      { name: "Pompes Surélevées", base: 12, unit: "Répétitions", mode: "reps", type: "pushup", setup: "Mains sur un support surélevé, gardez le corps gainé." },
      { name: "Chaise Murale", base: 35, unit: "Secondes", mode: "time", type: "squat", setup: "Dos contre un mur, cuisses parallèles au sol, tenez la position." },
      { name: "Gainage Dynamique", base: 30, unit: "Secondes", mode: "time", type: "plank", setup: "En planche, touchez alternativement l'épaule opposée avec la main." }
    ];

    // Multiplicateur d'intensité selon l'objectif choisi
    const goalMultiplier = {
      perte_poids: 1.15,   // plus de répétitions / cardio
      perte_graisse: 1.2,  // le plus cardio-intensif
      prise_masse: 0.9,    // séries plus courtes mais plus intenses/lourdes en tempo
      maintien: 1.0
    };
    const goal = userProfile?.goal || 'maintien';
    const gMult = goalMultiplier[goal] || 1.0;

    // Ajustement selon l'IMC : on part plus doucement si l'IMC est élevé, pour progresser sans blessure
    const bmi = calculateBMI(userProfile);
    let bmiMult = 1.0;
    if (bmi) {
      if (bmi >= 30) bmiMult = 0.75;
      else if (bmi >= 25) bmiMult = 0.9;
      else if (bmi < 18.5) bmiMult = 0.85;
    }

    // Progression de l'intensité : de +0% (jour 1) à +80% (jour 60)
    const progressionMult = 1 + (Math.min(day, 60) - 1) * (0.8 / 59);

    const totalMult = gMult * bmiMult * progressionMult;

    // On sélectionne 12 mouvements différents pour la journée, en tournant dans le pool
    const dayList = [];
    const poolSize = allMovements.length;
    for (let i = 0; i < 12; i++) {
      const idx = (day - 1 + i * 3) % poolSize; // pas de 3 pour varier l'ordre jour après jour
      const mv = allMovements[idx];
      const scaledTarget = Math.max(5, Math.round(mv.base * totalMult));
      dayList.push({
        name: mv.name,
        target: scaledTarget,
        unit: mv.unit,
        mode: mv.mode,
        type: mv.type,
        setup: mv.setup
      });
    }
    return dayList;
  }

  // ===================== ÉTENDU : NUTRITION QUI CHANGE CHAQUE JOUR =====================
  // Larges banques de repas, combinées différemment chaque jour pour ne jamais se répéter sur 60 jours
  function getDayNutrition(day, userProfile) {
    const breakfasts = [
      "Flocons d'avoine (60g), 1 banane, 3 œufs brouillés, Thé vert sans sucre.",
      "Pain complet (2 tranches), Fromage blanc (150g), Fruits rouges, Café noir.",
      "Omelette (3 œufs), Avocat (1/2), Tomates cerises, Thé.",
      "Smoothie protéiné (banane, lait d'amande, whey), Poignée de noix.",
      "Pancakes à l'avoine et blancs d'œufs, Miel léger, Fruits de saison.",
      "Yaourt grec (200g), Granola maison, Myrtilles.",
      "Toast à l'avocat et œuf poché, Jus d'orange pressé.",
      "Porridge au lait d'amande, Graines de chia, Compote sans sucre.",
      "Crêpes protéinées (œufs, flocons d'avoine), Fruits frais.",
      "Bol de fromage blanc, Amandes, Cannelle, 1 pomme."
    ];
    const lunches = [
      "Blanc de poulet grillé (150g), Quinoa (100g), Brocolis vapeur à l'huile d'olive.",
      "Filet de dinde (150g), Riz complet (100g), Haricots verts.",
      "Saumon grillé, Patate douce rôtie, Épinards sautés.",
      "Bœuf maigre grillé (150g), Boulgour, Poivrons rôtis.",
      "Bowl de lentilles, Poulet effiloché, Légumes croquants.",
      "Poisson blanc au four, Riz basmati, Courgettes vapeur.",
      "Wrap complet au poulet et crudités, Houmous.",
      "Steak haché 5% (150g), Purée de patate douce, Salade verte.",
      "Cabillaud vapeur, Quinoa aux herbes, Carottes rôties.",
      "Poulet mariné au citron, Semoule complète, Ratatouille."
    ];
    const snacks = [
      "1 poignée d'amandes (30g), 1 pomme, 1 shaker de protéines.",
      "Fromage blanc (100g), 1 poignée de noix de cajou.",
      "1 banane, Beurre de cacahuète (1 c.à.s).",
      "Barre protéinée maison, Thé vert.",
      "Yaourt grec, Quelques carrés de chocolat noir 85%.",
      "1 poignée de fruits secs, 1 œuf dur.",
      "Smoothie vert (épinards, pomme, gingembre).",
      "Bâtonnets de légumes, Houmous maison."
    ];
    const dinners = [
      "Pavé de saumon au four, Patates douces rôties, Grande salade verte.",
      "Blanc de poulet, Légumes vapeur (brocolis, carottes), Riz complet.",
      "Omelette aux légumes, Salade de tomates.",
      "Soupe de légumes maison, Œuf poché, Pain complet léger.",
      "Poisson blanc grillé, Purée de courgettes, Quinoa.",
      "Salade composée (thon, œuf, crudités, avoine).",
      "Filet de poulet grillé, Poêlée de légumes verts.",
      "Crevettes sautées, Riz complet, Légumes wok.",
      "Dinde grillée, Ratatouille maison.",
      "Velouté de légumes, Blanc de poulet effiloché."
    ];

    // Décalages différents pour chaque repas afin de maximiser la variété des combinaisons sur 60 jours
    const bIdx = (day - 1) % breakfasts.length;
    const lIdx = (day * 3 - 1) % lunches.length;
    const sIdx = (day * 5 - 1) % snacks.length;
    const dIdx = (day * 7 - 1) % dinners.length;

    // Ajustement des portions selon l'objectif (indicatif, pas de calcul calorique médical précis)
    const goal = userProfile?.goal || 'maintien';
    let portionNote = '';
    if (goal === 'prise_masse') portionNote = ' (portion augmentée + 1 collation supplémentaire recommandée)';
    else if (goal === 'perte_poids' || goal === 'perte_graisse') portionNote = ' (portion modérée, priorité aux légumes)';

    return {
      breakfast: breakfasts[bIdx] + (goal === 'prise_masse' ? portionNote : ''),
      lunch: lunches[lIdx] + portionNote,
      snack: snacks[sIdx],
      dinner: dinners[dIdx] + portionNote
    };
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

  /* Badges */
  .badge-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; padding: 8px 14px; font-size: 0.85rem; font-weight: bold; color: #e2e8f0; }
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

  // --- NOUVEAU : ÉCRAN PROFIL (poids, âge, taille, sexe, objectif) ---
  if (currentPath === '/profile-setup') {
    return (
      <div style={screenWrapperStyle}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '8px' }}>Dis-nous en plus sur toi</h1>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Ces infos servent à adapter tes exercices et tes repas à ton profil.</p>
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Ton prénom / pseudo</label>
            <input type="text" value={profileForm.displayName} onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })} placeholder="Ex : Juba" style={{ padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1rem', outline: 'none' }} />

            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Choisis ton avatar</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVATAR_OPTIONS.map((a) => (
                <button type="button" key={a} onClick={() => setProfileForm({ ...profileForm, avatar: a })} style={{ fontSize: '1.6rem', padding: '8px 12px', borderRadius: '12px', border: profileForm.avatar === a ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', cursor: 'pointer' }}>{a}</button>
              ))}
            </div>

            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Poids (kg)</label>
            <input type="number" min="1" value={profileForm.weight} onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })} style={{ padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1rem', outline: 'none' }} required />

            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Âge</label>
            <input type="number" min="1" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} style={{ padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1rem', outline: 'none' }} required />

            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Taille (cm)</label>
            <input type="number" min="1" value={profileForm.height} onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })} style={{ padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1rem', outline: 'none' }} required />

            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Sexe</label>
            <select value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })} style={{ padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1rem', outline: 'none' }}>
              <option value="homme" style={{ color: '#000' }}>Homme</option>
              <option value="femme" style={{ color: '#000' }}>Femme</option>
            </select>

            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Objectif</label>
            <select value={profileForm.goal} onChange={(e) => setProfileForm({ ...profileForm, goal: e.target.value })} style={{ padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1rem', outline: 'none' }}>
              <option value="perte_poids" style={{ color: '#000' }}>Perte de poids</option>
              <option value="prise_masse" style={{ color: '#000' }}>Prise de masse</option>
              <option value="perte_graisse" style={{ color: '#000' }}>Perte de graisse</option>
              <option value="maintien" style={{ color: '#000' }}>Se maintenir en forme</option>
            </select>

            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '18px', borderRadius: '50px', fontWeight: '900', fontSize: '1.05rem', cursor: 'pointer', textTransform: 'uppercase', marginTop: '10px' }}>Valider mon profil</button>
          </form>
        </div>
      </div>
    );
  }

  if (currentPath === '/private-arena') {

    // --- NOUVEAU : ÉCRAN PAIEMENT (jour 7 verrouillé) ---
    if (workoutMode === 'payment') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <span style={{ fontSize: '3.5rem' }}>🔒</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: '15px 0' }}>Jour 7 débloqué en accès premium</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Tu as terminé les 6 premiers jours, bravo ! Pour continuer le Défi 60 Jours jusqu'au bout (séances, nutrition et badges), débloque l'accès complet pour 4,99€.
            </p>
            <a
              href={PAYPAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setPaymentClicked(true)}
              style={{ display: 'block', background: '#0070ba', color: 'white', textDecoration: 'none', padding: '18px', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', marginBottom: '10px' }}
            >
              💳 Payer 4,99€ avec PayPal
            </a>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '16px' }}>
              Carte bancaire acceptée : pas besoin d'avoir un compte PayPal, choisis simplement "Payer avec une carte" sur la page suivante.
            </p>

            {paymentClicked ? (
              <>
                <button onClick={confirmPayment} style={{ background: 'transparent', border: '2px solid #10b981', color: '#10b981', width: '100%', padding: '16px', borderRadius: '50px', fontWeight: '900', fontSize: '1rem', cursor: 'pointer' }}>
                  ✅ J'ai payé, débloquer mon accès
                </button>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '18px' }}>Reviens sur cette page une fois ton paiement PayPal terminé, puis confirme ici.</p>
              </>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>Le bouton de confirmation apparaîtra ici juste après ton paiement.</p>
            )}
          </div>
        </div>
      );
    }

    // --- ÉCRAN 2 : DASHBOARD / PARCOURS (façon Duolingo) ---
    if (workoutMode === 'dashboard') {
      const seasonDays = viewSeason === 1
        ? Array.from({ length: 30 }, (_, i) => i + 1)
        : Array.from({ length: 30 }, (_, i) => i + 31);

      return (
        <div style={{ ...screenWrapperStyle, background: 'linear-gradient(180deg, #1a1440 0%, #0d0a24 60%, #050811 100%)', justifyContent: 'flex-start', padding: '20px 16px 100px 16px' }}>

          {/* Barre du haut : profil, pièces, boutique, quitter */}
          <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => { setProfileForm({ ...profileForm, displayName: profile?.displayName || '', avatar: profile?.avatar || '🙂' }); setWorkoutMode('profile'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '6px 14px', color: 'white', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.4rem' }}>{profile?.avatar || '🙂'}</span>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{profile?.displayName || 'Profil'}</span>
            </button>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setWorkoutMode('shop')} style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: '50px', padding: '6px 14px', color: '#ffd700', fontWeight: '900', cursor: 'pointer' }}>
                🪙 {coins}
              </button>
              <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ef4444', padding: '6px 14px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Quitter</button>
            </div>
          </div>

          {/* Sélecteur de saison */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <button onClick={() => setViewSeason(1)} style={{ padding: '10px 22px', borderRadius: '50px', border: viewSeason === 1 ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)', background: viewSeason === 1 ? 'rgba(59,130,246,0.15)' : 'transparent', color: 'white', fontWeight: '900', cursor: 'pointer' }}>Saison 1 (1-30)</button>
            <button onClick={() => setViewSeason(2)} style={{ padding: '10px 22px', borderRadius: '50px', border: viewSeason === 2 ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.15)', background: viewSeason === 2 ? 'rgba(168,85,247,0.15)' : 'transparent', color: 'white', fontWeight: '900', cursor: 'pointer' }}>Saison 2 (31-60)</button>
          </div>

          {/* Le parcours en zigzag */}
          <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
            {seasonDays.map((day, i) => {
              const status = day < currentDay ? 'done' : day === currentDay ? 'current' : 'locked';
              const offsetX = Math.round(Math.sin(i * 0.9) * 70);
              const isBadgeDay = BADGE_DAYS.includes(day);
              return (
                <div key={day} style={{ transform: `translateX(${offsetX}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => openDayModal(day)}
                    disabled={status === 'locked'}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: status === 'done' ? '#10b981' : status === 'current' ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                      border: status === 'current' ? '4px solid #93c5fd' : '3px solid rgba(255,255,255,0.15)',
                      color: 'white', fontWeight: '900', fontSize: '1.2rem',
                      cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                      opacity: status === 'locked' ? 0.4 : 1,
                      boxShadow: status === 'current' ? '0 0 25px rgba(59,130,246,0.6)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {status === 'done' ? '✓' : status === 'locked' ? '🔒' : day}
                  </button>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', fontWeight: 'bold' }}>
                    JOUR {day}{isBadgeDay ? ' 🏅' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Popup checkpoint : faire la séance ou voir le menu */}
          {dayModal !== null && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setDayModal(null)}>
              <div onClick={(e) => e.stopPropagation()} style={{ background: '#151328', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '30px', width: '85%', maxWidth: '360px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '20px' }}>Jour {dayModal}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <button onClick={() => launchDayWorkout(dayModal)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '16px', borderRadius: '50px', fontWeight: '900', cursor: 'pointer' }}>🏋️ Faire la séance</button>
                  <button onClick={() => launchDayMenu(dayModal)} style={{ background: 'transparent', color: '#10b981', border: '2px solid #10b981', padding: '14px', borderRadius: '50px', fontWeight: '900', cursor: 'pointer' }}>🍽️ Voir le menu</button>
                  <button onClick={() => setDayModal(null)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', padding: '8px', cursor: 'pointer' }}>Fermer</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // --- NOUVEAU : ÉCRAN BOUTIQUE (acheter des personnages avec les pièces) ---
    if (workoutMode === 'shop') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '600px', width: '100%', paddingBottom: '40px' }}>
            <button onClick={() => setWorkoutMode('dashboard')} style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '50px', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold' }}>← Retour</button>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '6px' }}>🪙 Boutique</h2>
            <p style={{ color: '#94a3b8', marginBottom: '25px' }}>Tu as <strong style={{ color: '#ffd700' }}>{coins} pièces</strong>. Gagne-en plus en finissant tes séances !</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {CHARACTERS.map((c) => {
                const owned = ownedCharacters.includes(c.id);
                const equipped = equippedCharacter === c.id;
                return (
                  <div key={c.id} className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{c.icon}</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{c.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px' }}>{owned ? 'Possédé' : `${c.cost} 🪙`}</div>
                    <button onClick={() => buyCharacter(c)} style={{ width: '100%', padding: '10px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '900', background: equipped ? '#10b981' : owned ? 'rgba(255,255,255,0.1)' : '#3b82f6', color: 'white' }}>
                      {equipped ? '✓ Équipé' : owned ? 'Équiper' : 'Acheter'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // --- NOUVEAU : ÉCRAN MODIFIER LE PROFIL (nom + avatar) ---
    if (workoutMode === 'profile') {
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <button onClick={() => setWorkoutMode('dashboard')} style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '50px', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold' }}>← Retour</button>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '20px' }}>Mon profil</h2>
            <form onSubmit={handleProfileEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Prénom / pseudo</label>
              <input type="text" value={profileForm.displayName} onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })} style={{ padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '1rem', outline: 'none' }} />

              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Avatar</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {AVATAR_OPTIONS.map((a) => (
                  <button type="button" key={a} onClick={() => setProfileForm({ ...profileForm, avatar: a })} style={{ fontSize: '1.6rem', padding: '8px 12px', borderRadius: '12px', border: profileForm.avatar === a ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', cursor: 'pointer' }}>{a}</button>
                ))}
              </div>

              <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '18px', borderRadius: '50px', fontWeight: '900', fontSize: '1.05rem', cursor: 'pointer', textTransform: 'uppercase', marginTop: '10px' }}>Enregistrer</button>
            </form>
          </div>
        </div>
      );
    }

    // --- ÉCRAN 3 : NUTRITION CORRIGÉ (Bouton retour opérationnel) ---
    if (workoutMode === 'nutrition') {
      const diet = getDayNutrition(activeDay, profile);
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '600px', width: '100%', paddingBottom: '40px' }}>
            {/* CORRECTION NAVIGATION : Retour propre au Dashboard */}
            <button onClick={() => setWorkoutMode('dashboard')} style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '50px', marginBottom: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s' }}>
              ← Retour au Dashboard
            </button>

            <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', fontWeight: '900' }}>MENU DU JOUR {activeDay}</h2>

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
            <span style={{ fontSize: '1rem', color: '#ff9f43', fontWeight: 'bold', letterSpacing: '3px' }}>PRÉPARATION ({currentExerciseIndex + 1}/{program.length})</span>
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
            <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: '900', letterSpacing: '4px' }}>🔥 ACTION ! ({currentExerciseIndex + 1}/{program.length})</span>
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
      const sessionCalories = estimateSessionCalories(activeDay);
      const earnedCoins = Math.max(1, Math.round(sessionCalories / 10));
      return (
        <div style={screenWrapperStyle}>
          <div style={{ maxWidth: '550px', width: '100%' }}>
            <span style={{ fontSize: '4.5rem' }}>👑</span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', margin: '15px 0' }}>Séance Terminée !</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '10px' }}>Tu te rapproches de tes objectifs.</p>
            <p style={{ color: '#ffd700', fontSize: '1.1rem', fontWeight: '900', marginBottom: '35px' }}>+{sessionCalories} kcal · +{earnedCoins} 🪙</p>
            <button onClick={confirmDayAndClose} style={{ background: '#ffffff', color: '#050811', border: 'none', width: '100%', padding: '22px', borderRadius: '100px', fontWeight: '900', fontSize: '1.25rem', cursor: 'pointer', textTransform: 'uppercase' }}>🏆 Valider ma journée</button>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default App;

