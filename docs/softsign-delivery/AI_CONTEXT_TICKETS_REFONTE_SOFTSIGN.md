# Contextes IA tickets refonte SoftSign

Utiliser ce fichier pour copier-coller un contexte complet par ticket dans une IA de génération de code.

## S00 - Préparation refonte et environnement de développement

### SS-R00-001 - Acter la refonte depuis maquette et figer le périmètre V1

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-001 - Acter la refonte depuis maquette et figer le périmètre V1
        Charge maximale : 0,5 j
        Responsable principal : PO/BA
        Livrable attendu : Note de cadrage refonte validée
        Contexte métier/technique : Clarifier que l'application actuelle est une maquette fonctionnelle, pas un socle technique.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-002 - Préparer le poste dev .NET, Node, Angular CLI, Python, SQL Server, Tesseract

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-002 - Préparer le poste dev .NET, Node, Angular CLI, Python, SQL Server, Tesseract
        Charge maximale : 1 j
        Responsable principal : Tech Lead
        Livrable attendu : Checklist environnement exécutée
        Contexte métier/technique : Documenter versions, chemins, variables, commandes de vérification et prérequis locaux.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-003 - Créer la solution .NET Clean Architecture SoftSign

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-003 - Créer la solution .NET Clean Architecture SoftSign
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Solution compilable avec projets Domain/Application/Infrastructure/Persistence/Api/Tests
        Contexte métier/technique : Créer uniquement le squelette et les dépendances autorisées.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-004 - Créer le workspace Angular NX et le MFE SoftSign

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-004 - Créer le workspace Angular NX et le MFE SoftSign
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Workspace Angular avec app shell et softsign-mfe
        Contexte métier/technique : Configurer Module Federation, routes racines et librairies initiales.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-005 - Définir conventions Git, PR et barème qualité

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-005 - Définir conventions Git, PR et barème qualité
        Charge maximale : 0,5 j
        Responsable principal : Scrum Master
        Livrable attendu : Guide PR court avec pénalités/bonus
        Contexte métier/technique : Intégrer le barème Excel au processus de revue.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-006 - Préparer configuration SQL Server dev avec FILESTREAM et Full-Text

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-006 - Préparer configuration SQL Server dev avec FILESTREAM et Full-Text
        Charge maximale : 1 j
        Responsable principal : DB/Backend
        Livrable attendu : Runbook SQL Server dev/test
        Contexte métier/technique : Vérifier activation FILESTREAM, Full-Text et droits locaux.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-007 - Configurer secrets, HTTPS dev et certificats de signature de test

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-007 - Configurer secrets, HTTPS dev et certificats de signature de test
        Charge maximale : 1 j
        Responsable principal : Backend/Sec
        Livrable attendu : Secrets dev isolés et certificat test disponible
        Contexte métier/technique : Ne jamais stocker secrets ou certificats privés dans Git.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-008 - Mettre en place CI minimale Angular/.NET/tests

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-008 - Mettre en place CI minimale Angular/.NET/tests
        Charge maximale : 1 j
        Responsable principal : DevOps
        Livrable attendu : Pipeline build/test de base
        Contexte métier/technique : Build .NET, build Angular, tests unitaires et analyse format.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-009 - Installer socle logs, health checks et OpenTelemetry

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-009 - Installer socle logs, health checks et OpenTelemetry
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Endpoint health + logs structurés
        Contexte métier/technique : Préparer observabilité avant les features.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R00-010 - Rédiger ADR stockage/OCR/signature/PDF

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S00 - Préparation refonte et environnement de développement
        Ticket : SS-R00-010 - Rédiger ADR stockage/OCR/signature/PDF
        Charge maximale : 1 j
        Responsable principal : Architecte
        Livrable attendu : ADR validée
        Contexte métier/technique : Décider FILESTREAM, FTS, OCR Python, pyHanko, PDF.js, SignalR.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S01 - Socle données SQL Server et modèle persistant

