import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAthleteData } from 'src/services/dynamoService';
import 'source-map-support/register';

import schema from './schema';


// from when?

const getDashboard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {




  // fetch all id from id


  // fetch all activities
  try {
    const res = await getAthleteData('74721176');

    // grouping data

    let activityMap = new Map<String, number>();

    for (const activity of res.contents.athlete.activities) {
      const distance = activity.distance + activityMap.get(activity.sportType) || 0;
      activityMap.set(activity.sportType, distance);

    }

    let activities = [];
    activityMap.forEach((v, k) => {
      activities.push({
        sportType: k,
        distance: Math.round(v)
      })
    })


    return formatJSONResponse(
      {
        status: 'success',
        data:
        {
          athleteId: res.id,
          athleteName: res.contents.athlete.name,
          activities,
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
