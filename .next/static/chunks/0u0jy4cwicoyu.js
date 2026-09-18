;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="cda36050-de48-c58b-1784-0d575bb94da1")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,187627,e=>{"use strict";var t=e.i(843476),i=e.i(590567);e.i(407624);var a=e.i(869721),s=e.i(309494),n=e.i(135333),r=e.i(94019),o=e.i(60259),c=e.i(275986),l=e.i(84365),u=e.i(267271),g=e.i(868067),m=e.i(953488),d=e.i(908258),x=e.i(710428),p=e.i(459645),C=e.i(374243),h=e.i(533862);e.s(["TechStack",0,function({cv:e}){let b=e.settings?.language||"fr",j=e.personalInfo||{},{experiences:v=[],education:f=[],skills:S=[],languages:T=[]}=e,y=e.hobbies||[],V=e.qualities||[],$=e.certifications||[],N=e.projects||[],k=e.references||[],w=e.socialLinks||[],q=e.divers||"",L=e.footer||{showFooter:!1,madeAt:"",madeDate:""},O="tech",A=(0,h.getAccentColor)(O,e.settings?.accentColor),E=e.sectionOrder||[...i.DEFAULT_SECTION_ORDER];return(0,t.jsxs)("div",{className:"cv-template w-full h-full bg-zinc-900 text-gray-300 font-mono text-sm min-h-[297mm] p-8 flex flex-col",children:[(0,t.jsx)("style",{children:`
        @media print {
          @page {
            margin: 0 !important;
          }
          html, body {
            background-color: #18181b !important;
          }
          .cv-template {
            padding-top: 15mm !important;
            padding-bottom: 15mm !important;
          }
          
          /* Hack CSS magique : emp\xeache le texte de coller au bord lors d'un saut de page */
          /* On ajoute une bordure transparente qui sert de "marge interne" au saut de page */
          /* et un margin-top n\xe9gatif qui l'annule au milieu de la page ! */
          .cv-template section, .cv-item {
            border-top: 15mm solid transparent !important;
            margin-top: -15mm !important;
            background-clip: padding-box !important;
          }
        }
      `}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("header",{className:"border-b border-gray-700 pb-6 mb-8 flex justify-between items-end",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs mb-1",style:{color:A},children:`// ${(0,C.getSectionTitle)("summary",e.settings,b).toLowerCase()}`}),(0,t.jsxs)("h1",{className:"text-3xl font-bold text-white",children:[j.firstName," ",j.lastName]}),j.title&&(0,t.jsxs)("p",{className:"mt-1",style:{color:A},children:["> ",j.title]})]}),(0,t.jsx)("div",{className:"text-right text-xs text-gray-500",children:(0,t.jsx)(a.CVContact,{personalInfo:j,socialLinks:w,variant:O,layout:"vertical",accentColor:A})})]}),(0,t.jsx)("div",{className:"space-y-8",children:E.map(i=>{switch(i){case"summary":return(0,t.jsx)(s.CVSummary,{summary:j.summary,variant:O,title:`/* ${(0,C.getSectionTitle)("summary",e.settings,b)} */`,accentColor:A},i);case"skills":return S.length>0?(0,t.jsx)(o.CVSkills,{skills:S,variant:O,layout:"tags",title:`// ${(0,C.getSectionTitle)("skills",e.settings,b).toLowerCase()}`,accentColor:A},i):null;case"languages":return T.length>0?(0,t.jsx)(c.CVLanguages,{languages:T,variant:O,title:`// ${(0,C.getSectionTitle)("languages",e.settings,b).toLowerCase()}`,accentColor:A},i):null;case"experience":return(0,t.jsx)(n.CVExperience,{experiences:v,variant:O,title:`/* ${(0,C.getSectionTitle)("experience",e.settings,b)} */`,lang:b,accentColor:A},i);case"education":return(0,t.jsx)(r.CVEducation,{education:f,variant:O,title:`/* ${(0,C.getSectionTitle)("education",e.settings,b)} */`,lang:b,accentColor:A},i);case"projects":return(0,t.jsx)(g.CVProjects,{projects:N,variant:O,title:`/* ${(0,C.getSectionTitle)("projects",e.settings,b)} */`,accentColor:A},i);case"certifications":return(0,t.jsx)(u.CVCertifications,{certifications:$,variant:O,title:`/* ${(0,C.getSectionTitle)("certifications",e.settings,b)} */`,accentColor:A},i);case"qualities":return(0,t.jsx)(p.CVQualities,{qualities:V,variant:O,title:`/* ${(0,C.getSectionTitle)("qualities",e.settings,b)} */`,accentColor:A},i);case"hobbies":return(0,t.jsx)(l.CVHobbies,{hobbies:y,variant:O,title:`/* ${(0,C.getSectionTitle)("hobbies",e.settings,b)} */`,accentColor:A},i);case"references":return(0,t.jsx)(m.CVReferences,{references:k,variant:O,title:`/* ${(0,C.getSectionTitle)("references",e.settings,b)} */`,showContact:!1,accentColor:A},i);case"divers":return(0,t.jsx)(d.CVDivers,{divers:q,variant:O,title:`/* ${(0,C.getSectionTitle)("divers",e.settings,b)} */`,accentColor:A},i);default:return null}})})]}),(0,t.jsx)(x.CVFooter,{footer:L,variant:O,lang:b,accentColor:A})]})}])},999806,function(e){e.n(e.i(187627))}]);

//# debugId=cda36050-de48-c58b-1784-0d575bb94da1