### SS-R01-001 - Créer le schéma SQL softsign et convention migrations

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-001 - Créer le schéma SQL softsign et convention migrations
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Schéma softsign versionné
        Contexte métier/technique : Créer migration de base et script SQL manuel relisible.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-002 - Créer tables Documents et DocumentFiles avec FILESTREAM

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-002 - Créer tables Documents et DocumentFiles avec FILESTREAM
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Tables documents/fichiers opérationnelles
        Contexte métier/technique : Séparer métadonnées, contenu FILESTREAM, hash et version fichier.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-003 - Créer tables annexes et versions de document

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-003 - Créer tables annexes et versions de document
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Annexes et versions persistées
        Contexte métier/technique : Prévoir original, OCRisé, signé et archivé sans écrasement silencieux.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-004 - Créer tables workflow modèles, étapes et conditions

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-004 - Créer tables workflow modèles, étapes et conditions
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : WorkflowModels/WorkflowSteps/WorkflowConditions
        Contexte métier/technique : Supporter séquentiel, parallèle, conditions et versioning.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-005 - Créer tables DocumentSteps et historique workflow

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-005 - Créer tables DocumentSteps et historique workflow
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Étapes documentaires persistées
        Contexte métier/technique : Conserver acteur, statut, dates, délégation et décision.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-006 - Créer tables SignatureZones, SignatureProfiles et ExternalSignatureRequests

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-006 - Créer tables SignatureZones, SignatureProfiles et ExternalSignatureRequests
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Tables signature prêtes
        Contexte métier/technique : Stocker coordonnées PDF normalisées, preuves et statut externe.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-007 - Créer tables OTP, tokens hashés et sécurité signature

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-007 - Créer tables OTP, tokens hashés et sécurité signature
        Charge maximale : 1 j
        Responsable principal : Backend/Sec
        Livrable attendu : OTP/tokens persistés sans secret brut
        Contexte métier/technique : TTL, tentatives, générations, verrouillage et audit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-008 - Créer tables AuditEntries, Notifications, Reminders, Certificates

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-008 - Créer tables AuditEntries, Notifications, Reminders, Certificates
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Audit/notifications/certificats persistés
        Contexte métier/technique : Prévoir immutabilité applicative et rétention.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-009 - Configurer Full-Text Catalog et table DocumentSearchTexts

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-009 - Configurer Full-Text Catalog et table DocumentSearchTexts
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Recherche full-text initiale
        Contexte métier/technique : Indexer référence, titre, métadonnées OCR et contenu texte extrait.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-010 - Créer index de volumétrie pour listes et tableaux

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-010 - Créer index de volumétrie pour listes et tableaux
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Index filtrés et composites
        Contexte métier/technique : Statuts actifs, dates, acteurs, projet/site, type document, retard.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-011 - Créer seed minimal rôles, types document, workflows de démo

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-011 - Créer seed minimal rôles, types document, workflows de démo
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Jeu de données reproductible
        Contexte métier/technique : Données non sensibles et utilisables par l'UI.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R01-012 - Ajouter tests d'intégration base et smoke SQL

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S01 - Socle données SQL Server et modèle persistant
        Ticket : SS-R01-012 - Ajouter tests d'intégration base et smoke SQL
        Charge maximale : 1 j
        Responsable principal : QA/Backend
        Livrable attendu : Tests migration + accès base
        Contexte métier/technique : Vérifier FK, RowVersion, contraintes et recherche full-text.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S02 - Domaine métier et Clean Architecture

