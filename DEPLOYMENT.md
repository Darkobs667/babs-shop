# Déploiement Vercel (plan payant)

1. Connecter le dépôt Git à Vercel et conserver `Next.js` comme framework détecté.
2. Dans **Settings → Functions**, vérifier la région `cle1` : elle est proche de la base Neon en Ohio.
3. Dans **Settings → Environment Variables**, créer ces variables pour **Production**, **Preview** et **Development** :

   - `DATABASE_URL` : URL Neon **pooler**.
   - `AUTH_SECRET` : clé aléatoire longue.
   - `ADMIN_EMAIL` et `ADMIN_PASSWORD_HASH`.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` : format Sénégal, par exemple `221771234567`.
   - `UPLOADTHING_TOKEN`.

4. Dans **Settings → Domains**, ajouter le domaine de production et effectuer la configuration DNS proposée par Vercel.
5. Dans **Settings → Deployment Protection**, protéger les déploiements Preview ; ne pas protéger Production afin de ne pas bloquer les clients ni les webhooks Uploadthing.
6. Déployer d'abord une Preview, tester la connexion admin, l'upload, le panier et WhatsApp, puis lancer `vercel deploy --prod`.

Les secrets restent dans Vercel ; `.env.local` ne doit jamais être envoyé dans Git.
