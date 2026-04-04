import type { ZodSchema } from 'zod';
import type { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { respond } from '../http/response';

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (body: T, event: APIGatewayProxyEvent, context: Context) => Promise<unknown>
): APIGatewayProxyHandler {
  return async (event, context) => {
    let raw: unknown;
    try {
      raw = JSON.parse(event.body ?? '{}');
    } catch {
      return respond.badRequest({ body: ['Invalid JSON'] });
    }

    const result = schema.safeParse(raw);
    if (!result.success) {
      return respond.badRequest(result.error.flatten().fieldErrors);
    }

    try {
      const data = await handler(result.data, event, context);
      return respond.ok(data);
    } catch (error) {
      console.error(JSON.stringify({ level: 'error', msg: 'Handler error', error: String(error), requestId: context.awsRequestId }));
      return respond.internalError(context.awsRequestId);
    }
  };
}