### SS-R02-001 - Modéliser l'agrégat SoftSignDocument

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-001 - Modéliser l'agrégat SoftSignDocument
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Entité document avec invariants
        Contexte métier/technique : Statuts, référence, propriétaire, type, priorité et transitions autorisées.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-002 - Créer Value Objects document et fichier

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-002 - Créer Value Objects document et fichier
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : DocumentReference, DocumentHash, FileFormat, Money
        Contexte métier/technique : Validation forte et égalité par valeur.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-003 - Modéliser WorkflowModel, WorkflowStepModel et conditions

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-003 - Modéliser WorkflowModel, WorkflowStepModel et conditions
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Agrégat workflow testable
        Contexte métier/technique : Supporter versioning, activation et conditions par montant/type/site.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-004 - Modéliser DocumentWorkflowStep et transitions

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-004 - Modéliser DocumentWorkflowStep et transitions
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Étapes documentaires avec invariants
        Contexte métier/technique : Une étape active doit respecter le workflow hydraté.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-005 - Modéliser SignatureZone, SignatureProfile et SignatureProof

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-005 - Modéliser SignatureZone, SignatureProfile et SignatureProof
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Objets signature prêts
        Contexte métier/technique : Coordonnées PDF normalisées et preuve immuable.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-006 - Modéliser ExternalSignatureRequest et OtpChallenge

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-006 - Modéliser ExternalSignatureRequest et OtpChallenge
        Charge maximale : 1 j
        Responsable principal : Backend/Sec
        Livrable attendu : Signature externe sécurisée
        Contexte métier/technique : Token/OTP hashés, expiration, tentatives et statuts.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-007 - Créer WorkflowSelectionService et WorkflowHydrationService

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-007 - Créer WorkflowSelectionService et WorkflowHydrationService
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Services domaine testés
        Contexte métier/technique : Sélection workflow selon type, montant, devise, site et règles.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-008 - Créer WorkflowTransitionService

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-008 - Créer WorkflowTransitionService
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Transitions validation/rejet/signature
        Contexte métier/technique : Gérer séquentiel, parallèle, rejet, finalisation.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-009 - Créer DelegationResolutionService et ReminderPolicyService

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-009 - Créer DelegationResolutionService et ReminderPolicyService
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Règles délégation/relance
        Contexte métier/technique : Résoudre acteurs effectifs et retards.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-010 - Créer CertificatePolicyService et AuditTrailService

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-010 - Créer CertificatePolicyService et AuditTrailService
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Règles certificat/audit
        Contexte métier/technique : Définir preuve, hash, certificat et événements métier.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-011 - Définir ports repositories et UnitOfWork

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-011 - Définir ports repositories et UnitOfWork
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Interfaces Domain/Application
        Contexte métier/technique : Aucune dépendance EF Core dans Domain/Application.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R02-012 - Couvrir invariants domaine par tests unitaires

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S02 - Domaine métier et Clean Architecture
        Ticket : SS-R02-012 - Couvrir invariants domaine par tests unitaires
        Charge maximale : 1 j
        Responsable principal : QA/Backend
        Livrable attendu : Tests verts sur règles critiques
        Contexte métier/technique : Tests pour statuts, signature, OTP, workflow, délégation.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S03 - API, stockage volumineux et recherche

### SS-R03-001 - Implémenter UnitOfWork EF Core et repositories documents

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-001 - Implémenter UnitOfWork EF Core et repositories documents
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Repositories documents testables
        Contexte métier/technique : SaveChangesAsync uniquement au niveau UnitOfWork.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-002 - Implémenter provider FILESTREAM et hash fichier

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-002 - Implémenter provider FILESTREAM et hash fichier
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Stockage fichier fiable
        Contexte métier/technique : Streaming, hash SHA-256, métadonnées et taille.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-003 - Créer endpoint upload document résumable

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-003 - Créer endpoint upload document résumable
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Upload gros PDF avec reprise
        Contexte métier/technique : Utiliser tusdotnet ou contrat chunké validé.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-004 - Créer endpoints download/preview en streaming

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-004 - Créer endpoints download/preview en streaming
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Lecture PDF sans charger en mémoire
        Contexte métier/technique : Headers, range si utile, contrôle permission.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-005 - Créer contrats pagination/tri/filtres serveur

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-005 - Créer contrats pagination/tri/filtres serveur
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Query contract standardisé
        Contexte métier/technique : Compatible toutes listes volumineuses.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-006 - Créer API recherche Full-Text Search

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-006 - Créer API recherche Full-Text Search
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Recherche documents textuelle
        Contexte métier/technique : CONTAINS/FREETEXT, pagination, filtres et score.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-007 - Standardiser ProblemDetails et erreurs API

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-007 - Standardiser ProblemDetails et erreurs API
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Format erreur unique
        Contexte métier/technique : Validation, sécurité, not found, conflit, fichier trop gros.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-008 - Ajouter policies d'autorisation SoftSign

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-008 - Ajouter policies d'autorisation SoftSign
        Charge maximale : 1 j
        Responsable principal : Backend/Sec
        Livrable attendu : Permissions backend actives
        Contexte métier/technique : Rôle, action, projet/site, acteur étape.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-009 - Tracer audit applicatif sur commandes sensibles

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-009 - Tracer audit applicatif sur commandes sensibles
        Charge maximale : 1 j
        Responsable principal : Backend/Sec
        Livrable attendu : Audit command handler/application service
        Contexte métier/technique : Sans secrets ni contenu document brut.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R03-010 - Créer tests API stockage/recherche/permissions

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S03 - API, stockage volumineux et recherche
        Ticket : SS-R03-010 - Créer tests API stockage/recherche/permissions
        Charge maximale : 1 j
        Responsable principal : QA/Backend
        Livrable attendu : Tests intégration API
        Contexte métier/technique : Upload, download, FTS, accès refusé.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S04 - Services Python OCR, PDF et signature

