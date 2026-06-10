type EmailTemplateProps = {
  subject: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
};

// Formateur de message : convertit les sauts de ligne en <br> ou paragraphes
const formatMessage = (msg: string) => {
  return msg.split('\n').map(p => `<p style="margin: 0 0 16px 0;">${p}</p>`).join('');
};

const BASE_STYLES = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #334155;
`;

export function generateAnnouncementEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 40px 20px; background-color: #f8fafc; ${BASE_STYLES}">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- HEADER -->
          <div style="background-color: #2563eb; padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">JOBSIRA</h1>
          </div>
          
          <!-- BODY -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0f172a; margin: 0 0 24px 0; font-size: 20px;">${subject}</h2>
            
            <div style="font-size: 16px; color: #475569;">
              ${formatMessage(message)}
            </div>
            
            ${buttonText && buttonUrl ? `
              <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                <a href="${buttonUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px;">
                  ${buttonText}
                </a>
              </div>
            ` : ''}
          </div>
          
          <!-- FOOTER -->
          <div style="background-color: #f1f5f9; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              L'équipe Jobsira<br>
              <a href="https://jobsira.com" style="color: #2563eb; text-decoration: none;">www.jobsira.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generatePromoEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 40px 20px; background-color: #0f172a; ${BASE_STYLES}">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 4px solid #3b82f6;">
          
          <!-- HEADER (FLASHY) -->
          <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase;">🔥 JOBSIRA</h1>
          </div>
          
          <!-- BODY -->
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #0f172a; margin: 0 0 24px 0; font-size: 22px; font-weight: 800;">${subject}</h2>
            
            <div style="font-size: 16px; color: #334155; line-height: 1.8;">
              ${formatMessage(message)}
            </div>
            
            ${buttonText && buttonUrl ? `
              <div style="margin-top: 40px;">
                <a href="${buttonUrl}" style="display: inline-block; background-color: #f59e0b; color: #ffffff; font-weight: 900; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                  ${buttonText}
                </a>
              </div>
            ` : ''}
          </div>
          
          <!-- FOOTER -->
          <div style="padding: 24px 30px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              Cet e-mail vous a été envoyé car vous êtes abonné aux nouveautés Jobsira.<br>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateMinimalEmail({ subject, message, buttonText, buttonUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 20px; background-color: #ffffff; ${BASE_STYLES}">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827; margin: 0 0 30px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">${subject}</h2>
          
          <div style="font-size: 15px; color: #374151;">
            ${formatMessage(message)}
          </div>
          
          ${buttonText && buttonUrl ? `
            <div style="margin-top: 30px;">
              <a href="${buttonUrl}" style="color: #2563eb; font-weight: bold; text-decoration: underline; font-size: 15px;">
                ➔ ${buttonText}
              </a>
            </div>
          ` : ''}
          
          <div style="margin-top: 60px; font-size: 12px; color: #9ca3af;">
            <p>
              --<br>
              <strong>Jobsira</strong><br>
              <a href="https://jobsira.com" style="color: #9ca3af;">jobsira.com</a>
            </p>
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
