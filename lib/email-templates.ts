type EmailTemplateProps = {
  subject: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
};

const parseMessageToHtml = (msg: string, isDark: boolean) => {
  const textColor = isDark ? '#cbd5e1' : '#334155';
  const lines = msg.split('\n');
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }

    const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•');
    if (isBullet) {
      const content = line.substring(1).trim();
      if (!inList) {
        inList = true;
        html += `<ul style="margin: 0 0 16px 0; padding-left: 20px; list-style-type: disc; color: ${textColor};">`;
      }
      html += `<li style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: ${textColor};">${content}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: ${textColor};">${line}</p>`;
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
};

const formatMessage = (msg: string) => {
  return parseMessageToHtml(msg, false);
};

const BASE_STYLES = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; ${BASE_STYLES} width: 100% !important;">
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
                      ${subject}
                    </h1>
                  </td>
                </tr>

                <!-- BODY CONTENT -->
                <tr>
                  <td style="padding: 40px 40px 32px 40px;">
                    <div style="font-size: 15px; color: #334155; line-height: 1.6;">
                      ${formatMessage(message)}
                    </div>

                    <!-- CTA BUTTON -->
                    ${buttonText && buttonUrl ? `
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; margin-bottom: 16px;">
                        <tr>
                          <td align="center">
                            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; letter-spacing: -0.2px; text-align: center; border: 1px solid #2563eb;">
                              ${buttonText}
                            </a>
                          </td>
                        </tr>
                      </table>
                    ` : ''}
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
                      L'équipe JobSira
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.5; max-width: 400px;">
                      Vous recevez cet e-mail car vous êtes membre de JobSira. Vous pouvez mettre à jour vos notifications à tout moment.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                      <a href="{{ unsubscribe }}" style="color: #94a3b8; text-decoration: underline;">Se désabonner de ces communications</a>
                    </p>
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

export function generatePromoEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; ${BASE_STYLES} width: 100% !important;">
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
                      ${subject}
                    </h1>
                  </td>
                </tr>

                <!-- BODY CONTENT -->
                <tr>
                  <td style="padding: 48px 40px 32px 40px;">
                    <div style="font-size: 16px; color: #334155; line-height: 1.6; font-weight: 500;">
                      ${formatMessage(message)}
                    </div>

                    <!-- HIGHLIGHT CARD (Solid Blue border) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(37, 99, 235, 0.05); border-left: 4px solid #2563eb; border-radius: 0 16px 16px 0; margin-top: 36px; overflow: hidden;">
                      <tr>
                        <td style="padding: 28px;">
                          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">Ce qui vous attend :</h3>
                          <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #475569; line-height: 1.7; font-weight: 600;">
                            <li style="margin-bottom: 12px;">Boostez votre visibilité auprès des recruteurs</li>
                            <li style="margin-bottom: 12px;">Accès exclusif aux templates premium</li>
                            <li>Génération illimitée avec notre IA avancée</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA BUTTON (Solid CTA) -->
                    ${buttonText && buttonUrl ? `
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 48px;">
                        <tr>
                          <td align="center">
                            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 900; text-decoration: none; padding: 18px 42px; border-radius: 50px; font-size: 16px; letter-spacing: 0.5px; text-align: center; text-transform: uppercase; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3); border: 2px solid #ffffff;">
                              ${buttonText}
                            </a>
                          </td>
                        </tr>
                      </table>
                    ` : ''}
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
                      Dépêchez-vous, le temps file ! ⏳
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                      <a href="{{ unsubscribe }}" style="color: #cbd5e1; text-decoration: underline;">Se désabonner</a>
                    </p>
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
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; ${BASE_STYLES} width: 100% !important;">
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
                      ${subject}
                    </h2>
                  </td>
                </tr>

                <!-- CONTENT -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <div style="font-size: 15px; color: #334155; line-height: 1.6;">
                      ${formatMessage(message)}
                    </div>

                    <!-- SIMPLE BUTTON -->
                    ${buttonText && buttonUrl ? `
                      <div style="margin-top: 24px;">
                        <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; text-align: center;">
                          ${buttonText} →
                        </a>
                      </div>
                    ` : ''}
                  </td>
                </tr>

                <!-- CLOSING SIGNATURE -->
                <tr>
                  <td style="padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; line-height: 1.5;">
                    <p style="margin: 0;">
                      À bientôt,<br>
                      <strong>L'équipe JobSira</strong>
                    </p>
                    <p style="margin: 24px 0 0 0; font-size: 11px; color: #94a3b8;">
                      Ceci est une notification automatique. Vous pouvez vous <a href="{{ unsubscribe }}" style="color: #94a3b8; text-decoration: underline;">désabonner</a> si vous ne souhaitez plus recevoir ce type d'alertes.
                    </p>
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

export function generateNouveauteEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; ${BASE_STYLES} width: 100% !important;">
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
                          <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; background: #f8fafc; padding: 6px 12px; border-radius: 20px; border: 1px solid #e2e8f0;">Nouveauté Live</span>
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
                          <span style="font-size: 11px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 12px;">Mise à jour</span>
                          <h1 style="color: #0f172a; margin: 0 0 16px 0; font-size: 28px; font-weight: 900; line-height: 1.2; letter-spacing: -0.5px;">
                            ${subject}
                          </h1>
                          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 500;">
                            Découvrez nos dernières fonctionnalités pour donner un coup de boost décisif à votre carrière.
                          </p>
                          ${buttonText && buttonUrl ? `
                            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; text-align: center; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25); border: 1px solid #1d4ed8;">
                              ${buttonText}
                            </a>
                          ` : ''}
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
                      ${formatMessage(message)}
                    </div>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1.5px;">
                      L'équipe JobSira
                    </p>
                    <p style="margin: 0 0 24px 0; font-size: 12px; color: #64748b; line-height: 1.6; max-width: 400px;">
                      Simplifiez votre recherche d'emploi grâce à nos outils augmentés par l'IA.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                      <a href="{{ unsubscribe }}" style="color: #94a3b8; text-decoration: underline;">Se désabonner</a>
                    </p>
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

export function generateDreamforceEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
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
                            ${subject}
                          </h1>
                          ${buttonText && buttonUrl ? `
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-top: 24px;">
                                  <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
                                    ${buttonText}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          ` : ''}
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
                      ${parseMessageToHtml(message, true)}
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
                      L'intelligence artificielle au service de votre carrière.
                    </p>
                    <p style="margin: 0; font-size: 11px;">
                      <a href="{{ unsubscribe }}" style="color: #475569; text-decoration: underline;">Se désabonner</a>
                    </p>
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

export function getHtmlForTemplate(templateId: string, props: EmailTemplateProps) {
  switch (templateId) {
    case 'promo':
      return generatePromoEmail(props);
    case 'minimal':
      return generateMinimalEmail(props);
    case 'nouveaute':
      return generateNouveauteEmail(props);
    case 'dreamforce':
      return generateDreamforceEmail(props);
    case 'annonce':
    default:
      return generateAnnouncementEmail(props);
  }
}
