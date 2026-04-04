import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { SSMClient } from '@aws-sdk/client-ssm';

const isLocal = process.env.IS_LOCAL === 'true' || process.env.AWS_SAM_LOCAL === 'true';

const localEndpoint = (port: number) =>
  isLocal ? { endpoint: `http://localhost:${port}` } : {};

export function createDynamoClient(): DynamoDBDocumentClient {
  const base = new DynamoDBClient({
    ...localEndpoint(8000),
    maxAttempts: 3,
  });
  return DynamoDBDocumentClient.from(base, {
    marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false },
    unmarshallOptions: { wrapNumbers: false },
  });
}

export function createSQSClient(): SQSClient {
  return new SQSClient({ ...localEndpoint(9324), maxAttempts: 3 });
}

export function createSecretsClient(): SecretsManagerClient {
  return new SecretsManagerClient({ ...localEndpoint(4566) });
}

export function createSSMClient(): SSMClient {
  return new SSMClient({ ...localEndpoint(4566) });
}
