"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  GitBranch,
  Layers3,
  LockKeyhole,
  PlugZap,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { formatMoney, formatPercent, numberValue } from "./softBudgetCore";

const C = {
  primary: "#0f766e",
  blue: "#2563eb",
  amber: "#d97706",
  red: "#dc2626",
  text: "#0f172a",
  muted: "#64748b",
  light: "#f8fafc",
  border: "#e2e8f0",
  white: "#ffffff",
};

const SECTION_CATALOG = [
  { id: 1, title: "Gestion des budgets", view: "budget-planning", icon: FileSpreadsheet, color: "#2563eb", done: "Versions, scenarios, periodes, revisions, workflow budgetaire, import simule" },
  { id: 2, title: "Suivi des engagements", view: "budget-engagements", icon: BriefcaseBusiness, color: "#0f766e", done: "Cycle de vie, reserve budgetaire, reliquat, facturation, cloture, annulation" },
  { id: 3, title: "Workflow & approbations", view: "budget-workflow", icon: Workflow, color: "#7c3aed", done: "Matrice d'approbation, delegations, bulk approval, SLA, motif obligatoire" },
  { id: 4, title: "Depenses & realisations", view: "budget-depenses", icon: Database, color: "#0891b2", done: "Saisie, avoirs, depenses hors engagement, imports ERP, provisions, controle 3-way" },
  { id: 5, title: "Reporting & tableaux de bord", view: "budget-reporting", icon: BarChart3, color: "#0f766e", done: "Rapports standards, generation, export CSV, analyse par departement/nature" },
  { id: 6, title: "Alertes & controle budgetaire", view: "budget-alertes", icon: AlertTriangle, color: "#dc2626", done: "Seuils, mode strict/souple, regles d'alerte, derogations DAF, retards" },
  { id: 7, title: "Projets & CAPEX", view: "budget-projects", icon: Rocket, color: "#d97706", done: "Portefeuille projets, jalons, avancement, fiches immobilisation, amortissement" },
  { id: 8, title: "Integrations & interop", view: "budget-integrations", icon: PlugZap, color: "#2563eb", done: "Connecteurs ERP/achats/SFTP, synchronisation, evenements API, erreurs" },
  { id: 9, title: "Securite, acces & conformite", view: "budget-security", icon: ShieldCheck, color: "#475569", done: "RBAC, SoD, revue d'acces, audit exportable, statuts temporaires" },
  { id: 10, title: "Prevision & intelligence", view: "budget-forecast", icon: Sparkles, color: "#7c3aed", done: "Rolling forecast, atterrissage, scenarios what-if, scoring du risque" },
  { id: 11, title: "Multi-entites & consolidation", view: "budget-consolidation", icon: Layers3, color: "#0f766e", done: "Entites, devises, packages de remontee, ecarts, contribution groupe" },
  { id: 12, title: "Administration, parametrage & UX", view: "budget-parametrage", icon: LockKeyhole, color: "#64748b", done: "Axes, fournisseurs, regles, journal, reset, taches admin" },
];

function Button({ children, onClick, icon: Icon, tone = "primary" }) {
  const styles = {
    primary: { bg: C.primary, fg: C.white, bd: C.primary },
    light: { bg: C.white, fg: C.text, bd: C.border },
    blue: { bg: C.blue, fg: C.white, bd: C.blue },
    amber: { bg: "#fffbeb", fg: "#b45309", bd: "#f59e0b55" },
  }[tone] || { bg: C.primary, fg: C.white, bd: C.primary };
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: `1px solid ${styles.bd}`, background: styles.bg, color: styles.fg, borderRadius: 7, minHeight: 34, padding: "7px 12px", fontSize: 12.5, fontWeight: 850, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function Pill({ children, color = C.primary }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: 999, background: `${color}12`, color, border: `1px solid ${color}24`, fontSize: 11, fontWeight: 850, whiteSpace: "nowrap" }}>{children}</span>;
}

function PageHead({ title, sub, action }) {
  return (
    <div className="sbe-head">
      <div>
        <h1>{title}</h1>
        <span>{sub}</span>
      </div>
      {action}
    </div>
  );
}

