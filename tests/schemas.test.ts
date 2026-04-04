import { VendorPayloadSchema } from '../src/schemas/vendor';

const validPayload = {
  customerId: 'AB12345678',
  amount: 99.99,
  eventType: 'PURCHASE' as const,
  timestamp: new Date().toISOString(),
};

describe('VendorPayloadSchema', () => {
  it('accepts a valid payload', () => {
    expect(VendorPayloadSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects negative amounts', () => {
    const result = VendorPayloadSchema.safeParse({ ...validPayload, amount: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid customer ID format', () => {
    const result = VendorPayloadSchema.safeParse({ ...validPayload, customerId: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects unknown event types', () => {
    const result = VendorPayloadSchema.safeParse({ ...validPayload, eventType: 'UNKNOWN' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid timestamps', () => {
    const result = VendorPayloadSchema.safeParse({ ...validPayload, timestamp: 'not-a-date' });
    expect(result.success).toBe(false);
  });
});
