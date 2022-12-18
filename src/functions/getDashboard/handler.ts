import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAthleteData } from 'src/services/dynamoService';

import schema from './schema';

const getDashboard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {


  // const response = await createOrUpdateStravaData('74721176', {
  //   athlete: {
  //     id: '74721176',
  //     name: 'Le Lap',
  //     imgURL: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/74721176/26004307/1/medium.jpg',
  //     accessToken: '2996e2324ae5d1e5d6677319570b6f463d0b4cf7',
  //     refreshToken: '97f5fb168437a0474f2ce777d3f0680f39043de6',
  //     activities: []
  //   }
  // });



  // fetch all id from id

  // fetch all activities

  // calculate

  const response = await getAthleteData('74721176');







  return formatJSONResponse({
    message: JSON.stringify(response),
    event,
  });
};

export const main = middyfy(getDashboard);
