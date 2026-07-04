# README - Backlog de refonte SoftSign

Date de rédaction : 2026-06-06

Ce document extrait les fonctionnalités de la maquette SoftSign et les reformule en Features Azure DevOps pour une refonte industrielle en C# Clean Architecture, Angular NX/MFE, SQL Server FILESTREAM/Full-Text Search et services gratuits complémentaires, notamment Python pour OCR, PDF et signature.

Les sources locales utilisées sont :

- `src/components/softsign/SidebarSS.jsx` : navigation réelle de la maquette SoftSign.
- `src/components/softsign/SSOperational.jsx` : écrans, actions, administration, rapports et parcours internes.
- `src/components/softsign/softsignCore.js` : règles métier mockées : workflow, délégations, relances, références, statuts.
- `src/components/softsign/dataSS.js` : jeux de données mock : documents, devis, contrats, fournisseurs, workflows, signatures, notifications.
- `docs/softsign-delivery/captures` : captures de recette de la maquette.
- `docs/softsign-delivery/ged` : entités C# proposées pour le domaine SoftSign.

## Décision de refonte

La maquette actuelle est une source fonctionnelle et UX. Elle ne doit pas devenir le socle technique de la nouvelle application.

La cible recommandée est :

- Backend : ASP.NET Core Web API, C#, Clean Architecture, Domain/Application/Infrastructure/Persistence/Api/Tests.
- Frontend : Angular, NX, Micro Frontend SoftSign, standalone components, signals, RxJS, guards, facades data-access.
- Données : SQL Server avec schéma `softsign`, FILESTREAM pour PDF/fichiers volumineux, Full-Text Search pour métadonnées et texte OCR.
- Python : FastAPI worker interne pour extraction texte, OCR Tesseract/OCRmyPDF, manipulation PDF, signature visible/PAdES avec pyHanko, génération certificat.
- Temps réel : SignalR pour progression upload/OCR/signature/notifications.
- Jobs : Quartz.NET ou table de jobs applicative pour OCR, relances, signatures, certificats, exports.
- Qualité : tests unitaires domaine, intégration API/SQL, tests Angular, Playwright E2E, logs structurés, ProblemDetails, audit.

Important : SQL Server Developer est gratuit pour développement/test. Pour la production, valider la licence SQL Server ou le périmètre SQL Server Express selon volumes. Les bibliothèques open source citées doivent être validées juridiquement avant production.

## Fonctionnalités extraites de la maquette

| Vue maquette | Fonctionnalités à refaire | Référence locale | Sprint cible |
|---|---|---|---|
| Accueil fournisseur | Entrée collaborateur externe, dépôt fournisseur, consultation de suivi | `CAP-01`, `ExternalSignature.jsx`, `dataSS.js` | S06/S08 |
| Login backoffice | Authentification interne, rôles, accès par menu | `CAP-02`, `BackofficeLogin.jsx`, `softsignAccess.js` | S00/S09 |
| Dashboard SoftSign | KPI, alertes, documents urgents, raccourcis, suivi activité | `CAP-03`, `SSOperational.jsx` | S07 |
| Nouveau dépôt | Wizard fichier, OCR, métadonnées, annexes, workflow, zones signature, lancement | `CAP-04`, `DepositWizard` | S06 |
| Mes documents | Liste déposant, filtres, tri, pagination, détail | `CAP-05`, `UnifiedDocModule` | S07 |
| Boîte de réception | Actions à traiter : validation, rejet, signature, paraphe, relance | `CAP-06`, `DocTab4`, `ActionModal` | S07 |
| Délégations | CRUD délégation, période, périmètre, audit, application sur workflows | `CAP-07`, `DelegationsAdmin` | S09 |
| Utilisateurs | Liste utilisateurs, création, rôle, receveur documents, quotas | `CAP-08`, `AdminPanel`, `NouvelUtilisateurView` | S09 |
| Autorisations | Matrice rôles, permissions menus/actions, accès admin/standard/readonly | `CAP-09`, `AutorisationsView`, `softsignAccess.js` | S09 |
| Paramétrage OTP | Longueur, TTL, tentatives, canaux, activation par workflow | `CAP-10`, `OtpAdmin` | S09 |
| Workflow | Modèles, étapes, conditions, séquentiel/parallèle, activation/version | `CAP-11`, `WorkflowAdmin` | S09 |
| Notifications | Centre de notifications, lu/non lu, cible, email, alertes | `CAP-12`, `NotificationsView` | S09 |
| Relances | Relances manuelles/automatiques, fréquence, seuil, historique | `CAP-13`, `RelancesView`, `softsignCore.js` | S09 |
| Validation fournisseurs | Comptes externes, approbation/rejet/suspension, affectation projet/site | `CAP-14`, `ExternalAccountsAdmin` | S09 |
| Situation validateur | Rapport par validateur, retard, délai moyen, détail documents | `CAP-15`, `SituationValidateurView` | S10 |
| Portail signature externe OTP | Lien sécurisé, OTP, signature visible, certificat | `CAP-16`, `ExternalSignature.jsx` | S08 |
| Documents externes | Documents déposés par fournisseurs, réception, rattachement workflow | `SSOperational.jsx` | S06/S07 |
| Documents en cours | Suivi des étapes actives, workflow, statut, retard | `SSOperational.jsx` | S07 |
| Documents rejetés | Liste rejetés, motifs, date rejet, audit | `SSOperational.jsx` | S07 |
| Archives et certificats | Documents terminés, certificat, QR payload, export PDF | `CertificatsView`, `AuditView` | S08/S10 |
| Recherche avancée | Recherche multicritères + plein texte OCR/métadonnées | `AdvancedSearchPanel` | S07 |
| Signatures et paraphes | Profil texte/dessin/image, signature par défaut, aperçu | `SignaturesAdmin`, `SignaturePad` | S09 |
| Modèles emails | Templates, variables, prévisualisation, notification workflow | `EmailTemplatesView` | S09 |
| Personnalisation | Logo, thème, application config, apparence | `PersonnalisationView` | S09 |
| Paramètres généraux | Référence document, types, formats autorisés, site/projet | `GeneralSettingsAdmin`, `softsignCore.js` | S09 |
| Intégration SoftDocs | Rattacher document signé et certificat dans GED | `SoftDocsIntegration` | S09/S10 |
| Journal d'audit | Audit système et document, filtre, export | `AuditView` | S10 |

Les modules mockés Devis/Contrats doivent être traités comme types de documents SoftSign en V1, sauf décision PO de créer des menus spécialisés.

## Diagnostic des entités actuelles

Réponse courte : les entités présentes dans `docs/softsign-delivery/ged` sont une bonne base pour le noyau documentaire, mais elles ne sont pas suffisantes pour couvrir toutes les fonctionnalités de la maquette et les exigences d'une V1 industrielle.

### Ce qui est déjà bien couvert

| Besoin | Entités existantes utiles | Diagnostic |
|---|---|---|
| Document métier | `SoftSignDocument` | Base correcte : référence, titre, type, statut, déposant, projet, site, montant, workflow, dates, hash. |
| Fichier volumineux | `SoftSignDocumentFile` | Bonne intention FILESTREAM, hash, version, statut OCR. Il manque le script SQL FILESTREAM précis et la gestion upload chunk/résumable. |
| Versions et annexes | `SoftSignDocumentVersion`, `SoftSignDocumentAnnex` | Couverture correcte pour original, OCRisé, signé, archivé et annexes. |
| Recherche | `SoftSignDocumentSearchText` | Base correcte pour texte OCR/indexable. Il faut compléter avec catalogue Full-Text, langue, index SQL, score et API de recherche. |
| Workflows | `SoftSignWorkflowModel`, `SoftSignWorkflowStepModel`, `SoftSignWorkflowCondition`, `SoftSignDocumentWorkflowStep` | Base solide pour modèles, étapes, conditions et étapes instanciées. Il faut ajouter invariants, versioning strict et règles parallèle/séquentiel. |
| Actions internes | `SoftSignDocumentAction` | Bon support pour validation, rejet, signature, OTP, statut avant/après. |
| Signature visible | `SoftSignSignatureZone`, `SoftSignSignatureProfile` | Couvre zones PDF et profils. Il manque une preuve de signature détaillée et des coordonnées normalisées/validées. |
| Signature externe | `SoftSignExternalSignatureRequest`, `SoftSignExternalSignatureAction`, `SoftSignOtpChallenge` | Bonne base token/OTP/action. Il faut renforcer consentement, preuve, expiration, reactivation et lifecycle. |
| Délégations | `SoftSignDelegation` | Couvre délégant/délégataire/périmètre. Le CSV d'actions doit devenir une table ou un JSON validé. |
| Notifications/relances | `SoftSignNotification`, `SoftSignReminder`, `SoftSignEmailTemplate` | Base utile. Il manque outbox email, delivery, retry et versioning templates. |
| Audit/certificat | `SoftSignAuditEntry`, `SoftSignCertificate` | Base correcte. Il faut immutabilité applicative, preuve signée, QR payload stable et export PDF. |
| Paramètres/licence | `SoftSignGeneralSettings`, `SoftSignLicense`, `SoftSignRolePermission` | Base partielle. Il faut structurer certains paramètres métier en tables dédiées. |

### Manques à ajouter avant développement complet

