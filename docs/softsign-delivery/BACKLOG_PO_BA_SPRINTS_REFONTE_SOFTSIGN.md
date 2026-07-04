# Backlog PO/BA par sprint - SoftSign

Date : 2026-06-04

Document fonctionnel pour sprint planning, recette et suivi métier.

## Catalogue maquettes et preuves

| Référence | Nom | Fichier ou preuve attendue |
|---|---|---|
| CAP-M01 | Portail fournisseur - entrée collaborative | CAP-01-accueil-fournisseur.png |
| CAP-M02 | Connexion backoffice | CAP-02-login-backoffice.png |
| CAP-M03 | Tableau de bord SoftSign | CAP-03-dashboard-softsign.png |
| CAP-M04 | Dépôt de document - parcours guidé | CAP-04-nouveau-depot.png |
| CAP-M05 | Mes documents - liste et filtres | CAP-05-mes-documents.png |
| CAP-M06 | Boîte de réception / actions à traiter | CAP-06-boite-reception.png |
| CAP-M07 | Délégations | CAP-07-delegations.png |
| CAP-M08 | Utilisateurs SoftSign | CAP-08-utilisateurs.png |
| CAP-M09 | Autorisations et permissions | CAP-09-autorisations.png |
| CAP-M10 | Paramétrage OTP | CAP-10-parametrage-otp.png |
| CAP-M11 | Workflows | CAP-11-workflow.png |
| CAP-M12 | Notifications | CAP-12-notifications.png |
| CAP-M13 | Relances automatiques | CAP-13-relances.png |
| CAP-M14 | Validation des comptes fournisseurs | CAP-08-validation-fournisseurs.png |
| CAP-M15 | Rapport - situation par validateur | CAP-11-situation-validateur.png |
| CAP-M16 | Portail tiers - vérification OTP | CAP-16-portail-signature-externe-otp.png |
| PREUVE-CADRAGE | Preuve de recette sans écran | Document de cadrage, décision validée ou checklist de démarrage. |
| PREUVE-PREPARATION | Preuve de recette sans écran | Checklist de préparation projet validée par l'équipe. |
| PREUVE-DONNEES | Preuve de recette sans écran | Modèle de données, jeu d'exemple ou contrôle de cohérence consultable. |
| PREUVE-REGLES | Preuve de recette sans écran | Scénarios métier validés et règles de gestion vérifiées. |
| PREUVE-SERVICES | Preuve de recette sans écran | Parcours ou service démontré avec données de test. |
| PREUVE-PDF | Preuve de recette sans écran | Document PDF de test, extraction lisible, signature visible ou certificat de preuve. |
| PREUVE-RECETTE | Preuve de recette sans écran | Scénario de recette, capture ou résultat de contrôle fonctionnel. |
| PREUVE-PERFORMANCE | Preuve de recette sans écran | Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse. |
| PREUVE-EXPLOITATION | Preuve de recette sans écran | Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison. |

## S00 - Cadrage et préparation du projet SoftSign

Objectif sprint : Préparer les conditions de démarrage et valider le périmètre V1.

### SS-R00-001 - Valider le périmètre fonctionnel V1 à partir de la maquette

- Charge : 0,5 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage.
- Livrable attendu : Note de cadrage construction validée
- Description PO/BA : Ce ticket vise à valider le périmètre fonctionnel v1 à partir de la maquette. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage..
- Use case : En tant que PO, BA, QA et équipe projet, je veux valider le périmètre fonctionnel v1 à partir de la maquette afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-001, When le livrable est présenté, Then le résultat correspond au besoin : Note de cadrage construction validée.
- Given la référence PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-002 - Préparer les conditions de démarrage de l'équipe

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.
- Livrable attendu : Checklist environnement exécutée
- Description PO/BA : Ce ticket vise à préparer les conditions de démarrage de l'équipe. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Use case : En tant que PO, BA, QA et équipe projet, je veux préparer les conditions de démarrage de l'équipe afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-002, When le livrable est présenté, Then le résultat correspond au besoin : Checklist environnement exécutée.
- Given la référence PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-003 - Mettre en place le socle applicatif SoftSign

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.
- Livrable attendu : Socle applicatif prêt et vérifié
- Description PO/BA : Ce ticket vise à mettre en place le socle applicatif softsign. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Use case : En tant que PO, BA, QA et équipe projet, je veux mettre en place le socle applicatif softsign afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-003, When le livrable est présenté, Then le résultat correspond au besoin : Socle applicatif prêt et vérifié.
- Given la référence PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-004 - Mettre en place le socle de l'interface SoftSign

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.
- Livrable attendu : Socle d'interface prêt et vérifié
- Description PO/BA : Ce ticket vise à mettre en place le socle de l'interface softsign. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Use case : En tant que PO, BA, QA et équipe projet, je veux mettre en place le socle de l'interface softsign afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-004, When le livrable est présenté, Then le résultat correspond au besoin : Socle d'interface prêt et vérifié.
- Given la référence PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-005 - Définir les règles de collaboration et de revue

- Charge : 0,5 j
- Rôle principal : Équipe réalisation
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage.
- Livrable attendu : Guide PR court avec pénalités/bonus
- Description PO/BA : Ce ticket vise à définir les règles de collaboration et de revue. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage..
- Use case : En tant que PO, BA, QA et équipe projet, je veux définir les règles de collaboration et de revue afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-005, When le livrable est présenté, Then le résultat correspond au besoin : Guide PR court avec pénalités/bonus.
- Given la référence PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-006 - Préparer le socle de stockage et de recherche documentaire

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.
- Livrable attendu : Guide de préparation du stockage et de la recherche
- Description PO/BA : Ce ticket vise à préparer le socle de stockage et de recherche documentaire. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Use case : En tant que PO, BA, QA et équipe projet, je veux préparer le socle de stockage et de recherche documentaire afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-006, When le livrable est présenté, Then le résultat correspond au besoin : Guide de préparation du stockage et de la recherche.
- Given la référence PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-007 - Préparer les accès sécurisés et les certificats de test

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.
- Livrable attendu : Secrets dev isolés et certificat test disponible
- Description PO/BA : Ce ticket vise à préparer les accès sécurisés et les certificats de test. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Use case : En tant que PO, BA, QA et équipe projet, je veux préparer les accès sécurisés et les certificats de test afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R00-007, When le livrable est présenté, Then le résultat correspond au besoin : Secrets dev isolés et certificat test disponible.
- Given la référence PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R00-008 - Mettre en place le contrôle automatique de livraison

- Charge : 1 j
- Rôle principal : Référent exploitation
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.
- Livrable attendu : Pipeline build/test de base
- Description PO/BA : Ce ticket vise à mettre en place le contrôle automatique de livraison. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Use case : En tant que PO, BA, QA et équipe projet, je veux mettre en place le contrôle automatique de livraison afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-008, When le livrable est présenté, Then le résultat correspond au besoin : Pipeline build/test de base.
- Given la référence PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-009 - Préparer le suivi de santé et les journaux applicatifs

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.
- Livrable attendu : Contrôle de santé et journal applicatif disponibles
- Description PO/BA : Ce ticket vise à préparer le suivi de santé et les journaux applicatifs. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Use case : En tant que PO, BA, QA et équipe projet, je veux préparer le suivi de santé et les journaux applicatifs afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R00-009, When le livrable est présenté, Then le résultat correspond au besoin : Contrôle de santé et journal applicatif disponibles.
- Given la référence PREUVE-PREPARATION - Checklist de préparation projet validée par l'équipe., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R00-010 - Valider les choix de stockage, OCR, signature et PDF

- Charge : 1 j
- Rôle principal : Architecte solution
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage.
- Livrable attendu : Décision de conception validée
- Description PO/BA : Ce ticket vise à valider les choix de stockage, ocr, signature et pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage..
- Use case : En tant que PO, BA, QA et équipe projet, je veux valider les choix de stockage, ocr, signature et pdf afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage.

Préconditions :
- Le ticket est planifié dans le sprint S00.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R00-010, When le livrable est présenté, Then le résultat correspond au besoin : Décision de conception validée.
- Given la référence PREUVE-CADRAGE - Document de cadrage, décision validée ou checklist de démarrage., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.


## S01 - Socle des données documentaires

