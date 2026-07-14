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
