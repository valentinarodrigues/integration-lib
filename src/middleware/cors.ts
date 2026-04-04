import type { Middleware } from './compose';

export interface CorsOptions {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
}

export function withCors(options: CorsOptions = {}): Middleware {
  const {
    allowedOrigins = ['*'],
    allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
  } = options;

  return async (event, _context, next) => {
    const origin = event.headers['origin'] ?? event.headers['Origin'] ?? '';
    const allowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowed ? origin || '*' : '',
      'Access-Control-Allow-Methods': allowedMethods.join(', '),
      'Access-Control-Allow-Headers': allowedHeaders.join(', '),
    };

    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    const result = await next();
    return { ...result, headers: { ...result.headers, ...corsHeaders } };
  };
}