Objectif sprint : Préparer les informations nécessaires pour stocker, retrouver et tracer les documents.

### SS-R01-001 - Créer le schéma SQL softsign et convention migrations

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Modèle de données initial validé
- Description PO/BA : Ce ticket vise à créer le schéma sql softsign et convention migrations. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer le schéma sql softsign et convention migrations afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R01-001, When le livrable est présenté, Then le résultat correspond au besoin : Modèle de données initial validé.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R01-002 - Créer tables Documents et DocumentFiles avec fichiers volumineux

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Documents et fichiers enregistrables
- Description PO/BA : Ce ticket vise à créer tables documents et documentfiles avec fichiers volumineux. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer tables documents et documentfiles avec fichiers volumineux afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-002, When le livrable est présenté, Then le résultat correspond au besoin : Documents et fichiers enregistrables.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R01-003 - Créer tables annexes et versions de document

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Annexes et versions persistées
- Description PO/BA : Ce ticket vise à créer tables annexes et versions de document. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer tables annexes et versions de document afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-003, When le livrable est présenté, Then le résultat correspond au besoin : Annexes et versions persistées.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R01-004 - Créer tables workflow modèles, étapes et conditions

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : WorkflowModels/WorkflowSteps/WorkflowConditions
- Description PO/BA : Ce ticket vise à créer tables workflow modèles, étapes et conditions. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer tables workflow modèles, étapes et conditions afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-004, When le livrable est présenté, Then le résultat correspond au besoin : WorkflowModels/WorkflowSteps/WorkflowConditions.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R01-005 - Créer tables DocumentSteps et historique workflow

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Étapes documentaires persistées
- Description PO/BA : Ce ticket vise à créer tables documentsteps et historique workflow. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer tables documentsteps et historique workflow afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-005, When le livrable est présenté, Then le résultat correspond au besoin : Étapes documentaires persistées.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R01-006 - Créer tables SignatureZones, SignatureProfiles et ExternalSignatureRequests

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Tables signature prêtes
- Description PO/BA : Ce ticket vise à créer tables signaturezones, signatureprofiles et externalsignaturerequests. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer tables signaturezones, signatureprofiles et externalsignaturerequests afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-006, When le livrable est présenté, Then le résultat correspond au besoin : Tables signature prêtes.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R01-007 - Créer tables OTP, tokens hashés et sécurité signature

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : OTP/tokens persistés sans secret brut
- Description PO/BA : Ce ticket vise à créer tables otp, tokens hashés et sécurité signature. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer tables otp, tokens hashés et sécurité signature afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-007, When le livrable est présenté, Then le résultat correspond au besoin : OTP/tokens persistés sans secret brut.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R01-008 - Créer tables AuditEntries, Notifications, Reminders, Certificates

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Audit/notifications/certificats persistés
- Description PO/BA : Ce ticket vise à créer tables auditentries, notifications, reminders, certificates. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer tables auditentries, notifications, reminders, certificates afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-008, When le livrable est présenté, Then le résultat correspond au besoin : Audit/notifications/certificats persistés.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R01-009 - Paramétrer recherche documentaire Catalog et table DocumentSearchTexts

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Recherche dans les documents disponible
- Description PO/BA : Ce ticket vise à paramétrer recherche documentaire catalog et table documentsearchtexts. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux paramétrer recherche documentaire catalog et table documentsearchtexts afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-009, When le livrable est présenté, Then le résultat correspond au besoin : Recherche dans les documents disponible.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R01-010 - Créer index de volumétrie pour listes et tableaux

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Listes et recherches prêtes pour les volumes
- Description PO/BA : Ce ticket vise à créer index de volumétrie pour listes et tableaux. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer index de volumétrie pour listes et tableaux afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-010, When le livrable est présenté, Then le résultat correspond au besoin : Listes et recherches prêtes pour les volumes.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R01-011 - Créer seed minimal rôles, types document, workflows de démo

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Jeu de données reproductible
- Description PO/BA : Ce ticket vise à créer seed minimal rôles, types document, workflows de démo. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer seed minimal rôles, types document, workflows de démo afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R01-011, When le livrable est présenté, Then le résultat correspond au besoin : Jeu de données reproductible.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R01-012 - Ajouter tests d'intégration base et smoke SQL

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.
- Livrable attendu : Contrôles de cohérence des données exécutés
- Description PO/BA : Ce ticket vise à ajouter tests d'intégration base et smoke sql. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Use case : En tant que PO/BA et équipe réalisation, je veux ajouter tests d'intégration base et smoke sql afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable.

Préconditions :
- Le ticket est planifié dans le sprint S01.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R01-012, When le livrable est présenté, Then le résultat correspond au besoin : Contrôles de cohérence des données exécutés.
- Given la référence PREUVE-DONNEES - Modèle de données, jeu d'exemple ou contrôle de cohérence consultable., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.


## S02 - Règles métier et cycle de vie documentaire

Objectif sprint : Formaliser les statuts, transitions, workflows, signatures et preuves.

### SS-R02-001 - Définir l'agrégat SoftSignDocument

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Règles de document vérifiées
- Description PO/BA : Ce ticket vise à définir l'agrégat softsigndocument. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir l'agrégat softsigndocument afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-001, When le livrable est présenté, Then le résultat correspond au besoin : Règles de document vérifiées.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R02-002 - Créer Value Objects document et fichier

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : DocumentReference, DocumentHash, FileFormat, Money
- Description PO/BA : Ce ticket vise à créer value objects document et fichier. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer value objects document et fichier afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R02-002, When le livrable est présenté, Then le résultat correspond au besoin : DocumentReference, DocumentHash, FileFormat, Money.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R02-003 - Définir WorkflowModel, WorkflowStepModel et conditions

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Agrégat workflow testable
- Description PO/BA : Ce ticket vise à définir workflowmodel, workflowstepmodel et conditions. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir workflowmodel, workflowstepmodel et conditions afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-003, When le livrable est présenté, Then le résultat correspond au besoin : Agrégat workflow testable.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R02-004 - Définir DocumentWorkflowStep et transitions

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Étapes documentaires avec invariants
- Description PO/BA : Ce ticket vise à définir documentworkflowstep et transitions. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir documentworkflowstep et transitions afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-004, When le livrable est présenté, Then le résultat correspond au besoin : Étapes documentaires avec invariants.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R02-005 - Définir SignatureZone, SignatureProfile et SignatureProof

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Objets signature prêts
- Description PO/BA : Ce ticket vise à définir signaturezone, signatureprofile et signatureproof. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir signaturezone, signatureprofile et signatureproof afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R02-005, When le livrable est présenté, Then le résultat correspond au besoin : Objets signature prêts.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R02-006 - Définir ExternalSignatureRequest et OtpChallenge

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Signature externe sécurisée
- Description PO/BA : Ce ticket vise à définir externalsignaturerequest et otpchallenge. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir externalsignaturerequest et otpchallenge afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R02-006, When le livrable est présenté, Then le résultat correspond au besoin : Signature externe sécurisée.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R02-007 - Créer WorkflowSelectionService et WorkflowHydrationService

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Règles métier testées
- Description PO/BA : Ce ticket vise à créer workflowselectionservice et workflowhydrationservice. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer workflowselectionservice et workflowhydrationservice afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-007, When le livrable est présenté, Then le résultat correspond au besoin : Règles métier testées.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R02-008 - Créer WorkflowTransitionService

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Transitions validation/rejet/signature
- Description PO/BA : Ce ticket vise à créer workflowtransitionservice. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer workflowtransitionservice afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-008, When le livrable est présenté, Then le résultat correspond au besoin : Transitions validation/rejet/signature.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R02-009 - Créer DelegationResolutionService et ReminderPolicyService

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Règles délégation/relance
- Description PO/BA : Ce ticket vise à créer delegationresolutionservice et reminderpolicyservice. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer delegationresolutionservice et reminderpolicyservice afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-009, When le livrable est présenté, Then le résultat correspond au besoin : Règles délégation/relance.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R02-010 - Créer CertificatePolicyService et AuditTrailService

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Règles certificat/audit
- Description PO/BA : Ce ticket vise à créer certificatepolicyservice et audittrailservice. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux créer certificatepolicyservice et audittrailservice afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-010, When le livrable est présenté, Then le résultat correspond au besoin : Règles certificat/audit.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R02-011 - Définir les points d'échange et l'enregistrement cohérent des données

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Contrats d'échange internes validés
- Description PO/BA : Ce ticket vise à définir les points d'échange et l'enregistrement cohérent des données. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir les points d'échange et l'enregistrement cohérent des données afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R02-011, When le livrable est présenté, Then le résultat correspond au besoin : Contrats d'échange internes validés.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R02-012 - Couvrir invariants domaine par tests unitaires

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.
- Livrable attendu : Tests verts sur règles critiques
- Description PO/BA : Ce ticket vise à couvrir invariants domaine par tests unitaires. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Use case : En tant que PO/BA et équipe réalisation, je veux couvrir invariants domaine par tests unitaires afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées.

