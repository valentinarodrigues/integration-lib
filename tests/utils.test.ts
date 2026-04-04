import { scrubPii } from '../src/utils/scrub';
import { callWithRetry } from '../src/utils/retry';
import { sha256 } from '../src/utils/checksum';

describe('scrubPii', () => {
  it('redacts known PII fields', () => {
    const record = { name: 'John', email: 'john@example.com', amount: 100 };
    const result = scrubPii(record);
    expect(result.email).toBe('[REDACTED]');
    expect(result.name).toBe('John');
    expect(result.amount).toBe(100);
  });

  it('redacts nested PII fields', () => {
    const record = { user: { email: 'john@example.com', id: '123' } };
    const result = scrubPii(record);
    expect((result.user as Record<string, unknown>).email).toBe('[REDACTED]');
  });

  it('redacts additional fields passed in', () => {
    const record = { customField: 'sensitive', name: 'ok' };
    const result = scrubPii(record, ['customField']);
    expect(result.customField).toBe('[REDACTED]');
  });
});

describe('callWithRetry', () => {
  it('returns result on first success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await callWithRetry(fn, { maxAttempts: 3, shouldRetry: () => true });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries up to maxAttempts', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValue('ok');
    const result = await callWithRetry(fn, { maxAttempts: 3, baseDelayMs: 0, shouldRetry: () => true });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws after exhausting retries', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('fail'));
    await expect(callWithRetry(fn, { maxAttempts: 2, baseDelayMs: 0, shouldRetry: () => true })).rejects.toThrow('fail');
  });
});

describe('sha256', () => {
  it('returns consistent hash', () => {
    expect(sha256('hello')).toBe(sha256('hello'));
  });

  it('returns different hashes for different inputs', () => {
    expect(sha256('hello')).not.toBe(sha256('world'));
  });
});