function Card({ title, children, action }) {
  return (
    <div className="sbe-card">
      <div className="sbe-card-title">
        <span>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

function DataTable({ columns, rows, empty = "Aucune donnee" }) {
  return (
    <div className="sbe-table-wrap">
      <table className="sbe-table">
        <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <div className="sbe-empty">{empty}</div>}
    </div>
  );
}

function Stat({ label, value, color = C.primary }) {
  return (
    <div className="sbe-stat">
      <span>{label}</span>
      <b style={{ color }}>{value}</b>
    </div>
  );
}

export function EnterpriseReferenceView({ derived, setView }) {
  const coverage = [
    { label: "Fonctionnalites implementees", value: "12/12" },
    { label: "Regles actives", value: derived.alertRules?.length || 0 },
    { label: "Connecteurs", value: derived.integrations?.length || 0 },
    { label: "Rapports", value: derived.reports?.length || 0 },
  ];
  return (
    <div className="sbe-stack">
      <PageHead title="Referentiel fonctionnel SoftBudget" sub="Vue Product Owner des 12 sections du PDF, avec acces direct aux fonctions implementees." />
      <div className="sbe-stat-grid">{coverage.map((item) => <Stat key={item.label} label={item.label} value={item.value} />)}</div>
      <div className="sbe-section-grid">
        {SECTION_CATALOG.map((section) => {
          const Icon = section.icon;
          return (
            <button key={section.id} onClick={() => setView(section.view)} className="sbe-section-card">
              <span style={{ background: `${section.color}12`, color: section.color }}><Icon size={20} /></span>
              <b>{section.id}. {section.title}</b>
              <em>{section.done}</em>
              <small>Ouvrir <ArrowRight size={13} /></small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BudgetPlanningView({ state, derived, onAction }) {
  const periods = state.periodes || [];
  const monthlyOpen = periods.filter((period) => period.statut === "ouvert").length;
  return (
    <div className="sbe-stack">
      <PageHead title="Gestion des budgets entreprise" sub="Construction, versions, periodes, revisions, scenarios et workflow budgetaire." action={<Button icon={RefreshCw} onClick={() => onAction("budget.import")}>Simuler import Excel/CSV</Button>} />
      <div className="sbe-stat-grid">
        <Stat label="Budget reference" value={formatMoney(derived.totals.budget)} color={C.blue} />
        <Stat label="Versions budgetaires" value={(state.budgetVersions || []).length} />
        <Stat label="Periodes ouvertes" value={monthlyOpen} color={C.amber} />
        <Stat label="Demandes revision" value={(state.revisionRequests || []).filter((r) => r.statut === "en_attente").length} color={C.red} />
      </div>
      <div className="sbe-grid-2">
        <Card title="Versions et rolling forecast" action={<Button tone="light" icon={GitBranch} onClick={() => onAction("budget.version")}>Nouvelle version</Button>}>
          <DataTable
            columns={[
              { key: "nom", label: "Version", render: (row) => <><b>{row.nom}</b><small>{row.commentaire}</small></> },
              { key: "type", label: "Type", render: (row) => <Pill color={row.type === "initial" ? C.blue : C.primary}>{row.type}</Pill> },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "approuve" ? C.primary : C.amber}>{row.statut}</Pill> },
              { key: "montantTotal", label: "Montant", render: (row) => formatMoney(row.montantTotal) },
            ]}
            rows={state.budgetVersions || []}
          />
        </Card>
        <Card title="Scenarios budgetaires" action={<Button tone="light" icon={Sparkles} onClick={() => onAction("budget.scenario")}>Generer scenario</Button>}>
          <DataTable
            columns={[
              { key: "nom", label: "Scenario", render: (row) => <><b>{row.nom}</b><small>{row.hypothese}</small></> },
              { key: "impact", label: "Impact", render: (row) => <span style={{ color: row.impact > 0 ? C.red : C.primary, fontWeight: 900 }}>{formatMoney(row.impact)}</span> },
              { key: "probabilite", label: "Prob.", render: (row) => formatPercent(row.probabilite) },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "reference" ? C.blue : C.amber}>{row.statut}</Pill> },
            ]}
            rows={state.budgetScenarios || []}
          />
        </Card>
      </div>
      <div className="sbe-grid-2">
        <Card title="Workflow budgetaire">
          <DataTable
            columns={[
              { key: "objet", label: "Objet", render: (row) => <><b>{row.objet}</b><small>{row.demandeur}</small></> },
              { key: "montant", label: "Montant", render: (row) => formatMoney(row.montant) },
              { key: "etape", label: "Etape" },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "en_validation" ? C.amber : C.red}>{row.statut}</Pill> },
            ]}
            rows={state.budgetWorkflowItems || []}
          />
        </Card>
        <Card title="Demandes de revision / virement" action={<Button tone="light" icon={CheckCircle2} onClick={() => onAction("revision.approveFirst")}>Approuver 1ere demande</Button>}>
          <DataTable
            columns={[
              { key: "motif", label: "Motif", render: (row) => <><b>{row.motif}</b><small>{row.demandeur}</small></> },
              { key: "montant", label: "Montant", render: (row) => formatMoney(row.montant) },
              { key: "date", label: "Date" },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "approuvee" ? C.primary : C.amber}>{row.statut}</Pill> },
            ]}
            rows={state.revisionRequests || []}
          />
        </Card>
      </div>
      <Card title="Calendrier mensuel et cloture">
        <div className="sbe-period-grid">
          {periods.map((period) => (
            <button key={period.id} onClick={() => onAction("period.toggle", period.id)} className={period.statut === "ouvert" ? "sbe-period open" : "sbe-period"}>
              <b>{period.mois}</b>
              <span>{period.statut}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function WorkflowEnterpriseView({ state, derived, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Workflow & approbations" sub="Circuits de validation parametres par montant, nature, delegation et SLA." action={<Button icon={CheckCircle2} onClick={() => onAction("validation.bulkApprove")}>Bulk approve demandes</Button>} />
      <div className="sbe-grid-2">
        <Card title="Matrice d'approbation">
          <DataTable
            columns={[
              { key: "libelle", label: "Regle", render: (row) => <><b>{row.libelle}</b><small>{row.departement} - SLA {row.slaHeures}h</small></> },
              { key: "nature", label: "Nature" },
              { key: "seuil", label: "Seuil", render: (row) => `${formatMoney(row.seuilMin)} - ${formatMoney(row.seuilMax)}` },
              { key: "circuit", label: "Circuit" },
            ]}
            rows={state.approvalRules || []}
          />
        </Card>
        <Card title="Delegations actives">
          <DataTable
            columns={[
              { key: "delegant", label: "Delegant" },
              { key: "delegataire", label: "Delegataire" },
              { key: "role", label: "Role" },
              { key: "periode", label: "Periode", render: (row) => `${row.dateDebut} -> ${row.dateFin}` },
            ]}
            rows={state.delegations || []}
          />
        </Card>
      </div>
      <Card title="File de validation operationnelle">
        <DataTable
          columns={[
            { key: "engagement", label: "Engagement", render: (row) => <><b>{row.engagement?.objet || row.engagementId}</b><small>{row.motifDeclenchement}</small></> },
            { key: "montant", label: "Montant", render: (row) => formatMoney(row.engagement?.montant) },
            { key: "valideur", label: "Valideur" },
            { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "en_attente" ? C.amber : C.primary}>{row.statut}</Pill> },
          ]}
          rows={derived.validations || []}
        />
      </Card>
    </div>
  );
}

export function ReportingEnterpriseView({ state, derived, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Reporting & tableaux de bord" sub="Rapports standards, diffusion, donnees live et exports." action={<Button icon={BarChart3} onClick={() => onAction("report.generateAll")}>Generer rapports</Button>} />
      <div className="sbe-stat-grid">
        <Stat label="Taux global" value={formatPercent(derived.totals.taux)} />
        <Stat label="Rapports standards" value={(state.reports || []).length} color={C.blue} />
        <Stat label="Depassements" value={derived.lignes.filter((line) => line.taux >= 100).length} color={C.red} />
        <Stat label="Alertes" value={derived.alerts.length} color={C.amber} />
      </div>
      <Card title="Catalogue des rapports">
        <DataTable
          columns={[
            { key: "nom", label: "Rapport", render: (row) => <><b>{row.nom}</b><small>{row.destinataires}</small></> },
            { key: "frequence", label: "Frequence" },
            { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "pret" ? C.primary : C.amber}>{row.statut}</Pill> },
            { key: "derniereGeneration", label: "Derniere generation", render: (row) => row.derniereGeneration || "-" },
          ]}
          rows={state.reports || []}
        />
      </Card>
      <Card title="Vue Budget / Engage / Realise par departement">
        <DataTable
          columns={[
            { key: "label", label: "Departement" },
            { key: "budget", label: "Budget", render: (row) => formatMoney(row.budget) },
            { key: "engage", label: "Engage", render: (row) => formatMoney(row.engage) },
            { key: "realise", label: "Realise", render: (row) => formatMoney(row.realise) },
          ]}
          rows={derived.byDepartment || []}
        />
      </Card>
    </div>
  );
}

export function ProjectsCapexView({ state, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Projets & CAPEX" sub="Portefeuille projets, jalons, avancement physique/financier et immobilisations." action={<Button icon={Rocket} onClick={() => onAction("project.advanceRisk")}>Mettre a jour avancement</Button>} />
      <div className="sbe-grid-2">
        <Card title="Portefeuille projets">
          <DataTable
            columns={[
              { key: "nom", label: "Projet", render: (row) => <><b>{row.nom}</b><small>{row.code} - sponsor {row.sponsor}</small></> },
              { key: "budget", label: "Budget", render: (row) => formatMoney(row.budget) },
              { key: "avancement", label: "Avancement", render: (row) => <Progress value={row.avancement} color={row.statut === "risque" ? C.red : C.primary} /> },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "risque" ? C.red : C.primary}>{row.statut}</Pill> },
            ]}
            rows={state.projects || []}
          />
        </Card>
        <Card title="Fiches immobilisation CAPEX">
          <DataTable
            columns={[
              { key: "libelle", label: "Actif", render: (row) => <><b>{row.libelle}</b><small>Mise en service {row.miseEnService}</small></> },
              { key: "montant", label: "Montant", render: (row) => formatMoney(row.montant) },
              { key: "dureeAmortissement", label: "Amort.", render: (row) => `${row.dureeAmortissement} ans` },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "en_reception" ? C.amber : C.blue}>{row.statut}</Pill> },
            ]}
            rows={state.capexAssets || []}
          />
        </Card>
      </div>
    </div>
  );
}

