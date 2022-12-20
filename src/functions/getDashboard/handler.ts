import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAthleteData } from 'src/services/dynamoService';
import 'source-map-support/register';

import schema from './schema';

const getDashboard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {

  // fetch all id from id

  // fetch all activities

  try {
    const res = await getAthleteData('74721176');

    return formatJSONResponse(
      {
        status: 'success',
        data:
        {
          athleteId: res.id,
          athleteName: res.contents.athlete.name,
          activities: res.contents.athlete.activities,
        }
      });
  } catch {
    return formatJSONResponse(
      {
        status: 'fail',
        message: 'exeption'
      })
  }
}
export const main = middyfy(getDashboard);
