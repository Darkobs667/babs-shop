# Babs Shop

Catalogue e-commerce responsive construit avec Next.js. Les clients parcourent les produits, composent leur panier et finalisent leur demande sur WhatsApp. L'administration permet de gerer le catalogue, les images, le stock, les commandes et les statistiques essentielles.

## Fonctionnalites

### Boutique

- Accueil avec categories et produits a la une.
- Catalogue avec recherche et filtres par categorie et fourchette de prix.
- Fiche produit avec galerie d'images a defilement horizontal, variantes et disponibilite.
- Panier persistant dans le navigateur avec Zustand/LocalStorage.
- Commande via WhatsApp : la commande est d'abord creee avec le statut `PENDING_WHATSAPP`, puis le client est redirige vers WhatsApp.
- Prix et disponibilite verifies cote serveur depuis PostgreSQL avant chaque commande. Le panier navigateur n'est pas une source de verite.

### Administration

- Connexion admin par e-mail, mot de passe bcrypt et cookie JWT HTTP-only.
- Protection de toutes les routes `/admin/*` par `proxy.ts`.
- CRUD produits : categorie, publication, mise en avant, stock general, variantes et images Uploadthing.
- Apercu local des images avant l'envoi ; l'upload se produit a l'enregistrement du produit.
- Gestion des commandes : filtres, coordonnees client, lignes de commande, lien WhatsApp et changement de statut.
- Tableau de bord et statistiques : commandes, ventes confirmees et vues quotidiennes.

## Stack technique

| Domaine | Choix |
| --- | --- |
| Framework | Next.js 16, App Router, React Server Components, Server Actions |
| Interface | Tailwind CSS, Lucide Icons |
| Base de donnees | PostgreSQL Neon via URL **pooler** |
| ORM | Drizzle ORM + drizzle-kit |
| Validation | Zod |
| Auth admin | JWT (`jose`) + bcryptjs |
| Images | Uploadthing v7 |
| Etat panier | Zustand + LocalStorage |
| Analytics | Vercel Web Analytics + agregat quotidien interne |
| Hebergement | Vercel |

## Architecture

```text
app/
  (store)/                 # Pages publiques : catalogue, produit, panier
  actions/order.ts         # Creation securisee d'une commande WhatsApp
  admin/                   # Tableau de bord, produits, commandes, analytics
  api/uploadthing/         # Route Uploadthing protegee par session admin
  api/visit/               # Compteur anonyme de pages vues
  layout.tsx               # Analytics Vercel et tracker de visite
components/
  admin/                   # Navigation, formulaires produit, upload
  store/                   # Panier, galerie, filtres, navigation
lib/
  auth.ts                  # Session JWT admin
  db/                      # Client Drizzle et schema PostgreSQL
  rate-limit.ts            # Limitation best-effort par instance
  store-data.ts            # Cache public catalogue/produits
  validations.ts           # Schemas Zod
  whatsapp.ts              # Construction du lien wa.me
stores/
  cart-store.ts            # Panier persistant
drizzle/                   # Migrations SQL generees
proxy.ts                   # Protection des routes admin (Next.js 16)
```

## Installation locale

### Prerequis

- Node.js 20.9 a 24.x
- Un projet Neon PostgreSQL ou Supabase PostgreSQL
- Un compte Uploadthing

```bash
npm install
copy .env.example .env.local
```

Complete ensuite `.env.local` puis lance :

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

Application locale : `http://localhost:3000`.

## Variables d'environnement

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | URL **pooler** Neon/Supabase avec SSL. Ne jamais utiliser la connexion directe. |
| `AUTH_SECRET` | Chaine aleatoire longue (32 caracteres minimum) pour signer les sessions. |
| `ADMIN_EMAIL` | E-mail de connexion de l'administrateur. |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe admin. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numero WhatsApp Senegal sans `+`, par exemple `221771234567`. |
| `UPLOADTHING_TOKEN` | Token de l'application Uploadthing. |

### Mot de passe administrateur

Genere un hash :

```bash
npm run admin:hash
```

Teste-le si necessaire :

```bash
npm run admin:verify
```

