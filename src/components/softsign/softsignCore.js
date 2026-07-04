"use client";

export const SS_DOC_TYPES = [
  { id: "devis", label: "Devis", desc: "Offre commerciale, proposition tarifaire" },
  { id: "contrat", label: "Contrat", desc: "Accord commercial, convention, marche" },
  { id: "avenant", label: "Avenant", desc: "Modification de contrat existant" },
  { id: "rapport", label: "Rapport", desc: "Rapport d'activite, etude ou synthese" },
  { id: "protocole", label: "Protocole", desc: "Accord de principe, protocole d'accord" },
  { id: "bon_commande", label: "Bon de commande", desc: "Engagement de commande" },
  { id: "facture", label: "Facture", desc: "Piece financiere fournisseur" },
  { id: "autre", label: "Autre", desc: "Document a traiter dans SoftSign" },
];

export const SS_ALLOWED_FORMATS = [
  { id: "pdf", label: "PDF", extensions: [".pdf"], mimes: ["application/pdf"] },
  { id: "docx", label: "DOCX", extensions: [".docx"], mimes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] },
  { id: "xlsx", label: "XLSX", extensions: [".xlsx"], mimes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] },
  { id: "pptx", label: "PPTX", extensions: [".pptx"], mimes: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"] },
  { id: "jpg_png", label: "JPG / PNG", extensions: [".jpg", ".jpeg", ".png"], mimes: ["image/jpeg", "image/png"] },
  { id: "zip", label: "ZIP", extensions: [".zip"], mimes: ["application/zip", "application/x-zip-compressed"] },
  { id: "csv", label: "CSV", extensions: [".csv"], mimes: ["text/csv"] },
  { id: "txt", label: "TXT", extensions: [".txt"], mimes: ["text/plain"] },
  { id: "odt", label: "ODT", extensions: [".odt"], mimes: ["application/vnd.oasis.opendocument.text"] },
  { id: "tiff", label: "TIFF", extensions: [".tif", ".tiff"], mimes: ["image/tiff"] },
];

export const SS_ACTIONS = [
  { id: "revision", label: "Revision", color: "#7c3aed", zone: false },
  { id: "validation", label: "Validation", color: "#2563eb", zone: false },
  { id: "paraphe", label: "Paraphe", color: "#f59e0b", zone: true },
  { id: "signature", label: "Signature", color: "#7c3aed", zone: true },
  { id: "archivage", label: "Archivage", color: "#64748b", zone: false },
];

export const SS_STATUS = {
  brouillon: { label: "Brouillon", color: "#7c3aed", bg: "#f5f3ff" },
  initie: { label: "Initie", color: "#6d28d9", bg: "#f5f3ff" },
  recu: { label: "Recu", color: "#2563eb", bg: "#eff6ff" },
  en_attente_traitement: { label: "En attente de traitement", color: "#d97706", bg: "#fffbeb" },
  en_attente_signature_externe: { label: "En attente de signature externe", color: "#d97706", bg: "#fffbeb" },
  signe_tiers: { label: "Signe par le tiers", color: "#059669", bg: "#ecfdf5" },
  en_cours: { label: "En cours", color: "#2563eb", bg: "#eff6ff" },
  signe: { label: "Signe", color: "#059669", bg: "#ecfdf5" },
  termine: { label: "Termine", color: "#059669", bg: "#ecfdf5" },
  rejete: { label: "Rejete", color: "#dc2626", bg: "#fef2f2" },
  archive: { label: "Archive", color: "#475569", bg: "#f8fafc" },
};

export const SS_STEP_STATUS = {
  pending: { label: "En attente", color: "#94a3b8", bg: "#f1f5f9" },
  active: { label: "A traiter", color: "#2563eb", bg: "#eff6ff" },
  done: { label: "Terminee", color: "#059669", bg: "#ecfdf5" },
  rejected: { label: "Rejetee", color: "#dc2626", bg: "#fef2f2" },
};

export const SS_DEFAULT_OTP = {
  enabled: true,
  length: 6,
  type: "numeric",
  ttlMinutes: 5,
  maxAttempts: 3,
  maxGenerations: 3,
  channels: ["email"],
};

export const SS_DEFAULT_LICENSE = {
  number: "SS-2024-MG-00487",
  holder: "Softwell Madagascar",
  type: "Entreprise - Annuel",
  active: true,
  activation: "2025-01-01",
  expiration: "2025-12-31",
  support: "Premium 24/7",
  userQuota: 20,
  projectQuota: 10,
  siteQuota: 5,
  quotaAlert: true,
  quotaBlock: true,
};

export const SS_DEFAULT_GENERAL_SETTINGS = {
  referencePrefix: "DOC",
  referenceSeparator: "-",
  referenceIncludeYear: true,
  referenceIncludeSite: false,
  lastNumber: 47,
  externalRefFormat: "DOC-{YYYY}-{SEQ3}",
  defaultSiteCode: "TNR",
  sequenceStart: 48,
  allowedFormats: ["pdf", "docx", "jpg_png"],
  formatRules: [],
  documentTypes: [
    { id: "contrat", code: "CTR", label: "Contrat", active: true },
    { id: "avenant", code: "AVN", label: "Avenant", active: true },
    { id: "rapport", code: "RPT", label: "Rapport", active: true },
    { id: "bon_commande", code: "BON", label: "Bon de commande", active: false },
  ],
};

export const SS_DEFAULT_REMINDERS = {
  delai: 2,
  frequence: 2,
  maxRelances: 5,
  notifInterne: true,
  lienDirect: true,
};

export function buildSoftSignReferenceFormat(settings = SS_DEFAULT_GENERAL_SETTINGS) {
  const separator = settings.referenceSeparator || "-";
  const tokens = [
    settings.referencePrefix || "DOC",
    settings.referenceIncludeYear === false ? "" : "{YYYY}",
    settings.referenceIncludeSite ? "{SITE}" : "",
    "{SEQ3}",
  ].filter(Boolean);
  return tokens.join(separator);
}