Préconditions :
- Le ticket est planifié dans le sprint S02.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R02-012, When le livrable est présenté, Then le résultat correspond au besoin : Tests verts sur règles critiques.
- Given la référence PREUVE-REGLES - Scénarios métier validés et règles de gestion vérifiées., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.


## S03 - Services de dépôt, consultation et recherche

Objectif sprint : Rendre disponibles les services nécessaires aux documents volumineux et aux recherches.

### SS-R03-001 - Garantir l'enregistrement cohérent des documents

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Enregistrement document vérifié
- Description PO/BA : Ce ticket vise à garantir l'enregistrement cohérent des documents. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux garantir l'enregistrement cohérent des documents afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R03-001, When le livrable est présenté, Then le résultat correspond au besoin : Enregistrement document vérifié.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R03-002 - Garantir le stockage fiable des fichiers et leur empreinte

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Stockage fichier fiable
- Description PO/BA : Ce ticket vise à garantir le stockage fiable des fichiers et leur empreinte. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux garantir le stockage fiable des fichiers et leur empreinte afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R03-002, When le livrable est présenté, Then le résultat correspond au besoin : Stockage fichier fiable.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R03-003 - Permettre l'envoi de gros documents avec reprise

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Envoi de gros PDF démontrable
- Description PO/BA : Ce ticket vise à permettre l'envoi de gros documents avec reprise. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux permettre l'envoi de gros documents avec reprise afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R03-003, When le livrable est présenté, Then le résultat correspond au besoin : Envoi de gros PDF démontrable.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R03-004 - Permettre la consultation et le téléchargement des PDF

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Lecture PDF sans charger en mémoire
- Description PO/BA : Ce ticket vise à permettre la consultation et le téléchargement des pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux permettre la consultation et le téléchargement des pdf afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R03-004, When le livrable est présenté, Then le résultat correspond au besoin : Lecture PDF sans charger en mémoire.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R03-005 - Définir les règles communes de listes, tris et filtres

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Règles communes de recherche et filtres
- Description PO/BA : Ce ticket vise à définir les règles communes de listes, tris et filtres. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir les règles communes de listes, tris et filtres afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R03-005, When le livrable est présenté, Then le résultat correspond au besoin : Règles communes de recherche et filtres.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R03-006 - Permettre la recherche dans le contenu des documents

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Recherche documents textuelle
- Description PO/BA : Ce ticket vise à permettre la recherche dans le contenu des documents. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux permettre la recherche dans le contenu des documents afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R03-006, When le livrable est présenté, Then le résultat correspond au besoin : Recherche documents textuelle.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R03-007 - Standardiser les messages d'erreur utilisateurs

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Messages d'erreur standardisés
- Description PO/BA : Ce ticket vise à standardiser les messages d'erreur utilisateurs. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux standardiser les messages d'erreur utilisateurs afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R03-007, When le livrable est présenté, Then le résultat correspond au besoin : Messages d'erreur standardisés.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R03-008 - Contrôler les droits sur les actions SoftSign

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Contrôles de droits actifs
- Description PO/BA : Ce ticket vise à contrôler les droits sur les actions softsign. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux contrôler les droits sur les actions softsign afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R03-008, When le livrable est présenté, Then le résultat correspond au besoin : Contrôles de droits actifs.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R03-009 - Tracer les actions sensibles dans l'historique

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Audit command handler/application service
- Description PO/BA : Ce ticket vise à tracer les actions sensibles dans l'historique. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux tracer les actions sensibles dans l'historique afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R03-009, When le livrable est présenté, Then le résultat correspond au besoin : Audit command handler/application service.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R03-010 - Vérifier les parcours stockage, recherche et permissions

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-SERVICES - Parcours ou service démontré avec données de test.
- Livrable attendu : Tests intégration service
- Description PO/BA : Ce ticket vise à vérifier les parcours stockage, recherche et permissions. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Use case : En tant que PO/BA et équipe réalisation, je veux vérifier les parcours stockage, recherche et permissions afin de sécuriser les bases du produit avant de livrer les écrans métier.
- Preuve de recette attendue : PREUVE-SERVICES - Parcours ou service démontré avec données de test.

Préconditions :
- Le ticket est planifié dans le sprint S03.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-SERVICES - Parcours ou service démontré avec données de test..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- L'équipe lit le besoin du ticket et confirme le résultat attendu avec le PO/BA.
- L'équipe prépare le livrable prévu : document, règle, modèle, contrôle ou service démontrable.
- Le résultat est vérifié avec un exemple simple et une preuve de fin de journée.
- Le PO/BA peut comprendre ce qui est prêt et ce qui reste à faire.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R03-010, When le livrable est présenté, Then le résultat correspond au besoin : Tests intégration service.
- Given la référence PREUVE-SERVICES - Parcours ou service démontré avec données de test., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.


## S04 - OCR, lecture PDF et signature électronique

Objectif sprint : Rendre possible la lecture automatique des documents et la signature visible avec certificat.

### SS-R04-001 - Préparer le service de lecture OCR et signature PDF

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Service spécialisé contrôlable
- Description PO/BA : Ce ticket vise à préparer le service de lecture ocr et signature pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux préparer le service de lecture ocr et signature pdf afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R04-001, When le livrable est présenté, Then le résultat correspond au besoin : Service spécialisé contrôlable.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R04-002 - Relier SoftSign au service de lecture et signature PDF

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Lien avec le service PDF/OCR validé
- Description PO/BA : Ce ticket vise à relier softsign au service de lecture et signature pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux relier softsign au service de lecture et signature pdf afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R04-002, When le livrable est présenté, Then le résultat correspond au besoin : Lien avec le service PDF/OCR validé.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R04-003 - Extraire le texte des PDF lisibles

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Extraction texte sans OCR inutile
- Description PO/BA : Ce ticket vise à extraire le texte des pdf lisibles. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux extraire le texte des pdf lisibles afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R04-003, When le livrable est présenté, Then le résultat correspond au besoin : Extraction texte sans OCR inutile.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R04-004 - Lire automatiquement les PDF scannés

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Texte OCR pour PDF image
- Description PO/BA : Ce ticket vise à lire automatiquement les pdf scannés. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux lire automatiquement les pdf scannés afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R04-004, When le livrable est présenté, Then le résultat correspond au besoin : Texte OCR pour PDF image.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R04-005 - Rendre le texte OCR utilisable dans la recherche

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Texte OCR indexable
- Description PO/BA : Ce ticket vise à rendre le texte ocr utilisable dans la recherche. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux rendre le texte ocr utilisable dans la recherche afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R04-005, When le livrable est présenté, Then le résultat correspond au besoin : Texte OCR indexable.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R04-006 - Afficher l'avancement de lecture OCR

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Progression OCR visible
- Description PO/BA : Ce ticket vise à afficher l'avancement de lecture ocr. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux afficher l'avancement de lecture ocr afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R04-006, When le livrable est présenté, Then le résultat correspond au besoin : Progression OCR visible.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R04-007 - Produire un premier PDF signé avec signature visible

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : PDF signé de test
- Description PO/BA : Ce ticket vise à produire un premier pdf signé avec signature visible. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux produire un premier pdf signé avec signature visible afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R04-007, When le livrable est présenté, Then le résultat correspond au besoin : PDF signé de test.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R04-008 - Définir la preuve et le certificat de signature

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Preuve hashée et certificat JSON/PDF
- Description PO/BA : Ce ticket vise à définir la preuve et le certificat de signature. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux définir la preuve et le certificat de signature afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R04-008, When le livrable est présenté, Then le résultat correspond au besoin : Preuve hashée et certificat JSON/PDF.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R04-009 - Tester les cas PDF volumineux et scannés

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Jeu de tests OCR/signature
- Description PO/BA : Ce ticket vise à tester les cas pdf volumineux et scannés. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux tester les cas pdf volumineux et scannés afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R04-009, When le livrable est présenté, Then le résultat correspond au besoin : Jeu de tests OCR/signature.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R04-010 - Clarifier les limites et prérequis de la signature officielle