| Entité ou concept à ajouter | Pourquoi c'est nécessaire |
|---|---|
| `SoftSignDocumentType` | Ne pas stocker uniquement `DocumentTypeCode`; gérer libellé, format, workflow par défaut, activation. |
| `SoftSignProjectScope` / liens projet-site | Filtrer permissions, workflows, formats, rapports et délégations par projet/site. Peut référencer un module existant si déjà présent ailleurs. |
| `SoftSignExternalAccountDocument` | Stocker les pièces de compte fournisseur : NIF, STAT, KBIS/local équivalent, statut de vérification. |
| `SoftSignUploadSession` et `SoftSignUploadChunk` | Supporter upload volumineux avec reprise, hash final, annulation, expiration. |
| `SoftSignProcessingJob` | Piloter OCR, signature, certificat, export, relance en asynchrone avec retry et statut. |
| `SoftSignOcrResult` ou enrichissement `DocumentSearchTexts` | Suivre pages, moteur, durée, confiance, erreurs, texte natif vs OCR. |
| `SoftSignPdfPageInfo` | Dimensions pages PDF pour convertir correctement les zones Angular vers coordonnées PDF serveur. |
| `SoftSignSignatureProof` | Preuve détaillée : hash avant/après, OTP, IP, user-agent, certificat utilisé, consentement, horodatage. |
| `SoftSignEmailOutbox` et `SoftSignEmailDelivery` | Envoyer emails de façon fiable, rejouer les erreurs, auditer sans bloquer les transactions métier. |
| `SoftSignNotificationPreference` | Gérer préférences utilisateur/canal/langue si nécessaire. |
| `SoftSignSavedSearch` | Sauvegarder les filtres de recherche avancée et rapports fréquents. |
| `SoftSignExportJob` | Générer CSV/XLSX/PDF volumineux sans bloquer l'API. |
| `SoftSignDocumentAccessGrant` | Gérer partage/visibilité document au-delà du rôle global. |
| `SoftSignSoftDocsLink` | Rattacher document signé/certificat dans la GED SoftDocs avec traçabilité. |
| `SoftSignTemplateVersion` | Versionner modèles email/certificat si les documents anciens doivent rester prouvables. |
| `SoftSignAuditRetentionPolicy` | Formaliser rétention, purge, anonymisation et consultation audit. |
| Value Objects domaine | `DocumentReference`, `DocumentHash`, `Money`, `PdfCoordinates`, `OtpCodeHash`, `EmailAddress`, `FileSize`, `WorkflowVersion`. |
| Domain Events | `DocumentDeposited`, `WorkflowStarted`, `StepActivated`, `DocumentRejected`, `DocumentSigned`, `ExternalSignatureRequested`, `CertificateIssued`. |

### Points techniques à corriger dans les entités

- Les entités sont actuellement des POCO EF plutôt anémiques. En Clean Architecture, le domaine doit porter les invariants et transitions : démarrer workflow, activer étape, signer, rejeter, archiver.
- `SoftSignDocumentFile.Content` doit être mappé explicitement en `VARBINARY(MAX) FILESTREAM` via migration SQL relue. Prévoir `ROWGUIDCOL`, taille, hash, provider et streaming.
- `ActionTypesCsv` dans `SoftSignDelegation` est fragile. Préférer une table `SoftSignDelegationAction` ou un JSON validé par Value Object.
- Les IDs utilisateurs/fournisseurs/projets/sites sont des `Guid` ou codes sans navigation. C'est acceptable si SoftSign référence un module Identity/Portail existant, mais il faut documenter les contrats.
- `SoftSignGeneralSettings` est pratique mais ne doit pas remplacer les référentiels structurants : types document, formats autorisés, politique OTP, séquences de référence.
- Ajouter colonnes d'audit standard partout : `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `IsDeleted` si soft delete, `RowVersion`.

## Template Azure DevOps recommandé

Chaque Feature ci-dessous peut devenir un Work Item Azure DevOps de type `Feature`. Les listes "Sous-tickets" peuvent devenir des `User Story` ou `Task` enfants.

Champs à renseigner :

- Area Path : `GEDLB\SoftSign`.
- Iteration Path : sprint indiqué dans la Feature.
- Work Item Type : `Feature`.
- Title : utiliser l'ID et le titre.
- Description : reprendre les sections Use case, Fonctionnel et Technique.
- Acceptance Criteria : reprendre les critères Given/When/Then.
- Tags : `SoftSign`, `Refonte`, `CleanArchitecture`, `Angular`, `SQLServer`, `Python`, plus tag métier.
- Definition of Done : tests adaptés, preuve de recette, logs sans secret, permissions, pagination serveur, audit, documentation courte.

## Backlog Features par sprint

### SS-F00-001 - Cadrage V1 et règles de delivery

- Type : Feature Azure DevOps.
- Sprint : S00.
- Personas : PO, BA, Tech Lead, QA, Développeurs.
- Objectif : figer le périmètre V1 extrait de la maquette et éviter que l'équipe reconstruise la maquette telle quelle.
- Use case : En tant que PO/BA, je veux disposer d'un périmètre V1 clair pour prioriser les développements et créer les tickets détaillés.

Fonctionnel :

- Valider les fonctionnalités incluses V1 : dépôt, workflow, validation, rejet, signature interne, signature externe OTP, certificats, administration, rapports.
- Identifier les fonctionnalités V2 : authentification forte avancée, horodatage qualifié, HSM, multi-tenant avancé, connecteurs payants, signature qualifiée.
- Associer chaque écran maquette à une Feature cible et à une preuve de recette.
- Définir les rôles : déposant, validateur, signataire, administrateur, lecteur, fournisseur externe.

Technique :

- Acter Clean Architecture, Angular NX/MFE, SQL Server FILESTREAM/FTS et Python worker.
- Écrire les interdits : pas de logique métier dans controllers/composants, pas de `SaveChangesAsync` dans repositories, pas de `any` injustifié, pas de secret en logs.
- Créer la Definition of Ready et Definition of Done.

Sous-tickets :

- Valider le catalogue des écrans et parcours.
- Valider les rôles et permissions V1.
- Valider les formats documents et volumes cibles.
- Valider le niveau légal attendu pour la signature électronique.
- Produire le tableau de correspondance maquette -> Feature.

Critères d'acceptation :

- Given la maquette SoftSign, When le PO relit le cadrage, Then chaque écran est classé V1, V2 ou hors périmètre.
- Given une Feature V1, When elle est planifiée, Then son acteur, sa preuve de recette et ses dépendances sont visibles.
- Given une ambiguïté légale sur la signature, When elle est identifiée, Then elle est portée comme risque explicite.

Tests/preuves :

- Revue PO/BA.
- Checklist de cadrage signée.
- Backlog initial créé dans Azure DevOps.

### SS-F00-002 - Socle technique local et outillage gratuit

- Type : Feature Azure DevOps.
- Sprint : S00.
- Personas : Tech Lead, Développeur, DevOps.
- Objectif : préparer un environnement reproductible pour backend, frontend, SQL Server, Python et OCR.
- Use case : En tant que développeur, je veux lancer et vérifier toute la stack SoftSign en local pour développer sans dépendance floue.

Fonctionnel :

- Fournir une checklist d'installation.
- Fournir les commandes de vérification.
- Fournir des certificats et secrets de test hors Git.
- Fournir des PDF d'exemple : PDF natif, PDF scanné, PDF volumineux.

Technique :

- Installer .NET SDK retenu, Node, Angular CLI/NX, Python, SQL Server Developer/Express, Tesseract, OCRmyPDF.
- Vérifier activation FILESTREAM et Full-Text Search.
- Préparer variables d'environnement : chaînes SQL, URL Python worker, répertoires temporaires, SMTP dev.
- Prévoir `README_DEV.md`, `.env.example`, scripts de health check.

Sous-tickets :

- Créer checklist poste dev.
- Installer dépendances gratuites et vérifier licences.
- Préparer SQL Server dev avec FILESTREAM/FTS.
- Préparer environnement Python OCR/signature.
- Préparer certificats de signature de test.

Critères d'acceptation :

- Given un poste vierge conforme, When la checklist est suivie, Then tous les health checks passent.
- Given SQL Server local, When la vérification est lancée, Then FILESTREAM et Full-Text sont actifs.
- Given Python worker local, When `/health` est appelé, Then la version Tesseract et les dépendances PDF sont visibles.

Tests/preuves :

- Capture ou log des commandes `dotnet --version`, `node --version`, `python --version`, health SQL, health worker.

### SS-F00-003 - Solution .NET Clean Architecture et conventions

- Type : Feature Azure DevOps.
- Sprint : S00.
- Personas : Backend, Tech Lead.
- Objectif : créer la solution backend industrielle.
- Use case : En tant que développeur backend, je veux un squelette Clean Architecture pour implémenter les cas d'usage SoftSign sans dépendance inversée.

Fonctionnel :

- Aucun écran métier livré dans cette Feature.
- Fournir une API health et une route version.
- Préparer la structure pour les futurs cas d'usage.

Technique :

- Projets : `SoftSign.Domain`, `SoftSign.Application`, `SoftSign.Infrastructure`, `SoftSign.Persistence`, `SoftSign.Api`, `SoftSign.Tests`.
- Domain : entités, Value Objects, Domain Services, Domain Events.
- Application : ports, DTO, services applicatifs, validators, transactions.
- Infrastructure : email, Python client, stockage, horloge, utilisateur courant.
- Persistence : DbContext, configurations EF, migrations SQL relues, repositories, UnitOfWork.
- Api : controllers fins, auth, ProblemDetails, Swagger/OpenAPI.

Sous-tickets :

- Créer solution et projets.
- Définir conventions namespaces/dossiers.
- Brancher DI par couche.
- Ajouter health checks et ProblemDetails.
- Ajouter tests de compilation et test architecture.

Critères d'acceptation :

- Given la solution, When `dotnet build` est exécuté, Then tous les projets compilent.
- Given une référence de projet interdite, When les tests architecture passent, Then Domain ne dépend pas d'Infrastructure/Persistence.
- Given une erreur API, When elle est retournée, Then le format est ProblemDetails.

Tests/preuves :

- Build backend.
- Tests unitaires architecture.
- Capture Swagger/health.

### SS-F00-004 - Workspace Angular NX/MFE SoftSign

- Type : Feature Azure DevOps.
- Sprint : S00.
- Personas : Frontend, Tech Lead.
- Objectif : préparer le frontend Angular refondu sans reprendre le React mock.
- Use case : En tant que développeur frontend, je veux un MFE SoftSign branché au shell pour livrer les écrans progressivement.

Fonctionnel :

- Afficher une page SoftSign minimale chargée depuis le shell.
- Préparer navigation et guards sans données mockées métier.
- Préparer thème et layout applicatif.

Technique :

- Créer `apps/shell`, `apps/softsign-mfe`.
- Créer libs : `softsign-models`, `softsign-data-access`, `softsign-domain`, `softsign-ui`, `softsign-feature-*`.
- Utiliser standalone components, routes lazy, signals pour état local, RxJS pour API.
- Ajouter `enforce-module-boundaries`.
- Préparer client OpenAPI ou services HTTP typés.

Sous-tickets :

- Initialiser NX et Angular.
- Configurer Module Federation.
- Créer layout SoftSign et navigation vide.
- Créer guards permission.
- Créer facades data-access initiales.
- Ajouter tests de composants et lint.

Critères d'acceptation :

