export const metadata = {
  title: "SoftDocs — Portail Fournisseurs",
  description: "Déposez vos documents fournisseurs en ligne — SoftDocs Madagascar",
};

export default function FournisseurLayout({ children }) {
  return (
    <>
      <style>{`
        .fourn-root {
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
        }
        @keyframes fourn-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fourn-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fourn-scan {
          0%   { top: -6px; }
          100% { top: calc(100% + 6px); }
        }
        @keyframes fourn-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fourn-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes fourn-pulse {
          0%,100% { opacity:1; }
          50%      { opacity:.45; }
        }
        @keyframes fourn-success {
          0%   { transform: scale(.6) rotate(-8deg); opacity:0; }
          70%  { transform: scale(1.08) rotate(1deg); }
          100% { transform: scale(1) rotate(0); opacity:1; }
        }
        @keyframes fourn-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      {children}
    </>
  );
}
