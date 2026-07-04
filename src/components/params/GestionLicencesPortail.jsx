"use client";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Folder,
  History,
  Minus,
  MoreVertical,
  PackageCheck,
  Plus,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useIsMobile } from "../../lib/useResponsive";

const COLORS = {
  text: "#0f172a",
  muted: "#64748b",
  softMuted: "#94a3b8",
  border: "#e2e8f0",
  panel: "#ffffff",
  bg: "#f8fafc",
  accent: "#6d3fd7",
  green: "#22c55e",
  teal: "#0891b2",
};

const quotaLabels = {
  users: "utilisateurs",
  projects: "projets",
  sites: "sites",
};

const quotaMaxLabels = {
  users: "Nombre maximal d'utilisateurs",
  projects: "Nombre maximal de projets",
  sites: "Nombre maximal de sites",
};

const quotaIcons = {
  users: Users,
  projects: Folder,
  sites: Building2,
};

function displayDate(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function percent(used, max) {
  if (!max) return 0;
  return Math.min(100, Math.round((used / max) * 100));
}

function productUsage(product, fallback) {
  return {
    users: product.usage?.users ?? fallback.users,
    projects: product.usage?.projects ?? fallback.projects,
    sites: product.usage?.sites ?? fallback.sites,
  };
}

function fieldStyle(extra = {}) {
  return {
    width: "100%",
    minHeight: 36,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "7px 10px",
    fontSize: 12.5,
    color: COLORS.text,
    background: "#fff",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    ...extra,
  };
}

function iconButtonStyle(extra = {}) {
  return {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    background: "#fff",
    color: COLORS.muted,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontFamily: "inherit",
    ...extra,
  };
}

function ProductMark({ product }) {
  if (product.logo) {
    return (
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          border: `1px solid ${COLORS.border}`,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={product.logo}
          alt={product.name}
          style={{ maxWidth: 26, maxHeight: 26, objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        background: `${product.color}14`,
        color: product.color,
        border: `1px solid ${product.color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 900,
        flexShrink: 0,
      }}
    >
      {product.name.replace("Soft", "").slice(0, 2).toUpperCase()}
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 11.5,
        fontWeight: 800,
        color: active ? "#15803d" : "#64748b",
        background: active ? "#dcfce7" : "#f1f5f9",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 6,
          background: active ? COLORS.green : "#94a3b8",
        }}
      />
      {active ? "Activé" : "Non activé"}
    </span>
  );
}

function ProgressMini({ used, max, color, inactive }) {
  if (inactive) return <span style={{ color: COLORS.softMuted }}>-</span>;
  return (
    <div style={{ minWidth: 92 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: COLORS.text,
          marginBottom: 5,
        }}
      >
        {used} / {max}
      </div>
      <div
        style={{
          height: 5,
          borderRadius: 6,
          background: "#e8edf5",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent(used, max)}%`,
            height: "100%",
            borderRadius: 6,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function QuotaStepper({ type, product, usage, onChange }) {
  const Icon = quotaIcons[type];
  const max = product.quotas[type] || 0;
  const used = usage[type] || 0;
  const color =
    type === "users" ? product.color : type === "projects" ? "#22c55e" : "#0891b2";

  function setValue(value) {
    const next = Math.max(used, Number(value) || 0);
    onChange(type, next);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "48px minmax(0,1fr) auto",
        gap: 14,
        alignItems: "center",
        padding: "16px 0",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: `${color}14`,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={22} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 900,
            color: COLORS.text,
            marginBottom: 3,
          }}
        >
          {quotaMaxLabels[type]}
        </div>
        <div style={{ fontSize: 11.5, color: COLORS.muted, marginBottom: 8 }}>
          Utilisés : {used}
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 8,
            background: "#e8edf5",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percent(used, max)}%`,
              height: "100%",
              borderRadius: 8,
              background: color,
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <button
          type="button"
          onClick={() => setValue(max - 1)}
          disabled={max <= used}
          aria-label={`Diminuer le quota ${quotaLabels[type]}`}
          style={iconButtonStyle({
            borderRadius: "8px 0 0 8px",
            opacity: max <= used ? 0.45 : 1,
          })}
        >
          <Minus size={15} />
        </button>
        <input
          type="number"
          min={used}
          value={max}
          onChange={(event) => setValue(event.target.value)}
          aria-label={`Quota ${quotaLabels[type]}`}
          style={{
            width: 54,
            height: 32,
            border: `1px solid ${COLORS.border}`,
            borderLeft: "none",
            borderRight: "none",
            textAlign: "center",
            fontWeight: 900,
            color: COLORS.text,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          type="button"
          onClick={() => setValue(max + 1)}
          aria-label={`Augmenter le quota ${quotaLabels[type]}`}
          style={iconButtonStyle({ borderRadius: "0 8px 8px 0" })}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

function ToggleLine({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        padding: "11px 0",
        borderBottom: `1px solid ${COLORS.border}`,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.text }}>
        {label}
      </span>
      <span
        style={{
          width: 42,
          height: 24,
          borderRadius: 999,
          background: checked ? COLORS.accent : "#cbd5e1",
          padding: 3,
          boxSizing: "border-box",
          transition: "background .15s",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          style={{ display: "none" }}
        />
        <span
          style={{
            display: "block",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            transform: checked ? "translateX(18px)" : "translateX(0)",
            transition: "transform .15s",
            boxShadow: "0 1px 3px rgba(0,0,0,.18)",
          }}
        />
      </span>
    </label>
  );
}

export default function GestionLicencesPortail() {
  const {
    authUser,
    users = [],
    projets = [],
    licenseConfig,
    setLicenseConfig,
  } = useApp();
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState(
    licenseConfig.products.find((product) => product.active)?.id ||
      licenseConfig.products[0]?.id
  );
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const fallbackUsage = useMemo(() => {
    const siteCount = new Set(projets.flatMap((project) => project.sites || []))
      .size;
    return {
      users: users.filter((user) => user.actif !== false).length,
      projects: projets.filter((project) => project.actif !== false).length,
      sites: siteCount,
    };
  }, [users, projets]);

  const selectedProduct =
    licenseConfig.products.find((product) => product.id === selectedId) ||
    licenseConfig.products[0];
  const selectedUsage = selectedProduct
    ? productUsage(selectedProduct, fallbackUsage)
    : fallbackUsage;
  const activeProducts = licenseConfig.products.filter((product) => product.active);
  const isSuperAdmin = authUser?.systemRole === "superadmin";

  function addHistory(config, entry) {
    return {
      ...config,
      history: [
        {
          id: `LIC-H-${Date.now()}`,
          date: new Date().toISOString(),
          user: authUser?.nom || "Super Admin",
          ...entry,
        },
        ...(config.history || []),
      ].slice(0, 30),
    };
  }

  function updateProduct(productId, updater) {
    setLicenseConfig((previous) => ({
      ...previous,
      products: previous.products.map((product) =>
        product.id === productId ? updater(product) : product
      ),
    }));
  }

  function toggleProduct(productId) {
    setLicenseConfig((previous) => {
      const product = previous.products.find((item) => item.id === productId);
      if (!product) return previous;
      const active = !product.active;
      const products = previous.products.map((item) =>
        item.id === productId
          ? {
              ...item,
              active,
              license: {
                ...item.license,
                activation:
                  active && !item.license.activation
                    ? new Date().toISOString().slice(0, 10)
                    : item.license.activation,
              },
            }
          : item
      );
      return addHistory(
        { ...previous, products },
        {
          action: active ? "Produit activé" : "Produit désactivé",
          productId,
          details: product.name,
        }
      );
    });
    setSelectedId(productId);
  }

  function setQuota(type, value) {
    updateProduct(selectedProduct.id, (product) => ({
      ...product,
      quotas: { ...product.quotas, [type]: value },
    }));
  }

  function setLicenseField(field, value) {
    updateProduct(selectedProduct.id, (product) => ({
      ...product,
      license: { ...product.license, [field]: value },
    }));
  }

  function saveSelected() {
    setLicenseConfig((previous) =>
      addHistory(previous, {
        action: "Quotas enregistrés",
        productId: selectedProduct.id,
        details: selectedProduct.name,
      })
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  if (!isSuperAdmin) {
    return (
      <div
        style={{
          background: COLORS.panel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 28,
          color: COLORS.text,
        }}
      >
        <b>Accès réservé au Super Admin.</b>
      </div>
    );
  }

  return (
    <div
      style={{
        animation: "fadeIn .2s ease",
        color: COLORS.text,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 16,
          marginBottom: 18,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#f5f3ff",
              color: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ddd6fe",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={21} />
          </div>
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: COLORS.text,
                margin: 0,
                letterSpacing: "-.3px",
              }}
            >
              Gestion des licences
            </h2>
            <p style={{ fontSize: 13, color: COLORS.muted, margin: "4px 0 0" }}>
              Produits activés et quotas associés par produit.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 38,
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: "#fff",
            color: COLORS.text,
            padding: "8px 14px",
            fontSize: 12.5,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(15,23,42,.05)",
          }}
        >
          <History size={16} />
          Historique des modifications
        </button>
      </div>

      <section
        style={{
          background: COLORS.panel,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: isMobile ? 16 : 22,
          marginBottom: 16,
          boxShadow: "0 8px 24px rgba(15,23,42,.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            borderBottom: `1px solid ${COLORS.border}`,
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          <b style={{ fontSize: 15 }}>Informations générales de licence</b>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 999,
              background: "#dcfce7",
              color: "#15803d",
              fontSize: 11.5,
              fontWeight: 900,
              padding: "4px 10px",
              whiteSpace: "nowrap",
            }}
          >
            <CheckCircle2 size={14} />
            Licence active
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(6, minmax(120px, 1fr))",
            gap: 14,
          }}
        >
          {[
            [BadgeCheck, "Numéro de licence", licenseConfig.number],
            [UserRound, "Titulaire", licenseConfig.holder],
            [PackageCheck, "Type de licence", licenseConfig.type],
            [CalendarDays, "Date d'activation", displayDate(licenseConfig.activation)],
            [CalendarDays, "Expiration", displayDate(licenseConfig.expiration)],
            [SlidersHorizontal, "Produits activés", `${activeProducts.length} / ${licenseConfig.products.length}`],
          ].map(([Icon, label, value]) => (
            <div key={label} style={{ display: "flex", gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "#eef2ff",
                  color: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: COLORS.softMuted,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    marginBottom: 5,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 900,
                    color: COLORS.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.7fr) minmax(360px, .9fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <section
          style={{
            background: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15,23,42,.04)",
          }}
        >
          <div style={{ padding: "18px 22px 12px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>
              Produits disponibles
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 780,
                borderCollapse: "collapse",
                fontSize: 12.5,
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Produits", "Statut", "Utilisateurs", "Projets", "Sites", "Actions"].map(
                    (head) => (
                      <th
                        key={head}
                        style={{
                          textAlign: "left",
                          color: COLORS.muted,
                          fontSize: 10.5,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                          padding: "11px 18px",
                          borderTop: `1px solid ${COLORS.border}`,
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {licenseConfig.products.map((product) => {
                  const usage = productUsage(product, fallbackUsage);
                  const selected = product.id === selectedProduct?.id;
                  return (
                    <tr
                      key={product.id}
                      onClick={() => setSelectedId(product.id)}
                      style={{
                        background: selected ? "#fbfaff" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <td
                        style={{
                          padding: "13px 18px",
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <input
                            type="checkbox"
                            checked={product.active}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggleProduct(product.id)}
                            aria-label={`Activer ${product.name}`}
                            style={{
                              width: 16,
                              height: 16,
                              accentColor: COLORS.accent,
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          <ProductMark product={product} />
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 900,
                                color: COLORS.text,
                                marginBottom: 2,
                              }}
                            >
                              {product.name}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.muted }}>
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "13px 18px",
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <StatusBadge active={product.active} />
                      </td>
                      <td
                        style={{
                          padding: "13px 18px",
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <ProgressMini
                          inactive={!product.active}
                          used={usage.users}
                          max={product.quotas.users}
                          color={product.color}
                        />
                      </td>
                      <td
                        style={{
                          padding: "13px 18px",
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <ProgressMini
                          inactive={!product.active}
                          used={usage.projects}
                          max={product.quotas.projects}
                          color="#22c55e"
                        />
                      </td>
                      <td
                        style={{
                          padding: "13px 18px",
                          borderBottom: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <ProgressMini
                          inactive={!product.active}
                          used={usage.sites}
                          max={product.quotas.sites}
                          color={COLORS.teal}
                        />
                      </td>
                      <td
                        style={{
                          padding: "13px 18px",
                          borderBottom: `1px solid ${COLORS.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.active ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(product.id);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              minWidth: 104,
                              justifyContent: "center",
                              borderRadius: 8,
                              border: "1px solid #ddd6fe",
                              background: "#fff",
                              color: COLORS.accent,
                              padding: "7px 12px",
                              fontSize: 11.5,
                              fontWeight: 900,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            <SlidersHorizontal size={14} />
                            Configurer
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleProduct(product.id);
                            }}
                            style={{
                              minWidth: 104,
                              borderRadius: 8,
                              border: "1px solid #ddd6fe",
                              background: "#fff",
                              color: COLORS.accent,
                              padding: "7px 12px",
                              fontSize: 11.5,
                              fontWeight: 900,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Activer
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label={`Options ${product.name}`}
                          onClick={(event) => event.stopPropagation()}
                          style={iconButtonStyle({ marginLeft: 8 })}
                        >
                          <MoreVertical size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside
          style={{
            background: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 22,
            boxShadow: "0 8px 24px rgba(15,23,42,.04)",
            minHeight: 520,
          }}
        >
          {selectedProduct && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ProductMark product={selectedProduct} />
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, margin: 0, fontWeight: 900 }}>
                    Configuration des quotas
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: COLORS.muted }}>
                    {selectedProduct.name} - {selectedProduct.description}
                  </p>
                </div>
              </div>

              {!selectedProduct.active ? (
                <div
                  style={{
                    marginTop: 34,
                    border: `1px dashed ${COLORS.border}`,
                    borderRadius: 12,
                    padding: 24,
                    textAlign: "center",
                    color: COLORS.muted,
                  }}
                >
                  <PackageCheck size={34} color={COLORS.softMuted} />
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 14,
                      fontWeight: 900,
                      color: COLORS.text,
                    }}
                  >
                    Produit non activé
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleProduct(selectedProduct.id)}
                    style={{
                      marginTop: 16,
                      border: "none",
                      borderRadius: 8,
                      background: COLORS.accent,
                      color: "#fff",
                      padding: "9px 16px",
                      fontSize: 12.5,
                      fontWeight: 900,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Activer le produit
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginTop: 18 }}>
                    {["users", "projects", "sites"].map((type) => (
                      <QuotaStepper
                        key={type}
                        type={type}
                        product={selectedProduct}
                        usage={selectedUsage}
                        onChange={setQuota}
                      />
                    ))}
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <h4
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: COLORS.text,
                        margin: "0 0 12px",
                      }}
                    >
                      Paramètres de licence
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                      }}
                    >
                      <label style={{ fontSize: 11.5, color: COLORS.muted, fontWeight: 800 }}>
                        Type
                        <select
                          value={selectedProduct.license.type}
                          onChange={(event) => setLicenseField("type", event.target.value)}
                          style={fieldStyle({ marginTop: 5 })}
                        >
                          {["Entreprise", "Entreprise / Multi-sites", "Projet", "Site", "Essai"].map(
                            (option) => (
                              <option key={option}>{option}</option>
                            )
                          )}
                        </select>
                      </label>
                      <label style={{ fontSize: 11.5, color: COLORS.muted, fontWeight: 800 }}>
                        Support
                        <select
                          value={selectedProduct.license.support}
                          onChange={(event) =>
                            setLicenseField("support", event.target.value)
                          }
                          style={fieldStyle({ marginTop: 5 })}
                        >
                          {["Standard", "Premium", "Critique"].map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                      <label style={{ fontSize: 11.5, color: COLORS.muted, fontWeight: 800 }}>
                        Activation
                        <input
                          type="date"
                          value={selectedProduct.license.activation || ""}
                          onChange={(event) =>
                            setLicenseField("activation", event.target.value)
                          }
                          style={fieldStyle({ marginTop: 5 })}
                        />
                      </label>
                      <label style={{ fontSize: 11.5, color: COLORS.muted, fontWeight: 800 }}>
                        Expiration
                        <input
                          type="date"
                          value={selectedProduct.license.expiration || ""}
                          onChange={(event) =>
                            setLicenseField("expiration", event.target.value)
                          }
                          style={fieldStyle({ marginTop: 5 })}
                        />
                      </label>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <ToggleLine
                        label="Alerte quota à 80%"
                        checked={!!selectedProduct.license.alertQuota}
                        onChange={(value) => setLicenseField("alertQuota", value)}
                      />
                      <ToggleLine
                        label="Blocage au dépassement du quota"
                        checked={!!selectedProduct.license.blockOverflow}
                        onChange={(value) => setLicenseField("blockOverflow", value)}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={saveSelected}
                    style={{
                      width: "100%",
                      minHeight: 40,
                      marginTop: 22,
                      border: "none",
                      borderRadius: 8,
                      background: COLORS.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: "0 10px 20px rgba(109,63,215,.22)",
                    }}
                  >
                    <Save size={16} />
                    {saved ? "Enregistré" : "Enregistrer"}
                  </button>
                </>
              )}
            </>
          )}
        </aside>
      </div>

      {historyOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15,23,42,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setHistoryOpen(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 620,
              maxHeight: "82vh",
              overflow: "hidden",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 24px 70px rgba(15,23,42,.28)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px 18px",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.text }}>
                  Historique des modifications
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                  Dernières actions sur les produits et quotas.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                aria-label="Fermer l'historique"
                style={iconButtonStyle()}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: 8 }}>
              {(licenseConfig.history || []).map((event) => {
                const product = licenseConfig.products.find(
                  (item) => item.id === event.productId
                );
                return (
                  <div
                    key={event.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "34px minmax(0,1fr)",
                      gap: 10,
                      padding: "11px 10px",
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: "#f5f3ff",
                        color: COLORS.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <History size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <b style={{ fontSize: 13, color: COLORS.text }}>
                          {event.action}
                        </b>
                        <span style={{ fontSize: 11, color: COLORS.softMuted }}>
                          {new Date(event.date).toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>
                        {product?.name || event.details || "Licence"} par {event.user}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