### SS-R04-001 - Créer service Python FastAPI OCR/signature

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-001 - Créer service Python FastAPI OCR/signature
        Charge maximale : 1 j
        Responsable principal : Python
        Livrable attendu : Service health/config/logs
        Contexte métier/technique : Endpoints internes protégés, config par environnement.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-002 - Créer contrat .NET vers service Python

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-002 - Créer contrat .NET vers service Python
        Charge maximale : 1 j
        Responsable principal : Backend/Python
        Livrable attendu : Port/adaptateur OCR/PDF
        Contexte métier/technique : Aucun appel direct dispersé dans les controllers.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-003 - Extraire texte des PDF natifs

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-003 - Extraire texte des PDF natifs
        Charge maximale : 1 j
        Responsable principal : Python
        Livrable attendu : Extraction texte sans OCR inutile
        Contexte métier/technique : Utiliser pypdf/PyMuPDF et retourner pages/texte/confidence.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-004 - OCRiser PDF scannés avec OCRmyPDF/Tesseract

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-004 - OCRiser PDF scannés avec OCRmyPDF/Tesseract
        Charge maximale : 1 j
        Responsable principal : Python
        Livrable attendu : Texte OCR pour PDF image
        Contexte métier/technique : Limiter taille, timeout, langue, erreurs et logs.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-005 - Persister résultat OCR dans DocumentSearchTexts

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-005 - Persister résultat OCR dans DocumentSearchTexts
        Charge maximale : 1 j
        Responsable principal : Backend/Python
        Livrable attendu : Texte OCR indexable
        Contexte métier/technique : Mettre à jour FTS et statut OCR.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-006 - Créer job asynchrone OCR et progression SignalR

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-006 - Créer job asynchrone OCR et progression SignalR
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Progression OCR visible
        Contexte métier/technique : Quartz/table jobs ou RabbitMQ si validé.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-007 - Créer prototype signature PDF visible pyHanko

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-007 - Créer prototype signature PDF visible pyHanko
        Charge maximale : 1 j
        Responsable principal : Python
        Livrable attendu : PDF signé de test
        Contexte métier/technique : Signature visible aux coordonnées PDF.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-008 - Créer modèle preuve/certificat de signature

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-008 - Créer modèle preuve/certificat de signature
        Charge maximale : 1 j
        Responsable principal : Backend/Python
        Livrable attendu : Preuve hashée et certificat JSON/PDF
        Contexte métier/technique : Signataire, IP, user-agent, OTP, dates, hash.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-009 - Créer tests avec PDF volumineux et PDF scanné

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-009 - Créer tests avec PDF volumineux et PDF scanné
        Charge maximale : 1 j
        Responsable principal : QA/Python
        Livrable attendu : Jeu de tests OCR/signature
        Contexte métier/technique : Cas natif, scan, gros fichier, erreur.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R04-010 - Documenter limites légales et certificat production

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S04 - Services Python OCR, PDF et signature
        Ticket : SS-R04-010 - Documenter limites légales et certificat production
        Charge maximale : 0,5 j
        Responsable principal : Architecte/Sec
        Livrable attendu : Note d'exploitation signature
        Contexte métier/technique : Distinguer certificat test, CA entreprise, HSM/PKCS#11.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S05 - Fondation Angular MFE et composants transverses

