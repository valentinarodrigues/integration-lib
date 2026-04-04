const DEFAULT_PII_FIELDS = new Set([
  'ssn', 'email', 'phone', 'dob', 'accountNumber',
  'password', 'token', 'secret', 'creditCard', 'bankAccount',
]);

export function scrubPii<T extends Record<string, unknown>>(
  record: T,
  additionalFields: string[] = []
): T {
  const fieldsToScrub = new Set([...DEFAULT_PII_FIELDS, ...additionalFields]);

  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if (fieldsToScrub.has(key)) return [key, '[REDACTED]'];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return [key, scrubPii(value as Record<string, unknown>, additionalFields)];
      }
      return [key, value];
    })
  ) as T;
}
