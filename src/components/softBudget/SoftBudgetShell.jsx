"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  ClipboardList,
  Receipt,
  CheckCircle2,
  Bell,
  Settings,
  Plus,
  Download,
  RotateCcw,
  X,
  Save,
  AlertTriangle,
  Lock,
  Unlock,
  Send,
  Ban,
  FileText,
  Check,
  XCircle,
  Play,
  Archive,
  Filter,
  Search,
  Trash2,
  Edit3,
  SlidersHorizontal,
  Users,
  Building2,
  CalendarDays,
  ArrowRight,
  ChevronRight,
  BarChart3,
  BookOpenCheck,
  FileSpreadsheet,
  Layers3,
  PlugZap,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useIsMobile } from "../../lib/useResponsive";
import { Topbar } from "../layout/Topbar";
import ChatBox from "../chat/ChatBox";
import {
  SOFT_BUDGET_STORAGE_KEY,
  STATUS_META,
  LINE_STATUS_META,
  VALIDATION_STATUS_META,
  clone,
  createSoftBudgetSeed,
  deriveSoftBudget,
  evaluateEngagementProjection,
  formatMoney,
  formatPercent,
  nowIso,
  numberValue,
  normalizeSoftBudgetState,
  shouldRouteValidation,
  todayIso,
  uid,
  addAudit,
} from "./softBudgetCore";
import {
  BudgetPlanningView,
  ConsolidationEnterpriseView,
  EnterpriseAdminView,
  EnterpriseReferenceView,
  EnterpriseStyles,
  ForecastEnterpriseView,
  IntegrationsEnterpriseView,
  ProjectsCapexView,
  ReportingEnterpriseView,
  SecurityEnterpriseView,
  WorkflowEnterpriseView,
} from "./SoftBudgetEnterprise";

const C = {
  bg: "#f6f8fb",
  side: "#12212f",
  side2: "#172c3d",
  primary: "#0f766e",
  primary2: "#0d9488",
  blue: "#2563eb",
  amber: "#d97706",
  red: "#dc2626",
  text: "#0f172a",
  muted: "#64748b",
  light: "#f8fafc",
  border: "#e2e8f0",
  white: "#ffffff",
};