- Charge : 0,5 j
- Rôle principal : Référent sécurité
- Acteur / persona : PO/BA et équipe réalisation
- Référence maquette ou preuve : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.
- Livrable attendu : Note d'exploitation signature
- Description PO/BA : Ce ticket vise à clarifier les limites et prérequis de la signature officielle. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Use case : En tant que PO/BA et équipe réalisation, je veux clarifier les limites et prérequis de la signature officielle afin de permettre la lecture automatique des documents et la signature fiable.
- Preuve de recette attendue : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve.

Préconditions :
- Le ticket est planifié dans le sprint S04.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Un document PDF de test est sélectionné.
- Le système lit, prépare, signe ou certifie le document selon le ticket.
- Le résultat est affiché ou fourni sous forme de preuve de recette.
- Les erreurs de lecture, de fichier ou de signature sont présentées clairement.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R04-010, When le livrable est présenté, Then le résultat correspond au besoin : Note d'exploitation signature.
- Given la référence PREUVE-PDF - Document PDF de test, extraction lisible, signature visible ou certificat de preuve., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.


## S05 - Fondations de l'interface utilisateur SoftSign

Objectif sprint : Préparer les composants communs avant les parcours métier complets.

### SS-R05-001 - Brancher le module SoftSign dans l'application

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : CAP-M03 - Tableau de bord SoftSign
- Livrable attendu : module interface chargeable depuis le shell
- Description PO/BA : Ce ticket vise à brancher le module softsign dans l'application. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M03 - Tableau de bord SoftSign.
- Use case : En tant que Utilisateur SoftSign, je veux brancher le module softsign dans l'application afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M03 - Tableau de bord SoftSign.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M03 - Tableau de bord SoftSign.
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R05-001, When le livrable est présenté, Then le résultat correspond au besoin : module interface chargeable depuis le shell.
- Given la référence CAP-M03 - Tableau de bord SoftSign, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R05-002 - Organiser les blocs réutilisables de l'interface SoftSign

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.
- Livrable attendu : Librairies NX respectant boundaries
- Description PO/BA : Ce ticket vise à organiser les blocs réutilisables de l'interface softsign. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Use case : En tant que Utilisateur SoftSign, je veux organiser les blocs réutilisables de l'interface softsign afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R05-002, When le livrable est présenté, Then le résultat correspond au besoin : Librairies NX respectant boundaries.
- Given la référence PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R05-003 - Aligner les données affichées avec les informations métier

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.
- Livrable attendu : Types document/workflow/signature
- Description PO/BA : Ce ticket vise à aligner les données affichées avec les informations métier. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Use case : En tant que Utilisateur SoftSign, je veux aligner les données affichées avec les informations métier afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R05-003, When le livrable est présenté, Then le résultat correspond au besoin : Types document/workflow/signature.
- Given la référence PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R05-004 - Préparer l'accès aux informations documents et workflows

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.
- Livrable attendu : Services service typés
- Description PO/BA : Ce ticket vise à préparer l'accès aux informations documents et workflows. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Use case : En tant que Utilisateur SoftSign, je veux préparer l'accès aux informations documents et workflows afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R05-004, When le livrable est présenté, Then le résultat correspond au besoin : Services service typés.
- Given la référence PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R05-005 - Filtrer les menus et pages selon les droits

- Charge : 1 j
- Rôle principal : Référent sécurité
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : CAP-M09 - Autorisations et permissions
- Livrable attendu : Menus/routes filtrés
- Description PO/BA : Ce ticket vise à filtrer les menus et pages selon les droits. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M09 - Autorisations et permissions.
- Use case : En tant que Utilisateur SoftSign, je veux filtrer les menus et pages selon les droits afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M09 - Autorisations et permissions.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M09 - Autorisations et permissions.
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R05-005, When le livrable est présenté, Then le résultat correspond au besoin : Menus/routes filtrés.
- Given la référence CAP-M09 - Autorisations et permissions, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R05-006 - Créer les composants communs de présentation

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : CAP-M03 - Tableau de bord SoftSign
- Livrable attendu : UI réutilisable
- Description PO/BA : Ce ticket vise à créer les composants communs de présentation. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M03 - Tableau de bord SoftSign.
- Use case : En tant que Utilisateur SoftSign, je veux créer les composants communs de présentation afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M03 - Tableau de bord SoftSign.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M03 - Tableau de bord SoftSign.
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R05-006, When le livrable est présenté, Then le résultat correspond au besoin : UI réutilisable.
- Given la référence CAP-M03 - Tableau de bord SoftSign, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R05-007 - Créer une liste adaptée aux grands volumes

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : CAP-M05 - Mes documents - liste et filtres
- Livrable attendu : Table avec pagination serveur
- Description PO/BA : Ce ticket vise à créer une liste adaptée aux grands volumes. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M05 - Mes documents - liste et filtres.
- Use case : En tant que Utilisateur SoftSign, je veux créer une liste adaptée aux grands volumes afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M05 - Mes documents - liste et filtres.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M05 - Mes documents - liste et filtres.
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R05-007, When le livrable est présenté, Then le résultat correspond au besoin : Table avec pagination serveur.
- Given la référence CAP-M05 - Mes documents - liste et filtres, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R05-008 - Afficher un PDF dans l'interface

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Viewer PDF page par page
- Description PO/BA : Ce ticket vise à afficher un pdf dans l'interface. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Utilisateur SoftSign, je veux afficher un pdf dans l'interface afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R05-008, When le livrable est présenté, Then le résultat correspond au besoin : Viewer PDF page par page.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R05-009 - Dessiner une signature et la prévisualiser sur le PDF

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Signature visible en temps réel
- Description PO/BA : Ce ticket vise à dessiner une signature et la prévisualiser sur le pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Utilisateur SoftSign, je veux dessiner une signature et la prévisualiser sur le pdf afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R05-009, When le livrable est présenté, Then le résultat correspond au besoin : Signature visible en temps réel.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R05-010 - Vérifier les composants communs de l'interface

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : Utilisateur SoftSign
- Référence maquette ou preuve : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.
- Livrable attendu : Tests front initiaux
- Description PO/BA : Ce ticket vise à vérifier les composants communs de l'interface. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Use case : En tant que Utilisateur SoftSign, je veux vérifier les composants communs de l'interface afin de garantir une interface cohérente et réutilisable.
- Preuve de recette attendue : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel.

Préconditions :
- Le ticket est planifié dans le sprint S05.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel..
- Le résultat attendu peut être validé par document, checklist, scénario ou contrôle simple.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R05-010, When le livrable est présenté, Then le résultat correspond au besoin : Tests front initiaux.
- Given la référence PREUVE-RECETTE - Scénario de recette, capture ou résultat de contrôle fonctionnel., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.


## S06 - Dépôt de document et lancement du circuit

Objectif sprint : Permettre au déposant de créer un document et de lancer son circuit de validation.

