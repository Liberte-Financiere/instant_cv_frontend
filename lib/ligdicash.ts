/**
 * LigdiCash API Client
 * 
 * Handles all communication with the LigdiCash Payin sans redirection API.
 * Documentation: https://developers.ligdicash.com/api1/payin-sans-redirection
 */

const LIGDICASH_BASE_URL = process.env.LIGDICASH_BASE_URL || 'https://app.ligdicash.com';
const LIGDICASH_API_KEY = process.env.LIGDICASH_API_KEY || '';
const LIGDICASH_API_TOKEN = process.env.LIGDICASH_API_TOKEN || '';

const headers = {
  'Apikey': LIGDICASH_API_KEY,
  'Authorization': `Bearer ${LIGDICASH_API_TOKEN}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// ─── Types ──────────────────────────────────────

export interface LigdiCashOTPResponse {
  error: boolean;
  message: string;
}

export interface LigdiCashInvoiceItem {
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface LigdiCashValidatePayload {
  commande: {
    invoice: {
      items: LigdiCashInvoiceItem[];
      total_amount: number;
      devise: string;
      description: string;
      customer: string;
      customer_firstname: string;
      customer_lastname: string;
      customer_email: string;
      external_id: string;
      otp: string;
    };
    store: {
      name: string;
      website_url: string;
    };
    actions: {
      cancel_url: string;
      return_url: string;
      callback_url: string;
    };
    custom_data: Record<string, string>;
  };
}

export interface LigdiCashValidateResponse {
  response_code: string;
  token: string;
  response_text: string;
  description: string;
  custom_data: Record<string, string>;
  wiki: string;
}

export interface LigdiCashStatusResponse {
  date: string;
  response_code: string;
  token: string;
  description: string;
  amount: string;
  montant: string;
  response_text: string | null;
  status: string; // "completed" | "pending" | "failed"
  custom_data: Array<{
    id_invoice: number;
    keyof_customdata: string;
    valueof_customdata: string;
  }>;
  operator_name: string;
  operator_id: string;
  customer: string;
  transaction_id: string;
  external_id: string | null;
}

export interface LigdiCashCallbackPayload {
  token: string;
  transaction_id: string;
  status: string;
  amount?: string;
  operator_name?: string;
}

// ─── API Functions ──────────────────────────────

/**
 * Validate payment with OTP via Straight API (used for Orange Burkina where the user generates their own OTP via USSD)
 */
export async function validatePayment(payload: LigdiCashValidatePayload): Promise<LigdiCashValidateResponse> {
  const url = `${LIGDICASH_BASE_URL}/pay/v01/straight/checkout-invoice/create`;
  
  console.log(`[LigdiCash] 💳 Creating straight checkout invoice for ${payload.commande.invoice.customer}`);
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`[LigdiCash] ❌ Payment validation failed: ${res.status} ${text}`);
    throw new Error(`LigdiCash validation failed: ${res.status}`);
  }
  
  const data: LigdiCashValidateResponse = await res.json();
  console.log(`[LigdiCash] ✅ Payment response:`, data);
  return data;
}

/**
 * Step 3: Verify transaction status — confirms the payment was successful
 */
export async function verifyTransactionStatus(invoiceToken: string): Promise<LigdiCashStatusResponse> {
  const url = `${LIGDICASH_BASE_URL}/pay/v01/redirect/checkout-invoice/confirm/?invoiceToken=${invoiceToken}`;
  
  console.log(`[LigdiCash] 🔍 Verifying transaction status...`);
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Apikey': LIGDICASH_API_KEY,
      'Authorization': `Bearer ${LIGDICASH_API_TOKEN}`,
    },
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`[LigdiCash] ❌ Status check failed: ${res.status} ${text}`);
    throw new Error(`LigdiCash status check failed: ${res.status}`);
  }
  
  const data: LigdiCashStatusResponse = await res.json();
  console.log(`[LigdiCash] 📊 Status:`, data.status, `| Amount: ${data.amount} | Operator: ${data.operator_name}`);
  return data;
}

/**
 * Check if payment is confirmed: response_code == "00" AND status == "completed"
 */
export function isPaymentConfirmed(status: LigdiCashStatusResponse): boolean {
  return status.response_code === '00' && status.status === 'completed';
}
