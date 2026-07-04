# AI CONTEXT - SOFTSIGN REFONTE

## Mission

Tu travailles sur la refonte complète du module SoftSign du projet gedlb.

L'application actuelle est une maquette fonctionnelle. Elle sert à comprendre les écrans, les workflows et les règles métier, mais elle ne doit pas être utilisée comme socle technique.

## Cible obligatoire

- Backend : C#/.NET 8 LTS, ASP.NET Core Web API, Clean Architecture.
- Frontend : Angular 17+ minimum, NX, Micro Frontend, Module Federation, standalone components, signals, RxJS.
- Données : SQL Server, schéma `softsign`, FILESTREAM pour les PDF/fichiers, Full-Text Search sur métadonnées et texte OCR.
- Python : autorisé uniquement pour OCR, traitement PDF, signature électronique, certificat et opérations spécialisées.
- Qualité : Clean Code, SOLID, design patterns, tests et barème bonus/pénalité.

## Ordre de réalisation

1. Préparation environnement et outillage.
2. Solution .NET Clean Architecture.
3. Workspace Angular NX/MFE.
4. SQL Server FILESTREAM, Full-Text Search et schéma de données.
5. Entités domaine, Value Objects, Domain Services, repositories et UnitOfWork.
6. Services Python OCR/PDF/signature.
7. API stockage, upload, recherche et sécurité.
8. MFE Angular, composants transverses, viewer PDF et signature pad.
9. Parcours métier : dépôt, workflow, validation, signature interne/externe, certificats.
10. Administration, rapports, performance, sécurité et livraison.

## Interdits

- Pas de MediatR.
- Pas de framework CQRS.
- Pas de framework payant.
- Pas de logique métier dans controller, composant Angular ou infrastructure.
- Pas de `SaveChangesAsync` dans repository.
- Pas de `any` Angular sans justification.
- Pas de chargement complet client pour tables ou PDF volumineux.
- Pas de secret, OTP, token brut ou base64 document dans les logs.

## Fichiers de référence

- `08_Plan_Sprints_Refonte_SoftSign_CSharp_Angular_Python.docx`
- `SPRINT_REFONTE_SOFTSIGN.md`
- `AI_CONTEXT_TICKETS_REFONTE_SOFTSIGN.md`

Les anciens documents de reverse engineering restent utiles comme source métier de la maquette, mais ne pilotent plus l'ordre de développement.
