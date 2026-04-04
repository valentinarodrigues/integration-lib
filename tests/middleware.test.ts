import { withValidation } from '../src/middleware/validate';
import { VendorPayloadSchema } from '../src/schemas/vendor';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';

const mockContext = { awsRequestId: 'test-request-id' } as Context;

const mockEvent = (body: unknown): APIGatewayProxyEvent =>
  ({ body: JSON.stringify(body), headers: {}, httpMethod: 'POST', requestContext: {} } as unknown as APIGatewayProxyEvent);

describe('withValidation', () => {
  const validBody = {
    customerId: 'AB12345678',
    amount: 50,
    eventType: 'PURCHASE',
    timestamp: new Date().toISOString(),
  };

  it('calls handler with valid body', async () => {
    const handler = withValidation(VendorPayloadSchema, async (body) => ({ received: body.customerId }));
    const res = await handler(mockEvent(validBody), mockContext, jest.fn());
    expect(res?.statusCode).toBe(200);
    expect(JSON.parse(res?.body ?? '{}')).toEqual({ received: 'AB12345678' });
  });

  it('returns 400 for invalid body', async () => {
    const handler = withValidation(VendorPayloadSchema, async () => ({}));
    const res = await handler(mockEvent({ invalid: true }), mockContext, jest.fn());
    expect(res?.statusCode).toBe(400);
  });

  it('returns 400 for invalid JSON', async () => {
    const handler = withValidation(VendorPayloadSchema, async () => ({}));
    const event = { ...mockEvent({}), body: 'not-json' } as unknown as APIGatewayProxyEvent;
    const res = await handler(event, mockContext, jest.fn());
    expect(res?.statusCode).toBe(400);
  });
});
