import { formatErrorResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import 'source-map-support/register';
import { StravaDataContents } from 'src/datatype/stravaData';
import { createOrUpdateStravaData, getAthleteData } from 'src/services/dynamoService';
import { StravaAPICaller } from 'src/services/stravaAPICaller';

import schema from './schema';


// get list of athletes with their summary of activities from particular time

const generateToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const req = event.body;

  // fetch all activities
  try {
    const stravaAPICaller = new StravaAPICaller();
    const token = await stravaAPICaller.generateTokenFromCode(req.code);
    console.debug(token);
    const athlete = await stravaAPICaller.getAthlete(token.accessToken);

    // update back to DB
    let stravaData: StravaDataContents;
    let lastFetch: string = '';
    const athleteRecord = await getAthleteData(athlete.id);

    console.debug("athleteRecord", athleteRecord);
    // if the record exists
    if (athleteRecord) {
      lastFetch = athleteRecord.lastFetch;
      stravaData = athleteRecord.contents;
      stravaData.athlete.imgURL = athlete.imgURL;
      stravaData.athlete.name = athlete.name;

      stravaData.accessToken = token.accessToken;
      stravaData.expiresAt = token.expiresAt;
      stravaData.refreshToken = token.refreshToken;

    } else {
      stravaData = {
        athlete,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
      }
    }

    await createOrUpdateStravaData(athlete.id, stravaData, lastFetch);

    return formatJSONResponse(
      {
        status: 'success',
        data: {
          athleteId: athlete.id,
          token: token.refreshToken
        }
      });
  } catch {
    return formatErrorResponse(500, 'Internal Error')
  }
}
export const main = middyfy(generateToken);
