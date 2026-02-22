# SoftDocs v5 — GED & Processus Financiers

Système de gestion électronique de documents (GED) avec circuit de validation, OCR, paiements XML et gestion des droits par projet/site.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## 📦 Build & Déploiement Vercel

```bash
npm run build
```

Ou simplement déposer le projet sur Vercel (import GitHub).

## 🎨 Thème

- Couleur principale : `#324372` (navy)
- Style AdminLTE moderne
- Sidebar sombre, navbar blanche

## 🏗️ Structure du projet

```
src/
├── app/              # Next.js App Router
│   ├── layout.js     # Layout global + fonts
│   ├── page.js       # Page principale
│   └── globals.css   # Styles globaux
├── context/
│   └── AppContext.jsx # État global (React Context)
├── lib/
│   ├── theme.js      # Design tokens & helpers CSS-in-JS
│   ├── data.js       # Données initiales & DOC_MENUS
│   └── utils.js      # Utilitaires (fmtN, gid, ocrSim…)
└── components/
    ├── layout/
    │   ├── Sidebar.jsx   # Navigation latérale
    │   ├── Topbar.jsx    # Barre supérieure + fil d'Ariane
    │   └── AppShell.jsx  # Shell principal (routing)
    ├── ui/
    │   ├── Icons.jsx     # Bibliothèque SVG icons
    │   ├── Badge.jsx     # Badge statut + Avatar
    │   ├── Modal.jsx     # Modale réutilisable
    │   └── FormGroup.jsx # Groupe de formulaire
    ├── dashboard/
    │   └── Dashboard.jsx # Tableau de bord avec KPIs + Charts
    ├── documents/
    │   ├── OCRScanner.jsx # Scan + extraction OCR simulé
    │   ├── DepotDoc.jsx   # Wizard dépôt en 4 étapes
    │   ├── DocDetail.jsx  # Vue détail + circuit validation
    │   ├── DocList.jsx    # Liste filtrée de documents
    │   └── SuiviDoc.jsx   # Suivi par référence
    ├── users/
    │   └── GestionUsers.jsx # CRUD utilisateurs + droits
    ├── payments/
    │   ├── PaiementsXML.jsx # Génération XML bancaire
    │   └── Liquidations.jsx # Gestion liquidations
    └── params/
        ├── ParamTypes.jsx    # Types de documents + circuits
        └── ParamReceveurs.jsx # Configuration receveurs
```

## ✨ Fonctionnalités

- ✅ Gestion de sites par projet (6 villes Madagascar)
- ✅ Circuit de validation configurable multi-étapes
- ✅ OCR simulé avec score de confiance et correction
- ✅ Montant réel corrigeable après OCR
- ✅ Workflow "Bon à payer" → génération XML
- ✅ Paiements XML (SEPA/SWIFT) avec nature de remise configurable
- ✅ 7 droits configurables par utilisateur
- ✅ Autorisations projet + site granulaires
- ✅ Dashboard avec 7 KPIs + 4 graphiques Recharts
- ✅ Documents confidentiels isolés
- ✅ Liquidations et suivi de paiement
