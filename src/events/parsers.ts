import type { SQSRecord, SNSEventRecord, S3Event } from 'aws-lambda';
import type { ZodSchema } from 'zod';

export function parseSQSRecord<T>(record: SQSRecord, schema: ZodSchema<T>): T {
  const body = JSON.parse(record.body);
  return schema.parse(body);
}

export function parseSNSMessage<T>(record: SNSEventRecord, schema: ZodSchema<T>): T {
  const message = JSON.parse(record.Sns.Message);
  return schema.parse(message);
}

export function parseS3Event(event: S3Event): { bucket: string; key: string; size: number }[] {
  return event.Records.map((r) => ({
    bucket: r.s3.bucket.name,
    key: decodeURIComponent(r.s3.object.key.replace(/\+/g, ' ')),
    size: r.s3.object.size,
  }));
}

export function parseSQSBatch<T>(
  records: SQSRecord[],
  schema: ZodSchema<T>
): { successes: T[]; failures: { record: SQSRecord; error: Error }[] } {
  const successes: T[] = [];
  const failures: { record: SQSRecord; error: Error }[] = [];

  for (const record of records) {
    try {
      successes.push(parseSQSRecord(record, schema));
    } catch (error) {
      failures.push({ record, error: error as Error });
    }
  }

  return { successes, failures };
}