- Given le shell Angular, When l'utilisateur ouvre SoftSign, Then le MFE se charge.
- Given un rôle sans permission, When il accède à une route protégée, Then l'accès est refusé proprement.
- Given le lint NX, When il s'exécute, Then aucune boundary n'est violée.

Tests/preuves :

- Build Angular.
- Test route MFE.
- Capture écran shell + SoftSign.

### SS-F00-005 - CI/CD, qualité et observabilité minimale

- Type : Feature Azure DevOps.
- Sprint : S00.
- Personas : DevOps, QA, Tech Lead.
- Objectif : sécuriser les livraisons dès le démarrage.
- Use case : En tant qu'équipe projet, je veux une pipeline qui bloque les régressions évidentes avant merge.

Fonctionnel :

- Aucune fonctionnalité métier.
- Fournir un statut de build lisible par PR.

Technique :

- Pipeline : restore, build, tests .NET, lint/build Angular, tests frontend, publication artefacts.
- Ajouter Serilog, OpenTelemetry, health checks API, health SQL, health Python.
- Définir convention branches, commits, PR, lien ticket.
- Préparer template PR avec checklist sécurité, tests, captures.

Sous-tickets :

- Créer pipeline build/test.
- Créer template PR.
- Configurer logs structurés.
- Ajouter traces et correlation id.
- Ajouter quality gates minimales.

Critères d'acceptation :

- Given une PR, When elle est créée, Then build backend, build frontend et tests obligatoires s'exécutent.
- Given une requête API, When elle est loggée, Then elle contient correlation id sans secret.
- Given un service indisponible, When health check est appelé, Then le statut indique le composant en erreur.

Tests/preuves :

- Capture pipeline verte.
- Log de test avec correlation id.

### SS-F01-001 - Schéma SQL Server SoftSign, FILESTREAM et migrations

- Type : Feature Azure DevOps.
- Sprint : S01.
- Personas : Backend, DBA.
- Objectif : créer le modèle physique durable des documents et fichiers.
- Use case : En tant qu'application SoftSign, je veux stocker des documents volumineux de façon transactionnelle avec leurs métadonnées.

Fonctionnel :

- Stocker document principal, versions, annexes, certificat et PDF signé.
- Ne jamais écraser silencieusement un fichier signé.
- Conserver hash SHA-256, taille, type MIME, version, statut de traitement.

Technique :

- Créer schéma `softsign`.
- Créer `Documents`, `DocumentFiles`, `DocumentVersions`, `DocumentAnnexes`.
- `DocumentFiles.Content` en `VARBINARY(MAX) FILESTREAM` avec `ROWGUIDCOL`.
- Index sur statut, déposant, projet, site, type, dates, hash.
- Migrations SQL relues manuellement, pas uniquement générées.
- Repositories lecture/écriture via UnitOfWork.

Sous-tickets :

- Écrire DDL schéma et filegroup FILESTREAM.
- Mapper EF Core sans charger le contenu par défaut.
- Ajouter contraintes FK/unique/check.
- Ajouter seed minimal documents.
- Tester insert/stream/read/hash.

Critères d'acceptation :

- Given un PDF volumineux, When il est stocké, Then son contenu est en FILESTREAM et son hash est calculé.
- Given un document avec version signée, When une nouvelle version est créée, Then l'ancienne reste consultable.
- Given une liste de documents, When elle est chargée, Then le contenu binaire n'est pas chargé inutilement.

Tests/preuves :

- Tests intégration SQL.
- Plan d'exécution d'une liste sans lecture BLOB.
- Script backup/restore à préparer en S10.

### SS-F01-002 - Full-Text Search et texte OCR indexable

- Type : Feature Azure DevOps.
- Sprint : S01.
- Personas : Backend, DBA, QA.
- Objectif : rendre les documents recherchables par métadonnées et contenu extrait.
- Use case : En tant qu'utilisateur, je veux rechercher un document par référence, fournisseur, titre, type, montant ou texte présent dans le PDF.

Fonctionnel :

- Indexer référence, titre, type, projet, site, déposant, fournisseur, description.
- Indexer texte PDF natif et OCR par page.
- Gérer langue, score et surlignage si possible.
- Exclure les documents non autorisés.

Technique :

- Créer `DocumentSearchTexts` et catalogue Full-Text.
- Indexer `TextContent`, avec clé unique stable.
- Alimenter la table via jobs OCR/extraction.
- API de recherche paginée avec filtres structurés + FTS `CONTAINS`/`FREETEXT`.
- Prévoir recherche audit si nécessaire.

Sous-tickets :

- Créer catalog/index FTS.
- Mapper EF/Dapper pour requêtes FTS.
- Créer service `IDocumentSearchService`.
- Ajouter tests avec texte OCR.
- Ajouter métriques temps de recherche.

Critères d'acceptation :

- Given un document OCRisé contenant un mot, When l'utilisateur recherche ce mot, Then le document apparaît.
- Given un utilisateur sans accès au projet, When il recherche, Then les documents interdits ne sont pas retournés.
- Given aucun résultat, When la recherche est faite, Then l'API retourne une page vide et non une erreur.

Tests/preuves :

- Tests intégration FTS.
- Jeu de PDF OCR/natif.

### SS-F01-003 - Référentiels documentaires et paramètres structurants

- Type : Feature Azure DevOps.
- Sprint : S01.
- Personas : PO, Backend, Admin.
- Objectif : remplacer les paramètres mock par des référentiels robustes.
- Use case : En tant qu'administrateur, je veux configurer les types document, formats, références, projets/sites et politiques sans modifier le code.

Fonctionnel :

- Gérer types document : contrat, avenant, rapport, bon de commande, facture, devis, protocole, autre.
- Gérer formats autorisés par défaut et par projet/site.
- Gérer préfixe de référence, séquence, inclusion année/site/type.
- Gérer paramètres globaux non sensibles.

Technique :

- Ajouter `SoftSignDocumentType`, `SoftSignReferenceSequence`, `SoftSignAllowedFileFormat`, `SoftSignProjectRule`.
- Conserver `SoftSignGeneralSettings` pour paramètres simples, pas pour référentiels métiers.
- Prévoir validations uniqueness/activation.
- API CRUD admin + cache court.

Sous-tickets :

- Créer tables référentiels.
- Migrer les constantes de `softsignCore.js`.
- Créer service génération référence.
- Créer API settings.
- Ajouter seed V1.

Critères d'acceptation :

- Given un type document désactivé, When l'utilisateur dépose un document, Then ce type n'est pas proposé.
- Given une règle format projet/site, When l'utilisateur téléverse un fichier interdit, Then l'erreur est claire.
- Given la génération de référence, When deux dépôts simultanés sont créés, Then les références restent uniques.

Tests/preuves :

- Tests concurrence génération référence.
- Tests validation format.

### SS-F02-001 - Domaine document et invariants Clean Architecture

- Type : Feature Azure DevOps.
- Sprint : S02.
- Personas : Backend, Tech Lead.
- Objectif : transformer les entités en vrai domaine métier.
- Use case : En tant que système, je veux garantir que les documents changent de statut uniquement via des règles métier valides.

Fonctionnel :

- Créer brouillon, déposer, lancer workflow, recevoir externe, rejeter, signer, terminer, archiver, annuler.
- Gérer montants, devise, priorité, échéance.
- Empêcher signature d'un document rejeté ou archivé.
- Empêcher modification du contenu signé sans nouvelle version.

Technique :

- Ajouter Value Objects : référence, hash, money, file metadata.
- Ajouter méthodes domaine : `Deposit`, `StartWorkflow`, `Reject`, `Complete`, `Archive`.
- Ajouter Domain Events.
- Application Services orchestrent transactions et ports.
- Tests unitaires exhaustifs sur transitions.

Sous-tickets :

- Créer Value Objects.
- Ajouter invariants document.
- Ajouter Domain Events.
- Créer services applicatifs documents.
- Couvrir tests statuts.

Critères d'acceptation :

- Given un document archivé, When une action de signature est demandée, Then le domaine refuse.
- Given un document sans fichier principal, When le workflow est lancé, Then le domaine refuse.
- Given un document signé, When une correction fichier est faite, Then une nouvelle version est obligatoire.

Tests/preuves :

- Tests unitaires domaine.
- Tests mutation interdite.

### SS-F02-002 - Domaine workflow, conditions et délégations

- Type : Feature Azure DevOps.
- Sprint : S02.
- Personas : Backend, PO, Validateur.
- Objectif : fiabiliser le moteur de workflow.
- Use case : En tant que déposant, je veux que le bon workflow soit sélectionné automatiquement selon le document, puis que les étapes s'enchaînent correctement.

Fonctionnel :

- Sélection workflow selon type, montant, devise, projet, site, défaut.
- Support séquentiel et parallèle.
- Support révision, validation, paraphe, signature, archivage.
- Support délégation active selon période, action, type, projet/site.
- Support rejet avec motif obligatoire.

Technique :

- `WorkflowSelectionService`.
- `WorkflowHydrationService`.
- `WorkflowTransitionService`.
- `DelegationResolutionService`.
- `ReminderPolicyService`.
- Conditions typées avec opérateurs.
- Tests parallèles : prochaine étape activée seulement quand groupe terminé.

Sous-tickets :

- Implémenter sélection workflow.
- Implémenter hydratation étapes document.
- Implémenter transition validation/signature/rejet.
- Implémenter délégation.
- Ajouter tests unitaires cas parallèles.

Critères d'acceptation :

- Given un workflow parallèle, When un seul validateur termine, Then l'ordre suivant ne démarre pas.
- Given une délégation active, When l'étape est activée, Then le délégataire devient acteur effectif et l'audit garde le délégant.
- Given un rejet sans motif, When l'action est envoyée, Then elle est refusée.

Tests/preuves :

- Tests domaine workflow.
- Scénarios PO validés.

### SS-F02-003 - Sécurité applicative, permissions et audit

- Type : Feature Azure DevOps.
- Sprint : S02.
- Personas : Admin, Sécurité, Backend.
- Objectif : définir les règles d'accès et d'audit utilisées par toutes les Features.
- Use case : En tant qu'administrateur, je veux contrôler qui peut consulter, déposer, valider, signer, administrer et exporter.

Fonctionnel :

