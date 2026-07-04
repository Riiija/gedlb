"use client";
import{useState}from"react";
import{Check,CreditCard,Loader2,X}from"lucide-react";
import{useApp}from"../../context/AppContext";
import{card,btn,MUT,WH,BD}from"../../lib/theme";
import{ALL_SITES}from"../../lib/data";
import{PAYMENT_STATUS,formatPaymentAmount,paymentStatusColor}from"../../lib/epaiementPayments";

const G="#1a6b3c";

const BANKS=["BNI Madagascar","BOA Madagascar","BFV-SG","MCB","BMOI","Societe Generale","Autre"];
const FOURNISSEURS=["0001 RAMANANTSOA Hasiniaina","0005 Lovasoa RAMIALINIAINA","AM01 FSP AMBOHIPIHAONANA BE PAPAY"];

const OPERATOR_CONFIG={
  MVOLA:{label:"MVola",color:"#0f766e",bg:"#f0fdfa",softBorder:"#99f6e4",border:"#14b8a6",img:"/operators/mvola.png"},
  ORANGE:{label:"Orange Money",color:"#c2410c",bg:"#fff7ed",softBorder:"#fdba74",border:"#f97316",img:"/operators/orange-money.png"},
  AIRTEL:{label:"Airtel Money",color:"#b91c1c",bg:"#fef2f2",softBorder:"#fca5a5",border:"#ef4444",img:"/operators/airtel-money.png"},
};

const SUB_METHODS=[
  {id:"vanilla",label:"Vanilla Pay",desc:"Hosted checkout securise",img:"/operators/vanilla-pay.png",color:"#7c3aed",bg:"#f5f3ff",border:"#8b5cf6"},
  {id:"fai",label:"FAI Direct",desc:"Canal direct operateur",img:"/operators/fai-direct.svg",color:"#0284c7",bg:"#f0f9ff",border:"#0ea5e9"},
];

const SUB_METHOD_LABEL={vanilla:"Vanilla Pay",fai:"FAI Direct"};
const CLOSED_STATUSES=new Set(["CLOTURE","CLÔTURÉ","CLÃ”TURÃ‰","PAYE","PAYÉ","PAYÃ‰"]);

const formatMoney=formatPaymentAmount;

function KPI({label,value,sub,color}){
  return(
    <div style={{...card(),padding:"16px 20px",borderLeft:"4px solid "+color}}>
      <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>{label}</div>
      <div style={{fontSize:24,fontWeight:900,color}}>{value}</div>
      {sub&&<div style={{fontSize:11.5,color:MUT,marginTop:3}}>{sub}</div>}
    </div>
  );
}

