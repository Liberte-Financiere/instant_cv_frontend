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
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
                <!-- HEADER LOGO -->
                <tr>
                  <td align="center" style="padding: 24px; background-color: #0f172a;">
                    <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -1px;">JobSira<span style="color: #2563eb;">.</span></span>
                  </td>
                </tr>

                <!-- HERO PROMO (BLUE/INDIGO BOLD DESIGN) -->
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 48px 40px; text-align: center;">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; margin-bottom: 16px; letter-spacing: 1px;">
                      Offre Spéciale
                    </span>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; line-height: 1.2; letter-spacing: -1px;">
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

                    <!-- HIGHLIGHT CARD (Pure HTML/CSS - No Images) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px; margin-top: 32px; overflow: hidden;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #1e3a8a;">Pourquoi en profiter maintenant ?</h3>
                          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e40af; line-height: 1.5;">
                            <li style="margin-bottom: 4px;">Optimisation immédiate de vos CV par l'IA</li>
                            <li style="margin-bottom: 4px;">Modèles de CV premium accrus et validés par les recruteurs</li>
                            <li>Support prioritaire dédié à votre réussite</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA BUTTON -->
                    ${buttonText && buttonUrl ? `
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px;">
                        <tr>
                          <td align="center">
                            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 800; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 15px; letter-spacing: -0.2px; text-align: center; border: 1px solid #2563eb; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);">
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
                    <p style="margin: 0 0 16px 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                      Cette offre promotionnelle est limitée dans le temps. Pour toute assistance, écrivez-nous directement.<br>
                      JobSira, Plateforme de CV augmentés.
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

const formatDarkMessage = (msg: string) => {
  return parseMessageToHtml(msg, true);
};

export function generateArtlistEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b0f19; ${BASE_STYLES} width: 100% !important;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0b0f19" style="padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);">
                <!-- HEADER LOGO -->
                <tr>
                  <td align="center" style="padding: 32px 40px 16px 40px;">
                    <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">JobSira<span style="color: #2563eb;">.</span></span>
                  </td>
                </tr>

                <!-- SUBTITLE -->
                <tr>
                  <td align="center" style="padding: 16px 40px 8px 40px;">
                    <span style="font-size: 11px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 2px;">Nouveauté Live</span>
                  </td>
                </tr>

                <!-- MAIN BOLD HERO TITLE -->
                <tr>
                  <td align="center" style="padding: 0 40px 24px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; line-height: 1.2; letter-spacing: -1px;">
                      ${subject}
                    </h1>
                  </td>
                </tr>

                <!-- PILLS / CHIPS SECTION -->
                <tr>
                  <td align="center" style="padding: 0 30px 32px 30px;">
                    <div style="max-width: 480px; text-align: center;">
                      <span style="display: inline-block; background-color: #1e293b; color: #ffffff; border: 1px solid #334155; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 5px;">⚡ IA Générative 3.0</span>
                      <span style="display: inline-block; background-color: #1e293b; color: #ffffff; border: 1px solid #334155; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 5px;">✨ Modèles Premium</span>
                      <span style="display: inline-block; background-color: #1e293b; color: #ffffff; border: 1px solid #334155; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 5px;">🚀 Traduction instantanée</span>
                    </div>
                  </td>
                </tr>

                <!-- DESCRIPTION -->
                <tr>
                  <td style="padding: 0 48px 32px 48px; text-align: center;">
                    <div style="font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 auto; max-width: 480px;">
                      ${formatDarkMessage(message)}
                    </div>
                  </td>
                </tr>

                <!-- HERO CTA BUTTON -->
                ${buttonText && buttonUrl ? `
                  <tr>
                    <td align="center" style="padding: 0 40px 48px 40px;">
                      <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 14px; letter-spacing: -0.2px; text-align: center; border: 1px solid #2563eb; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);">
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                ` : ''}

                <!-- SEPARATOR -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="border-top: 1px solid #1e293b;"></div>
                  </td>
                </tr>

                <!-- FEATURE SECTION 1 -->
                <tr>
                  <td style="padding: 48px 48px 24px 48px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 11px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">
                            Nouveau Modèle CV
                          </span>
                          <h2 style="color: #ffffff; margin: 0 0 12px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                            L'Innovateur 3.0
                          </h2>
                          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                            Un design moderne et structuré, spécialement conçu pour les développeurs, ingénieurs et métiers du numérique. Optimisé pour passer les filtres ATS avec brio.
                          </p>
                        </td>
                      </tr>
                      <!-- PREVIEW DIAGRAM IN PURE CSS -->
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; max-width: 480px;">
                            <tr>
                              <!-- Sidebar CV -->
                              <td width="30%" bgcolor="#0f172a" style="padding: 20px; border-right: 1px solid #1e293b; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%; margin-bottom: 16px;"></div>
                                <div style="width: 100%; height: 6px; background-color: #334155; border-radius: 3px; margin-bottom: 8px;"></div>
                                <div style="width: 80%; height: 6px; background-color: #334155; border-radius: 3px; margin-bottom: 24px;"></div>
                                <div style="width: 100%; height: 4px; background-color: #1e293b; border-radius: 2px; margin-bottom: 6px;"></div>
                                <div style="width: 70%; height: 4px; background-color: #1e293b; border-radius: 2px; margin-bottom: 6px;"></div>
                                <div style="width: 90%; height: 4px; background-color: #1e293b; border-radius: 2px;"></div>
                              </td>
                              <!-- Main content CV -->
                              <td width="70%" style="padding: 20px; vertical-align: top;">
                                <div style="width: 60%; height: 10px; background-color: #ffffff; border-radius: 5px; margin-bottom: 8px;"></div>
                                <div style="width: 40%; height: 6px; background-color: #2563eb; border-radius: 3px; margin-bottom: 24px;"></div>
                                
                                <div style="width: 100%; height: 5px; background-color: #1e293b; border-radius: 2px; margin-bottom: 8px;"></div>
                                <div style="width: 95%; height: 5px; background-color: #1e293b; border-radius: 2px; margin-bottom: 8px;"></div>
                                <div style="width: 80%; height: 5px; background-color: #1e293b; border-radius: 2px;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ${buttonText && buttonUrl ? `
                        <tr>
                          <td>
                            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #1e293b; color: #ffffff; border: 1px solid #334155; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 9999px; font-size: 13px; text-align: center;">
                              Essayer le modèle →
                            </a>
                          </td>
                        </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 48px 40px; background-color: #090d16;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 1.5px;">
                      JobSira Premium
                    </p>
                    <p style="margin: 0 0 24px 0; font-size: 11px; color: #64748b; line-height: 1.6; max-width: 400px;">
                      Cet e-mail est une communication exclusive de JobSira. Rejoignez le futur du recrutement.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #475569;">
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

export function generateDreamforceEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b0f19; ${BASE_STYLES} width: 100% !important;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0b0f19" style="padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
                <!-- HEADER LOGO -->
                <tr>
                  <td style="padding: 32px 40px 24px 40px; background: linear-gradient(135deg, #090d16 0%, #0f172a 100%); border-bottom: 1px solid #1e293b;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">JobSira<span style="color: #2563eb;">.</span></span>
                        </td>
                        <td align="right">
                          <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px;">Édition Spéciale</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- HERO SECTION: TWO COLUMNS (Dreamforce style) -->
                <tr>
                  <td style="background: linear-gradient(135deg, #090d16 0%, #1e3a8a 100%); padding: 48px 40px; border-bottom: 1px solid #1e293b;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left column: Text & CTA -->
                        <td width="55%" style="vertical-align: middle; padding-right: 20px;">
                          <span style="font-size: 11px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 12px;">Événement Tech</span>
                          <h1 style="color: #ffffff; margin: 0 0 16px 0; font-size: 26px; font-weight: 900; line-height: 1.2; letter-spacing: -0.5px;">
                            ${subject}
                          </h1>
                          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
                            Découvrez le futur du recrutement augmenté par IA et donnez un coup de boost décisif à votre carrière.
                          </p>
                          ${buttonText && buttonUrl ? `
                            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #090d16; font-weight: 800; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);">
                              ${buttonText}
                            </a>
                          ` : ''}
                        </td>
                        <!-- Right column: CSS Dashboard Graphic -->
                        <td width="45%" style="vertical-align: middle;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(15, 23, 42, 0.6); border: 1.5px solid #2563eb; border-radius: 16px; padding: 16px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);">
                            <tr>
                              <td colspan="2" style="padding-bottom: 12px;">
                                <div style="display: inline-block; width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; margin-right: 4px;"></div>
                                <div style="display: inline-block; width: 8px; height: 8px; background-color: #eab308; border-radius: 50%; margin-right: 4px;"></div>
                                <div style="display: inline-block; width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%;"></div>
                              </td>
                            </tr>
                            <tr>
                              <td width="30%" style="vertical-align: top; padding-right: 10px;">
                                <div style="width: 28px; height: 28px; background-color: #2563eb; border-radius: 50%; margin-bottom: 8px;"></div>
                                <div style="width: 100%; height: 4px; background-color: #334155; border-radius: 2px; margin-bottom: 4px;"></div>
                                <div style="width: 70%; height: 4px; background-color: #334155; border-radius: 2px;"></div>
                              </td>
                              <td width="70%" style="vertical-align: top;">
                                <div style="width: 90%; height: 6px; background-color: #ffffff; border-radius: 3px; margin-bottom: 8px;"></div>
                                <div style="width: 50%; height: 4px; background-color: #3b82f6; border-radius: 2px; margin-bottom: 12px;"></div>
                                <div style="width: 100%; height: 3px; background-color: #1e293b; border-radius: 1.5px; margin-bottom: 4px;"></div>
                                <div style="width: 80%; height: 3px; background-color: #1e293b; border-radius: 1.5px;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- SUBSECTION: LIST WITH BLUE SPARKS (Dreamforce inspired) -->
                <tr>
                  <td style="padding: 48px 40px 32px 40px;">
                    <h2 style="color: #ffffff; margin: 0 0 24px 0; font-size: 20px; font-weight: 800; text-align: center; letter-spacing: -0.5px;">
                      Tout Jobsira. Sans compromis.
                    </h2>
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <!-- Bullet item 1 -->
                      <tr>
                        <td width="32" style="vertical-align: top; padding-bottom: 20px; font-size: 16px; color: #3b82f6; font-weight: bold;">✦</td>
                        <td style="vertical-align: top; padding-bottom: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.5;">
                          <strong style="color: #ffffff;">Accès prioritaire</strong> aux nouveaux templates professionnels de type A4 standardisés ATS.
                        </td>
                      </tr>
                      <!-- Bullet item 2 -->
                      <tr>
                        <td width="32" style="vertical-align: top; padding-bottom: 20px; font-size: 16px; color: #3b82f6; font-weight: bold;">✦</td>
                        <td style="vertical-align: top; padding-bottom: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.5;">
                          <strong style="color: #ffffff;">Optimisation par l'IA</strong> de chaque section de votre CV pour un ciblage précis du recruteur.
                        </td>
                      </tr>
                      <!-- Bullet item 3 -->
                      <tr>
                        <td width="32" style="vertical-align: top; padding-bottom: 20px; font-size: 16px; color: #3b82f6; font-weight: bold;">✦</td>
                        <td style="vertical-align: top; padding-bottom: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.5;">
                          <strong style="color: #ffffff;">Assistance premium 24/7</strong> pour toutes vos candidatures et relectures.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- ANIMA STYLE CARD STACK -->
                <tr>
                  <td style="padding: 0 40px 48px 40px;">
                    <div style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                      ${formatDarkMessage(message)}
                    </div>

                    <!-- Card 1 (Anima style layout) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; margin-bottom: 16px; overflow: hidden;">
                      <tr>
                        <!-- Miniature illustration -->
                        <td width="35%" bgcolor="#0f172a" style="padding: 20px; text-align: center; vertical-align: middle; border-right: 1px solid #334155;">
                          <div style="font-size: 28px; line-height: 1; margin-bottom: 8px;">🌍</div>
                          <span style="font-size: 10px; font-weight: 800; color: #3b82f6; text-transform: uppercase; tracking: 1px;">Traduction CV</span>
                        </td>
                        <!-- Card body -->
                        <td width="65%" style="padding: 20px; vertical-align: top;">
                          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #ffffff;">Exportez à l'international</h3>
                          <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.4;">
                            Traduisez automatiquement et fidèlement votre CV en anglais, espagnol ou allemand en un clic.
                          </p>
                          <a href="${buttonUrl || '#'}" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Essayer maintenant →</a>
                        </td>
                      </tr>
                    </table>

                    <!-- Card 2 (Anima style layout) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden;">
                      <tr>
                        <!-- Miniature illustration -->
                        <td width="35%" bgcolor="#0f172a" style="padding: 20px; text-align: center; vertical-align: middle; border-right: 1px solid #334155;">
                          <div style="font-size: 28px; line-height: 1; margin-bottom: 8px;">🖼️</div>
                          <span style="font-size: 10px; font-weight: 800; color: #3b82f6; text-transform: uppercase; tracking: 1px;">Photo Pro</span>
                        </td>
                        <!-- Card body -->
                        <td width="65%" style="padding: 20px; vertical-align: top;">
                          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #ffffff;">Retrait d'arrière-plan</h3>
                          <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.4;">
                            Détourez proprement votre photo de profil pour un rendu professionnel et soigné sur votre CV.
                          </p>
                          <a href="${buttonUrl || '#'}" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Essayer maintenant →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 48px 40px; background-color: #090d16; border-top: 1px solid #1e293b;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 1.5px;">
                      JobSira Premium
                    </p>
                    <p style="margin: 0 0 24px 0; font-size: 11px; color: #64748b; line-height: 1.6; max-width: 400px;">
                      Vous recevez cet e-mail suite à votre inscription sur JobSira.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #475569;">
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
    case 'artlist':
      return generateArtlistEmail(props);
    case 'dreamforce':
      return generateDreamforceEmail(props);
    case 'annonce':
    default:
      return generateAnnouncementEmail(props);
  }
}
