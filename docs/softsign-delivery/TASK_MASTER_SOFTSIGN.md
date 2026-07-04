# TASK MASTER SOFTSIGN - REFONTE

Ce fichier remplace l'ordre historique orienté maquette. Les tickets ci-dessous commencent par les fondations nécessaires à une vraie application C#/.NET + Angular NX/MFE + SQL Server.

## S00 - Préparation refonte et environnement de développement

Objectif : Créer les bases de travail avant tout écran métier.

- [ ] SS-R00-001 - Acter la refonte depuis maquette et figer le périmètre V1 (0,5 j) : Note de cadrage refonte validée
- [ ] SS-R00-002 - Préparer le poste dev .NET, Node, Angular CLI, Python, SQL Server, Tesseract (1 j) : Checklist environnement exécutée
- [ ] SS-R00-003 - Créer la solution .NET Clean Architecture SoftSign (1 j) : Solution compilable avec projets Domain/Application/Infrastructure/Persistence/Api/Tests
- [ ] SS-R00-004 - Créer le workspace Angular NX et le MFE SoftSign (1 j) : Workspace Angular avec app shell et softsign-mfe
- [ ] SS-R00-005 - Définir conventions Git, PR et barème qualité (0,5 j) : Guide PR court avec pénalités/bonus
- [ ] SS-R00-006 - Préparer configuration SQL Server dev avec FILESTREAM et Full-Text (1 j) : Runbook SQL Server dev/test
- [ ] SS-R00-007 - Configurer secrets, HTTPS dev et certificats de signature de test (1 j) : Secrets dev isolés et certificat test disponible
- [ ] SS-R00-008 - Mettre en place CI minimale Angular/.NET/tests (1 j) : Pipeline build/test de base
- [ ] SS-R00-009 - Installer socle logs, health checks et OpenTelemetry (1 j) : Endpoint health + logs structurés
- [ ] SS-R00-010 - Rédiger ADR stockage/OCR/signature/PDF (1 j) : ADR validée

## S01 - Socle données SQL Server et modèle persistant

Objectif : Créer le schéma durable qui supporte les gros PDF, la recherche et l'audit.

- [ ] SS-R01-001 - Créer le schéma SQL softsign et convention migrations (1 j) : Schéma softsign versionné
- [ ] SS-R01-002 - Créer tables Documents et DocumentFiles avec FILESTREAM (1 j) : Tables documents/fichiers opérationnelles
- [ ] SS-R01-003 - Créer tables annexes et versions de document (1 j) : Annexes et versions persistées
- [ ] SS-R01-004 - Créer tables workflow modèles, étapes et conditions (1 j) : WorkflowModels/WorkflowSteps/WorkflowConditions
- [ ] SS-R01-005 - Créer tables DocumentSteps et historique workflow (1 j) : Étapes documentaires persistées
- [ ] SS-R01-006 - Créer tables SignatureZones, SignatureProfiles et ExternalSignatureRequests (1 j) : Tables signature prêtes
- [ ] SS-R01-007 - Créer tables OTP, tokens hashés et sécurité signature (1 j) : OTP/tokens persistés sans secret brut
- [ ] SS-R01-008 - Créer tables AuditEntries, Notifications, Reminders, Certificates (1 j) : Audit/notifications/certificats persistés
- [ ] SS-R01-009 - Configurer Full-Text Catalog et table DocumentSearchTexts (1 j) : Recherche full-text initiale
- [ ] SS-R01-010 - Créer index de volumétrie pour listes et tableaux (1 j) : Index filtrés et composites
- [ ] SS-R01-011 - Créer seed minimal rôles, types document, workflows de démo (1 j) : Jeu de données reproductible
- [ ] SS-R01-012 - Ajouter tests d'intégration base et smoke SQL (1 j) : Tests migration + accès base

## S02 - Domaine métier et Clean Architecture

Objectif : Protéger les règles SoftSign avant d'exposer les API.

