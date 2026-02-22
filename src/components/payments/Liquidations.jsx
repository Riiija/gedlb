"use client";
import{useState}from"react";
import{Modal}from"../ui/Modal";
import{IC}from"../ui/Icons";
import{card,btn,inp,lbl,bdg,TH,TD,P,BD,MUT,SUC,SUCL,SUCD,DNG,DNGL,WRN,RSm}from"../../lib/theme";
import{fmtN,now,gid}from"../../lib/utils";
import{useApp}from"../../context/AppContext";

export default function Liquidations(){
  const{docs,liq,setLiq}=useApp();
  const[modal,setModal]=useState(null);
  const[f,setF]=useState({docRef:"",fourn:"",mt:"",type:"Paiement facture",banque:"BOA Madagascar",notes:""});

  const eligible=docs.filter(d=>["VALIDÉ","BON À PAYER"].includes(d.st)&&d.fourn);
  const up=(k,v)=>setF(p=>({...p,[k]:v}));

  function create(){
    const doc=docs.find(d=>d.id===f.docRef);
    const entry={id:gid("LIQ"),docRef:f.docRef,fourn:doc?.fourn||f.fourn,mt:parseFloat(f.mt)||0,type:f.type,st:"EN ATTENTE PAIEMENT",date:new Date().toISOString().slice(0,10),banque:f.banque,notes:f.notes};
    setLiq(p=>[...p,entry]);setModal(null);setF({docRef:"",fourn:"",mt:"",type:"Paiement facture",banque:"BOA Madagascar",notes:""});
  }

  function pay(id){setLiq(p=>p.map(l=>l.id===id?{...l,st:"PAYÉ",datePay:now()}:l));}

  const total=liq.reduce((s,l)=>s+(l.mt||0),0);
  const paid=liq.filter(l=>l.st==="PAYÉ").reduce((s,l)=>s+(l.mt||0),0);

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#212529"}}>Liquidations</h2>
        <button onClick={()=>setModal("new")} style={btn("primary",true)}>{IC.plus} Nouvelle liquidation</button>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[["Total",fmtN(total),"#324372"],["Payé",fmtN(paid),"#28a745"],["En attente",fmtN(total-paid),"#ffc107"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",border:"1px solid #e3e6ea",borderRadius:6,padding:"14px 18px",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
            <div style={{fontSize:11,fontWeight:600,color:MUT,textTransform:"uppercase",marginBottom:4}}>{l}</div>
            <div style={{fontSize:20,fontWeight:700,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{...card()}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["ID","Document réf.","Fournisseur","Montant","Type","Banque","Statut","Date",""].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {liq.length===0&&<tr><td colSpan={9} style={{...TD,textAlign:"center",color:MUT,padding:32}}>Aucune liquidation</td></tr>}
              {liq.map(l=>(
                <tr key={l.id}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...TD,fontWeight:600,color:P,fontSize:12}}>{l.id}</td>
                  <td style={{...TD,fontSize:12}}>{l.docRef}</td>
                  <td style={{...TD,fontSize:12}}>{l.fourn}</td>
                  <td style={{...TD,fontWeight:700,color:"#212529",whiteSpace:"nowrap"}}>{fmtN(l.mt)}</td>
                  <td style={{...TD,fontSize:12}}>{l.type}</td>
                  <td style={{...TD,fontSize:12}}>{l.banque}</td>
                  <td style={TD}><span style={bdg(l.st==="PAYÉ"?SUCL:l.st==="EN ATTENTE PAIEMENT"?"#fff3cd":"#e9ecef",l.st==="PAYÉ"?SUCD:l.st==="EN ATTENTE PAIEMENT"?"#856404":MUT,{fontSize:11})}>{l.st}</span></td>
                  <td style={{...TD,fontSize:12,color:MUT}}>{l.date}</td>
                  <td style={TD}>
                    {l.st!=="PAYÉ"&&<button onClick={()=>pay(l.id)} style={btn("success",true)}><span style={{display:"flex"}}>{IC.creditCard}</span> Payer</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal==="new"&&(
        <Modal title="Nouvelle liquidation" onClose={()=>setModal(null)} w={520}
          footer={<><button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button><button onClick={create} style={btn("primary")}>{IC.chk} Créer</button></>}>
          <div style={{display:"grid",gap:10}}>
            <div><label style={lbl}>Document référence</label>
              <select value={f.docRef} onChange={e=>{const d=docs.find(x=>x.id===e.target.value);up("docRef",e.target.value);if(d){up("fourn",d.fourn);up("mt",String(d.mtR||""));}}} style={inp()}>
                <option value="">— Sélectionner —</option>
                {eligible.map(d=><option key={d.id} value={d.id}>{d.id} · {d.fourn}</option>)}
              </select>
            </div>
            {[["Fournisseur","fourn","text"],["Montant (Ar)","mt","number"],["Banque","banque","text"]].map(([l,k,t])=>(
              <div key={k}><label style={lbl}>{l}</label><input type={t} value={f[k]||""} onChange={e=>up(k,e.target.value)} style={inp()}/></div>
            ))}
            <div><label style={lbl}>Type</label>
              <select value={f.type} onChange={e=>up("type",e.target.value)} style={inp()}>
                {["Paiement facture","Avance démarrage","Remboursement frais","Paiement contrat"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Notes</label><textarea value={f.notes} onChange={e=>up("notes",e.target.value)} rows={2} style={{...inp(),resize:"vertical",fontFamily:"inherit"}}/></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
