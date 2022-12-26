import { formatErrorResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createOrUpdateStravaData, fetchAllData } from 'src/services/dynamoService';
import { StravaAPICaller } from 'src/services/stravaAPICaller';

import * as _ from 'lodash';

import schema from './schema';
import { ResponseStatus } from 'src/enum';

const syncData: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {


  try {
    // fetch all id from dynamoDB

    const allAthleteData = await fetchAllData();
    if (allAthleteData.length <= 0) return formatErrorResponse(404, "Data not found")

    for (const data of allAthleteData) {
      // validation
      if ((Date.parse(new Date().toLocaleString()) - Date.parse(data.lastFetch)) < 5 * 1000 * 60) {

        return formatJSONResponse({
          status: ResponseStatus.Fail,
          message: "Data is already up to date ",
          gap: (Date.parse(new Date().toLocaleString()) - Date.parse(data.lastFetch)) / 1000 + 'seconds',
          currentTime: new Date().toLocaleString(),
          lastFetch: data.lastFetch
        });
      }


      let activities = data.contents.athlete.activities;

      // Strava
      const stravaAPICaller = new StravaAPICaller();

      // refresh token if it is needed

      if (new Date() > new Date(data.contents.expiresAt)) {
        const res = await stravaAPICaller.refreshAccessToken(data.contents.refreshToken);
        data.contents.accessToken = res.accessToken;
        data.contents.expiresAt = res.expiresAt;
      }

      //fetch new activities from Strava API
      const newActivities = await stravaAPICaller.getAthleteActivities(
        data.contents.accessToken,
        //fetch the activities for whole day ( from 00:00:00)
        Math.floor((Date.parse(data.lastFetch.substring(0, 10)) || 0) / 1000))

      //ignore duplicated item and merge with  existing activities
      const activitieIds = activities.map(x => {
        return x.id
      })
      for (const activity of newActivities) {
        if (!activitieIds.includes(activity.id)) {
          activities.push(activity)
        }
      }
      data.contents.athlete.activities = activities;

      // update back to DynamoDB
      await createOrUpdateStravaData(data.id, data.contents, true);

    }

    return formatJSONResponse({
      status: ResponseStatus.Success,
      message: "Data has been synced",
    });
  }
  catch (e) {
    console.error(e);
    return formatErrorResponse(500, "Internal error")
  }


}


export const main = middyfy(syncData);

