# OCD — « Les Opportunités, C'est Dehors » · Frontend

Plateforme du mouvement de Bovann pour recevoir et suivre les candidatures de jeunes entrepreneurs africains.
Ce dépôt contient **uniquement le frontend** : les données sont des *mocks* typés et les services sont de fausses API
asynchrones (petits délais réseau simulés), prêtes à être remplacées par Supabase.

## Stack

- Vite 7 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens dans `@theme` → `src/index.css`)
- react-router v7 (import depuis `"react-router"`), une route = un chunk (`React.lazy`)
- framer-motion 12 (`LazyMotion` + composants `m`, features chargées à la demande)
- Polices Google : Syne (titres) + Manrope (texte), `display=swap`

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vérification TypeScript + build de production (dist/)
npm run typecheck  # TypeScript seul
npm run preview    # sert le build de production
```

## Identifiants de démo (mock)

| Rôle | Téléphone | Code OTP |
|------|-----------|----------|
| Candidat avec dossier existant | +229 97 12 45 88 | `123456` |
| Admin | +229 01 00 00 00 00 | `123456` |
| Nouveau candidat | n'importe quel numéro valide | `123456` |

Les données (candidatures, messages, notes, statuts déplacés dans le Kanban…) sont persistées dans le
`localStorage` du navigateur (clé `ocd.mockdb`). Pour repartir de zéro : vider le localStorage du site.

## Routes

| Route | Écran (maquette) |
|-------|------------------|
| `/` | 01 Landing desktop + 02 Landing mobile (responsive) |
| `/connexion` | 03a Connexion par téléphone (+229 par défaut) |
| `/connexion/code` | 03b Code OTP (SMS / WhatsApp) |
| `/candidature?etape=1\|2\|3` | 04a / 04b / 04c Formulaire en 3 étapes (connexion requise) |
| `/espace` | 05 Espace candidat (timeline de statut, notifications, messagerie) |
| `/espace/dossier`, `/espace/messages`, `/espace/profil` | Pages complémentaires de l'espace candidat |
| `/admin` | 06 Dashboard admin |
| `/admin/pipeline` | 07 Pipeline Kanban (glisser-déposer) |
| `/admin/candidatures` | Liste complète des candidatures |
| `/admin/projets/:id` | 08 Fiche projet admin |
| `/admin/candidats`, `/admin/messagerie`, `/admin/parametres` | « Bientôt disponible » |
| `*` | 404 |

## Structure

```
src/
  app/          router, layouts (public, auth, candidat, admin), providers (auth, toasts), transitions
  pages/        une page par route (chargée en lazy)
  components/
    ui/         primitives : Button, Card, Badge, Field, Eyebrow, Logo, StatusTimeline, OtpInput, PhoneInput…
    landing/ candidature/ espace/ admin/ kanban/   composants par domaine
  data/         données mock typées (candidatures, messages, stats, contenus de la landing)
  services/     fausse API asynchrone typée (auth, candidatures, messagerie, stats)
  hooks/ lib/   utilitaires (useAsync, countdown, formatage, variantes d'animation)
  types/        types métier partagés
```

## Brancher Supabase plus tard

Toute l'UI passe par `src/services/*` (jamais directement par `src/data`). Pour passer en réel :

1. `npm install @supabase/supabase-js`, créer `src/services/supabase.ts` (client avec `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).
2. Remplacer le corps des fonctions de chaque service en gardant les **mêmes signatures** :
   - `auth.service.ts` → `supabase.auth.signInWithOtp({ phone })` / `verifyOtp({ phone, token, type: 'sms' })`, rôle admin via une table `profiles`.
   - `applications.service.ts` → table `applications` (+ `application_events`, `notes`), Storage pour les médias.
   - `messaging.service.ts` → table `messages` (+ Realtime pour le chat).
   - `stats.service.ts` → vues SQL / RPC.
3. Supprimer `src/services/db.ts` (base mock `localStorage`) et `src/data/*` quand tout est branché.

Les commentaires `TODO Supabase` dans les services indiquent les points d'intégration.
⚠️ Les routes `/admin/*` ne sont pas protégées côté frontend dans cette version mock : à sécuriser avec les rôles Supabase (RLS + garde de route).

## Accessibilité & performance

- Landmarks sémantiques, lien « Aller au contenu », labels sur tous les champs, focus visibles, textes alternatifs.
- `prefers-reduced-motion` respecté (`MotionConfig reducedMotion="user"` + `useReducedMotion`).
- Code splitting par route, framer-motion chargé en différé, images en `loading="lazy"`.
