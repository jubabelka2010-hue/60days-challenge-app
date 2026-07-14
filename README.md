# 60 Days Challenge — Guide de lancement

Ce dossier est un vrai projet web (Vite + React) prêt à être déployé comme
**PWA installable** (icône sur l'écran d'accueil, plein écran, fonctionne
hors-ligne pour la coquille de l'app).

## 1. Lancer en local

```bash
npm install
npm run dev
```

Ouvre l'adresse affichée (ex. http://localhost:5173) — sur ton téléphone,
connecte-le au même Wi-Fi et utilise l'adresse réseau locale affichée par Vite.

## 2. Mettre en ligne gratuitement (Vercel, ~10 min)

1. Crée un compte sur vercel.com (gratuit) et sur github.com si tu n'en as pas.
2. Mets ce dossier dans un dépôt GitHub (`git init`, `git add .`, `git commit -m "v1"`, push).
3. Sur Vercel : "Add New Project" → importe le dépôt → Framework = Vite → Deploy.
4. Tu obtiens une URL du type `https://60days-challenge.vercel.app`.
5. Sur mobile, ouvre l'URL dans Safari/Chrome → menu → **"Ajouter à l'écran d'accueil"** :
   l'app s'installe comme une vraie application, en plein écran, avec son icône.

Alternative équivalente : Netlify (netlify.com), même principe par glisser-déposer du dossier `dist` après `npm run build`.

**Nom de domaine perso** (ex. 60dayschallenge.fr) : environ 10 €/an chez un
registrar (OVH, Gandi...), à connecter dans les réglages Vercel/Netlify.

## 3. Ce qui manque encore avant d'encaisser du vrai argent

L'app actuelle garde toutes les données **en mémoire du navigateur** :
si l'utilisateur ferme l'onglet, tout est perdu, et rien ne prouve côté
serveur qu'un paiement a bien eu lieu avant de débloquer le contenu.
Pour une vraie mise en ligne, il faut ajouter :

### a) Comptes utilisateurs + sauvegarde
Le plus simple et gratuit pour démarrer : **Supabase** (supabase.com) —
authentification par email + base de données Postgres, offre gratuite large.
Alternative : Firebase (Google).

### b) Vérification serveur du paiement PayPal
Actuellement, l'utilisateur clique "j'ai payé" lui-même — rien n'empêche
quelqu'un de débloquer sans payer. Il faut un petit serveur qui écoute les
notifications PayPal (IPN) ou utilise les PayPal Smart Buttons + vérification
côté serveur, puis marque le compte comme "premium" en base de données.
Exemple avec une fonction serverless (Supabase Edge Function / Vercel
Function) :

```js
// api/paypal-webhook.js (exemple simplifié, à sécuriser avant production)
export default async function handler(req, res) {
  const params = new URLSearchParams(req.body);
  params.append("cmd", "_notify-validate");

  const verify = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    body: params,
  });
  const text = await verify.text();

  if (text === "VERIFIED" && req.body.payment_status === "Completed") {
    const email = req.body.payer_email;
    // TODO: retrouver l'utilisateur par email et le passer en "premium" en base
  }
  res.status(200).send("OK");
}
```

Je peux t'aider à écrire cette partie en détail (avec Supabase) dès que tu es
prêt à t'y mettre — c'est la brique la plus technique du projet.

### c) Pages légales obligatoires (France/UE)
Avant d'accepter un paiement, il faut publier sur le site :
- **Mentions légales** (identité de l'éditeur du site)
- **CGV** (conditions générales de vente : prix, droit de rétractation,
  modalités de remboursement)
- **Politique de confidentialité** (RGPD) — important ici car l'app collecte
  des données sensibles au sens du RGPD (poids, mensurations, photos du corps)
- **Politique de cookies** si tu ajoutes des cookies/analytics

Je peux te préparer des modèles de ces pages à faire relire ensuite par un
adulte ou un professionnel avant publication.

### d) Un point important si tu es mineur
Encaisser de l'argent via une activité (même via PayPal personnel) peut avoir
des implications fiscales et juridiques en France. En dessous de 18 ans, tu ne
peux pas ouvrir de statut auto-entrepreneur seul, et il est recommandé qu'un
parent ou représentant légal soit informé et impliqué dans la partie
paiement/déclaration de revenus, pour que tout soit en règle. Ce n'est pas
bloquant pour construire et tester l'app, mais je te conseille d'en parler à
un parent avant d'ouvrir les paiements au public.

## 4. Ordre conseillé pour la suite

1. Déployer la version actuelle (statique) pour tester sur ton téléphone.
2. Ajouter Supabase (comptes + sauvegarde de la progression).
3. Sécuriser le paiement PayPal côté serveur.
4. Rédiger les pages légales.
5. Ouvrir au public.

Dis-moi par quelle étape tu veux commencer et on avance dessus ensemble.
