"use client";
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { IC } from "../ui/Icons";
import { card, btn, inp, lbl, bdg, BD, P, MUT, SUCL, SUCD, RSm, TR, TH, TD } from "../../lib/theme";
import { useApp } from "../../context/AppContext";
import { useT } from "../../lib/i18n";
import { gid } from "../../lib/utils";

function getTypes(t) {
  return [
    { k: "texte",   l: t.typeTexte },
    { k: "date",    l: t.typeDate },
    { k: "case",    l: t.typeCase },
    { k: "liste",   l: t.typeListe },
    { k: "radio",   l: t.typeRadio },
    { k: "fichier", l: t.typeFichier },
  ];
}

const TYPE_IC = {
  texte:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  date:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  case:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  liste:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  radio:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>,
  fichier: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
};

function ChampForm({ init, onSave, onClose, t }) {
  const TYPES = getTypes(t || { typeTexte:"Texte libre", typeDate:"Date", typeCase:"Case à cocher", typeListe:"Liste déroulante", typeRadio:"Bouton radio", typeFichier:"Fichier (upload)" });
  const [f, setF] = useState(init || { id: "", etiquette: "", visInternes: true, visFourn: false, requis: false, type: "texte", items: [] });
  const [newItem, setNewItem] = useState("");
  const up = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <Modal title={f.id ? t.modifChamp : t.nouvcChamp} onClose={onClose} w={520}
      footer={<>
        <button onClick={onClose} style={btn("light", true)}>Annuler</button>
        <button onClick={() => onSave(f)} disabled={!f.etiquette.trim()} style={btn("primary")}>
          <span style={{ display: "flex" }}>{IC.chk}</span> Enregistrer
        </button>
      </>}>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={lbl}>Étiquette (nom du champ) *</label>
          <input value={f.etiquette} onChange={e => up("etiquette", e.target.value)} placeholder="Ex: Référence marché" style={inp()} />
        </div>

        <div style={{ background: "#f8f9fc", borderRadius: RSm, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
            <input type="checkbox" checked={f.visInternes} onChange={e => up("visInternes", e.target.checked)} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#212529" }}>Visible par les utilisateurs internes</div>
              <div style={{ fontSize: 12, color: MUT }}>Affiché uniquement lors du dépôt en back-office</div>
            </div>
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
            <input type="checkbox" checked={f.visFourn} onChange={e => up("visFourn", e.target.checked)} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#212529" }}>Visible par les fournisseurs</div>
              <div style={{ fontSize: 12, color: MUT }}>Disponible à la saisie sur le portail fournisseurs</div>
            </div>
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
            <input type="checkbox" checked={f.requis} onChange={e => up("requis", e.target.checked)} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#212529" }}>Requis</div>
              <div style={{ fontSize: 12, color: MUT }}>Ce champ sera obligatoire à la saisie</div>
            </div>
          </label>
        </div>

        <div>
          <label style={lbl}>Type de champ</label>
          <select value={f.type} onChange={e => up("type", e.target.value)} style={inp()}>
            {TYPES.map(t => <option key={t.k} value={t.k}>{t.l}</option>)}
          </select>
        </div>

        {/* Items for liste/radio */}
        {(f.type === "liste" || f.type === "radio") && (
          <div>
            <label style={lbl}>Options disponibles</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
              {(f.items || []).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input value={item} onChange={e => setF(p => ({ ...p, items: p.items.map((x, ii) => ii === i ? e.target.value : x) }))}
                    style={{ ...inp({ padding: "6px 10px", fontSize: 12, flex: 1 }) }} />
                  <button onClick={() => setF(p => ({ ...p, items: p.items.filter((_, ii) => ii !== i) }))}
                    style={{ ...btn("danger", true), padding: "4px 8px" }}>
                    <span style={{ display: "flex" }}>{IC.x}</span>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder={t.nouvelleOption} onKeyDown={e => { if (e.key === "Enter" && newItem.trim()) { setF(p => ({ ...p, items: [...(p.items || []), newItem.trim()] })); setNewItem(""); } }}
                style={{ ...inp({ flex: 1, padding: "7px 10px", fontSize: 12 }) }} />
              <button onClick={() => { if (newItem.trim()) { setF(p => ({ ...p, items: [...(p.items || []), newItem.trim()] })); setNewItem(""); } }}
                style={btn("light", true)}>
                <span style={{ display: "flex" }}>{IC.plus}</span> Ajouter
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function ChampsDynamiques() {
  const { champsDyn, setChampsDyn, lang } = useApp();
  const t = useT(lang);
  const [modal, setModal] = useState(null);
  const [editChamp, setEditChamp] = useState(null);

  function openNew() { setEditChamp({ id: "", etiquette: "", visInternes: true, visFourn: false, requis: false, type: "texte", items: [] }); setModal("form"); }
  function openEdit(c) { setEditChamp(JSON.parse(JSON.stringify(c))); setModal("form"); }
  function save(f) {
    setChampsDyn(p => f.id && p.some(x => x.id === f.id)
      ? p.map(c => c.id === f.id ? f : c)
      : [...p, { ...f, id: gid("CD") }]);
    setModal(null);
  }
  function del(id) { if (confirm("Supprimer ce champ ?")) setChampsDyn(p => p.filter(c => c.id !== id)); }

  return (
    <div style={{ animation: "fadeIn .2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#212529" }}>{t.champsDynTitle}</h2>
          <p style={{ fontSize: 12.5, color: MUT, marginTop: 3 }}>{t.champsDynDesc}</p>
        </div>
        <button onClick={openNew} style={btn("primary", true)}>
          <span style={{ display: "flex" }}>{IC.plus}</span> {t.nouvcChamp}
        </button>
      </div>

      <div style={{ ...card() }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[t.etiquette, t.typeChamp, t.visInternes, t.visFourn, t.requis, t.optionsDisp, ""].map(h => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {champsDyn.length === 0 && (
              <tr><td colSpan={7} style={{ ...TD, textAlign: "center", color: MUT, padding: 32 }}>{t.aucunDonnee}</td></tr>
            )}
            {champsDyn.map(c => (
              <tr key={c.id}
                onMouseEnter={e => e.currentTarget.style.background = "#f8f9fc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...TD, fontWeight: 600, color: "#212529" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "flex", color: P }}>{TYPE_IC[c.type]}</span>
                    {c.etiquette}
                    {c.requis && <span style={{ ...bdg("#ffeaea", "#c0392b", { fontSize: 10 }) }}>{t.requis}</span>}
                  </div>
                </td>
                <td style={TD}>
                  <span style={{ ...bdg("#eef1f8", P, { fontSize: 11 }) }}>
                    {getTypes(t).find(tp => tp.k === c.type)?.l || c.type}
                  </span>
                </td>
                <td style={TD}>
                  <span style={{ ...bdg(c.visInternes ? SUCL : "#e9ecef", c.visInternes ? "#155724" : MUT, { fontSize: 11 }) }}>
                    {c.visInternes ? t.oui : t.non}
                  </span>
                </td>
                <td style={TD}>
                  <span style={{ ...bdg(c.visFourn ? "#e8f5ff" : "#e9ecef", c.visFourn ? "#1560bd" : MUT, { fontSize: 11 }) }}>
                    {c.visFourn ? t.oui : t.non}
                  </span>
                </td>
                <td style={TD}>
                  <span style={{ ...bdg(c.requis ? "#fff0e6" : "#e9ecef", c.requis ? "#b84a00" : MUT, { fontSize: 11 }) }}>
                    {c.requis ? t.oui : "—"}
                  </span>
                </td>
                <td style={{ ...TD, fontSize: 12, color: MUT }}>
                  {(c.items?.length > 0) ? c.items.slice(0, 3).join(", ") + (c.items.length > 3 ? `… +${c.items.length - 3}` : "") : "—"}
                </td>
                <td style={TD}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(c)} style={btn("light", true)}>
                      <span style={{ display: "flex" }}>{IC.edit}</span>
                    </button>
                    <button onClick={() => del(c.id)} style={btn("danger", true)}>
                      <span style={{ display: "flex" }}>{IC.trash}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "form" && editChamp && (
        <ChampForm init={editChamp} onSave={save} onClose={() => setModal(null)} t={t} />
      )}
    </div>
  );
}
