# STEERING SOFTSIGN - REFONTE

## Contexte

SoftSign est le module de validation et signature électronique du socle gedlb/SoftDocs. La version actuelle est une maquette fonctionnelle destinée à décrire les besoins métier, pas une base technique à faire évoluer.

## Objectif produit

Construire une application fiable, maintenable et performante permettant :

- dépôt de documents PDF et annexes ;
- OCR et recherche full-text ;
- workflows de validation configurables ;
- validation, rejet, paraphe et signature interne ;
- signature externe sécurisée par lien et OTP ;
- signature visible sur PDF ;
- certificats, preuves et audit ;
- administration des workflows, OTP, relances, permissions et modèles email ;
- rapports et exports sur données volumineuses.

## Décision d'architecture

- C#/.NET 8 LTS et ASP.NET Core Clean Architecture.
- Angular 17+ minimum avec NX, MFE et Module Federation.
- SQL Server avec FILESTREAM et Full-Text Search.
- Python FastAPI worker uniquement pour OCR, PDF et signature.
- Aucun framework payant, aucun MediatR, aucun framework CQRS.

## Bounded Context

`SoftSign` possède les documents à signer, workflows, étapes, zones de signature, demandes externes, OTP, relances, notifications, audits et certificats.

Hors périmètre :

- refonte authentification globale ;
- paiement/liquidation ;
- remplacement complet SoftDocs ;
- achat d'un service SaaS payant de signature.

## Priorité de delivery

1. Socle environnement et CI.
2. SQL Server FILESTREAM/FTS.
3. Domaine et Clean Architecture.
4. API stockage/recherche/sécurité.
5. Python OCR/signature.
6. Angular MFE et composants transverses.
7. Dépôt document.
8. Validation/signature interne.
9. Signature externe et certificat.
10. Administration, rapports, performance et sécurité.