### SS-R05-001 - Brancher softsign-mfe dans le shell

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-001 - Brancher softsign-mfe dans le shell
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : MFE chargeable depuis le shell
        Contexte métier/technique : Routes, navigation et isolation MFE.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-002 - Créer librairies softsign-models/data-access/ui/domain

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-002 - Créer librairies softsign-models/data-access/ui/domain
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Librairies NX respectant boundaries
        Contexte métier/technique : Aucun import cross-feature interdit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-003 - Créer modèles DTO frontend alignés API

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-003 - Créer modèles DTO frontend alignés API
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Types document/workflow/signature
        Contexte métier/technique : Pas de any, statuts en unions typées.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-004 - Créer facades data-access documents/workflows

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-004 - Créer facades data-access documents/workflows
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Services API typés
        Contexte métier/technique : Gestion loading/error, retry raisonnable.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-005 - Créer guards permissions SoftSign

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-005 - Créer guards permissions SoftSign
        Charge maximale : 1 j
        Responsable principal : Frontend/Sec
        Livrable attendu : Menus/routes filtrés
        Contexte métier/technique : Rôle, permission, projet/site et lien externe.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-006 - Créer composants UI statuts, KPI, boutons action

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-006 - Créer composants UI statuts, KPI, boutons action
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : UI réutilisable
        Contexte métier/technique : Présentation sans logique métier lourde.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-007 - Créer composant table serveur volumineuse

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-007 - Créer composant table serveur volumineuse
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Table avec pagination serveur
        Contexte métier/technique : Tri, filtres, état vide/erreur/chargement.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-008 - Intégrer PDF.js pour preview PDF

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-008 - Intégrer PDF.js pour preview PDF
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Viewer PDF page par page
        Contexte métier/technique : Lazy loading et document volumineux.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-009 - Créer signature pad et overlay zones PDF

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-009 - Créer signature pad et overlay zones PDF
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Signature visible en temps réel
        Contexte métier/technique : Coordonnées normalisées et aperçu avant envoi.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R05-010 - Créer tests composants/facades et règle NX

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S05 - Fondation Angular MFE et composants transverses
        Ticket : SS-R05-010 - Créer tests composants/facades et règle NX
        Charge maximale : 1 j
        Responsable principal : QA/Frontend
        Livrable attendu : Tests front initiaux
        Contexte métier/technique : OnPush/signals, pas de NgModule inutile.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S06 - Dépôt document et lancement workflow

### SS-R06-001 - Créer route dépôt interne et stepper

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-001 - Créer route dépôt interne et stepper
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Wizard dépôt affiché
        Contexte métier/technique : Étapes fichier, infos, annexes, workflow, zones, récap.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-002 - Implémenter upload PDF avec progression/reprise

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-002 - Implémenter upload PDF avec progression/reprise
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Upload visible et fiable
        Contexte métier/technique : Barre progression, annulation, reprise.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-003 - Afficher progression OCR en temps réel

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-003 - Afficher progression OCR en temps réel
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : SignalR OCR branché
        Contexte métier/technique : Statut pending/running/done/error.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-004 - Créer formulaire métadonnées prérempli OCR

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-004 - Créer formulaire métadonnées prérempli OCR
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Formulaire typé
        Contexte métier/technique : Référence, type, montant, devise, projet/site, priorité.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-005 - Gérer annexes documentaires

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-005 - Gérer annexes documentaires
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Ajout/suppression annexes
        Contexte métier/technique : Validation taille/type et preview.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-006 - Sélectionner type document et workflow suggéré

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-006 - Sélectionner type document et workflow suggéré
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Workflow proposé
        Contexte métier/technique : Sélection par règles domaine.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-007 - Placer zones signature/paraphe sur PDF

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-007 - Placer zones signature/paraphe sur PDF
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Zones visibles et modifiables
        Contexte métier/technique : Coordonnées sauvegardables et validation zones requises.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-008 - Créer commande backend lancement workflow

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-008 - Créer commande backend lancement workflow
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Transaction création document + étapes
        Contexte métier/technique : Audit et activation première étape.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-009 - Notifier les premiers acteurs du workflow

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-009 - Notifier les premiers acteurs du workflow
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Notification créée
        Contexte métier/technique : Template, destinataire, lien document.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R06-010 - Créer E2E dépôt complet

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S06 - Dépôt document et lancement workflow
        Ticket : SS-R06-010 - Créer E2E dépôt complet
        Charge maximale : 1 j
        Responsable principal : QA
        Livrable attendu : Test bout en bout dépôt
        Contexte métier/technique : Upload, OCR, métadonnées, workflow, zones, lancement.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S07 - Listes, détail document et actions internes

