// ================= VERIFICATION ESSAI GRATUIT =================

const hasAccess = () => {

  if(subscriptionActive)
    return true;


  if(!trialStartDate)
    return false;


  const now = new Date();

  const difference =
    now - new Date(trialStartDate);


  const days =
    difference / (1000 * 60 * 60 * 24);


  return days < 7;

};// ================= PROFIL UTILISATEUR =================

const [userProfile, setUserProfile] = useState(() => {
  const saved = localStorage.getItem('defi_profile');
  return saved ? JSON.parse(saved) : null;
});

const [age, setAge] = useState('');
const [weight, setWeight] = useState('');
const [height, setHeight] = useState('');

const [imc, setImc] = useState(null);

const [subscriptionActive, setSubscriptionActive] = useState(() => {
  return localStorage.getItem('defi_subscription') === 'active';
});

const [trialStartDate, setTrialStartDate] = useState(() => {
  const saved = localStorage.getItem('defi_trial_start');
  return saved ? new Date(saved) : null;
});// ================= CALCUL IMC =================

const calculateIMC = () => {

  const tailleMetre = Number(height) / 100;
  const poids = Number(weight);

  if (!tailleMetre || !poids) return;

  const result = (poids / (tailleMetre * tailleMetre)).toFixed(1);

  setImc(result);

  return result;
};


// ================= CREATION PROFIL =================

const saveProfile = () => {

  const calculatedIMC = calculateIMC();

  const profile = {
    age: Number(age),
    weight: Number(weight),
    height: Number(height),
    imc: Number(calculatedIMC)
  };


  localStorage.setItem(
    'defi_profile',
    JSON.stringify(profile)
  );


  setUserProfile(profile);


  if(!trialStartDate){

    const today = new Date();

    localStorage.setItem(
      'defi_trial_start',
      today.toISOString()
    );

    setTrialStartDate(today);
  }

};const PAYPAL_LINK =
"https://paypal.me/TONCOMPTE";


const activateSubscription = () => {

  window.location.href = PAYPAL_LINK;

};// ================= ECRAN PROFIL PREMIERE UTILISATION =================

if(email && !userProfile){

return (

<div style={screenWrapperStyle}>

<div style={{maxWidth:"500px",width:"100%"}}>

<h1 style={{
fontSize:"3rem",
fontWeight:"900"
}}>
Ton Profil
</h1>


<p style={{
color:"#94a3b8"
}}>
Ces informations permettent d'adapter ton programme.
</p>


<input
placeholder="Âge"
type="number"
value={age}
onChange={(e)=>setAge(e.target.value)}
style={inputStyle}
/>


<input
placeholder="Poids (kg)"
type="number"
value={weight}
onChange={(e)=>setWeight(e.target.value)}
style={inputStyle}
/>


<input
placeholder="Taille (cm)"
type="number"
value={height}
onChange={(e)=>setHeight(e.target.value)}
style={inputStyle}
/>



<button
onClick={saveProfile}
style={{
background:"#3b82f6",
color:"white",
border:"none",
padding:"20px",
borderRadius:"50px",
width:"100%",
fontWeight:"900",
marginTop:"20px"
}}
>
Créer mon programme
</button>


</div>

</div>

);

}const inputStyle = {

padding:"18px",
margin:"10px 0",
borderRadius:"50px",
border:"1px solid rgba(255,255,255,0.15)",
background:"rgba(255,255,255,0.06)",
color:"white",
fontSize:"1rem",
textAlign:"center",
width:"100%",
boxSizing:"border-box"

};
