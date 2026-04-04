import type { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export type Middleware = (
  event: APIGatewayProxyEvent,
  context: Context,
  next: () => Promise<APIGatewayProxyResult>
) => Promise<APIGatewayProxyResult>;

export function compose(...middlewares: Middleware[]): APIGatewayProxyHandler {
  return async (event, context) => {
    let index = 0;

    const next = async (): Promise<APIGatewayProxyResult> => {
      if (index >= middlewares.length) {
        return { statusCode: 204, body: '' };
      }
      const middleware = middlewares[index++];
      return middleware(event, context, next);
    };

    return next();
  };
}
