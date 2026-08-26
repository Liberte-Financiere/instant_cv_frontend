;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="1d3f4981-cd8f-e3e6-93cf-ecf16afb19a2")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,757430,e=>{"use strict";var t=e.i(843476),r=e.i(107233),l=e.i(286536),s=e.i(37727),i=e.i(271645),a=e.i(522016);let o=(e,t)=>{let r=t?"#cbd5e1":"#334155",l=e.split("\n"),s="",i=!1;for(let e=0;e<l.length;e++){let t=l[e].trim();if(""===t){i&&(s+="</ul>",i=!1);continue}if(t.startsWith("-")||t.startsWith("*")||t.startsWith("•")){let e=t.substring(1).trim();i||(i=!0,s+=`<ul style="margin: 0 0 16px 0; padding-left: 20px; list-style-type: disc; color: ${r};">`),s+=`<li style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: ${r};">${e}</li>`}else i&&(s+="</ul>",i=!1),s+=`<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: ${r};">${t}</p>`}return i&&(s+="</ul>"),s},d=`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;e.s(["default",0,function(){let[e,n]=(0,i.useState)("Tous"),[c,p]=(0,i.useState)(null);return(0,t.jsxs)("div",{className:"p-8 max-w-7xl mx-auto",children:[(0,t.jsxs)("div",{className:"animate-in fade-in slide-in-from-bottom-2 duration-300",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-8",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black text-slate-900 tracking-tight mb-2",children:"Bibliothèque de Templates"}),(0,t.jsx)("p",{className:"text-slate-500",children:"Gérez et créez des modèles réutilisables pour vos campagnes."})]}),(0,t.jsxs)("button",{className:"px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2",children:[(0,t.jsx)(r.Plus,{className:"w-4 h-4"}),"Créer un Template"]})]}),(0,t.jsx)("div",{className:"border-b border-slate-200 flex gap-8 mb-8",children:["Tous","Annonces","Newsletters","Transactionnel","Sur-mesure"].map(r=>(0,t.jsx)("button",{onClick:()=>n(r),className:`pb-4 text-sm font-bold border-b-2 transition-colors ${e===r?"border-blue-600 text-blue-700":"border-transparent text-slate-500 hover:text-slate-800"}`,children:r},r))}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:[(0,t.jsxs)("div",{className:"bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col",children:[(0,t.jsxs)("div",{className:"h-48 bg-slate-100 relative p-4 flex items-center justify-center",children:[(0,t.jsx)("div",{className:"absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm",children:"Annonce"}),(0,t.jsxs)("div",{className:"w-3/4 h-3/4 bg-white shadow-md rounded-lg overflow-hidden flex flex-col group-hover:scale-105 transition-transform duration-500",children:[(0,t.jsx)("div",{className:"h-8 bg-blue-600 w-full"}),(0,t.jsxs)("div",{className:"p-3",children:[(0,t.jsx)("div",{className:"w-2/3 h-2 bg-slate-800 rounded mb-3"}),(0,t.jsx)("div",{className:"w-full h-1 bg-slate-200 rounded mb-1.5"}),(0,t.jsx)("div",{className:"w-full h-1 bg-slate-200 rounded mb-1.5"}),(0,t.jsx)("div",{className:"w-4/5 h-1 bg-slate-200 rounded mb-3"}),(0,t.jsx)("div",{className:"w-16 h-4 mx-auto bg-blue-600 rounded"})]})]})]}),(0,t.jsxs)("div",{className:"p-6 flex flex-col flex-1",children:[(0,t.jsx)("h3",{className:"text-lg font-black text-slate-900 mb-2",children:"Annonce Standard"}),(0,t.jsx)("p",{className:"text-sm text-slate-500 mb-6 flex-1",children:"Le modèle classique, clair et professionnel. Idéal pour les newsletters et mises à jour importantes de Jobsira."}),(0,t.jsx)("div",{className:"flex items-center justify-end pt-4 border-t border-slate-100",children:(0,t.jsxs)("div",{className:"flex gap-2 w-full",children:[(0,t.jsxs)("button",{onClick:()=>p("annonce"),className:"flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2",children:[(0,t.jsx)(l.Eye,{className:"w-4 h-4"})," Aperçu"]}),(0,t.jsx)(a.default,{href:"/dashboard/hq-ops/marketing?template=annonce",className:"flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center",children:"Utiliser"})]})})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col",children:[(0,t.jsxs)("div",{className:"h-48 bg-slate-900 relative p-4 flex items-center justify-center overflow-hidden",children:[(0,t.jsx)("div",{className:"absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm z-10",children:"Promo"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-blue-600/10"}),(0,t.jsxs)("div",{className:"w-3/4 h-3/4 bg-white shadow-xl rounded-lg overflow-hidden border-2 border-blue-500/30 flex flex-col relative z-0 group-hover:scale-105 transition-transform duration-500",children:[(0,t.jsx)("div",{className:"h-10 bg-blue-600 w-full flex items-center justify-center",children:(0,t.jsx)("div",{className:"w-1/3 h-2 bg-white/80 rounded"})}),(0,t.jsxs)("div",{className:"p-3 text-center flex flex-col items-center",children:[(0,t.jsx)("div",{className:"w-1/2 h-2 bg-slate-800 rounded mb-3"}),(0,t.jsx)("div",{className:"w-full h-1 bg-slate-200 rounded mb-1.5"}),(0,t.jsx)("div",{className:"w-full h-1 bg-slate-200 rounded mb-3"}),(0,t.jsx)("div",{className:"w-20 h-5 bg-blue-600 rounded-full mt-1"})]})]})]}),(0,t.jsxs)("div",{className:"p-6 flex flex-col flex-1",children:[(0,t.jsx)("h3",{className:"text-lg font-black text-slate-900 mb-2",children:"Alerte Promo (Flashy)"}),(0,t.jsx)("p",{className:"text-sm text-slate-500 mb-6 flex-1",children:"Design percutant avec dégradés et gros bouton d'action. Parfait pour les réductions ou événements limités."}),(0,t.jsx)("div",{className:"flex items-center justify-end pt-4 border-t border-slate-100",children:(0,t.jsxs)("div",{className:"flex gap-2 w-full",children:[(0,t.jsxs)("button",{onClick:()=>p("promo"),className:"flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2",children:[(0,t.jsx)(l.Eye,{className:"w-4 h-4"})," Aperçu"]}),(0,t.jsx)(a.default,{href:"/dashboard/hq-ops/marketing?template=promo",className:"flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center",children:"Utiliser"})]})})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col",children:[(0,t.jsxs)("div",{className:"h-48 bg-slate-50 relative p-4 flex items-center justify-center",children:[(0,t.jsx)("div",{className:"absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm",children:"Textuel"}),(0,t.jsxs)("div",{className:"w-3/4 h-3/4 bg-white shadow-sm border border-slate-100 rounded p-4 group-hover:-translate-y-1 transition-transform duration-500",children:[(0,t.jsx)("div",{className:"w-2/3 h-2 bg-slate-800 rounded mb-2"}),(0,t.jsx)("div",{className:"w-full h-px bg-slate-200 mb-3"}),(0,t.jsx)("div",{className:"w-full h-1 bg-slate-300 rounded mb-1.5"}),(0,t.jsx)("div",{className:"w-5/6 h-1 bg-slate-300 rounded mb-1.5"}),(0,t.jsx)("div",{className:"w-full h-1 bg-slate-300 rounded mb-4"}),(0,t.jsx)("div",{className:"w-1/3 h-1.5 bg-blue-600 rounded"})]})]}),(0,t.jsxs)("div",{className:"p-6 flex flex-col flex-1",children:[(0,t.jsx)("h3",{className:"text-lg font-black text-slate-900 mb-2",children:"Défaut Minimaliste"}),(0,t.jsx)("p",{className:"text-sm text-slate-500 mb-6 flex-1",children:"Ressemble à un e-mail personnel. Pas de décoration, juste du texte direct. Idéal pour une relation intime avec les utilisateurs."}),(0,t.jsx)("div",{className:"flex items-center justify-end pt-4 border-t border-slate-100",children:(0,t.jsxs)("div",{className:"flex gap-2 w-full",children:[(0,t.jsxs)("button",{onClick:()=>p("minimal"),className:"flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2",children:[(0,t.jsx)(l.Eye,{className:"w-4 h-4"})," Aperçu"]}),(0,t.jsx)(a.default,{href:"/dashboard/hq-ops/marketing?template=minimal",className:"flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center",children:"Utiliser"})]})})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col",children:[(0,t.jsxs)("div",{className:"h-48 bg-blue-50 relative p-4 flex items-center justify-center overflow-hidden",children:[(0,t.jsx)("div",{className:"absolute top-4 right-4 bg-white text-blue-600 border border-blue-100 text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm z-10",children:"Nouveauté"}),(0,t.jsx)("div",{className:"w-3/4 h-3/4 bg-white shadow-xl rounded-lg overflow-hidden border border-slate-200 flex flex-col relative z-0 group-hover:scale-105 transition-transform duration-500",children:(0,t.jsxs)("div",{className:"p-3 h-full bg-slate-50",children:[(0,t.jsxs)("div",{className:"flex justify-between items-start mb-2",children:[(0,t.jsx)("div",{className:"w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded"}),(0,t.jsx)("div",{className:"w-10 h-3 bg-green-100 rounded-full border border-green-200"})]}),(0,t.jsx)("div",{className:"w-full h-1.5 bg-slate-200 rounded mb-1"}),(0,t.jsx)("div",{className:"w-4/5 h-1.5 bg-slate-200 rounded mb-2"}),(0,t.jsxs)("div",{className:"flex gap-1 mt-auto",children:[(0,t.jsx)("div",{className:"flex-1 h-3 border border-slate-200 rounded-sm"}),(0,t.jsx)("div",{className:"flex-1 h-3 border border-slate-200 rounded-sm"}),(0,t.jsx)("div",{className:"flex-1 h-3 border border-slate-200 rounded-sm"})]})]})})]}),(0,t.jsxs)("div",{className:"p-6 flex flex-col flex-1",children:[(0,t.jsx)("h3",{className:"text-lg font-black text-slate-900 mb-2",children:"Nouveauté Live"}),(0,t.jsx)("p",{className:"text-sm text-slate-500 mb-6 flex-1",children:"Design moderne et lumineux avec illustration de tableau de bord. Parfait pour annoncer la sortie de nouvelles fonctionnalités."}),(0,t.jsx)("div",{className:"flex items-center justify-end pt-4 border-t border-slate-100",children:(0,t.jsxs)("div",{className:"flex gap-2 w-full",children:[(0,t.jsxs)("button",{onClick:()=>p("nouveaute"),className:"flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2",children:[(0,t.jsx)(l.Eye,{className:"w-4 h-4"})," Aperçu"]}),(0,t.jsx)(a.default,{href:"/dashboard/hq-ops/marketing?template=nouveaute",className:"flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center",children:"Utiliser"})]})})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col",children:[(0,t.jsxs)("div",{className:"h-48 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative p-4 flex items-center justify-center overflow-hidden",children:[(0,t.jsx)("div",{className:"absolute top-4 right-4 bg-blue-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm z-10",children:"Premium"}),(0,t.jsx)("div",{className:"w-3/4 h-3/4 bg-slate-900/80 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-blue-900/50 flex flex-col relative z-0 group-hover:scale-105 transition-transform duration-500",children:(0,t.jsxs)("div",{className:"p-3 flex items-center justify-between h-full",children:[(0,t.jsxs)("div",{className:"w-1/2 flex flex-col justify-center",children:[(0,t.jsx)("div",{className:"w-12 h-1.5 bg-blue-400 rounded mb-1"}),(0,t.jsx)("div",{className:"w-full h-3 bg-white rounded mb-2"}),(0,t.jsx)("div",{className:"w-8 h-3.5 bg-blue-600 rounded"})]}),(0,t.jsxs)("div",{className:"w-1/3 h-10 bg-slate-950 border border-blue-500/30 rounded p-1 flex flex-col justify-between",children:[(0,t.jsxs)("div",{className:"flex gap-0.5",children:[(0,t.jsx)("div",{className:"w-1 h-1 bg-red-500 rounded-full"}),(0,t.jsx)("div",{className:"w-1 h-1 bg-yellow-500 rounded-full"})]}),(0,t.jsx)("div",{className:"w-full h-2 bg-blue-500/20 rounded"})]})]})})]}),(0,t.jsxs)("div",{className:"p-6 flex flex-col flex-1",children:[(0,t.jsx)("h3",{className:"text-lg font-black text-slate-900 mb-2",children:"Premium Événement"}),(0,t.jsx)("p",{className:"text-sm text-slate-500 mb-6 flex-1",children:"Design percutant avec en-tête dégradé (Dreamforce style) et mise en page à deux colonnes pour lancements de fonctionnalités."}),(0,t.jsx)("div",{className:"flex items-center justify-end pt-4 border-t border-slate-100",children:(0,t.jsxs)("div",{className:"flex gap-2 w-full",children:[(0,t.jsxs)("button",{onClick:()=>p("dreamforce"),className:"flex-1 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2",children:[(0,t.jsx)(l.Eye,{className:"w-4 h-4"})," Aperçu"]}),(0,t.jsx)(a.default,{href:"/dashboard/hq-ops/marketing?template=dreamforce",className:"flex-1 py-2 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors shadow-sm flex items-center justify-center text-center",children:"Utiliser"})]})})]})]})]})]}),c&&(0,t.jsxs)("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[(0,t.jsx)("div",{className:"absolute inset-0 bg-slate-900/40 backdrop-blur-sm",onClick:()=>p(null)}),(0,t.jsxs)("div",{className:"bg-slate-100 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl h-[85vh] relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col",children:[(0,t.jsxs)("div",{className:"bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20 relative",children:[(0,t.jsx)("h3",{className:"text-lg font-bold text-slate-800",children:"Aperçu du Template"}),(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)(a.default,{href:`/dashboard/hq-ops/marketing?template=${c}`,className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors",children:"Utiliser ce modèle"}),(0,t.jsx)("button",{onClick:()=>p(null),className:"p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors",children:(0,t.jsx)(s.X,{className:"w-5 h-5"})})]})]}),(0,t.jsx)("div",{className:"flex-1 bg-slate-100 p-8 overflow-y-auto w-full flex justify-center relative",children:(0,t.jsx)("iframe",{srcDoc:function(e,t){switch(e){case"promo":return function({subject:e,message:t,buttonText:r,buttonUrl:l}){return`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${e}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; ${d} width: 100% !important;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f8fafc" style="padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.15);">
                <!-- HEADER LOGO -->
                <tr>
                  <td align="center" style="padding: 24px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                    <span style="font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -1px;">JobSira<span style="color: #4f46e5;">.</span></span>
                  </td>
                </tr>

                <!-- HERO PROMO (SOLID BLUE DESIGN) -->
                <tr>
                  <td align="center" style="background-color: #2563eb; padding: 56px 40px; text-align: center; position: relative;">
                    <span style="display: inline-block; background-color: #ffffff; color: #2563eb; font-size: 12px; font-weight: 900; text-transform: uppercase; padding: 8px 16px; border-radius: 30px; margin-bottom: 24px; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);">
                      🚀 OFFRE FLASH
                    </span>
                    <h1 style="color: #ffffff; margin: 0; font-size: 34px; font-weight: 900; line-height: 1.2; letter-spacing: -1px; text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
                      ${e}
                    </h1>
                  </td>
                </tr>

                <!-- BODY CONTENT -->
                <tr>
                  <td style="padding: 48px 40px 32px 40px;">
                    <div style="font-size: 16px; color: #334155; line-height: 1.6; font-weight: 500;">
                      ${o(t,!1)}
                    </div>

                    <!-- HIGHLIGHT CARD (Solid Blue border) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(37, 99, 235, 0.05); border-left: 4px solid #2563eb; border-radius: 0 16px 16px 0; margin-top: 36px; overflow: hidden;">
                      <tr>
                        <td style="padding: 28px;">
                          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">Ce qui vous attend :</h3>
                          <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #475569; line-height: 1.7; font-weight: 600;">
                            <li style="margin-bottom: 12px;">Boostez votre visibilit\xe9 aupr\xe8s des recruteurs</li>
                            <li style="margin-bottom: 12px;">Acc\xe8s exclusif aux templates premium</li>
                            <li>G\xe9n\xe9ration illimit\xe9e avec notre IA avanc\xe9e</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA BUTTON (Solid CTA) -->
                    ${r&&l?`
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 48px;">
                        <tr>
                          <td align="center">
                            <a href="${l}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 900; text-decoration: none; padding: 18px 42px; border-radius: 50px; font-size: 16px; letter-spacing: 0.5px; text-align: center; text-transform: uppercase; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3); border: 2px solid #ffffff;">
                              ${r}
                            </a>
                          </td>
                        </tr>
                      </table>
                    `:""}
                  </td>
                </tr>

                <!-- DIVIDER -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="border-top: 2px dashed #e2e8f0;"></div>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 32px 40px; background-color: #ffffff;">
                    <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; color: #94a3b8; line-height: 1.5; text-transform: uppercase; letter-spacing: 1px;">
                      D\xe9p\xeachez-vous, le temps file ! ⏳
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                      <a href="{{ unsubscribe }}" style="color: #cbd5e1; text-decoration: underline;">Se d\xe9sabonner</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `}(t);case"minimal":return function({subject:e,message:t,buttonText:r,buttonUrl:l}){return`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${e}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; ${d} width: 100% !important;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="padding: 32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff;">
                <!-- SIMPLE TYPOGRAPHIC LOGO -->
                <tr>
                  <td style="padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">JobSira<span style="color: #2563eb;">.</span></span>
                  </td>
                </tr>

                <!-- SUBJECT / TITLE -->
                <tr>
                  <td style="padding: 32px 0 16px 0;">
                    <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                      ${e}
                    </h2>
                  </td>
                </tr>

                <!-- CONTENT -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <div style="font-size: 15px; color: #334155; line-height: 1.6;">
                      ${o(t,!1)}
                    </div>

                    <!-- SIMPLE BUTTON -->
                    ${r&&l?`
                      <div style="margin-top: 24px;">
                        <a href="${l}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; text-align: center;">
                          ${r} →
                        </a>
                      </div>
                    `:""}
                  </td>
                </tr>

                <!-- CLOSING SIGNATURE -->
                <tr>
                  <td style="padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; line-height: 1.5;">
                    <p style="margin: 0;">
                      \xc0 bient\xf4t,<br>
                      <strong>L'\xe9quipe JobSira</strong>
                    </p>
                    <p style="margin: 24px 0 0 0; font-size: 11px; color: #94a3b8;">
                      Ceci est une notification automatique. Vous pouvez vous <a href="{{ unsubscribe }}" style="color: #94a3b8; text-decoration: underline;">d\xe9sabonner</a> si vous ne souhaitez plus recevoir ce type d'alertes.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `}(t);case"nouveaute":return function({subject:e,message:t,buttonText:r,buttonUrl:l}){return`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${e}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; ${d} width: 100% !important;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f1f5f9" style="padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);">
                <!-- HEADER LOGO -->
                <tr>
                  <td style="padding: 32px 40px 24px 40px; background: #ffffff; border-bottom: 1px solid #f1f5f9;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">JobSira<span style="color: #2563eb;">.</span></span>
                        </td>
                        <td align="right">
                          <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; background: #f8fafc; padding: 6px 12px; border-radius: 20px; border: 1px solid #e2e8f0;">Nouveaut\xe9 Live</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- HERO SECTION: TWO COLUMNS (Light style) -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); padding: 48px 40px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left column: Text & CTA -->
                        <td width="55%" style="vertical-align: middle; padding-right: 20px;">
                          <span style="font-size: 11px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 12px;">Mise \xe0 jour</span>
                          <h1 style="color: #0f172a; margin: 0 0 16px 0; font-size: 28px; font-weight: 900; line-height: 1.2; letter-spacing: -0.5px;">
                            ${e}
                          </h1>
                          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 500;">
                            D\xe9couvrez nos derni\xe8res fonctionnalit\xe9s pour donner un coup de boost d\xe9cisif \xe0 votre carri\xe8re.
                          </p>
                          ${r&&l?`
                            <a href="${l}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; text-align: center; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25); border: 1px solid #1d4ed8;">
                              ${r}
                            </a>
                          `:""}
                        </td>
                        <!-- Right column: CSS Dashboard Graphic (Landing Page Style) -->
                        <td width="45%" style="vertical-align: middle;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.15); border: 1px solid #f1f5f9; position: relative;">
                            <tr>
                              <!-- Top Header: Avatar & Match Badge -->
                              <td style="padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="48px">
                                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 10px; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);"></div>
                                    </td>
                                    <td style="vertical-align: middle;">
                                      <div style="width: 70px; height: 6px; background-color: #1e293b; border-radius: 3px; margin-bottom: 6px;"></div>
                                      <div style="width: 45px; height: 5px; background-color: #94a3b8; border-radius: 2.5px;"></div>
                                    </td>
                                    <td align="right" style="vertical-align: top;">
                                      <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 20px; border: 1px solid #bbf7d0;">98% Match</span>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <!-- Body Lines -->
                              <td style="padding-top: 16px;">
                                <div style="width: 60px; height: 6px; background-color: #e2e8f0; border-radius: 3px; margin-bottom: 12px;"></div>
                                <div style="width: 100%; height: 4px; background-color: #f1f5f9; border-radius: 2px; margin-bottom: 8px;"></div>
                                <div style="width: 90%; height: 4px; background-color: #f1f5f9; border-radius: 2px; margin-bottom: 16px;"></div>
                                
                                <div style="width: 70px; height: 6px; background-color: #e2e8f0; border-radius: 3px; margin-bottom: 12px;"></div>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="30%"><div style="height: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;"></div></td>
                                    <td width="5%"></td>
                                    <td width="30%"><div style="height: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;"></div></td>
                                    <td width="5%"></td>
                                    <td width="30%"><div style="height: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;"></div></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- MAIN MESSAGE -->
                <tr>
                  <td style="padding: 48px 40px 32px 40px;">
                    <div style="font-size: 15px; color: #334155; line-height: 1.6;">
                      ${o(t,!1)}
                    </div>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1.5px;">
                      L'\xe9quipe JobSira
                    </p>
                    <p style="margin: 0 0 24px 0; font-size: 12px; color: #64748b; line-height: 1.6; max-width: 400px;">
                      Simplifiez votre recherche d'emploi gr\xe2ce \xe0 nos outils augment\xe9s par l'IA.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                      <a href="{{ unsubscribe }}" style="color: #94a3b8; text-decoration: underline;">Se d\xe9sabonner</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `}(t);case"dreamforce":return function({subject:e,message:t,buttonText:r,buttonUrl:l}){return`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${e}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #020617; padding: 40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #0f172a; border-radius: 16px; overflow: hidden; margin: 0 auto; border: 1px solid #1e293b;">
                <!-- HEADER GRADIENT -->
                <tr>
                  <td style="background: linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #172554 100%); padding: 60px 40px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left column: Text -->
                        <td width="55%" style="padding-right: 20px;">
                          <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 800; color: #ffffff; line-height: 1.1; letter-spacing: -1px;">
                            ${e}
                          </h1>
                          ${r&&l?`
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-top: 24px;">
                                  <a href="${l}" target="_blank" style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
                                    ${r}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          `:""}
                        </td>
                        <!-- Right column: CSS Abstract Graphic -->
                        <td width="45%" style="vertical-align: middle;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #020617; border: 1px solid #3b82f640; border-radius: 12px; padding: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);">
                            <tr>
                              <td colspan="2" style="padding-bottom: 12px;">
                                <div style="display: inline-block; width: 6px; height: 6px; background-color: #ef4444; border-radius: 50%; margin-right: 4px;"></div>
                                <div style="display: inline-block; width: 6px; height: 6px; background-color: #eab308; border-radius: 50%; margin-right: 4px;"></div>
                                <div style="display: inline-block; width: 6px; height: 6px; background-color: #22c55e; border-radius: 50%;"></div>
                              </td>
                            </tr>
                            <tr>
                              <td width="30%" style="vertical-align: top; padding-right: 10px;">
                                <div style="width: 24px; height: 24px; background-color: #1d4ed8; border-radius: 4px; margin-bottom: 8px;"></div>
                                <div style="width: 100%; height: 3px; background-color: #334155; border-radius: 2px; margin-bottom: 4px;"></div>
                                <div style="width: 70%; height: 3px; background-color: #334155; border-radius: 2px;"></div>
                              </td>
                              <td width="70%" style="vertical-align: top;">
                                <div style="width: 90%; height: 5px; background-color: #475569; border-radius: 2.5px; margin-bottom: 8px;"></div>
                                <div style="width: 50%; height: 3px; background-color: #3b82f6; border-radius: 1.5px; margin-bottom: 12px;"></div>
                                <div style="width: 100%; height: 2px; background-color: #1e293b; border-radius: 1px; margin-bottom: 4px;"></div>
                                <div style="width: 80%; height: 2px; background-color: #1e293b; border-radius: 1px;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- MAIN MESSAGE -->
                <tr>
                  <td style="padding: 48px 40px; background-color: #0f172a;">
                    <div style="font-size: 16px; color: #cbd5e1; line-height: 1.7;">
                      ${o(t,!0)}
                    </div>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 32px 40px; background-color: #020617; border-top: 1px solid #1e293b;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">
                      JobSira
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                      L'intelligence artificielle au service de votre carri\xe8re.
                    </p>
                    <p style="margin: 0; font-size: 11px;">
                      <a href="{{ unsubscribe }}" style="color: #475569; text-decoration: underline;">Se d\xe9sabonner</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `}(t);default:return function({subject:e,message:t,buttonText:r,buttonUrl:l}){return`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${e}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; ${d} width: 100% !important;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f8fafc" style="padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
                <!-- HEADER LOGO -->
                <tr>
                  <td align="center" style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #f1f5f9;">
                    <span style="font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -1px;">JobSira<span style="color: #2563eb;">.</span></span>
                  </td>
                </tr>

                <!-- HERO GRADIENT BANNER -->
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 48px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; line-height: 1.3; letter-spacing: -0.5px;">
                      ${e}
                    </h1>
                  </td>
                </tr>

                <!-- BODY CONTENT -->
                <tr>
                  <td style="padding: 40px 40px 32px 40px;">
                    <div style="font-size: 15px; color: #334155; line-height: 1.6;">
                      ${o(t,!1)}
                    </div>

                    <!-- CTA BUTTON -->
                    ${r&&l?`
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; margin-bottom: 16px;">
                        <tr>
                          <td align="center">
                            <a href="${l}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; letter-spacing: -0.2px; text-align: center; border: 1px solid #2563eb;">
                              ${r}
                            </a>
                          </td>
                        </tr>
                      </table>
                    `:""}
                  </td>
                </tr>

                <!-- DIVIDER -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="border-top: 1px solid #f1f5f9;"></div>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 32px 40px; background-color: #ffffff;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">
                      L'\xe9quipe JobSira
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.5; max-width: 400px;">
                      Vous recevez cet e-mail car vous \xeates membre de JobSira. Vous pouvez mettre \xe0 jour vos notifications \xe0 tout moment.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                      <a href="{{ unsubscribe }}" style="color: #94a3b8; text-decoration: underline;">Se d\xe9sabonner de ces communications</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `}(t)}}(c,{subject:"Ceci est un exemple de sujet d'e-mail",message:"Bonjour, \n\nVoici un aperçu visuel de la structure de ce modèle. Votre texte sera organisé en paragraphes de cette manière.\n\nCe design est conçu pour mettre en valeur votre contenu tout en restant professionnel et lisible sur tous les appareils.",buttonText:"Bouton d'exemple",buttonUrl:"#"}),className:"w-full max-w-[600px] bg-white h-full min-h-[600px] shadow-sm rounded-lg border-0",title:"Email Preview"})})]})]})]})}],757430)},286536,e=>{"use strict";let t=(0,e.i(475254).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],286536)},107233,e=>{"use strict";let t=(0,e.i(475254).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",0,t],107233)}]);

//# debugId=1d3f4981-cd8f-e3e6-93cf-ecf16afb19a2