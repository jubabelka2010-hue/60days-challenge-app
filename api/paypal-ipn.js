// api/paypal-ipn.js
// Cette fonction reçoit la notification que PayPal envoie automatiquement après un paiement.
// Elle vérifie que la notification est authentique, puis marque le compte comme débloqué dans Supabase.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Méthode non autorisée');
  }

  try {
    // 1. Récupérer le corps brut envoyé par PayPal (format x-www-form-urlencoded)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString('utf8');

    // 2. Revalider ce message directement auprès de PayPal (obligatoire pour éviter les faux paiements)
    const verifyBody = 'cmd=_notify-validate&' + rawBody;
    const verifyResponse = await fetch('https://ipnpb.paypal.com/cgi-bin/webscr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verifyBody
    });
    const verifyText = await verifyResponse.text();

    if (verifyText.trim() !== 'VERIFIED') {
      console.log('IPN non vérifiée par PayPal :', verifyText);
      return res.status(400).send('Notification non vérifiée');
    }

    // 3. Extraire les infos utiles du paiement
    const params = new URLSearchParams(rawBody);
    const paymentStatus = params.get('payment_status');
    const payerEmail = (params.get('payer_email') || '').toLowerCase();
    const grossAmount = parseFloat(params.get('mc_gross') || '0');

    // On exige : paiement complété, montant d'au moins 4,99€, et un e-mail payeur valide
    if (paymentStatus !== 'Completed' || grossAmount < 4.99 || !payerEmail) {
      console.log('Paiement ignoré (statut, montant ou e-mail invalide) :', paymentStatus, grossAmount, payerEmail);
      return res.status(200).send('Ignoré');
    }

    // 4. Marquer ce compte comme débloqué dans Supabase (upsert = créer ou mettre à jour)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/unlocks`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ email: payerEmail, unlocked: true, updated_at: new Date().toISOString() })
    });

    if (!upsertResponse.ok) {
      const errText = await upsertResponse.text();
      console.log('Erreur Supabase :', errText);
      return res.status(500).send('Erreur base de données');
    }

    console.log('Compte débloqué avec succès :', payerEmail);
    return res.status(200).send('OK');
  } catch (err) {
    console.log('Erreur IPN :', err.message);
    return res.status(500).send('Erreur serveur');
  }
}

