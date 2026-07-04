# Plan sprints de refonte SoftSign

Date : 2026-06-04

SoftSign actuel est une maquette fonctionnelle. La refonte cible une vraie application C#/.NET + Angular NX/MFE + SQL Server FILESTREAM/Full-Text Search, avec Python pour OCR/PDF/signature si nécessaire.

## Directives globales

- La maquette actuelle sert uniquement de source fonctionnelle et UX. Elle ne doit pas être traitée comme architecture à maintenir.
- La refonte commence par l'environnement, le socle données, les entités, la Clean Architecture, puis le MFE Angular.
- Aucun ticket ne dépasse 1 jour ouvrable. Un ticket doit livrer une preuve visible, testable ou vérifiable en fin de journée.
- Clean Code, SOLID, séparation des couches, design patterns adaptés et respect du barème bonus/pénalité sont obligatoires.
- Interdits : framework payant, MediatR, framework CQRS, logique métier dans controller/composant Angular, SaveChangesAsync hors UnitOfWork, type any injustifié.
- Les PDF et tables volumineux doivent être pensés dès le socle : streaming, upload résumable, pagination serveur, index SQL, Full-Text Search, jobs asynchrones.
- La signature électronique combine aperçu temps réel côté Angular et scellement PDF côté serveur avec preuve, hash, audit et certificat.

## Outils gratuits retenus

| Couche | Outil | Usage |
|---|---|---|
| Frontend | Angular 17+ minimum, NX, Module Federation, Standalone Components, Signals, RxJS | Socle MFE, UI moderne et maintenable |
| Frontend PDF | PDF.js, signature_pad, Angular CDK, AG Grid Community si besoin | Prévisualisation PDF, signature visible, tables volumineuses |
| Backend | .NET 8 LTS, ASP.NET Core Web API, EF Core, Dapper lecture/reporting | Clean Architecture, API robuste, requêtes volumineuses |
| Validation | FluentValidation, ProblemDetails RFC 7807 | Contrats API propres, erreurs standardisées |
| Observabilité | Serilog, OpenTelemetry, health checks | Logs structurés, traces et diagnostic production |
| Temps réel | ASP.NET Core SignalR | Progression OCR/upload/signature et notifications |
| Données | SQL Server Developer en dev/test, SQL Server production à licencier, FILESTREAM, Full-Text Search | Fichiers volumineux, recherche documentaire et intégrité transactionnelle |
| Upload | tusdotnet ou upload chunké maison | Reprise upload gros PDF sans recommencer |
| OCR | Python FastAPI worker, Tesseract OCR, OCRmyPDF, pypdf/PyMuPDF | Extraction texte PDF natif et OCR des scans |
| Signature PDF | Python FastAPI worker, pyHanko, cryptography | Signature visible, PAdES, certificat et preuve |
| Jobs | Quartz.NET, table de jobs ou RabbitMQ si architecture autorisée | Relances, OCR, génération certificat, traitements asynchrones |
| Tests | xUnit, FluentAssertions, Testcontainers SQL si possible, Jest/Karma/Vitest selon socle, Playwright | Tests domaine, API, Angular et E2E |

## Estimation

- 119 tickets .
- Charge brute : 119 jours/homme.
- Avec intégration, QA, sécurité, performance : 145 à 160 jours.homme.
- Équipe recommandée : 3 développeurs + 1 QA + PO/BA disponible.
- Durée réaliste : 8 à 10 sprints de 2 semaines.

## Tickets par sprint

### S00 - Préparation refonte et environnement de développement