function Progress({ value, color = C.primary }) {
  return (
    <div>
      <div style={{ height: 8, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
        <div style={{ width: `${Math.max(0, Math.min(100, numberValue(value)))}%`, background: color, height: "100%" }} />
      </div>
      <small>{formatPercent(value)}</small>
    </div>
  );
}

export function IntegrationsEnterpriseView({ state, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Integrations & interop" sub="Connecteurs ERP, achats, fichiers plats, API et webhooks." action={<Button icon={PlugZap} onClick={() => onAction("integration.syncAll")}>Synchroniser</Button>} />
      <div className="sbe-grid-2">
        <Card title="Connecteurs">
          <DataTable
            columns={[
              { key: "nom", label: "Connecteur", render: (row) => <><b>{row.nom}</b><small>{row.flux}</small></> },
              { key: "type", label: "Type" },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "connecte" ? C.primary : row.statut === "alerte" ? C.red : C.amber}>{row.statut}</Pill> },
              { key: "erreurs", label: "Erreurs" },
            ]}
            rows={state.integrations || []}
          />
        </Card>
        <Card title="Evenements API / webhooks">
          <DataTable
            columns={[
              { key: "event", label: "Evenement" },
              { key: "cible", label: "Cible" },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "livre" ? C.primary : C.amber}>{row.statut}</Pill> },
              { key: "date", label: "Date" },
            ]}
            rows={state.apiEvents || []}
          />
        </Card>
      </div>
    </div>
  );
}