export function normalizeSoftSignGeneralSettings(settings = {}) {
  const base = { ...SS_DEFAULT_GENERAL_SETTINGS, ...(settings || {}) };
  const legacyFormat = settings?.externalRefFormat || "";
  const firstToken = legacyFormat.split(/\{|\-/)[0]?.trim();
  const normalized = {
    ...base,
    referencePrefix: settings?.referencePrefix || firstToken || SS_DEFAULT_GENERAL_SETTINGS.referencePrefix,
    referenceSeparator: base.referenceSeparator || "-",
    referenceIncludeYear: settings?.referenceIncludeYear ?? (legacyFormat ? /\{YYYY\}|\{YY\}/.test(legacyFormat) : SS_DEFAULT_GENERAL_SETTINGS.referenceIncludeYear),
    referenceIncludeSite: settings?.referenceIncludeSite ?? (legacyFormat ? /\{SITE\}/.test(legacyFormat) : SS_DEFAULT_GENERAL_SETTINGS.referenceIncludeSite),
    lastNumber: Math.max(0, Number(base.lastNumber ?? Number(base.sequenceStart || 1) - 1)),
    sequenceStart: Math.max(1, Number(base.sequenceStart || Number(base.lastNumber || 0) + 1)),
    allowedFormats: Array.isArray(base.allowedFormats) && base.allowedFormats.length ? base.allowedFormats : SS_DEFAULT_GENERAL_SETTINGS.allowedFormats,
    formatRules: Array.isArray(base.formatRules) ? base.formatRules : [],
    documentTypes: Array.isArray(base.documentTypes) && base.documentTypes.length ? base.documentTypes : SS_DEFAULT_GENERAL_SETTINGS.documentTypes,
  };
  return {
    ...normalized,
    externalRefFormat: normalized.externalRefFormat || buildSoftSignReferenceFormat(normalized),
  };
}

export function getSoftSignDocumentTypes(settings = {}) {
  const normalized = normalizeSoftSignGeneralSettings(settings);
  return normalized.documentTypes.map((type) => {
    const fallback = SS_DOC_TYPES.find((item) => item.id === type.id);
    return {
      id: type.id,
      code: type.code || fallback?.id?.slice(0, 3).toUpperCase() || "DOC",
      label: type.label || fallback?.label || type.id,
      desc: type.desc || fallback?.desc || "",
      active: type.active !== false,
    };
  });
}

export function getSoftSignAllowedFormatIds(settings = {}, projectId = "", site = "") {
  const normalized = normalizeSoftSignGeneralSettings(settings);
  const scoped = (normalized.formatRules || [])
    .filter((rule) => {
      const projectOk = !rule.projectId || !projectId || rule.projectId === projectId;
      const siteOk = !rule.site || !site || rule.site === site;
      return projectOk && siteOk && Array.isArray(rule.formats) && rule.formats.length;
    })
    .sort((a, b) => Number(!!b.projectId) + Number(!!b.site) - Number(!!a.projectId) - Number(!!a.site))[0];
  return scoped?.formats || normalized.allowedFormats || SS_DEFAULT_GENERAL_SETTINGS.allowedFormats;
}

export function getSoftSignAccept(settings = {}, projectId = "", site = "") {
  const ids = new Set(getSoftSignAllowedFormatIds(settings, projectId, site));
  return SS_ALLOWED_FORMATS
    .filter((format) => ids.has(format.id))
    .flatMap((format) => format.extensions)
    .join(",") || ".pdf";
}

export function isSoftSignFileAllowed(file, settings = {}, projectId = "", site = "") {
  if (!file) return false;
  const ids = new Set(getSoftSignAllowedFormatIds(settings, projectId, site));
  const name = String(file.name || "").toLowerCase();
  const mime = String(file.type || "").toLowerCase();
  return SS_ALLOWED_FORMATS
    .filter((format) => ids.has(format.id))
    .some((format) =>
      (format.extensions || []).some((ext) => name.endsWith(ext)) ||
      (format.mimes || []).some((allowedMime) => allowedMime.toLowerCase() === mime)
    );
}

export function softSignSiteCode(site, fallback = "TNR") {
  const normalized = String(site || "").trim().toLowerCase();
  const known = {
    antananarivo: "TNR",
    tana: "TNR",
    toamasina: "TMM",
    tamatave: "TMM",
    mahajanga: "MJN",
    majunga: "MJN",
    antsiranana: "DIE",
    diego: "DIE",
    fianarantsoa: "WFI",
    tulear: "TLE",
    toliara: "TLE",
  };
  return known[normalized] || String(site || fallback || "TNR").replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase() || "TNR";
}

export function formatSoftSignReference(format, context = {}) {
  const date = context.date ? new Date(context.date) : new Date();
  const year = String(date.getFullYear());
  const yy = year.slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const seq = Number(context.sequence || 1);
  const site = softSignSiteCode(context.site, context.defaultSiteCode);
  const type = String(context.type || "DOC").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "DOC";

  return String(format || buildSoftSignReferenceFormat(SS_DEFAULT_GENERAL_SETTINGS))
    .replaceAll("{YYYY}", year)
    .replaceAll("{YY}", yy)
    .replaceAll("{MM}", month)
    .replaceAll("{DD}", day)
    .replaceAll("{SITE}", site)
    .replaceAll("{TYPE}", type)
    .replaceAll("{SEQ5}", String(seq).padStart(5, "0"))
    .replaceAll("{SEQ4}", String(seq).padStart(4, "0"))
    .replaceAll("{SEQ3}", String(seq).padStart(3, "0"))
    .replaceAll("{SEQ}", String(seq));
}

export function nextSoftSignReference(settings = SS_DEFAULT_GENERAL_SETTINGS, docs = [], context = {}) {
  const normalized = normalizeSoftSignGeneralSettings(settings);
  const start = Math.max(1, Number(normalized.sequenceStart || Number(normalized.lastNumber || 0) + 1));
  const maxSeq = docs.reduce((max, doc) => {
    const refs = [doc?.ref, doc?.externalRef, doc?.trackingRef].filter(Boolean);
    const refMax = refs.reduce((inner, ref) => {
      const match = String(ref).match(/(\d+)(?!.*\d)/);
      return match ? Math.max(inner, Number(match[1])) : inner;
    }, 0);
    return Math.max(max, refMax);
  }, Math.max(start - 1, Number(normalized.lastNumber || 0)));

  return formatSoftSignReference(normalized.externalRefFormat || buildSoftSignReferenceFormat(normalized), {
    ...context,
    defaultSiteCode: normalized.defaultSiteCode,
    sequence: maxSeq + 1,
  });
}

const SIG_RAZAFY_DRAWN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 130'%3E%3Crect width='320' height='130' fill='white'/%3E%3Cpath d='M36 78 C68 18 91 108 126 54 S188 72 218 44 S254 42 287 70' fill='none' stroke='%23111827' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M74 94 C118 88 194 94 268 86' fill='none' stroke='%23111827' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";
const SIG_RANDRIA_DRAWN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 130'%3E%3Crect width='320' height='130' fill='white'/%3E%3Cpath d='M42 78 C74 28 100 104 127 55 C148 24 166 84 188 55 C210 30 228 68 248 49 C263 36 278 49 292 62' fill='none' stroke='%231f2937' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M58 96 C120 92 190 91 276 84' fill='none' stroke='%231f2937' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

export const INIT_SS_SIGNATURES_PRO = [
  {
    id: "SIG-001",
    userId: "U003",
    userName: "Razafy Pierre",
    userRole: "DAF",
    type: "signature",
    mode: "dessin",
    value: SIG_RAZAFY_DRAWN,
    default: true,
    active: true,
    createdAt: "2025-03-15T09:32:00",
  },
  {
    id: "SIG-002",
    userId: "U003",
    userName: "Razafy Pierre",
    userRole: "DAF",
    type: "paraphe",
    mode: "texte",
    value: "R.P",
    default: false,
    active: true,
    createdAt: "2025-03-22T10:15:00",
  },
  {
    id: "SIG-003",
    userId: "U002",
    userName: "Randria Marie-Claire",
    userRole: "Resp. Financier",
    type: "signature",
    mode: "image",
    value: "Randria M.",
    default: true,
    active: true,
    createdAt: "2025-01-10T11:20:00",
  },
  {
    id: "SIG-004",
    userId: "U001",
    userName: "Rakoto Jean-Baptiste",
    userRole: "Chef de Projet",
    type: "paraphe",
    mode: "dessin",
    value: "R.J",
    default: true,
    active: false,
    createdAt: "2025-04-05T11:08:00",
  },
  {
    id: "SIG-005",
    userId: "U005",
    userName: "Andriamananjara Lova",
    userRole: "Ordonnateur",
    type: "signature",
    mode: "texte",
    value: "Andriamananjara L.",
    default: true,
    active: true,
    createdAt: "2025-02-18T08:45:00",
  },
  {
    id: "SIG-006",
    userId: "U003",
    userName: "Razafy Pierre",
    userRole: "DAF",
    type: "signature",
    mode: "dessin",
    value: SIG_RAZAFY_DRAWN,
    default: true,
    active: true,
    createdAt: "2026-04-01T08:15:00",
  },
  {
    id: "SIG-007",
    userId: "U002",
    userName: "Randria Marie-Claire",
    userRole: "Resp. Financier",
    type: "signature",
    mode: "dessin",
    value: SIG_RANDRIA_DRAWN,
    default: true,
    active: true,
    createdAt: "2026-04-01T08:30:00",
  },
];

export const INIT_SS_DELEGATIONS_PRO = [
  {
    id: "DEL-001",
    delegantId: "U003",
    delegantName: "Razafy Pierre",
    delegantRole: "DAF",
    delegataireId: "U002",
    delegataireName: "Randria Marie-Claire",
    delegataireRole: "Resp. Financier",
    startDate: "2026-06-01",
    endDate: "2026-06-15",
    actions: ["validation", "signature"],
    docTypes: ["contrat", "bon_commande", "devis", "facture"],
    site: "Antananarivo",
    projectId: "",
    active: true,
    comment: "Délégation pendant congés DAF",
    createdAt: "2026-05-28T10:30:00",
  },
  {
    id: "DEL-002",
    delegantId: "U003",
    delegantName: "Razafy Pierre",
    delegantRole: "DAF",
    delegataireId: "U005",
    delegataireName: "Andriamananjara Lova",
    delegataireRole: "Ordonnateur",
    startDate: "2026-05-01",
    endDate: "2026-05-14",
    actions: ["validation"],
    docTypes: ["bon_commande", "facture"],
    site: "",
    projectId: "",
    active: true,
    comment: "Validation bons de commande mai",
    createdAt: "2026-04-28T09:15:00",
  },
  {
    id: "DEL-003",
    delegantId: "U001",
    delegantName: "Rakoto Jean-Baptiste",
    delegantRole: "Chef de Projet",
    delegataireId: "U003",
    delegataireName: "Razafy Pierre",
    delegataireRole: "DAF",
    startDate: "2026-05-20",
    endDate: "2026-06-20",
    actions: ["validation", "signature"],
    docTypes: ["contrat", "devis"],
    site: "Antananarivo",
    projectId: "",
    active: true,
    comment: "Délégation signature contrats projet",
    createdAt: "2026-05-19T16:42:00",
  },
  {
    id: "DEL-004",
    delegantId: "U002",
    delegantName: "Randria Marie-Claire",
    delegantRole: "Resp. Financier",
    delegataireId: "U004",
    delegataireName: "Rasoamanarivo Hanta",
    delegataireRole: "Comptable Senior",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    actions: ["validation"],
    docTypes: ["facture"],
    site: "",
    projectId: "",
    active: true,
    comment: "Validation factures fournisseurs avril",
    createdAt: "2026-03-31T11:08:00",
  },
];

export const INIT_SS_EXTERNAL_ACCOUNTS = [
  {
    id: "EXT-001",
    raisonSociale: "NTIC Solutions SARL",
    login: "NTIC Solutions SARL",
    contactFirstName: "Jean-Pierre",
    contactLastName: "Rakotobe",
    contactName: "Jean-Pierre Rakotobe",
    email: "jp.rakotobe@ntic-solutions.mg",
    phone: "+261 34 12 345 67",
    nif: "4008756",
    stat: "51400 12 2004 0 10001",
    secteur: "Informatique / Telecoms",
    forme: "SARL",
    projectId: "PRJ-003",
    site: "Antananarivo",
    status: "actif",
    createdAt: "2026-05-10T10:24:00",
    docs: 2,
  },
  {
    id: "EXT-002",
    raisonSociale: "COLAS Madagascar",
    login: "COLAS Madagascar",
    contactFirstName: "Rakoto",
    contactLastName: "Jean",
    contactName: "Rakoto Jean",
    email: "colas@colas.mg",
    phone: "032 45 123 45",
    nif: "3001234567",
    stat: "12345 11 2020 0 12345",
    secteur: "BTP",
    forme: "SA",
    projectId: "PRJ-001",
    site: "Antananarivo",
    status: "actif",
    createdAt: "2026-05-15T10:24:00",
    docs: 2,
  },
];

export const INIT_SS_WORKFLOWS_PRO = [
  {
    id: "WF-CONTRAT-STD",
    name: "Contrat Standard",
    desc: "Validation hierarchique 3 niveaux avec paraphe et signature finale.",
    entity: "Softwell Madagascar",
    site: "",
    docTypes: ["contrat", "avenant", "protocole"],
    conditions: [{ field: "amount", op: ">", value: 50000000, join: "ET" }],
    active: true,
    default: true,
    finalEmail: true,
    steps: [
      { id: "S1", order: 1, label: "Validation Finance", signers: ["U002"], action: "validation", mode: "sequentielle", durationDays: 2, otpRequired: false },
      { id: "S2", order: 2, label: "Paraphe DAF", signers: ["U003"], action: "paraphe", mode: "sequentielle", durationDays: 3, otpRequired: true },
      { id: "S3", order: 3, label: "Signature DG", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 5, otpRequired: true, allowExternalSignature: true },
      { id: "S4", order: 4, label: "Archivage", signers: ["U006"], action: "archivage", mode: "sequentielle", durationDays: 1, otpRequired: false },
    ],
    used: 12,
  },
  {
    id: "WF-CONTRAT-FOURN",
    name: "Fournisseur",
    desc: "Circuit special fournisseurs agrees.",
    entity: "Softwell Madagascar",
    site: "",
    docTypes: ["contrat", "devis", "bon_commande", "facture"],
    conditions: [],
    active: true,
    default: false,
    finalEmail: true,
    steps: [
      { id: "S1", order: 1, label: "Reception et verification", signers: ["U004", "U006"], action: "validation", mode: "parallele", durationDays: 2, otpRequired: false },
      { id: "S2", order: 2, label: "Validation Achat", signers: ["U001"], action: "validation", mode: "sequentielle", durationDays: 2, otpRequired: false },
      { id: "S3", order: 3, label: "Signature DAF", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 3, otpRequired: true, allowExternalSignature: true },
    ],
    used: 7,
  },
  {
    id: "WF-CONTRAT-INT",
    name: "International",
    desc: "Inclut validation juridique et direction.",
    entity: "Softwell Madagascar",
    site: "",
    docTypes: ["contrat", "avenant"],
    conditions: [{ field: "devise", op: "!=", value: "MGA", join: "ET" }],
    active: true,
    default: false,
    finalEmail: true,
    steps: [
      { id: "S1", order: 1, label: "Revision juridique", signers: ["U003"], action: "revision", mode: "sequentielle", durationDays: 3, otpRequired: false },
      { id: "S2A", order: 2, label: "Validation Finance", signers: ["U002"], action: "validation", mode: "parallele", durationDays: 2, otpRequired: false },
      { id: "S2B", order: 2, label: "Validation Achat", signers: ["U001"], action: "validation", mode: "parallele", durationDays: 2, otpRequired: false },
      { id: "S3", order: 3, label: "Signature Direction", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 5, otpRequired: true, allowExternalSignature: true },
    ],
    used: 4,
  },
  {
    id: "WF-URGENT",
    name: "Urgent",
    desc: "Circuit accelere, 1 seul validateur.",
    entity: "Softwell Madagascar",
    site: "",
    docTypes: ["contrat", "devis", "avenant", "protocole"],
    conditions: [],
    active: true,
    default: false,
    finalEmail: true,
    steps: [
      { id: "S1", order: 1, label: "Validation express", signers: ["U003"], action: "validation", mode: "sequentielle", durationDays: 1, otpRequired: false },
      { id: "S2", order: 2, label: "Signature", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 1, otpRequired: true, allowExternalSignature: true },
    ],
    used: 3,
  },
  {
    id: "WF-MONTANT-ELEVE",
    name: "Montant eleve",
    desc: "Validation DG obligatoire.",
    entity: "Softwell Madagascar",
    site: "",
    docTypes: ["devis", "contrat", "bon_commande"],
    conditions: [{ field: "amount", op: ">", value: 100000000, join: "ET" }],
    active: true,
    default: false,
    finalEmail: true,
    steps: [
      { id: "S1", order: 1, label: "Validation Finance", signers: ["U002"], action: "validation", mode: "sequentielle", durationDays: 2, otpRequired: false },
      { id: "S2", order: 2, label: "Paraphe DAF", signers: ["U003"], action: "paraphe", mode: "sequentielle", durationDays: 2, otpRequired: true },
      { id: "S3", order: 3, label: "Signature DG", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 3, otpRequired: true, allowExternalSignature: true },
    ],
    used: 9,
  },
];

export const INIT_SS_DOCUMENTS_PRO = [
  {
    id: "SS-1001",
    ref: "SS-DOC-2026-001",
    title: "Contrat Fournitures NTIC Solutions SARL - 2024",
    type: "contrat",
    origin: "externe",
    status: "en_cours",
    amount: 125000000,
    currency: "MGA",
    projectId: "PRJ-003",
    projectName: "PIVOT - Infrastructures Sante",
    site: "Antananarivo",
    createdAt: "2026-05-20T09:00:00",
    date: "2026-05-20",
    deposantId: "EXT-001",
    deposantName: "NTIC Solutions SARL",
    author: "Razafy Pierre",
    workflowId: "WF-CONTRAT-STD",
    workflowName: "Contrat Standard",
    currentStepOrder: 3,
    priority: "haute",
    fileName: "contrat-ntic.pdf",
    pages: 8,
    signedBy: [],
    zones: [
      { id: "Z-1", stepId: "S2", userId: "U003", action: "paraphe", mode: "all", page: "all", position: "bas_gauche", x: 70, y: 770, w: 110, h: 42 },
      { id: "Z-2", stepId: "S3", userId: "U003", action: "signature", mode: "last", page: "last", position: "bas_droite", x: 390, y: 760, w: 130, h: 50 },
    ],
    steps: [
      { id: "S1", order: 1, label: "Validation Finance", signers: ["U002"], action: "validation", mode: "sequentielle", durationDays: 2, status: "done", doneBy: "U002", doneByName: "Randria Marie-Claire", doneAt: "2026-05-20T11:00:00", dueAt: "2026-05-22T09:00:00", otpRequired: false },
      { id: "S2", order: 2, label: "Paraphe DAF", signers: ["U003"], action: "paraphe", mode: "sequentielle", durationDays: 3, status: "done", doneBy: "U003", doneByName: "Razafy Pierre", doneAt: "2026-05-20T16:42:00", dueAt: "2026-05-23T09:00:00", otpRequired: true },
      { id: "S3", order: 3, label: "Signature DG", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 5, status: "active", dueAt: "2026-05-21T18:00:00", otpRequired: true, allowExternalSignature: true },
      { id: "S4", order: 4, label: "Archivage", signers: ["U006"], action: "archivage", mode: "sequentielle", durationDays: 1, status: "pending", otpRequired: false },
    ],
    audit: [
      { date: "2026-05-20T09:00:00", user: "NTIC Solutions SARL", action: "depot_externe", detail: "Document depose depuis le portail externe" },
      { date: "2026-05-20T11:00:00", user: "Randria Marie-Claire", action: "validation", detail: "Validation Finance terminee" },
      { date: "2026-05-20T16:42:00", user: "Razafy Pierre", action: "paraphe", detail: "Paraphe DAF appose" },
    ],
  },
  {
    id: "SS-1002",
    ref: "SS-DOC-2026-002",
    title: "Avenant N.2 - Marche Prestataire Logistique",
    type: "avenant",
    origin: "interne",
    status: "en_cours",
    amount: 38000000,
    currency: "MGA",
    projectId: "PRJ-001",
    projectName: "PREA - Rehabilitation Ecoles",
    site: "Fianarantsoa",
    createdAt: "2026-05-19T12:00:00",
    date: "2026-05-19",
    deposantId: "U003",
    deposantName: "Razafy Pierre",
    author: "Razafy Pierre",
    workflowId: "WF-CONTRAT-INT",
    workflowName: "International",
    currentStepOrder: 2,
    priority: "normale",
    pages: 4,
    signedBy: [],
    zones: [],
    steps: [
      { id: "S1", order: 1, label: "Revision juridique", signers: ["U003"], action: "revision", mode: "sequentielle", durationDays: 3, status: "done", doneBy: "U003", doneByName: "Razafy Pierre", doneAt: "2026-05-19T15:00:00", otpRequired: false },
      { id: "S2A", order: 2, label: "Validation Finance", signers: ["U002"], action: "validation", mode: "parallele", durationDays: 2, status: "active", dueAt: "2026-05-22T12:00:00", otpRequired: false },
      { id: "S2B", order: 2, label: "Validation Achat", signers: ["U001"], action: "validation", mode: "parallele", durationDays: 2, status: "active", dueAt: "2026-05-22T12:00:00", otpRequired: false },
      { id: "S3", order: 3, label: "Signature Direction", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 5, status: "pending", otpRequired: true, allowExternalSignature: true },
    ],
    audit: [{ date: "2026-05-19T12:00:00", user: "Razafy Pierre", action: "creation", detail: "Depot interne" }],
  },
  {
    id: "SS-1003",
    ref: "SS-DOC-2026-003",
    title: "Devis Renovation Bureaux - Batiment B",
    type: "devis",
    origin: "interne",
    status: "termine",
    amount: 22000000,
    currency: "MGA",
    projectId: "PRJ-004",
    projectName: "PADAP - Agriculture Durable",
    site: "Antananarivo",
    createdAt: "2026-05-15T08:30:00",
    date: "2026-05-15",
    deposantId: "U001",
    deposantName: "Rakoto Jean-Baptiste",
    author: "Rakoto Jean-Baptiste",
    workflowId: "WF-CONTRAT-FOURN",
    workflowName: "Fournisseur",
    priority: "basse",
    pages: 2,
    fileName: "Exemple facture archivee.pdf",
    fileB64: "/softsign/samples/fact-002.pdf",
    signedBy: ["U003"],
    zones: [],
    certificate: { id: "CERT-SS-1003", generatedAt: "2026-05-16T12:00:00", qr: "SS-DOC-2026-003|CERT-SS-1003" },
    steps: [
      { id: "S1", order: 1, label: "Reception et verification", signers: ["U004", "U006"], action: "validation", mode: "parallele", durationDays: 2, status: "done", doneBy: "U004", doneByName: "Rasoamanarivo Hanta", doneAt: "2026-05-15T10:00:00" },
      { id: "S2", order: 2, label: "Validation Achat", signers: ["U001"], action: "validation", mode: "sequentielle", durationDays: 2, status: "done", doneBy: "U001", doneByName: "Rakoto Jean-Baptiste", doneAt: "2026-05-15T16:00:00" },
      { id: "S3", order: 3, label: "Signature DAF", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 3, status: "done", doneBy: "U003", doneByName: "Razafy Pierre", doneAt: "2026-05-16T12:00:00" },
    ],
    audit: [
      { date: "2026-05-15T08:30:00", user: "Rakoto Jean-Baptiste", action: "creation", detail: "Depot interne" },
      { date: "2026-05-16T12:00:00", user: "Systeme", action: "certificat", detail: "Certificat genere automatiquement" },
    ],
  },
  {
    id: "SS-1004",
    ref: "SS-DOC-2026-004",
    title: "Marche Public Equipements DSI",
    type: "contrat",
    origin: "interne",
    status: "en_cours",
    amount: 180000000,
    currency: "MGA",
    projectId: "PRJ-003",
    projectName: "PIVOT - Infrastructures Sante",
    site: "Mahajanga",
    createdAt: "2026-05-03T08:00:00",
    date: "2026-05-03",
    deposantId: "U005",
    deposantName: "Andriamananjara Lova",
    author: "Andriamananjara Lova",
    workflowId: "WF-MONTANT-ELEVE",
    workflowName: "Montant eleve",
    priority: "haute",
    pages: 6,
    signedBy: [],
    zones: [],
    steps: [
      { id: "S1", order: 1, label: "Validation Finance", signers: ["U002"], action: "validation", mode: "sequentielle", durationDays: 2, status: "done", doneBy: "U002", doneAt: "2026-05-05T10:00:00" },
      { id: "S2", order: 2, label: "Paraphe DAF", signers: ["U003"], action: "paraphe", mode: "sequentielle", durationDays: 2, status: "active", dueAt: "2026-05-07T10:00:00", otpRequired: true },
      { id: "S3", order: 3, label: "Signature DG", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 3, status: "pending", otpRequired: true, allowExternalSignature: true },
    ],
    audit: [{ date: "2026-05-03T08:00:00", user: "Andriamananjara Lova", action: "creation", detail: "Depot interne" }],
  },
  {
    id: "SS-1005",
    ref: "SS-DOC-2026-005",
    title: "Avenant N.1 - Maintenance",
    type: "avenant",
    origin: "interne",
    status: "rejete",
    amount: 8500000,
    currency: "MGA",
    projectId: "PRJ-001",
    projectName: "PREA - Rehabilitation Ecoles",
    site: "Antananarivo",
    createdAt: "2026-05-11T10:00:00",
    date: "2026-05-11",
    deposantId: "U001",
    deposantName: "Rakoto Jean-Baptiste",
    author: "Rakoto Jean-Baptiste",
    workflowId: "WF-CONTRAT-STD",
    workflowName: "Contrat Standard",
    priority: "normale",
    rejection: { reason: "Clause de maintenance incomplete", step: "Validation Finance", user: "Randria Marie-Claire", date: "2026-05-12T11:20:00" },
    pages: 3,
    zones: [],
    steps: [
      { id: "S1", order: 1, label: "Validation Finance", signers: ["U002"], action: "validation", mode: "sequentielle", durationDays: 2, status: "rejected", doneBy: "U002", doneByName: "Randria Marie-Claire", doneAt: "2026-05-12T11:20:00" },
    ],
    audit: [
      { date: "2026-05-11T10:00:00", user: "Rakoto Jean-Baptiste", action: "creation", detail: "Depot interne" },
      { date: "2026-05-12T11:20:00", user: "Randria Marie-Claire", action: "rejet", detail: "Clause de maintenance incomplete" },
    ],
  },
  {
    id: "SS-FACT-001",
    ref: "SS-FACT-2026-001",
    title: "Facture fournisseur FACT 001 - COLAS Madagascar",
    type: "facture",
    origin: "externe",
    status: "en_cours",
    amount: 18500000,
    currency: "MGA",
    projectId: "PRJ-001",
    projectName: "PREA - Rehabilitation Ecoles",
    site: "Antananarivo",
    createdAt: "2026-04-03T09:18:00",
    updatedAt: "2026-04-04T15:40:00",
    date: "2026-04-03",
    workflowStartedAt: "2026-04-03T09:18:00",
    deposantId: "EXT-002",
    deposantName: "COLAS Madagascar",
    author: "COLAS Madagascar",
    workflowId: "WF-CONTRAT-FOURN",
    workflowName: "Fournisseur",
    currentStepOrder: 3,
    priority: "haute",
    fileName: "FACT 001.pdf",
    fileB64: "/softsign/samples/fact-001.pdf",
    pages: 1,
    signedBy: [],
    zones: [
      { id: "Z-FACT-001-S3", stepId: "S3", userId: "U003", action: "signature", mode: "last", page: "last", position: "bas_droite", x: 390, y: 760, w: 145, h: 54 },
    ],
    steps: [
      { id: "S1", order: 1, label: "Reception et verification", signers: ["U004", "U006"], action: "validation", mode: "parallele", durationDays: 2, status: "done", doneBy: "U004", doneByName: "Rasoamanarivo Hanta", doneAt: "2026-04-03T10:20:00", dueAt: "2026-04-05T09:18:00", comment: "Facture lisible et pieces fournisseur controlees.", otpRequired: false },
      { id: "S2", order: 2, label: "Validation Achat", signers: ["U001"], action: "validation", mode: "sequentielle", durationDays: 2, status: "done", doneBy: "U001", doneByName: "Rakoto Jean-Baptiste", doneAt: "2026-04-04T15:40:00", dueAt: "2026-04-05T10:20:00", comment: "Bon a payer apres signature DAF.", otpRequired: false },
      { id: "S3", order: 3, label: "Signature DAF", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 3, status: "active", dueAt: "2026-05-30T18:00:00", otpRequired: true, allowExternalSignature: true },
    ],
    audit: [
      { date: "2026-04-03T09:18:00", user: "COLAS Madagascar", action: "depot_externe", detail: "FACT 001.pdf depose depuis le portail fournisseur SoftGED." },
      { date: "2026-04-03T10:20:00", user: "Rasoamanarivo Hanta", action: "validation", detail: "Reception et verification terminees." },
      { date: "2026-04-04T15:40:00", user: "Rakoto Jean-Baptiste", action: "validation", detail: "Validation achat effectuee." },
    ],
  },
  {
    id: "SS-FACT-002",
    ref: "SS-FACT-2026-002",
    title: "Facture fournisseur FACT 002 - COLAS Madagascar",
    type: "facture",
    origin: "externe",
    status: "archive",
    amount: 42750000,
    currency: "MGA",
    projectId: "PRJ-001",
    projectName: "PREA - Rehabilitation Ecoles",
    site: "Antananarivo",
    createdAt: "2026-04-03T11:30:00",
    updatedAt: "2026-04-05T10:20:00",
    finalizedAt: "2026-04-05T10:12:00",
    archivedAt: "2026-04-05T10:20:00",
    date: "2026-04-03",
    workflowStartedAt: "2026-04-03T11:30:00",
    deposantId: "EXT-002",
    deposantName: "COLAS Madagascar",
    author: "COLAS Madagascar",
    workflowId: "WF-CONTRAT-FOURN",
    workflowName: "Fournisseur",
    priority: "normale",
    fileName: "FACT 002.pdf",
    fileB64: "/softsign/samples/fact-002.pdf",
    pages: 4,
    signedBy: ["U003"],
    zones: [
      { id: "Z-FACT-002-S3", stepId: "S3", userId: "U003", action: "signature", mode: "last", page: "last", position: "bas_droite", x: 390, y: 760, w: 145, h: 54 },
    ],
    certificate: { id: "CERT-SS-FACT-002", generatedAt: "2026-04-05T10:12:00", qr: "SS-FACT-2026-002|CERT-SS-FACT-002|2026-04-05T10:12:00" },
    steps: [
      { id: "S1", order: 1, label: "Reception et verification", signers: ["U004", "U006"], action: "validation", mode: "parallele", durationDays: 2, status: "done", doneBy: "U006", doneByName: "Ratsimbazafy Noro", doneAt: "2026-04-04T09:00:00", dueAt: "2026-04-05T11:30:00", comment: "Facture rattachee au dossier fournisseur COLAS.", otpRequired: false },
      { id: "S2", order: 2, label: "Validation Achat", signers: ["U001"], action: "validation", mode: "sequentielle", durationDays: 2, status: "done", doneBy: "U001", doneByName: "Rakoto Jean-Baptiste", doneAt: "2026-04-04T14:15:00", dueAt: "2026-04-06T09:00:00", comment: "Commande et reception conformes.", otpRequired: false },
      { id: "S3", order: 3, label: "Signature DAF", signers: ["U003"], action: "signature", mode: "sequentielle", durationDays: 3, status: "done", doneBy: "U003", doneByName: "Razafy Pierre", doneAt: "2026-04-05T10:10:00", dueAt: "2026-04-07T14:15:00", comment: "Signature DAF apposee.", signatureMode: "registered", signatureValue: SIG_RAZAFY_DRAWN, otpVerified: true, otpRequired: true },
    ],
    audit: [
      { date: "2026-04-03T11:30:00", user: "COLAS Madagascar", action: "depot_externe", detail: "FACT 002.pdf depose depuis le portail fournisseur SoftGED." },
      { date: "2026-04-04T09:00:00", user: "Ratsimbazafy Noro", action: "validation", detail: "Reception et verification terminees." },
      { date: "2026-04-04T14:15:00", user: "Rakoto Jean-Baptiste", action: "validation", detail: "Validation achat effectuee." },
      { date: "2026-04-05T10:10:00", user: "Razafy Pierre", action: "signature", detail: "Signature DAF apposee." },
      { date: "2026-04-05T10:12:00", user: "Systeme", action: "certificat", detail: "Certificat de validation genere automatiquement." },
      { date: "2026-04-05T10:20:00", user: "Ratsimbazafy Noro", action: "archivage", detail: "Document archive avec son certificat." },
    ],
  },
];

export function getAction(actionId) {
  return SS_ACTIONS.find((a) => a.id === actionId) || SS_ACTIONS[1];
}

export function isZoneRequired(actionId) {
  return !!getAction(actionId).zone;
}

export function formatMoney(value, currency = "MGA") {
  const n = Number(value || 0);
  return `${new Intl.NumberFormat("fr-FR").format(n)} ${currency}`;
}

export function isoDate(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

export function addDaysIso(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString();
}

export function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
}

export function userName(users = [], id) {
  return users.find((u) => u.id === id)?.nom || id || "Utilisateur";
}

export function getProjectName(projets = [], id) {
  return projets.find((p) => p.id === id)?.nom || id || "";
}

export function getSitesForProject(projets = [], id) {
  const project = projets.find((p) => p.id === id);
  if (project?.sites?.length) return project.sites;
  return [...new Set((projets || []).flatMap((p) => p.sites || []))];
}

export function conditionMatches(condition, draft = {}) {
  const left = condition.field === "amount" ? Number(draft.amount || 0) : String(draft[condition.field] || "");
  const right = condition.field === "amount" ? Number(condition.value || 0) : String(condition.value || "");
  if (condition.op === ">") return left > right;
  if (condition.op === ">=") return left >= right;
  if (condition.op === "<") return left < right;
  if (condition.op === "<=") return left <= right;
  if (condition.op === "!=") return left !== right;
  return String(left).toLowerCase() === String(right).toLowerCase();
}

export function workflowScore(workflow, draft = {}) {
  if (!workflow?.active) return -1;
  if (workflow.docTypes?.length && !workflow.docTypes.includes(draft.type)) return -1;
  if (workflow.site && draft.site && workflow.site !== draft.site) return -1;
  let score = workflow.default ? 10 : 0;
  const conditions = workflow.conditions || [];
  if (!conditions.length) return score + 1;
  const matches = conditions.filter((c) => conditionMatches(c, draft)).length;
  return matches === conditions.length ? score + matches * 20 : score;
}

export function suggestWorkflow(workflows = [], draft = {}) {
  const ranked = workflows
    .map((workflow) => ({ workflow, score: workflowScore(workflow, draft) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.workflow || workflows.find((w) => w.active) || workflows[0] || null;
}

export function activeDelegationFor({ delegations = [], userId, action, docType, workflowId, site, projectId, at = new Date() }) {
  const day = isoDate(at);
  return delegations.find((d) => {
    if (!d.active || d.delegantId !== userId) return false;
    if (day < d.startDate || day > d.endDate) return false;
    if (d.actions?.length && !d.actions.includes(action)) return false;
    if (d.docTypes?.length && !d.docTypes.includes(docType)) return false;
    if (d.workflowIds?.length && !d.workflowIds.includes(workflowId)) return false;
    if (d.site && site && d.site !== site) return false;
    if (d.projectId && projectId && d.projectId !== projectId) return false;
    return true;
  });
}

export function hydrateWorkflowSteps(workflow, users = [], delegations = [], draft = {}) {
  if (!workflow) return [];
  const firstOrder = Math.min(...(workflow.steps || []).map((s) => Number(s.order || 1)));
  return (workflow.steps || []).map((step) => {
    const delegation = activeDelegationFor({
      delegations,
      userId: step.signers?.[0],
      action: step.action,
      docType: draft.type,
      workflowId: workflow.id,
      site: draft.site,
      projectId: draft.projectId,
    });
    const signers = delegation ? [delegation.delegataireId] : step.signers || [];
    return {
      ...step,
      status: Number(step.order || 1) === firstOrder ? "active" : "pending",
      signers,
      originalSigners: step.signers || [],
      delegatedFrom: delegation ? delegation.delegantId : "",
      delegatedFromName: delegation ? delegation.delegantName : "",
      dueAt: Number(step.order || 1) === firstOrder ? addDaysIso(step.durationDays || 1) : "",
    };
  });
}

export function createAudit(user, action, detail) {
  return { date: new Date().toISOString(), user: user || "Systeme", action, detail };
}

export function createSoftSignDocument({ draft, workflow, users, delegations, authUser, origin = "interne" }) {
  const id = `SS-${Date.now()}`;
  const y = new Date().getFullYear();
  const ref = draft.ref?.trim() || `SS-DOC-${y}-${String(Date.now()).slice(-4)}`;
  const steps = hydrateWorkflowSteps(workflow, users, delegations, draft);
  return {
    id,
    ref,
    title: draft.title || draft.fileName || "Document SoftSign",
    type: draft.type || "contrat",
    origin,
    status: origin === "externe" && !workflow ? "en_attente_traitement" : "en_cours",
    amount: Number(draft.amount || draft.amountTtc || 0),
    amountTtc: Number(draft.amountTtc || draft.amount || 0),
    currency: draft.currency || "MGA",
    projectId: draft.projectId || "",
    projectName: draft.projectName || "",
    site: draft.site || "",
    createdAt: new Date().toISOString(),
    date: draft.date || isoDate(),
    deposantId: draft.deposantId || authUser?.id || "",
    deposantName: draft.deposantName || authUser?.nom || "Utilisateur",
    author: authUser?.nom || draft.deposantName || "Utilisateur",
    sender: draft.sender || "",
    workflowId: workflow?.id || "",
    workflowName: workflow?.name || "",
    priority: draft.priority || "normale",
    pages: draft.pages || 1,
    fileName: draft.fileName || "",
    fileB64: draft.fileB64 || null,
    ocrData: draft.ocrData || null,
    zones: draft.zones || [],
    annexes: draft.annexes || [],
    steps,
    signedBy: [],
    audit: [createAudit(authUser?.nom || draft.deposantName, origin === "externe" ? "depot_externe" : "depot_interne", "Depot et lancement du workflow")],
  };
}

export function activeSteps(doc) {
  return (doc.steps || []).filter((s) => s.status === "active");
}

export function activeTaskForUser(doc, userId) {
  return activeSteps(doc).find((s) => (s.signers || []).includes(userId));
}

export function isOverdue(step) {
  return !!step?.dueAt && new Date(step.dueAt).getTime() < Date.now() && step.status === "active";
}

export function daysLate(step) {
  if (!isOverdue(step)) return 0;
  return Math.max(1, Math.ceil((Date.now() - new Date(step.dueAt).getTime()) / 86400000));
}

export function nextOrderAfter(doc, order) {
  const orders = [...new Set((doc.steps || []).map((s) => Number(s.order || 0)))].sort((a, b) => a - b);
  return orders.find((o) => o > Number(order));
}

export function finishWorkflowIfNeeded(doc) {
  const allTerminal = (doc.steps || []).every((s) => s.status === "done" || s.status === "rejected");
  if (!allTerminal) return doc;
  const hasRejected = (doc.steps || []).some((s) => s.status === "rejected");
  if (hasRejected) return { ...doc, status: "rejete" };
  const cert = doc.certificate || {
    id: `CERT-${doc.id}`,
    generatedAt: new Date().toISOString(),
    qr: `${doc.ref}|${doc.id}|${new Date().toISOString()}`,
  };
  return {
    ...doc,
    status: "termine",
    certificate: cert,
    audit: [...(doc.audit || []), createAudit("Systeme", "certificat", "Certificat et journal audit generes automatiquement")],
  };
}

export function completeStep(doc, stepId, { user, comment = "", signatureMode = "", signatureValue = "", otpCode = "" } = {}) {
  const step = (doc.steps || []).find((s) => s.id === stepId);
  if (!step) return doc;
  const updatedSteps = (doc.steps || []).map((s) => {
    if (s.id !== stepId) return s;
    return {
      ...s,
      status: "done",
      doneBy: user?.id || "",
      doneByName: user?.nom || "Utilisateur",
      doneAt: new Date().toISOString(),
      comment,
      signatureMode,
      signatureValue,
      otpVerified: !!otpCode || !s.otpRequired,
    };
  });
  const sameOrder = updatedSteps.filter((s) => Number(s.order) === Number(step.order));
  const groupDone = sameOrder.every((s) => s.status === "done");
  let advancedSteps = updatedSteps;
  if (groupDone) {
    const nextOrder = nextOrderAfter({ ...doc, steps: updatedSteps }, step.order);
    if (nextOrder) {
      advancedSteps = updatedSteps.map((s) =>
        Number(s.order) === Number(nextOrder) && s.status === "pending"
          ? { ...s, status: "active", dueAt: addDaysIso(s.durationDays || 1) }
          : s
      );
    }
  }
  const nextDoc = {
    ...doc,
    status: "en_cours",
    steps: advancedSteps,
    signedBy: step.action === "signature" || step.action === "paraphe" ? [...new Set([...(doc.signedBy || []), user?.id].filter(Boolean))] : doc.signedBy || [],
    audit: [...(doc.audit || []), createAudit(user?.nom, step.action, `${getAction(step.action).label} - ${step.label}${comment ? `: ${comment}` : ""}`)],
  };
  return finishWorkflowIfNeeded(nextDoc);
}

export function rejectDocument(doc, stepId, { user, reason }) {
  const step = (doc.steps || []).find((s) => s.id === stepId);
  const steps = (doc.steps || []).map((s) => (s.id === stepId ? { ...s, status: "rejected", doneBy: user?.id, doneByName: user?.nom, doneAt: new Date().toISOString(), comment: reason } : s));
  return {
    ...doc,
    status: "rejete",
    steps,
    rejection: { reason, step: step?.label || "", user: user?.nom || "", date: new Date().toISOString() },
    audit: [...(doc.audit || []), createAudit(user?.nom, "rejet", reason)],
  };
}

export function normalizeReminderConfig(config = {}) {
  return {
    ...SS_DEFAULT_REMINDERS,
    ...(config || {}),
    delai: Math.max(0, Number(config?.delai ?? SS_DEFAULT_REMINDERS.delai)),
    frequence: Math.max(1, Number(config?.frequence ?? SS_DEFAULT_REMINDERS.frequence)),
    maxRelances: Math.max(1, Number(config?.maxRelances ?? SS_DEFAULT_REMINDERS.maxRelances)),
  };
}

export function addDocumentReminder(doc, stepId, { actor = "Systeme SoftSign", automatic = false, reminderNumber, at = new Date() } = {}) {
  const step = (doc.steps || []).find((item) => item.id === stepId);
  if (!step || step.status !== "active") return doc;
  const number = Number(reminderNumber || (step.reminders || []).length + 1);
  const reminderId = automatic
    ? `REL-AUTO-${doc.id}-${step.id}-${number}`
    : `REL-${doc.id}-${step.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  if ((doc.reminders || []).some((item) => item.id === reminderId)) return doc;

  const sentAt = new Date(at).toISOString();
  const recipients = step.signers || [];
  const reminder = {
    id: reminderId,
    number,
    stepId: step.id,
    stepLabel: step.label,
    action: step.action,
    recipients,
    automatic,
    actor,
    sentAt,
    dueAt: step.dueAt || "",
  };
  const auditEntry = {
    ...createAudit(actor, automatic ? "relance_automatique" : "relance_manuelle",
      `${automatic ? "Relance automatique" : "Relance manuelle"} n.${number} envoyee pour l'etape "${step.label}"${step.dueAt ? ` - echeance ${step.dueAt}` : ""}`),
    date: sentAt,
    reminderId,
    stepId: step.id,
  };

  return {
    ...doc,
    updatedAt: sentAt,
    reminders: [...(doc.reminders || []), reminder],
    steps: (doc.steps || []).map((item) => item.id === step.id
      ? { ...item, reminders: [...(item.reminders || []), reminder] }
      : item),
    audit: [...(doc.audit || []), auditEntry],
  };
}

export function applyAutomaticDocumentReminders(docs = [], config = {}, now = new Date()) {
  const normalized = normalizeReminderConfig(config);
  const nowMs = new Date(now).getTime();
  const dayMs = 86400000;
  const notifications = [];
  const audit = [];
  let changed = false;

  const updatedDocs = (docs || []).map((doc) => {
    let nextDoc = doc;
    (doc.steps || []).filter((step) => step.status === "active" && step.dueAt).forEach((step) => {
      const dueMs = new Date(step.dueAt).getTime();
      if (!Number.isFinite(dueMs)) return;
      const firstReminderMs = dueMs - normalized.delai * dayMs;
      if (nowMs < firstReminderMs) return;
      const expected = Math.min(
        normalized.maxRelances,
        1 + Math.floor((nowMs - firstReminderMs) / (normalized.frequence * dayMs))
      );
      const existing = (step.reminders || []).filter((item) => item.automatic).length;
      for (let number = existing + 1; number <= expected; number += 1) {
        const sentAt = new Date(firstReminderMs + (number - 1) * normalized.frequence * dayMs);
        const beforeAuditCount = (nextDoc.audit || []).length;
        nextDoc = addDocumentReminder(nextDoc, step.id, {
          actor: "Systeme SoftSign",
          automatic: true,
          reminderNumber: number,
          at: sentAt,
        });
        if ((nextDoc.audit || []).length === beforeAuditCount) continue;
        changed = true;
        const reminder = (nextDoc.reminders || []).find((item) => item.id === `REL-AUTO-${doc.id}-${step.id}-${number}`);
        const auditEntry = nextDoc.audit[nextDoc.audit.length - 1];
        if (auditEntry) audit.push(auditEntry);
        if (reminder && normalized.notifInterne) {
          notifications.push({
            id: `N-${reminder.id}`,
            type: "relance",
            docId: doc.id,
            lu: false,
            date: reminder.sentAt,
            message: `${doc.ref} - relance automatique n.${number} pour ${step.label}`,
            ...(normalized.lienDirect ? { targetView: "ss-docs-received" } : {}),
          });
        }
      }
    });
    return nextDoc;
  });

  return { changed, docs: updatedDocs, notifications, audit };
}