Objectif : Créer les bases de travail avant tout écran métier.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R00-001 | Acter la refonte depuis maquette et figer le périmètre V1 | 0,5 j | PO/BA | Note de cadrage refonte validée | Clarifier que l'application actuelle est une maquette fonctionnelle, pas un socle technique. |
| SS-R00-002 | Préparer le poste dev .NET, Node, Angular CLI, Python, SQL Server, Tesseract | 1 j | Tech Lead | Checklist environnement exécutée | Documenter versions, chemins, variables, commandes de vérification et prérequis locaux. |
| SS-R00-003 | Créer la solution .NET Clean Architecture SoftSign | 1 j | Backend | Solution compilable avec projets Domain/Application/Infrastructure/Persistence/Api/Tests | Créer uniquement le squelette et les dépendances autorisées. |
| SS-R00-004 | Créer le workspace Angular NX et le MFE SoftSign | 1 j | Frontend | Workspace Angular avec app shell et softsign-mfe | Configurer Module Federation, routes racines et librairies initiales. |
| SS-R00-005 | Définir conventions Git, PR et barème qualité | 0,5 j | Scrum Master | Guide PR court avec pénalités/bonus | Intégrer le barème Excel au processus de revue. |
| SS-R00-006 | Préparer configuration SQL Server dev avec FILESTREAM et Full-Text | 1 j | DB/Backend | Runbook SQL Server dev/test | Vérifier activation FILESTREAM, Full-Text et droits locaux. |
| SS-R00-007 | Configurer secrets, HTTPS dev et certificats de signature de test | 1 j | Backend/Sec | Secrets dev isolés et certificat test disponible | Ne jamais stocker secrets ou certificats privés dans Git. |
| SS-R00-008 | Mettre en place CI minimale Angular/.NET/tests | 1 j | DevOps | Pipeline build/test de base | Build .NET, build Angular, tests unitaires et analyse format. |
| SS-R00-009 | Installer socle logs, health checks et OpenTelemetry | 1 j | Backend | Endpoint health + logs structurés | Préparer observabilité avant les features. |
| SS-R00-010 | Rédiger ADR stockage/OCR/signature/PDF | 1 j | Architecte | ADR validée | Décider FILESTREAM, FTS, OCR Python, pyHanko, PDF.js, SignalR. |

### S01 - Socle données SQL Server et modèle persistant

Objectif : Créer le schéma durable qui supporte les gros PDF, la recherche et l'audit.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R01-001 | Créer le schéma SQL softsign et convention migrations | 1 j | Backend/DB | Schéma softsign versionné | Créer migration de base et script SQL manuel relisible. |
| SS-R01-002 | Créer tables Documents et DocumentFiles avec FILESTREAM | 1 j | Backend/DB | Tables documents/fichiers opérationnelles | Séparer métadonnées, contenu FILESTREAM, hash et version fichier. |
| SS-R01-003 | Créer tables annexes et versions de document | 1 j | Backend/DB | Annexes et versions persistées | Prévoir original, OCRisé, signé et archivé sans écrasement silencieux. |
| SS-R01-004 | Créer tables workflow modèles, étapes et conditions | 1 j | Backend/DB | WorkflowModels/WorkflowSteps/WorkflowConditions | Supporter séquentiel, parallèle, conditions et versioning. |
| SS-R01-005 | Créer tables DocumentSteps et historique workflow | 1 j | Backend/DB | Étapes documentaires persistées | Conserver acteur, statut, dates, délégation et décision. |
| SS-R01-006 | Créer tables SignatureZones, SignatureProfiles et ExternalSignatureRequests | 1 j | Backend/DB | Tables signature prêtes | Stocker coordonnées PDF normalisées, preuves et statut externe. |
| SS-R01-007 | Créer tables OTP, tokens hashés et sécurité signature | 1 j | Backend/Sec | OTP/tokens persistés sans secret brut | TTL, tentatives, générations, verrouillage et audit. |
| SS-R01-008 | Créer tables AuditEntries, Notifications, Reminders, Certificates | 1 j | Backend/DB | Audit/notifications/certificats persistés | Prévoir immutabilité applicative et rétention. |
| SS-R01-009 | Configurer Full-Text Catalog et table DocumentSearchTexts | 1 j | Backend/DB | Recherche full-text initiale | Indexer référence, titre, métadonnées OCR et contenu texte extrait. |
| SS-R01-010 | Créer index de volumétrie pour listes et tableaux | 1 j | Backend/DB | Index filtrés et composites | Statuts actifs, dates, acteurs, projet/site, type document, retard. |
| SS-R01-011 | Créer seed minimal rôles, types document, workflows de démo | 1 j | Backend/DB | Jeu de données reproductible | Données non sensibles et utilisables par l'UI. |
| SS-R01-012 | Ajouter tests d'intégration base et smoke SQL | 1 j | QA/Backend | Tests migration + accès base | Vérifier FK, RowVersion, contraintes et recherche full-text. |