export function SecurityEnterpriseView({ state, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Securite, acces & conformite" sub="RBAC, separation des taches, revue d'acces, audit et conformite." action={<Button icon={ShieldCheck} onClick={() => onAction("security.reviewProgress")}>Avancer revue</Button>} />
      <div className="sbe-grid-2">
        <Card title="Roles et droits">
          <DataTable
            columns={[
              { key: "nom", label: "Role", render: (row) => <><b>{row.nom}</b><small>{row.droits.join(", ")}</small></> },
              { key: "sod", label: "SoD", render: (row) => <Pill color={row.sod === "Critique" ? C.red : row.sod === "A surveiller" ? C.amber : C.primary}>{row.sod}</Pill> },
            ]}
            rows={state.roles || []}
          />
        </Card>
        <Card title="Utilisateurs budget">
          <DataTable
            columns={[
              { key: "nom", label: "Utilisateur" },
              { key: "roleId", label: "Role" },
              { key: "departement", label: "Departement" },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "temporaire" ? C.amber : C.primary}>{row.statut}</Pill> },
            ]}
            rows={state.securityUsers || []}
          />
        </Card>
      </div>
      <Card title="Revues d'acces">
        <DataTable
          columns={[
            { key: "perimetre", label: "Perimetre" },
            { key: "couverture", label: "Couverture", render: (row) => <Progress value={row.couverture} color={row.couverture < 80 ? C.amber : C.primary} /> },
            { key: "echeance", label: "Echeance" },
            { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "en_cours" ? C.amber : C.muted}>{row.statut}</Pill> },
          ]}
          rows={state.accessReviews || []}
        />
      </Card>
    </div>
  );
}

