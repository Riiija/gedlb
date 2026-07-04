# DEVELOPMENT GUIDE - SOFTSIGN REFONTE

## 1. Principe

SoftSign est à reconstruire comme application industrielle. La maquette actuelle sert uniquement à identifier les besoins métier et les écrans attendus.

La priorité de développement est :

1. environnement ;
2. Clean Architecture .NET ;
3. SQL Server FILESTREAM/Full-Text Search ;
4. entités et règles domaine ;
5. Angular NX/MFE ;
6. OCR/PDF/signature ;
7. fonctionnalités métier.

## 2. Backend

Structure cible :

```text
SoftSign.Api
SoftSign.Application
SoftSign.Domain
SoftSign.Infrastructure
SoftSign.Persistence
SoftSign.SharedKernel
SoftSign.Tests
```

Règles :

- Controllers fins.
- Application Services pour cas d'usage.
- Domain Services pour règles métier.
- Repository Pattern + UnitOfWork.
- FluentValidation pour entrées.
- ProblemDetails RFC 7807 pour erreurs.
- Serilog et OpenTelemetry.
- Aucun MediatR, aucun framework CQRS.

## 3. SQL Server

- Schéma `softsign`.
- FILESTREAM pour fichiers PDF et annexes volumineuses.
- Table `DocumentSearchTexts` pour texte OCR et contenu indexable.
- Full-Text Search sur référence, titre, métadonnées et texte OCR.
- RowVersion, audit columns, index filtrés par statut actif.
- Requêtes de liste en projection DTO paginée.
- Streaming fichier, jamais chargement mémoire complet inutile.

## 4. Angular NX/MFE

Structure :

```text
apps/shell
apps/softsign-mfe
libs/softsign-models
libs/softsign-data-access
libs/softsign-domain
libs/softsign-ui
libs/softsign-feature-*
```

Règles :

- Standalone components.
- Signals pour état UI local.
- RxJS pour appels API et effets asynchrones.
- OnPush.
- Facades/data-access typés.
- Guards permission.
- Pas de `any` non justifié.
- Tables serveur pour données volumineuses.

## 5. OCR, PDF et signature

- PDF.js côté Angular pour preview.
- signature_pad pour dessin et aperçu temps réel.
- Python FastAPI worker pour OCR et signature PDF.
- Tesseract/OCRmyPDF pour PDF scannés.
- pypdf/PyMuPDF pour PDF natifs.
- pyHanko pour signature PDF visible/PAdES.
- Certificat avec hash, preuve, IP, user-agent, date OTP, date signature.

## 6. Qualité

Appliquer le barème `suivi_bonus_penalite (3).xlsx`.

Definition of Done :

- ticket de 0,5 j ou 1 j maximum ;
- tests adaptés ;
- migration SQL relue si données ;
- logs sans secret ;
- capture ou preuve de démo ;
- PR avec ticket et description complète.