- Rôles : superadmin, admin, standard, readonly, validateur, signataire, fournisseur.
- Permissions par menu/action/projet/site.
- Accès document par déposant, acteur d'étape, délégation, administrateur, lecteur autorisé.
- Audit de toutes les actions sensibles.

Technique :

- Policies ASP.NET Core.
- `ICurrentUser`, `IAuthorizationService` applicatif.
- Table `RolePermissions` complétée par grants document si nécessaire.
- Audit via Application Services, pas dans controller.
- Logs sans OTP/token/secret.

Sous-tickets :

- Créer matrice permissions.
- Créer policies backend.
- Créer guards Angular.
- Créer audit trail service.
- Ajouter tests accès refusé.

Critères d'acceptation :

- Given un utilisateur readonly, When il tente de signer, Then l'action est refusée.
- Given un acteur d'étape, When il ouvre sa tâche, Then il peut agir.
- Given une action sensible, When elle réussit ou échoue, Then une entrée audit existe.

Tests/preuves :

- Tests API 401/403.
- Tests audit.

### SS-F03-001 - API document, upload résumable, preview et download

- Type : Feature Azure DevOps.
- Sprint : S03.
- Personas : Déposant, Validateur, Backend.
- Objectif : exposer des API robustes pour gros documents.
- Use case : En tant qu'utilisateur, je veux téléverser, prévisualiser et télécharger des documents sans timeout ni surcharge mémoire.

Fonctionnel :

- Upload PDF et annexes avec progression, reprise et annulation.
- Télécharger original, OCRisé, signé, certificat.
- Prévisualiser PDF par page ou streaming.
- Valider format/taille/hash.

Technique :

- `UploadSession` + chunks ou tusdotnet.
- Streaming vers FILESTREAM.
- Endpoints REST :
  - `POST /api/softsign/uploads`
  - `PATCH /api/softsign/uploads/{id}`
  - `POST /api/softsign/documents`
  - `GET /api/softsign/documents/{id}/files/{fileId}/content`
  - `GET /api/softsign/documents/{id}/preview`
- Headers `Range` si nécessaire.
- Antivirus/clamscan optionnel à cadrer si demandé.

Sous-tickets :

- Créer upload session.
- Écrire chunks et finalisation hash.
- Créer download streaming.
- Créer preview streaming.
- Tester gros fichiers.

Critères d'acceptation :

- Given un upload interrompu, When l'utilisateur reprend, Then seuls les chunks manquants sont envoyés.
- Given un fichier interdit, When upload est tenté, Then l'erreur est fonctionnelle.
- Given un PDF de grande taille, When preview est ouverte, Then l'API ne charge pas tout en mémoire.

Tests/preuves :

- Tests intégration upload/download.
- Mesure mémoire.

### SS-F03-002 - API listes, filtres, pagination et recherche

- Type : Feature Azure DevOps.
- Sprint : S03.
- Personas : Utilisateur, Validateur, Admin.
- Objectif : standardiser toutes les listes volumineuses.
- Use case : En tant qu'utilisateur, je veux filtrer et trier mes documents rapidement même avec beaucoup de données.

Fonctionnel :

- Listes : mes documents, externes, reçus, en cours, rejetés, archives, tous documents admin.
- Filtres : projet, site, type, statut, dates, expéditeur, validateur, retard, montant.
- Tri et pagination serveur.
- Export des résultats selon permissions.

Technique :

- Contrat commun `PagedQuery`, `Sort`, `Filter`.
- Projections DTO no-tracking.
- Dapper autorisé pour rapports/requêtes complexes.
- Index SQL alignés.
- API :
  - `GET /api/softsign/documents`
  - `GET /api/softsign/tasks/inbox`
  - `GET /api/softsign/documents/search`

Sous-tickets :

- Définir contrat query.
- Créer projections listes.
- Créer endpoints par module.
- Ajouter FTS.
- Ajouter tests performance requêtes.

Critères d'acceptation :

- Given 100 000 documents, When la première page est demandée, Then l'API répond dans le seuil défini.
- Given un filtre projet/site, When il est appliqué, Then seuls les documents autorisés sont retournés.
- Given un tri date décroissant, When la page 2 est demandée, Then l'ordre reste stable.

Tests/preuves :

- Tests intégration pagination.
- Plan d'index.

### SS-F03-003 - Jobs asynchrones, SignalR et notifications techniques

- Type : Feature Azure DevOps.
- Sprint : S03.
- Personas : Utilisateur, Backend, DevOps.
- Objectif : gérer les traitements longs sans bloquer l'utilisateur.
- Use case : En tant qu'utilisateur, je veux voir la progression OCR/signature/export et être notifié quand le traitement se termine.

Fonctionnel :

- Suivre progression OCR, signature PDF, certificat, export.
- Réessayer les jobs en erreur selon politique.
- Afficher statut pending/running/succeeded/failed.

Technique :

- `SoftSignProcessingJob`.
- Quartz.NET ou table jobs + hosted service.
- SignalR hub `SoftSignHub`.
- Notifications applicatives à la fin.
- Logs corrélés document/job.

Sous-tickets :

- Créer modèle job.
- Créer worker .NET.
- Créer SignalR hub.
- Brancher notifications.
- Tester retry/erreur.

Critères d'acceptation :

- Given un OCR lancé, When le job progresse, Then l'UI reçoit les événements SignalR.
- Given un job en erreur, When le retry max est atteint, Then le document affiche une erreur exploitable.
- Given un job terminé, When l'utilisateur revient sur le document, Then le statut est persistant.

Tests/preuves :

- Test worker.
- Test SignalR.

### SS-F04-001 - Service Python PDF/OCR

- Type : Feature Azure DevOps.
- Sprint : S04.
- Personas : Déposant, Backend, QA.
- Objectif : extraire du texte fiable pour recherche et préremplissage.
- Use case : En tant que déposant, je veux que SoftSign lise mon PDF pour préremplir les métadonnées et permettre la recherche plein texte.

Fonctionnel :

- Détecter PDF natif vs scanné.
- Extraire texte page par page.
- OCRiser PDF scanné.
- Retourner confiance, langue, erreurs.
- Persister texte indexable.

Technique :

- FastAPI interne.
- pypdf/PyMuPDF pour PDF natif.
- OCRmyPDF + Tesseract pour scans.
- Endpoints :
  - `POST /pdf/extract-text`
  - `POST /pdf/ocr`
  - `GET /health`
- Appel .NET via port `IPdfTextExtractionService`.
- Timeout, taille max, sandbox répertoire temporaire.

Sous-tickets :

- Créer worker FastAPI.
- Créer extraction texte natif.
- Créer OCR scan.
- Créer client .NET.
- Persister `DocumentSearchTexts`.
- Tester PDF natif/scanné/volumineux.

Critères d'acceptation :

- Given un PDF natif, When extraction est lancée, Then OCR n'est pas exécuté inutilement.
- Given un PDF scanné, When OCR réussit, Then le texte devient recherchable.
- Given un PDF illisible, When OCR échoue, Then l'erreur est tracée sans bloquer le document entier.

Tests/preuves :

- PDF natif et scan en jeu de test.
- Résultat indexé FTS.

### SS-F04-002 - Service Python signature PDF et certificat

- Type : Feature Azure DevOps.
- Sprint : S04.
- Personas : Signataire, Fournisseur externe, Sécurité.
- Objectif : appliquer une signature visible et générer une preuve exploitable.
- Use case : En tant que signataire, je veux voir ma signature sur le PDF et obtenir un certificat prouvant la signature.

Fonctionnel :

- Appliquer signature/paraphe visible sur zone PDF.
- Sceller la version signée.
- Générer certificat JSON/PDF avec QR payload.
- Capturer preuve : signataire, OTP, IP, user-agent, date, hash avant/après.

Technique :

- pyHanko pour signature PDF/PAdES selon niveau retenu.
- cryptography pour hash/preuve.
- reportlab ou équivalent libre pour certificat PDF si nécessaire.
- `SoftSignSignatureProof`.
- `SoftSignCertificate`.
- Version fichier `SignedPdf`.
- Endpoints worker :
  - `POST /pdf/sign`
  - `POST /certificate/render`
- Port .NET `IPdfSignatureService`.

Sous-tickets :

- Créer modèle preuve.
- Appliquer signature visible.
- Générer PDF signé.
- Générer certificat.
- Valider hash et QR.
- Tester signature interne/externe.

Critères d'acceptation :

- Given une zone de signature, When le signataire valide, Then le PDF signé contient la signature visible au bon endroit.
- Given le certificat généré, When le QR est lu, Then il renvoie une preuve vérifiable.
- Given un hash modifié, When la vérification est faite, Then la preuve est invalide.

Tests/preuves :

- PDF signé de test.
- Certificat PDF/JSON.
- Tests hash.

### SS-F05-001 - Fondation Angular SoftSign MFE et data-access

- Type : Feature Azure DevOps.
- Sprint : S05.
- Personas : Frontend, QA.
- Objectif : créer les briques Angular communes avant écrans métier.
- Use case : En tant que développeur frontend, je veux consommer les API SoftSign avec des facades typées et des composants réutilisables.

Fonctionnel :

- Navigation SoftSign équivalente à la maquette.
- Gestion loading/error/empty.
- Gestion permissions par route/menu.

Technique :

- Services HTTP typés.
- Facades : documents, workflows, signatures, notifications, admin.
- Store léger par feature avec signals.
- Interceptor erreurs ProblemDetails.
- Guards permissions.
- i18n préparée.

Sous-tickets :

- Créer modèles DTO.
- Créer facades data-access.
- Créer layout/navigation.
- Créer guards.
- Créer composants état.
- Tests unitaires composants/facades.

Critères d'acceptation :

- Given une erreur API ProblemDetails, When elle arrive au frontend, Then un message métier propre est affiché.
- Given un rôle sans permission, When il ouvre une route admin, Then il est redirigé/refusé.
- Given un composant, When il est inspecté, Then il est standalone, typé et OnPush.

Tests/preuves :

- Tests Angular.
- Lint NX.

### SS-F05-002 - Composants PDF, tables, signatures et exports frontend

- Type : Feature Azure DevOps.
- Sprint : S05.
- Personas : Utilisateur, Frontend.
- Objectif : fournir les composants transverses nécessaires aux écrans SoftSign.
- Use case : En tant qu'utilisateur, je veux visualiser un PDF, filtrer une table et placer une signature de façon fluide.

Fonctionnel :

