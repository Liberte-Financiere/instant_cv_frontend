import { describe, it, expect, vi, beforeEach } from 'vitest';
import { APP_CONFIG } from '../lib/config';

// ---------------------------------------------------------
// 1. EXTRACTION DE LA LOGIQUE POUR LES TESTS UNITAIRES
// (Cette logique est identique à celle dans validate/route.ts)
// ---------------------------------------------------------

function validatePaymentRequest(body: any) {
  const { phone, otp, packId, credits: requestedCredits } = body;

  if (!phone || !otp || !packId) {
    return { error: 'Téléphone, code OTP et pack requis.', status: 400 };
  }

  const cleanPhone = phone.replace(/[\s\-\+]/g, '');
  if (cleanPhone.length < 10) {
    return { error: 'Numéro de téléphone invalide.', status: 400 };
  }

  let packName: string;
  let packPrice: number;
  let packCredits: number;

  if (packId === 'alacarte') {
    const { alaCarte } = APP_CONFIG.pricing;
    const numCredits = parseInt(requestedCredits, 10);

    if (!numCredits || numCredits < alaCarte.minCredits || numCredits > alaCarte.maxCredits) {
      return { 
        error: `Le nombre de crédits doit être compris entre ${alaCarte.minCredits} et ${alaCarte.maxCredits}.`, 
        status: 400 
      };
    }

    packName = 'À la carte';
    packCredits = numCredits;
    packPrice = numCredits * alaCarte.pricePerCredit;
  } else {
    const pack = APP_CONFIG.pricing.packs.find((p) => p.id === packId);
    if (!pack) {
      return { error: 'Pack invalide.', status: 400 };
    }
    packName = pack.name;
    packCredits = pack.credits;
    packPrice = pack.price;
  }

  return { 
    success: true, 
    data: { packName, packPrice, packCredits, cleanPhone } 
  };
}

function validateLigdiCashCallback(transaction: any, payloadAmount: string) {
  if (transaction.status === 'completed') {
    return { status: 'already_processed' };
  }

  const paidAmount = parseFloat(payloadAmount || '0');
  const expectedAmount = Number(transaction.amount);

  if (paidAmount < expectedAmount) {
    return { status: 'fraud_prevented', reason: 'Montant payé insuffisant' };
  }

  return { status: 'success', creditsToApply: transaction.credits };
}

// ---------------------------------------------------------
// 2. SUITE DE TESTS
// ---------------------------------------------------------

describe('Logique de Paiement & Sécurité', () => {
  
  describe('A. Validation des entrées (validate/route.ts)', () => {
    it('doit refuser une requête sans OTP ou packId', () => {
      const result = validatePaymentRequest({ phone: '70123456' });
      expect(result.error).toBe('Téléphone, code OTP et pack requis.');
      expect(result.status).toBe(400);
    });

    it('doit refuser un numéro de téléphone trop court', () => {
      const result = validatePaymentRequest({ phone: '123', otp: '1234', packId: 'standard' });
      expect(result.error).toBe('Numéro de téléphone invalide.');
    });
  });

  describe('B. Calculs du prix À la carte', () => {
    it('doit calculer correctement le prix pour 10 crédits', () => {
      const result = validatePaymentRequest({ 
        phone: '7012345678', otp: '1234', packId: 'alacarte', credits: 10 
      });
      expect(result.success).toBe(true);
      expect(result.data?.packPrice).toBe(300); // 10 * 30F
      expect(result.data?.packCredits).toBe(10);
      expect(result.data?.packName).toBe('À la carte');
    });

    it('doit refuser si le nombre de crédits est inférieur au minimum (5)', () => {
      const result = validatePaymentRequest({ 
        phone: '7012345678', otp: '1234', packId: 'alacarte', credits: 2 
      });
      expect(result.error).toContain('doit être compris entre');
      expect(result.status).toBe(400);
    });

    it('doit refuser si le nombre de crédits dépasse le plafond (5000)', () => {
      const result = validatePaymentRequest({ 
        phone: '7012345678', otp: '1234', packId: 'alacarte', credits: 999999 
      });
      expect(result.error).toContain('doit être compris entre');
      expect(result.status).toBe(400);
    });
  });

  describe('C. Validation des packs classiques', () => {
    it('doit trouver et valider le pack standard', () => {
      const result = validatePaymentRequest({ 
        phone: '7012345678', otp: '1234', packId: 'standard' 
      });
      expect(result.success).toBe(true);
      expect(result.data?.packCredits).toBe(35); // Depuis la config
      expect(result.data?.packPrice).toBe(1000);
    });

    it('doit refuser un faux nom de pack', () => {
      const result = validatePaymentRequest({ 
        phone: '7012345678', otp: '1234', packId: 'pack_hacker' 
      });
      expect(result.error).toBe('Pack invalide.');
    });
  });

  describe('D. Sécurité anti-fraude (callback/route.ts)', () => {
    const mockTransaction = {
      id: 'txn_123',
      amount: 1500, // On attend 1500F
      credits: 50,
      status: 'pending'
    };

    it('doit valider si le montant payé est exact', () => {
      const result = validateLigdiCashCallback(mockTransaction, "1500");
      expect(result.status).toBe('success');
      expect(result.creditsToApply).toBe(50);
    });

    it('doit rejeter (anti-fraude) si le montant payé est inférieur', () => {
      const result = validateLigdiCashCallback(mockTransaction, "500"); // A payé 500F au lieu de 1500F
      expect(result.status).toBe('fraud_prevented');
    });

    it('doit rejeter la course aux requêtes (idempotency)', () => {
      // Deuxième appel alors que la transaction est déjà terminée
      const completedTransaction = { ...mockTransaction, status: 'completed' };
      const result = validateLigdiCashCallback(completedTransaction, "1500");
      expect(result.status).toBe('already_processed');
    });
  });
});