- [ ] SS-R02-001 - Modéliser l'agrégat SoftSignDocument (1 j) : Entité document avec invariants
- [ ] SS-R02-002 - Créer Value Objects document et fichier (1 j) : DocumentReference, DocumentHash, FileFormat, Money
- [ ] SS-R02-003 - Modéliser WorkflowModel, WorkflowStepModel et conditions (1 j) : Agrégat workflow testable
- [ ] SS-R02-004 - Modéliser DocumentWorkflowStep et transitions (1 j) : Étapes documentaires avec invariants
- [ ] SS-R02-005 - Modéliser SignatureZone, SignatureProfile et SignatureProof (1 j) : Objets signature prêts
- [ ] SS-R02-006 - Modéliser ExternalSignatureRequest et OtpChallenge (1 j) : Signature externe sécurisée
- [ ] SS-R02-007 - Créer WorkflowSelectionService et WorkflowHydrationService (1 j) : Services domaine testés
- [ ] SS-R02-008 - Créer WorkflowTransitionService (1 j) : Transitions validation/rejet/signature
- [ ] SS-R02-009 - Créer DelegationResolutionService et ReminderPolicyService (1 j) : Règles délégation/relance
- [ ] SS-R02-010 - Créer CertificatePolicyService et AuditTrailService (1 j) : Règles certificat/audit
- [ ] SS-R02-011 - Définir ports repositories et UnitOfWork (1 j) : Interfaces Domain/Application
- [ ] SS-R02-012 - Couvrir invariants domaine par tests unitaires (1 j) : Tests verts sur règles critiques

## S03 - API, stockage volumineux et recherche

Objectif : Exposer des API robustes pour gros documents et tables volumineuses.

- [ ] SS-R03-001 - Implémenter UnitOfWork EF Core et repositories documents (1 j) : Repositories documents testables
- [ ] SS-R03-002 - Implémenter provider FILESTREAM et hash fichier (1 j) : Stockage fichier fiable
- [ ] SS-R03-003 - Créer endpoint upload document résumable (1 j) : Upload gros PDF avec reprise
- [ ] SS-R03-004 - Créer endpoints download/preview en streaming (1 j) : Lecture PDF sans charger en mémoire
- [ ] SS-R03-005 - Créer contrats pagination/tri/filtres serveur (1 j) : Query contract standardisé
- [ ] SS-R03-006 - Créer API recherche Full-Text Search (1 j) : Recherche documents textuelle
- [ ] SS-R03-007 - Standardiser ProblemDetails et erreurs API (1 j) : Format erreur unique
- [ ] SS-R03-008 - Ajouter policies d'autorisation SoftSign (1 j) : Permissions backend actives
- [ ] SS-R03-009 - Tracer audit applicatif sur commandes sensibles (1 j) : Audit command handler/application service
- [ ] SS-R03-010 - Créer tests API stockage/recherche/permissions (1 j) : Tests intégration API

## S04 - Services Python OCR, PDF et signature

Objectif : Isoler OCR et signature PDF dans un service gratuit, testable et observable.

- [ ] SS-R04-001 - Créer service Python FastAPI OCR/signature (1 j) : Service health/config/logs
- [ ] SS-R04-002 - Créer contrat .NET vers service Python (1 j) : Port/adaptateur OCR/PDF
- [ ] SS-R04-003 - Extraire texte des PDF natifs (1 j) : Extraction texte sans OCR inutile
- [ ] SS-R04-004 - OCRiser PDF scannés avec OCRmyPDF/Tesseract (1 j) : Texte OCR pour PDF image
- [ ] SS-R04-005 - Persister résultat OCR dans DocumentSearchTexts (1 j) : Texte OCR indexable
- [ ] SS-R04-006 - Créer job asynchrone OCR et progression SignalR (1 j) : Progression OCR visible
- [ ] SS-R04-007 - Créer prototype signature PDF visible pyHanko (1 j) : PDF signé de test
- [ ] SS-R04-008 - Créer modèle preuve/certificat de signature (1 j) : Preuve hashée et certificat JSON/PDF
- [ ] SS-R04-009 - Créer tests avec PDF volumineux et PDF scanné (1 j) : Jeu de tests OCR/signature
- [ ] SS-R04-010 - Documenter limites légales et certificat production (0,5 j) : Note d'exploitation signature