- Viewer PDF page par page.
- Table serveur avec filtres, colonnes, pagination, tri.
- Signature pad texte/dessin/image.
- Overlay zones signature/paraphe.
- Boutons export CSV/XLSX/PDF selon permissions.

Technique :

- PDF.js.
- Angular CDK ou AG Grid Community si validé.
- signature_pad.
- Coordonnées PDF normalisées entre frontend et backend.
- Composants accessibles clavier.

Sous-tickets :

- Créer viewer PDF.
- Créer table serveur.
- Créer signature pad.
- Créer overlay zones.
- Créer export dropdown.
- Tests visuels Playwright.

Critères d'acceptation :

- Given un PDF multi-pages, When l'utilisateur change de page, Then le viewer reste fluide.
- Given une zone dessinée, When elle est envoyée au backend, Then les coordonnées sont reproductibles.
- Given une table filtrée, When l'utilisateur exporte, Then l'export respecte les filtres et permissions.

Tests/preuves :

- Tests Playwright desktop/mobile.
- Test coordonnée PDF.

### SS-F06-001 - Dépôt interne guidé

- Type : Feature Azure DevOps.
- Sprint : S06.
- Personas : Déposant interne.
- Objectif : livrer le premier parcours métier complet de dépôt.
- Use case : En tant que déposant interne, je veux déposer un document, compléter ses métadonnées, choisir le workflow et lancer le traitement.

Fonctionnel :

- Wizard : fichier, OCR, informations, annexes, workflow, zones, récapitulatif.
- Préremplissage via OCR.
- Validation formats, tailles, champs obligatoires.
- Choix type document et workflow suggéré.
- Placement zones signature/paraphe.
- Lancement workflow.

Technique :

- Angular route `ss-depot`.
- API upload + création document.
- Job OCR + SignalR.
- `WorkflowSelectionService`.
- Transaction : document + fichiers + versions + étapes + zones + audit + notification.

Sous-tickets :

- Créer écran wizard.
- Brancher upload résumable.
- Afficher progression OCR.
- Créer formulaire métadonnées.
- Gérer annexes.
- Suggérer workflow.
- Placer zones.
- Lancer workflow.

Critères d'acceptation :

- Given un PDF valide, When le déposant termine le wizard, Then le document est en cours avec première étape active.
- Given un OCR réussi, When les métadonnées sont détectées, Then elles préremplissent le formulaire mais restent modifiables.
- Given une signature requise sans zone, When le dépôt est confirmé, Then l'utilisateur doit placer une zone.

Tests/preuves :

- E2E dépôt complet.
- Capture wizard.

### SS-F06-002 - Dépôt fournisseur et réception des documents externes

- Type : Feature Azure DevOps.
- Sprint : S06.
- Personas : Fournisseur externe, Receveur interne.
- Objectif : refaire l'entrée collaborative fournisseur de la maquette.
- Use case : En tant que fournisseur, je veux déposer un document depuis le portail externe pour qu'il soit réceptionné et traité par SoftSign.

Fonctionnel :

- Portail fournisseur avec accès externe sécurisé.
- Dépôt fichier et métadonnées fournisseur.
- Suivi de statut.
- Réception interne des documents externes.
- Affectation projet/site/type.
- Lancement ou rattachement workflow fournisseur.

Technique :

- Routes publiques protégées par compte externe/session.
- `SoftSignExternalAccount`.
- `SoftSignExternalAccountDocument` à ajouter.
- API dépôt externe séparée des API internes.
- Documents créés avec `Origin = Externe` et statut `Received` ou `PendingProcessing`.
- Notifications receveurs.

Sous-tickets :

- Créer portail dépôt fournisseur.
- Créer API dépôt externe.
- Créer réception interne.
- Créer rattachement workflow.
- Créer suivi fournisseur.
- Tester permissions externe/interne.

Critères d'acceptation :

- Given un fournisseur approuvé, When il dépose une facture, Then un document externe apparaît dans SoftSign.
- Given un fournisseur suspendu, When il tente de déposer, Then l'accès est refusé.
- Given un receveur interne, When il valide la réception, Then le workflow fournisseur démarre.

Tests/preuves :

- E2E dépôt externe.
- Test accès fournisseur.

### SS-F06-003 - Notifications de démarrage workflow

- Type : Feature Azure DevOps.
- Sprint : S06.
- Personas : Validateur, Signataire, Déposant.
- Objectif : prévenir les bons acteurs dès qu'une étape démarre.
- Use case : En tant qu'acteur de workflow, je veux être notifié lorsqu'un document attend mon action.

Fonctionnel :

- Notification interne.
- Email optionnel.
- Lien direct vers la tâche.
- Historique notification.
- Gestion erreur envoi email.

Technique :

- `SoftSignNotification`.
- `SoftSignEmailOutbox`.
- `SoftSignEmailTemplate`.
- Application Event Handler après `StepActivated`.
- SignalR notification.
- Email worker avec retry.

Sous-tickets :

- Créer event step activated.
- Générer notification interne.
- Générer outbox email.
- Brancher SignalR.
- Tester lien direct.

Critères d'acceptation :

- Given une première étape active, When workflow démarre, Then chaque acteur reçoit une notification.
- Given un email échoué, When le worker réessaie, Then l'erreur est historisée sans rollback métier.
- Given une notification lue, When elle est marquée, Then elle ne compte plus dans les non lues.

Tests/preuves :

- Test event/notification.
- Email dev capturé.

### SS-F07-001 - Dashboard SoftSign

- Type : Feature Azure DevOps.
- Sprint : S07.
- Personas : Utilisateur, Admin, Validateur.
- Objectif : refaire le tableau de bord de pilotage.
- Use case : En tant qu'utilisateur SoftSign, je veux voir mes indicateurs, alertes et actions prioritaires dès l'ouverture.

Fonctionnel :

- KPI : total, en cours, reçus, à traiter, rejetés, signés, archivés, externes.
- Alertes retard et urgences.
- Documents récents.
- Actions rapides : nouveau dépôt, boîte de réception, rapports, paramètres selon rôle.
- Différence vue admin/vue standard.

Technique :

- API `GET /api/softsign/dashboard`.
- Projections SQL optimisées.
- Cache court si nécessaire.
- Angular dashboard avec composants KPI.
- Permissions sur raccourcis.

Sous-tickets :

- Créer requêtes KPI.
- Créer endpoint dashboard.
- Créer écran Angular.
- Ajouter alertes retard.
- Tester rôles.

Critères d'acceptation :

- Given un utilisateur standard, When il ouvre dashboard, Then il ne voit que ses documents/actions.
- Given un admin, When il ouvre dashboard, Then il voit l'activité globale autorisée.
- Given un document en retard, When dashboard s'affiche, Then l'alerte est visible.

Tests/preuves :

- Tests API dashboard.
- Capture admin/standard.

### SS-F07-002 - Listes documents opérationnelles

- Type : Feature Azure DevOps.
- Sprint : S07.
- Personas : Déposant, Validateur, Admin.
- Objectif : refaire les listes de documents de la sidebar.
- Use case : En tant qu'utilisateur, je veux retrouver mes documents selon leur situation.

Fonctionnel :

- Mes documents.
- Documents externes.
- Documents reçus.
- Documents en cours.
- Documents rejetés.
- Documents archivés.
- Colonnes spécifiques par module.
- Filtres, tri, pagination, export.

Technique :

- Utiliser contrat liste commun S03.
- Angular `UnifiedDocModule` refondu.
- Colonnes configurables typées.
- Permissions par liste.
- États vide/erreur/loading.

Sous-tickets :

- Créer liste mes documents.
- Créer liste externes.
- Créer liste reçus/inbox.
- Créer liste en cours.
- Créer liste rejetés.
- Créer liste archives.
- Ajouter exports.

Critères d'acceptation :

- Given une liste reçus, When l'utilisateur l'ouvre, Then seuls les documents avec action active autorisée apparaissent.
- Given une liste archives, When un document terminé existe, Then le certificat est accessible.
- Given une recherche dans la liste, When le filtre est appliqué, Then la pagination reste côté serveur.

Tests/preuves :

- Tests API listes.
- Tests Angular filtres.

### SS-F07-003 - Détail document, onglets et timeline

- Type : Feature Azure DevOps.
- Sprint : S07.
- Personas : Tous utilisateurs autorisés.
- Objectif : fournir une vue complète du document.
- Use case : En tant qu'utilisateur autorisé, je veux comprendre l'état d'un document, ses fichiers, son workflow, son historique et ses actions possibles.

Fonctionnel :

- Onglet informations.
- Onglet documents/annexes/versions.
- Onglet workflow.
- Onglet historique/audit/relances/signatures.
- Onglet action demandée si l'utilisateur peut agir.
- Preview PDF.

Technique :

- API détail document projetée.
- Séparation DTO : résumé, fichiers, workflow, audit, action.
- Streaming PDF.
- Angular tabs lazy.
- Contrôle accès document.

Sous-tickets :

- Créer endpoint détail.
- Créer composant tabs.
- Créer timeline workflow.
- Créer historique audit.
- Créer preview fichiers.
- Brancher action possible.

Critères d'acceptation :

- Given un document avec versions, When l'utilisateur ouvre l'onglet fichiers, Then chaque version est listée sans charger le binaire.
- Given une délégation appliquée, When timeline est affichée, Then délégant et délégataire sont visibles.
- Given un utilisateur non autorisé, When il demande le détail, Then l'accès est refusé.

Tests/preuves :

- Tests API détail.
- E2E ouverture détail.

### SS-F07-004 - Validation, rejet, paraphe et signature interne OTP

- Type : Feature Azure DevOps.
- Sprint : S07.
- Personas : Validateur, Signataire.
- Objectif : permettre le traitement interne des documents.
- Use case : En tant que validateur/signataire, je veux approuver, rejeter, parapher ou signer un document en respectant le workflow et l'OTP si requis.

Fonctionnel :

- Validation avec commentaire.
- Rejet avec motif obligatoire.
- Paraphe/signature texte, dessin, image ou profil enregistré.
- OTP interne si étape configurée.
- Avancement workflow.
- Audit et notification suivante.

Technique :

- Commands Application : `ValidateStep`, `RejectStep`, `SignStep`.
- FluentValidation.
- OTP challenge hashé.
- Appel Python signature PDF si action visible.
- `SoftSignDocumentAction`, `SignatureProof`, `Certificate` si final.
- Transaction UnitOfWork.

