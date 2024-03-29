import { formatErrorResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createOrUpdateStravaData, fetchAllData } from 'src/services/dynamoService';
import { StravaAPICaller } from 'src/services/stravaAPICaller';

import * as _ from 'lodash';

import schema from './schema';
import { ResponseStatus } from 'src/enum';
import { config } from 'src/config';

const syncData: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const req = event.body;

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

      // hard reset logic, just only for admin
      if (req.isHardSync) {
        const [id, _token] = event.headers['Authorization'].split(' ')[1].split('.');
        event.headers
        if (id == config.strava.adminId) {
          data.lastFetch = '';
        }
      }
      console.log('athlete:', data.contents.athlete.name)
      //fetch new activities from Strava API
      const newActivities = await stravaAPICaller.getAthleteActivities(
        data.contents.accessToken,
        //fetch the activities for whole day ( from 00:00:00 JST)
        Math.floor((data.lastFetch ? Date.parse(data.lastFetch.substring(0, 10)) - 9 * 360 * 10000 : 0) / 1000))

      //ignore duplicated item and merge with  existing activities
      const activityMap = new Map(activities.map(i => [i.id, i])); // convert current activities array to map

      for (const activity of newActivities) {
        activityMap.set(activity.id, activity)
      }
      // convert map to array and assign back to Dynamo content
      data.contents.athlete.activities = [...activityMap.values()];

      // update back to DynamoDB
      await createOrUpdateStravaData(data.id, data.contents, new Date().toLocaleString());
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

