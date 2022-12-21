import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createOrUpdateStravaData, getAthleteData } from 'src/services/dynamoService';
import { StravaAPICaller } from 'src/services/stravaAPICaller';

import * as _ from 'lodash';

import schema from './schema';

const syncData: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  let response: any = "";

  // fetch all id from dynamoDB

  const data = await getAthleteData('74721176');


  // validation
  if (!data) return formatJSONResponse({
    status: "fail",
    message: "Data not found"
  });


  // if (moment.duration(moment().diff(moment(data.lastFetch))).asMinutes() < 5) {
  if ((Date.parse(new Date().toLocaleString()) - Date.parse(data.lastFetch)) < 5 * 1000 * 60) {

    return formatJSONResponse({
      status: "fail",
      message: "Data is already up to date ",
      gap: (Date.parse(new Date().toLocaleString()) - Date.parse(data.lastFetch)),
      currentTime: new Date().toLocaleString(),
      lastFetch: data.lastFetch
    });
  }


  let activities = data.contents.athlete.activities;

  // Strava
  const stravaAPICaller = new StravaAPICaller();

  // refresh token if it is needed

  if (new Date() > new Date(data.contents.athlete.expiresAt)) {
    const res = await stravaAPICaller.getNewAccessToken(data.contents.athlete.refreshToken);
    data.contents.athlete.accessToken = res.accessToken;
    data.contents.athlete.expiresAt = new Date(res.expiresAt * 1000).toLocaleString();
  }


  //fetch new activities from Strava API
  const newActivities = await stravaAPICaller.getAthleteActivities(
    data.contents.athlete.accessToken,
    Math.floor(Date.parse(data.lastFetch) / 1000))

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

  response = await createOrUpdateStravaData('74721176', data.contents);

  return formatJSONResponse({
    message: JSON.stringify(response),
    event,
  });
};

export const main = middyfy(syncData);

