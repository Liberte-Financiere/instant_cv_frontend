type EmailTemplateProps = {
  subject: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
};

const formatMessage = (msg: string) => {
  return msg
    .split('\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">${p}</p>`)
    .join('');
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
