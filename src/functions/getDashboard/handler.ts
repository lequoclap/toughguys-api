import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAthleteData } from 'src/services/dynamoService';

import schema from './schema';

const getDashboard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  // fetch all id from id

  // fetch all activities


  const response = await getAthleteData('74721176');


  return formatJSONResponse({
    message: JSON.stringify(response),
    event,
  });
};

export const main = middyfy(getDashboard);
