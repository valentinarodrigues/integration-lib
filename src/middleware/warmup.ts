import type { Middleware } from './compose';

export function withWarmup(): Middleware {
  return async (event, _context, next) => {
    const body = event.body ? JSON.parse(event.body) : {};
    if (body?.source === 'serverless-plugin-warmup' || body?.warmup === true) {
      console.log(JSON.stringify({ level: 'info', msg: 'Warmup ping received' }));
      return { statusCode: 200, body: JSON.stringify({ warmed: true }) };
    }
    return next();
  };
}