### SS-R06-001 - Créer route dépôt interne et stepper

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Wizard dépôt affiché
- Description PO/BA : Ce ticket vise à créer route dépôt interne et stepper. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux créer route dépôt interne et stepper afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R06-001, When le livrable est présenté, Then le résultat correspond au besoin : Wizard dépôt affiché.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R06-002 - Mettre en place upload PDF avec progression/reprise

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Upload visible et fiable
- Description PO/BA : Ce ticket vise à mettre en place upload pdf avec progression/reprise. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux mettre en place upload pdf avec progression/reprise afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R06-002, When le livrable est présenté, Then le résultat correspond au besoin : Upload visible et fiable.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R06-003 - Afficher progression OCR en temps réel

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : temps réel OCR branché
- Description PO/BA : Ce ticket vise à afficher progression ocr en temps réel. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux afficher progression ocr en temps réel afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R06-003, When le livrable est présenté, Then le résultat correspond au besoin : temps réel OCR branché.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R06-004 - Créer formulaire métadonnées prérempli OCR

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Formulaire typé
- Description PO/BA : Ce ticket vise à créer formulaire métadonnées prérempli ocr. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux créer formulaire métadonnées prérempli ocr afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R06-004, When le livrable est présenté, Then le résultat correspond au besoin : Formulaire typé.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R06-005 - Gérer annexes documentaires

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Ajout/suppression annexes
- Description PO/BA : Ce ticket vise à gérer annexes documentaires. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux gérer annexes documentaires afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R06-005, When le livrable est présenté, Then le résultat correspond au besoin : Ajout/suppression annexes.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R06-006 - Sélectionner type document et workflow suggéré

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Workflow proposé
- Description PO/BA : Ce ticket vise à sélectionner type document et workflow suggéré. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux sélectionner type document et workflow suggéré afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R06-006, When le livrable est présenté, Then le résultat correspond au besoin : Workflow proposé.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R06-007 - Placer zones signature/paraphe sur PDF

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Zones visibles et modifiables
- Description PO/BA : Ce ticket vise à placer zones signature/paraphe sur pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux placer zones signature/paraphe sur pdf afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R06-007, When le livrable est présenté, Then le résultat correspond au besoin : Zones visibles et modifiables.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R06-008 - Créer commande backend lancement workflow

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Transaction création document + étapes
- Description PO/BA : Ce ticket vise à créer commande backend lancement workflow. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux créer commande backend lancement workflow afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R06-008, When le livrable est présenté, Then le résultat correspond au besoin : Transaction création document + étapes.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R06-009 - Notifier les premiers acteurs du workflow

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M12 - Notifications
- Livrable attendu : Notification créée
- Description PO/BA : Ce ticket vise à notifier les premiers acteurs du workflow. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M12 - Notifications.
- Use case : En tant que Déposant interne, je veux notifier les premiers acteurs du workflow afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M12 - Notifications.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M12 - Notifications.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R06-009, When le livrable est présenté, Then le résultat correspond au besoin : Notification créée.
- Given la référence CAP-M12 - Notifications, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R06-010 - Créer test de parcours complet dépôt complet

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : Déposant interne
- Référence maquette ou preuve : CAP-M04 - Dépôt de document - parcours guidé
- Livrable attendu : Test bout en bout dépôt
- Description PO/BA : Ce ticket vise à créer test de parcours complet dépôt complet. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M04 - Dépôt de document - parcours guidé.
- Use case : En tant que Déposant interne, je veux créer test de parcours complet dépôt complet afin de créer un document et lancer son circuit de validation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M04 - Dépôt de document - parcours guidé.

Préconditions :
- Le ticket est planifié dans le sprint S06.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M04 - Dépôt de document - parcours guidé.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le déposant ouvre le parcours de dépôt.
- Il suit l'étape prévue par le ticket : fichier, informations, annexes, workflow, zones ou lancement.
- Le système affiche les états attendus : saisie, progression, succès ou erreur.
- Le document ou son statut devient visible dans le parcours.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R06-010, When le livrable est présenté, Then le résultat correspond au besoin : Test bout en bout dépôt.
- Given la référence CAP-M04 - Dépôt de document - parcours guidé, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.


## S07 - Suivi, traitement et actions internes

Objectif sprint : Permettre aux utilisateurs internes de consulter, rechercher, valider, rejeter ou signer.

### SS-R07-001 - Mettre à disposition KPI dashboard SoftSign

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Manager / responsable de suivi
- Référence maquette ou preuve : CAP-M03 - Tableau de bord SoftSign
- Livrable attendu : KPI paginés/projetés
- Description PO/BA : Ce ticket vise à mettre à disposition kpi dashboard softsign. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M03 - Tableau de bord SoftSign.
- Use case : En tant que Manager / responsable de suivi, je veux mettre à disposition kpi dashboard softsign afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M03 - Tableau de bord SoftSign.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M03 - Tableau de bord SoftSign.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R07-001, When le livrable est présenté, Then le résultat correspond au besoin : KPI paginés/projetés.
- Given la référence CAP-M03 - Tableau de bord SoftSign, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R07-002 - Créer dashboard interface SoftSign

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Manager / responsable de suivi
- Référence maquette ou preuve : CAP-M03 - Tableau de bord SoftSign
- Livrable attendu : Dashboard connecté
- Description PO/BA : Ce ticket vise à créer dashboard interface softsign. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M03 - Tableau de bord SoftSign.
- Use case : En tant que Manager / responsable de suivi, je veux créer dashboard interface softsign afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M03 - Tableau de bord SoftSign.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M03 - Tableau de bord SoftSign.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R07-002, When le livrable est présenté, Then le résultat correspond au besoin : Dashboard connecté.
- Given la référence CAP-M03 - Tableau de bord SoftSign, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R07-003 - Créer liste Mes documents serveur

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M05 - Mes documents - liste et filtres
- Livrable attendu : Liste filtrée déposant
- Description PO/BA : Ce ticket vise à créer liste mes documents serveur. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M05 - Mes documents - liste et filtres.
- Use case : En tant que Validateur ou signataire interne, je veux créer liste mes documents serveur afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M05 - Mes documents - liste et filtres.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M05 - Mes documents - liste et filtres.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R07-003, When le livrable est présenté, Then le résultat correspond au besoin : Liste filtrée déposant.
- Given la référence CAP-M05 - Mes documents - liste et filtres, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R07-004 - Créer boîte de réception actions actives

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M06 - Boîte de réception / actions à traiter
- Livrable attendu : Actions à traiter
- Description PO/BA : Ce ticket vise à créer boîte de réception actions actives. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M06 - Boîte de réception / actions à traiter.
- Use case : En tant que Validateur ou signataire interne, je veux créer boîte de réception actions actives afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M06 - Boîte de réception / actions à traiter.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M06 - Boîte de réception / actions à traiter.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R07-004, When le livrable est présenté, Then le résultat correspond au besoin : Actions à traiter.
- Given la référence CAP-M06 - Boîte de réception / actions à traiter, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R07-005 - Créer recherche avancée recherche documentaire

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M05 - Mes documents - liste et filtres
- Livrable attendu : Recherche connectée FTS
- Description PO/BA : Ce ticket vise à créer recherche avancée recherche documentaire. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M05 - Mes documents - liste et filtres.
- Use case : En tant que Validateur ou signataire interne, je veux créer recherche avancée recherche documentaire afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M05 - Mes documents - liste et filtres.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M05 - Mes documents - liste et filtres.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R07-005, When le livrable est présenté, Then le résultat correspond au besoin : Recherche connectée FTS.
- Given la référence CAP-M05 - Mes documents - liste et filtres, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R07-006 - Créer détail document par onglets

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M05 - Mes documents - liste et filtres
- Livrable attendu : Résumé, fichiers, workflow, historique
- Description PO/BA : Ce ticket vise à créer détail document par onglets. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M05 - Mes documents - liste et filtres.
- Use case : En tant que Validateur ou signataire interne, je veux créer détail document par onglets afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M05 - Mes documents - liste et filtres.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M05 - Mes documents - liste et filtres.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R07-006, When le livrable est présenté, Then le résultat correspond au besoin : Résumé, fichiers, workflow, historique.
- Given la référence CAP-M05 - Mes documents - liste et filtres, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R07-007 - Afficher timeline workflow et audit document

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M05 - Mes documents - liste et filtres
- Livrable attendu : Traçabilité lisible
- Description PO/BA : Ce ticket vise à afficher timeline workflow et audit document. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M05 - Mes documents - liste et filtres.
- Use case : En tant que Validateur ou signataire interne, je veux afficher timeline workflow et audit document afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M05 - Mes documents - liste et filtres.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M05 - Mes documents - liste et filtres.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R07-007, When le livrable est présenté, Then le résultat correspond au besoin : Traçabilité lisible.
- Given la référence CAP-M05 - Mes documents - liste et filtres, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R07-008 - Mettre en place action validation

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M06 - Boîte de réception / actions à traiter
- Livrable attendu : Validation active
- Description PO/BA : Ce ticket vise à mettre en place action validation. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M06 - Boîte de réception / actions à traiter.
- Use case : En tant que Validateur ou signataire interne, je veux mettre en place action validation afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M06 - Boîte de réception / actions à traiter.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M06 - Boîte de réception / actions à traiter.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R07-008, When le livrable est présenté, Then le résultat correspond au besoin : Validation active.
- Given la référence CAP-M06 - Boîte de réception / actions à traiter, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R07-009 - Mettre en place rejet avec motif obligatoire

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M06 - Boîte de réception / actions à traiter
- Livrable attendu : Rejet tracé
- Description PO/BA : Ce ticket vise à mettre en place rejet avec motif obligatoire. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M06 - Boîte de réception / actions à traiter.
- Use case : En tant que Validateur ou signataire interne, je veux mettre en place rejet avec motif obligatoire afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M06 - Boîte de réception / actions à traiter.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M06 - Boîte de réception / actions à traiter.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R07-009, When le livrable est présenté, Then le résultat correspond au besoin : Rejet tracé.
- Given la référence CAP-M06 - Boîte de réception / actions à traiter, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R07-010 - Mettre en place signature/paraphe interne OTP

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M06 - Boîte de réception / actions à traiter
- Livrable attendu : PDF signé/paraphé
- Description PO/BA : Ce ticket vise à mettre en place signature/paraphe interne otp. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M06 - Boîte de réception / actions à traiter.
- Use case : En tant que Validateur ou signataire interne, je veux mettre en place signature/paraphe interne otp afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M06 - Boîte de réception / actions à traiter.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M06 - Boîte de réception / actions à traiter.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R07-010, When le livrable est présenté, Then le résultat correspond au besoin : PDF signé/paraphé.
- Given la référence CAP-M06 - Boîte de réception / actions à traiter, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R07-011 - Créer test de parcours complet validation/rejet/signature interne

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : Validateur ou signataire interne
- Référence maquette ou preuve : CAP-M06 - Boîte de réception / actions à traiter
- Livrable attendu : Scénarios critiques automatisés
- Description PO/BA : Ce ticket vise à créer test de parcours complet validation/rejet/signature interne. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M06 - Boîte de réception / actions à traiter.
- Use case : En tant que Validateur ou signataire interne, je veux créer test de parcours complet validation/rejet/signature interne afin de traiter les documents et suivre les décisions sans perte de traçabilité.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M06 - Boîte de réception / actions à traiter.