export function ForecastEnterpriseView({ state, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Prevision & intelligence avancee" sub="Rolling forecast, atterrissage, what-if et scoring du risque." action={<Button icon={Sparkles} onClick={() => onAction("forecast.run")}>Lancer forecast</Button>} />
      <div className="sbe-grid-2">
        <Card title="Runs de prevision">
          <DataTable
            columns={[
              { key: "nom", label: "Run", render: (row) => <><b>{row.nom}</b><small>{row.methode} - {row.horizon}</small></> },
              { key: "prevision", label: "Prevision", render: (row) => formatMoney(row.prevision) },
              { key: "ecart", label: "Ecart", render: (row) => <span style={{ color: row.prevision > row.budget ? C.red : C.primary, fontWeight: 900 }}>{formatMoney(row.prevision - row.budget)}</span> },
              { key: "risque", label: "Risque", render: (row) => <Pill color={row.risque === "eleve" ? C.red : C.amber}>{row.risque}</Pill> },
            ]}
            rows={state.forecastRuns || []}
          />
        </Card>
        <Card title="Scenarios what-if">
          <DataTable
            columns={[
              { key: "nom", label: "Scenario", render: (row) => <><b>{row.nom}</b><small>{row.hypothese}</small></> },
              { key: "impact", label: "Impact", render: (row) => formatMoney(row.impact) },
              { key: "probabilite", label: "Prob.", render: (row) => formatPercent(row.probabilite) },
              { key: "statut", label: "Statut" },
            ]}
            rows={state.budgetScenarios || []}
          />
        </Card>
      </div>
    </div>
  );
}

export function ConsolidationEnterpriseView({ state, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Multi-entites & consolidation groupe" sub="Remontee budgetaire, devises, contributions et retraitements groupe." action={<Button icon={Building2} onClick={() => onAction("consolidation.collect")}>Collecter packages</Button>} />
      <div className="sbe-grid-2">
        <Card title="Entites legales">
          <DataTable
            columns={[
              { key: "nom", label: "Entite", render: (row) => <><b>{row.nom}</b><small>{row.code} - {row.devise}</small></> },
              { key: "budget", label: "Budget", render: (row) => formatMoney(row.budget) },
              { key: "realise", label: "Realise", render: (row) => formatMoney(row.realise) },
              { key: "contribution", label: "Contribution", render: (row) => formatPercent(row.contribution) },
            ]}
            rows={state.groupEntities || []}
          />
        </Card>
        <Card title="Packages de consolidation">
          <DataTable
            columns={[
              { key: "nom", label: "Package" },
              { key: "entites", label: "Reception", render: (row) => `${row.entitesRecues}/${row.entitesAttendues}` },
              { key: "ecarts", label: "Ecarts" },
              { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "en_collecte" ? C.amber : C.red}>{row.statut}</Pill> },
            ]}
            rows={state.consolidationPackages || []}
          />
        </Card>
      </div>
    </div>
  );
}

