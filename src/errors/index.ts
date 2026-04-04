export class ValidationError extends Error {
  public readonly fields: Record<string, string[]>;

  constructor(fields: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class UpstreamApiError extends Error {
  public readonly statusCode: number;
  public readonly upstream: string;

  constructor(statusCode: number, upstream: string, message: string) {
    super(message);
    this.name = 'UpstreamApiError';
    this.statusCode = statusCode;
    this.upstream = upstream;
  }

  get isRetryable(): boolean {
    return this.statusCode >= 500;
  }
}

export class IdempotencyConflictError extends Error {
  public readonly idempotencyKey: string;

  constructor(idempotencyKey: string) {
    super(`Duplicate event: ${idempotencyKey}`);
    this.name = 'IdempotencyConflictError';
    this.idempotencyKey = idempotencyKey;
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}
