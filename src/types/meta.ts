export interface RecordMeta {
  sourceSystem: string;
  ingestedAt: string;
  pipelineVersion: string;
  rawChecksum: string;
  apigeeEnv?: string;
  lambdaRequestId?: string;
}

export interface DLQMessage<T = unknown> {
  raw: T;
  errors: unknown;
  source: string;
  ts: string;
  lambdaRequestId: string;
}
