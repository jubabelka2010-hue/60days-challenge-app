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