Sous-tickets :

- Créer API validation.
- Créer API rejet.
- Créer OTP interne.
- Créer signature/paraphe.
- Avancer workflow.
- Ajouter audit/notifications.
- E2E scénarios critiques.

Critères d'acceptation :

- Given une étape validation active, When l'acteur valide, Then l'étape passe done et la suivante s'active.
- Given une étape signature OTP, When OTP invalide est saisi, Then la signature est refusée et tentative auditée.
- Given un rejet, When le motif est enregistré, Then le document passe rejeté et le déposant est notifié.

Tests/preuves :

- Tests domaine transition.
- Tests API OTP.
- E2E validation/rejet/signature.

### SS-F07-005 - Recherche avancée documentaire

- Type : Feature Azure DevOps.
- Sprint : S07.
- Personas : Utilisateur, Admin, Auditeur.
- Objectif : refaire la recherche avancée de la maquette avec Full-Text Search.
- Use case : En tant qu'utilisateur, je veux retrouver rapidement un document avec des critères combinés et du texte OCR.

Fonctionnel :

- Recherche texte libre.
- Filtres : statut, type, projet, site, expéditeur, validateur, dates, montant, origine.
- Sauvegarde recherche si retenue.
- Résultats paginés/exportables.
- Accès respectant les permissions.

Technique :

- API FTS S01/S03.
- Angular panneau recherche avancée.
- Score/ranking si possible.
- `SoftSignSavedSearch` optionnel.
- Index SQL et projections optimisées.

Sous-tickets :

- Créer endpoint search.
- Créer UI recherche avancée.
- Brancher FTS.
- Ajouter filtres.
- Ajouter sauvegarde recherche optionnelle.
- Tests performance.

Critères d'acceptation :

- Given un texte OCR, When il est recherché, Then le document apparaît avec métadonnées.
- Given des filtres combinés, When ils sont appliqués, Then le total et la page sont cohérents.
- Given un utilisateur non autorisé, When il recherche, Then aucun document interdit n'apparaît.

Tests/preuves :

- Tests FTS.
- Capture recherche.

### SS-F08-001 - Demande de signature externe

- Type : Feature Azure DevOps.
- Sprint : S08.
- Personas : Signataire interne, Fournisseur/tiers externe.
- Objectif : créer une demande de signature à un tiers.
- Use case : En tant que signataire interne, je veux envoyer un document à un tiers externe avec un lien sécurisé et une zone de signature.

Fonctionnel :

- Choisir document, signataire externe, email/téléphone, message, expiration.
- Choisir zone signature.
- Générer lien sécurisé.
- Envoyer email.
- Suivre statut : pending, opened, OTP sent, OTP verified, signed, expired, cancelled.

Technique :

- `SoftSignExternalSignatureRequest`.
- Token généré une seule fois, stocké hashé/salé.
- Email outbox.
- Audit action.
- API :
  - `POST /api/softsign/documents/{id}/external-signature-requests`
  - `GET /api/softsign/external-signature-requests`

Sous-tickets :

- Créer commande demande externe.
- Générer token sécurisé.
- Envoyer email.
- Créer suivi statut.
- Ajouter annulation/expiration.

Critères d'acceptation :

- Given une demande créée, When elle est enregistrée, Then le token brut n'est pas stocké.
- Given une demande expirée, When le tiers ouvre le lien, Then une page expirée est affichée.
- Given une demande annulée, When le lien est ouvert, Then aucune signature n'est possible.

Tests/preuves :

- Tests token hash.
- Email dev.

### SS-F08-002 - Portail public de signature externe avec OTP

- Type : Feature Azure DevOps.
- Sprint : S08.
- Personas : Tiers externe.
- Objectif : refaire le portail signature externe OTP.
- Use case : En tant que tiers externe, je veux ouvrir un lien sécurisé, vérifier mon identité par OTP et signer le document.

Fonctionnel :

- Page lien valide/expiré/annulé/déjà signé.
- Affichage PDF.
- Consentement signature.
- Envoi OTP email/SMS selon canaux disponibles.
- Vérification OTP avec TTL/tentatives/verrouillage.
- Signature visible via pad.
- Confirmation et reçu.

Technique :

- Route Angular publique séparée.
- API publique limitée par token.
- OTP hashé, jamais loggé.
- Rate limiting.
- Capturer IP/user-agent.
- Appel signature PDF Python.
- Audit externe.

Sous-tickets :

- Créer guard token public.
- Créer écran OTP.
- Créer vérification OTP.
- Créer signature pad externe.
- Appliquer signature PDF.
- Créer reçu.
- E2E signature externe.

Critères d'acceptation :

- Given un lien valide, When le tiers ouvre, Then le document est visible après contrôles autorisés.
- Given trois OTP invalides, When le tiers réessaie, Then la demande est verrouillée selon politique.
- Given OTP validé et signature confirmée, When le PDF est généré, Then la demande passe signée.

Tests/preuves :

- E2E lien -> OTP -> signature -> certificat.
- Tests brute force OTP.

### SS-F08-003 - Certificat, archivage et réintégration workflow

- Type : Feature Azure DevOps.
- Sprint : S08.
- Personas : Déposant, Signataire, Auditeur.
- Objectif : finaliser la preuve de signature et réintégrer le document dans le workflow.
- Use case : En tant que déposant, je veux obtenir un document signé, un certificat et voir le workflow continuer ou se terminer.

Fonctionnel :

- Générer certificat à la signature finale.
- QR payload vérifiable.
- Version signée du document.
- Archivage automatique si workflow terminé.
- Notification déposant/acteurs.
- Consultation depuis archives/certificats.

Technique :

- `CertificatePolicyService`.
- `SoftSignCertificate`.
- `SoftSignSignatureProof`.
- `DocumentVersionType.Signed`.
- Job certificat.
- Intégration transition workflow après signature externe.

Sous-tickets :

- Générer preuve JSON.
- Générer certificat PDF.
- Créer version signée.
- Finaliser workflow.
- Afficher certificat dans UI.
- Tester hash/QR.

Critères d'acceptation :

- Given une signature externe terminée, When le workflow attend cette action, Then l'étape est terminée.
- Given toutes les étapes terminées, When le certificat est émis, Then le document passe terminé/archivable.
- Given le certificat téléchargé, When son QR est vérifié, Then il correspond au document signé.

Tests/preuves :

- PDF signé + certificat.
- Tests intégration workflow.

### SS-F08-004 - Boîte de réception signatures externes

- Type : Feature Azure DevOps.
- Sprint : S08.
- Personas : Administrateur signature, Signataire interne.
- Objectif : suivre les demandes de signature externe.
- Use case : En tant qu'utilisateur interne, je veux voir les demandes externes en attente, relancées, signées ou expirées.

Fonctionnel :

- Liste demandes externes.
- Filtres par statut, document, signataire, date expiration.
- Relance manuelle.
- Annulation.
- Réactivation si autorisée.
- Consultation actions : lien ouvert, OTP envoyé, OTP échoué, signé.

Technique :

- API `ExternalSignatureRequests`.
- `SoftSignExternalSignatureAction`.
- Email outbox pour relances.
- Audit.
- Permissions spécifiques.

Sous-tickets :

- Créer liste mailbox.
- Créer relance.
- Créer annulation.
- Créer réactivation.
- Créer détail actions.
- Tests permissions.

Critères d'acceptation :

- Given une demande expirée, When l'utilisateur la réactive, Then un nouveau lien/token est généré et l'ancien reste invalide.
- Given une relance envoyée, When l'historique est consulté, Then l'action est visible.
- Given un utilisateur non autorisé, When il ouvre mailbox, Then accès refusé.

Tests/preuves :

- Tests API demande externe.
- Capture mailbox.

### SS-F09-001 - Administration utilisateurs et rôles

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Administrateur.
- Objectif : refaire la gestion utilisateurs et autorisations.
- Use case : En tant qu'administrateur, je veux gérer les utilisateurs, leurs rôles, leurs permissions et leur capacité à recevoir/traiter des documents.

Fonctionnel :

- Liste utilisateurs.
- Création/modification utilisateur.
- Rôle système et rôle SoftSign.
- Receveur documents externes.
- Activation/suspension.
- Matrice permissions menus/actions/projet/site.

Technique :

- Intégrer Identity existante si présente.
- Sinon créer contrats avec module utilisateur.
- `SoftSignRolePermission`.
- Guards Angular + policies API.
- Audit admin.

Sous-tickets :

- Créer API utilisateurs SoftSign.
- Créer liste utilisateurs.
- Créer formulaire nouvel utilisateur.
- Créer matrice permissions.
- Créer tests accès.

Critères d'acceptation :

- Given un rôle standard sans admin, When il ouvre paramètres, Then le menu est invisible ou refusé.
- Given un receveur documents activé, When un fournisseur dépose, Then il peut recevoir la notification.
- Given une permission modifiée, When l'utilisateur se reconnecte, Then l'accès reflète la nouvelle matrice.

Tests/preuves :

- Tests permissions.
- Capture administration.

### SS-F09-002 - Administration workflows

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Administrateur, PO.
- Objectif : rendre les workflows configurables sans développeur.
- Use case : En tant qu'administrateur, je veux créer et activer des workflows adaptés aux types de documents.

Fonctionnel :

- Liste workflows.
- Création/édition workflow.
- Étapes : ordre, libellé, action, acteur, rôle, parallèle/séquentiel, OTP, signature externe, délai.
- Conditions : type, montant, devise, projet, site.
- Versioning et activation.
- Interdiction de casser documents actifs.

Technique :

- `WorkflowModel`, `WorkflowStepModel`, `WorkflowCondition`.
- Version immutable lorsqu'un workflow est utilisé.
- Validation cycles/ordres/groupes parallèles.
- API admin.
- UI éditeur avec preview graphique.

Sous-tickets :

- Créer CRUD workflows.
- Créer éditeur étapes.
- Créer conditions.
- Créer versioning.
- Créer activation.
- Créer preview.
- Tests sélection workflow.

Critères d'acceptation :

- Given un workflow utilisé, When l'admin le modifie, Then une nouvelle version est créée.
- Given une étape signature sans zone requise configurée, When workflow est utilisé, Then le dépôt demande une zone.
- Given conditions contradictoires, When sauvegarde est faite, Then l'erreur est claire.

