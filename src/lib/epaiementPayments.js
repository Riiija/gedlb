"use client";

export const PAYMENT_STATUS={
  CANCELLED:"Annuler",
  PENDING:"Non generer",
  GENERATED:"Generer",
  INITIATED:"Paiement initie",
  PAID:"Paye",
};

export const INIT_EP_PAIEMENTS=[
  {id:"PAI-001",site:"05",dateLiq:"16/01/2026 00:00:00",numLiq:"num 0050",rang:1,fourn:"0001 RAMANANTSOA Hasiniaina Norolalao",libelle:"string",mtLocale:0,mtDevise:0,mtRapport:0,statut:PAYMENT_STATUS.CANCELLED,journal:"PAIEMENT DIRECT BM",banqueDO:"",banqueBenef:"",monnaie:"EUR",dateGen:"-",nomFichier:"-",utilisateur:"-",lienDoc:"-",beneficiaryPhone:"034 00 001 01"},
  {id:"PAI-002",site:"05",dateLiq:"16/01/2026 00:00:00",numLiq:"num 0050",rang:2,fourn:"0001 RAMANANTSOA Hasiniaina Norolalao",libelle:"string",mtLocale:250000,mtDevise:0,mtRapport:0,statut:PAYMENT_STATUS.PENDING,journal:"PAIEMENT DIRECT BM",banqueDO:"",banqueBenef:"",monnaie:"EUR",dateGen:"-",nomFichier:"-",utilisateur:"-",lienDoc:"-",beneficiaryPhone:"034 00 001 02"},
  {id:"PAI-003",site:"05",dateLiq:"16/01/2026 00:00:00",numLiq:"num 0050",rang:3,fourn:"0001 RAMANANTSOA Hasiniaina Norolalao",libelle:"string",mtLocale:480000,mtDevise:0,mtRapport:0,statut:PAYMENT_STATUS.PENDING,journal:"PAIEMENT DIRECT BM",banqueDO:"",banqueBenef:"",monnaie:"EUR",dateGen:"-",nomFichier:"-",utilisateur:"-",lienDoc:"-",beneficiaryPhone:"034 00 001 03"},
];

export const paymentStatusColor=status=>({
  [PAYMENT_STATUS.CANCELLED]:"#dc3545",
  [PAYMENT_STATUS.PENDING]:"#6c757d",
  [PAYMENT_STATUS.GENERATED]:"#28a745",
  [PAYMENT_STATUS.INITIATED]:"#7c3aed",
  [PAYMENT_STATUS.PAID]:"#28a745",
}[status]||"#6c757d");

export const formatPaymentAmount=value=>`${new Intl.NumberFormat("fr-MG").format(Number(value)||0)} Ar`;

export const isPaymentInitiated=payment=>payment?.statut===PAYMENT_STATUS.INITIATED;
