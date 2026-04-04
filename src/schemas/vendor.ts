import { z } from 'zod';

export const VendorPayloadSchema = z.object({
  customerId: z.string().regex(/^[A-Z]{2}[0-9]{8}$/, 'Invalid customer ID format'),
  amount: z.number().positive('Amount must be positive'),
  eventType: z.enum(['PURCHASE', 'REFUND', 'ADJUSTMENT']),
  timestamp: z.string().datetime('Invalid ISO datetime'),
  metadata: z.record(z.string()).optional(),
});

export type VendorPayload = z.infer<typeof VendorPayloadSchema>;