### S02 - Domaine métier et Clean Architecture

Objectif : Protéger les règles SoftSign avant d'exposer les API.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R02-001 | Modéliser l'agrégat SoftSignDocument | 1 j | Backend | Entité document avec invariants | Statuts, référence, propriétaire, type, priorité et transitions autorisées. |
| SS-R02-002 | Créer Value Objects document et fichier | 1 j | Backend | DocumentReference, DocumentHash, FileFormat, Money | Validation forte et égalité par valeur. |
| SS-R02-003 | Modéliser WorkflowModel, WorkflowStepModel et conditions | 1 j | Backend | Agrégat workflow testable | Supporter versioning, activation et conditions par montant/type/site. |
| SS-R02-004 | Modéliser DocumentWorkflowStep et transitions | 1 j | Backend | Étapes documentaires avec invariants | Une étape active doit respecter le workflow hydraté. |
| SS-R02-005 | Modéliser SignatureZone, SignatureProfile et SignatureProof | 1 j | Backend | Objets signature prêts | Coordonnées PDF normalisées et preuve immuable. |
| SS-R02-006 | Modéliser ExternalSignatureRequest et OtpChallenge | 1 j | Backend/Sec | Signature externe sécurisée | Token/OTP hashés, expiration, tentatives et statuts. |
| SS-R02-007 | Créer WorkflowSelectionService et WorkflowHydrationService | 1 j | Backend | Services domaine testés | Sélection workflow selon type, montant, devise, site et règles. |
| SS-R02-008 | Créer WorkflowTransitionService | 1 j | Backend | Transitions validation/rejet/signature | Gérer séquentiel, parallèle, rejet, finalisation. |
| SS-R02-009 | Créer DelegationResolutionService et ReminderPolicyService | 1 j | Backend | Règles délégation/relance | Résoudre acteurs effectifs et retards. |
| SS-R02-010 | Créer CertificatePolicyService et AuditTrailService | 1 j | Backend | Règles certificat/audit | Définir preuve, hash, certificat et événements métier. |
| SS-R02-011 | Définir ports repositories et UnitOfWork | 1 j | Backend | Interfaces Domain/Application | Aucune dépendance EF Core dans Domain/Application. |
| SS-R02-012 | Couvrir invariants domaine par tests unitaires | 1 j | QA/Backend | Tests verts sur règles critiques | Tests pour statuts, signature, OTP, workflow, délégation. |

### S03 - API, stockage volumineux et recherche

Objectif : Exposer des API robustes pour gros documents et tables volumineuses.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R03-001 | Implémenter UnitOfWork EF Core et repositories documents | 1 j | Backend | Repositories documents testables | SaveChangesAsync uniquement au niveau UnitOfWork. |
| SS-R03-002 | Implémenter provider FILESTREAM et hash fichier | 1 j | Backend | Stockage fichier fiable | Streaming, hash SHA-256, métadonnées et taille. |
| SS-R03-003 | Créer endpoint upload document résumable | 1 j | Backend | Upload gros PDF avec reprise | Utiliser tusdotnet ou contrat chunké validé. |
| SS-R03-004 | Créer endpoints download/preview en streaming | 1 j | Backend | Lecture PDF sans charger en mémoire | Headers, range si utile, contrôle permission. |
| SS-R03-005 | Créer contrats pagination/tri/filtres serveur | 1 j | Backend | Query contract standardisé | Compatible toutes listes volumineuses. |
| SS-R03-006 | Créer API recherche Full-Text Search | 1 j | Backend | Recherche documents textuelle | CONTAINS/FREETEXT, pagination, filtres et score. |
| SS-R03-007 | Standardiser ProblemDetails et erreurs API | 1 j | Backend | Format erreur unique | Validation, sécurité, not found, conflit, fichier trop gros. |
| SS-R03-008 | Ajouter policies d'autorisation SoftSign | 1 j | Backend/Sec | Permissions backend actives | Rôle, action, projet/site, acteur étape. |
| SS-R03-009 | Tracer audit applicatif sur commandes sensibles | 1 j | Backend/Sec | Audit command handler/application service | Sans secrets ni contenu document brut. |
| SS-R03-010 | Créer tests API stockage/recherche/permissions | 1 j | QA/Backend | Tests intégration API | Upload, download, FTS, accès refusé. |

