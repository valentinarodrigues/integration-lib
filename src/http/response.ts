import type { APIGatewayProxyResult } from 'aws-lambda';

const STANDARD_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
};

export const respond = {
  ok: (body: unknown): APIGatewayProxyResult => ({
    statusCode: 200,
    headers: STANDARD_HEADERS,
    body: JSON.stringify(body),
  }),

  created: (body: unknown): APIGatewayProxyResult => ({
    statusCode: 201,
    headers: STANDARD_HEADERS,
    body: JSON.stringify(body),
  }),

  noContent: (): APIGatewayProxyResult => ({
    statusCode: 204,
    headers: STANDARD_HEADERS,
    body: '',
  }),

  badRequest: (errors: unknown): APIGatewayProxyResult => ({
    statusCode: 400,
    headers: STANDARD_HEADERS,
    body: JSON.stringify({ error: 'Bad Request', details: errors }),
  }),

  unauthorized: (): APIGatewayProxyResult => ({
    statusCode: 401,
    headers: STANDARD_HEADERS,
    body: JSON.stringify({ error: 'Unauthorized' }),
  }),

  forbidden: (): APIGatewayProxyResult => ({
    statusCode: 403,
    headers: STANDARD_HEADERS,
    body: JSON.stringify({ error: 'Forbidden' }),
  }),

  notFound: (resource?: string): APIGatewayProxyResult => ({
    statusCode: 404,
    headers: STANDARD_HEADERS,
    body: JSON.stringify({ error: 'Not Found', resource }),
  }),

  conflict: (message: string): APIGatewayProxyResult => ({
    statusCode: 409,
    headers: STANDARD_HEADERS,
    body: JSON.stringify({ error: 'Conflict', message }),
  }),

  internalError: (requestId: string): APIGatewayProxyResult => ({
    statusCode: 500,
    headers: STANDARD_HEADERS,
    body: JSON.stringify({ error: 'Internal Server Error', requestId }),
  }),
};
