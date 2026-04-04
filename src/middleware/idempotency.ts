import type { Middleware } from './compose';
import { DynamoDBClient, PutItemCommand, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { respond } from '../http/response';

export interface IdempotencyOptions {
  tableName: string;
  ttlSeconds?: number;
  getKey?: (event: Parameters<Middleware>[0]) => string;
}

export function withIdempotency(options: IdempotencyOptions): Middleware {
  const { tableName, ttlSeconds = 86400, getKey } = options;
  const dynamo = new DynamoDBClient({});

  return async (event, _context, next) => {
    const key = getKey
      ? getKey(event)
      : event.headers['x-idempotency-key'] ?? event.requestContext.requestId;

    if (!key) return next();

    try {
      await dynamo.send(new PutItemCommand({
        TableName: tableName,
        Item: {
          pk: { S: key },
          ttl: { N: String(Math.floor(Date.now() / 1000) + ttlSeconds) },
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      }));
    } catch (e) {
      if (e instanceof ConditionalCheckFailedException) {
        return respond.conflict(`Duplicate request: ${key}`);
      }
      throw e;
    }

    return next();
  };
}
