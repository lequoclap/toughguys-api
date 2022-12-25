import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {

  // idea about multi whitelist domain
  // const corsWhitelist = [
  //   'http://localhost:5000',
  //   'http://laplq.com',
  //   'https://domain3.example'
  // ];
  // if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
  //   res.header('Access-Control-Allow-Origin', req.headers.origin);
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // }

  const headers = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS,
    'Access-Control-Allow-Headers': '*'
  };

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const formatErrorResponse = (statusCode: number, message: string) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS,
    'Access-Control-Allow-Headers': '*'
  };
  return {
    headers,
    statusCode,
    body: JSON.stringify(message)
  }
}
