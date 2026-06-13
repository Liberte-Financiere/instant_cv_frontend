type EmailTemplateProps = {
  subject: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
};

const formatMessage = (msg: string) => {
  return msg.split('\n').map(p => `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #475569;">${p}</p>`).join('');
};

// Polices compatibles avec tous les clients mail
const BASE_STYLES = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export function generateAnnouncementEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 40px 10px; background-color: #f4f4f5; ${BASE_STYLES}">
        
        <!-- WRAPPER -->
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- BRAND HEADER -->
          <div style="padding: 24px 40px; text-align: center; border-bottom: 1px solid #f4f4f5;">
            <img src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=150&q=80" alt="Jobsira Logo" style="height: 30px; object-fit: cover; border-radius: 4px; display: inline-block;">
            <span style="font-size: 22px; font-weight: 800; color: #0f172a; vertical-align: middle; margin-left: 10px; letter-spacing: -0.5px;">Jobsira</span>
          </div>

          <!-- HERO BANNER -->
          <div style="width: 100%; height: 200px; background-image: url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; position: relative;">
            <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.6);"></div>
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;">
               <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${subject}</h1>
            </div>
          </div>
          
          <!-- MAIN CONTENT -->
          <div style="padding: 40px;">
            <p style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1e293b;">
              Bonjour,
            </p>
            
            ${formatMessage(message)}
            
            <!-- FEATURE HIGHLIGHT (Envato Style) -->
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a;">Points clés :</h3>
              <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.6;">
                <li>Amélioration continue de la plateforme</li>
                <li>Nouveaux outils pour booster votre carrière</li>
              </ul>
            </div>
            
            ${buttonText && buttonUrl ? `
              <div style="text-align: center; margin-top: 40px;">
                <a href="${buttonUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; text-decoration: none; padding: 16px 36px; border-radius: 6px; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                  ${buttonText}
                </a>
              </div>
            ` : ''}
          </div>
          
          <!-- DIVIDER -->
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;">

          <!-- RICH FOOTER -->
          <div style="background-color: #f8fafc; padding: 40px; text-align: center;">
            <div style="margin-bottom: 24px;">
              <a href="#" style="display: inline-block; margin: 0 8px; color: #94a3b8; text-decoration: none; font-weight: bold;">Twitter</a>
              <a href="#" style="display: inline-block; margin: 0 8px; color: #94a3b8; text-decoration: none; font-weight: bold;">LinkedIn</a>
              <a href="#" style="display: inline-block; margin: 0 8px; color: #94a3b8; text-decoration: none; font-weight: bold;">Instagram</a>
            </div>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-weight: 500;">
              © ${new Date().getFullYear()} Jobsira Inc. Tous droits réservés.
            </p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              123 Avenue de l'Innovation, 75001 Paris, France<br>
              Vous recevez cet email car vous êtes inscrit sur notre plateforme.<br>
              <a href="#" style="color: #64748b; text-decoration: underline;">Gérer vos préférences</a> | <a href="{{ unsubscribe }}" style="color: #64748b; text-decoration: underline;">Se désabonner</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generatePromoEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  // Adaptation de la structure EventMax à Jobsira
  const themeColor = "#2563eb"; // Bleu Jobsira
  const darkBg = "#0f172a"; // Bleu sombre (slate-900)
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 600px) {
            .mobile-col { display: block !important; width: 100% !important; max-width: 100% !important; padding: 10px 0 !important; }
            .hide-mobile { display: none !important; }
            .hero-text { font-size: 24px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 40px 10px; background-color: #e2e8f0; ${BASE_STYLES}">
        
        <!-- WRAPPER PRINCIPAL -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          
          <!-- TOP HEADER -->
          <tr>
            <td bgcolor="${darkBg}" style="padding: 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="30%" style="font-size: 22px; color: #ffffff; font-weight: 800; letter-spacing: -0.5px;">
                    Jobsira<span style="color: ${themeColor};">.</span>
                  </td>
                  <td width="70%" align="right" class="hide-mobile">
                    <a href="#" style="color: #cbd5e1; text-decoration: none; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-left: 15px;">Modèles</a>
                    <a href="#" style="color: #cbd5e1; text-decoration: none; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-left: 15px;">Tarifs</a>
                    <a href="#" style="color: #cbd5e1; text-decoration: none; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-left: 15px;">Connexion</a>
                    <a href="#" style="background-color: ${themeColor}; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-left: 15px; padding: 6px 14px; border-radius: 4px;">Créer mon CV</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- HERO BANNER -->
          <tr>
            <td bgcolor="${darkBg}" style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; text-align: center; padding: 80px 20px;">
              
              <div style="background-color: rgba(15, 23, 42, 0.75); padding: 50px 20px; border-radius: 12px; backdrop-filter: blur(4px);">
                <p style="color: #94a3b8; font-size: 14px; font-weight: 700; margin: 0 0 15px 0; letter-spacing: 2px; text-transform: uppercase;">
                  Propulsé par l'IA
                </p>
                <h1 class="hero-text" style="color: #ffffff; font-size: 36px; font-weight: 800; margin: 0 0 20px 0; line-height: 1.1; letter-spacing: -1px;">
                  DÉCROCHEZ LE <span style="color: #60a5fa;">JOB</span><br>DE VOS RÊVES
                </h1>
                
                <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; max-width: 450px; margin: 0 auto 35px auto;">
                  ${subject}<br>
                  Créez un CV professionnel en quelques minutes et démarquez-vous auprès des recruteurs.
                </p>
                
                <table border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>
                    <td align="center" style="padding: 0 10px;">
                      ${buttonText && buttonUrl ? `
                        <a href="${buttonUrl}" style="display: inline-block; background-color: ${themeColor}; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 15px;">
                          ${buttonText}
                        </a>
                      ` : `
                        <a href="https://jobsira.com" style="display: inline-block; background-color: ${themeColor}; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 15px;">
                          Générer mon CV
                        </a>
                      `}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- IMAGE GRID & TEXT (2 COLUMNS) -->
          <tr>
            <td style="padding: 70px 30px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <!-- Left Col: Images (Office / Work) -->
                  <td width="48%" valign="top" class="mobile-col">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="48%" style="padding-bottom: 4%;">
                          <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80" width="100%" style="display: block; border-radius: 6px;" alt="Work">
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="padding-bottom: 4%;">
                          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80" width="100%" style="display: block; border-radius: 6px;" alt="Laptop">
                        </td>
                      </tr>
                      <tr>
                        <td width="48%">
                          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80" width="100%" style="display: block; border-radius: 6px;" alt="Interview">
                        </td>
                        <td width="4%"></td>
                        <td width="48%">
                          <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=300&q=80" width="100%" style="display: block; border-radius: 6px;" alt="Success">
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <td width="6%" class="hide-mobile"></td>
                  
                  <!-- Right Col: Text -->
                  <td width="46%" valign="middle" class="mobile-col">
                    <h2 style="margin: 0 0 20px 0; font-size: 26px; color: #0f172a; font-weight: 800; line-height: 1.2;">
                      Un outil conçu pour <span style="color: ${themeColor};">votre réussite</span>.
                    </h2>
                    <div style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 30px;">
                      ${formatMessage(message)}
                    </div>
                    ${buttonText && buttonUrl ? `
                      <a href="${buttonUrl}" style="display: inline-block; background-color: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px;">
                        En savoir plus →
                      </a>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- AVANTAGES SECTION (3 COLUMNS) -->
          <tr>
            <td style="padding: 60px 30px 80px 30px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <h2 style="margin: 0 0 50px 0; font-size: 24px; color: #0f172a; font-weight: 800;">
                POURQUOI CHOISIR <span style="color: ${themeColor};">JOBSIRA</span> ?
              </h2>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <!-- Item 1 -->
                  <td width="31%" valign="top" class="mobile-col" style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-size: 24px; font-weight: 800; color: ${themeColor}; margin-bottom: 10px;">01.</div>
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a; font-weight: 700;">Rapide</h3>
                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                      Générez un CV complet et professionnel en moins de 5 minutes grâce à l'IA.
                    </p>
                  </td>
                  <td width="3.5%" class="hide-mobile"></td>
                  
                  <!-- Item 2 -->
                  <td width="31%" valign="top" class="mobile-col" style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-size: 24px; font-weight: 800; color: ${themeColor}; margin-bottom: 10px;">02.</div>
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a; font-weight: 700;">Design</h3>
                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                      Des dizaines de modèles modernes conçus par des experts en recrutement.
                    </p>
                  </td>
                  <td width="3.5%" class="hide-mobile"></td>
                  
                  <!-- Item 3 -->
                  <td width="31%" valign="top" class="mobile-col" style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-size: 24px; font-weight: 800; color: ${themeColor}; margin-bottom: 10px;">03.</div>
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a; font-weight: 700;">Impactant</h3>
                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                      Des tournures de phrases optimisées pour attirer l'œil des recruteurs.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 30px; font-size: 11px; color: #94a3b8;">
                    Cet email a été envoyé par Jobsira.<br>
                    <a href="{{ unsubscribe }}" style="color: #9ca3af; text-decoration: underline;">Se désabonner</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </body>
    </html>
  `;
}

export function generateMinimalEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 40px 10px; background-color: #f1f5f9; ${BASE_STYLES}">
        
        <!-- WRAPPER TRANSACTIONAL -->
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; border-top: 4px solid #2563eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <div style="padding: 40px;">
            <h2 style="color: #0f172a; margin: 0 0 30px 0; font-size: 20px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
              ${subject}
            </h2>
            
            <div style="font-size: 15px; color: #334155;">
              ${formatMessage(message)}
            </div>
            
            ${buttonText && buttonUrl ? `
              <div style="margin-top: 35px; text-align: left;">
                <a href="${buttonUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 14px;">
                  ${buttonText} →
                </a>
              </div>
            ` : ''}
            
            <div style="margin-top: 50px; font-size: 14px; color: #64748b;">
              <p style="margin: 0;">
                Cordialement,<br>
                <strong style="color: #0f172a; display: block; margin-top: 5px;">Le Support Jobsira</strong>
              </p>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
             Ceci est un email transactionnel. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getHtmlForTemplate(templateId: string, props: EmailTemplateProps) {
  switch (templateId) {
    case 'promo':
      return generatePromoEmail(props);
    case 'minimal':
      return generateMinimalEmail(props);
    case 'annonce':
    default:
      return generateAnnouncementEmail(props);
  }
}