### S04 - Services Python OCR, PDF et signature

Objectif : Isoler OCR et signature PDF dans un service gratuit, testable et observable.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R04-001 | Créer service Python FastAPI OCR/signature | 1 j | Python | Service health/config/logs | Endpoints internes protégés, config par environnement. |
| SS-R04-002 | Créer contrat .NET vers service Python | 1 j | Backend/Python | Port/adaptateur OCR/PDF | Aucun appel direct dispersé dans les controllers. |
| SS-R04-003 | Extraire texte des PDF natifs | 1 j | Python | Extraction texte sans OCR inutile | Utiliser pypdf/PyMuPDF et retourner pages/texte/confidence. |
| SS-R04-004 | OCRiser PDF scannés avec OCRmyPDF/Tesseract | 1 j | Python | Texte OCR pour PDF image | Limiter taille, timeout, langue, erreurs et logs. |
| SS-R04-005 | Persister résultat OCR dans DocumentSearchTexts | 1 j | Backend/Python | Texte OCR indexable | Mettre à jour FTS et statut OCR. |
| SS-R04-006 | Créer job asynchrone OCR et progression SignalR | 1 j | Backend | Progression OCR visible | Quartz/table jobs ou RabbitMQ si validé. |
| SS-R04-007 | Créer prototype signature PDF visible pyHanko | 1 j | Python | PDF signé de test | Signature visible aux coordonnées PDF. |
| SS-R04-008 | Créer modèle preuve/certificat de signature | 1 j | Backend/Python | Preuve hashée et certificat JSON/PDF | Signataire, IP, user-agent, OTP, dates, hash. |
| SS-R04-009 | Créer tests avec PDF volumineux et PDF scanné | 1 j | QA/Python | Jeu de tests OCR/signature | Cas natif, scan, gros fichier, erreur. |
| SS-R04-010 | Documenter limites légales et certificat production | 0,5 j | Architecte/Sec | Note d'exploitation signature | Distinguer certificat test, CA entreprise, HSM/PKCS#11. |

### S05 - Fondation Angular MFE et composants transverses

Objectif : Créer le socle front avant les écrans métier complets.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R05-001 | Brancher softsign-mfe dans le shell | 1 j | Frontend | MFE chargeable depuis le shell | Routes, navigation et isolation MFE. |
| SS-R05-002 | Créer librairies softsign-models/data-access/ui/domain | 1 j | Frontend | Librairies NX respectant boundaries | Aucun import cross-feature interdit. |
| SS-R05-003 | Créer modèles DTO frontend alignés API | 1 j | Frontend | Types document/workflow/signature | Pas de any, statuts en unions typées. |
| SS-R05-004 | Créer facades data-access documents/workflows | 1 j | Frontend | Services API typés | Gestion loading/error, retry raisonnable. |
| SS-R05-005 | Créer guards permissions SoftSign | 1 j | Frontend/Sec | Menus/routes filtrés | Rôle, permission, projet/site et lien externe. |
| SS-R05-006 | Créer composants UI statuts, KPI, boutons action | 1 j | Frontend | UI réutilisable | Présentation sans logique métier lourde. |
| SS-R05-007 | Créer composant table serveur volumineuse | 1 j | Frontend | Table avec pagination serveur | Tri, filtres, état vide/erreur/chargement. |
| SS-R05-008 | Intégrer PDF.js pour preview PDF | 1 j | Frontend | Viewer PDF page par page | Lazy loading et document volumineux. |
| SS-R05-009 | Créer signature pad et overlay zones PDF | 1 j | Frontend | Signature visible en temps réel | Coordonnées normalisées et aperçu avant envoi. |
| SS-R05-010 | Créer tests composants/facades et règle NX | 1 j | QA/Frontend | Tests front initiaux | OnPush/signals, pas de NgModule inutile. |

