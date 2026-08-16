/**
 * Client HTTP pour communiquer avec le micro-service Python (Email Service)
 * sur le réseau interne.
 */

interface Recipient {
  email: string;
  name?: string;
}

interface EmailPayload {
  recipient: Recipient;
  templateId?: string;
  data?: Record<string, any>;
  html?: string;
  subject?: string;
}

export async function sendEmailViaService(payload: EmailPayload) {
  // En dev, utiliser localhost:3002. En prod, l'URL interne du container.
  const serviceUrl = process.env.EMAIL_SERVICE_URL || 'http://localhost:3002';
  const internalApiKey = process.env.INTERNAL_API_KEY || 'dev-secret-key-12345';

  try {
    const response = await fetch(`${serviceUrl}/v1/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': internalApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Email Service Error (${response.status}): ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send email via micro-service:', error);
    throw error;
  }
}
