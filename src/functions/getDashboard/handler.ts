import { formatErrorResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { fetchAllData } from 'src/services/dynamoService';
import 'source-map-support/register';

import schema from './schema';


// get list of athletes with their summary of activities from particular time

const getDashboard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const req = event.body;

  // fetch all activities
  try {
    const allAthleteData = await fetchAllData();

    let data = [];

    for (const ath of allAthleteData) {

      // grouping data

      let activityMap = new Map<String, number>();

      const rawActivities = ath.contents.athlete.activities.filter((v) => {
        return new Date(v.startDate) >= new Date(req.from)
      })

      for (const activity of rawActivities) {
        const distance = activity.distance + (activityMap.get(activity.sportType) || 0);
        activityMap.set(activity.sportType, distance);
      }

      let activities = [];
      activityMap.forEach((v, k) => {
        activities.push({
          sportType: k,
          distance: Math.round(v)
        })
      })

      data.push({
        athlete: {
          id: ath.id,
          name: ath.contents.athlete.name
        },
        activities
      })

    }
    return formatJSONResponse(
      {
        status: 'success',
        data
      });
  } catch {
    return formatErrorResponse(500, "Exception")
  }
}
export const main = middyfy(getDashboard);