### S06 - Dépôt document et lancement workflow

Objectif : Livrer le premier flux métier complet de bout en bout.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R06-001 | Créer route dépôt interne et stepper | 1 j | Frontend | Wizard dépôt affiché | Étapes fichier, infos, annexes, workflow, zones, récap. |
| SS-R06-002 | Implémenter upload PDF avec progression/reprise | 1 j | Frontend/Backend | Upload visible et fiable | Barre progression, annulation, reprise. |
| SS-R06-003 | Afficher progression OCR en temps réel | 1 j | Frontend/Backend | SignalR OCR branché | Statut pending/running/done/error. |
| SS-R06-004 | Créer formulaire métadonnées prérempli OCR | 1 j | Frontend/Backend | Formulaire typé | Référence, type, montant, devise, projet/site, priorité. |
| SS-R06-005 | Gérer annexes documentaires | 1 j | Frontend/Backend | Ajout/suppression annexes | Validation taille/type et preview. |
| SS-R06-006 | Sélectionner type document et workflow suggéré | 1 j | Frontend/Backend | Workflow proposé | Sélection par règles domaine. |
| SS-R06-007 | Placer zones signature/paraphe sur PDF | 1 j | Frontend | Zones visibles et modifiables | Coordonnées sauvegardables et validation zones requises. |
| SS-R06-008 | Créer commande backend lancement workflow | 1 j | Backend | Transaction création document + étapes | Audit et activation première étape. |
| SS-R06-009 | Notifier les premiers acteurs du workflow | 1 j | Backend | Notification créée | Template, destinataire, lien document. |
| SS-R06-010 | Créer E2E dépôt complet | 1 j | QA | Test bout en bout dépôt | Upload, OCR, métadonnées, workflow, zones, lancement. |

### S07 - Listes, détail document et actions internes

Objectif : Permettre aux utilisateurs internes de traiter les documents.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R07-001 | Créer API KPI dashboard SoftSign | 1 j | Backend | KPI paginés/projetés | Documents actifs, retards, signatures, rejets. |
| SS-R07-002 | Créer dashboard Angular SoftSign | 1 j | Frontend | Dashboard connecté | KPI, alertes, raccourcis sans données mockées. |
| SS-R07-003 | Créer liste Mes documents serveur | 1 j | Frontend/Backend | Liste filtrée déposant | Pagination, tri, statuts, ouverture détail. |
| SS-R07-004 | Créer boîte de réception actions actives | 1 j | Frontend/Backend | Actions à traiter | Filtrage acteur/délégation et retard. |
| SS-R07-005 | Créer recherche avancée Full-Text | 1 j | Frontend/Backend | Recherche connectée FTS | Texte OCR, métadonnées, filtres et pagination. |
| SS-R07-006 | Créer détail document par onglets | 1 j | Frontend/Backend | Résumé, fichiers, workflow, historique | Accès contrôlé et états vides. |
| SS-R07-007 | Afficher timeline workflow et audit document | 1 j | Frontend/Backend | Traçabilité lisible | Étapes, dates, acteurs, décisions, délégations. |
| SS-R07-008 | Implémenter action validation | 1 j | Frontend/Backend | Validation active | Transaction étape, audit, notification suivante. |
| SS-R07-009 | Implémenter rejet avec motif obligatoire | 1 j | Frontend/Backend | Rejet tracé | Motif, statut, audit, notification déposant. |
| SS-R07-010 | Implémenter signature/paraphe interne OTP | 1 j | Frontend/Backend/Python | PDF signé/paraphé | OTP si requis, pyHanko, preuve, audit. |
| SS-R07-011 | Créer E2E validation/rejet/signature interne | 1 j | QA | Scénarios critiques automatisés | Accès refusé, OTP invalide, signature OK. |

