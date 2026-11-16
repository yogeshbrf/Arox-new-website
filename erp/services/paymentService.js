const logger = require('../utils/logger');
const { generatePaymentId, generateInvoiceNumber } = require('../utils/helpers');

/**
 * Mock Payment Service
 * Simulates payment processing without a real gateway
 */
class PaymentService {
  /**
   * Process a mock payment
   */
  async processPayment({ amount, method, studentId, registrationId }) {
    logger.info(`💳 Processing payment: ₹${amount} via ${method}`);

    // Simulate processing delay (500ms - 1.5s)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Simulate 95% success rate
    const isSuccess = Math.random() < 0.95;

    if (!isSuccess) {
      return {
        success: false,
        paymentId: generatePaymentId(),
        transactionId: null,
        status: 'failed',
        message: 'Payment failed. Please try again.'
      };
    }

    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;

    return {
      success: true,
      paymentId: generatePaymentId(),
      transactionId,
      invoiceNumber: generateInvoiceNumber(),
      status: 'completed',
      message: 'Payment processed successfully!'
    };
  }

  /**
   * Verify coupon or referral code
   */
  verifyCoupon(db, code, amount) {
    if (!code) return { valid: false, message: 'Please provide a code.' };
    const cleanCode = String(code).trim().toUpperCase();

    const coupon = db.prepare(`
      SELECT * FROM coupons 
      WHERE UPPER(code) = ? AND is_active = 1 
      AND (valid_from IS NULL OR valid_from <= DATE('now'))
      AND (valid_until IS NULL OR valid_until >= DATE('now'))
      AND (usage_limit IS NULL OR used_count < usage_limit)
    `).get(cleanCode);

    if (coupon) {
      if (amount < coupon.min_amount) {
        return { valid: false, message: `Minimum order amount is ₹${coupon.min_amount}.` };
      }

      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        discount = (amount * coupon.discount_value) / 100;
        if (coupon.max_discount && discount > coupon.max_discount) {
          discount = coupon.max_discount;
        }
      } else {
        discount = coupon.discount_value;
      }

      return {
        valid: true,
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          discount: Math.round(discount * 100) / 100
        },
        message: `Coupon applied! You save ₹${Math.round(discount)}.`
      };
    }

    // Fallback: Check referrals table
    const ref = db.prepare('SELECT * FROM referrals WHERE UPPER(code) = ? AND is_active = 1').get(cleanCode);
    if (ref) {
      if (ref.max_uses > 0 && ref.times_used >= ref.max_uses) {
        return { valid: false, message: `Referral code "${ref.code}" has reached its maximum usage limit.` };
      }
      const pct = ref.discount_percent || 0;
      const discount = Math.round((amount * pct) / 100);
      return {
        valid: true,
        is_referral: true,
        coupon: {
          code: ref.code,
          description: `Referral attribution: ${ref.referrer_name}`,
          discountType: 'percentage',
          discountValue: pct,
          discount: discount,
          is_referral: true
        },
        message: `Referral code "${ref.code}" applied! You save ₹${discount} (${pct}% off).`
      };
    }

    return { valid: false, message: 'Invalid or expired coupon/referral code.' };
  }

  /**
   * Increment coupon usage
   */
  useCoupon(db, code) {
    db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE code = ?').run(code);
  }
}

module.exports = new PaymentService();