Préconditions :
- Le ticket est planifié dans le sprint S07.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M06 - Boîte de réception / actions à traiter.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'utilisateur interne ouvre le tableau de bord, la liste ou le détail du document.
- Il consulte les informations ou réalise l'action prévue.
- Le système applique les règles de droit, de statut et de traçabilité.
- Le nouvel état est visible dans l'écran concerné.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R07-011, When le livrable est présenté, Then le résultat correspond au besoin : Scénarios critiques automatisés.
- Given la référence CAP-M06 - Boîte de réception / actions à traiter, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.


## S08 - Signature externe, certificat et archivage

Objectif sprint : Permettre à un tiers de signer en sécurité et de produire une preuve exploitable.

### SS-R08-001 - Mettre à disposition demande signature externe

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Demande externe persistée
- Description PO/BA : Ce ticket vise à mettre à disposition demande signature externe. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux mettre à disposition demande signature externe afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-001, When le livrable est présenté, Then le résultat correspond au besoin : Demande externe persistée.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R08-002 - Générer lien sécurisé et email de demande

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Email/lien simulé ou réel
- Description PO/BA : Ce ticket vise à générer lien sécurisé et email de demande. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux générer lien sécurisé et email de demande afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-002, When le livrable est présenté, Then le résultat correspond au besoin : Email/lien simulé ou réel.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R08-003 - Créer portail public token guard

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Accès lien valide/expiré
- Description PO/BA : Ce ticket vise à créer portail public token guard. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux créer portail public token guard afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-003, When le livrable est présenté, Then le résultat correspond au besoin : Accès lien valide/expiré.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R08-004 - Mettre en place génération OTP externe

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : OTP envoyé et hashé
- Description PO/BA : Ce ticket vise à mettre en place génération otp externe. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux mettre en place génération otp externe afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-004, When le livrable est présenté, Then le résultat correspond au besoin : OTP envoyé et hashé.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R08-005 - Mettre en place vérification OTP externe

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : OTP validé ou refusé
- Description PO/BA : Ce ticket vise à mettre en place vérification otp externe. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux mettre en place vérification otp externe afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-005, When le livrable est présenté, Then le résultat correspond au besoin : OTP validé ou refusé.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R08-006 - Afficher PDF tiers et signature visible temps réel

- Charge : 1 j
- Rôle principal : Équipe réalisation
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Signature pad + aperçu PDF
- Description PO/BA : Ce ticket vise à afficher pdf tiers et signature visible temps réel. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux afficher pdf tiers et signature visible temps réel afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R08-006, When le livrable est présenté, Then le résultat correspond au besoin : Signature pad + aperçu PDF.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R08-007 - Appliquer signature externe au PDF

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : PDF signé visible
- Description PO/BA : Ce ticket vise à appliquer signature externe au pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux appliquer signature externe au pdf afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-007, When le livrable est présenté, Then le résultat correspond au besoin : PDF signé visible.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R08-008 - Générer certificat de signature et QR payload

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Certificat consultable
- Description PO/BA : Ce ticket vise à générer certificat de signature et qr payload. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux générer certificat de signature et qr payload afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-008, When le livrable est présenté, Then le résultat correspond au besoin : Certificat consultable.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R08-009 - Réintégrer signature externe dans workflow

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Étape externe terminée
- Description PO/BA : Ce ticket vise à réintégrer signature externe dans workflow. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux réintégrer signature externe dans workflow afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-009, When le livrable est présenté, Then le résultat correspond au besoin : Étape externe terminée.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R08-010 - Créer test de parcours complet signature externe complète

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : Signataire externe et gestionnaire SoftSign
- Référence maquette ou preuve : CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Parcours tiers automatisé
- Description PO/BA : Ce ticket vise à créer test de parcours complet signature externe complète. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que Signataire externe et gestionnaire SoftSign, je veux créer test de parcours complet signature externe complète afin de permettre à un tiers de signer en sécurité avec une preuve exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S08.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le gestionnaire prépare ou suit une demande de signature externe.
- Le signataire externe ouvre le lien, vérifie son code et consulte le PDF.
- Il signe le document lorsque toutes les conditions sont remplies.
- Le certificat, le statut et la preuve sont consultables.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R08-010, When le livrable est présenté, Then le résultat correspond au besoin : Parcours tiers automatisé.
- Given la référence CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.


## S09 - Administration et paramétrage

Objectif sprint : Rendre SoftSign paramétrable par les administrateurs habilités.