const NAV = [
  { id: "budget-referentiel", label: "Referentiel PDF", icon: BookOpenCheck },
  { id: "budget-dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "budget-planning", label: "Construction budget", icon: FileSpreadsheet },
  { id: "budget-budgets", label: "Lignes budgetaires", icon: Wallet },
  { id: "budget-engagements", label: "Engagements", icon: ClipboardList },
  { id: "budget-depenses", label: "Depenses", icon: Receipt },
  { id: "budget-validations", label: "Validations", icon: CheckCircle2, countKey: "validations" },
  { id: "budget-workflow", label: "Workflow avance", icon: Workflow, countKey: "validations" },
  { id: "budget-alertes", label: "Alertes & controle", icon: Bell, countKey: "alerts" },
  { id: "budget-reporting", label: "Reporting", icon: BarChart3 },
  { id: "budget-projects", label: "Projets & CAPEX", icon: Rocket },
  { id: "budget-integrations", label: "Integrations", icon: PlugZap },
  { id: "budget-security", label: "Securite & acces", icon: ShieldCheck },
  { id: "budget-forecast", label: "Prevision IA", icon: Sparkles },
  { id: "budget-consolidation", label: "Consolidation", icon: Layers3 },
  { id: "budget-admin", label: "Admin entreprise", icon: Settings },
  { id: "budget-parametrage", label: "Parametrage", icon: Settings },
];

const PIE_COLORS = ["#0f766e", "#2563eb", "#f59e0b", "#dc2626"];

function DepartmentBars({ data }) {
  const max = Math.max(1, ...data.map((item) => Math.max(item.budget, item.engage, item.realise)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((item) => (
        <div key={item.id} style={{ display: "grid", gridTemplateColumns: "88px 1fr 86px", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              ["Budget", item.budget, "#94a3b8"],
              ["Engage", item.engage, "#f59e0b"],
              ["Realise", item.realise, C.primary],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 7, alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: C.muted }}>{label}</span>
                <div style={{ height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(2, Math.min(100, (numberValue(value) / max) * 100))}%`, height: "100%", background: color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: C.muted, fontWeight: 800 }}>{formatMoney(item.realise)}</div>
        </div>
      ))}
    </div>
  );
}

function NatureDonut({ data }) {
  const total = Math.max(1, data.reduce((sum, item) => sum + numberValue(item.value), 0));
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 18, alignItems: "center", minHeight: 260 }}>
      <svg viewBox="0 0 160 160" width="180" height="180" role="img" aria-label="Repartition CAPEX OPEX">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
        {data.map((item, index) => {
          const length = (numberValue(item.value) / total) * circumference;
          const segment = (
            <circle
              key={item.name}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={PIE_COLORS[index % PIE_COLORS.length]}
              strokeWidth="18"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          );
          offset += length;
          return segment;
        })}
        <text x="80" y="75" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.muted}>Realise</text>
        <text x="80" y="96" textAnchor="middle" fontSize="18" fontWeight="950" fill={C.text}>{formatMoney(total)}</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((item, index) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", background: C.light }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 900, color: C.text }}>
              <i style={{ width: 10, height: 10, borderRadius: 999, background: PIE_COLORS[index % PIE_COLORS.length], display: "inline-block" }} />
              {item.name}
            </span>
            <b style={{ fontSize: 13 }}>{formatMoney(item.value)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function loadState() {
  try {
    const saved = localStorage.getItem(SOFT_BUDGET_STORAGE_KEY);
    return normalizeSoftBudgetState(saved ? JSON.parse(saved) : null);
  } catch {
    return createSoftBudgetSeed();
  }
}

function persistState(state) {
  try {
    localStorage.setItem(SOFT_BUDGET_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function badge(meta, extra = {}) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 9px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    color: meta.color,
    background: meta.bg,
    border: `1px solid ${meta.color}22`,
    whiteSpace: "nowrap",
    ...extra,
  };
}

function Button({ children, icon: Icon, variant = "primary", size = "md", style, ...props }) {
  const palette = {
    primary: { bg: C.primary, fg: C.white, bd: C.primary },
    blue: { bg: C.blue, fg: C.white, bd: C.blue },
    danger: { bg: C.red, fg: C.white, bd: C.red },
    light: { bg: C.white, fg: C.text, bd: C.border },
    ghost: { bg: "transparent", fg: C.muted, bd: "transparent" },
    warning: { bg: "#fffbeb", fg: "#b45309", bd: "#f59e0b55" },
  }[variant] || { bg: C.primary, fg: C.white, bd: C.primary };
  return (
    <button
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        border: `1px solid ${palette.bd}`,
        background: props.disabled ? "#cbd5e1" : palette.bg,
        color: props.disabled ? "#64748b" : palette.fg,
        borderRadius: 7,
        minHeight: size === "sm" ? 30 : 36,
        padding: size === "sm" ? "5px 10px" : "8px 13px",
        fontSize: size === "sm" ? 12 : 13,
        fontWeight: 800,
        cursor: props.disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        transition: "background .15s, transform .15s, border-color .15s",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

function Field({ label, children, span = 1 }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, gridColumn: `span ${span}` }}>
      <span style={{ fontSize: 11, fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${C.border}`,
  borderRadius: 7,
  padding: "9px 11px",
  fontSize: 13,
  color: C.text,
  background: C.white,
  outline: "none",
  fontFamily: "inherit",
};

function Modal({ title, children, footer, onClose, wide = false }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(15,23,42,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: wide ? 860 : 560, maxHeight: "calc(100vh - 32px)", background: C.white, borderRadius: 10, boxShadow: "0 24px 80px rgba(15,23,42,.35)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "15px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>{title}</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 18, overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "12px 18px", borderTop: `1px solid ${C.border}`, background: C.light, display: "flex", justifyContent: "flex-end", gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, engaged, realized, budget, color }) {
  const safeBudget = Math.max(1, numberValue(budget));
  const realizedPct = Math.max(0, Math.min(100, (numberValue(realized) / safeBudget) * 100));
  const engagedPct = Math.max(0, Math.min(100 - realizedPct, (numberValue(engaged) / safeBudget) * 100));
  return (
    <div>
      <div style={{ height: 9, borderRadius: 999, background: "#e2e8f0", overflow: "hidden", display: "flex" }}>
        <div title="Realise" style={{ width: `${realizedPct}%`, background: color || C.primary }} />
        <div title="Engage" style={{ width: `${engagedPct}%`, background: "#f59e0b" }} />
      </div>
      <div style={{ marginTop: 4, fontSize: 10.5, color: C.muted, display: "flex", justifyContent: "space-between" }}>
        <span>{formatPercent(value)}</span>
        <span>{formatMoney(numberValue(realized) + numberValue(engaged))}</span>
      </div>
    </div>
  );
}

function Kpi({ title, value, sub, icon: Icon, color = C.primary }) {
  return (
    <div className="sb-card" style={{ padding: 16, minHeight: 112 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: `${color}12`, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {Icon && <Icon size={19} />}
        </div>
        <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".06em", color: C.muted }}>{title}</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 950, color: C.text, marginTop: 12, letterSpacing: "-.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function EmptyState({ title }) {
  return (
    <div style={{ padding: 30, border: `1px dashed ${C.border}`, borderRadius: 8, textAlign: "center", color: C.muted, background: C.light }}>
      <FileText size={26} style={{ marginBottom: 8, color: "#94a3b8" }} />
      <div style={{ fontSize: 13, fontWeight: 800 }}>{title}</div>
    </div>
  );
}

function SoftBudgetSidebar({ activeView, setView, sidebarOpen, derived, onReset }) {
  const compact = !sidebarOpen;
  return (
    <aside style={{ width: compact ? 62 : 258, background: C.side, color: C.white, height: "100vh", display: "flex", flexDirection: "column", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,.08)", transition: "width .2s", overflow: "hidden" }}>
      <div style={{ padding: compact ? "13px 9px" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <img src="/softbudget-logo.svg" alt="SoftBudget" style={{ width: 31, height: 31, objectFit: "cover", objectPosition: "left" }} />
        </div>
        {!compact && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.1 }}>SoftBudget</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.48)", marginTop: 2 }}>Pilotage budgetaire</div>
          </div>
        )}
      </div>
      <nav style={{ padding: "10px 8px", overflowY: "auto", flex: 1 }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          const count = item.countKey === "validations" ? derived.pendingValidationCount : item.countKey === "alerts" ? derived.alerts.length : 0;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              title={compact ? item.label : undefined}
              style={{
                width: "100%",
                minHeight: 40,
                border: "none",
                borderRadius: 8,
                background: active ? "rgba(20,184,166,.16)" : "transparent",
                color: active ? "#5eead4" : "rgba(255,255,255,.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: compact ? "center" : "flex-start",
                gap: 10,
                padding: compact ? "0" : "8px 10px",
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 3,
                borderLeft: active && !compact ? "3px solid #5eead4" : "3px solid transparent",
              }}
            >
              <Icon size={18} />
              {!compact && <span style={{ fontSize: 12.5, fontWeight: active ? 850 : 650, flex: 1, textAlign: "left" }}>{item.label}</span>}
              {!compact && count > 0 && <span style={{ fontSize: 10, fontWeight: 900, background: item.countKey === "alerts" ? "#f97316" : "#14b8a6", color: C.white, borderRadius: 999, padding: "2px 7px" }}>{count}</span>}
            </button>
          );
        })}
      </nav>
      {!compact && (
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <Button icon={RotateCcw} variant="ghost" size="sm" onClick={onReset} style={{ width: "100%", color: "rgba(255,255,255,.72)", borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)" }}>
            Reinitialiser
          </Button>
        </div>
      )}
    </aside>
  );
}

function ModuleToolbar({ state, derived, updateParams, role, setRole, onReset }) {
  const exercices = derived.exercices || [];
  return (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <img src="/softbudget-logo.svg" alt="SoftBudget" style={{ height: 30, objectFit: "contain" }} />
        <ChevronRight size={14} color="#94a3b8" />
      </div>
      <select value={state.parametres.exerciceCourantId} onChange={(e) => updateParams({ exerciceCourantId: e.target.value }, "changement_exercice")} style={{ ...inputStyle, width: 150 }}>
        {exercices.map((exercice) => <option key={exercice.id} value={exercice.id}>{exercice.annee} - {exercice.statut}</option>)}
      </select>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, width: 190 }}>
        <option value="super">Super-utilisateur</option>
        <option value="controleur">Controleuse de gestion</option>
        <option value="responsable">Responsable budget</option>
        <option value="daf">DAF valideur</option>
        <option value="admin">Admin</option>
      </select>
      <div style={{ display: "inline-flex", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: C.light }}>
        {["souple", "strict"].map((mode) => (
          <button
            key={mode}
            onClick={() => updateParams({ modeControle: mode }, "mode_controle")}
            style={{ border: "none", padding: "8px 12px", background: state.parametres.modeControle === mode ? C.primary : "transparent", color: state.parametres.modeControle === mode ? C.white : C.muted, fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}
          >
            {mode}
          </button>
        ))}
      </div>
      <span style={badge(derived.totals.health, { marginLeft: "auto" })}>Conso globale {formatPercent(derived.totals.taux)}</span>
      <Button icon={RotateCcw} variant="light" size="sm" onClick={onReset}>Reset demo</Button>
    </div>
  );
}

function DashboardView({ derived, setView, exportCsv }) {
  const [filters, setFilters] = useState({ dept: "all", nature: "all" });
  const filteredLines = derived.lignes.filter((line) =>
    (filters.dept === "all" || line.axeDepartementId === filters.dept) &&
    (filters.nature === "all" || line.nature === filters.nature)
  );
  const totals = {
    budget: filteredLines.reduce((sum, line) => sum + line.budget, 0),
    engage: filteredLines.reduce((sum, line) => sum + line.engage, 0),
    realise: filteredLines.reduce((sum, line) => sum + line.realise, 0),
  };
  totals.disponible = totals.budget - totals.engage - totals.realise;
  totals.taux = totals.budget ? ((totals.engage + totals.realise) / totals.budget) * 100 : 0;

  const topLines = [...filteredLines].sort((a, b) => b.taux - a.taux).slice(0, 5);
  const deptLabels = new Set(filteredLines.map((line) => line.axeDepartementId));
  const chartData = derived.byDepartment.filter((dept) => deptLabels.has(dept.id));

  return (
    <div className="sb-stack">
      <div className="sb-page-head">
        <div>
          <h1>Tableau de bord</h1>
          <span>Pilotage Budget / Engage / Realise / Disponible</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={filters.dept} onChange={(e) => setFilters((p) => ({ ...p, dept: e.target.value }))} style={{ ...inputStyle, width: 190 }}>
            <option value="all">Tous departements</option>
            {derived.axes.filter((axis) => axis.type === "departement").map((axis) => <option key={axis.id} value={axis.id}>{axis.libelle}</option>)}
          </select>
          <select value={filters.nature} onChange={(e) => setFilters((p) => ({ ...p, nature: e.target.value }))} style={{ ...inputStyle, width: 130 }}>
            <option value="all">CAPEX/OPEX</option>
            <option value="CAPEX">CAPEX</option>
            <option value="OPEX">OPEX</option>
          </select>
          <Button icon={Download} variant="light" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="sb-kpi-grid">
        <Kpi title="Budget total" value={formatMoney(totals.budget)} icon={Wallet} color={C.blue} />
        <Kpi title="Engage" value={formatMoney(totals.engage)} sub={`${formatPercent(totals.budget ? (totals.engage / totals.budget) * 100 : 0)} du budget`} icon={ClipboardList} color="#d97706" />
        <Kpi title="Realise" value={formatMoney(totals.realise)} sub={`${formatPercent(totals.budget ? (totals.realise / totals.budget) * 100 : 0)} du budget`} icon={Receipt} color={C.primary} />
        <Kpi title="Disponible" value={formatMoney(totals.disponible)} sub={totals.disponible < 0 ? "Depassement global" : "Solde disponible"} icon={CheckCircle2} color={totals.disponible < 0 ? C.red : "#16a34a"} />
      </div>

      <div className="sb-grid-2">
        <div className="sb-card" style={{ padding: 16 }}>
          <div className="sb-card-title">Budget vs engage vs realise</div>
          <DepartmentBars data={chartData} />
        </div>
        <div className="sb-card" style={{ padding: 16 }}>
          <div className="sb-card-title">Realise CAPEX / OPEX</div>
          <NatureDonut data={derived.byNature} />
        </div>
      </div>

      <div className="sb-grid-2">
        <div className="sb-card" style={{ padding: 16 }}>
          <div className="sb-card-title">Top depassements</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topLines.map((line) => (
              <button key={line.id} onClick={() => setView("budget-budgets")} style={{ textAlign: "left", border: `1px solid ${C.border}`, background: C.white, borderRadius: 8, padding: 12, cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <b style={{ fontSize: 13, color: C.text }}>{line.libelle}</b>
                  <span style={badge(line.health)}>{line.health.label}</span>
                </div>
                <ProgressBar value={line.taux} engaged={line.engage} realized={line.realise} budget={line.budget} color={line.health.color} />
              </button>
            ))}
          </div>
        </div>
        <div className="sb-card" style={{ padding: 16 }}>
          <div className="sb-card-title">Alertes recentes</div>
          <AlertList alerts={derived.alerts.slice(0, 7)} compact />
        </div>
      </div>
    </div>
  );
}

function BudgetLinesView({ derived, openLineModal, toggleFreezeLine, deleteLine }) {
  const [filters, setFilters] = useState({ search: "", dept: "all", project: "all", nature: "all", health: "all" });
  const filtered = derived.lignes.filter((line) => {
    const q = filters.search.trim().toLowerCase();
    return (!q || `${line.libelle} ${line.departementLabel} ${line.projetLabel}`.toLowerCase().includes(q)) &&
      (filters.dept === "all" || line.axeDepartementId === filters.dept) &&
      (filters.project === "all" || line.axeProjetId === filters.project) &&
      (filters.nature === "all" || line.nature === filters.nature) &&
      (filters.health === "all" || line.health.key === filters.health);
  });
  return (
    <div className="sb-stack">
      <div className="sb-page-head">
        <div>
          <h1>Budgets</h1>
          <span>{filtered.length} lignes budgetaires</span>
        </div>
        <Button icon={Plus} onClick={() => openLineModal()}>Nouvelle ligne</Button>
      </div>
      <div className="sb-filterbar">
        <Search size={16} color={C.muted} />
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Rechercher une ligne" style={{ ...inputStyle, minWidth: 210, flex: 1 }} />
        <select value={filters.dept} onChange={(e) => setFilters((p) => ({ ...p, dept: e.target.value }))} style={{ ...inputStyle, width: 175 }}>
          <option value="all">Departement</option>
          {derived.axes.filter((axis) => axis.type === "departement").map((axis) => <option key={axis.id} value={axis.id}>{axis.libelle}</option>)}
        </select>
        <select value={filters.project} onChange={(e) => setFilters((p) => ({ ...p, project: e.target.value }))} style={{ ...inputStyle, width: 160 }}>
          <option value="all">Projet</option>
          {derived.axes.filter((axis) => axis.type === "projet").map((axis) => <option key={axis.id} value={axis.id}>{axis.libelle}</option>)}
        </select>
        <select value={filters.nature} onChange={(e) => setFilters((p) => ({ ...p, nature: e.target.value }))} style={{ ...inputStyle, width: 120 }}>
          <option value="all">Nature</option>
          <option value="CAPEX">CAPEX</option>
          <option value="OPEX">OPEX</option>
        </select>
        <select value={filters.health} onChange={(e) => setFilters((p) => ({ ...p, health: e.target.value }))} style={{ ...inputStyle, width: 145 }}>
          <option value="all">Sante</option>
          <option value="sain">Sain</option>
          <option value="vigilance">Vigilance</option>
          <option value="depassement">Depassement</option>
          <option value="critique">Critique</option>
        </select>
      </div>
      <div className="sb-card sb-table-wrap">
        <table className="sb-table">
          <thead>
            <tr>
              <th>Ligne</th>
              <th>Departement</th>
              <th>Nature</th>
              <th>Budget</th>
              <th>Engage</th>
              <th>Realise</th>
              <th>Disponible</th>
              <th>Taux</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((line) => (
              <tr key={line.id}>
                <td>
                  <b>{line.libelle}</b>
                  <span>{line.projetLabel}</span>
                </td>
                <td>{line.departementLabel}</td>
                <td><span style={badge({ color: line.nature === "CAPEX" ? C.blue : C.primary, bg: line.nature === "CAPEX" ? "#eff6ff" : "#ecfdf5" })}>{line.nature}</span></td>
                <td>{formatMoney(line.budget)}</td>
                <td>{formatMoney(line.engage)}</td>
                <td>{formatMoney(line.realise)}</td>
                <td style={{ color: line.disponible < 0 ? C.red : C.text, fontWeight: 850 }}>{formatMoney(line.disponible)}</td>
                <td style={{ minWidth: 160 }}><ProgressBar value={line.taux} engaged={line.engage} realized={line.realise} budget={line.budget} color={line.health.color} /></td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-start" }}>
                    <span style={badge(line.health)}>{line.health.label}</span>
                    <span style={badge(LINE_STATUS_META[line.statut] || LINE_STATUS_META.active)}>{LINE_STATUS_META[line.statut]?.label || line.statut}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Button size="sm" variant="light" icon={Edit3} onClick={() => openLineModal(line)}>Editer</Button>
                    <Button size="sm" variant="warning" icon={line.statut === "gelee" ? Unlock : Lock} onClick={() => toggleFreezeLine(line)}>{line.statut === "gelee" ? "Degeler" : "Geler"}</Button>
                    <Button size="sm" variant="light" icon={Trash2} onClick={() => deleteLine(line)}>Supprimer</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <div style={{ padding: 16 }}><EmptyState title="Aucune ligne pour ces filtres" /></div>}
      </div>
    </div>
  );
}

function EngagementsView({ derived, openEngagementModal, transitionEngagement, openInvoiceModal }) {
  const [filters, setFilters] = useState({ search: "", statut: "all", line: "all", supplier: "all" });
  const filtered = derived.engagements.filter((engagement) => {
    const q = filters.search.trim().toLowerCase();
    return (!q || `${engagement.objet} ${engagement.ligneLabel} ${engagement.fournisseurLabel}`.toLowerCase().includes(q)) &&
      (filters.statut === "all" || engagement.statut === filters.statut) &&
      (filters.line === "all" || engagement.ligneId === filters.line) &&
      (filters.supplier === "all" || engagement.fournisseurId === filters.supplier);
  });
  return (
    <div className="sb-stack">
      <div className="sb-page-head">
        <div>
          <h1>Engagements</h1>
          <span>{filtered.length} engagements suivis</span>
        </div>
        <Button icon={Plus} onClick={() => openEngagementModal()}>Nouvel engagement</Button>
      </div>
      <div className="sb-filterbar">
        <Search size={16} color={C.muted} />
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Rechercher un engagement" style={{ ...inputStyle, minWidth: 230, flex: 1 }} />
        <select value={filters.statut} onChange={(e) => setFilters((p) => ({ ...p, statut: e.target.value }))} style={{ ...inputStyle, width: 180 }}>
          <option value="all">Tous statuts</option>
          {Object.entries(STATUS_META).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
        </select>
        <select value={filters.line} onChange={(e) => setFilters((p) => ({ ...p, line: e.target.value }))} style={{ ...inputStyle, width: 210 }}>
          <option value="all">Toutes lignes</option>
          {derived.lignes.map((line) => <option key={line.id} value={line.id}>{line.libelle}</option>)}
        </select>
        <select value={filters.supplier} onChange={(e) => setFilters((p) => ({ ...p, supplier: e.target.value }))} style={{ ...inputStyle, width: 190 }}>
          <option value="all">Fournisseur</option>
          {derived.fournisseurs.map((f) => <option key={f.id} value={f.id}>{f.raisonSociale}</option>)}
        </select>
      </div>
      <div className="sb-card sb-table-wrap">
        <table className="sb-table">
          <thead>
            <tr>
              <th>Objet</th>
              <th>Ligne</th>
              <th>Fournisseur</th>
              <th>Montant</th>
              <th>Facture</th>
              <th>Reliquat</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((engagement) => {
              const meta = STATUS_META[engagement.statut] || STATUS_META.brouillon;
              return (
                <tr key={engagement.id}>
                  <td>
                    <b>{engagement.objet}</b>
                    <span>{engagement.type} - {engagement.date}{engagement.derogation ? " - derogation" : ""}</span>
                  </td>
                  <td>{engagement.ligneLabel}</td>
                  <td>{engagement.fournisseurLabel}</td>
                  <td>{formatMoney(engagement.montant)}</td>
                  <td>{formatMoney(engagement.facture)}</td>
                  <td style={{ fontWeight: 850 }}>{formatMoney(engagement.reliquat)}</td>
                  <td><span style={badge(meta)}>{meta.label}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {engagement.statut === "brouillon" && <Button size="sm" icon={Send} onClick={() => transitionEngagement(engagement, "soumettre")}>Soumettre</Button>}
                      {engagement.statut === "approuve" && <Button size="sm" icon={Send} onClick={() => transitionEngagement(engagement, "emettre")}>Emettre</Button>}
                      {engagement.statut === "emis" && <Button size="sm" icon={Play} onClick={() => transitionEngagement(engagement, "receptionner")}>Receptionner</Button>}
                      {["receptionne", "emis", "approuve"].includes(engagement.statut) && <Button size="sm" variant="blue" icon={Receipt} onClick={() => openInvoiceModal(engagement)}>Facturer</Button>}
                      {["approuve", "emis", "receptionne"].includes(engagement.statut) && <Button size="sm" variant="light" icon={Archive} onClick={() => transitionEngagement(engagement, "cloturer")}>Cloturer</Button>}
                      {["brouillon", "approuve", "emis"].includes(engagement.statut) && <Button size="sm" variant="light" icon={Ban} onClick={() => transitionEngagement(engagement, "annuler")}>Annuler</Button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <div style={{ padding: 16 }}><EmptyState title="Aucun engagement" /></div>}
      </div>
    </div>
  );
}

function DepensesView({ derived, openExpenseModal }) {
  const [filters, setFilters] = useState({ line: "all", type: "all", period: "" });
  const filtered = derived.depenses.filter((depense) =>
    (filters.line === "all" || depense.ligneId === filters.line) &&
    (filters.type === "all" || depense.type === filters.type) &&
    (!filters.period || depense.date?.startsWith(filters.period))
  );
  return (
    <div className="sb-stack">
      <div className="sb-page-head">
        <div>
          <h1>Depenses</h1>
          <span>{filtered.length} realisations</span>
        </div>
        <Button icon={Plus} onClick={() => openExpenseModal()}>Nouvelle depense</Button>
      </div>
      <div className="sb-filterbar">
        <Filter size={16} color={C.muted} />
        <input type="month" value={filters.period} onChange={(e) => setFilters((p) => ({ ...p, period: e.target.value }))} style={{ ...inputStyle, width: 150 }} />
        <select value={filters.line} onChange={(e) => setFilters((p) => ({ ...p, line: e.target.value }))} style={{ ...inputStyle, width: 240 }}>
          <option value="all">Toutes lignes</option>
          {derived.lignes.map((line) => <option key={line.id} value={line.id}>{line.libelle}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))} style={{ ...inputStyle, width: 150 }}>
          <option value="all">Tous types</option>
          <option value="facture">Facture</option>
          <option value="note_de_frais">Note de frais</option>
          <option value="avoir">Avoir</option>
        </select>
      </div>
      <div className="sb-card sb-table-wrap">
        <table className="sb-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Ligne</th>
              <th>Fournisseur</th>
              <th>Engagement</th>
              <th>Piece</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((depense) => (
              <tr key={depense.id}>
                <td>{depense.date}</td>
                <td><span style={badge({ color: depense.type === "avoir" ? C.red : C.primary, bg: depense.type === "avoir" ? "#fef2f2" : "#ecfdf5" })}>{depense.type}</span></td>
                <td>{depense.ligneLabel}</td>
                <td>{depense.fournisseurLabel}</td>
                <td>{depense.horsEngagement ? <span style={badge({ color: C.amber, bg: "#fffbeb" })}>Hors engagement</span> : depense.engagementLabel}</td>
                <td>{depense.pieceJointe || "-"}</td>
                <td style={{ color: depense.montant < 0 ? C.red : C.text, fontWeight: 900 }}>{formatMoney(depense.montant)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <div style={{ padding: 16 }}><EmptyState title="Aucune depense" /></div>}
      </div>
    </div>
  );
}

function ValidationsView({ derived, approveValidation, openRejectModal }) {
  const pending = derived.validations.filter((validation) => validation.statut === "en_attente");
  const history = derived.validations.filter((validation) => validation.statut !== "en_attente");
  return (
    <div className="sb-stack">
      <div className="sb-page-head">
        <div>
          <h1>Validations</h1>
          <span>{pending.length} demandes en attente</span>
        </div>
      </div>
      {!pending.length && <EmptyState title="Aucune demande en attente" />}
      <div className="sb-validation-grid">
        {pending.map((validation) => {
          const engagement = validation.engagement;
          const line = validation.line;
          return (
            <div key={validation.id} className="sb-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>{engagement?.objet || "Engagement introuvable"}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{engagement?.fournisseurLabel} - {line?.libelle}</div>
                </div>
                <span style={badge({ color: validation.motifDeclenchement === "depassement_budget" ? C.red : C.amber, bg: validation.motifDeclenchement === "depassement_budget" ? "#fef2f2" : "#fffbeb" })}>{validation.motifDeclenchement === "depassement_budget" ? "Derogation" : "Seuil montant"}</span>
              </div>
              <div className="sb-mini-grid" style={{ marginTop: 14 }}>
                <div><span>Montant</span><b>{formatMoney(engagement?.montant)}</b></div>
                <div><span>Disponible ligne</span><b style={{ color: line?.disponible < 0 ? C.red : C.text }}>{formatMoney(line?.disponible)}</b></div>
                <div><span>Taux ligne</span><b>{formatPercent(line?.taux)}</b></div>
              </div>
              {engagement?.justification && <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: C.light, color: C.muted, fontSize: 12 }}>{engagement.justification}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
                <Button variant="light" icon={XCircle} onClick={() => openRejectModal(validation)}>Refuser</Button>
                <Button icon={Check} onClick={() => approveValidation(validation)}>Approuver</Button>
              </div>
            </div>
          );
        })}
      </div>
      {!!history.length && (
        <div className="sb-card sb-table-wrap">
          <table className="sb-table">
            <thead><tr><th>Engagement</th><th>Motif</th><th>Decision</th><th>Commentaire</th><th>Date</th></tr></thead>
            <tbody>
              {history.map((validation) => (
                <tr key={validation.id}>
                  <td>{validation.engagement?.objet}</td>
                  <td>{validation.motifDeclenchement}</td>
                  <td><span style={badge(VALIDATION_STATUS_META[validation.statut] || validation.statusMeta)}>{validation.statusMeta.label}</span></td>
                  <td>{validation.commentaire || "-"}</td>
                  <td>{validation.dateDecision || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AlertList({ alerts, compact = false }) {
  if (!alerts.length) return <EmptyState title="Aucune alerte" />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 10 }}>
      {alerts.map((alert) => (
        <div key={alert.id} style={{ border: `1px solid ${alert.color}33`, background: `${alert.color}0d`, borderRadius: 8, padding: compact ? 10 : 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AlertTriangle size={17} color={alert.color} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: C.text }}>{alert.title}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.45 }}>{alert.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel({ state, updateParams }) {
  const params = state.parametres;
  const setParam = (key, value) => updateParams({ [key]: key === "modeControle" ? value : numberValue(value) }, `maj_${key}`);
  return (
    <div className="sb-card" style={{ padding: 16 }}>
      <div className="sb-card-title">Regles de controle</div>
      <div className="sb-form-grid">
        <Field label="Seuil alerte (%)">
          <input type="number" value={params.seuilAlerte} onChange={(e) => setParam("seuilAlerte", e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Seuil depassement (%)">
          <input type="number" value={params.seuilDepassement} onChange={(e) => setParam("seuilDepassement", e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Seuil critique (%)">
          <input type="number" value={params.seuilCritique} onChange={(e) => setParam("seuilCritique", e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Validation montant">
          <input type="number" value={params.seuilValidationMontant} onChange={(e) => setParam("seuilValidationMontant", e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Mode controle" span={2}>
          <select value={params.modeControle} onChange={(e) => setParam("modeControle", e.target.value)} style={inputStyle}>
            <option value="souple">Souple - justification au depassement</option>
            <option value="strict">Strict - blocage ou derogation DAF</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function AlertsView({ state, derived, updateParams }) {
  return (
    <div className="sb-stack">
      <div className="sb-page-head">
        <div>
          <h1>Alertes & controle</h1>
          <span>{derived.alerts.length} alertes actives</span>
        </div>
      </div>
      <SettingsPanel state={state} updateParams={updateParams} />
      <AlertList alerts={derived.alerts} />
    </div>
  );
}

function ParametrageView({ state, derived, updateParams, addAxis, addSupplier }) {
  const [axisForm, setAxisForm] = useState({ type: "departement", code: "", libelle: "" });
  const [supplierForm, setSupplierForm] = useState({ raisonSociale: "", code: "", categorie: "" });
  return (
    <div className="sb-stack">
      <div className="sb-page-head">
        <div>
          <h1>Parametrage</h1>
          <span>Axes, fournisseurs et audit</span>
        </div>
      </div>
      <SettingsPanel state={state} updateParams={updateParams} />
      <div className="sb-grid-2">
        <div className="sb-card" style={{ padding: 16 }}>
          <div className="sb-card-title">Axes analytiques</div>
          <div className="sb-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Type"><select value={axisForm.type} onChange={(e) => setAxisForm((p) => ({ ...p, type: e.target.value }))} style={inputStyle}><option value="departement">Departement</option><option value="projet">Projet</option><option value="centre_cout">Centre cout</option><option value="nature">Nature</option></select></Field>
            <Field label="Code"><input value={axisForm.code} onChange={(e) => setAxisForm((p) => ({ ...p, code: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Libelle" span={2}><input value={axisForm.libelle} onChange={(e) => setAxisForm((p) => ({ ...p, libelle: e.target.value }))} style={inputStyle} /></Field>
          </div>
          <Button icon={Plus} style={{ marginTop: 10 }} onClick={() => { addAxis(axisForm); setAxisForm({ type: "departement", code: "", libelle: "" }); }}>Ajouter axe</Button>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7, maxHeight: 260, overflowY: "auto" }}>
            {derived.axes.map((axis) => <div key={axis.id} className="sb-list-row"><span>{axis.code}</span><b>{axis.libelle}</b><em>{axis.type}</em></div>)}
          </div>
        </div>
        <div className="sb-card" style={{ padding: 16 }}>
          <div className="sb-card-title">Fournisseurs</div>
          <div className="sb-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Raison sociale" span={2}><input value={supplierForm.raisonSociale} onChange={(e) => setSupplierForm((p) => ({ ...p, raisonSociale: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Code"><input value={supplierForm.code} onChange={(e) => setSupplierForm((p) => ({ ...p, code: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Categorie"><input value={supplierForm.categorie} onChange={(e) => setSupplierForm((p) => ({ ...p, categorie: e.target.value }))} style={inputStyle} /></Field>
          </div>
          <Button icon={Plus} style={{ marginTop: 10 }} onClick={() => { addSupplier(supplierForm); setSupplierForm({ raisonSociale: "", code: "", categorie: "" }); }}>Ajouter fournisseur</Button>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7, maxHeight: 260, overflowY: "auto" }}>
            {derived.fournisseurs.map((supplier) => <div key={supplier.id} className="sb-list-row"><span>{supplier.code}</span><b>{supplier.raisonSociale}</b><em>{supplier.categorie}</em></div>)}
          </div>
        </div>
      </div>
      <div className="sb-card sb-table-wrap">
        <table className="sb-table">
          <thead><tr><th>Date</th><th>Acteur</th><th>Action</th><th>Entite</th><th>Details</th></tr></thead>
          <tbody>
            {derived.journal.map((entry) => (
              <tr key={entry.id}>
                <td>{String(entry.horodatage || entry.createdAt).slice(0, 19).replace("T", " ")}</td>
                <td>{entry.acteur}</td>
                <td>{entry.action}</td>
                <td>{entry.entite} {entry.entiteId}</td>
                <td>{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SoftBudgetShell() {
  const { view, setView, authUser, sidebarOpen, setSidebarOpen } = useApp();
  const isMobile = useIsMobile();
  const [state, setState] = useState(loadState);
  const [role, setRole] = useState("super");
  const [toast, setToast] = useState(null);
  const [lineModal, setLineModal] = useState(null);
  const [engagementModal, setEngagementModal] = useState(null);
  const [expenseModal, setExpenseModal] = useState(null);
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);

  const derived = useMemo(() => deriveSoftBudget(state), [state]);
  const activeView = view?.startsWith("budget-") ? view : "budget-dashboard";
  const actor = authUser?.nom || "Utilisateur SoftBudget";

  useEffect(() => persistState(state), [state]);
  useEffect(() => {
    if (!view?.startsWith("budget-")) setView("budget-dashboard");
  }, [view, setView]);
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [activeView, isMobile, setSidebarOpen]);
  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const commit = (updater) => {
    setState((prev) => normalizeSoftBudgetState(typeof updater === "function" ? updater(clone(prev)) : updater));
  };
  const notify = (message, type = "info") => setToast({ message, type });
  const withAudit = (next, action, entite, entiteId, details) => addAudit(next, actor, action, entite, entiteId, details);

  function resetDemo() {
    const seed = createSoftBudgetSeed();
    setState(seed);
    persistState(seed);
    notify("Donnees demo SoftBudget rechargees.", "success");
  }

  function updateParams(partial, action = "parametrage") {
    commit((prev) => withAudit({ ...prev, parametres: { ...prev.parametres, ...partial } }, action, "parametres", "global", JSON.stringify(partial)));
  }

  function openLineModal(line = null) {
    setLineModal({
      mode: line ? "edit" : "create",
      values: line ? {
        id: line.id,
        libelle: line.libelle,
        axeDepartementId: line.axeDepartementId,
        axeProjetId: line.axeProjetId || "",
        nature: line.nature,
        montantInitial: line.montantInitial,
        montantRevise: line.montantRevise ?? "",
        statut: line.statut,
      } : {
        libelle: "",
        axeDepartementId: derived.axes.find((axis) => axis.type === "departement")?.id || "",
        axeProjetId: "",
        nature: "OPEX",
        montantInitial: "",
        montantRevise: "",
        statut: "active",
      },
    });
  }

  function saveLine() {
    const values = lineModal?.values;
    if (!values?.libelle?.trim() || !values.axeDepartementId || numberValue(values.montantInitial) <= 0) {
      notify("Libelle, departement et montant initial sont obligatoires.", "error");
      return;
    }
    const date = nowIso();
    commit((prev) => {
      if (lineModal.mode === "edit") {
        const next = {
          ...prev,
          lignes: prev.lignes.map((line) => line.id === values.id ? {
            ...line,
            ...values,
            axeProjetId: values.axeProjetId || null,
            montantInitial: numberValue(values.montantInitial),
            montantRevise: values.montantRevise === "" ? null : numberValue(values.montantRevise),
            updatedAt: date,
          } : line),
        };
        return withAudit(next, "maj_ligne", "ligne", values.id, values.libelle);
      }
      const newLine = {
        id: uid("LB"),
        budgetId: prev.budgets[0]?.id || "BUD-2026-FONC",
        libelle: values.libelle.trim(),
        axeDepartementId: values.axeDepartementId,
        axeProjetId: values.axeProjetId || null,
        nature: values.nature,
        montantInitial: numberValue(values.montantInitial),
        montantRevise: values.montantRevise === "" ? null : numberValue(values.montantRevise),
        statut: values.statut,
        createdAt: date,
        updatedAt: date,
      };
      return withAudit({ ...prev, lignes: [newLine, ...prev.lignes] }, "creation_ligne", "ligne", newLine.id, newLine.libelle);
    });
    setLineModal(null);
    notify("Ligne budgetaire enregistree.", "success");
  }

  function toggleFreezeLine(line) {
    const nextStatus = line.statut === "gelee" ? "active" : "gelee";
    commit((prev) => withAudit({
      ...prev,
      lignes: prev.lignes.map((item) => item.id === line.id ? { ...item, statut: nextStatus, updatedAt: nowIso() } : item),
    }, nextStatus === "gelee" ? "gel_ligne" : "degel_ligne", "ligne", line.id, line.libelle));
    notify(nextStatus === "gelee" ? "Ligne gelee." : "Ligne active.", "success");
  }

  function deleteLine(line) {
    if (line.hasActivity) {
      notify("Suppression interdite : la ligne porte deja des engagements ou depenses.", "error");
      return;
    }
    commit((prev) => withAudit({ ...prev, lignes: prev.lignes.filter((item) => item.id !== line.id) }, "suppression_ligne", "ligne", line.id, line.libelle));
    notify("Ligne supprimee.", "success");
  }

  function openEngagementModal() {
    const firstLine = derived.lignes.find((line) => line.statut === "active") || derived.lignes[0];
    setEngagementModal({
      ligneId: firstLine?.id || "",
      type: "BC",
      fournisseurId: derived.fournisseurs[0]?.id || "",
      objet: "",
      montant: "",
      date: todayIso(),
      dateEcheance: "",
      justification: "",
      derogation: false,
    });
  }

  function saveEngagement(asDraft = false) {
    const form = engagementModal;
    if (!form?.ligneId || !form.fournisseurId || !form.objet.trim() || numberValue(form.montant) <= 0) {
      notify("Ligne, fournisseur, objet et montant sont obligatoires.", "error");
      return;
    }
    const control = evaluateEngagementProjection(state, form.ligneId, form.montant);
    const lineFrozen = control.line?.statut === "gelee";
    if (!asDraft && lineFrozen) {
      notify(control.message, "error");
      return;
    }
    if (!asDraft && control.level === "blocked" && !form.derogation) {
      notify(control.message, "error");
      return;
    }
    if (!asDraft && (control.level === "warning" || form.derogation) && !form.justification.trim()) {
      notify("Justification obligatoire pour depassement ou derogation.", "error");
      return;
    }
    const date = nowIso();
    commit((prev) => {
      const routeValidation = !asDraft && shouldRouteValidation(prev, form.montant, form.derogation || control.level === "blocked");
      const newEngagement = {
        id: uid("ENG"),
        ligneId: form.ligneId,
        type: form.type,
        fournisseurId: form.fournisseurId,
        objet: form.objet.trim(),
        montant: numberValue(form.montant),
        date: form.date || todayIso(),
        statut: asDraft ? "brouillon" : routeValidation ? "en_attente_validation" : "approuve",
        derogation: Boolean(form.derogation || (!asDraft && control.level === "blocked")),
        justification: form.justification.trim(),
        dateEcheance: form.dateEcheance || null,
        createdAt: date,
        updatedAt: date,
      };
      const validations = routeValidation ? [{
        id: uid("VAL"),
        engagementId: newEngagement.id,
        motifDeclenchement: newEngagement.derogation || control.projection > numberValue(prev.parametres.seuilDepassement) ? "depassement_budget" : "seuil_montant",
        statut: "en_attente",
        valideur: "DAF",
        commentaire: "",
        dateDecision: null,
        createdAt: date,
        updatedAt: date,
      }, ...prev.validations] : prev.validations;
      return withAudit({ ...prev, engagements: [newEngagement, ...prev.engagements], validations }, asDraft ? "brouillon_engagement" : "soumission_engagement", "engagement", newEngagement.id, newEngagement.objet);
    });
    setEngagementModal(null);
    notify(asDraft ? "Brouillon enregistre." : "Engagement soumis.", "success");
  }

  function routeDraftSubmission(prev, engagement) {
    const control = evaluateEngagementProjection(prev, engagement.ligneId, engagement.montant);
    if (control.line?.statut === "gelee") return { next: prev, error: control.message };
    const date = nowIso();
    const derogation = control.level === "blocked" || engagement.derogation;
    const routeValidation = shouldRouteValidation(prev, engagement.montant, derogation);
    const updated = { ...engagement, statut: routeValidation ? "en_attente_validation" : "approuve", derogation, justification: engagement.justification || (derogation ? "Derogation demandee a la soumission." : ""), updatedAt: date };
    const validation = routeValidation ? {
      id: uid("VAL"),
      engagementId: engagement.id,
      motifDeclenchement: derogation ? "depassement_budget" : "seuil_montant",
      statut: "en_attente",
      valideur: "DAF",
      commentaire: "",
      dateDecision: null,
      createdAt: date,
      updatedAt: date,
    } : null;
    const next = {
      ...prev,
      engagements: prev.engagements.map((item) => item.id === engagement.id ? updated : item),
      validations: validation ? [validation, ...prev.validations] : prev.validations,
    };
    return { next: withAudit(next, "soumission_engagement", "engagement", engagement.id, engagement.objet) };
  }

  function transitionEngagement(engagement, action) {
    if (action === "soumettre") {
      let error = "";
      commit((prev) => {
        const result = routeDraftSubmission(prev, engagement);
        error = result.error || "";
        return result.next;
      });
      notify(error || "Engagement soumis.", error ? "error" : "success");
      return;
    }
    if (action === "annuler" && engagement.facture > 0) {
      notify("Annulation impossible apres facturation.", "error");
      return;
    }
    const statusByAction = { emettre: "emis", receptionner: "receptionne", cloturer: "cloture", annuler: "annule" };
    const nextStatus = statusByAction[action];
    if (!nextStatus) return;
    commit((prev) => withAudit({
      ...prev,
      engagements: prev.engagements.map((item) => item.id === engagement.id ? { ...item, statut: nextStatus, updatedAt: nowIso() } : item),
    }, action, "engagement", engagement.id, engagement.objet));
    notify("Statut mis a jour.", "success");
  }

  function openInvoiceModal(engagement) {
    setInvoiceModal({ engagementId: engagement.id, montant: engagement.reliquat || "", date: todayIso(), pieceJointe: "", type: "facture" });
  }

  function saveInvoice() {
    const engagement = derived.engagements.find((item) => item.id === invoiceModal?.engagementId);
    const amount = numberValue(invoiceModal?.montant);
    if (!engagement || amount <= 0) {
      notify("Montant de facture invalide.", "error");
      return;
    }
    const date = nowIso();
    commit((prev) => {
      const newDepense = {
        id: uid("DEP"),
        ligneId: engagement.ligneId,
        engagementId: engagement.id,
        fournisseurId: engagement.fournisseurId,
        montant: amount,
        date: invoiceModal.date || todayIso(),
        type: invoiceModal.type || "facture",
        pieceJointe: invoiceModal.pieceJointe || "",
        createdAt: date,
        updatedAt: date,
      };
      const newFacture = engagement.facture + amount;
      const nextStatus = newFacture >= numberValue(engagement.montant) ? "facture" : engagement.statut === "emis" ? "receptionne" : engagement.statut;
      const next = {
        ...prev,
        depenses: [newDepense, ...prev.depenses],
        engagements: prev.engagements.map((item) => item.id === engagement.id ? { ...item, statut: nextStatus, updatedAt: date } : item),
      };
      return withAudit(next, "facturation_engagement", "engagement", engagement.id, `${engagement.objet} - ${formatMoney(amount)}`);
    });
    setInvoiceModal(null);
    notify("Facture enregistree.", "success");
  }

  function openExpenseModal() {
    setExpenseModal({
      ligneId: derived.lignes[0]?.id || "",
      engagementId: "",
      fournisseurId: derived.fournisseurs[0]?.id || "",
      montant: "",
      date: todayIso(),
      type: "facture",
      pieceJointe: "",
    });
  }

  function saveExpense() {
    const form = expenseModal;
    const selectedEngagement = derived.engagements.find((item) => item.id === form?.engagementId);
    const amountBase = numberValue(form?.montant);
    if ((!form?.ligneId && !selectedEngagement) || !form?.fournisseurId || amountBase <= 0) {
      notify("Ligne, fournisseur et montant sont obligatoires.", "error");
      return;
    }
    const amount = form.type === "avoir" ? -Math.abs(amountBase) : amountBase;
    const date = nowIso();
    const lineId = selectedEngagement?.ligneId || form.ligneId;
    const supplierId = selectedEngagement?.fournisseurId || form.fournisseurId;
    commit((prev) => {
      const newDepense = {
        id: uid("DEP"),
        ligneId,
        engagementId: selectedEngagement?.id || null,
        fournisseurId: supplierId,
        montant: amount,
        date: form.date || todayIso(),
        type: form.type,
        pieceJointe: form.pieceJointe || "",
        createdAt: date,
        updatedAt: date,
      };
      let engagements = prev.engagements;
      if (selectedEngagement) {
        const newFacture = selectedEngagement.facture + amount;
        engagements = prev.engagements.map((item) => item.id === selectedEngagement.id ? {
          ...item,
          statut: newFacture >= numberValue(selectedEngagement.montant) ? "facture" : item.statut,
          updatedAt: date,
        } : item);
      }
      return withAudit({ ...prev, depenses: [newDepense, ...prev.depenses], engagements }, "creation_depense", "depense", newDepense.id, `${formatMoney(amount)} sur ${lineId}`);
    });
    setExpenseModal(null);
    notify("Depense enregistree.", "success");
  }

  function approveValidation(validation) {
    if (!validation?.engagement) return;
    commit((prev) => {
      const date = nowIso();
      const next = {
        ...prev,
        validations: prev.validations.map((item) => item.id === validation.id ? { ...item, statut: "approuvee", commentaire: "Approuve", dateDecision: date.slice(0, 10), updatedAt: date } : item),
        engagements: prev.engagements.map((item) => item.id === validation.engagementId ? { ...item, statut: "approuve", updatedAt: date } : item),
      };
      return withAudit(next, "validation_approvee", "validation", validation.id, validation.engagement.objet);
    });
    notify("Engagement approuve.", "success");
  }

  function rejectValidation() {
    const validation = rejectModal?.validation;
    const comment = rejectModal?.commentaire?.trim();
    if (!validation || !comment) {
      notify("Motif de refus obligatoire.", "error");
      return;
    }
    commit((prev) => {
      const date = nowIso();
      const next = {
        ...prev,
        validations: prev.validations.map((item) => item.id === validation.id ? { ...item, statut: "refusee", commentaire: comment, dateDecision: date.slice(0, 10), updatedAt: date } : item),
        engagements: prev.engagements.map((item) => item.id === validation.engagementId ? { ...item, statut: "refuse", updatedAt: date } : item),
      };
      return withAudit(next, "validation_refusee", "validation", validation.id, comment);
    });
    setRejectModal(null);
    notify("Engagement refuse.", "success");
  }

  function addAxis(form) {
    if (!form.code.trim() || !form.libelle.trim()) {
      notify("Code et libelle axe obligatoires.", "error");
      return;
    }
    const date = nowIso();
    const axis = { id: uid("AX"), type: form.type, code: form.code.trim().toUpperCase(), libelle: form.libelle.trim(), parentId: null, createdAt: date, updatedAt: date };
    commit((prev) => withAudit({ ...prev, axes: [axis, ...prev.axes] }, "creation_axe", "axe", axis.id, axis.libelle));
    notify("Axe ajoute.", "success");
  }

  function addSupplier(form) {
    if (!form.raisonSociale.trim() || !form.code.trim()) {
      notify("Raison sociale et code fournisseur obligatoires.", "error");
      return;
    }
    const date = nowIso();
    const supplier = { id: uid("FOU"), raisonSociale: form.raisonSociale.trim(), code: form.code.trim().toUpperCase(), categorie: form.categorie.trim() || "General", createdAt: date, updatedAt: date };
    commit((prev) => withAudit({ ...prev, fournisseurs: [supplier, ...prev.fournisseurs] }, "creation_fournisseur", "fournisseur", supplier.id, supplier.raisonSociale));
    notify("Fournisseur ajoute.", "success");
  }

  function enterpriseAction(action, payload) {
    const date = nowIso();
    commit((prev) => {
      let next = prev;
      if (action === "budget.import") {
        const imported = {
          id: uid("IMP"),
          source: "Import Excel budget",
          fichier: `budget_import_${todayIso()}.xlsx`,
          lignes: 27,
          statut: "importe",
          ecarts: 1,
          date: todayIso(),
          createdAt: date,
          updatedAt: date,
        };
        next = { ...prev, expenseImports: [imported, ...(prev.expenseImports || [])] };
      }
      if (action === "budget.version") {
        const version = {
          id: uid("BV"),
          budgetId: prev.budgets[0]?.id || "BUD-2026-FONC",
          nom: `Version de travail ${todayIso()}`,
          type: "rolling_forecast",
          statut: "en_preparation",
          montantTotal: deriveSoftBudget(prev).totals.budget + 15000,
          auteur: actor,
          date: todayIso(),
          commentaire: "Version generee depuis le module entreprise.",
          createdAt: date,
          updatedAt: date,
        };
        next = { ...prev, budgetVersions: [version, ...(prev.budgetVersions || [])] };
      }
      if (action === "budget.scenario") {
        const scenario = {
          id: uid("SCN"),
          nom: `What-if ${todayIso()}`,
          hypothese: "Simulation automatique sur inflation fournisseurs et report CAPEX.",
          impact: 28000,
          statut: "simule",
          probabilite: 35,
          createdAt: date,
          updatedAt: date,
        };
        next = { ...prev, budgetScenarios: [scenario, ...(prev.budgetScenarios || [])] };
      }
      if (action === "revision.approveFirst") {
        next = {
          ...prev,
          revisionRequests: (prev.revisionRequests || []).map((item) => item.statut === "en_attente" ? { ...item, statut: "approuvee", updatedAt: date } : item),
        };
      }
      if (action === "period.toggle") {
        next = {
          ...prev,
          periodes: (prev.periodes || []).map((item) => item.id === payload ? { ...item, statut: item.statut === "ouvert" ? "clos" : "ouvert", updatedAt: date } : item),
        };
      }
      if (action === "validation.bulkApprove") {
        const ids = new Set((prev.validations || []).filter((item) => item.statut === "en_attente").map((item) => item.engagementId));
        next = {
          ...prev,
          validations: (prev.validations || []).map((item) => item.statut === "en_attente" ? { ...item, statut: "approuvee", commentaire: "Bulk approval DAF", dateDecision: todayIso(), updatedAt: date } : item),
          engagements: (prev.engagements || []).map((item) => ids.has(item.id) ? { ...item, statut: "approuve", updatedAt: date } : item),
        };
      }
      if (action === "report.generateAll") {
        next = {
          ...prev,
          reports: (prev.reports || []).map((item) => ({ ...item, statut: "pret", derniereGeneration: todayIso(), updatedAt: date })),
        };
      }
      if (action === "project.advanceRisk") {
        next = {
          ...prev,
          projects: (prev.projects || []).map((item) => item.statut === "risque" ? { ...item, avancement: Math.min(100, numberValue(item.avancement) + 8), statut: "en_cours", updatedAt: date } : item),
        };
      }
      if (action === "integration.syncAll") {
        next = {
          ...prev,
          integrations: (prev.integrations || []).map((item) => ({ ...item, statut: "connecte", derniereSync: date, erreurs: 0, updatedAt: date })),
          apiEvents: [{
            id: uid("API"),
            event: "sync.completed",
            cible: "SoftBudget integrations",
            statut: "livre",
            date,
            createdAt: date,
            updatedAt: date,
          }, ...(prev.apiEvents || [])],
        };
      }
      if (action === "security.reviewProgress") {
        next = {
          ...prev,
          accessReviews: (prev.accessReviews || []).map((item) => ({ ...item, statut: "en_cours", couverture: Math.min(100, numberValue(item.couverture) + 15), updatedAt: date })),
        };
      }
      if (action === "forecast.run") {
        const d = deriveSoftBudget(prev);
        const forecast = {
          id: uid("FRC"),
          nom: `Atterrissage ${todayIso()}`,
          horizon: "12 mois",
          methode: "Tendance realise + reliquats engages + scenarios",
          budget: d.totals.budget,
          prevision: Math.round(d.totals.realise + d.totals.engage + d.totals.budget * 0.42),
          risque: d.totals.taux > 75 ? "eleve" : "moyen",
          statut: "calcule",
          date: todayIso(),
          createdAt: date,
          updatedAt: date,
        };
        next = { ...prev, forecastRuns: [forecast, ...(prev.forecastRuns || [])] };
      }
      if (action === "consolidation.collect") {
        next = {
          ...prev,
          consolidationPackages: (prev.consolidationPackages || []).map((item) => ({ ...item, entitesRecues: item.entitesAttendues, statut: item.ecarts ? "a_revoir" : "consolide", updatedAt: date })),
        };
      }
      if (action === "admin.completeTask") {
        let completed = false;
        next = {
          ...prev,
          adminTasks: (prev.adminTasks || []).map((item) => {
            if (!completed && item.statut !== "pret") {
              completed = true;
              return { ...item, statut: "pret", updatedAt: date };
            }
            return item;
          }),
        };
      }
      return withAudit(next, action, "enterprise", "softbudget", "Action enterprise executee depuis SoftBudget.");
    });
    notify("Action enterprise executee.", "success");
  }

  function exportCsv() {
    const rows = [
      ["Ligne", "Departement", "Projet", "Nature", "Budget", "Engage", "Realise", "Disponible", "Taux"],
      ...derived.lignes.map((line) => [line.libelle, line.departementLabel, line.projetLabel, line.nature, line.budget, line.engage, line.realise, line.disponible, line.taux.toFixed(2)]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `softbudget-budget-vs-realise-${todayIso()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const renderView = () => {
    switch (activeView) {
      case "budget-referentiel":
        return <EnterpriseReferenceView state={state} derived={derived} setView={setView} />;
      case "budget-planning":
        return <BudgetPlanningView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-budgets":
        return <BudgetLinesView derived={derived} openLineModal={openLineModal} toggleFreezeLine={toggleFreezeLine} deleteLine={deleteLine} />;
      case "budget-engagements":
        return <EngagementsView derived={derived} openEngagementModal={openEngagementModal} transitionEngagement={transitionEngagement} openInvoiceModal={openInvoiceModal} />;
      case "budget-depenses":
        return <DepensesView derived={derived} openExpenseModal={openExpenseModal} />;
      case "budget-validations":
        return <ValidationsView derived={derived} approveValidation={approveValidation} openRejectModal={(validation) => setRejectModal({ validation, commentaire: "" })} />;
      case "budget-workflow":
        return <WorkflowEnterpriseView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-alertes":
        return <AlertsView state={state} derived={derived} updateParams={updateParams} />;
      case "budget-reporting":
        return <ReportingEnterpriseView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-projects":
        return <ProjectsCapexView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-integrations":
        return <IntegrationsEnterpriseView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-security":
        return <SecurityEnterpriseView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-forecast":
        return <ForecastEnterpriseView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-consolidation":
        return <ConsolidationEnterpriseView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-admin":
        return <EnterpriseAdminView state={state} derived={derived} onAction={enterpriseAction} />;
      case "budget-parametrage":
        return <ParametrageView state={state} derived={derived} updateParams={updateParams} addAxis={addAxis} addSupplier={addSupplier} />;
      case "budget-dashboard":
      default:
        return <DashboardView derived={derived} setView={setView} exportCsv={exportCsv} />;
    }
  };

  const controlPreview = engagementModal ? evaluateEngagementProjection(state, engagementModal.ligneId, engagementModal.montant) : null;
  const selectedExpenseEngagement = expenseModal?.engagementId ? derived.engagements.find((item) => item.id === expenseModal.engagementId) : null;
  const invoiceEngagement = invoiceModal?.engagementId ? derived.engagements.find((item) => item.id === invoiceModal.engagementId) : null;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg, color: C.text, fontFamily: "'Inter','Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9998 }} />}
      <div style={isMobile ? { position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 9999, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform .25s", boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,.2)" : "none" } : {}}>
        <SoftBudgetSidebar activeView={activeView} setView={setView} sidebarOpen={sidebarOpen || isMobile} derived={derived} onReset={resetDemo} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />
        <ModuleToolbar state={state} derived={derived} updateParams={updateParams} role={role} setRole={setRole} onReset={resetDemo} />
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? 12 : 20, WebkitOverflowScrolling: "touch" }}>
          {renderView()}
        </main>
      </div>
      <ChatBox />
      <EnterpriseStyles />

      {toast && (
        <div style={{ position: "fixed", right: 18, top: 82, zIndex: 100000, background: toast.type === "error" ? "#991b1b" : toast.type === "success" ? "#047857" : "#0f172a", color: C.white, borderRadius: 9, padding: "11px 14px", boxShadow: "0 12px 32px rgba(15,23,42,.25)", fontSize: 13, fontWeight: 800 }}>
          {toast.message}
        </div>
      )}

      {lineModal && (
        <Modal title={lineModal.mode === "edit" ? "Editer une ligne budgetaire" : "Nouvelle ligne budgetaire"} onClose={() => setLineModal(null)} footer={<><Button variant="light" onClick={() => setLineModal(null)}>Annuler</Button><Button icon={Save} onClick={saveLine}>Enregistrer</Button></>}>
          <div className="sb-form-grid">
            <Field label="Libelle" span={2}><input value={lineModal.values.libelle} onChange={(e) => setLineModal((p) => ({ ...p, values: { ...p.values, libelle: e.target.value } }))} style={inputStyle} /></Field>
            <Field label="Departement"><select value={lineModal.values.axeDepartementId} onChange={(e) => setLineModal((p) => ({ ...p, values: { ...p.values, axeDepartementId: e.target.value } }))} style={inputStyle}>{derived.axes.filter((axis) => axis.type === "departement").map((axis) => <option key={axis.id} value={axis.id}>{axis.libelle}</option>)}</select></Field>
            <Field label="Projet"><select value={lineModal.values.axeProjetId} onChange={(e) => setLineModal((p) => ({ ...p, values: { ...p.values, axeProjetId: e.target.value } }))} style={inputStyle}><option value="">Aucun</option>{derived.axes.filter((axis) => axis.type === "projet").map((axis) => <option key={axis.id} value={axis.id}>{axis.libelle}</option>)}</select></Field>
            <Field label="Nature"><select value={lineModal.values.nature} onChange={(e) => setLineModal((p) => ({ ...p, values: { ...p.values, nature: e.target.value } }))} style={inputStyle}><option value="OPEX">OPEX</option><option value="CAPEX">CAPEX</option></select></Field>
            <Field label="Statut"><select value={lineModal.values.statut} onChange={(e) => setLineModal((p) => ({ ...p, values: { ...p.values, statut: e.target.value } }))} style={inputStyle}><option value="active">Active</option><option value="gelee">Gelee</option></select></Field>
            <Field label="Montant initial"><input type="number" value={lineModal.values.montantInitial} onChange={(e) => setLineModal((p) => ({ ...p, values: { ...p.values, montantInitial: e.target.value } }))} style={inputStyle} /></Field>
            <Field label="Montant revise"><input type="number" value={lineModal.values.montantRevise} onChange={(e) => setLineModal((p) => ({ ...p, values: { ...p.values, montantRevise: e.target.value } }))} style={inputStyle} placeholder="Optionnel" /></Field>
          </div>
        </Modal>
      )}

      {engagementModal && (
        <Modal title="Nouvel engagement" onClose={() => setEngagementModal(null)} wide footer={<><Button variant="light" onClick={() => setEngagementModal(null)}>Annuler</Button><Button variant="light" icon={FileText} onClick={() => saveEngagement(true)}>Brouillon</Button><Button icon={Send} onClick={() => saveEngagement(false)}>Soumettre</Button></>}>
          <div className="sb-form-grid">
            <Field label="Ligne budgetaire" span={2}><select value={engagementModal.ligneId} onChange={(e) => setEngagementModal((p) => ({ ...p, ligneId: e.target.value }))} style={inputStyle}>{derived.lignes.map((line) => <option key={line.id} value={line.id}>{line.libelle} - disponible {formatMoney(line.disponible)}</option>)}</select></Field>
            <Field label="Type"><select value={engagementModal.type} onChange={(e) => setEngagementModal((p) => ({ ...p, type: e.target.value }))} style={inputStyle}><option value="BC">BC</option><option value="contrat">Contrat</option><option value="convention">Convention</option><option value="subvention">Subvention</option></select></Field>
            <Field label="Fournisseur"><select value={engagementModal.fournisseurId} onChange={(e) => setEngagementModal((p) => ({ ...p, fournisseurId: e.target.value }))} style={inputStyle}>{derived.fournisseurs.map((f) => <option key={f.id} value={f.id}>{f.raisonSociale}</option>)}</select></Field>
            <Field label="Objet" span={2}><input value={engagementModal.objet} onChange={(e) => setEngagementModal((p) => ({ ...p, objet: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Montant"><input type="number" value={engagementModal.montant} onChange={(e) => setEngagementModal((p) => ({ ...p, montant: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Date"><input type="date" value={engagementModal.date} onChange={(e) => setEngagementModal((p) => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Echeance"><input type="date" value={engagementModal.dateEcheance} onChange={(e) => setEngagementModal((p) => ({ ...p, dateEcheance: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Derogation DAF"><label style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={engagementModal.derogation} onChange={(e) => setEngagementModal((p) => ({ ...p, derogation: e.target.checked }))} /> Demander</label></Field>
            <Field label="Justification" span={2}><textarea value={engagementModal.justification} onChange={(e) => setEngagementModal((p) => ({ ...p, justification: e.target.value }))} style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} /></Field>
          </div>
          {controlPreview && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 9, border: `1px solid ${controlPreview.level === "ok" ? "#10b98155" : controlPreview.level === "warning" ? "#f59e0b55" : "#ef444455"}`, background: controlPreview.level === "ok" ? "#ecfdf5" : controlPreview.level === "warning" ? "#fffbeb" : "#fef2f2", color: controlPreview.level === "ok" ? "#047857" : controlPreview.level === "warning" ? "#b45309" : "#b91c1c", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={16} /> {controlPreview.message}
            </div>
          )}
        </Modal>
      )}

      {invoiceModal && invoiceEngagement && (
        <Modal title={`Facturer - ${invoiceEngagement.objet}`} onClose={() => setInvoiceModal(null)} footer={<><Button variant="light" onClick={() => setInvoiceModal(null)}>Annuler</Button><Button icon={Receipt} onClick={saveInvoice}>Facturer</Button></>}>
          <div className="sb-mini-grid" style={{ marginBottom: 14 }}>
            <div><span>Montant engage</span><b>{formatMoney(invoiceEngagement.montant)}</b></div>
            <div><span>Deja facture</span><b>{formatMoney(invoiceEngagement.facture)}</b></div>
            <div><span>Reliquat</span><b>{formatMoney(invoiceEngagement.reliquat)}</b></div>
          </div>
          <div className="sb-form-grid">
            <Field label="Montant"><input type="number" value={invoiceModal.montant} onChange={(e) => setInvoiceModal((p) => ({ ...p, montant: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Date"><input type="date" value={invoiceModal.date} onChange={(e) => setInvoiceModal((p) => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Piece jointe" span={2}><input value={invoiceModal.pieceJointe} onChange={(e) => setInvoiceModal((p) => ({ ...p, pieceJointe: e.target.value }))} style={inputStyle} placeholder="Nom du justificatif" /></Field>
          </div>
          {numberValue(invoiceModal.montant) > invoiceEngagement.reliquat && <div style={{ marginTop: 12, color: C.red, fontWeight: 800, fontSize: 13 }}>Attention : cette facture depasse le reliquat.</div>}
        </Modal>
      )}

      {expenseModal && (
        <Modal title="Nouvelle depense" onClose={() => setExpenseModal(null)} wide footer={<><Button variant="light" onClick={() => setExpenseModal(null)}>Annuler</Button><Button icon={Save} onClick={saveExpense}>Enregistrer</Button></>}>
          <div className="sb-form-grid">
            <Field label="Engagement" span={2}><select value={expenseModal.engagementId} onChange={(e) => {
              const eng = derived.engagements.find((item) => item.id === e.target.value);
              setExpenseModal((p) => ({ ...p, engagementId: e.target.value, ligneId: eng?.ligneId || p.ligneId, fournisseurId: eng?.fournisseurId || p.fournisseurId }));
            }} style={inputStyle}><option value="">Depense directe hors engagement</option>{derived.engagements.filter((e) => !["annule", "refuse", "cloture"].includes(e.statut)).map((e) => <option key={e.id} value={e.id}>{e.objet} - reliquat {formatMoney(e.reliquat)}</option>)}</select></Field>
            <Field label="Ligne"><select value={expenseModal.ligneId} disabled={!!selectedExpenseEngagement} onChange={(e) => setExpenseModal((p) => ({ ...p, ligneId: e.target.value }))} style={inputStyle}>{derived.lignes.map((line) => <option key={line.id} value={line.id}>{line.libelle}</option>)}</select></Field>
            <Field label="Fournisseur"><select value={expenseModal.fournisseurId} disabled={!!selectedExpenseEngagement} onChange={(e) => setExpenseModal((p) => ({ ...p, fournisseurId: e.target.value }))} style={inputStyle}>{derived.fournisseurs.map((f) => <option key={f.id} value={f.id}>{f.raisonSociale}</option>)}</select></Field>
            <Field label="Type"><select value={expenseModal.type} onChange={(e) => setExpenseModal((p) => ({ ...p, type: e.target.value }))} style={inputStyle}><option value="facture">Facture</option><option value="note_de_frais">Note de frais</option><option value="avoir">Avoir</option></select></Field>
            <Field label="Montant"><input type="number" value={expenseModal.montant} onChange={(e) => setExpenseModal((p) => ({ ...p, montant: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Date"><input type="date" value={expenseModal.date} onChange={(e) => setExpenseModal((p) => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Piece jointe"><input value={expenseModal.pieceJointe} onChange={(e) => setExpenseModal((p) => ({ ...p, pieceJointe: e.target.value }))} style={inputStyle} /></Field>
          </div>
          {selectedExpenseEngagement && numberValue(expenseModal.montant) + selectedExpenseEngagement.facture > selectedExpenseEngagement.montant && <div style={{ marginTop: 12, color: C.red, fontWeight: 800, fontSize: 13 }}>Alerte de sur-facturation sur cet engagement.</div>}
        </Modal>
      )}

      {rejectModal && (
        <Modal title="Refuser une demande" onClose={() => setRejectModal(null)} footer={<><Button variant="light" onClick={() => setRejectModal(null)}>Annuler</Button><Button variant="danger" icon={XCircle} onClick={rejectValidation}>Refuser</Button></>}>
          <Field label="Motif obligatoire">
            <textarea value={rejectModal.commentaire} onChange={(e) => setRejectModal((p) => ({ ...p, commentaire: e.target.value }))} style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} autoFocus />
          </Field>
        </Modal>
      )}

      <style>{`
        .sb-stack{display:flex;flex-direction:column;gap:16px;max-width:1480px;margin:0 auto;width:100%}
        .sb-page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .sb-page-head h1{font-size:22px;line-height:1.1;margin:0;color:${C.text};font-weight:950;letter-spacing:0}
        .sb-page-head span{font-size:12px;color:${C.muted};display:block;margin-top:5px}
        .sb-card{background:${C.white};border:1px solid ${C.border};border-radius:8px;box-shadow:0 1px 4px rgba(15,23,42,.05)}
        .sb-card-title{font-size:13px;font-weight:950;color:${C.text};margin-bottom:12px}
        .sb-kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
        .sb-grid-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
        .sb-validation-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        .sb-filterbar{display:flex;align-items:center;gap:9px;background:${C.white};border:1px solid ${C.border};border-radius:8px;padding:10px;flex-wrap:wrap}
        .sb-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
        .sb-table-wrap{overflow:auto}
        .sb-table{width:100%;border-collapse:collapse;min-width:980px}
        .sb-table th{background:${C.light};color:#475569;text-align:left;padding:11px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid ${C.border};white-space:nowrap}
        .sb-table td{padding:12px;border-bottom:1px solid ${C.border};font-size:13px;vertical-align:middle;color:${C.text}}
        .sb-table td span{display:block;font-size:11.5px;color:${C.muted};margin-top:3px}
        .sb-mini-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
        .sb-mini-grid div{background:${C.light};border:1px solid ${C.border};border-radius:8px;padding:10px}
        .sb-mini-grid span{font-size:10px;text-transform:uppercase;letter-spacing:.05em;font-weight:900;color:${C.muted};display:block;margin-bottom:5px}
        .sb-mini-grid b{font-size:13px;color:${C.text}}
        .sb-list-row{display:grid;grid-template-columns:70px 1fr auto;gap:8px;align-items:center;border:1px solid ${C.border};border-radius:8px;padding:8px 10px;background:${C.light}}
        .sb-list-row span{font-size:11px;font-weight:950;color:${C.primary}}
        .sb-list-row b{font-size:12.5px;color:${C.text}}
        .sb-list-row em{font-size:11px;color:${C.muted};font-style:normal}
        @media (max-width:1100px){.sb-kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sb-grid-2,.sb-validation-grid{grid-template-columns:1fr}.sb-form-grid{grid-template-columns:1fr}.sb-mini-grid{grid-template-columns:1fr}}
        @media (max-width:768px){.sb-kpi-grid{grid-template-columns:1fr}.sb-page-head{align-items:stretch}.sb-page-head > div:last-child{width:100%}.sb-filterbar input,.sb-filterbar select{width:100%!important}.sb-form-grid label{grid-column:span 1!important}}
      `}</style>
    </div>
  );
}
