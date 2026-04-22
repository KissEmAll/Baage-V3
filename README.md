# Baage V3 — Captain Baage · Runway + Claude

Stack : Runway (avatar + lip-sync + voix Morgan) + Claude Sonnet (cerveau)

## Variables d'environnement sur Vercel

| Variable | Où la trouver |
|---|---|
| `RUNWAYML_API_SECRET` | dev.runwayml.com → Settings → API Keys |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

## Déploiement

1. Nouveau repo GitHub `baage-v3`
2. Upload tous les fichiers
3. Vercel → New Project → import `baage-v3`
4. Ajouter les deux variables d'environnement
5. Deploy

## Mettre à jour le catalogue

Modifier `lib/prompt.js` section "OFFRES DU MOMENT"
pour mettre à jour les destinations et liens affiliés Kwanko.
