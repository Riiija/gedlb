# SoftDocs — GED & Processus Financiers

Application de Gestion Électronique de Documents (GED) avec circuits de validation, OCR, paiements XML et tableaux de bord.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Développement local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Production

```bash
npm run build
npm run start
```

## ☁️ Déploiement sur Vercel

### Option 1 — Via GitHub (recommandé)

1. Poussez ce dossier sur GitHub
2. Connectez-vous sur [vercel.com](https://vercel.com)
3. Cliquez "New Project" → importez votre repo
4. Vercel détecte automatiquement Next.js
5. Cliquez "Deploy" ✅

### Option 2 — Via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 3 — Drag & Drop sur v0.dev

1. Copiez le contenu de `pages/index.js`
2. Allez sur [v0.dev](https://v0.dev)
3. Collez dans le prompt ou utilisez l'éditeur

## 📁 Structure du projet

```
softdocs/
├── pages/
│   ├── _app.js          # App wrapper avec CSS global
│   └── index.js         # Application principale
├── components/
│   ├── data.js          # Données, tokens de design, helpers
│   └── ui.js            # Composants UI réutilisables
├── styles/
│   └── globals.css      # CSS global + Tailwind + Google Fonts
├── next.config.js
├── tailwind.config.js
├── package.json
└── vercel.json
```

## 🎨 Thème

- Couleur principale : `#324372`
- Couleur secondaire : `#ADA660`
- Police : DM Sans + JetBrains Mono

## ✨ Fonctionnalités

- 📊 Tableau de bord avec KPIs et graphiques
- 📄 Dépôt de documents avec OCR simulé
- 🔀 Circuits de validation configurables
- 💳 Gestion des liquidations
- 🏦 Génération de fichiers XML de paiement (SEPA / SWIFT)
- 👥 Gestion des utilisateurs et droits
- 🔍 Suivi de l'évolution des documents
- 🔒 Circuit confidentiel