### S08 - Signature externe, certificat et archivage

Objectif : Livrer le parcours tiers externe sécurisé.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R08-001 | Créer API demande signature externe | 1 j | Backend | Demande externe persistée | Email, message, durée, zone, token hashé. |
| SS-R08-002 | Générer lien sécurisé et email de demande | 1 j | Backend | Email/lien simulé ou réel | Token jamais stocké en clair. |
| SS-R08-003 | Créer portail public token guard | 1 j | Frontend/Backend | Accès lien valide/expiré | Écrans invalide, expiré, annulé, signé. |
| SS-R08-004 | Implémenter génération OTP externe | 1 j | Backend/Sec | OTP envoyé et hashé | TTL, tentatives, régénération, audit. |
| SS-R08-005 | Implémenter vérification OTP externe | 1 j | Frontend/Backend | OTP validé ou refusé | Verrouillage après échecs. |
| SS-R08-006 | Afficher PDF tiers et signature visible temps réel | 1 j | Frontend | Signature pad + aperçu PDF | Aucune sauvegarde avant consentement final. |
| SS-R08-007 | Appliquer signature externe au PDF | 1 j | Backend/Python | PDF signé PAdES/visible | pyHanko, hash, version signée. |
| SS-R08-008 | Générer certificat de signature et QR payload | 1 j | Backend/Python | Certificat consultable | Preuve signataire, OTP, hash, IP, user-agent. |
| SS-R08-009 | Réintégrer signature externe dans workflow | 1 j | Backend | Étape externe terminée | Activation étape suivante ou finalisation. |
| SS-R08-010 | Créer E2E signature externe complète | 1 j | QA | Parcours tiers automatisé | Lien, OTP, signature, certificat, audit. |

### S09 - Administration et paramétrage

Objectif : Rendre SoftSign configurable sans intervention développeur.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R09-001 | Créer liste workflows administrables | 1 j | Frontend/Backend | Workflows consultables | Recherche, statut, version, pagination. |
| SS-R09-002 | Créer éditeur workflow étapes/conditions | 1 j | Frontend/Backend | Workflow éditable | Séquentiel, parallèle, rôle, OTP, signature externe. |
| SS-R09-003 | Gérer versioning et activation workflow | 1 j | Backend | Activation sécurisée | Ne pas casser documents actifs. |
| SS-R09-004 | Créer gestion utilisateurs/rôles/permissions | 1 j | Frontend/Backend | Permissions SoftSign administrables | Matrice rôle/action/menu/projet/site. |
| SS-R09-005 | Créer gestion signatures/paraphes utilisateur | 1 j | Frontend/Backend | Profils signature CRUD | Texte, dessin, image, défaut, activation. |
| SS-R09-006 | Créer gestion délégations | 1 j | Frontend/Backend | Délégations CRUD | Période, actions, types, projet/site, audit. |
| SS-R09-007 | Créer validation comptes externes | 1 j | Frontend/Backend | Comptes tiers approuvés/rejetés | Notification décision et modules autorisés. |
| SS-R09-008 | Créer paramètres OTP | 1 j | Frontend/Backend | Politique OTP configurable | Longueur, TTL, tentatives, canaux, activation par étape. |
| SS-R09-009 | Créer paramètres relances Quartz | 1 j | Frontend/Backend | Relances automatiques | Fréquence, seuil, preview, audit. |
| SS-R09-010 | Créer modèles email et variables | 1 j | Frontend/Backend | Templates administrables | Prévisualisation et réinitialisation. |
| SS-R09-011 | Créer centre notifications | 1 j | Frontend/Backend | Notifications consultables | Lu/non lu, navigation cible, suppression. |
| SS-R09-012 | Créer paramètres généraux/personnalisation/licence | 1 j | Frontend/Backend | Écran settings | Formats, logo, thème, quotas, limites fichiers. |

