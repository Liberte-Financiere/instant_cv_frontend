import { describe, it, expect } from 'vitest';
import { isPaymentConfirmed, LigdiCashStatusResponse } from '@/lib/ligdicash';

/**
 * Tests for the LigdiCash payment integration.
 *
 * The API functions (validatePayment, verifyTransactionStatus) make
 * external HTTP requests and are tested via integration tests.
 * Here we test the pure utility function isPaymentConfirmed.
 */

// -- isPaymentConfirmed -----------------------------------------------------

describe('isPaymentConfirmed', () => {
  function makeStatus(overrides: Partial<LigdiCashStatusResponse> = {}): LigdiCashStatusResponse {
    return {
      date: '2024-01-01',
      response_code: '00',
      token: 'test-token',
      description: 'Payment',
      amount: '1000',
      montant: '1000',
      response_text: null,
      status: 'completed',
      custom_data: [],
      operator_name: 'Orange',
      operator_id: '123',
      customer: '+22670000000',
      transaction_id: 'txn-1',
      external_id: null,
      ...overrides,
    };
  }

  it('returns true for response_code "00" and status "completed"', () => {
    const status = makeStatus();
    expect(isPaymentConfirmed(status)).toBe(true);
  });

  it('returns false for non-"00" response_code', () => {
    const status = makeStatus({ response_code: '01' });
    expect(isPaymentConfirmed(status)).toBe(false);
  });

  it('returns false for status "pending"', () => {
    const status = makeStatus({ status: 'pending' });
    expect(isPaymentConfirmed(status)).toBe(false);
  });

  it('returns false for status "failed"', () => {
    const status = makeStatus({ status: 'failed' });
    expect(isPaymentConfirmed(status)).toBe(false);
  });

  it('returns false when both conditions fail', () => {
    const status = makeStatus({ response_code: '99', status: 'failed' });
    expect(isPaymentConfirmed(status)).toBe(false);
  });

  it('returns false for response_code "00" but status "pending"', () => {
    const status = makeStatus({ response_code: '00', status: 'pending' });
    expect(isPaymentConfirmed(status)).toBe(false);
  });

  it('returns false for status "completed" but wrong response_code', () => {
    const status = makeStatus({ response_code: 'XX', status: 'completed' });
    expect(isPaymentConfirmed(status)).toBe(false);
  });
});
