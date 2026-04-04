import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { ScanCommandInput, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

export async function* scanAll<T>(
  client: DynamoDBDocumentClient,
  params: ScanCommandInput
): AsyncGenerator<T> {
  let lastKey: Record<string, unknown> | undefined;
  do {
    const res = await client.send(new ScanCommand({ ...params, ExclusiveStartKey: lastKey }));
    for (const item of res.Items ?? []) yield item as T;
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);
}

export async function* queryAll<T>(
  client: DynamoDBDocumentClient,
  params: QueryCommandInput
): AsyncGenerator<T> {
  let lastKey: Record<string, unknown> | undefined;
  do {
    const res = await client.send(new QueryCommand({ ...params, ExclusiveStartKey: lastKey }));
    for (const item of res.Items ?? []) yield item as T;
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);
}

export async function collectAll<T>(generator: AsyncGenerator<T>): Promise<T[]> {
  const results: T[] = [];
  for await (const item of generator) results.push(item);
  return results;
}
