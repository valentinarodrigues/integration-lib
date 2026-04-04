import { createHash } from 'crypto';

export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

export function md5(data: string | Buffer): string {
  return createHash('md5').update(data).digest('hex');
}

export function attachChecksum(raw: string): { checksum: string; algorithm: 'sha256' } {
  return { checksum: sha256(raw), algorithm: 'sha256' };
}