### SS-R07-001 - Créer API KPI dashboard SoftSign

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-001 - Créer API KPI dashboard SoftSign
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : KPI paginés/projetés
        Contexte métier/technique : Documents actifs, retards, signatures, rejets.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-002 - Créer dashboard Angular SoftSign

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-002 - Créer dashboard Angular SoftSign
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Dashboard connecté
        Contexte métier/technique : KPI, alertes, raccourcis sans données mockées.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-003 - Créer liste Mes documents serveur

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-003 - Créer liste Mes documents serveur
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Liste filtrée déposant
        Contexte métier/technique : Pagination, tri, statuts, ouverture détail.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-004 - Créer boîte de réception actions actives

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-004 - Créer boîte de réception actions actives
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Actions à traiter
        Contexte métier/technique : Filtrage acteur/délégation et retard.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-005 - Créer recherche avancée Full-Text

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-005 - Créer recherche avancée Full-Text
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Recherche connectée FTS
        Contexte métier/technique : Texte OCR, métadonnées, filtres et pagination.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-006 - Créer détail document par onglets

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-006 - Créer détail document par onglets
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Résumé, fichiers, workflow, historique
        Contexte métier/technique : Accès contrôlé et états vides.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-007 - Afficher timeline workflow et audit document

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-007 - Afficher timeline workflow et audit document
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Traçabilité lisible
        Contexte métier/technique : Étapes, dates, acteurs, décisions, délégations.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-008 - Implémenter action validation

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-008 - Implémenter action validation
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Validation active
        Contexte métier/technique : Transaction étape, audit, notification suivante.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-009 - Implémenter rejet avec motif obligatoire

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-009 - Implémenter rejet avec motif obligatoire
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Rejet tracé
        Contexte métier/technique : Motif, statut, audit, notification déposant.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-010 - Implémenter signature/paraphe interne OTP

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-010 - Implémenter signature/paraphe interne OTP
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend/Python
        Livrable attendu : PDF signé/paraphé
        Contexte métier/technique : OTP si requis, pyHanko, preuve, audit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R07-011 - Créer E2E validation/rejet/signature interne

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S07 - Listes, détail document et actions internes
        Ticket : SS-R07-011 - Créer E2E validation/rejet/signature interne
        Charge maximale : 1 j
        Responsable principal : QA
        Livrable attendu : Scénarios critiques automatisés
        Contexte métier/technique : Accès refusé, OTP invalide, signature OK.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S08 - Signature externe, certificat et archivage

### SS-R08-001 - Créer API demande signature externe

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-001 - Créer API demande signature externe
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Demande externe persistée
        Contexte métier/technique : Email, message, durée, zone, token hashé.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-002 - Générer lien sécurisé et email de demande

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-002 - Générer lien sécurisé et email de demande
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Email/lien simulé ou réel
        Contexte métier/technique : Token jamais stocké en clair.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-003 - Créer portail public token guard

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-003 - Créer portail public token guard
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Accès lien valide/expiré
        Contexte métier/technique : Écrans invalide, expiré, annulé, signé.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-004 - Implémenter génération OTP externe

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-004 - Implémenter génération OTP externe
        Charge maximale : 1 j
        Responsable principal : Backend/Sec
        Livrable attendu : OTP envoyé et hashé
        Contexte métier/technique : TTL, tentatives, régénération, audit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-005 - Implémenter vérification OTP externe

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-005 - Implémenter vérification OTP externe
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : OTP validé ou refusé
        Contexte métier/technique : Verrouillage après échecs.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-006 - Afficher PDF tiers et signature visible temps réel

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-006 - Afficher PDF tiers et signature visible temps réel
        Charge maximale : 1 j
        Responsable principal : Frontend
        Livrable attendu : Signature pad + aperçu PDF
        Contexte métier/technique : Aucune sauvegarde avant consentement final.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-007 - Appliquer signature externe au PDF

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-007 - Appliquer signature externe au PDF
        Charge maximale : 1 j
        Responsable principal : Backend/Python
        Livrable attendu : PDF signé PAdES/visible
        Contexte métier/technique : pyHanko, hash, version signée.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-008 - Générer certificat de signature et QR payload

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-008 - Générer certificat de signature et QR payload
        Charge maximale : 1 j
        Responsable principal : Backend/Python
        Livrable attendu : Certificat consultable
        Contexte métier/technique : Preuve signataire, OTP, hash, IP, user-agent.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-009 - Réintégrer signature externe dans workflow

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-009 - Réintégrer signature externe dans workflow
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Étape externe terminée
        Contexte métier/technique : Activation étape suivante ou finalisation.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R08-010 - Créer E2E signature externe complète

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S08 - Signature externe, certificat et archivage
        Ticket : SS-R08-010 - Créer E2E signature externe complète
        Charge maximale : 1 j
        Responsable principal : QA
        Livrable attendu : Parcours tiers automatisé
        Contexte métier/technique : Lien, OTP, signature, certificat, audit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S09 - Administration et paramétrage

