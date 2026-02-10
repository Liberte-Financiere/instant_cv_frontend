/**
 * LigdiCash API Client
 * 
 * Documentation: https://ligdicash.com/
 * 
 * Environment Variables:
 * - LIGDICASH_API_KEY: Your API Key
 * - LIGDICASH_API_TOKEN: Your API Token
 * - LIGDICASH_BASE_URL: API base URL (sandbox or production)
 * - NEXT_PUBLIC_APP_URL: Your app URL for callbacks
 */

// Types
export interface LigdiCashConfig {
  apiKey: string;
  apiToken: string;
  baseUrl: string;
}

export interface PayinRequest {
  amount: number;
  description: string;
  customer_phone?: string;
  customer_email?: string;
  customer_name?: string;
  custom_data?: Record<string, string>;
}

export interface PayinResponse {
  success: boolean;
  response_code: string;
  response_text: string;
  token?: string;
  redirect_url?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  amount?: number;
  transaction_id?: string;
  custom_data?: Record<string, string>;
}

// Config
const getConfig = (): LigdiCashConfig => {
  const apiKey = process.env.LIGDICASH_API_KEY;
  const apiToken = process.env.LIGDICASH_API_TOKEN;
  const baseUrl = process.env.LIGDICASH_BASE_URL || 'https://app.ligdicash.com/pay/v01';

  if (!apiKey || !apiToken) {
    throw new Error('LigdiCash API credentials not configured');
  }

  return { apiKey, apiToken, baseUrl };
};

// Headers
const getHeaders = (config: LigdiCashConfig) => ({
  'Content-Type': 'application/json',
  'Apikey': config.apiKey,
  'Authorization': `Bearer ${config.apiToken}`,
  'Accept': 'application/json',
});

/**
 * Initiate a Payin (collect payment from customer)
 */
export async function initiatePayin(request: PayinRequest): Promise<PayinResponse> {
  const config = getConfig();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const payload = {
    commande: {
      invoice: {
        items: [
          {
            name: request.description,
            description: 'Abonnement InstantCV Premium',
            quantity: 1,
            unit_price: request.amount.toString(),
            total_price: request.amount.toString(),
          }
        ],
        total_amount: request.amount.toString(),
        devise: 'XOF',
        description: request.description,
      },
      store: {
        name: 'InstantCV',
        website_url: appUrl,
      },
      actions: {
        cancel_url: `${appUrl}/payment/cancel`,
        return_url: `${appUrl}/payment/success`,
        callback_url: `${appUrl}/api/payment/callback`,
      },
      custom_data: {
        ...request.custom_data,
      },
    },
    customer: {
      name: request.customer_name || 'Client',
      email: request.customer_email || '',
      phone: request.customer_phone || '',
    },
  };

  console.log('[LigdiCash] Initiating payin:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${config.baseUrl}/redirect/checkout-invoice/create`, {
      method: 'POST',
      headers: getHeaders(config),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('[LigdiCash] Payin response:', data);

    if (!response.ok) {
      return {
        success: false,
        response_code: 'ERROR',
        response_text: data.message || 'Payment initiation failed',
      };
    }

    return {
      success: true,
      response_code: data.response_code || '00',
      response_text: data.response_text || 'Success',
      token: data.token,
      redirect_url: data.redirect_url || data.response_text,
    };

  } catch (error: any) {
    console.error('[LigdiCash] Error:', error);
    return {
      success: false,
      response_code: 'NETWORK_ERROR',
      response_text: error.message || 'Network error',
    };
  }
}

/**
 * Get payment status by token
 */
export async function getPaymentStatus(token: string): Promise<PaymentStatus> {
  const config = getConfig();

  try {
    const response = await fetch(`${config.baseUrl}/redirect/checkout-invoice/${token}/status`, {
      method: 'GET',
      headers: getHeaders(config),
    });

    const data = await response.json();

    if (!response.ok || data.status === 'pending') {
      return { status: 'pending' };
    }

    if (data.status === 'completed' || data.response_code === '00') {
      return {
        status: 'completed',
        amount: parseInt(data.amount) || 0,
        transaction_id: data.transaction_id || token,
        custom_data: data.custom_data,
      };
    }

    return { status: 'failed' };

  } catch (error) {
    console.error('[LigdiCash] Status check error:', error);
    return { status: 'pending' };
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
    description: 'Abonnement Premium Mensuel',
  },
  yearly: {
    id: 'yearly',
    name: 'Annuel',
    amount: 15000, // FCFA (économie de 37%)
    duration: 365, // days
    description: 'Abonnement Premium Annuel',
    savings: '37%',
  },
  lifetime: {
    id: 'lifetime',
    name: 'À vie',
    amount: 25000, // FCFA
    duration: 36500, // ~100 years
    description: 'Accès Premium Illimité',
  },
} as const;

export type PlanType = keyof typeof PRICING_PLANS;