### SS-R09-001 - Créer liste workflows administrables

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M11 - Workflows
- Livrable attendu : Workflows consultables
- Description PO/BA : Ce ticket vise à créer liste workflows administrables. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M11 - Workflows.
- Use case : En tant que Administrateur SoftSign, je veux créer liste workflows administrables afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M11 - Workflows.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M11 - Workflows.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R09-001, When le livrable est présenté, Then le résultat correspond au besoin : Workflows consultables.
- Given la référence CAP-M11 - Workflows, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R09-002 - Créer éditeur workflow étapes/conditions

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M11 - Workflows
- Livrable attendu : Workflow éditable
- Description PO/BA : Ce ticket vise à créer éditeur workflow étapes/conditions. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M11 - Workflows.
- Use case : En tant que Administrateur SoftSign, je veux créer éditeur workflow étapes/conditions afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M11 - Workflows.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M11 - Workflows.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R09-002, When le livrable est présenté, Then le résultat correspond au besoin : Workflow éditable.
- Given la référence CAP-M11 - Workflows, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R09-003 - Gérer versioning et activation workflow

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M11 - Workflows
- Livrable attendu : Activation sécurisée
- Description PO/BA : Ce ticket vise à gérer versioning et activation workflow. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M11 - Workflows.
- Use case : En tant que Administrateur SoftSign, je veux gérer versioning et activation workflow afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M11 - Workflows.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M11 - Workflows.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R09-003, When le livrable est présenté, Then le résultat correspond au besoin : Activation sécurisée.
- Given la référence CAP-M11 - Workflows, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R09-004 - Créer gestion utilisateurs/rôles/permissions

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M09 - Autorisations et permissions
- Livrable attendu : Permissions SoftSign administrables
- Description PO/BA : Ce ticket vise à créer gestion utilisateurs/rôles/permissions. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M09 - Autorisations et permissions.
- Use case : En tant que Administrateur SoftSign, je veux créer gestion utilisateurs/rôles/permissions afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M09 - Autorisations et permissions.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M09 - Autorisations et permissions.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R09-004, When le livrable est présenté, Then le résultat correspond au besoin : Permissions SoftSign administrables.
- Given la référence CAP-M09 - Autorisations et permissions, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R09-005 - Créer gestion signatures/paraphes utilisateur

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M10 - Paramétrage OTP
- Livrable attendu : Profils signature CRUD
- Description PO/BA : Ce ticket vise à créer gestion signatures/paraphes utilisateur. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M10 - Paramétrage OTP.
- Use case : En tant que Administrateur SoftSign, je veux créer gestion signatures/paraphes utilisateur afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M10 - Paramétrage OTP.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M10 - Paramétrage OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R09-005, When le livrable est présenté, Then le résultat correspond au besoin : Profils signature CRUD.
- Given la référence CAP-M10 - Paramétrage OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R09-006 - Créer gestion délégations

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M07 - Délégations
- Livrable attendu : Délégations CRUD
- Description PO/BA : Ce ticket vise à créer gestion délégations. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M07 - Délégations.
- Use case : En tant que Administrateur SoftSign, je veux créer gestion délégations afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M07 - Délégations.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M07 - Délégations.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R09-006, When le livrable est présenté, Then le résultat correspond au besoin : Délégations CRUD.
- Given la référence CAP-M07 - Délégations, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R09-007 - Créer validation comptes externes

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M14 - Validation des comptes fournisseurs
- Livrable attendu : Comptes tiers approuvés/rejetés
- Description PO/BA : Ce ticket vise à créer validation comptes externes. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M14 - Validation des comptes fournisseurs.
- Use case : En tant que Administrateur SoftSign, je veux créer validation comptes externes afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M14 - Validation des comptes fournisseurs.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M14 - Validation des comptes fournisseurs.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R09-007, When le livrable est présenté, Then le résultat correspond au besoin : Comptes tiers approuvés/rejetés.
- Given la référence CAP-M14 - Validation des comptes fournisseurs, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R09-008 - Créer paramètres OTP

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M10 - Paramétrage OTP
- Livrable attendu : Politique OTP configurable
- Description PO/BA : Ce ticket vise à créer paramètres otp. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M10 - Paramétrage OTP.
- Use case : En tant que Administrateur SoftSign, je veux créer paramètres otp afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M10 - Paramétrage OTP.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M10 - Paramétrage OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R09-008, When le livrable est présenté, Then le résultat correspond au besoin : Politique OTP configurable.
- Given la référence CAP-M10 - Paramétrage OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R09-009 - Créer paramètres relances automatiques

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M13 - Relances automatiques
- Livrable attendu : Relances automatiques
- Description PO/BA : Ce ticket vise à créer paramètres relances automatiques. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M13 - Relances automatiques.
- Use case : En tant que Administrateur SoftSign, je veux créer paramètres relances automatiques afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M13 - Relances automatiques.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M13 - Relances automatiques.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R09-009, When le livrable est présenté, Then le résultat correspond au besoin : Relances automatiques.
- Given la référence CAP-M13 - Relances automatiques, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R09-010 - Créer modèles email et variables

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M12 - Notifications
- Livrable attendu : Templates administrables
- Description PO/BA : Ce ticket vise à créer modèles email et variables. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M12 - Notifications.
- Use case : En tant que Administrateur SoftSign, je veux créer modèles email et variables afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M12 - Notifications.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M12 - Notifications.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R09-010, When le livrable est présenté, Then le résultat correspond au besoin : Templates administrables.
- Given la référence CAP-M12 - Notifications, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R09-011 - Créer centre notifications

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M12 - Notifications
- Livrable attendu : Notifications consultables
- Description PO/BA : Ce ticket vise à créer centre notifications. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M12 - Notifications.
- Use case : En tant que Administrateur SoftSign, je veux créer centre notifications afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M12 - Notifications.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M12 - Notifications.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R09-011, When le livrable est présenté, Then le résultat correspond au besoin : Notifications consultables.
- Given la référence CAP-M12 - Notifications, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R09-012 - Créer paramètres généraux/personnalisation/licence

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : Administrateur SoftSign
- Référence maquette ou preuve : CAP-M03 - Tableau de bord SoftSign
- Livrable attendu : Écran settings
- Description PO/BA : Ce ticket vise à créer paramètres généraux/personnalisation/licence. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M03 - Tableau de bord SoftSign.
- Use case : En tant que Administrateur SoftSign, je veux créer paramètres généraux/personnalisation/licence afin de administrer SoftSign sans intervention de l'équipe de réalisation.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M03 - Tableau de bord SoftSign.

Préconditions :
- Le ticket est planifié dans le sprint S09.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M03 - Tableau de bord SoftSign.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- L'administrateur ouvre l'écran de paramétrage concerné.
- Il consulte, crée, modifie, active ou désactive l'élément prévu par le ticket.
- Le système contrôle les champs obligatoires et les règles métier.
- Le changement est visible et traçable.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R09-012, When le livrable est présenté, Then le résultat correspond au besoin : Écran settings.
- Given la référence CAP-M03 - Tableau de bord SoftSign, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.


## S10 - Reporting, contrôle, performance et mise en recette

Objectif sprint : Préparer la recette V1, les rapports et les contrôles de stabilité.

### SS-R10-001 - Créer rapport situation par validateur

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : CAP-M15 - Rapport - situation par validateur
- Livrable attendu : Rapport connecté
- Description PO/BA : Ce ticket vise à créer rapport situation par validateur. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M15 - Rapport - situation par validateur.
- Use case : En tant que PO, BA, QA et équipe projet, je veux créer rapport situation par validateur afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M15 - Rapport - situation par validateur.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M15 - Rapport - situation par validateur.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R10-001, When le livrable est présenté, Then le résultat correspond au besoin : Rapport connecté.
- Given la référence CAP-M15 - Rapport - situation par validateur, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R10-002 - Créer rapport situation par expéditeur

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : CAP-M15 - Rapport - situation par validateur
- Livrable attendu : Rapport expéditeur
- Description PO/BA : Ce ticket vise à créer rapport situation par expéditeur. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M15 - Rapport - situation par validateur.
- Use case : En tant que PO, BA, QA et équipe projet, je veux créer rapport situation par expéditeur afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M15 - Rapport - situation par validateur.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M15 - Rapport - situation par validateur.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R10-002, When le livrable est présenté, Then le résultat correspond au besoin : Rapport expéditeur.
- Given la référence CAP-M15 - Rapport - situation par validateur, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R10-003 - Afficher le journal d'activité global avec filtres

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : CAP-M12 - Notifications
- Livrable attendu : Audit consultable
- Description PO/BA : Ce ticket vise à afficher le journal d'activité global avec filtres. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M12 - Notifications.
- Use case : En tant que PO, BA, QA et équipe projet, je veux afficher le journal d'activité global avec filtres afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M12 - Notifications.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M12 - Notifications.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.

Critères d'acceptation :
- Given le ticket SS-R10-003, When le livrable est présenté, Then le résultat correspond au besoin : Audit consultable.
- Given la référence CAP-M12 - Notifications, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.

