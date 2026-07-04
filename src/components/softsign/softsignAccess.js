const ROLE_PERMS_KEY = "ss_rolePerms";

const ADMIN_VIEWS = new Set([
  "ss-param-general",
  "ss-admin-users",
  "ss-admin-user-new",
  "ss-roles",
  "ss-license",
  "ss-journaux",
  "ss-param-otp",
  "ss-wf-modeles",
  "ss-param-wf",
  "ss-notif",
  "ss-relances",
  "ss-email-tpl",
  "ss-personnalisation",
  "ss-external-accounts",
  "ss-portail",
  "ss-integr-softdocs",
]);

const VIEW_RULES = {
  "ss-depot": ["depot", "creation"],
  "ss-upload": ["depot", "creation"],
  "ss-docs-my": ["mesDocuments", "consultation"],
  "ss-docs-received": ["signature", "consultation"],
  "ss-docs-progress": ["mesDocuments", "consultation"],
  "ss-rejetes": ["mesDocuments", "consultation"],
  "ss-archives": ["mesDocuments", "consultation"],
  "ss-certificats": ["mesDocuments", "consultation"],
  "ss-search": ["mesDocuments", "consultation"],
  "ss-mailbox": ["signature", "consultation"],
  "ss-param-sign": ["signature", "consultation"],
  "ss-delegations": ["delegations", "consultation"],
  "ss-rapports": ["rapports", "consultation"],
  "ss-rapports-validateurs": ["rapports", "consultation"],
  "ss-rapports-expediteurs": ["rapports", "consultation"],
  "ss-tous-docs": ["tousDocuments", "consultation"],
};

const DEFAULT_ACCESS = {
  standard: {
    depot: { creation: true },
    mesDocuments: { consultation: true },
    signature: { consultation: true },
    delegations: { consultation: true },
    rapports: { consultation: true },
    tousDocuments: { consultation: false },
  },
  readonly: {
    depot: { creation: false },
    mesDocuments: { consultation: true },
    signature: { consultation: true },
    delegations: { consultation: true },
    rapports: { consultation: true },
    tousDocuments: { consultation: false },
  },
};

function readRolePermissions() {
  try {
    const value = localStorage.getItem(ROLE_PERMS_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

export function canAccessSoftSignView(user, view) {
  const role = user?.systemRole || user?.role || "standard";
  if (role === "admin" || role === "superadmin") return true;
  if (ADMIN_VIEWS.has(view)) return false;
  const rule = VIEW_RULES[view];
  if (!rule) return true;
  const [menu, action] = rule;
  const configured = readRolePermissions()?.[role]?.[menu]?.[action];
  if (typeof configured === "boolean") return configured;
  return DEFAULT_ACCESS[role]?.[menu]?.[action] !== false;
}
