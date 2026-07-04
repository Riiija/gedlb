"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  Clock,
  FileSearch,
  FileText,
  KeyRound,
  LayoutDashboard,
  Mail,
  Palette,
  PenLine,
  RotateCcw,
  Settings2,
  ShieldCheck,
  UploadCloud,
  UserRoundCheck,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";
import { canAccessSoftSignView } from "./softsignAccess";

const SB     = "rgb(26,38,52)";
const BORDER = "rgba(255,255,255,.07)";
const MUTED  = "rgba(255,255,255,.38)";
const TEXT   = "rgba(255,255,255,.82)";
const ACCENT = "#8b5cf6";
const RED    = "#ef4444";
const ORANGE = "#f59e0b";

function Pill({ n, color = ACCENT }) {
  if (!n) return null;
  return (
    <span style={{ background: `${color}22`, color, fontSize: 10.5, fontWeight: 800, padding: "2px 7px", borderRadius: 10, minWidth: 20, textAlign: "center", lineHeight: "16px" }}>
      {n}
    </span>
  );
}

function isItemActive(item, view) {
  return item.id === view || (item.also || []).includes(view);
}

function Item({ item, active, onClick, indent }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: `7px 16px 7px ${indent ? 36 : 16}px`,
        minHeight: 38,
        background: active ? "rgba(139,92,246,.16)" : "transparent",
        border: "none",
        borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
        cursor: "pointer",
        color: active ? "#c4b5fd" : TEXT,
        transition: "background .12s,color .12s",
        textAlign: "left",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon size={15} strokeWidth={1.9} style={{ flexShrink: 0, opacity: 0.82 }} />
      <span style={{ fontSize: 12.5, fontWeight: active ? 750 : 450, flex: 1, lineHeight: 1.3 }}>{item.label}</span>
      <Pill n={item.count} color={item.color} />
    </button>
  );
}