Tests/preuves :

- Tests admin workflow.
- Capture éditeur.

### SS-F09-003 - Administration signatures et paraphes

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Signataire, Administrateur.
- Objectif : gérer les profils de signature.
- Use case : En tant que signataire, je veux enregistrer une signature ou un paraphe réutilisable.

Fonctionnel :

- Types : signature, paraphe, visa/cachet.
- Modes : texte, dessin, image.
- Signature par défaut.
- Activation/désactivation.
- Aperçu.
- Historique dernière utilisation.

Technique :

- `SoftSignSignatureProfile`.
- Stockage image en `DocumentFile` ou table fichier dédiée.
- Hash signature.
- Validation taille/type image.
- Audit création/modification.

Sous-tickets :

- Créer API profils.
- Créer UI liste.
- Créer éditeur texte/dessin/image.
- Gérer défaut unique.
- Brancher action signature.

Critères d'acceptation :

- Given plusieurs profils actifs, When l'utilisateur marque un profil par défaut, Then les autres ne sont plus par défaut.
- Given une image trop grande, When upload est tenté, Then l'erreur est claire.
- Given une signature utilisée, When l'action est validée, Then le profil est référencé dans la preuve.

Tests/preuves :

- Tests API profils.
- Capture aperçu.

### SS-F09-004 - Délégations

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Validateur, Signataire, Admin.
- Objectif : refaire la gestion des délégations.
- Use case : En tant qu'utilisateur, je veux déléguer mes validations/signatures pendant une période contrôlée.

Fonctionnel :

- Créer/modifier/supprimer délégation.
- Période début/fin.
- Actions déléguées.
- Types document, workflows, projet/site.
- Activer/désactiver.
- Audit et notification.

Technique :

- `SoftSignDelegation`.
- Ajouter table actions ou JSON validé.
- `DelegationResolutionService`.
- Interdire délégations circulaires si nécessaire.
- Tests application étape.

Sous-tickets :

- Créer API délégations.
- Créer UI CRUD.
- Brancher résolution workflow.
- Ajouter audit.
- Ajouter tests collisions.

Critères d'acceptation :

- Given une délégation active, When une étape correspondante est activée, Then elle est assignée au délégataire.
- Given une délégation expirée, When une nouvelle étape démarre, Then elle ne s'applique pas.
- Given une action effectuée par délégation, When l'audit est consulté, Then délégant et délégataire sont visibles.

Tests/preuves :

- Tests domaine délégation.
- Capture écran.

### SS-F09-005 - Validation des comptes fournisseurs

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Admin portail, Fournisseur externe.
- Objectif : administrer les comptes externes.
- Use case : En tant qu'administrateur, je veux approuver, rejeter ou suspendre les fournisseurs qui utilisent le portail.

Fonctionnel :

- Liste comptes externes.
- Statuts : pending, approved, rejected, suspended.
- Données : raison sociale, contact, email, téléphone, NIF/STAT, secteur, projet/site.
- Pièces justificatives.
- Décision avec motif.
- Notification décision.

Technique :

- `SoftSignExternalAccount`.
- Ajouter `SoftSignExternalAccountDocument`.
- Policies admin.
- Email outbox.
- Audit sécurité.

Sous-tickets :

- Créer API comptes externes.
- Créer liste admin.
- Créer écran décision.
- Gérer pièces.
- Notifier fournisseur.
- Tester accès dépôt.

Critères d'acceptation :

- Given un compte pending, When admin approuve, Then le fournisseur peut déposer.
- Given un compte rejeté avec motif, When fournisseur consulte, Then le motif public est visible.
- Given un compte suspendu, When dépôt est tenté, Then l'accès est refusé.

Tests/preuves :

- Tests statuts fournisseur.
- Capture validation.

### SS-F09-006 - Paramétrage OTP

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Admin sécurité.
- Objectif : configurer les règles OTP.
- Use case : En tant qu'administrateur, je veux définir la politique OTP des signatures internes et externes.

Fonctionnel :

- Activer/désactiver OTP par usage.
- Longueur code.
- Type numérique/alphanumérique.
- TTL.
- Tentatives max.
- Générations max.
- Canaux email/SMS.
- Activation par étape workflow.

Technique :

- `SoftSignOtpPolicy` à ajouter ou settings structurés.
- `SoftSignOtpChallenge`.
- Génération cryptographiquement sûre.
- Hash + salt.
- Rate limit.
- Ne jamais logguer code/token.

Sous-tickets :

- Créer modèle policy.
- Créer API settings OTP.
- Créer UI OTP.
- Brancher workflow step.
- Tests sécurité OTP.

Critères d'acceptation :

- Given TTL 5 minutes, When l'OTP dépasse ce délai, Then il est expiré.
- Given max tentatives atteint, When un nouvel essai arrive, Then le challenge est verrouillé.
- Given logs applicatifs, When OTP est généré, Then le code brut n'apparaît jamais.

Tests/preuves :

- Tests sécurité OTP.
- Revue logs.

### SS-F09-007 - Notifications, relances et modèles emails

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Admin, Validateur, Déposant.
- Objectif : rendre les alertes et emails configurables.
- Use case : En tant qu'administrateur, je veux configurer les notifications et relances pour réduire les retards de validation.

Fonctionnel :

- Centre notifications : lu/non lu, cible, navigation.
- Relances automatiques : seuil, fréquence, max, lien direct.
- Relance manuelle depuis document.
- Modèles emails avec variables.
- Prévisualisation email.
- Historique envoi/erreur.

Technique :

- `SoftSignNotification`.
- `SoftSignReminder`.
- `SoftSignEmailTemplate`.
- Ajouter outbox/delivery.
- Quartz.NET.
- Templates versionnés.
- Variables validées.

Sous-tickets :

- Créer centre notifications.
- Créer API relances.
- Créer scheduler relances.
- Créer modèles emails.
- Créer prévisualisation.
- Créer outbox retry.

Critères d'acceptation :

- Given une étape proche échéance, When le scheduler passe, Then une relance est créée selon politique.
- Given un modèle email modifié, When une notification est envoyée, Then elle utilise la version active.
- Given une variable inconnue, When modèle est sauvegardé, Then l'admin est averti.

Tests/preuves :

- Tests scheduler.
- Email preview.

### SS-F09-008 - Paramètres généraux, références, formats et personnalisation

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Admin.
- Objectif : refaire les paramètres généraux et personnalisation application.
- Use case : En tant qu'administrateur, je veux adapter SoftSign aux règles documentaires et à l'identité visuelle de l'organisation.

Fonctionnel :

- Préfixe référence, séparateur, année, site, séquence.
- Site par défaut.
- Types document actifs.
- Formats autorisés.
- Règles format par projet/site.
- Logo, thème, couleurs.

Technique :

- APIs settings structurés.
- Stockage logo fichier.
- Validation séquence concurrente.
- Éviter settings libres pour données critiques.
- Angular admin settings.

Sous-tickets :

- Créer API paramètres généraux.
- Créer UI références.
- Créer UI formats/types.
- Créer UI personnalisation.
- Tester génération référence.

Critères d'acceptation :

- Given un changement de préfixe, When un nouveau document est déposé, Then sa référence suit le nouveau format.
- Given un format interdit, When upload est tenté, Then il est refusé avant lancement workflow.
- Given un logo personnalisé, When l'utilisateur recharge l'app, Then le logo reste appliqué.

Tests/preuves :

- Tests settings.
- Capture personnalisation.

### SS-F09-009 - Licences, quotas et journaux système

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Admin, Exploitation.
- Objectif : refaire la partie licence/quotas/journaux de la maquette.
- Use case : En tant qu'administrateur, je veux suivre les limites d'usage et consulter les événements système.

Fonctionnel :

- Licence active, titulaire, période.
- Quotas utilisateurs, comptes externes, documents mensuels, signatures externes, stockage.
- Alertes quota.
- Journal système filtrable.

Technique :

- `SoftSignLicense`.
- Ajouter `SoftSignLicenseUsage` pour compteurs.
- `SoftSignAuditEntry`.
- Jobs mensuels reset compteur si besoin.
- API admin seulement.

Sous-tickets :

- Créer usage quotas.
- Créer UI licence.
- Créer alertes quota.
- Créer journal système.
- Ajouter exports.

Critères d'acceptation :

- Given quota document atteint, When un dépôt est tenté, Then la politique bloque ou alerte selon configuration.
- Given un admin, When il filtre le journal, Then les événements pertinents apparaissent.
- Given un utilisateur standard, When il tente d'ouvrir licence, Then accès refusé.

Tests/preuves :

- Tests quotas.
- Capture journal.

### SS-F09-010 - Intégration SoftDocs/GED

- Type : Feature Azure DevOps.
- Sprint : S09.
- Personas : Archiviste, Déposant, Admin.
- Objectif : rattacher les documents signés dans la GED.
- Use case : En tant qu'utilisateur GED, je veux retrouver le document signé SoftSign et son certificat dans le dossier documentaire.

Fonctionnel :

- Lier document SoftSign à document/dossier SoftDocs.
- Rattacher PDF signé et certificat.
- Conserver audit de rattachement.
- Indiquer statut SoftSign dans SoftDocs si contrat disponible.

Technique :

- `SoftSignSoftDocsLink`.
- Port Application `ISoftDocsIntegrationService`.
- Adapter Infrastructure vers module SoftDocs.
- Gestion erreurs sans perte document.
- Event `CertificateIssued` déclenche rattachement optionnel.

Sous-tickets :

- Définir contrat SoftDocs.
- Créer table lien.
- Créer API rattachement.
- Créer UI intégration.
- Tester idempotence.

Critères d'acceptation :

- Given un document terminé, When il est rattaché à SoftDocs, Then le lien et le certificat sont visibles.
- Given une erreur SoftDocs, When rattachement échoue, Then SoftSign conserve le certificat et permet retry.
- Given un rattachement déjà fait, When retry est lancé, Then il reste idempotent.

Tests/preuves :

- Tests intégration mock SoftDocs.
- Capture rattachement.

### SS-F10-001 - Reporting par validateur et expéditeur

- Type : Feature Azure DevOps.
- Sprint : S10.
- Personas : Manager, Admin, PO.
- Objectif : refaire les rapports de situation.
- Use case : En tant que manager, je veux suivre la charge et les retards par validateur et par expéditeur.