## S05 - Fondation Angular MFE et composants transverses

Objectif : Créer le socle front avant les écrans métier complets.

- [ ] SS-R05-001 - Brancher softsign-mfe dans le shell (1 j) : MFE chargeable depuis le shell
- [ ] SS-R05-002 - Créer librairies softsign-models/data-access/ui/domain (1 j) : Librairies NX respectant boundaries
- [ ] SS-R05-003 - Créer modèles DTO frontend alignés API (1 j) : Types document/workflow/signature
- [ ] SS-R05-004 - Créer facades data-access documents/workflows (1 j) : Services API typés
- [ ] SS-R05-005 - Créer guards permissions SoftSign (1 j) : Menus/routes filtrés
- [ ] SS-R05-006 - Créer composants UI statuts, KPI, boutons action (1 j) : UI réutilisable
- [ ] SS-R05-007 - Créer composant table serveur volumineuse (1 j) : Table avec pagination serveur
- [ ] SS-R05-008 - Intégrer PDF.js pour preview PDF (1 j) : Viewer PDF page par page
- [ ] SS-R05-009 - Créer signature pad et overlay zones PDF (1 j) : Signature visible en temps réel
- [ ] SS-R05-010 - Créer tests composants/facades et règle NX (1 j) : Tests front initiaux

## S06 - Dépôt document et lancement workflow

Objectif : Livrer le premier flux métier complet de bout en bout.

- [ ] SS-R06-001 - Créer route dépôt interne et stepper (1 j) : Wizard dépôt affiché
- [ ] SS-R06-002 - Implémenter upload PDF avec progression/reprise (1 j) : Upload visible et fiable
- [ ] SS-R06-003 - Afficher progression OCR en temps réel (1 j) : SignalR OCR branché
- [ ] SS-R06-004 - Créer formulaire métadonnées prérempli OCR (1 j) : Formulaire typé
- [ ] SS-R06-005 - Gérer annexes documentaires (1 j) : Ajout/suppression annexes
- [ ] SS-R06-006 - Sélectionner type document et workflow suggéré (1 j) : Workflow proposé
- [ ] SS-R06-007 - Placer zones signature/paraphe sur PDF (1 j) : Zones visibles et modifiables
- [ ] SS-R06-008 - Créer commande backend lancement workflow (1 j) : Transaction création document + étapes
- [ ] SS-R06-009 - Notifier les premiers acteurs du workflow (1 j) : Notification créée
- [ ] SS-R06-010 - Créer E2E dépôt complet (1 j) : Test bout en bout dépôt

## S07 - Listes, détail document et actions internes

Objectif : Permettre aux utilisateurs internes de traiter les documents.

- [ ] SS-R07-001 - Créer API KPI dashboard SoftSign (1 j) : KPI paginés/projetés
- [ ] SS-R07-002 - Créer dashboard Angular SoftSign (1 j) : Dashboard connecté
- [ ] SS-R07-003 - Créer liste Mes documents serveur (1 j) : Liste filtrée déposant
- [ ] SS-R07-004 - Créer boîte de réception actions actives (1 j) : Actions à traiter
- [ ] SS-R07-005 - Créer recherche avancée Full-Text (1 j) : Recherche connectée FTS
- [ ] SS-R07-006 - Créer détail document par onglets (1 j) : Résumé, fichiers, workflow, historique
- [ ] SS-R07-007 - Afficher timeline workflow et audit document (1 j) : Traçabilité lisible
- [ ] SS-R07-008 - Implémenter action validation (1 j) : Validation active
- [ ] SS-R07-009 - Implémenter rejet avec motif obligatoire (1 j) : Rejet tracé
- [ ] SS-R07-010 - Implémenter signature/paraphe interne OTP (1 j) : PDF signé/paraphé
- [ ] SS-R07-011 - Créer E2E validation/rejet/signature interne (1 j) : Scénarios critiques automatisés

## S08 - Signature externe, certificat et archivage