function Group({ group, open, onToggle, activeView, go }) {
  const Icon = group.icon;
  const hasActive = group.items.some((item) => isItemActive(item, activeView));
  return (
    <div>
      <button
        onClick={() => onToggle(group.id)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "7px 16px",
          minHeight: 38,
          background: open || hasActive ? "rgba(139,92,246,.10)" : "transparent",
          border: "none",
          borderLeft: hasActive ? `3px solid ${ACCENT}55` : "3px solid transparent",
          cursor: "pointer",
          color: open || hasActive ? "#c4b5fd" : TEXT,
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <Icon size={15} strokeWidth={1.9} style={{ opacity: 0.82 }} />
        <span style={{ fontSize: 12.5, fontWeight: 750, flex: 1, lineHeight: 1.3 }}>{group.label}</span>
        <ChevronRight size={13} style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .18s", opacity: 0.55 }} />
      </button>
      <div style={{ overflow: "hidden", maxHeight: open ? 900 : 0, transition: "max-height .28s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ paddingBottom: 4 }}>
          {group.items.map((item) => (
            <Item key={item.id} item={item} active={isItemActive(item, activeView)} onClick={go} indent />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarSS({ view, setView, counts = {}, onReset, authUser }) {
  const isSuper = authUser?.systemRole === "superadmin" || authUser?.systemRole === "admin";
  const [accessRevision, setAccessRevision] = useState(0);

  useEffect(() => {
    const refresh = () => setAccessRevision((value) => value + 1);
    window.addEventListener("storage", refresh);
    window.addEventListener("ss-role-perms-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ss-role-perms-change", refresh);
    };
  }, []);

  const groups = useMemo(() => [
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      items: [
        { id: "ss-depot",         label: "Nouveau dépôt",          icon: UploadCloud, also: ["ss-upload"] },
        { id: "ss-docs-my",       label: "Mes documents",           icon: FileText,    count: counts.totalDocs },
        { id: "ss-docs-external", label: "Documents externes",      icon: Building2,   count: counts.externes },
        { id: "ss-docs-received", label: "Documents reçus",         icon: Clock,       count: counts.aTraiter, color: ORANGE },
        { id: "ss-docs-progress", label: "Documents en cours",      icon: Workflow,    count: counts.enCours },
        { id: "ss-rejetes",       label: "Documents rejetés",       icon: XCircle,     count: counts.rejetes, color: RED },
        { id: "ss-archives",      label: "Documents archivés",      icon: Archive,     count: counts.archives },
        { id: "ss-search",        label: "Recherche avancée",       icon: FileSearch },
      ],
    },
    {
      id: "traitement",
      label: "Traitement",
      icon: PenLine,
      items: [
        { id: "ss-mailbox",     label: "Boite de reception", icon: Mail },
        { id: "ss-param-sign",  label: "Signatures",  icon: PenLine },
        { id: "ss-delegations", label: "Délégation",  icon: UserRoundCheck },
      ],
    },
    ...(isSuper ? [{
      id: "parametrage",
      label: "Paramétrage",
      icon: Settings2,
      items: [
        { id: "ss-param-general",    label: "Paramètres généraux",         icon: Settings2 },
        { id: "ss-admin-users",      label: "Utilisateurs",                icon: Users },
        { id: "ss-roles",            label: "Autorisation",                icon: ShieldCheck },
        { id: "ss-param-otp",        label: "Paramétrage OTP",             icon: KeyRound },
        { id: "ss-wf-modeles",       label: "Workflow",                    icon: Workflow, also: ["ss-param-wf"] },
        { id: "ss-notif",            label: "Notifications",               icon: Bell, count: counts.notifNonLues, color: ACCENT },
        { id: "ss-relances",         label: "Relances",                    icon: Clock },
        { id: "ss-email-tpl",        label: "Modèles emails",              icon: Mail },
        { id: "ss-personnalisation", label: "Personnalisation application", icon: Palette },
        { id: "ss-external-accounts", label: "Validation fournisseurs",     icon: Building2, count: counts.comptesAttente, color: ACCENT, also: ["ss-portail"] },
      ],
    }] : []),
    {
      id: "rapport",
      label: "Rapport",
      icon: BarChart3,
      items: [
        { id: "ss-rapports-validateurs", label: "Situation par validateur", icon: Users },
        { id: "ss-rapports-expediteurs", label: "Situation par expéditeur",  icon: Building2 },
      ],
    },
  ], [counts, isSuper]);

  const visibleGroups = useMemo(() => groups
    .map((group) => ({ ...group, items: group.items.filter((item) => canAccessSoftSignView(authUser, item.id)) }))
    .filter((group) => group.items.length), [accessRevision, authUser, groups]);
  const firstOpen = visibleGroups.find((g) => g.items.some((item) => isItemActive(item, view)))?.id || "documents";
  const [openGroup, setOpenGroup] = useState(firstOpen);
  const go = (id) => setView(id);

  return (
    <aside style={{ width: 268, height: "100vh", background: SB, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#4c1d95,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src="/softsign.png" alt="SS" style={{ height: 22, objectFit: "contain", filter: "brightness(10)" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: "-.2px" }}>SoftSign</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>Signature & Validation</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", paddingTop: 8, paddingBottom: 16 }}>
        {/* Tableau de bord */}
        <Item
          item={{ id: "ss-dashboard", label: "Tableau de bord", icon: LayoutDashboard, count: counts.alertes, color: RED }}
          active={view === "ss-dashboard"}
          onClick={go}
        />

        {/* Grouped sections */}
        {visibleGroups.map((group) => (
          <Group
            key={group.id}
            group={group}
            open={openGroup === group.id}
            onToggle={(id) => setOpenGroup((cur) => (cur === id ? null : id))}
            activeView={view}
            go={go}
          />
        ))}

        {/* Reset (admin only) */}
        {isSuper && (
          <div style={{ padding: "16px 16px 4px" }}>
            <button
              onClick={onReset}
              style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid rgba(220,38,38,.32)", background: "rgba(220,38,38,.08)", color: "#f87171", fontSize: 11.5, fontWeight: 750, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}
            >
              <RotateCcw size={13} /> Reinitialiser les donnees
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