### SS-R09-001 - Créer liste workflows administrables

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-001 - Créer liste workflows administrables
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Workflows consultables
        Contexte métier/technique : Recherche, statut, version, pagination.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-002 - Créer éditeur workflow étapes/conditions

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-002 - Créer éditeur workflow étapes/conditions
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Workflow éditable
        Contexte métier/technique : Séquentiel, parallèle, rôle, OTP, signature externe.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-003 - Gérer versioning et activation workflow

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-003 - Gérer versioning et activation workflow
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Activation sécurisée
        Contexte métier/technique : Ne pas casser documents actifs.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-004 - Créer gestion utilisateurs/rôles/permissions

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-004 - Créer gestion utilisateurs/rôles/permissions
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Permissions SoftSign administrables
        Contexte métier/technique : Matrice rôle/action/menu/projet/site.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-005 - Créer gestion signatures/paraphes utilisateur

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-005 - Créer gestion signatures/paraphes utilisateur
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Profils signature CRUD
        Contexte métier/technique : Texte, dessin, image, défaut, activation.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-006 - Créer gestion délégations

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-006 - Créer gestion délégations
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Délégations CRUD
        Contexte métier/technique : Période, actions, types, projet/site, audit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-007 - Créer validation comptes externes

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-007 - Créer validation comptes externes
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Comptes tiers approuvés/rejetés
        Contexte métier/technique : Notification décision et modules autorisés.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-008 - Créer paramètres OTP

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-008 - Créer paramètres OTP
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Politique OTP configurable
        Contexte métier/technique : Longueur, TTL, tentatives, canaux, activation par étape.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-009 - Créer paramètres relances Quartz

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-009 - Créer paramètres relances Quartz
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Relances automatiques
        Contexte métier/technique : Fréquence, seuil, preview, audit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-010 - Créer modèles email et variables

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-010 - Créer modèles email et variables
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Templates administrables
        Contexte métier/technique : Prévisualisation et réinitialisation.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-011 - Créer centre notifications

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-011 - Créer centre notifications
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Notifications consultables
        Contexte métier/technique : Lu/non lu, navigation cible, suppression.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R09-012 - Créer paramètres généraux/personnalisation/licence

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S09 - Administration et paramétrage
        Ticket : SS-R09-012 - Créer paramètres généraux/personnalisation/licence
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Écran settings
        Contexte métier/technique : Formats, logo, thème, quotas, limites fichiers.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

## S10 - Reporting, performance, sécurité et livraison

