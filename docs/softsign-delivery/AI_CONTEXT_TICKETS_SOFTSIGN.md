# Contextes Engineering IA par ticket - SoftSign

Date de génération : 2026-06-04

Ce fichier est conçu pour copier-coller un contexte complet dans une IA de génération de code pour chaque ticket.

## Standards globaux

- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

## Barème global à respecter

| Catégorie | Pénalité à éviter | Points | Bonus à viser | Points |
|---|---:|---:|---|---:|
| Sécurité & Architecture | P0 | Absence [Authorize] sur endpoint protégé | -3 | B3 | Correction proactive violation sécurité [Authorize] | 3 |
| Sécurité & Architecture | P0 | Import cross-remote MFE | -3 | B3 | Correction proactive import cross-remote MFE | 3 |
| Sécurité & Architecture | P0 | Logique métier dans couche Infrastructure/Repository | -3 | B3 | Correction proactive logique métier Infrastructure | 3 |
| Sécurité & Architecture | P1 | Interface de service absente dans Application layer | -2 | B2 | Ajout interface service Application layer proactif | 2 |
| Sécurité & Architecture | P1 | Violation Nx enforce-module-boundaries | -2 | B2 | Correction violation Nx enforce-module-boundaries | 2 |
| Sécurité & Architecture | P1 | Données sensibles loggées (JWT, password, API key) | -2 | B2 | Nettoyage proactif logs données sensibles | 2 |
| Sécurité & Architecture | P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) | -1 | B1 | Réorganisation proactive fichiers couches | 1 |
| Angular & MFE | P0 | Composant non standalone (NgModule inutile) | -3 | B3 | Migration proactive vers standalone component | 3 |
| Angular & MFE | P0 | Type any utilisé sans justification | -3 | B3 | Typage strict remplacé any sans signalement | 3 |
| Angular & MFE | P0 | Violation architecture library (Models dans components...) | -3 | B3 | Correction proactive architecture library | 3 |
| Angular & MFE | P1 | BehaviorSubject au lieu de signal() | -2 | B2 | Migration proactive BehaviorSubject → signal() | 2 |
| Angular & MFE | P1 | @Input()/@Output() au lieu de input()/output() | -2 | B2 | Migration proactive @Input → input()/output() | 2 |
| Angular & MFE | P1 | *ngIf/*ngFor au lieu de @if/@for | -2 | B2 | Migration proactive *ngIf → @if/@for | 2 |
| Angular & MFE | P1 | ChangeDetectionStrategy.OnPush absent | -2 | B2 | Ajout OnPush proactif sur composant existant | 2 |
| Angular & MFE | P1 | String hardcodée non externalisée i18n | -2 | B2 | Externalisation i18n proactive | 2 |
| Angular & MFE | P1 | Encodage Windows-1252 au lieu de UTF-8 | -2 | B2 | Correction encodage UTF-8 proactive | 2 |
| Angular & MFE | P1 | console.log laissé dans code mergé | -2 | B2 | Nettoyage console.log proactif | 2 |
| Angular & MFE | P1 | SRP violé : composant > 3 responsabilités | -2 | B2 | Découpage proactif composant SRP | 2 |
| Angular & MFE | P2 | Barrel index.ts absent/mal configuré | -1 | B1 | Ajout barrel index.ts proactif | 1 |
| Angular & MFE | P2 | Import chemin relatif au lieu d'alias Nx | -1 | B1 | Migration imports vers alias Nx proactif | 1 |
| Angular & MFE | P2 | Lazy loading absent sur module/route feature | -1 | B1 | Ajout lazy loading proactif | 1 |
| .NET & Back-end | P0 | SaveChangesAsync dans Repository (pas UnitOfWork) | -3 | B3 | Correction SaveChangesAsync → UnitOfWork proactif | 3 |
| .NET & Back-end | P0 | Service métier dans Infrastructure (pas Application) | -3 | B3 | Déplacement service métier vers Application layer | 3 |
| .NET & Back-end | P1 | Controller avec logique métier | -2 | B2 | Thin controller : déplacement logique vers service | 2 |
| .NET & Back-end | P1 | Pas de validation FluentValidation | -2 | B2 | Ajout FluentValidation proactif | 2 |
| .NET & Back-end | P1 | Format réponse non standardisé (pas RFC 7807) | -2 | B2 | Standardisation réponse RFC 7807 proactive | 2 |
| .NET & Back-end | P1 | Propriété redondante dérivable en BDD | -2 | B2 | Suppression propriété redondante proactive | 2 |
| .NET & Back-end | P1 | Pagination 100% client-side sans filtre serveur | -2 | B2 | Migration pagination client-side → serveur | 2 |
| .NET & Back-end | P1 | Service technique dans Application layer | -2 | B2 | Déplacement service technique vers Infrastructure | 2 |
| .NET & Back-end | P1 | Migration EF Core auto-générée (pas SQL manuel) | -2 | B2 | Remplacement migration auto par script SQL manuel | 2 |
| .NET & Back-end | P2 | Incohérence class vs record pour DTOs | -1 | B1 | Uniformisation class/record DTOs | 1 |
| .NET & Back-end | P2 | Endpoint non RESTful | -1 | B1 | Correction endpoint RESTful proactif | 1 |
| .NET & Back-end | P2 | Nommage incohérent (Request/Response/Entity/Dto) | -1 | B1 | Correction nommage Request/Response/Entity/Dto | 1 |
| Git & Qualité | P0 | Merge direct sur main/develop sans PR | -3 | B3 | Correction proactive merge direct sur main | 3 |
| Git & Qualité | P1 | PR sans ticket rattaché | -2 | B2 | Ajout ticket rattaché à PR existante | 2 |
| Git & Qualité | P2 | Commit sans format conventionnel (feat:/fix:...) | -1 | B1 | Réécriture commits au format conventionnel | 1 |
| Git & Qualité | P2 | Description de PR vide ou incomplète | -1 | B1 | Amélioration description PR proactive | 1 |
| Git & Qualité | P2 | Import non utilisé laissé dans code | -1 | B1 | Nettoyage imports inutilisés proactif | 1 |
| Git & Qualité | P2 | Code mort commenté laissé dans code | -1 | B1 | Suppression code mort proactive | 1 |

## Prompts par ticket

### SS-F00-001 - Valider le catalogue des ecrans SoftSign

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F00-001 - Valider le catalogue des ecrans SoftSign
Feature : Cadrage fonctionnel et donnees de demonstration
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : PO / BA
Maquette/référence UI : CAP-M03
Livrable attendu : Catalogue ecrans + mapping ticket/maquette dans le backlog.

User story :
Je veux disposer de la liste des ecrans et parcours afin de suivre le backlog sans ambiguite.

Description BA/PO :
Consolider les ecrans visibles dans les maquettes integrees, donner un nom metier stable a chaque ecran et rattacher chaque ticket a une maquette.

Flux utilisateur à respecter :
- Lire les maquettes integrees.
- Nommer chaque ecran en langage metier.
- Associer chaque ticket a une maquette ou a un etat attendu.

Critères d'acceptation obligatoires :
- Chaque ticket possede une reference maquette ou la mention explicite 'pas de maquette'.
- Aucune reference a un fichier de code front n'est visible.
- Les noms d'ecrans sont compréhensibles par le metier.

Tests et vérifications attendus :
- Relecture PO.
- Controle recherche texte : pas de mention de fichier front ou de chemin de code source.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Non applicable pour ce ticket sauf impact UI découvert.

Standards .NET / SQL à appliquer si back concerné :
- Non applicable pour ce ticket sauf impact API/données découvert.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- Backlog
- Definition of Done
- Definition of Ready
- Maquette

Design patterns recommandés :
- Decision Record
- Acceptance Checklist
- Mapping Ticket/Maquette

Artefacts que tu dois générer :
- document/checklist métier ou technique
- jeu de données ou matrice de mapping
- preuves de revue

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Merge direct sur main/develop sans PR (-3 pts) ; viser B3 | Correction proactive merge direct sur main (+3 pts).
- Éviter P1 | PR sans ticket rattaché (-2 pts) ; viser B2 | Ajout ticket rattaché à PR existante (+2 pts).
- Éviter P2 | Commit sans format conventionnel (feat:/fix:...) (-1 pts) ; viser B1 | Réécriture commits au format conventionnel (+1 pts).
- Éviter P2 | Description de PR vide ou incomplète (-1 pts) ; viser B1 | Amélioration description PR proactive (+1 pts).
- Éviter P2 | Import non utilisé laissé dans code (-1 pts) ; viser B1 | Nettoyage imports inutilisés proactif (+1 pts).
- Éviter P2 | Code mort commenté laissé dans code (-1 pts) ; viser B1 | Suppression code mort proactive (+1 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F00-002 - Formaliser le dictionnaire des statuts documentaires

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F00-002 - Formaliser le dictionnaire des statuts documentaires
Feature : Cadrage fonctionnel et donnees de demonstration
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : BA
Maquette/référence UI : CAP-M05
Livrable attendu : Table de statuts validee avec transitions et libelles UI.

User story :
Je veux connaitre les statuts et transitions afin d'eviter les interpretations differentes entre devs et metier.

Description BA/PO :
Definir les statuts document, etape, signature externe, compte fournisseur et workflow avec transition autorisee, acteur et effet visible.

Flux utilisateur à respecter :
- Lister les statuts vus dans les ecrans.
- Ajouter les transitions autorisees.
- Indiquer les actions qui provoquent chaque transition.

Critères d'acceptation obligatoires :
- Chaque statut a un libelle, une definition, un acteur responsable et au moins une transition.
- Les statuts finaux sont identifies.
- Les statuts d'erreur/expiration sont couverts.

Tests et vérifications attendus :
- Relecture BA + Tech Lead.
- Exemples de documents par statut disponibles dans le jeu de demo.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Non applicable pour ce ticket sauf impact UI découvert.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Guard
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification
- Decision Record
- Acceptance Checklist
- Mapping Ticket/Maquette

Artefacts que tu dois générer :
- document/checklist métier ou technique
- jeu de données ou matrice de mapping
- preuves de revue
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).
- Éviter P1 | Format réponse non standardisé (pas RFC 7807) (-2 pts) ; viser B2 | Standardisation réponse RFC 7807 proactive (+2 pts).
- Éviter P1 | Propriété redondante dérivable en BDD (-2 pts) ; viser B2 | Suppression propriété redondante proactive (+2 pts).
- Éviter P1 | Pagination 100% client-side sans filtre serveur (-2 pts) ; viser B2 | Migration pagination client-side → serveur (+2 pts).
- Éviter P1 | Service technique dans Application layer (-2 pts) ; viser B2 | Déplacement service technique vers Infrastructure (+2 pts).
- Éviter P1 | Migration EF Core auto-générée (pas SQL manuel) (-2 pts) ; viser B2 | Remplacement migration auto par script SQL manuel (+2 pts).
- Éviter P0 | Merge direct sur main/develop sans PR (-3 pts) ; viser B3 | Correction proactive merge direct sur main (+3 pts).
- Éviter P1 | PR sans ticket rattaché (-2 pts) ; viser B2 | Ajout ticket rattaché à PR existante (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F00-003 - Preparer les jeux de donnees de demonstration par role

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F00-003 - Preparer les jeux de donnees de demonstration par role
Feature : Cadrage fonctionnel et donnees de demonstration
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : PO
Maquette/référence UI : CAP-M03
Livrable attendu : Jeu de donnees de demo importable ou seedable.

User story :
Je veux des donnees de demo coherentes afin que chaque jour de dev produise une demonstration observable.

Description BA/PO :
Construire un jeu minimal : administrateur, validateur, signataire, fournisseur, documents en attente, signes, rejetes, relances et demandes externes.

Flux utilisateur à respecter :
- Identifier les roles.
- Creer documents representatifs.
- Creer au moins un cas nominal et un cas d'erreur par parcours critique.

Critères d'acceptation obligatoires :
- Un administrateur peut voir tous les menus.
- Un validateur voit au moins une action a traiter.
- Un tiers externe peut ouvrir un lien OTP valide.
- Les rapports affichent des donnees non vides.

Tests et vérifications attendus :
- Demo locale avec les donnees.
- Verification des captures principales non vides.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Non applicable pour ce ticket sauf impact UI découvert.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- AuthorizationPolicyService
- RolePermission

Design patterns recommandés :
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Guard
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification
- Decision Record
- Acceptance Checklist
- Mapping Ticket/Maquette

Artefacts que tu dois générer :
- document/checklist métier ou technique
- jeu de données ou matrice de mapping
- preuves de revue
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).
- Éviter P1 | Format réponse non standardisé (pas RFC 7807) (-2 pts) ; viser B2 | Standardisation réponse RFC 7807 proactive (+2 pts).
- Éviter P1 | Propriété redondante dérivable en BDD (-2 pts) ; viser B2 | Suppression propriété redondante proactive (+2 pts).
- Éviter P1 | Pagination 100% client-side sans filtre serveur (-2 pts) ; viser B2 | Migration pagination client-side → serveur (+2 pts).
- Éviter P1 | Service technique dans Application layer (-2 pts) ; viser B2 | Déplacement service technique vers Infrastructure (+2 pts).
- Éviter P1 | Migration EF Core auto-générée (pas SQL manuel) (-2 pts) ; viser B2 | Remplacement migration auto par script SQL manuel (+2 pts).
- Éviter P0 | Merge direct sur main/develop sans PR (-3 pts) ; viser B3 | Correction proactive merge direct sur main (+3 pts).
- Éviter P1 | PR sans ticket rattaché (-2 pts) ; viser B2 | Ajout ticket rattaché à PR existante (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F01-001 - Afficher le portail fournisseur public

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F01-001 - Afficher le portail fournisseur public
Feature : Acces, navigation et shell SoftSign
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Fournisseur
Maquette/référence UI : CAP-M01
Livrable attendu : Portail fournisseur consultable avec CTA principal.

User story :
Je veux acceder au portail collaboratif afin de soumettre ou suivre mes documents.

Description BA/PO :
Mettre a disposition une page d'entree fournisseur claire avec action Acceder et bouton Se connecter.

Flux utilisateur à respecter :
- Ouvrir l'adresse publique.
- Voir le logo, le titre et l'action Acceder.
- Cliquer sur Se connecter ou Acceder.

Critères d'acceptation obligatoires :
- La page s'affiche sans authentification.
- Le CTA est visible au premier ecran.
- Les libelles sont metier et en francais.
- Aucune information technique n'apparait.

Tests et vérifications attendus :
- Test affichage desktop.
- Capture PO jointe au ticket.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Non applicable pour ce ticket sauf impact API/données découvert.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- Non applicable.

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | Merge direct sur main/develop sans PR (-3 pts) ; viser B3 | Correction proactive merge direct sur main (+3 pts).
- Éviter P1 | PR sans ticket rattaché (-2 pts) ; viser B2 | Ajout ticket rattaché à PR existante (+2 pts).
- Éviter P2 | Commit sans format conventionnel (feat:/fix:...) (-1 pts) ; viser B1 | Réécriture commits au format conventionnel (+1 pts).
- Éviter P2 | Description de PR vide ou incomplète (-1 pts) ; viser B1 | Amélioration description PR proactive (+1 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F01-002 - Afficher l'ecran de connexion backoffice

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F01-002 - Afficher l'ecran de connexion backoffice
Feature : Acces, navigation et shell SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M02
Livrable attendu : Ecran connexion avec validation de formulaire.

User story :
Je veux me connecter au backoffice afin d'acceder a SoftSign selon mes droits.

Description BA/PO :
Afficher un formulaire email/mot de passe, controle obligatoire et messages d'erreur comprehensibles.

Flux utilisateur à respecter :
- Ouvrir le backoffice.
- Saisir email et mot de passe.
- Soumettre.
- Voir succes ou erreur.

Critères d'acceptation obligatoires :
- Le bouton est inactif si un champ obligatoire est vide.
- Une erreur metier est affichee si les identifiants sont invalides.
- La connexion valide redirige vers l'espace de travail.
- Le mot de passe peut etre masque/affiche.

Tests et vérifications attendus :
- Test login valide.
- Test login invalide.
- Test champs vides.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuthorizationPolicyService
- DocumentWorkflowStep
- RolePermission
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F01-003 - Ouvrir le shell SoftSign connecte

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F01-003 - Ouvrir le shell SoftSign connecte
Feature : Acces, navigation et shell SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M03
Livrable attendu : Shell SoftSign operationnel avec dashboard par defaut.

User story :
Je veux arriver dans l'application SoftSign afin de traiter mes documents.

Description BA/PO :
Afficher l'environnement SoftSign : menu lateral, barre haute, fil d'Ariane, profil utilisateur et zone de contenu.

Flux utilisateur à respecter :
- Se connecter.
- Selectionner SoftSign.
- Afficher le tableau de bord.
- Verifier menu et profil.

Critères d'acceptation obligatoires :
- Le menu SoftSign est visible.
- Le fil d'Ariane indique la page courante.
- Le profil connecte est affiche.
- La zone principale ne deborde pas en desktop.

Tests et vérifications attendus :
- Demo navigation.
- Controle visuel par capture.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F01-004 - Naviguer entre les groupes de menus SoftSign

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F01-004 - Naviguer entre les groupes de menus SoftSign
Feature : Acces, navigation et shell SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M03
Livrable attendu : Navigation lateralement testable avec etat actif.

User story :
Je veux naviguer dans les rubriques afin d'acceder rapidement a mes actions.

Description BA/PO :
Permettre l'ouverture/fermeture des groupes Documents, Traitement, Parametrage et Rapport avec etat actif visible.

Flux utilisateur à respecter :
- Cliquer sur un groupe.
- Cliquer sur un sous-menu.
- Verifier que le contenu change.
- Revenir au tableau de bord.

Critères d'acceptation obligatoires :
- Un seul menu actif est clairement identifie.
- Les compteurs restent lisibles.
- Le menu supporte le retour dashboard.
- Le changement de page conserve la session.

Tests et vérifications attendus :
- Test clic de chaque groupe.
- Capture d'un sous-menu actif.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- Non applicable.

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Test Pyramid
- Page Object E2E
- Approval Checklist
- Contract Test

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- test E2E ou scénario de vérification
- checklist DoD
- capture ou preuve d'exécution

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F01-005 - Masquer les menus non autorises

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F01-005 - Masquer les menus non autorises
Feature : Acces, navigation et shell SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M09
Livrable attendu : Filtrage menu par role avec scenario admin/standard.

User story :
Je veux que les utilisateurs ne voient que les menus autorises afin de respecter les habilitations.

Description BA/PO :
Appliquer les droits par profil sur l'affichage des menus et l'acces direct aux ecrans sensibles.

Flux utilisateur à respecter :
- Se connecter avec un profil admin.
- Constater les menus d'administration.
- Se connecter avec un profil standard.
- Constater les menus limites.

Critères d'acceptation obligatoires :
- Un standard ne voit pas les menus admin non autorises.
- Un acces direct non autorise est bloque par message metier.
- Un admin voit les menus de parametrage.
- Le comportement est documente dans la matrice.

Tests et vérifications attendus :
- Test admin.
- Test standard.
- Test acces URL direct si applicable.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuthorizationPolicyService
- RolePermission

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Policy
- Token Hashing
- Audit Trail
- Least Privilege

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- contrôle d'autorisation
- audit trail
- masquage logs sensibles

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F02-001 - Afficher les KPI du tableau de bord

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F02-001 - Afficher les KPI du tableau de bord
Feature : Tableau de bord operationnel
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Manager / Administrateur
Maquette/référence UI : CAP-M03
Livrable attendu : Bloc KPI dashboard alimente par les donnees SoftSign.

User story :
Je veux visualiser les volumes clefs afin de piloter l'activite de signature.

Description BA/PO :
Afficher les compteurs documents inities, en cours, signes, rejetes et archives avec libelles clairs.

Flux utilisateur à respecter :
- Ouvrir le dashboard.
- Lire les compteurs.
- Comparer avec les donnees de demo.

Critères d'acceptation obligatoires :
- Les cinq KPI sont visibles au premier ecran.
- Chaque KPI a un libelle et une valeur.
- Les valeurs refletent les donnees disponibles.
- L'etat vide affiche zero sans erreur.

Tests et vérifications attendus :
- Test jeu de donnees non vide.
- Test jeu vide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F02-002 - Afficher les alertes et anomalies

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F02-002 - Afficher les alertes et anomalies
Feature : Tableau de bord operationnel
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Manager
Maquette/référence UI : CAP-M03
Livrable attendu : Panneau alertes avec documents prioritaires.

User story :
Je veux voir les documents a risque afin de prioriser les actions.

Description BA/PO :
Afficher une liste d'alertes : retard, action urgente, rejet ou blocage externe.

Flux utilisateur à respecter :
- Ouvrir dashboard.
- Lire les alertes.
- Cliquer si une action de detail est prevue.

Critères d'acceptation obligatoires :
- Les alertes affichent titre document et action attendue.
- Les documents en retard sont identifies.
- Le panneau reste lisible si aucune alerte.
- Le nombre d'alertes correspond au compteur menu.

Tests et vérifications attendus :
- Test donnees avec retard.
- Test donnees sans alerte.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F02-003 - Ajouter les actions rapides du dashboard

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F02-003 - Ajouter les actions rapides du dashboard
Feature : Tableau de bord operationnel
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M03
Livrable attendu : Boutons dashboard connectes aux ecrans cibles.

User story :
Je veux lancer les actions frequentes depuis le dashboard afin de reduire les clics.

Description BA/PO :
Ajouter des boutons rapides vers depot, statistiques, utilisateurs et parametres selon droits.

Flux utilisateur à respecter :
- Ouvrir dashboard.
- Cliquer sur Exporter statistiques.
- Cliquer sur Gerer utilisateurs.
- Verifier navigation.

Critères d'acceptation obligatoires :
- Chaque bouton visible mene a l'ecran attendu.
- Les boutons admin sont masques aux non-admin.
- Aucun bouton ne mene a une page vide non assumee.

Tests et vérifications attendus :
- Test navigation rapide.
- Test droits.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F02-004 - Gerer les etats vide, chargement et erreur du dashboard

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F02-004 - Gerer les etats vide, chargement et erreur du dashboard
Feature : Tableau de bord operationnel
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M03
Livrable attendu : Etats UI dashboard lisibles.

User story :
Je veux comprendre l'etat de la page afin de ne pas confondre absence de donnees et incident.

Description BA/PO :
Ajouter messages d'etat pour absence de donnees, chargement et erreur de recuperation.

Flux utilisateur à respecter :
- Ouvrir dashboard sans donnees.
- Simuler chargement.
- Simuler erreur.

Critères d'acceptation obligatoires :
- Etat vide explicite.
- Etat chargement non bloquant.
- Erreur formulee sans jargon technique.
- Un bouton reessayer est propose en cas d'erreur.

Tests et vérifications attendus :
- Test etat vide.
- Test erreur simulee.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-001 - Ouvrir le wizard de depot interne

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-001 - Ouvrir le wizard de depot interne
Feature : Depot interne et lancement de workflow
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Wizard accessible depuis le menu Nouveau depot.

User story :
Je veux demarrer un depot afin de creer un document a faire valider ou signer.

Description BA/PO :
Afficher le wizard avec etapes Depot/OCR, Informations, Annexes, Type/Workflow, Zones, Envoi.

Flux utilisateur à respecter :
- Cliquer Nouveau depot.
- Voir l'etapeur.
- Verifier l'etape active.

Critères d'acceptation obligatoires :
- Les 6 etapes sont visibles.
- L'etape 1 est active par defaut.
- Les boutons Retour/Continuer sont presents.
- Aucune donnee n'est creee avant validation finale.

Tests et vérifications attendus :
- Test ouverture wizard.
- Capture etape 1.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-002 - Importer un PDF principal

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-002 - Importer un PDF principal
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Zone d'import PDF avec controles metier.

User story :
Je veux deposer le fichier principal afin de constituer le dossier de signature.

Description BA/PO :
Permettre selection ou glisser-deposer d'un fichier PDF avec controle de format et taille.

Flux utilisateur à respecter :
- Ouvrir wizard.
- Deposer un PDF valide.
- Deposer un fichier invalide.
- Observer les messages.

Critères d'acceptation obligatoires :
- Un PDF valide est accepte.
- Un non-PDF est refuse avec message clair.
- Un fichier trop volumineux est refuse.
- Le nom du fichier accepte est affiche.

Tests et vérifications attendus :
- Test PDF valide.
- Test format invalide.
- Test taille limite.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- AuthorizationPolicyService
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- RolePermission
- SignaturePolicyService
- SignatureProof
- SignatureZone
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-003 - Afficher le resultat OCR du document

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-003 - Afficher le resultat OCR du document
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Bloc OCR visible avec donnees modifiables ou message non detecte.

User story :
Je veux verifier les donnees extraites afin de gagner du temps de saisie.

Description BA/PO :
Apres import, afficher les donnees OCR disponibles : reference, titre, montant, tiers ou date si detectes.

Flux utilisateur à respecter :
- Importer PDF.
- Lancer/analyser OCR.
- Afficher donnees extraites.
- Corriger une valeur.

Critères d'acceptation obligatoires :
- Un resultat OCR est affiche si disponible.
- L'utilisateur peut corriger les champs proposes.
- Si OCR indisponible, un message explique que la saisie manuelle reste possible.
- Aucun blocage si OCR echoue.

Tests et vérifications attendus :
- Test OCR avec donnees.
- Test echec OCR.
- Test correction manuelle.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-004 - Saisir les metadonnees obligatoires

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-004 - Saisir les metadonnees obligatoires
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Etape Informations avec validation champs obligatoires.

User story :
Je veux renseigner les informations du document afin de le classer et router correctement.

Description BA/PO :
Saisir titre, reference, type, priorite, projet/site, tiers, date et commentaire avec validations.

Flux utilisateur à respecter :
- Continuer vers Informations.
- Renseigner les champs.
- Tenter de continuer avec champ manquant.

Critères d'acceptation obligatoires :
- Les champs obligatoires sont marques.
- Un message precise chaque champ manquant.
- Les valeurs OCR peuvent pre-remplir les champs.
- Les donnees sont conservees en changeant d'etape.

Tests et vérifications attendus :
- Test champ manquant.
- Test conservation navigation avant/arriere.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-005 - Ajouter des pieces annexes

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-005 - Ajouter des pieces annexes
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Gestion annexes dans le wizard.

User story :
Je veux joindre des annexes afin de fournir le contexte de validation.

Description BA/PO :
Permettre ajout, visualisation de la liste et suppression de pieces jointes avant lancement.

Flux utilisateur à respecter :
- Ouvrir etape Annexes.
- Ajouter une piece.
- Supprimer une piece.
- Continuer.

Critères d'acceptation obligatoires :
- La liste des annexes affiche nom et taille.
- Une annexe peut etre supprimee avant envoi.
- Les limites format/taille sont appliquees.
- Le document principal reste obligatoire.

Tests et vérifications attendus :
- Test ajout.
- Test suppression.
- Test format interdit.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-006 - Choisir le type document et le workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-006 - Choisir le type document et le workflow
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Etape Type & Workflow avec choix valide.

User story :
Je veux choisir le circuit adapte afin que le bon processus de validation s'applique.

Description BA/PO :
Afficher les workflows actifs compatibles avec le type de document et leurs caracteristiques principales.

Flux utilisateur à respecter :
- Selectionner type.
- Voir les workflows compatibles.
- Choisir un workflow.
- Continuer.

Critères d'acceptation obligatoires :
- Seuls les workflows actifs et compatibles sont proposes.
- La duree estimee est visible.
- Le nombre d'etapes est visible.
- La suite est bloquee sans workflow.

Tests et vérifications attendus :
- Test type avec workflows.
- Test type sans workflow actif.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-007 - Previsualiser les etapes du workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-007 - Previsualiser les etapes du workflow
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Preview workflow lisible dans le wizard.

User story :
Je veux voir les validateurs et actions attendues afin de confirmer le circuit.

Description BA/PO :
Afficher les etapes, responsables, action attendue, ordre/parallele et delai avant lancement.

Flux utilisateur à respecter :
- Choisir workflow.
- Lire etapes.
- Verifier validateurs et delais.
- Revenir si correction necessaire.

Critères d'acceptation obligatoires :
- Chaque etape affiche libelle, action et acteurs.
- Les etapes OTP sont identifiees.
- Les delais sont visibles.
- Le preview se met a jour si workflow change.

Tests et vérifications attendus :
- Test workflow simple.
- Test workflow avec signature externe/OTP.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-008 - Positionner les zones de signature

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-008 - Positionner les zones de signature
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Configuration zones de signature enregistrable.

User story :
Je veux placer les zones de signature afin que les signataires sachent ou signer.

Description BA/PO :
Afficher un apercu du document et permettre de definir page, position et taille de chaque zone requise.

Flux utilisateur à respecter :
- Ouvrir etape Zones.
- Choisir une etape signataire.
- Definir zone.
- Modifier zone.

Critères d'acceptation obligatoires :
- Une zone est obligatoire pour les actions signature/paraphe.
- La page cible est selectable.
- La zone peut etre deplacee ou modifiee.
- Un message signale les zones manquantes.

Tests et vérifications attendus :
- Test zone signature.
- Test zone manquante.
- Test modification.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SignaturePolicyService
- SignatureProof
- SignatureZone
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-009 - Afficher le recapitulatif avant envoi

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-009 - Afficher le recapitulatif avant envoi
Feature : Depot interne et lancement de workflow
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Ecran recapitulatif avec action lancer.

User story :
Je veux relire le depot avant lancement afin d'eviter une erreur de workflow.

Description BA/PO :
Afficher recapitulatif : document, metadonnees, workflow, signataires, zones et annexes.

Flux utilisateur à respecter :
- Arriver a l'etape Envoi.
- Relire les informations.
- Revenir a une etape precedente si besoin.

Critères d'acceptation obligatoires :
- Le recapitulatif est complet.
- Chaque section indique si elle est valide.
- Le bouton lancer est inactif si une condition manque.
- Retour a une etape conserve les donnees.

Tests et vérifications attendus :
- Test recap complet.
- Test condition manquante.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-010 - Lancer le workflow depuis le wizard

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-010 - Lancer le workflow depuis le wizard
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Document cree avec workflow en cours et confirmation visible.

User story :
Je veux lancer le circuit afin que les acteurs recoivent leurs actions.

Description BA/PO :
Creer le document, initialiser les etapes, notifier le premier acteur et afficher confirmation.

Flux utilisateur à respecter :
- Cliquer Lancer.
- Voir confirmation.
- Retrouver le document dans les listes.
- Verifier premiere action active.

Critères d'acceptation obligatoires :
- Un identifiant document est genere.
- Le statut initial est correct.
- La premiere etape est active.
- Une notification est creee pour l'acteur concerne.

Tests et vérifications attendus :
- Test creation.
- Test presence dans liste.
- Test notification.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F03-011 - Gerer l'abandon ou le brouillon de depot

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F03-011 - Gerer l'abandon ou le brouillon de depot
Feature : Depot interne et lancement de workflow
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Gestionnaire document
Maquette/référence UI : CAP-M04
Livrable attendu : Abandon securise ou brouillon sauvegarde selon choix PO.

User story :
Je veux abandonner ou reprendre un depot afin de ne pas perdre une saisie en cours.

Description BA/PO :
Proposer une confirmation d'abandon et, si prevu, un brouillon consultable avant lancement.

Flux utilisateur à respecter :
- Commencer un depot.
- Quitter le wizard.
- Confirmer abandon ou sauvegarde.
- Reprendre si brouillon active.

Critères d'acceptation obligatoires :
- Un abandon demande confirmation.
- Aucun workflow n'est lance si abandon.
- Un brouillon conserve les champs deja saisis si l'option est active.
- Les brouillons sont identifies comme non envoyes.

Tests et vérifications attendus :
- Test abandon.
- Test reprise brouillon si retenu.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-001 - Afficher la liste Mes documents

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-001 - Afficher la liste Mes documents
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Liste Mes documents alimentee et paginee si necessaire.

User story :
Je veux consulter mes documents afin de suivre leur avancement.

Description BA/PO :
Afficher une table avec reference, titre, type, workflow, date creation et statut.

Flux utilisateur à respecter :
- Ouvrir Mes documents.
- Lire la table.
- Voir etat vide si aucun document.

Critères d'acceptation obligatoires :
- Les colonnes attendues sont visibles.
- L'etat vide est explicite.
- Un document cree apparait dans la liste.
- Le statut est lisible.

Tests et vérifications attendus :
- Test donnees non vides.
- Test etat vide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-002 - Filtrer et rechercher les documents

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-002 - Filtrer et rechercher les documents
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Filtres operationnels sur la liste documents.

User story :
Je veux filtrer mes documents afin de retrouver rapidement un dossier.

Description BA/PO :
Ajouter recherche texte, filtre projet, site, date debut/fin et actualisation.

Flux utilisateur à respecter :
- Saisir une recherche.
- Changer un filtre.
- Reinitialiser/actualiser.
- Verifier resultats.

Critères d'acceptation obligatoires :
- La recherche filtre reference et titre.
- Les filtres peuvent se combiner.
- Un etat aucun resultat est visible.
- Actualiser conserve ou reinitialise selon regle PO.

Tests et vérifications attendus :
- Test filtre simple.
- Test filtres combines.
- Test aucun resultat.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-003 - Afficher les vues documents par statut

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-003 - Afficher les vues documents par statut
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Sous-listes documents par statut accessibles.

User story :
Je veux consulter les documents recus, en cours, rejetes et archives afin de traiter par priorite.

Description BA/PO :
Brancher les sous-menus Documents externes, recus, en cours, rejetes et archives sur des listes filtrees.

Flux utilisateur à respecter :
- Cliquer chaque sous-menu.
- Verifier titre et filtre applique.
- Ouvrir un document si disponible.

Critères d'acceptation obligatoires :
- Chaque vue affiche le bon titre.
- Les compteurs correspondent aux resultats.
- Les statuts incompatibles ne remontent pas.
- L'etat vide reste clair.

Tests et vérifications attendus :
- Test chaque vue.
- Test compteur/menu.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-004 - Exporter une liste documentaire

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-004 - Exporter une liste documentaire
Feature : Gestion documentaire SoftSign
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Manager / Administrateur
Maquette/référence UI : CAP-M05
Livrable attendu : Export liste telechargeable.

User story :
Je veux exporter la liste filtree afin de partager un suivi hors outil.

Description BA/PO :
Ajouter export CSV ou Excel des donnees visibles avec en-tetes metier.

Flux utilisateur à respecter :
- Appliquer un filtre.
- Cliquer Exporter.
- Ouvrir le fichier exporte.

Critères d'acceptation obligatoires :
- L'export reprend les filtres actifs.
- Les colonnes exportees ont des libelles metier.
- Les dates et statuts sont lisibles.
- Un message s'affiche si rien a exporter.

Tests et vérifications attendus :
- Test export avec donnees.
- Test export vide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-005 - Ouvrir le detail d'un document

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-005 - Ouvrir le detail d'un document
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Fiche detail accessible depuis liste.

User story :
Je veux ouvrir un document afin de consulter son contenu et son workflow.

Description BA/PO :
Depuis une liste, ouvrir une fiche detail avec header document, statut, actions et onglets.

Flux utilisateur à respecter :
- Cliquer sur une ligne.
- Voir le detail.
- Revenir a la liste.

Critères d'acceptation obligatoires :
- Le detail affiche reference, titre, statut et auteur.
- Le retour liste est possible.
- Une erreur metier s'affiche si document introuvable.
- Les actions visibles respectent les droits.

Tests et vérifications attendus :
- Test ouverture.
- Test retour.
- Test document introuvable.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-006 - Afficher les informations generales du document

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-006 - Afficher les informations generales du document
Feature : Gestion documentaire SoftSign
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Onglet informations detail document.

User story :
Je veux lire les metadonnees afin de comprendre le contexte du document.

Description BA/PO :
Ajouter un onglet Informations : reference, type, priorite, projet, site, tiers, dates et commentaire.

Flux utilisateur à respecter :
- Ouvrir detail.
- Aller sur Informations.
- Lire les champs.

Critères d'acceptation obligatoires :
- Tous les champs du depot sont visibles.
- Les valeurs manquantes sont affichees par tiret ou message clair.
- Les libelles sont coherents avec le wizard.
- Aucune donnee technique n'est affichee.

Tests et vérifications attendus :
- Test document complet.
- Test document avec champs optionnels vides.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-007 - Afficher workflow et historique du document

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-007 - Afficher workflow et historique du document
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Timeline document lisible.

User story :
Je veux suivre les etapes afin de savoir qui doit agir et ce qui a deja ete fait.

Description BA/PO :
Ajouter onglet workflow/historique avec etapes, statut, acteur, date, commentaire et audit visible.

Flux utilisateur à respecter :
- Ouvrir detail.
- Consulter workflow.
- Consulter historique.
- Verifier etape active.

Critères d'acceptation obligatoires :
- L'etape active est distincte.
- Les etapes terminees affichent date et acteur.
- Les rejets/commentaires sont visibles.
- L'historique est trie du plus recent au plus ancien ou selon regle PO.

Tests et vérifications attendus :
- Test document en cours.
- Test document signe.
- Test document rejete.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-008 - Afficher l'aperçu du fichier document

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-008 - Afficher l'aperçu du fichier document
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Apercu document et annexes consultables.

User story :
Je veux consulter le fichier afin de verifier le contenu avant validation ou signature.

Description BA/PO :
Ajouter un onglet apercu fichier avec document principal et acces aux annexes.

Flux utilisateur à respecter :
- Ouvrir detail.
- Afficher apercu.
- Ouvrir annexe.

Critères d'acceptation obligatoires :
- Le document principal est visible ou telechargeable.
- Les annexes sont listees.
- Un fichier indisponible affiche une erreur metier.
- L'apercu ne bloque pas les autres onglets.

Tests et vérifications attendus :
- Test fichier disponible.
- Test fichier manquant.
- Test annexe.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-009 - Generer le certificat de signature

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-009 - Generer le certificat de signature
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Certificat disponible pour document signe.

User story :
Je veux obtenir une preuve de signature afin d'archiver le document signe.

Description BA/PO :
Afficher et telecharger un certificat contenant reference, signataires, dates, etapes et empreinte si disponible.

Flux utilisateur à respecter :
- Ouvrir un document signe.
- Cliquer certificat.
- Verifier les informations.
- Telecharger.

Critères d'acceptation obligatoires :
- Le certificat est accessible uniquement si le document est finalise ou signe.
- Les signataires et dates sont presents.
- Le telechargement produit un fichier.
- Un document non signe affiche une action inactive ou message clair.

Tests et vérifications attendus :
- Test document signe.
- Test document non signe.
- Verification contenu certificat.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- CertificatePolicyService
- DocumentAnnex
- DocumentFile
- DocumentHash
- SignatureCertificate
- SignaturePolicyService
- SignatureProof
- SignatureZone
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F04-010 - Mettre en place la recherche avancee

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F04-010 - Mettre en place la recherche avancee
Feature : Gestion documentaire SoftSign
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M05
Livrable attendu : Recherche avancee avec resultats consultables.

User story :
Je veux combiner plusieurs criteres afin de retrouver un document precis.

Description BA/PO :
Proposer un ecran recherche avancee avec criteres statut, type, acteur, dates, fournisseur et texte.

Flux utilisateur à respecter :
- Ouvrir recherche avancee.
- Renseigner criteres.
- Lancer recherche.
- Ouvrir resultat.

Critères d'acceptation obligatoires :
- Tous les criteres prevus sont affiches.
- La recherche combine les criteres.
- Les resultats sont exportables ou consultables selon regle PO.
- L'utilisateur peut reinitialiser la recherche.

Tests et vérifications attendus :
- Test criteres multiples.
- Test reinitialisation.
- Test aucun resultat.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-001 - Afficher la boite des actions a traiter

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-001 - Afficher la boite des actions a traiter
Feature : Traitement, validation et signature interne
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Validateur / Signataire
Maquette/référence UI : CAP-M06
Livrable attendu : Boite de reception avec actions en attente.

User story :
Je veux voir mes actions en attente afin de traiter les documents a temps.

Description BA/PO :
Afficher les emails/actions de signature, validation et OTP simules ou reels selon environnement.

Flux utilisateur à respecter :
- Ouvrir Boite de reception.
- Voir la liste des actions.
- Selectionner une action.

Critères d'acceptation obligatoires :
- La boite affiche les actions de l'utilisateur connecte.
- Un etat vide est visible.
- Chaque action indique document, type d'action et echeance.
- La selection affiche le detail.

Tests et vérifications attendus :
- Test utilisateur avec actions.
- Test utilisateur sans action.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentWorkflowStep
- SignaturePolicyService
- SignatureProof
- SignatureZone
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-002 - Ouvrir la modale d'action de validation

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-002 - Ouvrir la modale d'action de validation
Feature : Traitement, validation et signature interne
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Validateur
Maquette/référence UI : CAP-M06
Livrable attendu : Modale validation accessible.

User story :
Je veux ouvrir l'action demandee afin de valider ou refuser avec commentaire.

Description BA/PO :
Depuis une action active, afficher une modale avec recap document, commentaire et choix d'action.

Flux utilisateur à respecter :
- Ouvrir action.
- Lire recap.
- Saisir commentaire.
- Choisir valider ou refuser.

Critères d'acceptation obligatoires :
- La modale affiche document et etape.
- Le commentaire est obligatoire si refus.
- Les boutons sont explicites.
- La fermeture sans action ne modifie pas le workflow.

Tests et vérifications attendus :
- Test ouverture.
- Test fermeture.
- Test commentaire obligatoire.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentWorkflowStep
- SignaturePolicyService
- SignatureProof
- SignatureZone
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-003 - Valider une etape de workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-003 - Valider une etape de workflow
Feature : Traitement, validation et signature interne
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Validateur
Maquette/référence UI : CAP-M06
Livrable attendu : Validation d'etape avec avancement workflow.

User story :
Je veux valider mon etape afin que le document avance au prochain acteur.

Description BA/PO :
Enregistrer la validation, mettre a jour l'etape, activer la suivante et alimenter l'historique.

Flux utilisateur à respecter :
- Ouvrir action validation.
- Cliquer Valider.
- Voir confirmation.
- Verifier etape suivante.

Critères d'acceptation obligatoires :
- L'etape courante passe terminee.
- L'etape suivante devient active selon le workflow.
- L'historique mentionne acteur/date/commentaire.
- Le compteur actions se met a jour.

Tests et vérifications attendus :
- Test workflow lineaire.
- Test workflow parallele si present.
- Test historique.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentWorkflowStep
- SignaturePolicyService
- SignatureProof
- SignatureZone
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-004 - Refuser ou rejeter un document

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-004 - Refuser ou rejeter un document
Feature : Traitement, validation et signature interne
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Validateur
Maquette/référence UI : CAP-M06
Livrable attendu : Rejet document avec motif et notification.

User story :
Je veux refuser un document non conforme afin que l'emetteur corrige le dossier.

Description BA/PO :
Permettre le refus avec motif obligatoire, statut rejeté, notification emetteur et historique.

Flux utilisateur à respecter :
- Ouvrir action.
- Choisir Refuser.
- Saisir motif.
- Confirmer.

Critères d'acceptation obligatoires :
- Le motif est obligatoire.
- Le document passe au statut rejete ou correction selon regle PO.
- L'emetteur recoit une notification.
- Le motif est visible dans le detail.

Tests et vérifications attendus :
- Test refus sans motif.
- Test refus avec motif.
- Test notification emetteur.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- Notification
- Reminder
- ReminderPolicyService
- SignaturePolicyService
- SignatureProof
- SignatureZone
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-005 - Signer ou parapher une etape interne avec OTP

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-005 - Signer ou parapher une etape interne avec OTP
Feature : Traitement, validation et signature interne
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Signataire interne
Maquette/référence UI : CAP-M10
Livrable attendu : Signature interne securisee par OTP.

User story :
Je veux signer ou parapher de maniere securisee afin de confirmer mon engagement.

Description BA/PO :
Ajouter verification OTP si l'etape l'exige, capture signature/paraphe et avancement workflow.

Flux utilisateur à respecter :
- Ouvrir action signature.
- Recevoir/consulter OTP.
- Saisir OTP.
- Signer.
- Verifier document.

Critères d'acceptation obligatoires :
- L'OTP est demande si configure.
- Un OTP invalide bloque l'action.
- La signature est associee a l'etape.
- L'historique mentionne preuve et date.

Tests et vérifications attendus :
- Test OTP valide.
- Test OTP invalide.
- Test action sans OTP si configuree.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentWorkflowStep
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification
- Test Pyramid
- Page Object E2E
- Approval Checklist
- Contract Test

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent
- test E2E ou scénario de vérification
- checklist DoD
- capture ou preuve d'exécution

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-006 - Afficher les delegations actives

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-006 - Afficher les delegations actives
Feature : Traitement, validation et signature interne
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M07
Livrable attendu : Vue delegations consultable.

User story :
Je veux voir mes delegations afin de comprendre pourquoi une action m'est affectee.

Description BA/PO :
Afficher la liste des delegations entrantes/sortantes avec periode, delegant, delegue et statut.

Flux utilisateur à respecter :
- Ouvrir Delegation.
- Lire delegations.
- Voir statut actif/expire.

Critères d'acceptation obligatoires :
- Les delegations actives sont distinctes.
- Les dates sont lisibles.
- Les delegations expirees sont identifiees.
- Un etat vide est prevu.

Tests et vérifications attendus :
- Test delegation active.
- Test etat vide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- Delegation
- DelegationResolutionService
- DocumentWorkflowStep
- SignaturePolicyService
- SignatureProof
- SignatureZone
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-007 - Creer une delegation temporaire

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-007 - Creer une delegation temporaire
Feature : Traitement, validation et signature interne
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne / Admin
Maquette/référence UI : CAP-M07
Livrable attendu : Formulaire creation delegation operationnel.

User story :
Je veux deleguer mes actions afin d'assurer la continuite pendant mon absence.

Description BA/PO :
Permettre creation delegation avec delegue, dates, perimetre et controle chevauchement.

Flux utilisateur à respecter :
- Cliquer Nouvelle delegation.
- Choisir delegue.
- Renseigner dates.
- Enregistrer.

Critères d'acceptation obligatoires :
- La date fin doit etre apres date debut.
- Le delegue ne peut pas etre identique au delegant.
- Les conflits sont signales.
- Les nouvelles actions peuvent etre affectees au delegue selon regle.

Tests et vérifications attendus :
- Test creation valide.
- Test dates invalides.
- Test conflit.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- Delegation
- DelegationResolutionService
- DocumentWorkflowStep
- SignaturePolicyService
- SignatureProof
- SignatureZone
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F05-008 - Notifier les acteurs apres action workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F05-008 - Notifier les acteurs apres action workflow
Feature : Traitement, validation et signature interne
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M12
Livrable attendu : Notifications workflow generees et consultables.

User story :
Je veux que les acteurs soient informes afin de ne pas bloquer le circuit.

Description BA/PO :
Creer notifications pour prochaine etape, rejet, signature terminee et echeance proche.

Flux utilisateur à respecter :
- Valider une etape.
- Verifier notification acteur suivant.
- Rejeter document.
- Verifier notification emetteur.

Critères d'acceptation obligatoires :
- Une notification est creee pour l'acteur suivant.
- Le rejet notifie l'emetteur.
- Une notification contient reference document et action attendue.
- Les doublons sont evites.

Tests et vérifications attendus :
- Test validation.
- Test rejet.
- Test absence doublon.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentWorkflowStep
- Notification
- Reminder
- ReminderPolicyService
- SignaturePolicyService
- SignatureProof
- SignatureZone
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-001 - Creer une demande de signature externe

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-001 - Creer une demande de signature externe
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Utilisateur interne
Maquette/référence UI : CAP-M16
Livrable attendu : Demande externe creee avec lien securise.

User story :
Je veux envoyer un document a un tiers afin d'obtenir sa signature hors backoffice.

Description BA/PO :
Depuis le detail document, ouvrir une demande externe avec tiers, email, validite, message et zone.

Flux utilisateur à respecter :
- Ouvrir document.
- Choisir signature externe.
- Renseigner tiers/email.
- Creer demande.

Critères d'acceptation obligatoires :
- Email tiers obligatoire et valide.
- La duree de validite est obligatoire.
- La demande obtient un statut en attente.
- Le lien securise est genere.

Tests et vérifications attendus :
- Test demande valide.
- Test email invalide.
- Test validite manquante.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-002 - Envoyer l'email de signature externe

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-002 - Envoyer l'email de signature externe
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Systeme
Maquette/référence UI : CAP-M12
Livrable attendu : Email de signature visible dans la boite de demonstration ou journal.

User story :
Je veux que le tiers recoive un email afin d'acceder au portail de signature.

Description BA/PO :
Generer un email avec objet, reference document, lien securise, expiration et message de l'emetteur.

Flux utilisateur à respecter :
- Creer demande externe.
- Verifier email genere.
- Ouvrir le lien depuis l'email.

Critères d'acceptation obligatoires :
- L'email contient le lien securise.
- L'expiration est visible.
- La reference document est presente.
- L'envoi est trace dans l'historique.

Tests et vérifications attendus :
- Test generation email.
- Test ouverture lien.
- Test trace audit.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-003 - Afficher le portail tiers avec OTP

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-003 - Afficher le portail tiers avec OTP
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Signataire externe
Maquette/référence UI : CAP-M16
Livrable attendu : Portail OTP tiers accessible avec demande valide.

User story :
Je veux verifier mon identite afin d'acceder au document a signer.

Description BA/PO :
Afficher le portail public avec reference document, titre, email tiers et saisie OTP.

Flux utilisateur à respecter :
- Ouvrir lien securise.
- Lire reference et titre.
- Saisir OTP.

Critères d'acceptation obligatoires :
- Un lien valide affiche l'ecran OTP.
- Un lien invalide affiche une erreur metier.
- Le formulaire OTP ne revele pas de donnees sensibles inutiles.
- Le tiers peut demander un renvoi.

Tests et vérifications attendus :
- Test lien valide.
- Test lien invalide.
- Test renvoi OTP.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-004 - Verifier le code OTP tiers

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-004 - Verifier le code OTP tiers
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Signataire externe
Maquette/référence UI : CAP-M16
Livrable attendu : Verification OTP fonctionnelle.

User story :
Je veux saisir le bon code afin d'ouvrir le document.

Description BA/PO :
Valider OTP selon longueur, expiration, nombre d'essais et regeneration autorisee.

Flux utilisateur à respecter :
- Saisir mauvais OTP.
- Saisir OTP expire.
- Saisir OTP valide.

Critères d'acceptation obligatoires :
- Un OTP valide donne acces a l'ecran signature.
- Un OTP invalide affiche une erreur.
- Les tentatives sont limitees.
- L'expiration est appliquee.

Tests et vérifications attendus :
- Test OTP valide.
- Test OTP invalide.
- Test expiration.
- Test limite tentatives.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification
- Test Pyramid
- Page Object E2E
- Approval Checklist
- Contract Test

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent
- test E2E ou scénario de vérification
- checklist DoD
- capture ou preuve d'exécution

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-005 - Afficher le document et la zone a signer

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-005 - Afficher le document et la zone a signer
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Signataire externe
Maquette/référence UI : CAP-M16
Livrable attendu : Ecran signature tiers apres OTP.

User story :
Je veux voir le document et la zone attendue afin de signer au bon endroit.

Description BA/PO :
Apres OTP, afficher document, informations tiers, methode signature et zone de signature.

Flux utilisateur à respecter :
- Valider OTP.
- Lire document.
- Voir zone signature.
- Choisir methode signature.

Critères d'acceptation obligatoires :
- La zone signature est visible.
- Le tiers voit ses informations.
- Le document est consultable ou affiche un fallback lisible.
- Le bouton signer est inactif sans signature.

Tests et vérifications attendus :
- Test affichage document.
- Test absence signature.
- Test fallback fichier absent.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-006 - Capturer la signature du tiers

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-006 - Capturer la signature du tiers
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Signataire externe
Maquette/référence UI : CAP-M16
Livrable attendu : Capture signature tiers avec apercu.

User story :
Je veux dessiner ou importer ma signature afin de finaliser la demande.

Description BA/PO :
Permettre signature dessinee ou image importee avec apercu avant validation.

Flux utilisateur à respecter :
- Choisir Dessiner.
- Tracer signature.
- Ou importer image.
- Voir apercu.

Critères d'acceptation obligatoires :
- Une signature dessinee est acceptee.
- Une image valide est acceptee.
- Un format invalide est refuse.
- Le bouton valider devient actif quand une signature existe.

Tests et vérifications attendus :
- Test dessin.
- Test import image.
- Test format invalide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-007 - Reintegrer la signature externe dans le workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-007 - Reintegrer la signature externe dans le workflow
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Systeme
Maquette/référence UI : CAP-M16
Livrable attendu : Document mis a jour apres signature externe.

User story :
Je veux mettre a jour le document apres signature tiers afin de poursuivre ou terminer le circuit.

Description BA/PO :
A la validation tiers, enregistrer preuve, statut, historique, notification et deblocage workflow.

Flux utilisateur à respecter :
- Valider signature tiers.
- Voir confirmation.
- Retourner backoffice.
- Verifier document et workflow.

Critères d'acceptation obligatoires :
- La demande passe signee.
- Le document indique signature tiers.
- Le workflow est debloche ou avance.
- L'historique mentionne la preuve OTP/signature.

Tests et vérifications attendus :
- Test signature externe complete.
- Test notification backoffice.
- Test historique.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- DocumentWorkflowStep
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone
- SoftSignDocument
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F06-008 - Gerer expiration et reactivation du lien externe

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F06-008 - Gerer expiration et reactivation du lien externe
Feature : Signature externe tiers
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Signataire externe / Emetteur
Maquette/référence UI : CAP-M16
Livrable attendu : Parcours expiration/reactivation trace.

User story :
Je veux demander un nouveau lien si l'ancien est expire afin de reprendre la signature.

Description BA/PO :
Afficher etat lien expire, permettre demande de reactivation et notifier l'emetteur.

Flux utilisateur à respecter :
- Ouvrir lien expire.
- Cliquer Demander reactivation.
- Verifier notification emetteur.
- Generer nouveau lien.

Critères d'acceptation obligatoires :
- Le lien expire ne permet pas de signer.
- La demande de reactivation est tracee.
- L'emetteur est notifie.
- Un nouveau lien invalide l'ancien selon regle PO.

Tests et vérifications attendus :
- Test lien expire.
- Test demande reactivation.
- Test nouveau lien.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-001 - Afficher la liste des workflows

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-001 - Afficher la liste des workflows
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M11
Livrable attendu : Liste workflows administrable.

User story :
Je veux consulter les workflows afin de piloter les circuits disponibles.

Description BA/PO :
Afficher workflows regroupes par type avec statut, duree, nombre d'etapes et actions.

Flux utilisateur à respecter :
- Ouvrir Workflow.
- Lire les groupes.
- Filtrer par type/statut.

Critères d'acceptation obligatoires :
- Les workflows sont regroupes par type.
- Le statut actif/inactif est visible.
- La duree estimee est visible.
- La recherche filtre la liste.

Tests et vérifications attendus :
- Test liste.
- Test recherche.
- Test filtre statut.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- DocumentWorkflowStep
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-002 - Creer un nouveau workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-002 - Creer un nouveau workflow
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M11
Livrable attendu : Creation workflow avec validation formulaire.

User story :
Je veux creer un workflow afin de couvrir un nouveau besoin de validation.

Description BA/PO :
Ajouter action Nouveau workflow avec formulaire nom, type, description, statut et duree cible.

Flux utilisateur à respecter :
- Cliquer Nouveau workflow.
- Renseigner champs.
- Enregistrer.
- Voir dans la liste.

Critères d'acceptation obligatoires :
- Nom et type obligatoires.
- Un workflow cree apparait dans son groupe.
- Le workflow peut etre cree inactif.
- Les erreurs sont explicites.

Tests et vérifications attendus :
- Test creation valide.
- Test champ obligatoire.
- Test doublon nom si regle PO.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- DocumentWorkflowStep
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-003 - Gerer les etapes d'un workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-003 - Gerer les etapes d'un workflow
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M11
Livrable attendu : Edition etapes workflow.

User story :
Je veux definir les etapes afin d'organiser le circuit metier.

Description BA/PO :
Permettre ajout, modification, suppression et ordre des etapes avec action validation/signature/paraphe.

Flux utilisateur à respecter :
- Ouvrir workflow.
- Ajouter etape.
- Modifier action.
- Reordonner ou supprimer.

Critères d'acceptation obligatoires :
- Une etape possede libelle, action, acteurs et delai.
- L'ordre est conserve.
- La suppression demande confirmation.
- Un workflow actif ne peut pas etre rendu incoherent.

Tests et vérifications attendus :
- Test ajout.
- Test modification.
- Test suppression.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentWorkflowStep
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-004 - Definir les conditions d'application workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-004 - Definir les conditions d'application workflow
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M11
Livrable attendu : Conditions workflow configurables.

User story :
Je veux appliquer automatiquement le bon workflow selon les criteres document.

Description BA/PO :
Ajouter conditions type, montant, devise, priorite ou projet selon regles retenues.

Flux utilisateur à respecter :
- Ouvrir workflow.
- Ajouter condition.
- Sauvegarder.
- Tester selection dans depot.

Critères d'acceptation obligatoires :
- Les conditions sont lisibles en liste.
- Une condition invalide est refusee.
- Le depot propose le workflow compatible.
- Les conflits sont signales ou priorises.

Tests et vérifications attendus :
- Test condition montant.
- Test conflit.
- Test depot.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- DocumentWorkflowStep
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-005 - Activer ou desactiver un workflow

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-005 - Activer ou desactiver un workflow
Feature : Administration et parametrage
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M11
Livrable attendu : Toggle statut workflow fonctionnel.

User story :
Je veux retirer temporairement un workflow afin qu'il ne soit plus choisi.

Description BA/PO :
Permettre activation/desactivation avec impact visible dans la liste et dans le depot.

Flux utilisateur à respecter :
- Desactiver workflow.
- Ouvrir depot.
- Verifier absence dans choix.
- Activer a nouveau.

Critères d'acceptation obligatoires :
- Un workflow inactif n'est pas proposable au depot.
- Les documents deja lances ne sont pas modifies.
- L'action est tracee.
- Le statut visuel change immediatement.

Tests et vérifications attendus :
- Test desactivation.
- Test depot.
- Test audit.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- DocumentWorkflowStep
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-006 - Afficher les utilisateurs SoftSign

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-006 - Afficher les utilisateurs SoftSign
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M08
Livrable attendu : Liste utilisateurs SoftSign.

User story :
Je veux consulter les utilisateurs afin de gerer les habilitations.

Description BA/PO :
Afficher liste utilisateurs avec role, email, acces SoftSign et recherche.

Flux utilisateur à respecter :
- Ouvrir Utilisateurs.
- Rechercher utilisateur.
- Consulter fiche.

Critères d'acceptation obligatoires :
- Les utilisateurs SoftSign sont visibles.
- La recherche filtre nom/email/role.
- Le role est affiche.
- Un etat vide est prevu.

Tests et vérifications attendus :
- Test recherche.
- Test role visible.
- Test etat vide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuthorizationPolicyService
- RolePermission

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-007 - Configurer les autorisations par role

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-007 - Configurer les autorisations par role
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M09
Livrable attendu : Matrice autorisations sauvegardee.

User story :
Je veux configurer les droits afin de controler les menus et actions sensibles.

Description BA/PO :
Afficher une matrice role/action avec lecture, creation, validation, administration et rapports.

Flux utilisateur à respecter :
- Ouvrir Autorisation.
- Modifier un droit.
- Enregistrer.
- Tester avec profil concerne.

Critères d'acceptation obligatoires :
- Les roles sont visibles.
- Les droits sont modifiables selon habilitation admin.
- La sauvegarde persiste.
- Les menus/actions appliquent la matrice.

Tests et vérifications attendus :
- Test modification.
- Test persistance.
- Test effet sur menu.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuthorizationPolicyService
- RolePermission

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-008 - Configurer les parametres OTP

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-008 - Configurer les parametres OTP
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M10
Livrable attendu : Ecran OTP avec sauvegarde et apercu.

User story :
Je veux regler l'OTP afin d'adapter le niveau de securite.

Description BA/PO :
Configurer activation, longueur, validite, tentatives, regeneration et canaux d'envoi.

Flux utilisateur à respecter :
- Ouvrir Parametrage OTP.
- Changer longueur.
- Changer validite.
- Enregistrer.

Critères d'acceptation obligatoires :
- La longueur autorisee est controlee.
- Le type numerique/alphanumerique est selectable.
- Les limites tentatives/regeneration sont sauvegardees.
- L'apercu se met a jour.

Tests et vérifications attendus :
- Test sauvegarde.
- Test limites invalides.
- Test impact portail OTP.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-009 - Afficher et gerer les notifications

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-009 - Afficher et gerer les notifications
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur / Utilisateur
Maquette/référence UI : CAP-M12
Livrable attendu : Centre notifications consultable.

User story :
Je veux consulter les notifications afin de suivre les evenements importants.

Description BA/PO :
Afficher notifications non lues, type, message, date, lien document et action marquer lu.

Flux utilisateur à respecter :
- Ouvrir Notifications.
- Lire liste.
- Marquer une notification comme lue.
- Ouvrir document lie.

Critères d'acceptation obligatoires :
- Les notifications non lues sont distinguees.
- Le compteur se met a jour.
- Le lien document ouvre le detail si autorise.
- Un etat vide est prevu.

Tests et vérifications attendus :
- Test lecture.
- Test marquer lu.
- Test lien document.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- Notification
- Reminder
- ReminderPolicyService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-010 - Configurer les relances automatiques

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-010 - Configurer les relances automatiques
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M13
Livrable attendu : Configuration relances sauvegardee.

User story :
Je veux regler les relances afin de reduire les retards de validation.

Description BA/PO :
Configurer delai avant premiere relance, frequence, maximum, notifications internes et lien direct document.

Flux utilisateur à respecter :
- Ouvrir Relances.
- Modifier delai/frequence.
- Activer options.
- Enregistrer.

Critères d'acceptation obligatoires :
- Les valeurs numeriques sont controlees.
- Les options sont sauvegardees.
- Un apercu ou texte explicatif est visible.
- Les regles s'appliquent aux documents et demandes externes.

Tests et vérifications attendus :
- Test sauvegarde.
- Test valeurs invalides.
- Test generation relance.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- Notification
- Reminder
- ReminderPolicyService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-011 - Valider les comptes fournisseurs

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-011 - Valider les comptes fournisseurs
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M14
Livrable attendu : Ecran validation fournisseur operationnel.

User story :
Je veux controler les comptes fournisseurs afin d'autoriser ou refuser l'acces SoftSign.

Description BA/PO :
Afficher demandes fournisseurs, fiche detail, actions accepter SoftDocs+SoftSign, autoriser SoftSign seul, demander complement.

Flux utilisateur à respecter :
- Ouvrir Validation fournisseurs.
- Selectionner fournisseur.
- Choisir une action.
- Verifier statut.

Critères d'acceptation obligatoires :
- La fiche fournisseur affiche identite, contact, projet/site et informations bancaires.
- Accepter active l'acces SoftSign.
- Demander complement garde un statut explicite.
- L'action est tracee.

Tests et vérifications attendus :
- Test acceptation.
- Test demande complement.
- Test audit.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- DocumentWorkflowStep
- WorkflowModel
- WorkflowTransitionService

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Policy
- Token Hashing
- Audit Trail
- Least Privilege

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- contrôle d'autorisation
- audit trail
- masquage logs sensibles

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F07-012 - Personnaliser les parametres generaux SoftSign

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F07-012 - Personnaliser les parametres generaux SoftSign
Feature : Administration et parametrage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur
Maquette/référence UI : CAP-M03
Livrable attendu : Parametres generaux sauvegardes.

User story :
Je veux parametrer l'application afin d'adapter libelles et comportement au contexte client.

Description BA/PO :
Mettre a disposition les parametres generaux : nom affichage, theme si retenu, valeurs par defaut et preferences.

Flux utilisateur à respecter :
- Ouvrir Parametres generaux.
- Modifier une valeur.
- Enregistrer.
- Verifier impact visible.

Critères d'acceptation obligatoires :
- Les champs sont documentes.
- La sauvegarde persiste.
- Une valeur invalide est refusee.
- Les changements critiques demandent confirmation.

Tests et vérifications attendus :
- Test sauvegarde.
- Test valeur invalide.
- Test retour visuel.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Non applicable pour ce ticket sauf impact API/données découvert.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- Non applicable.

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | Merge direct sur main/develop sans PR (-3 pts) ; viser B3 | Correction proactive merge direct sur main (+3 pts).
- Éviter P1 | PR sans ticket rattaché (-2 pts) ; viser B2 | Ajout ticket rattaché à PR existante (+2 pts).
- Éviter P2 | Commit sans format conventionnel (feat:/fix:...) (-1 pts) ; viser B1 | Réécriture commits au format conventionnel (+1 pts).
- Éviter P2 | Description de PR vide ou incomplète (-1 pts) ; viser B1 | Amélioration description PR proactive (+1 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F08-001 - Afficher le rapport Situation par validateur

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F08-001 - Afficher le rapport Situation par validateur
Feature : Rapports et pilotage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Manager
Maquette/référence UI : CAP-M15
Livrable attendu : Rapport validateur consultable.

User story :
Je veux suivre la charge des validateurs afin de detecter les blocages.

Description BA/PO :
Afficher KPI en instance, traites, rejetes, delai moyen et liste par validateur.

Flux utilisateur à respecter :
- Ouvrir Situation par validateur.
- Lire KPI.
- Lire tableau.
- Trier par retard.

Critères d'acceptation obligatoires :
- Les KPI sont visibles.
- Chaque validateur affiche en instance, traites, rejetes, delai moyen.
- Le tri par retard fonctionne.
- L'etat vide est prevu.

Tests et vérifications attendus :
- Test donnees non vides.
- Test tri.
- Test etat vide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F08-002 - Afficher le detail d'un validateur

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F08-002 - Afficher le detail d'un validateur
Feature : Rapports et pilotage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Manager
Maquette/référence UI : CAP-M15
Livrable attendu : Drill-down validateur.

User story :
Je veux comprendre la charge d'un validateur afin d'agir sur les retards.

Description BA/PO :
Depuis le rapport, ouvrir le detail des dossiers en instance, en retard, traites et rejetes.

Flux utilisateur à respecter :
- Cliquer un validateur.
- Voir liste documents.
- Ouvrir un document.

Critères d'acceptation obligatoires :
- Le detail liste les documents du validateur.
- Les retards sont distingues.
- Un document peut etre ouvert si l'utilisateur a le droit.
- Le retour rapport est possible.

Tests et vérifications attendus :
- Test detail.
- Test ouverture document.
- Test droits.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F08-003 - Afficher le rapport Situation par expediteur

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F08-003 - Afficher le rapport Situation par expediteur
Feature : Rapports et pilotage
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Manager
Maquette/référence UI : CAP-M15
Livrable attendu : Rapport expediteur consultable.

User story :
Je veux suivre les documents par emetteur afin d'identifier les services les plus actifs ou bloques.

Description BA/PO :
Afficher volumes par expediteur/service, statuts, delais et documents en retard.

Flux utilisateur à respecter :
- Ouvrir Situation par expediteur.
- Lire KPI/tableau.
- Filtrer si prevu.

Critères d'acceptation obligatoires :
- Chaque expediteur a volumes par statut.
- Les retards sont visibles.
- Le rapport utilise les memes definitions que le dashboard.
- L'etat vide est prevu.

Tests et vérifications attendus :
- Test donnees non vides.
- Test etat vide.
- Controle coherence dashboard.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F08-004 - Exporter les rapports

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F08-004 - Exporter les rapports
Feature : Rapports et pilotage
Charge cible : 0,5 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Manager
Maquette/référence UI : CAP-M15
Livrable attendu : Export rapports.

User story :
Je veux exporter les rapports afin de les partager en reunion de pilotage.

Description BA/PO :
Ajouter export CSV/Excel pour situation validateur et expediteur avec filtres actifs.

Flux utilisateur à respecter :
- Ouvrir rapport.
- Appliquer filtre/tri.
- Exporter.
- Ouvrir fichier.

Critères d'acceptation obligatoires :
- L'export reprend les donnees visibles.
- Les en-tetes sont metier.
- La date d'export est incluse.
- Un export vide est gere.

Tests et vérifications attendus :
- Test export validateur.
- Test export expediteur.
- Test rapport vide.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Non applicable pour ce ticket sauf impact PDF/signature découvert.

Objets métier et services à considérer :
- AuditEntry
- DocumentStepProjection
- ReportQuery

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).
- Éviter P0 | SaveChangesAsync dans Repository (pas UnitOfWork) (-3 pts) ; viser B3 | Correction SaveChangesAsync → UnitOfWork proactif (+3 pts).
- Éviter P0 | Service métier dans Infrastructure (pas Application) (-3 pts) ; viser B3 | Déplacement service métier vers Application layer (+3 pts).
- Éviter P1 | Controller avec logique métier (-2 pts) ; viser B2 | Thin controller : déplacement logique vers service (+2 pts).
- Éviter P1 | Pas de validation FluentValidation (-2 pts) ; viser B2 | Ajout FluentValidation proactif (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F09-001 - Afficher le journal d'activite SoftSign

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F09-001 - Afficher le journal d'activite SoftSign
Feature : Audit, securite et qualite
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Administrateur / Auditeur
Maquette/référence UI : CAP-M12
Livrable attendu : Journal d'activite consultable.

User story :
Je veux consulter les evenements afin de tracer les actions sensibles.

Description BA/PO :
Afficher un journal date, acteur, action, document, detail et filtre par type/periode.

Flux utilisateur à respecter :
- Ouvrir Journal.
- Filtrer par periode.
- Filtrer par action.
- Ouvrir un evenement.

Critères d'acceptation obligatoires :
- Les actions sensibles sont tracees.
- Les filtres fonctionnent.
- Le journal est en lecture seule.
- Une action sans document reste visible avec detail.

Tests et vérifications attendus :
- Test traces validation.
- Test traces admin.
- Test filtres.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- Non applicable.

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F09-002 - Tracer les evenements documentaires dans l'historique

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F09-002 - Tracer les evenements documentaires dans l'historique
Feature : Audit, securite et qualite
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Auditeur
Maquette/référence UI : CAP-M05
Livrable attendu : Historique document complet.

User story :
Je veux retrouver l'historique d'un document afin de justifier son parcours.

Description BA/PO :
Enregistrer depot, validation, refus, signature, relance, delegation, signature externe et archivage.

Flux utilisateur à respecter :
- Executer plusieurs actions.
- Ouvrir detail document.
- Lire historique.

Critères d'acceptation obligatoires :
- Chaque action critique cree une entree.
- Chaque entree contient date, acteur, action et detail.
- Les actions systeme sont identifiees.
- L'historique ne peut pas etre modifie par un utilisateur standard.

Tests et vérifications attendus :
- Test depot.
- Test validation.
- Test signature externe.
- Test relance.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F09-003 - Verifier les permissions sur les actions sensibles

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F09-003 - Verifier les permissions sur les actions sensibles
Feature : Audit, securite et qualite
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : Tech Lead / QA
Maquette/référence UI : CAP-M09
Livrable attendu : Plan de tests permissions execute.

User story :
Je veux confirmer les droits afin d'eviter des actions non autorisees.

Description BA/PO :
Couvrir depot, validation, signature, administration, rapports et validation fournisseurs par profils.

Flux utilisateur à respecter :
- Preparer profils.
- Tester menus.
- Tester actions.
- Documenter resultats.

Critères d'acceptation obligatoires :
- Un utilisateur non autorise ne peut pas executer l'action.
- Le message d'interdiction est metier.
- Un admin conserve les droits attendus.
- Les cas sont traces dans le rapport QA.

Tests et vérifications attendus :
- Matrice tests permissions.
- Execution manuelle ou automatisee.
- Capture anomalie si echec.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- AuthorizationPolicyService
- RolePermission

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification
- Test Pyramid
- Page Object E2E
- Approval Checklist
- Contract Test

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent
- test E2E ou scénario de vérification
- checklist DoD
- capture ou preuve d'exécution

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F09-004 - Automatiser le test de depot complet

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F09-004 - Automatiser le test de depot complet
Feature : Audit, securite et qualite
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : QA
Maquette/référence UI : CAP-M04
Livrable attendu : Test E2E depot complet.

User story :
Je veux un test de bout en bout afin de securiser le parcours depot.

Description BA/PO :
Automatiser le scenario : connexion, depot PDF, metadonnees, workflow, zones, lancement, presence dans liste.

Flux utilisateur à respecter :
- Lancer test.
- Observer depot.
- Verifier document cree.
- Produire rapport.

Critères d'acceptation obligatoires :
- Le test passe sur jeu de demo.
- Un echec indique l'etape bloquante.
- Le document final est retrouve en liste.
- Le test est relancable sans nettoyage manuel lourd.

Tests et vérifications attendus :
- Execution test E2E.
- Rapport avec screenshot en cas d'echec.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- DocumentAnnex
- DocumentFile
- DocumentHash
- SoftSignDocument

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Test Pyramid
- Page Object E2E
- Approval Checklist
- Contract Test

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- test E2E ou scénario de vérification
- checklist DoD
- capture ou preuve d'exécution

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F09-005 - Automatiser le test de signature externe

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F09-005 - Automatiser le test de signature externe
Feature : Audit, securite et qualite
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : QA
Maquette/référence UI : CAP-M16
Livrable attendu : Test E2E signature externe.

User story :
Je veux un test de bout en bout afin de securiser la signature tiers.

Description BA/PO :
Automatiser : creation demande externe, ouverture lien, OTP, signature, reintegration document.

Flux utilisateur à respecter :
- Lancer test.
- Creer demande.
- Signer cote tiers.
- Verifier backoffice.

Critères d'acceptation obligatoires :
- Le lien OTP valide s'ouvre.
- La signature externe est finalisee.
- Le document backoffice change de statut.
- L'historique contient la preuve.

Tests et vérifications attendus :
- Execution test E2E.
- Rapport avec etapes.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Angular 17+ minimum, avec standalone components, syntaxe moderne @if/@for, input()/output(), signals pour état local et OnPush.
- NX/MFE : respecter les boundaries, utiliser les alias de librairies, ne jamais importer directement une feature depuis une autre feature.
- Séparer container smart, composants de présentation, facade/data-access, modèles typés et helpers purs.
- Pas de type any sans justification écrite. Préférer interfaces/DTO typés, unions de statuts et mappers.
- Formulaires réactifs typés, validations côté front alignées avec FluentValidation côté back.
- Tables volumineuses : pagination/tri/filtres serveur, virtual scroll si besoin, debounce, pas de chargement intégral client.

Standards .NET / SQL à appliquer si back concerné :
- Controllers fins : autorisation, validation d'entrée, appel Application Service, réponse standardisée.
- Application Services pour orchestration de cas d'usage et transaction. Domain Services pour règles métier complexes.
- Repositories derrière interfaces. SaveChangesAsync uniquement via UnitOfWork ou transaction applicative validée.
- FluentValidation obligatoire pour commandes/DTO entrants. Erreurs exposées via ProblemDetails/RFC 7807.
- Logs structurés avec Serilog et traces OpenTelemetry, sans OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Données volumineuses : pagination serveur, projections DTO, index SQL, streaming fichiers, pas de ToList() prématuré sur grosses requêtes.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- ExternalSignatureDomainService
- ExternalSignatureRequest
- OtpChallenge
- SecureTokenHash
- SignaturePolicyService
- SignatureProof
- SignatureZone

Design patterns recommandés :
- Container/Presenter
- Facade
- Adapter/Mapper DTO
- Guard
- Reactive Form Model
- Application Service
- Domain Service
- Repository
- UnitOfWork
- Result/ProblemDetails
- Query Object
- Specification légère
- Projection DTO
- Index filtré
- Migration SQL manuelle
- Policy
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Hub SignalR
- Observer/Event Stream
- Idempotent Command
- Progress Notification
- Test Pyramid
- Page Object E2E
- Approval Checklist
- Contract Test

Artefacts que tu dois générer :
- route/page Angular standalone
- composants UI typés
- facade/state signals
- service data-access typé
- tests composant/service
- endpoint REST si nécessaire
- DTO Request/Response
- Application Service
- FluentValidator
- tests unitaires/application
- requête paginée/projection DTO
- migration SQL manuelle si schéma modifié
- index/contrainte si volumétrie concernée
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- événement de progression/statut
- SignalR ou polling borné selon besoin
- rafraîchissement UI idempotent
- test E2E ou scénario de vérification
- checklist DoD
- capture ou preuve d'exécution

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Composant non standalone (NgModule inutile) (-3 pts) ; viser B3 | Migration proactive vers standalone component (+3 pts).
- Éviter P0 | Type any utilisé sans justification (-3 pts) ; viser B3 | Typage strict remplacé any sans signalement (+3 pts).
- Éviter P0 | Violation architecture library (Models dans components...) (-3 pts) ; viser B3 | Correction proactive architecture library (+3 pts).
- Éviter P1 | BehaviorSubject au lieu de signal() (-2 pts) ; viser B2 | Migration proactive BehaviorSubject → signal() (+2 pts).
- Éviter P1 | @Input()/@Output() au lieu de input()/output() (-2 pts) ; viser B2 | Migration proactive @Input → input()/output() (+2 pts).
- Éviter P1 | *ngIf/*ngFor au lieu de @if/@for (-2 pts) ; viser B2 | Migration proactive *ngIf → @if/@for (+2 pts).
- Éviter P1 | ChangeDetectionStrategy.OnPush absent (-2 pts) ; viser B2 | Ajout OnPush proactif sur composant existant (+2 pts).
- Éviter P1 | String hardcodée non externalisée i18n (-2 pts) ; viser B2 | Externalisation i18n proactive (+2 pts).
- Éviter P1 | Encodage Windows-1252 au lieu de UTF-8 (-2 pts) ; viser B2 | Correction encodage UTF-8 proactive (+2 pts).
- Éviter P1 | console.log laissé dans code mergé (-2 pts) ; viser B2 | Nettoyage console.log proactif (+2 pts).
- Éviter P1 | SRP violé : composant > 3 responsabilités (-2 pts) ; viser B2 | Découpage proactif composant SRP (+2 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```

### SS-F09-006 - Faire la revue visuelle des maquettes livrees

```text
Tu es un développeur IA senior, Tech Lead Angular et Tech Lead .NET sur le module SoftSign du projet gedlb.

Ticket à traiter : SS-F09-006 - Faire la revue visuelle des maquettes livrees
Feature : Audit, securite et qualite
Charge cible : 1 j maximum. Le résultat doit être démontrable en fin de journée.
Persona métier : PO / QA
Maquette/référence UI : CAP-M03
Livrable attendu : Checklist revue visuelle avec ecarts.

User story :
Je veux comparer l'implementation aux maquettes afin de detecter rapidement les ecarts.

Description BA/PO :
Pour chaque ecran principal, prendre une capture et la comparer a la maquette integree dans ce document.

Flux utilisateur à respecter :
- Capturer chaque ecran.
- Comparer avec maquette.
- Classer ecarts bloquant/majeur/mineur.
- Creer tickets de correction.

Critères d'acceptation obligatoires :
- Tous les ecrans principaux sont controles.
- Les ecarts critiques ont un ticket.
- Les textes visibles ne mentionnent pas le code ou le jargon technique.
- Les etats vides sont revus.

Tests et vérifications attendus :
- Checklist signee PO/QA.
- Captures jointes aux tickets d'ecart.

Standards globaux obligatoires :
- Clean Code obligatoire : noms métier explicites, fonctions courtes, faible couplage, pas de duplication opportuniste, pas de code mort.
- SOLID obligatoire : SRP pour composants/services, DIP via interfaces/ports, OCP via stratégies/policies quand une règle métier varie.
- Architecture cible : Angular NX/MFE côté front, ASP.NET Core Clean Architecture côté back, SQL Server côté données.
- Ne pas introduire de framework payant, MediatR, ni framework CQRS. Utiliser les Application Services, Domain Services, Repository Pattern, UnitOfWork, DI native, FluentValidation.
- Les tickets sont limités à 0,5 j ou 1 j : générer uniquement le périmètre demandé, sans refonte du socle ni amélioration non liée.
- Chaque sortie IA doit inclure les fichiers à créer/modifier, le code complet utile, les tests, les commandes de vérification et les risques restants.

Standards Angular à appliquer si front concerné :
- Non applicable pour ce ticket sauf impact UI découvert.

Standards .NET / SQL à appliquer si back concerné :
- Non applicable pour ce ticket sauf impact API/données découvert.

Standards PDF / signature / certificat à appliquer si concerné :
- Prévisualisation PDF : PDF.js côté Angular, rendu page par page, lazy loading et overlay de zones de signature.
- Signature visible en temps réel : canvas/signature_pad côté front, aperçu overlay avant validation, coordonnées normalisées page/x/y/width/height.
- Application sur PDF : service serveur dédié, idéalement Python FastAPI + pyHanko pour PAdES/certificats, appelé par .NET via port/adaptateur.
- Conserver document original, document signé, hash, preuve, audit, certificat et horodatage. Ne jamais écraser silencieusement le fichier source.

Objets métier et services à considérer :
- Backlog
- Definition of Done
- Definition of Ready
- Maquette

Design patterns recommandés :
- Policy
- Guard
- Token Hashing
- Audit Trail
- Least Privilege
- Adapter PDF Provider
- Strategy de signature
- Factory de certificat
- Immutable Document Version
- Test Pyramid
- Page Object E2E
- Approval Checklist
- Contract Test
- Decision Record
- Acceptance Checklist
- Mapping Ticket/Maquette

Artefacts que tu dois générer :
- document/checklist métier ou technique
- jeu de données ou matrice de mapping
- preuves de revue
- contrôle d'autorisation
- audit trail
- masquage logs sensibles
- prévisualisation PDF ou overlay de zone
- preuve/hash/version document
- adaptateur service PDF si signature/certificat
- test E2E ou scénario de vérification
- checklist DoD
- capture ou preuve d'exécution

Barème bonus/pénalité à respecter pour ce ticket :
- Éviter P0 | Absence [Authorize] sur endpoint protégé (-3 pts) ; viser B3 | Correction proactive violation sécurité [Authorize] (+3 pts).
- Éviter P0 | Import cross-remote MFE (-3 pts) ; viser B3 | Correction proactive import cross-remote MFE (+3 pts).
- Éviter P0 | Logique métier dans couche Infrastructure/Repository (-3 pts) ; viser B3 | Correction proactive logique métier Infrastructure (+3 pts).
- Éviter P1 | Interface de service absente dans Application layer (-2 pts) ; viser B2 | Ajout interface service Application layer proactif (+2 pts).
- Éviter P1 | Violation Nx enforce-module-boundaries (-2 pts) ; viser B2 | Correction violation Nx enforce-module-boundaries (+2 pts).
- Éviter P1 | Données sensibles loggées (JWT, password, API key) (-2 pts) ; viser B2 | Nettoyage proactif logs données sensibles (+2 pts).
- Éviter P2 | Fichier dans mauvaise couche (ex: DTO dans Domain) (-1 pts) ; viser B1 | Réorganisation proactive fichiers couches (+1 pts).
- Éviter P0 | Merge direct sur main/develop sans PR (-3 pts) ; viser B3 | Correction proactive merge direct sur main (+3 pts).
- Éviter P1 | PR sans ticket rattaché (-2 pts) ; viser B2 | Ajout ticket rattaché à PR existante (+2 pts).
- Éviter P2 | Commit sans format conventionnel (feat:/fix:...) (-1 pts) ; viser B1 | Réécriture commits au format conventionnel (+1 pts).
- Éviter P2 | Description de PR vide ou incomplète (-1 pts) ; viser B1 | Amélioration description PR proactive (+1 pts).
- Éviter P2 | Import non utilisé laissé dans code (-1 pts) ; viser B1 | Nettoyage imports inutilisés proactif (+1 pts).
- Éviter P2 | Code mort commenté laissé dans code (-1 pts) ; viser B1 | Suppression code mort proactive (+1 pts).

Contraintes de sortie :
- Ne génère aucun framework payant, aucun MediatR, aucun framework CQRS.
- Ne déplace pas de logique métier dans un composant Angular, un controller ou une couche Infrastructure.
- Ne charge jamais des tables/documents volumineux entièrement côté client ; prévois pagination, streaming, projection et index.
- Ne journalise jamais OTP, token brut, mot de passe, clé API, base64 document ou signature.
- Fournis le code complet utile, les tests associés, les commandes de vérification, puis une courte note de risque.
```