Fonctionnel :

- Situation par validateur : total, en cours, validés, rejetés, retard, délai moyen, détail.
- Situation par expéditeur : déposés, en cours, terminés, rejetés, délai prévu/réel.
- Recherche/filtre période/projet/site.
- Drill-down détail documents.
- Export CSV/XLSX/PDF.

Technique :

- Requêtes Dapper/projections SQL.
- Index sur étapes, acteur, dates, statuts.
- API rapports paginée.
- Exports async si volumineux.
- Angular tableaux et modales détail.

Sous-tickets :

- Créer rapport validateur API.
- Créer rapport expéditeur API.
- Créer UI rapports.
- Ajouter drill-down.
- Ajouter exports.
- Tests performance.

Critères d'acceptation :

- Given un validateur avec documents en retard, When rapport est ouvert, Then retard et détails sont exacts.
- Given une période filtrée, When export est lancé, Then seules les lignes filtrées sont exportées.
- Given un gros volume, When rapport est paginé, Then l'UI reste fluide.

Tests/preuves :

- Tests calculs.
- Export de recette.

### SS-F10-002 - Audit global, certificats et exports

- Type : Feature Azure DevOps.
- Sprint : S10.
- Personas : Auditeur, Admin, Déposant.
- Objectif : rendre l'audit et les preuves exploitables.
- Use case : En tant qu'auditeur, je veux consulter les actions sensibles et télécharger les certificats.

Fonctionnel :

- Journal global filtrable.
- Journal par document.
- Liste certificats.
- Téléchargement certificat PDF.
- Export audit.
- Masquage secrets.

Technique :

- `SoftSignAuditEntry`.
- API audit paginée et filtrée.
- FTS audit optionnelle.
- Export jobs.
- Politique rétention.
- Audit immuable applicativement.

Sous-tickets :

- Créer API audit global.
- Créer UI audit.
- Créer liste certificats.
- Créer export audit.
- Ajouter rétention.
- Tests masquage secrets.

Critères d'acceptation :

- Given une signature OTP, When l'audit est consulté, Then la preuve existe sans code OTP brut.
- Given un certificat, When il est téléchargé, Then il correspond au hash du document signé.
- Given un filtre utilisateur/date/action, When appliqué, Then le résultat est cohérent.

Tests/preuves :

- Tests audit.
- Certificat de recette.

### SS-F10-003 - Performance gros PDF et tables volumineuses

- Type : Feature Azure DevOps.
- Sprint : S10.
- Personas : QA, DBA, Tech Lead.
- Objectif : stabiliser la V1 sur des volumes réalistes.
- Use case : En tant qu'équipe projet, je veux prouver que SoftSign tient les gros documents et les listes volumineuses.

Fonctionnel :

- Dépôt PDF volumineux.
- Preview sans blocage.
- Recherche sur texte OCR.
- Listes 100k/1M lignes selon cible.
- Dashboard et rapports acceptables.

Technique :

- Scripts de génération données.
- Mesures temps réponse, CPU, mémoire.
- Index SQL finaux.
- Profiling requêtes lentes.
- Optimisation projections.

Sous-tickets :

- Créer jeu volumétrique.
- Tester upload/download gros PDF.
- Tester listes.
- Tester FTS.
- Optimiser index.
- Produire rapport performance.

Critères d'acceptation :

- Given un PDF volumineux cible, When upload/preview/download est testé, Then les seuils validés sont respectés.
- Given 100k documents, When liste paginée est ouverte, Then l'API répond dans le seuil.
- Given une requête lente, When elle est optimisée, Then le plan d'exécution justifie le gain.

Tests/preuves :

- Rapport performance.
- Plans SQL.

### SS-F10-004 - Sécurité, OTP, tokens et permissions

- Type : Feature Azure DevOps.
- Sprint : S10.
- Personas : Sécurité, QA, Tech Lead.
- Objectif : sécuriser les parcours sensibles avant recette finale.
- Use case : En tant que responsable sécurité, je veux vérifier que les documents, OTP, tokens et signatures ne peuvent pas être détournés.

Fonctionnel :

- Accès refusé document non autorisé.
- Token externe expiré/annulé/réutilisé.
- OTP brute force.
- Logs sans secrets.
- Rôles et permissions cohérents.
- Actions sensibles auditées.

Technique :

- Tests intégration sécurité.
- Rate limiting.
- Hash token/OTP.
- Headers sécurité.
- Vérification CORS routes publiques.
- Scan dépendances si outil disponible.

Sous-tickets :

- Tests permissions documents.
- Tests token externe.
- Tests OTP brute force.
- Tests logs secrets.
- Tests admin routes.
- Rapport sécurité.

Critères d'acceptation :

- Given un token externe signé, When il est réutilisé, Then la signature n'est plus possible.
- Given un OTP brut, When logs sont inspectés, Then il n'apparaît jamais.
- Given un utilisateur sans projet, When il force l'ID document, Then accès refusé.

Tests/preuves :

- Suite sécurité verte.
- Rapport risques résiduels.

### SS-F10-005 - Exploitation, backup/restore, observabilité et package recette

- Type : Feature Azure DevOps.
- Sprint : S10.
- Personas : DevOps, DBA, QA, PO.
- Objectif : livrer une V1 démontrable et exploitable.
- Use case : En tant qu'équipe exploitation, je veux savoir sauvegarder, restaurer, superviser et diagnostiquer SoftSign.

Fonctionnel :

- Package recette V1.
- Jeu de démonstration.
- Procédure backup/restore documents FILESTREAM.
- Dashboard observabilité.
- Procédure incidents OCR/signature/email.
- Checklist accessibilité/responsive.

Technique :

- Runbook SQL backup base + FILESTREAM + certificats.
- Health checks API/SQL/Python.
- Logs/traces/métriques OpenTelemetry.
- Dashboards erreurs upload/OCR/signature/email.
- Playwright recette.

Sous-tickets :

- Créer runbook backup/restore.
- Créer dashboards observabilité.
- Créer jeu demo.
- Créer plan recette.
- Corriger accessibilité/responsive.
- Préparer release candidate.

Critères d'acceptation :

- Given une sauvegarde, When elle est restaurée sur environnement test, Then documents et certificats sont lisibles.
- Given Python worker indisponible, When health est consulté, Then l'incident est visible.
- Given la recette V1, When le PO déroule les parcours, Then dépôt, validation, signature externe et rapports sont démontrables.

Tests/preuves :

- Test restore.
- Rapport recette.
- Captures finales.

## Ordre recommandé de création des tickets Azure DevOps

1. Créer les Epics : `Fondations`, `Données`, `Domaine`, `API`, `Python OCR/PDF/Signature`, `Angular MFE`, `Parcours métier`, `Administration`, `Reporting et livraison`.
2. Créer les Features `SS-Fxx-xxx` de ce README.
3. Transformer chaque "Sous-ticket" en User Story ou Task de 0,5 à 1 jour.
4. Ajouter les critères d'acceptation dans chaque Feature et les tests/preuves dans chaque User Story.
5. Lier chaque ticket aux captures maquette ou preuves documentaires.

## Matrice minimale Feature -> entités

| Feature | Entités existantes | Entités à ajouter fortement recommandées |
|---|---|---|
| Dépôt interne/externe | `SoftSignDocument`, `DocumentFile`, `DocumentAnnex`, `DocumentVersion` | `UploadSession`, `UploadChunk`, `DocumentType`, `ReferenceSequence` |
| OCR/recherche | `DocumentSearchText`, `DocumentFile` | `ProcessingJob`, `OcrResult`, `PdfPageInfo` |
| Workflow | `WorkflowModel`, `WorkflowStepModel`, `WorkflowCondition`, `DocumentWorkflowStep` | Domain Events, Value Objects conditions |
| Actions internes | `DocumentAction`, `OtpChallenge`, `SignatureZone`, `SignatureProfile` | `SignatureProof`, `OtpPolicy` |
| Signature externe | `ExternalSignatureRequest`, `ExternalSignatureAction`, `OtpChallenge` | `SignatureProof`, `EmailOutbox`, `RateLimit/Audit security` |
| Certificat/archive | `Certificate`, `DocumentVersion`, `AuditEntry` | `CertificateTemplateVersion`, `SoftDocsLink` |
| Notifications/relances | `Notification`, `Reminder`, `EmailTemplate` | `EmailOutbox`, `EmailDelivery`, `NotificationPreference` |
| Admin users/roles | `RolePermission` | Contrat Identity, `DocumentAccessGrant`, affectations projet/site |
| Fournisseurs | `ExternalAccount` | `ExternalAccountDocument`, décision/motif structuré |
| Reporting | `Document`, `DocumentWorkflowStep`, `AuditEntry` | `ExportJob`, vues SQL/report snapshots |
| Exploitation | `License`, `AuditEntry` | `LicenseUsage`, `ProcessingJob`, politiques rétention |

## Definition of Done commune

- Le ticket est rattaché à une Feature et une capture/preuve.
- Les règles métier sont dans Domain/Application, pas dans controller ni composant Angular.
- Les endpoints protégés ont `[Authorize]` et policies adaptées.
- Les erreurs API utilisent ProblemDetails.
- Les listes sont paginées/filtrées côté serveur.
- Les fichiers volumineux sont streamés.
- Les secrets, OTP, tokens et contenus binaires ne sont jamais loggés.
- Les actions sensibles créent audit.
- Les tests adaptés sont présents.
- La preuve de recette est jointe : capture, export, PDF signé, certificat, log ou rapport.

## Risques et décisions PO/Tech Lead à valider

- Niveau légal de signature attendu : simple, avancé, qualifié. La V1 proposée couvre une signature visible avec preuve, hash, OTP et certificat applicatif; un niveau qualifié peut nécessiter prestataire/HSM/certificat qualifié.
- Licence SQL Server production : Developer est gratuit seulement hors production.
- SMS OTP : canal SMS nécessite souvent un fournisseur externe payant; prévoir email en V1 si gratuit obligatoire.
- Taille maximale PDF et volume documentaire cible : à fixer pour index, tests performance et stockage.
- Intégration Identity/SoftDocs existante : confirmer les contrats et propriétaires.
- Conservation des preuves et durée de rétention audit : décision métier/juridique.
- Formats non PDF : DOCX/XLSX/images peuvent être acceptés en dépôt, mais la signature visible fiable doit produire/viser un PDF.