Dans `.env.local`, les signes `$` du hash bcrypt doivent etre echappes avec `\` :

```env
ADMIN_PASSWORD_HASH=\$2b\$12\$...
```

Dans le dashboard Vercel, colle au contraire le hash brut, sans backslash, guillemets ni prefixe `ADMIN_PASSWORD_HASH=` :

```text
$2b$12$...
```

Ne commite jamais `.env.local`, les identifiants Neon ou les tokens Uploadthing.

## Base de donnees et migrations

Le schema se trouve dans `lib/db/schema.ts`. Les migrations sont dans `drizzle/`.

```bash
npm run db:generate  # genere une migration apres une modification du schema
npm run db:migrate   # applique les migrations a DATABASE_URL
```

Applique les migrations explicitement depuis une machine ayant la bonne `DATABASE_URL`. Ne lance pas les migrations automatiquement pendant le build Vercel.

## Cache et performances

Les donnees publiques sont mises en cache dans le Data Cache Next.js/Vercel pendant une heure :

- accueil : produits a la une et categories ;
- catalogue : produits publies, images et categories ;
- fiche produit : une entree par slug.

Les recherches et filtres du catalogue sont realises en memoire a partir du catalogue deja cache. Cela evite une requete PostgreSQL pour chaque recherche ou visite.

Lorsqu'un admin cree, modifie ou supprime un produit, `revalidateTag("store-catalog", "max")` invalide le cache public. Les pages admin, les commandes, les stocks, le panier et les analytics restent dynamiques.

## Commandes et stock

1. Le client clique sur `Commander via WhatsApp`.
2. Le serveur relit les produits/variantes publies dans Neon.
3. Le client renseigne obligatoirement son nom, son numero WhatsApp et son adresse de livraison.
4. Le serveur recalcule le total, valide le stock et cree la commande `PENDING_WHATSAPP`.
5. Le client est redirige vers WhatsApp avec un message structure.
6. L'admin ouvre `/admin/orders`, consulte les articles, total, nom, telephone, adresse et date, contacte le client puis passe la commande a `CONFIRMED`, `FULFILLED` ou `CANCELLED`.

Le changement de statut ne decompte pas automatiquement le stock : le paiement et la livraison sont confirmes manuellement sur WhatsApp. Si une reservation/decrement automatique est souhaitee, elle doit etre ajoutee avec des references produit/variante dans les lignes de commande.

## Suivi des visiteurs

`VisitTracker` appelle `/api/visit` sur chaque navigation publique. La route incremente seulement :

```text
date -> nombre de pages vues
```

Elle ne stocke pas d'adresse IP, cookie, compte client ou profil visiteur. Ce n'est donc pas un compteur de visiteurs uniques. Vercel Web Analytics ajoute des mesures anonymes de pages vues, referents et appareils dans le dashboard Vercel.

## Securite

- Session admin JWT signee, expiree au bout de 7 jours et stockee dans un cookie HTTP-only.
- `proxy.ts` verifie cette session avant toute route admin, hors `/admin/login`.
- Uploadthing verifie egalement la session admin avant d'autoriser un upload.
- Server Actions et routes valident les donnees avec Zod.
- Les prix et stocks sont verifies uniquement cote serveur lors d'une commande.
- Limitation best-effort des tentatives de connexion, commandes et appels de suivi.

Le rate limit actuel est en memoire par instance Vercel. Pour un trafic eleve ou une protection distribuee, utiliser Vercel WAF et/ou Upstash Redis.

## Deploiement Vercel

1. Pousse le projet sur GitHub.
2. Importe le depot dans Vercel avec le framework Next.js detecte.
3. Dans **Settings > Environment Variables**, ajoute toutes les variables listees ci-dessus pour `Production`, et si besoin `Preview`.
4. Dans Neon, copie l'URL **Pooled connection**. Colle uniquement l'URL dans Vercel, sans `DATABASE_URL=`, sans guillemets, sans espaces ni retour a la ligne.
5. Applique les migrations sur la base de production : `npm run db:migrate`.
6. Deploie une Preview et teste login, upload, produit, panier et WhatsApp.
7. Associe le domaine dans **Settings > Domains**, puis deploie la branche de production.

Le build Vercel peut etre execute a `iad1`; cela ne correspond pas obligatoirement a la region d'execution des fonctions. La region est configuree dans `vercel.json`.

## Limites et montee en charge

- Vercel Hobby est pratique pour developper et tester, mais est reserve a un usage personnel/non commercial. Utiliser Vercel Pro pour une boutique publique reelle.
- Uploadthing gratuit inclut actuellement 2 GB de stockage partage entre les applications et des uploads/downloads illimites. Compresser les photos en WebP, 1200-1600 px, idealement sous 500 Ko.
- Le code limite chaque image a 4 MB et chaque produit a 8 images.
- Surveiller Vercel Usage, Neon Usage et Uploadthing Storage apres le lancement.

## Scripts utiles

```bash
npm run dev            # developpement local
npm run build          # build de production
npm run start          # lancer le build de production localement
npm run db:generate    # generer une migration Drizzle
npm run db:migrate     # appliquer les migrations
npm run admin:hash     # creer un hash bcrypt admin
npm run admin:verify   # verifier un mot de passe contre le hash courant
```

## Checklist avant ouverture

- [ ] `.env.local` n'est pas versionne.
- [ ] Toutes les variables sont definies dans Vercel Production.
- [ ] `DATABASE_URL` est bien l'URL pooler Neon.
- [ ] Les migrations sont appliquees.
- [ ] Le hash admin est brut dans Vercel et echappe seulement dans `.env.local`.
- [ ] Le numero WhatsApp Senegal est au format `221XXXXXXXXX`.
- [ ] Un test complet commande -> WhatsApp -> changement de statut admin a ete realise.
- [ ] Les images produits sont optimisees et Uploadthing est surveille.