Objectif : Livrer le parcours tiers externe sécurisé.

- [ ] SS-R08-001 - Créer API demande signature externe (1 j) : Demande externe persistée
- [ ] SS-R08-002 - Générer lien sécurisé et email de demande (1 j) : Email/lien simulé ou réel
- [ ] SS-R08-003 - Créer portail public token guard (1 j) : Accès lien valide/expiré
- [ ] SS-R08-004 - Implémenter génération OTP externe (1 j) : OTP envoyé et hashé
- [ ] SS-R08-005 - Implémenter vérification OTP externe (1 j) : OTP validé ou refusé
- [ ] SS-R08-006 - Afficher PDF tiers et signature visible temps réel (1 j) : Signature pad + aperçu PDF
- [ ] SS-R08-007 - Appliquer signature externe au PDF (1 j) : PDF signé PAdES/visible
- [ ] SS-R08-008 - Générer certificat de signature et QR payload (1 j) : Certificat consultable
- [ ] SS-R08-009 - Réintégrer signature externe dans workflow (1 j) : Étape externe terminée
- [ ] SS-R08-010 - Créer E2E signature externe complète (1 j) : Parcours tiers automatisé

## S09 - Administration et paramétrage

Objectif : Rendre SoftSign configurable sans intervention développeur.

- [ ] SS-R09-001 - Créer liste workflows administrables (1 j) : Workflows consultables
- [ ] SS-R09-002 - Créer éditeur workflow étapes/conditions (1 j) : Workflow éditable
- [ ] SS-R09-003 - Gérer versioning et activation workflow (1 j) : Activation sécurisée
- [ ] SS-R09-004 - Créer gestion utilisateurs/rôles/permissions (1 j) : Permissions SoftSign administrables
- [ ] SS-R09-005 - Créer gestion signatures/paraphes utilisateur (1 j) : Profils signature CRUD
- [ ] SS-R09-006 - Créer gestion délégations (1 j) : Délégations CRUD
- [ ] SS-R09-007 - Créer validation comptes externes (1 j) : Comptes tiers approuvés/rejetés
- [ ] SS-R09-008 - Créer paramètres OTP (1 j) : Politique OTP configurable
- [ ] SS-R09-009 - Créer paramètres relances Quartz (1 j) : Relances automatiques
- [ ] SS-R09-010 - Créer modèles email et variables (1 j) : Templates administrables
- [ ] SS-R09-011 - Créer centre notifications (1 j) : Notifications consultables
- [ ] SS-R09-012 - Créer paramètres généraux/personnalisation/licence (1 j) : Écran settings

## S10 - Reporting, performance, sécurité et livraison

Objectif : Stabiliser la V1 pour données volumineuses et recette métier.

- [ ] SS-R10-001 - Créer rapport situation par validateur (1 j) : Rapport connecté
- [ ] SS-R10-002 - Créer rapport situation par expéditeur (1 j) : Rapport expéditeur
- [ ] SS-R10-003 - Créer journal d'audit global filtrable (1 j) : Audit consultable
- [ ] SS-R10-004 - Créer exports CSV/XLSX/PDF gratuits (1 j) : Exports opérationnels
- [ ] SS-R10-005 - Tester performance gros PDF et upload (1 j) : Rapport performance fichiers
- [ ] SS-R10-006 - Tester performance tables volumineuses (1 j) : Rapport performance listes
- [ ] SS-R10-007 - Optimiser indexes SQL et requêtes lentes (1 j) : Plan d'index final
- [ ] SS-R10-008 - Créer tests sécurité permissions/OTP/token (1 j) : Suite sécurité
- [ ] SS-R10-009 - Créer runbook backup/restore FILESTREAM (1 j) : Procédure exploitation
- [ ] SS-R10-010 - Créer dashboards observabilité (1 j) : Traces/logs/métriques lisibles
- [ ] SS-R10-011 - Faire revue accessibilité et responsive (1 j) : Checklist UI corrigée
- [ ] SS-R10-012 - Préparer package recette V1 et jeu de démo (1 j) : Release candidate démontrable
