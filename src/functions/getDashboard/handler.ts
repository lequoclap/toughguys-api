import { formatErrorResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { fetchAllData } from 'src/services/dynamoService';
import 'source-map-support/register';

import schema from './schema';
import dayjs from 'dayjs';


// get list of athletes with their summary of activities from particular time

const getDashboard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const req = event.body;

  // fetch all activities
  try {
    const allAthleteData = await fetchAllData();

    let outputData = [];

    for (const ath of allAthleteData) {

      // grouping data

      let activityMap = new Map<String, number>();
      let newActivityMap = new Map<String, number>();

      const rawActivities = ath.contents.athlete.activities.filter((v) => {
        return (new Date(v.startDate) >= new Date(req.from) && new Date(v.startDate) <= new Date(req.to))
      })

      for (const activity of rawActivities) {
        const distance = activity.distance + (activityMap.get(activity.sportType) || 0);
        activityMap.set(activity.sportType, distance);

        // if the activity is started within 24 hours then treat it as a new activity
        if (dayjs().diff(activity.startDate, 'hour') < 24) {
          const newDistance = activity.distance + (newActivityMap.get(activity.sportType) || 0);
          newActivityMap.set(activity.sportType, newDistance)
        }
      }

      let activities = [];
      activityMap.forEach((v, k) => {
        activities.push({
          sportType: k,
          distance: Math.round(v),
          newDistance: Math.round(newActivityMap.get(k) || 0)
        })
      })

      outputData.push({
        athlete: {
          id: ath.id,
          name: ath.contents.athlete.name,
          imgURL: ath.contents.athlete.imgURL
        },
        activities
      })

    }
    return formatJSONResponse(
      {
        status: 'success',
        data: outputData
      });
  } catch {
    return formatErrorResponse(500, "Internal Error")
  }
}
export const main = middyfy(getDashboard);