### SS-R10-001 - Créer rapport situation par validateur

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-001 - Créer rapport situation par validateur
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Rapport connecté
        Contexte métier/technique : Agrégats SQL, retard, délai moyen, drill-down.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-002 - Créer rapport situation par expéditeur

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-002 - Créer rapport situation par expéditeur
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Rapport expéditeur
        Contexte métier/technique : Déposant/fournisseur, statut, délai prévu/réel.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-003 - Créer journal d'audit global filtrable

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-003 - Créer journal d'audit global filtrable
        Charge maximale : 1 j
        Responsable principal : Frontend/Backend
        Livrable attendu : Audit consultable
        Contexte métier/technique : Filtres, FTS, export, pagination serveur.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-004 - Créer exports CSV/XLSX/PDF gratuits

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-004 - Créer exports CSV/XLSX/PDF gratuits
        Charge maximale : 1 j
        Responsable principal : Backend
        Livrable attendu : Exports opérationnels
        Contexte métier/technique : ClosedXML/QuestPDF si licence compatible, streaming.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-005 - Tester performance gros PDF et upload

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-005 - Tester performance gros PDF et upload
        Charge maximale : 1 j
        Responsable principal : QA/Perf
        Livrable attendu : Rapport performance fichiers
        Contexte métier/technique : PDF 50/100/200 Mo selon cible, mémoire contrôlée.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-006 - Tester performance tables volumineuses

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-006 - Tester performance tables volumineuses
        Charge maximale : 1 j
        Responsable principal : QA/Perf
        Livrable attendu : Rapport performance listes
        Contexte métier/technique : 100k/1M lignes simulées, pagination et index.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-007 - Optimiser indexes SQL et requêtes lentes

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-007 - Optimiser indexes SQL et requêtes lentes
        Charge maximale : 1 j
        Responsable principal : Backend/DB
        Livrable attendu : Plan d'index final
        Contexte métier/technique : Requêtes dashboard, listes, FTS, audit.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-008 - Créer tests sécurité permissions/OTP/token

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-008 - Créer tests sécurité permissions/OTP/token
        Charge maximale : 1 j
        Responsable principal : QA/Sec
        Livrable attendu : Suite sécurité
        Contexte métier/technique : Accès refusé, token expiré, OTP brute force, logs secrets.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-009 - Créer runbook backup/restore FILESTREAM

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-009 - Créer runbook backup/restore FILESTREAM
        Charge maximale : 1 j
        Responsable principal : DevOps/DB
        Livrable attendu : Procédure exploitation
        Contexte métier/technique : Sauvegarde base + fichiers + certificats.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-010 - Créer dashboards observabilité

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-010 - Créer dashboards observabilité
        Charge maximale : 1 j
        Responsable principal : DevOps
        Livrable attendu : Traces/logs/métriques lisibles
        Contexte métier/technique : OCR, signature, upload, API lente, erreurs.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-011 - Faire revue accessibilité et responsive

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-011 - Faire revue accessibilité et responsive
        Charge maximale : 1 j
        Responsable principal : QA/Frontend
        Livrable attendu : Checklist UI corrigée
        Contexte métier/technique : Desktop, tablette, mobile, clavier, contrastes.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```

### SS-R10-012 - Préparer package recette V1 et jeu de démo

```text
Tu es développeur IA senior sur la refonte SoftSign du projet gedlb.

        Important : l'application actuelle est une maquette fonctionnelle. Tu ne dois pas reprendre son architecture. Tu dois implémenter la cible C#/.NET Clean Architecture + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec service Python uniquement pour OCR/PDF/signature si nécessaire.

        Sprint : S10 - Reporting, performance, sécurité et livraison
        Ticket : SS-R10-012 - Préparer package recette V1 et jeu de démo
        Charge maximale : 1 j
        Responsable principal : PO/QA
        Livrable attendu : Release candidate démontrable
        Contexte métier/technique : Parcours dépôt, validation, signature externe, rapports.

        Standards à respecter :
        - La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

        Architecture attendue :
        - Backend : ASP.NET Core .NET 8 LTS, Clean Architecture, Application Services, Domain Services, Repository Pattern, UnitOfWork, FluentValidation, ProblemDetails, Serilog, OpenTelemetry.
        - Données : SQL Server, schéma softsign, FILESTREAM pour fichiers, Full-Text Search sur texte OCR/métadonnées, RowVersion, audit columns, index de volumétrie.
        - Frontend : Angular 17+ minimum, NX, MFE, standalone components, signals, RxJS, OnPush, guards permissions, data-access typé.
        - Python : FastAPI worker pour OCR/Tesseract/OCRmyPDF et signature PDF pyHanko, appelé via port/adaptateur depuis .NET.

        Barème qualité à appliquer :
        - Éviter P0/P1/P2 du fichier Excel : type any injustifié, violation boundaries NX, logique métier dans controller/composant, SaveChangesAsync hors UnitOfWork, absence Authorize, logs sensibles, migration EF auto non relue, PR sans ticket.
        - Viser les bonus : corrections proactives sécurité, typage strict, OnPush/signals, interfaces Application, FluentValidation, pagination serveur, description PR complète.

        Demande de génération :
        1. Génère uniquement le périmètre de ce ticket.
        2. Donne les fichiers à créer/modifier.
        3. Fournis le code ou la configuration nécessaire.
        4. Ajoute les tests unitaires/intégration/UI/E2E adaptés.
        5. Donne les commandes de vérification.
        6. Termine par les risques et points à valider avec PO/Tech Lead.
```
