"use client";
import { useState, useRef } from "react";
import { Modal } from "../ui/Modal";
import { IC } from "../ui/Icons";
import { Avatar } from "../ui/Badge";
import { ExportButtons } from "../ui/ExportButtons";
import { card, btn, inp, lbl, bdg, BD, P, MUT, SUCL, SUCD, RSm, TR } from "../../lib/theme";
import { useApp } from "../../context/AppContext";
import { PROJETS, ALL_SITES } from "../../lib/data";
import { gid } from "../../lib/utils";

/* Checklist modal for one étape */
function ChecklistModal({ checklists, onSave, onClose }) {
  const [list, setList] = useState(checklists.map(c => ({ ...c })));
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");

  function add() {
    if (!newLabel.trim()) return;
    const code = newCode.trim() || String(list.length + 1).padStart(2, "0");
    setList(p => [...p, { code, label: newLabel.trim() }]);
    setNewCode(""); setNewLabel("");
  }

  return (
    <Modal title="Checklists de l'étape" onClose={onClose} w={520}
      footer={<>
        <button onClick={onClose} style={btn("light", true)}>Fermer</button>
        <button onClick={() => onSave(list)} style={btn("primary")}>
          <span style={{ display: "flex" }}>{IC.chk}</span> Enregistrer
        </button>
      </>}>
      <div style={{ marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", borderBottom: `2px solid ${BD}` }}>Code</th>
              <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", borderBottom: `2px solid ${BD}` }}>Libellé</th>
              <th style={{ width: 60, borderBottom: `2px solid ${BD}` }} />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={3} style={{ padding: 20, textAlign: "center", color: MUT, fontSize: 13 }}>Aucun checklist</td></tr>
            )}
            {list.map((c, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 12px", borderBottom: `1px solid ${BD}` }}>
                  <input value={c.code} onChange={e => setList(p => p.map((x, ii) => ii === i ? { ...x, code: e.target.value } : x))}
                    style={{ ...inp({ padding: "5px 8px", fontSize: 12, width: 60 }) }} />
                </td>
                <td style={{ padding: "8px 12px", borderBottom: `1px solid ${BD}` }}>
                  <input value={c.label} onChange={e => setList(p => p.map((x, ii) => ii === i ? { ...x, label: e.target.value } : x))}
                    style={{ ...inp({ padding: "5px 8px", fontSize: 12 }) }} />
                </td>
                <td style={{ padding: "8px 12px", borderBottom: `1px solid ${BD}` }}>
                  <button onClick={() => setList(p => p.filter((_, ii) => ii !== i))} style={{ ...btn("danger", true), padding: "3px 8px" }}>
                    <span style={{ display: "flex" }}>{IC.trash}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new */}
      <div style={{ display: "flex", gap: 8, padding: "10px 0", borderTop: `1px solid ${BD}` }}>
        <input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Code"
          style={{ ...inp({ width: 70, padding: "7px 10px", fontSize: 12 }) }} />
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Libellé du checklist" onKeyDown={e => e.key === "Enter" && add()}
          style={{ ...inp({ flex: 1, padding: "7px 10px", fontSize: 12 }) }} />
        <button onClick={add} style={btn("primary", true)}>
          <span style={{ display: "flex" }}>{IC.plus}</span> Ajouter
        </button>
      </div>
    </Modal>
  );
}

export default function ParamTypes() {
  const { types, setTypes, users } = useApp();
  const [modal, setModal] = useState(null);
  const [edit, setEdit] = useState(null);
  const [checklistEtape, setChecklistEtape] = useState(null);
  const tableRef = useRef(null);

  function openEdit(t) { setEdit(JSON.parse(JSON.stringify(t))); setModal("edit"); }
  function openNew() {
    setEdit({ id: "", nom: "", conf: false, projets: [], sites: [], etapes: [] });
    setModal("edit");
  }
  function save() {
    setTypes(p => edit.id && p.some(x => x.id === edit.id)
      ? p.map(t => t.id === edit.id ? edit : t)
      : [...p, { ...edit, id: gid("DT") }]);
    setModal(null);
  }
  function addEtape() {
    setEdit(p => ({ ...p, etapes: [...(p.etapes || []), { label: "Nouvelle étape", duree: 24, v: [], checklists: [] }] }));
  }
  function removeEtape(i) { setEdit(p => ({ ...p, etapes: p.etapes.filter((_, ii) => ii !== i) })); }
  function toggleV(ei, uid) {
    setEdit(p => ({ ...p, etapes: p.etapes.map((e, i) => i === ei ? { ...e, v: e.v?.includes(uid) ? e.v.filter(x => x !== uid) : [...(e.v || []), uid] } : e) }));
  }
  function toggleProjet(pid) {
    setEdit(p => ({ ...p, projets: p.projets?.includes(pid) ? p.projets.filter(x => x !== pid) : [...(p.projets || []), pid] }));
  }
  function toggleSite(s) {
    setEdit(p => ({ ...p, sites: p.sites?.includes(s) ? p.sites.filter(x => x !== s) : [...(p.sites || []), s] }));
  }
  function saveChecklist(etapeIdx, list) {
    setEdit(p => ({ ...p, etapes: p.etapes.map((e, i) => i === etapeIdx ? { ...e, checklists: list } : e) }));
    setChecklistEtape(null);
  }

  return (
    <div style={{ animation: "fadeIn .2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#212529" }}>Types de documents</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <ExportButtons filename="types_documents" title="Types de documents"
            headers={["ID","Nom","Confidentiel","Projets","Sites","Nb étapes"]}
            rows={types.map(t=>[t.id,t.nom,t.conf?"Oui":"Non",(t.projets||[]).join(", "),(t.sites||[]).join(", "),t.etapes?.length||0])} />
          <button onClick={openNew} style={btn("primary", true)}>
            <span style={{ display: "flex" }}>{IC.plus}</span> Nouveau type
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
        {types.map(t => (
          <div key={t.id} style={{ ...card(), padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 6, background: "#eef1f8", display: "flex", alignItems: "center", justifyContent: "center", color: P, flexShrink: 0 }}>
                <span style={{ display: "flex" }}>{IC.fileText}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#212529" }}>{t.nom}</div>
                <div style={{ fontSize: 11, color: MUT }}>{t.id} · {t.etapes?.length || 0} étapes</div>
              </div>
              {t.conf && (
                <span style={{ ...bdg("#e9d8f5", "#5e1d8a", { fontSize: 10 }), display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <span style={{ display: "flex" }}>{IC.lock}</span> Conf.
                </span>
              )}
              <button onClick={() => openEdit(t)} style={btn("light", true)}>
                <span style={{ display: "flex" }}>{IC.edit}</span>
              </button>
            </div>

            {/* Étapes summary */}
            {t.etapes?.map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderTop: i === 0 ? "none" : `1px solid ${BD}` }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#eef1f8", color: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, flex: 1, color: "#495057" }}>{e.label}</span>
                <span style={{ fontSize: 11, color: MUT, whiteSpace: "nowrap" }}>{e.duree}h</span>
                {e.checklists?.length > 0 && (
                  <span style={{ ...bdg("#e8f5ff", "#1560bd", { fontSize: 10 }) }}>{e.checklists.length} check</span>
                )}
              </div>
            ))}

            {/* Projets */}
            {t.projets?.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${BD}`, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {t.projets.map(pid => (
                  <span key={pid} style={{ ...bdg("#eef1f8", P, { fontSize: 10 }) }}>{pid}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modal === "edit" && edit && (
        <Modal title={edit.id ? "Modifier le type" : "Nouveau type"} onClose={() => setModal(null)} w={720}
          footer={<>
            <button onClick={() => setModal(null)} style={btn("light", true)}>Annuler</button>
            <button onClick={save} style={btn("primary")}>
              <span style={{ display: "flex" }}>{IC.chk}</span> Enregistrer
            </button>
          </>}>
          {/* Basic info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div>
              <label style={lbl}>Nom</label>
              <input value={edit.nom || ""} onChange={e => setEdit(p => ({ ...p, nom: e.target.value }))} style={inp()} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={!!edit.conf} onChange={e => setEdit(p => ({ ...p, conf: e.target.checked }))} />
                Document confidentiel
              </label>
            </div>
          </div>

          {/* Projets & Sites */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ ...lbl, marginBottom: 8 }}>Projets autorisés</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PROJETS.map(p => (
                  <label key={p.id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12.5, cursor: "pointer" }}>
                    <input type="checkbox" checked={edit.projets?.includes(p.id) || false} onChange={() => toggleProjet(p.id)} />
                    <div>
                      <div style={{ fontWeight: 600, color: "#212529" }}>{p.nom.slice(0, 30)}</div>
                      <div style={{ fontSize: 11, color: MUT }}>{p.bailleur}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ ...lbl, marginBottom: 8 }}>Sites autorisés</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ALL_SITES.map(s => (
                  <label key={s} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12.5, cursor: "pointer" }}>
                    <input type="checkbox" checked={edit.sites?.includes(s) || false} onChange={() => toggleSite(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Étapes */}
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#495057", textTransform: "uppercase", letterSpacing: ".06em" }}>Étapes de validation</span>
            <button onClick={addEtape} style={btn("light", true)}>
              <span style={{ display: "flex" }}>{IC.plus}</span> Ajouter
            </button>
          </div>

          {edit.etapes?.map((e, i) => (
            <div key={i} style={{ border: `1px solid ${BD}`, borderRadius: RSm, padding: 14, marginBottom: 8 }}>
              {/* Étape header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px auto auto", gap: 8, marginBottom: 10, alignItems: "center" }}>
                <input value={e.label}
                  onChange={ev => setEdit(p => ({ ...p, etapes: p.etapes.map((x, ii) => ii === i ? { ...x, label: ev.target.value } : x) }))}
                  style={{ ...inp({ padding: "7px 10px", fontSize: 13 }) }} placeholder="Nom de l'étape" />
                <div style={{ position: "relative" }}>
                  <input type="number" value={e.duree || ""}
                    onChange={ev => setEdit(p => ({ ...p, etapes: p.etapes.map((x, ii) => ii === i ? { ...x, duree: Number(ev.target.value) } : x) }))}
                    style={{ ...inp({ padding: "7px 10px", fontSize: 13, paddingRight: 30 }) }} placeholder="24" min="1" />
                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: MUT, pointerEvents: "none" }}>h</span>
                </div>
                <button onClick={() => setChecklistEtape(i)} style={{ ...btn("light", true), whiteSpace: "nowrap" }}>
                  <span style={{ display: "flex" }}>{IC.chk}</span>
                  Checklists {e.checklists?.length > 0 && `(${e.checklists.length})`}
                </button>
                <button onClick={() => removeEtape(i)} style={btn("danger", true)}>
                  <span style={{ display: "flex" }}>{IC.trash}</span>
                </button>
              </div>

              {/* Validateurs */}
              <div style={{ fontSize: 11.5, fontWeight: 600, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Validateurs</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {users.map(u => (
                  <label key={u.id} style={{
                    display: "flex", gap: 5, alignItems: "center", fontSize: 12, cursor: "pointer",
                    padding: "4px 10px", border: `1px solid ${BD}`, borderRadius: 20,
                    background: e.v?.includes(u.id) ? "#eef1f8" : "#fff",
                    transition: TR,
                  }}>
                    <input type="checkbox" checked={e.v?.includes(u.id) || false} onChange={() => toggleV(i, u.id)} style={{ display: "none" }} />
                    <Avatar uid={u.id} users={users} size={18} />
                    {u.nom.split(" ")[0]}
                  </label>
                ))}
              </div>

              {/* Checklists preview */}
              {e.checklists?.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${BD}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {e.checklists.map((c, ci) => (
                    <span key={ci} style={{ ...bdg("#f0f7ff", "#1560bd", { fontSize: 10 }) }}>
                      {c.code}. {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Modal>
      )}

      {/* Checklist sub-modal */}
      {checklistEtape !== null && edit && (
        <ChecklistModal
          checklists={edit.etapes[checklistEtape]?.checklists || []}
          onSave={(list) => saveChecklist(checklistEtape, list)}
          onClose={() => setChecklistEtape(null)}
        />
      )}
    </div>
  );
}