### S10 - Reporting, performance, sécurité et livraison

Objectif : Stabiliser la V1 pour données volumineuses et recette métier.

| ID | Titre | Charge | Responsable | Livrable | Contexte |
|---|---|---:|---|---|---|
| SS-R10-001 | Créer rapport situation par validateur | 1 j | Frontend/Backend | Rapport connecté | Agrégats SQL, retard, délai moyen, drill-down. |
| SS-R10-002 | Créer rapport situation par expéditeur | 1 j | Frontend/Backend | Rapport expéditeur | Déposant/fournisseur, statut, délai prévu/réel. |
| SS-R10-003 | Créer journal d'audit global filtrable | 1 j | Frontend/Backend | Audit consultable | Filtres, FTS, export, pagination serveur. |
| SS-R10-004 | Créer exports CSV/XLSX/PDF gratuits | 1 j | Backend | Exports opérationnels | ClosedXML/QuestPDF si licence compatible, streaming. |
| SS-R10-005 | Tester performance gros PDF et upload | 1 j | QA/Perf | Rapport performance fichiers | PDF 50/100/200 Mo selon cible, mémoire contrôlée. |
| SS-R10-006 | Tester performance tables volumineuses | 1 j | QA/Perf | Rapport performance listes | 100k/1M lignes simulées, pagination et index. |
| SS-R10-007 | Optimiser indexes SQL et requêtes lentes | 1 j | Backend/DB | Plan d'index final | Requêtes dashboard, listes, FTS, audit. |
| SS-R10-008 | Créer tests sécurité permissions/OTP/token | 1 j | QA/Sec | Suite sécurité | Accès refusé, token expiré, OTP brute force, logs secrets. |
| SS-R10-009 | Créer runbook backup/restore FILESTREAM | 1 j | DevOps/DB | Procédure exploitation | Sauvegarde base + fichiers + certificats. |
| SS-R10-010 | Créer dashboards observabilité | 1 j | DevOps | Traces/logs/métriques lisibles | OCR, signature, upload, API lente, erreurs. |
| SS-R10-011 | Faire revue accessibilité et responsive | 1 j | QA/Frontend | Checklist UI corrigée | Desktop, tablette, mobile, clavier, contrastes. |
| SS-R10-012 | Préparer package recette V1 et jeu de démo | 1 j | PO/QA | Release candidate démontrable | Parcours dépôt, validation, signature externe, rapports. |


## Sources

- SQL Server FILESTREAM - https://learn.microsoft.com/en-us/sql/relational-databases/blob/filestream-sql-server
- SQL Server Full-Text Search - https://learn.microsoft.com/en-us/sql/relational-databases/search/full-text-search
- ASP.NET Core SignalR - https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction
- Angular Signals - https://angular.dev/guide/signals
- Angular Standalone Components - https://angular.dev/reference/migrations/standalone
- PDF.js - https://mozilla.github.io/pdf.js/
- pyHanko signing - https://pyhanko.readthedocs.io/en/v0.25.1/cli-guide/signing.html
- Tesseract OCR - https://tesseract-ocr.github.io/tessdoc/
- OCRmyPDF - https://ocrmypdf.readthedocs.io/
- tusdotnet - https://github.com/tusdotnet/tusdotnet
- AG Grid Community license - https://github.com/ag-grid/ag-grid/blob/latest/LICENSE.txt
- OpenTelemetry .NET - https://opentelemetry.io/docs/languages/dotnet/
- Quartz.NET - https://www.quartz-scheduler.net/documentation/