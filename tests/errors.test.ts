import { ValidationError, UpstreamApiError, IdempotencyConflictError } from '../src/errors';

describe('UpstreamApiError', () => {
  it('marks 5xx as retryable', () => {
    const err = new UpstreamApiError(503, 'api.example.com', 'Service Unavailable');
    expect(err.isRetryable).toBe(true);
  });

  it('marks 4xx as not retryable', () => {
    const err = new UpstreamApiError(400, 'api.example.com', 'Bad Request');
    expect(err.isRetryable).toBe(false);
  });
});

describe('ValidationError', () => {
  it('stores field errors', () => {
    const err = new ValidationError({ email: ['Invalid email'] });
    expect(err.fields.email).toContain('Invalid email');
  });
});

describe('IdempotencyConflictError', () => {
  it('stores idempotency key', () => {
    const err = new IdempotencyConflictError('key-123');
    expect(err.idempotencyKey).toBe('key-123');
  });
});
