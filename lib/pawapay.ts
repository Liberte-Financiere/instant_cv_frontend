/**
 * PawaPay API Client
 * 
 * Documentation: https://docs.pawapay.io/
 * 
 * Environment Variables:
 * - PAWAPAY_API_TOKEN: Your API Token (Bearer token)
 * - PAWAPAY_BASE_URL: API base URL
 * - NEXT_PUBLIC_APP_URL: Your app URL for callbacks
 */

// Types
export interface PawaPayConfig {
  apiToken: string;
  baseUrl: string;
}

export interface DepositRequest {
  depositId: string;
  amount: string;
  currency: string;
  correspondent: string; // 'ORANGE_BFA' | 'MOOV_BFA'
  payer: {
    type: 'MSISDN';
    address: {
      value: string; // Phone number in international format
    };
  };
  customerTimestamp: string;
  statementDescription: string;
}

export interface DepositResponse {
  depositId: string;
  status: 'ACCEPTED' | 'REJECTED';
  created?: string;
  rejectionReason?: {
    rejectionCode: string;
    rejectionMessage: string;
  };
}

export interface DepositStatus {
  depositId: string;
  status: 'ACCEPTED' | 'SUBMITTED' | 'COMPLETED' | 'FAILED';
  amount?: string;
  currency?: string;
  correspondent?: string;
  failureReason?: {
    failureCode: string;
    failureMessage: string;
  };
}

// Config
const getConfig = (): PawaPayConfig => {
  const apiToken = process.env.PAWAPAY_API_TOKEN;
  // Production: https://api.pawapay.io
  // Sandbox: https://api.sandbox.pawapay.io
  const baseUrl = process.env.PAWAPAY_BASE_URL || 'https://api.sandbox.pawapay.io';

  if (!apiToken) {
    throw new Error('PAWAPAY_API_TOKEN not configured');
  }

  return { apiToken, baseUrl };
};

// Headers
const getHeaders = (config: PawaPayConfig) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${config.apiToken}`,
});

/**
 * Generate unique deposit ID
 */
export function generateDepositId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format phone number to international format for Burkina Faso
 * Input: 70123456 or 0070123456 or +22670123456
 * Output: 22670123456
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, '');
  
  // Add Burkina Faso country code if not present
  if (!cleaned.startsWith('226')) {
    cleaned = '226' + cleaned;
  }
  
  return cleaned;
}

/**
 * Detect mobile operator from phone number
 */
export function detectOperator(phone: string): 'ORANGE_BFA' | 'MOOV_BFA' {
  const formatted = formatPhoneNumber(phone);
  const prefix = formatted.substring(3, 5); // Get first 2 digits after country code
  
  // Orange: 05, 06, 07, 54, 55, 56, 57, 58, 59
  // Moov: 01, 02, 03, 04, 51, 52, 53, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79
  const orangePrefixes = ['05', '06', '07', '54', '55', '56', '57', '58', '59'];
  
  if (orangePrefixes.includes(prefix)) {
    return 'ORANGE_BFA';
  }
  return 'MOOV_BFA';
}

/**
 * Initiate a deposit (collect payment from customer)
 */
export async function initiateDeposit(
  phone: string,
  amount: number,
  description: string,
  metadata?: Record<string, string>
): Promise<DepositResponse & { depositId: string }> {
  const config = getConfig();
  const depositId = generateDepositId();
  const formattedPhone = formatPhoneNumber(phone);
  const correspondent = detectOperator(phone);

  const payload: DepositRequest = {
    depositId,
    amount: amount.toString(),
    currency: 'XOF',
    correspondent,
    payer: {
      type: 'MSISDN',
      address: {
        value: formattedPhone,
      },
    },
    customerTimestamp: new Date().toISOString(),
    statementDescription: description.substring(0, 22), // Max 22 chars
  };

  console.log('[PawaPay] Initiating deposit:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${config.baseUrl}/deposits`, {
      method: 'POST',
      headers: getHeaders(config),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('[PawaPay] Deposit response:', data);

    if (!response.ok || data.status === 'REJECTED') {
      return {
        depositId,
        status: 'REJECTED',
        rejectionReason: data.rejectionReason || {
          rejectionCode: 'UNKNOWN',
          rejectionMessage: data.message || 'Deposit rejected',
        },
      };
    }

    return {
      depositId,
      status: 'ACCEPTED',
      created: data.created,
    };

  } catch (error: any) {
    console.error('[PawaPay] Error:', error);
    return {
      depositId,
      status: 'REJECTED',
      rejectionReason: {
        rejectionCode: 'NETWORK_ERROR',
        rejectionMessage: error.message || 'Network error',
      },
    };
  }
}

/**
 * Get deposit status
 */
export async function getDepositStatus(depositId: string): Promise<DepositStatus> {
  const config = getConfig();

  try {
    const response = await fetch(`${config.baseUrl}/deposits/${depositId}`, {
      method: 'GET',
      headers: getHeaders(config),
    });

    const data = await response.json();

    return {
      depositId: data.depositId,
      status: data.status || 'SUBMITTED',
      amount: data.amount,
      currency: data.currency,
      correspondent: data.correspondent,
      failureReason: data.failureReason,
    };

  } catch (error) {
    console.error('[PawaPay] Status check error:', error);
    return {
      depositId,
      status: 'SUBMITTED',
    };
  }
}

/**
 * Pricing Plans
 */
export const PRICING_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Mensuel',
    amount: 2000, // FCFA
    duration: 30, // days
    description: 'Premium Mensuel',
  },
  yearly: {
    id: 'yearly',
    name: 'Annuel',
    amount: 15000, // FCFA
    duration: 365, // days
    description: 'Premium Annuel',
    savings: '37%',
  },
  lifetime: {
    id: 'lifetime',
    name: 'À vie',
    amount: 25000, // FCFA
    duration: 36500, // ~100 years
    description: 'Premium Illimité',
  },
} as const;

export type PlanType = keyof typeof PRICING_PLANS;