function MultiSelect({label,options,value,onChange}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{flex:1,position:"relative",minWidth:180}}>
      <div style={{fontSize:11.5,fontWeight:700,color:"#495057",marginBottom:5,textTransform:"uppercase",letterSpacing:".05em"}}>{label}</div>
      <button type="button" onClick={()=>setOpen(p=>!p)}
        style={{width:"100%",border:"1px solid "+BD,borderRadius:6,padding:"9px 14px",fontSize:13,background:WH,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
        <span style={{color:value.length>0?"#212529":MUT,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value.length>0?value.join(", "):"Select..."}</span>
        <span style={{color:MUT,fontSize:10}}>v</span>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:WH,border:"1px solid "+BD,borderRadius:6,zIndex:100,boxShadow:"0 4px 16px rgba(0,0,0,.12)",marginTop:2,maxHeight:180,overflowY:"auto"}}>
          {options.map(opt=>(
            <label key={opt} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",cursor:"pointer",borderBottom:"1px solid #f0f2f5",fontSize:13}}>
              <input type="checkbox" checked={value.includes(opt)} onChange={e=>{const v=e.target.checked?[...value,opt]:value.filter(x=>x!==opt);onChange(v);}} style={{accentColor:G}}/>
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ModalFrame({children,onClose,width=560}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.48)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:6500,padding:20,backdropFilter:"blur(3px)"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:width,maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.28)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({title,subtitle,onClose}){
  return(
    <div style={{padding:"18px 22px",borderBottom:"1px solid "+BD,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14}}>
      <div>
        <h3 style={{fontSize:18,fontWeight:800,color:"#212529",margin:0}}>{title}</h3>
        {subtitle&&<p style={{fontSize:13,color:MUT,margin:"4px 0 0"}}>{subtitle}</p>}
      </div>
      <button type="button" onClick={onClose} aria-label="Fermer" style={{width:32,height:32,borderRadius:8,border:"none",background:"#f8f9fc",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:MUT,flexShrink:0}}>
        <X size={17}/>
      </button>
    </div>
  );
}

function ModalFooter({children}){
  return(
    <div style={{padding:"14px 22px",borderTop:"1px solid "+BD,display:"flex",justifyContent:"flex-end",gap:10,background:"#fff",flexWrap:"wrap"}}>
      {children}
    </div>
  );
}

function OperatorModal({open,onClose,onConfirm}){
  const[selectedOperator,setSelectedOperator]=useState(null);
  const[selectedSubMethod,setSelectedSubMethod]=useState(null);
  if(!open)return null;

  const resetAndClose=()=>{
    setSelectedOperator(null);
    setSelectedSubMethod(null);
    onClose();
  };
  const confirm=()=>{
    if(!selectedOperator||!selectedSubMethod)return;
    onConfirm({operator:selectedOperator,subMethod:selectedSubMethod});
    setSelectedOperator(null);
    setSelectedSubMethod(null);
  };
  const cardColumns=typeof window!=="undefined"&&window.innerWidth<=700?"1fr":"repeat(3,1fr)";
  const subColumns=typeof window!=="undefined"&&window.innerWidth<=700?"1fr":"repeat(2,1fr)";

  return(
    <ModalFrame width={620} onClose={resetAndClose}>
      <ModalHeader title="Choisir un operateur" subtitle="Selectionnez l'operateur mobile money et le canal de paiement." onClose={resetAndClose}/>
      <div style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:18,overflowY:"auto"}}>
        <div>
          <p style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".12em",color:"#9ca3af",margin:"0 0 12px"}}>Operateur</p>
          <div style={{display:"grid",gridTemplateColumns:cardColumns,gap:12}}>
            {Object.entries(OPERATOR_CONFIG).map(([key,op])=>{
              const active=selectedOperator===key;
              return(
                <button type="button" key={key} onClick={()=>{setSelectedOperator(key);setSelectedSubMethod(null);}}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"18px 14px",borderRadius:12,border:"2px solid "+(active?op.border:"#e5e7eb"),background:active?op.bg:"#fff",cursor:"pointer",transition:"all .15s",boxShadow:active?"0 8px 18px rgba(15,23,42,.08)":"none",fontFamily:"inherit"}}>
                  <img src={op.img} alt={op.label} style={{width:56,height:56,borderRadius:14,objectFit:"cover",boxShadow:"0 3px 10px rgba(15,23,42,.12)"}}/>
                  <span style={{fontSize:13,fontWeight:800,color:"#212529"}}>{op.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedOperator&&(
          <>
            <div style={{border:"1px solid #f1f5f9",borderRadius:14,background:"linear-gradient(135deg,#f8fafc,#f9fafb)",padding:14,boxShadow:"inset 0 1px 8px rgba(15,23,42,.04)"}}>
              <p style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".12em",color:"#9ca3af",margin:"0 0 12px"}}>Mode de paiement</p>
              <div style={{display:"grid",gridTemplateColumns:subColumns,gap:10}}>
                {SUB_METHODS.map(method=>{
                  const active=selectedSubMethod===method.id;
                  return(
                    <button type="button" key={method.id} onClick={()=>setSelectedSubMethod(method.id)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:14,borderRadius:12,border:"2px solid "+(active?method.border:"#e5e7eb"),background:active?method.bg:"#fff",cursor:"pointer",transition:"all .15s",textAlign:"left",fontFamily:"inherit",width:"100%"}}>
                      <img src={method.img} alt={method.label} style={{width:48,height:48,borderRadius:12,objectFit:"cover",boxShadow:"0 3px 10px rgba(15,23,42,.10)",flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:13,fontWeight:800,color:"#212529",margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{method.label}</p>
                        <p style={{fontSize:11.5,color:"#9ca3af",margin:"3px 0 0"}}>{method.desc}</p>
                      </div>
                      {active&&(
                        <span style={{width:22,height:22,borderRadius:"50%",background:method.border,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
                          <Check size={14} strokeWidth={3}/>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{position:"relative",height:18}}>
              <div style={{position:"absolute",left:0,right:0,top:"50%",height:1,background:"#e5e7eb"}}/>
              <div style={{position:"relative",display:"flex",justifyContent:"center"}}>
                <span style={{background:"#fff",padding:"0 10px",fontSize:10.5,fontWeight:800,textTransform:"uppercase",letterSpacing:".12em",color:"#9ca3af"}}>via</span>
              </div>
            </div>
          </>
        )}
      </div>
      <ModalFooter>
        <button type="button" onClick={resetAndClose} style={{padding:"8px 18px",border:"1px solid "+BD,borderRadius:6,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Annuler</button>
        <button type="button" disabled={!selectedOperator||!selectedSubMethod} onClick={confirm}
          style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 20px",borderRadius:6,border:"none",background:selectedOperator&&selectedSubMethod?G:"#adb5bd",color:"#fff",cursor:selectedOperator&&selectedSubMethod?"pointer":"not-allowed",fontSize:13,fontWeight:800,fontFamily:"inherit"}}>
          Continuer
        </button>
      </ModalFooter>
    </ModalFrame>
  );
}

function PaymentConfirmationModal({open,payment,operatorSelection,onClose,onConfirm,isLoading}){
  if(!open||!payment||!operatorSelection)return null;
  const op=OPERATOR_CONFIG[operatorSelection.operator];
  const subLabel=SUB_METHOD_LABEL[operatorSelection.subMethod]||operatorSelection.subMethod;
  const infoRow=(label,value,badge=false)=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,padding:"12px 16px",borderTop:"1px solid #f1f5f9"}}>
      <span style={{fontSize:13,color:MUT}}>{label}</span>
      <span style={{fontSize:badge?11.5:13,fontWeight:700,color:"#212529",textAlign:"right",background:badge?"#f1f5f9":"transparent",borderRadius:20,padding:badge?"3px 10px":0}}>{value}</span>
    </div>
  );

  return(
    <ModalFrame width={580} onClose={isLoading?()=>{}:onClose}>
      <ModalHeader title="Confirmation du paiement" subtitle="Verifiez les informations avant de lancer le paiement mock." onClose={isLoading?()=>{}:onClose}/>
      <div style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
        {op&&(
          <div style={{display:"flex",alignItems:"center",gap:14,padding:14,borderRadius:12,border:"1px solid "+op.softBorder,background:op.bg}}>
            <img src={op.img} alt="" style={{width:50,height:50,borderRadius:12,objectFit:"cover",boxShadow:"0 3px 10px rgba(15,23,42,.12)",flexShrink:0}}/>
            <div>
              <p style={{fontSize:14,fontWeight:900,color:op.color,margin:0}}>{op.label}</p>
              <p style={{fontSize:12,color:MUT,margin:"3px 0 0"}}>{subLabel}</p>
            </div>
          </div>
        )}
        <div style={{border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden",background:"#fff"}}>
          <div style={{padding:"12px 16px",background:"#f8f9fc"}}>
            <span style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".12em",color:"#9ca3af"}}>Informations paiement</span>
          </div>
          {infoRow("Reference",payment.numLiq||payment.id)}
          {infoRow("Beneficiaire",payment.fourn||"-")}
          {infoRow("Statut",payment.statut||"-",true)}
          {infoRow("Telephone",payment.beneficiaryPhone||payment.phone||"-",true)}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,padding:"14px 16px",background:"#eef2ff",borderTop:"1px solid #c7d2fe"}}>
            <span style={{fontSize:13,fontWeight:800,color:"#4338ca"}}>Montant</span>
            <span style={{fontSize:20,fontWeight:900,color:"#3730a3",textAlign:"right"}}>{formatMoney(payment.mtLocale)}</span>
          </div>
        </div>
      </div>
      <ModalFooter>
        <button type="button" disabled={isLoading} onClick={onClose} style={{padding:"8px 18px",border:"1px solid "+BD,borderRadius:6,background:"#fff",cursor:isLoading?"not-allowed":"pointer",fontSize:13,fontFamily:"inherit",opacity:isLoading?.7:1}}>Annuler</button>
        <button type="button" disabled={isLoading} onClick={()=>onConfirm({payment,operatorSelection,langSelection:"fr"})}
          style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:6,border:"none",background:G,color:"#fff",cursor:isLoading?"wait":"pointer",fontSize:13,fontWeight:800,fontFamily:"inherit",opacity:isLoading?.8:1}}>
          {isLoading&&<Loader2 size={15} style={{animation:"spin .8s linear infinite"}}/>}
          Confirmer le paiement
        </button>
      </ModalFooter>
    </ModalFrame>
  );
}

export default function ListePaiements(){
  const{liq,setLiq,epPaiements:paiements,setEpPaiements:setPaiements}=useApp();
  const[modalRecup,setModalRecup]=useState(false);
  const[recupSel,setRecupSel]=useState([]);
  const[sites,setSites]=useState([]);
  const[banks,setBanks]=useState([]);
  const[fourns,setFourns]=useState([]);
  const[selectedPaymentIds,setSelectedPaymentIds]=useState([]);
  const[showOperatorModal,setShowOperatorModal]=useState(false);
  const[showPayConfirmModal,setShowPayConfirmModal]=useState(false);
  const[currentOperatorSelection,setCurrentOperatorSelection]=useState(null);
  const[selectedPaymentForConfirm,setSelectedPaymentForConfirm]=useState(null);
  const[isInitiating,setIsInitiating]=useState(false);
  const[notice,setNotice]=useState(null);

  const totalNonGen=paiements.filter(p=>p.statut===PAYMENT_STATUS.PENDING).length;
  const totalAnnul=paiements.filter(p=>p.statut===PAYMENT_STATUS.CANCELLED).length;
  const totalGen=paiements.filter(p=>[PAYMENT_STATUS.GENERATED,PAYMENT_STATUS.INITIATED,PAYMENT_STATUS.PAID].includes(p.statut)).length;

  const filtered=paiements.filter(p=>{
    if(sites.length>0&&!sites.some(s=>p.site===s))return false;
    if(banks.length>0&&!banks.some(b=>p.journal?.includes(b)))return false;
    if(fourns.length>0&&!fourns.some(f=>p.fourn?.includes(f)))return false;
    return true;
  });

  const selectedPayment=selectedPaymentIds.length===1?paiements.find(p=>p.id===selectedPaymentIds[0]):null;
  const canPay=!!selectedPayment&&selectedPayment.statut!==PAYMENT_STATUS.CANCELLED&&selectedPayment.statut!==PAYMENT_STATUS.PAID;

  const togglePayment=id=>setSelectedPaymentIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const closePayConfirmModal=()=>{
    setShowPayConfirmModal(false);
    setCurrentOperatorSelection(null);
    setSelectedPaymentForConfirm(null);
  };
  const onOperatorConfirm=selection=>{
    const payment=paiements.find(p=>p.id===selectedPaymentIds[0])||null;
    setShowOperatorModal(false);
    setCurrentOperatorSelection(selection);
    setSelectedPaymentForConfirm(payment);
    setShowPayConfirmModal(true);
  };
  const onPayConfirm=confirmation=>{
    if(confirmation.operatorSelection.subMethod!=="vanilla"){
      closePayConfirmModal();
      setNotice({type:"error",title:"Canal non supporte",message:"FAI Direct est affiche dans la maquette mais seul Vanilla Pay lance le paiement mock, comme dans le flux Angular."});
      return;
    }
    setIsInitiating(true);
    setTimeout(()=>{
      const opLabel=OPERATOR_CONFIG[confirmation.operatorSelection.operator]?.label||confirmation.operatorSelection.operator;
      setPaiements(prev=>prev.map(p=>p.id===confirmation.payment.id?{
        ...p,
        statut:PAYMENT_STATUS.INITIATED,
        dateGen:new Date().toLocaleString("fr-FR"),
        nomFichier:"vanilla-pay-checkout.mock",
        utilisateur:opLabel,
        journal:"VANILLA PAY - "+opLabel,
        beneficiaryOperator:confirmation.operatorSelection.operator,
      }:p));
      setSelectedPaymentIds([]);
      setIsInitiating(false);
      closePayConfirmModal();
      setNotice({type:"success",title:"Paiement Vanilla Pay initie",message:`Checkout mock cree pour ${confirmation.payment.numLiq||confirmation.payment.id} via ${opLabel}.`});
    },750);
  };

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529",marginBottom:2}}>Liste des paiements</h2>
          <p style={{fontSize:13,color:MUT}}>Suivi des ordres de paiement bancaires</p>
        </div>
        <button type="button" onClick={()=>{setRecupSel([]);setModalRecup(true);}}
          style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:8,border:"2px solid #7c3aed",background:"#f5f0ff",color:"#7c3aed",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Recuperer liquidation
        </button>
      </div>

      {notice&&(
        <div style={{...card(),padding:"12px 14px",marginBottom:16,borderLeft:"4px solid "+(notice.type==="success"?"#28a745":"#dc3545"),display:"flex",alignItems:"flex-start",gap:12,background:notice.type==="success"?"#f0fff4":"#fff5f5"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:notice.type==="success"?"#d4edda":"#f8d7da",color:notice.type==="success"?"#155724":"#721c24",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {notice.type==="success"?<Check size={16}/>:<X size={16}/>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:800,color:"#212529"}}>{notice.title}</div>
            <div style={{fontSize:12.5,color:"#495057",marginTop:2}}>{notice.message}</div>
          </div>
          <button type="button" onClick={()=>setNotice(null)} style={{border:"none",background:"transparent",cursor:"pointer",color:MUT,padding:4}}>
            <X size={16}/>
          </button>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <KPI label="Total paiements" value={paiements.length} color={G}/>
        <KPI label="Non generes" value={totalNonGen} color="#6c757d" sub="En attente"/>
        <KPI label="Annules" value={totalAnnul} color="#dc3545"/>
        <KPI label="Generes" value={totalGen} color="#28a745" sub="Transmis"/>
      </div>

      <div style={{...card(),padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:G,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>FILTRES</div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <MultiSelect label="Sites" options={ALL_SITES} value={sites} onChange={setSites}/>
          <MultiSelect label="Banques" options={BANKS} value={banks} onChange={setBanks}/>
          <MultiSelect label="Fournisseurs" options={FOURNISSEURS} value={fourns} onChange={setFourns}/>
        </div>
        {(sites.length>0||banks.length>0||fourns.length>0)&&(
          <button type="button" onClick={()=>{setSites([]);setBanks([]);setFourns([]);}} style={{...btn("light",true),marginTop:10,fontSize:12}}>Effacer filtres</button>
        )}
      </div>

      <div style={{...card(),overflow:"hidden"}}>
        <div style={{background:G,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em"}}>RESULTATS</span>
          <span style={{color:"rgba(255,255,255,.7)",fontSize:12}}>{filtered.length} paiement(s)</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:1520}}>
            <thead>
              <tr style={{background:"#f8f9fc"}}>
                {["","#","Site","Date Liquidation","No Liquidation","Rang","Fournisseur","Libelle","Montant Locale","Montant Devise","Montant Rapport","Statut","Journal","Banque donneur d'ordre","Banque Beneficiaire","Monnaie","Date de generation","Nom du fichier","Utilisateur","Lien Documentaire","Notifications"].map(h=>(
                  <th key={h||"selection"} style={{padding:"8px 10px",textAlign:"left",fontSize:9.5,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".04em",borderBottom:"1px solid "+BD,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>{
                const checked=selectedPaymentIds.includes(p.id);
                return(
                  <tr key={p.id} style={{borderBottom:"1px solid #f0f2f5",background:checked?"#f0fff4":"transparent"}}
                    onMouseEnter={e=>e.currentTarget.style.background=checked?"#f0fff4":"#f8fff9"}
                    onMouseLeave={e=>e.currentTarget.style.background=checked?"#f0fff4":"transparent"}>
                    <td style={{padding:"9px 10px"}}>
                      <input type="checkbox" checked={checked} onChange={()=>togglePayment(p.id)} style={{width:16,height:16,accentColor:G,cursor:"pointer"}} aria-label={`Selectionner ${p.numLiq||p.id}`}/>
                    </td>
                    <td style={{padding:"9px 10px",fontSize:12,color:MUT,fontWeight:700}}>{i+1}</td>
                    <td style={{padding:"9px 10px",fontSize:12,color:"#495057",fontWeight:600}}>{p.site}</td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#495057",whiteSpace:"nowrap"}}>{p.dateLiq}</td>
                    <td style={{padding:"9px 10px",fontSize:12,fontWeight:700,color:G}}>{p.numLiq}</td>
                    <td style={{padding:"9px 10px",fontSize:12,color:"#495057",textAlign:"center"}}>{p.rang}</td>
                    <td style={{padding:"9px 10px",fontSize:11.5,color:"#212529",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.fourn}</td>
                    <td style={{padding:"9px 10px",fontSize:11.5,color:"#495057"}}>{p.libelle}</td>
                    <td style={{padding:"9px 10px",fontSize:12,fontWeight:600,color:"#212529"}}>{formatMoney(p.mtLocale)}</td>
                    <td style={{padding:"9px 10px",fontSize:12,color:"#495057"}}>{p.mtDevise}</td>
                    <td style={{padding:"9px 10px",fontSize:12,color:"#495057"}}>{p.mtRapport}</td>
                    <td style={{padding:"9px 10px"}}>
                      <span style={{fontSize:11,fontWeight:700,color:paymentStatusColor(p.statut),background:paymentStatusColor(p.statut)+"18",padding:"3px 9px",borderRadius:10}}>{p.statut}</span>
                    </td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#212529",whiteSpace:"nowrap"}}>{p.journal}</td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#495057"}}>{p.banqueDO||"-"}</td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#495057"}}>{p.banqueBenef||"-"}</td>
                    <td style={{padding:"9px 10px",fontSize:11,fontWeight:600,color:"#212529"}}>{p.monnaie}</td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#495057"}}>{p.dateGen}</td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#495057"}}>{p.nomFichier}</td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#495057"}}>{p.utilisateur}</td>
                    <td style={{padding:"9px 10px",fontSize:11,color:"#1ecad3"}}>{p.lienDoc}</td>
                    <td style={{padding:"9px 10px"}}>
                      <button type="button" style={{width:30,height:30,borderRadius:8,background:"#212529",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:MUT,fontSize:13}}>Aucun paiement trouve</div>}
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10,marginTop:14,flexWrap:"wrap"}}>
        <span style={{fontSize:12,color:MUT}}>
          {selectedPaymentIds.length===0&&"Selectionnez un paiement pour continuer"}
          {selectedPaymentIds.length>1&&"Un seul paiement peut etre paye a la fois"}
          {selectedPaymentIds.length===1&&selectedPayment?.statut===PAYMENT_STATUS.CANCELLED&&"Un paiement annule ne peut pas etre lance"}
          {selectedPaymentIds.length===1&&selectedPayment?.statut===PAYMENT_STATUS.PAID&&"Ce paiement est deja paye"}
        </span>
        <button type="button" disabled={!canPay} onClick={()=>setShowOperatorModal(true)} title={!canPay?"Selectionnez un paiement eligible":""}
          style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:8,border:"none",background:canPay?G:"#adb5bd",color:"#fff",cursor:canPay?"pointer":"not-allowed",fontSize:13,fontWeight:800,fontFamily:"inherit",boxShadow:canPay?"0 6px 16px rgba(26,107,60,.18)":"none"}}>
          <CreditCard size={16}/>
          Payer
        </button>
      </div>

      <OperatorModal open={showOperatorModal} onClose={()=>setShowOperatorModal(false)} onConfirm={onOperatorConfirm}/>
      <PaymentConfirmationModal open={showPayConfirmModal} payment={selectedPaymentForConfirm} operatorSelection={currentOperatorSelection} onClose={closePayConfirmModal} onConfirm={onPayConfirm} isLoading={isInitiating}/>

      {modalRecup&&(()=>{
        const clotures=(liq||[]).filter(l=>CLOSED_STATUSES.has(String(l.st||"").toUpperCase())&&!l.importedToPaiement);
        const allSel=clotures.length>0&&clotures.every(l=>recupSel.includes(l.id));
        function toggleAll(){
          setRecupSel(allSel?[]:clotures.map(l=>l.id));
        }
        function confirmRecup(){
          const stamp=Date.now().toString().slice(-3);
          const newPais=clotures.filter(l=>recupSel.includes(l.id)).map((l,idx)=>({
            id:"PAI-"+l.id.slice(-4)+"-"+stamp+"-"+idx,
            site:l.site||"-",
            dateLiq:l.date||"-",
            numLiq:l.numero||l.id,
            rang:1,
            fourn:l.fourn||"-",
            libelle:l.description||"-",
            mtLocale:l.mt||0,
            mtDevise:0,
            mtRapport:0,
            statut:PAYMENT_STATUS.PENDING,
            journal:"PAIEMENT DIRECT BM",
            banqueDO:"",
            banqueBenef:"",
            monnaie:l.devise||"MGA",
            dateGen:"-",
            nomFichier:"-",
            utilisateur:"-",
            lienDoc:"-",
            beneficiaryPhone:l.beneficiaryPhone||l.phone||"",
            liqId:l.id,
          }));
          setPaiements(p=>[...p,...newPais.filter(n=>!p.some(x=>x.liqId===n.liqId))]);
          setSelectedPaymentIds([]);
          setLiq(p=>p.map(l=>recupSel.includes(l.id)?{...l,importedToPaiement:true}:l));
          setModalRecup(false);
          setRecupSel([]);
        }
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:6000,padding:20}}>
            <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:640,maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.3)",overflow:"hidden"}}>
              <div style={{background:"#7c3aed",padding:"16px 22px",display:"flex",alignItems:"center",gap:10}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                <h3 style={{fontSize:15,fontWeight:800,color:"#fff",margin:0}}>Recuperer liquidations cloturees</h3>
                <span style={{marginLeft:"auto",fontSize:11,background:"rgba(255,255,255,.2)",color:"#fff",padding:"2px 10px",borderRadius:10}}>{clotures.length} liquidation{clotures.length!==1?"s":""}</span>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                <p style={{fontSize:12.5,color:"#495057",marginBottom:12}}>
                  Selectionnez les liquidations cloturees/payees a importer dans la liste des paiements.
                </p>
                {clotures.length===0&&(
                  <div style={{textAlign:"center",padding:"32px 16px",color:MUT}}>
                    <div style={{fontSize:13,fontWeight:600}}>Aucune liquidation cloturee disponible</div>
                    <div style={{fontSize:11.5,marginTop:4}}>Les liquidations apparaissent ici une fois cloturees dans l'onglet Liquidations.</div>
                  </div>
                )}
                {clotures.length>0&&(
                  <>
                    <label style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:6,cursor:"pointer",marginBottom:8,background:"#f5f0ff",border:"1px dashed #7c3aed"}} onMouseDown={e=>{e.preventDefault();toggleAll();}}>
                      <div style={{width:15,height:15,borderRadius:3,flexShrink:0,border:"2px solid #7c3aed",background:allSel?"#7c3aed":"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {allSel&&<Check size={10} color="#fff" strokeWidth={4}/>}
                      </div>
                      <span style={{fontSize:12.5,fontWeight:700,color:"#7c3aed"}}>Tout selectionner ({clotures.length})</span>
                    </label>
                    {clotures.map(l=>{
                      const sel=recupSel.includes(l.id);
                      return(
                        <label key={l.id} onMouseDown={e=>{e.preventDefault();setRecupSel(p=>sel?p.filter(x=>x!==l.id):[...p,l.id]);}}
                          style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:8,cursor:"pointer",userSelect:"none",marginBottom:6,border:"1px solid "+(sel?"#7c3aed":"#dee2e6"),background:sel?"#f5f0ff":"#fafbfc",transition:"all .15s"}}>
                          <div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:"2px solid "+(sel?"#7c3aed":"#dee2e6"),background:sel?"#7c3aed":"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {sel&&<Check size={10} color="#fff" strokeWidth={4}/>}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:700,color:sel?"#7c3aed":"#212529"}}>{l.numero||l.id}</div>
                            <div style={{fontSize:11,color:"#6c757d"}}>{l.fourn||"-"} - {l.site||"-"} - {l.date||"-"}</div>
                            {l.description&&<div style={{fontSize:11,color:"#6c757d",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.description}</div>}
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontSize:13,fontWeight:700,color:G}}>{formatMoney(l.mt||0)}</div>
                            <div style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:700,background:String(l.st).toUpperCase().includes("PAY")?"#d4edda":"#e8f0ff",color:String(l.st).toUpperCase().includes("PAY")?"#155724":"#3730a3"}}>{l.st}</div>
                          </div>
                        </label>
                      );
                    })}
                  </>
                )}
              </div>
              <div style={{padding:"14px 22px",borderTop:"1px solid #dee2e6",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:12,color:MUT}}>{recupSel.length} selectionnee{recupSel.length>1?"s":""}</span>
                <div style={{display:"flex",gap:8}}>
                  <button type="button" onClick={()=>{setModalRecup(false);setRecupSel([]);}} style={{padding:"8px 18px",border:"1px solid #dee2e6",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Annuler</button>
                  <button type="button" disabled={recupSel.length===0} onClick={confirmRecup}
                    style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 20px",borderRadius:6,border:"none",background:recupSel.length>0?"#7c3aed":"#adb5bd",color:"#fff",cursor:recupSel.length>0?"pointer":"not-allowed",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
                    Importer {recupSel.length>0?"("+recupSel.length+")":""}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