export function EnterpriseAdminView({ state, onAction }) {
  return (
    <div className="sbe-stack">
      <PageHead title="Administration entreprise" sub="Support, taches d'administration, modeles et exploitation." action={<Button icon={CheckCircle2} onClick={() => onAction("admin.completeTask")}>Cloturer une tache</Button>} />
      <Card title="Backlog admin et exploitation">
        <DataTable
          columns={[
            { key: "tache", label: "Tache" },
            { key: "responsable", label: "Responsable" },
            { key: "priorite", label: "Priorite", render: (row) => <Pill color={row.priorite === "haute" ? C.red : row.priorite === "moyenne" ? C.amber : C.primary}>{row.priorite}</Pill> },
            { key: "statut", label: "Statut", render: (row) => <Pill color={row.statut === "pret" ? C.primary : C.amber}>{row.statut}</Pill> },
          ]}
          rows={state.adminTasks || []}
        />
      </Card>
    </div>
  );
}

export function EnterpriseStyles() {
  return (
    <style>{`
      .sbe-stack{display:flex;flex-direction:column;gap:16px;max-width:1480px;margin:0 auto;width:100%}
      .sbe-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
      .sbe-head h1{font-size:22px;line-height:1.1;margin:0;color:${C.text};font-weight:950;letter-spacing:0}
      .sbe-head span{font-size:12px;color:${C.muted};display:block;margin-top:5px}
      .sbe-card{background:${C.white};border:1px solid ${C.border};border-radius:8px;box-shadow:0 1px 4px rgba(15,23,42,.05);padding:16px}
      .sbe-card-title{font-size:13px;font-weight:950;color:${C.text};margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}
      .sbe-grid-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
      .sbe-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
      .sbe-stat{background:${C.white};border:1px solid ${C.border};border-radius:8px;padding:14px;box-shadow:0 1px 4px rgba(15,23,42,.05)}
      .sbe-stat span{font-size:11px;font-weight:900;color:${C.muted};text-transform:uppercase;letter-spacing:.05em;display:block}
      .sbe-stat b{font-size:22px;font-weight:950;margin-top:7px;display:block}
      .sbe-section-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      .sbe-section-card{background:${C.white};border:1px solid ${C.border};border-radius:8px;text-align:left;padding:14px;display:flex;flex-direction:column;gap:10px;cursor:pointer;font-family:inherit;box-shadow:0 1px 4px rgba(15,23,42,.05)}
      .sbe-section-card > span{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center}
      .sbe-section-card b{font-size:14px;color:${C.text}}
      .sbe-section-card em{font-size:12px;color:${C.muted};font-style:normal;line-height:1.45}
      .sbe-section-card small{font-size:11px;font-weight:900;color:${C.primary};display:flex;align-items:center;gap:5px}
      .sbe-table-wrap{overflow:auto;border:1px solid ${C.border};border-radius:8px}
      .sbe-table{width:100%;border-collapse:collapse;min-width:620px}
      .sbe-table th{background:${C.light};color:#475569;text-align:left;padding:10px 11px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid ${C.border};white-space:nowrap}
      .sbe-table td{padding:11px;border-bottom:1px solid ${C.border};font-size:12.5px;vertical-align:middle;color:${C.text}}
      .sbe-table td b{display:block;font-size:12.8px}
      .sbe-table td small{display:block;font-size:11px;color:${C.muted};margin-top:3px}
      .sbe-empty{padding:18px;color:${C.muted};font-size:13px;text-align:center}
      .sbe-period-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}
      .sbe-period{border:1px solid ${C.border};background:${C.light};border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:4px;text-align:left;cursor:pointer;font-family:inherit}
      .sbe-period.open{background:#ecfdf5;border-color:#0f766e44}
      .sbe-period b{font-size:12px;color:${C.text}}
      .sbe-period span{font-size:11px;color:${C.muted}}
      @media (max-width:1100px){.sbe-grid-2,.sbe-section-grid{grid-template-columns:1fr}.sbe-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sbe-period-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media (max-width:720px){.sbe-stat-grid{grid-template-columns:1fr}.sbe-period-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `}</style>
  );
}