### SS-R10-004 - Exporter les rapports dans des formats exploitables

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : CAP-M15 - Rapport - situation par validateur
- Livrable attendu : Exports opérationnels
- Description PO/BA : Ce ticket vise à exporter les rapports dans des formats exploitables. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M15 - Rapport - situation par validateur.
- Use case : En tant que PO, BA, QA et équipe projet, je veux exporter les rapports dans des formats exploitables afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M15 - Rapport - situation par validateur.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M15 - Rapport - situation par validateur.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R10-004, When le livrable est présenté, Then le résultat correspond au besoin : Exports opérationnels.
- Given la référence CAP-M15 - Rapport - situation par validateur, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R10-005 - Mesurer la tenue des gros PDF

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse.
- Livrable attendu : Rapport performance fichiers
- Description PO/BA : Ce ticket vise à mesurer la tenue des gros pdf. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse..
- Use case : En tant que PO, BA, QA et équipe projet, je veux mesurer la tenue des gros pdf afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse..
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R10-005, When le livrable est présenté, Then le résultat correspond au besoin : Rapport performance fichiers.
- Given la référence PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R10-006 - Mesurer la tenue des listes volumineuses

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse.
- Livrable attendu : Rapport performance listes
- Description PO/BA : Ce ticket vise à mesurer la tenue des listes volumineuses. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse..
- Use case : En tant que PO, BA, QA et équipe projet, je veux mesurer la tenue des listes volumineuses afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse..
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R10-006, When le livrable est présenté, Then le résultat correspond au besoin : Rapport performance listes.
- Given la référence PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R10-007 - Améliorer la rapidité des recherches et tableaux

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse.
- Livrable attendu : Plan d'index final
- Description PO/BA : Ce ticket vise à améliorer la rapidité des recherches et tableaux. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse..
- Use case : En tant que PO, BA, QA et équipe projet, je veux améliorer la rapidité des recherches et tableaux afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse..
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R10-007, When le livrable est présenté, Then le résultat correspond au besoin : Plan d'index final.
- Given la référence PREUVE-PERFORMANCE - Compte rendu de mesure : gros fichier, liste volumineuse, temps de réponse., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R10-008 - Contrôler la sécurité des accès et codes de vérification

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : CAP-M09 - Autorisations et permissions
- Livrable attendu : Suite sécurité
- Description PO/BA : Ce ticket vise à contrôler la sécurité des accès et codes de vérification. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M09 - Autorisations et permissions.
- Use case : En tant que PO, BA, QA et équipe projet, je veux contrôler la sécurité des accès et codes de vérification afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M09 - Autorisations et permissions.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M09 - Autorisations et permissions.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.

Critères d'acceptation :
- Given le ticket SS-R10-008, When le livrable est présenté, Then le résultat correspond au besoin : Suite sécurité.
- Given la référence CAP-M09 - Autorisations et permissions, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R10-009 - Préparer la sauvegarde et la restauration des documents

- Charge : 1 j
- Rôle principal : Référent exploitation
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison.
- Livrable attendu : Procédure exploitation
- Description PO/BA : Ce ticket vise à préparer la sauvegarde et la restauration des documents. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison..
- Use case : En tant que PO, BA, QA et équipe projet, je veux préparer la sauvegarde et la restauration des documents afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison..
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.

Critères d'acceptation :
- Given le ticket SS-R10-009, When le livrable est présenté, Then le résultat correspond au besoin : Procédure exploitation.
- Given la référence PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
- Given une action sensible, When l'utilisateur consulte l'historique, Then la preuve existe sans afficher de secret ou code confidentiel.

### SS-R10-010 - Préparer les indicateurs de suivi en exploitation

- Charge : 1 j
- Rôle principal : Référent exploitation
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison.
- Livrable attendu : Traces/logs/métriques lisibles
- Description PO/BA : Ce ticket vise à préparer les indicateurs de suivi en exploitation. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison..
- Use case : En tant que PO, BA, QA et équipe projet, je veux préparer les indicateurs de suivi en exploitation afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison..
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R10-010, When le livrable est présenté, Then le résultat correspond au besoin : Traces/logs/métriques lisibles.
- Given la référence PREUVE-EXPLOITATION - Procédure d'exploitation, sauvegarde, supervision ou dossier de livraison., When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.

### SS-R10-011 - Vérifier l'accessibilité et l'affichage responsive

- Charge : 1 j
- Rôle principal : QA fonctionnel
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M16 - Portail tiers - vérification OTP
- Livrable attendu : Checklist UI corrigée
- Description PO/BA : Ce ticket vise à vérifier l'accessibilité et l'affichage responsive. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M16 - Portail tiers - vérification OTP.
- Use case : En tant que PO, BA, QA et équipe projet, je veux vérifier l'accessibilité et l'affichage responsive afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M16 - Portail tiers - vérification OTP.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M16 - Portail tiers - vérification OTP.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R10-011, When le livrable est présenté, Then le résultat correspond au besoin : Checklist UI corrigée.
- Given la référence CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M16 - Portail tiers - vérification OTP, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.

### SS-R10-012 - Préparer le dossier de recette V1 et les données de démonstration

- Charge : 1 j
- Rôle principal : PO / BA
- Acteur / persona : PO, BA, QA et équipe projet
- Référence maquette ou preuve : CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M06 - Boîte de réception / actions à traiter ; CAP-M16 - Portail tiers - vérification OTP ; CAP-M15 - Rapport - situation par validateur
- Livrable attendu : Release candidate démontrable
- Description PO/BA : Ce ticket vise à préparer le dossier de recette v1 et les données de démonstration. Le résultat doit être compréhensible par le PO/BA, démontrable en fin de journée et relié à la référence prévue : CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M06 - Boîte de réception / actions à traiter ; CAP-M16 - Portail tiers - vérification OTP ; CAP-M15 - Rapport - situation par validateur.
- Use case : En tant que PO, BA, QA et équipe projet, je veux préparer le dossier de recette v1 et les données de démonstration afin de préparer une recette fiable, mesurable et exploitable.
- Preuve de recette attendue : Capture ou démonstration alignée avec CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M06 - Boîte de réception / actions à traiter ; CAP-M16 - Portail tiers - vérification OTP ; CAP-M15 - Rapport - situation par validateur.

Préconditions :
- Le ticket est planifié dans le sprint S10.
- Le périmètre du ticket tient dans une journée de réalisation maximum.
- La référence de recette est disponible : CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M06 - Boîte de réception / actions à traiter ; CAP-M16 - Portail tiers - vérification OTP ; CAP-M15 - Rapport - situation par validateur.
- Un jeu de données de démonstration est disponible pour montrer le résultat.

Parcours principal :
- Le PO/BA ou le QA ouvre le parcours ou le contrôle concerné.
- Il applique le scénario prévu par le ticket.
- Le système retourne un résultat lisible, mesurable ou exportable.
- La preuve de recette est jointe au ticket.

Cas alternatifs et erreurs :
- Si une information obligatoire manque, l'action est bloquée avec un message métier clair.
- Si l'utilisateur n'est pas autorisé, l'accès est refusé sans exposer d'information sensible.
- Si le document est invalide, trop volumineux ou illisible, le système affiche une erreur compréhensible et conserve l'état précédent.
- Si le lien ou le code de vérification est expiré ou invalide, l'utilisateur est guidé vers l'action possible suivante.
- Si aucun résultat n'est trouvé, l'écran affiche un état vide et propose de modifier les filtres.

Critères d'acceptation :
- Given le ticket SS-R10-012, When le livrable est présenté, Then le résultat correspond au besoin : Release candidate démontrable.
- Given la référence CAP-M03 - Tableau de bord SoftSign ; CAP-M04 - Dépôt de document - parcours guidé ; CAP-M06 - Boîte de réception / actions à traiter ; CAP-M16 - Portail tiers - vérification OTP ; CAP-M15 - Rapport - situation par validateur, When le PO/BA contrôle le ticket, Then le résultat attendu est démontrable ou justifié par une preuve de recette.
- Given un ticket limité à une journée, When l'équipe présente l'avancement, Then une preuve concrète existe : capture, scénario, document, rapport ou test de recette.
- Given les règles qualité du projet, When le ticket est relu, Then aucun écart bloquant de sécurité, droits, traçabilité ou données sensibles n'est identifié.
- Given un volume important de données, When l'utilisateur recherche, filtre ou pagine, Then l'écran reste fluide et ne bloque pas l'usage.
- Given un document volumineux ou scanné, When l'utilisateur lance le traitement, Then l'état d'avancement ou le résultat est compréhensible.
