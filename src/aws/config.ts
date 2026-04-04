import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { SSMClient, GetParameterCommand, GetParametersCommand } from '@aws-sdk/client-ssm';

const secretsCache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getSecret(secretArn: string, client?: SecretsManagerClient): Promise<string> {
  const cached = secretsCache.get(secretArn);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const sm = client ?? new SecretsManagerClient({});
  const res = await sm.send(new GetSecretValueCommand({ SecretId: secretArn }));
  const value = res.SecretString!;

  secretsCache.set(secretArn, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function getParameter(name: string, client?: SSMClient): Promise<string> {
  const ssm = client ?? new SSMClient({});
  const res = await ssm.send(new GetParameterCommand({ Name: name, WithDecryption: true }));
  return res.Parameter?.Value ?? '';
}

export async function getParameters(
  names: string[],
  client?: SSMClient
): Promise<Record<string, string>> {
  const ssm = client ?? new SSMClient({});
  const res = await ssm.send(new GetParametersCommand({ Names: names, WithDecryption: true }));
  return Object.fromEntries((res.Parameters ?? []).map((p) => [p.Name!, p.Value!]));
}
