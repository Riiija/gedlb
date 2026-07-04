"use client";

export const LICENSE_PRODUCTS = [
  {
    id: "softdocs",
    name: "SoftDocs",
    description: "GED & Gestion Documentaire",
    logo: "/softdocs-logo-final.png",
    color: "#2563eb",
    active: true,
    usage: { users: 12, projects: 4, sites: 6 },
    quotas: { users: 20, projects: 10, sites: 10 },
    license: {
      type: "Entreprise",
      activation: "2026-01-01",
      expiration: "2027-01-01",
      support: "Premium",
      alertQuota: true,
      blockOverflow: true,
    },
  },
  {
    id: "softsign",
    name: "SoftSign",
    description: "Signature électronique",
    logo: "/softsign.png",
    color: "#7c3aed",
    active: true,
    usage: { users: 8, projects: 2, sites: 3 },
    quotas: { users: 15, projects: 5, sites: 5 },
    license: {
      type: "Entreprise",
      activation: "2026-01-01",
      expiration: "2027-01-01",
      support: "Premium",
      alertQuota: true,
      blockOverflow: true,
    },
  },
  {
    id: "epaiement",
    name: "Soft e-Payment",
    description: "Paiements & Transactions",
    logo: "/softepayment-logo.png",
    color: "#16a34a",
    active: true,
    usage: { users: 10, projects: 3, sites: 4 },
    quotas: { users: 20, projects: 8, sites: 10 },
    license: {
      type: "Entreprise",
      activation: "2026-01-01",
      expiration: "2027-01-01",
      support: "Standard",
      alertQuota: true,
      blockOverflow: true,
    },
  },
  {
    id: "softlibrary",
    name: "Soft Library",
    description: "Archives Physiques & Courrier",
    logo: "/softlibrary.png",
    color: "#0891b2",
    active: true,
    usage: { users: 6, projects: 2, sites: 5 },
    quotas: { users: 15, projects: 5, sites: 8 },
    license: {
      type: "Entreprise",
      activation: "2026-01-01",
      expiration: "2027-01-01",
      support: "Standard",
      alertQuota: true,
      blockOverflow: false,
    },
  },
  {
    id: "softdrive",
    name: "SoftDrive",
    description: "Stockage & Partage",
    logo: "",
    color: "#0ea5e9",
    active: false,
    usage: { users: 0, projects: 0, sites: 0 },
    quotas: { users: 10, projects: 3, sites: 3 },
    license: {
      type: "Essai",
      activation: "",
      expiration: "",
      support: "Standard",
      alertQuota: true,
      blockOverflow: false,
    },
  },
  {
    id: "softhr",
    name: "SoftHR",
    description: "Ressources Humaines",
    logo: "",
    color: "#f59e0b",
    active: false,
    usage: { users: 0, projects: 0, sites: 0 },
    quotas: { users: 10, projects: 3, sites: 3 },
    license: {
      type: "Essai",
      activation: "",
      expiration: "",
      support: "Standard",
      alertQuota: true,
      blockOverflow: false,
    },
  },
  {
    id: "softtask",
    name: "SoftTask",
    description: "Gestion de tâches",
    logo: "",
    color: "#64748b",
    active: false,
    usage: { users: 0, projects: 0, sites: 0 },
    quotas: { users: 10, projects: 3, sites: 3 },
    license: {
      type: "Essai",
      activation: "",
      expiration: "",
      support: "Standard",
      alertQuota: true,
      blockOverflow: false,
    },
  },
  {
    id: "softbi",
    name: "SoftBI",
    description: "Business Intelligence",
    logo: "",
    color: "#ef4444",
    active: false,
    usage: { users: 0, projects: 0, sites: 0 },
    quotas: { users: 10, projects: 3, sites: 3 },
    license: {
      type: "Essai",
      activation: "",
      expiration: "",
      support: "Standard",
      alertQuota: true,
      blockOverflow: false,
    },
  },
];

export const DEFAULT_LICENSE_CONFIG = {
  number: "SS-2026-MG-0001",
  holder: "Société MalagasySoft",
  type: "Entreprise / Multi-sites",
  activation: "2026-01-01",
  expiration: "2027-01-01",
  status: "active",
  products: LICENSE_PRODUCTS,
  history: [
    {
      id: "LIC-H-001",
      date: "2026-01-01T09:00:00",
      user: "Administrateur Global",
      action: "Activation initiale",
      productId: "softdocs",
      details: "Licence plateforme initialisée avec les produits de base.",
    },
  ],
};

export function cloneLicenseConfig(value = DEFAULT_LICENSE_CONFIG) {
  return JSON.parse(JSON.stringify(value));
}

function numberOr(baseValue, savedValue) {
  const parsed = Number(savedValue);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : baseValue;
}

function mergeProduct(baseProduct, savedProduct) {
  if (!savedProduct || typeof savedProduct !== "object") return baseProduct;
  return {
    ...baseProduct,
    ...savedProduct,
    active:
      typeof savedProduct.active === "boolean"
        ? savedProduct.active
        : baseProduct.active,
    usage: {
      ...baseProduct.usage,
      ...(savedProduct.usage || {}),
    },
    quotas: {
      users: numberOr(baseProduct.quotas.users, savedProduct.quotas?.users),
      projects: numberOr(
        baseProduct.quotas.projects,
        savedProduct.quotas?.projects
      ),
      sites: numberOr(baseProduct.quotas.sites, savedProduct.quotas?.sites),
    },
    license: {
      ...baseProduct.license,
      ...(savedProduct.license || {}),
    },
  };
}

export function normalizeLicenseConfig(saved) {
  const base = cloneLicenseConfig(DEFAULT_LICENSE_CONFIG);
  if (!saved || typeof saved !== "object") return base;

  const savedProducts = new Map(
    (Array.isArray(saved.products) ? saved.products : [])
      .filter((product) => product && product.id)
      .map((product) => [product.id, product])
  );

  return {
    ...base,
    ...saved,
    products: base.products.map((product) =>
      mergeProduct(product, savedProducts.get(product.id))
    ),
    history: Array.isArray(saved.history) ? saved.history : base.history,
  };
}
