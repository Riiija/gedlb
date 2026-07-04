# SoftDocs V8 — Guide de démarrage

## Installation

```bash
npm install
npm run dev
```

Accès : http://localhost:3000

---

## Comptes de démonstration (Back-Office)

L'authentification se fait avec **l'adresse email** et le mot de passe.

| Nom | Rôle | Email | Mot de passe |
|-----|------|-------|-------------|
| Razafy Pierre | **DAF / Admin** | razafy@softdocs.mg | daf2025 |
| Randria Marie-Claire | Resp. Financier | randria@softdocs.mg | admin123 |
| Rakoto Jean-Baptiste | Chef de Projet | rakoto@softdocs.mg | chef2025 |
| Rasoamanarivo Hanta | Comptable Senior | hanta@softdocs.mg | compta2025 |
| Andriamananjara Lova | Ordonnateur | lova@softdocs.mg | ordo2025 |
| Ratsimbazafy Noro | Gestionnaire Docs | noro@softdocs.mg | gest2025 |

> **Conseil** : Utilisez le compte DAF (`razafy@softdocs.mg`) pour un accès complet.

---

## Portail Fournisseurs

Accès : http://localhost:3000/fournisseur

Aucune authentification requise pour le suivi.  
L'authentification fournisseur se fait avec NIF + STAT.

---

## Structure des menus Documents

| Menu | Contenu |
|------|---------|
| Reçus fournisseurs | Documents soumis via le portail fournisseurs |
| Service Courriers | Documents déposés en interne (back-office) |
| Documents Confidentiels | Tous documents avec case "Confidentiel" cochée |
| Reçu / En Cours / Envoyés… | Vues transversales par statut |
| Confidentiels en Cours / Refusés… | Sous-menus confidentiels |

---

## Système de droits

Accès : **Paramétrage → Droits & Rôles**

Chaque utilisateur peut avoir des permissions individuelles sur :
- Accès aux menus (dépôt, liquidation, rapports…)
- Consultation de chaque catégorie de documents
- Accès à chaque rapport (R1 à R11)
- Paramétrage et gestion des utilisateurs

**Profils prédéfinis disponibles :** DAF, Resp. Financier, Chef de Projet, Comptable, Gestionnaire Docs

---

## Technologies

- **Framework** : Next.js 14 (App Router)
- **UI** : React avec styles inline (pas de dépendances CSS)
- **Stockage** : localStorage (démo) — remplacer par API/DB en production
- **OCR** : Simulé pour la démo

