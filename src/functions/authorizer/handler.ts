
import 'source-map-support/register';

import {
  APIGatewayTokenAuthorizerEvent
} from 'aws-lambda';
import { getAthleteData } from 'src/services/dynamoService';


export const customAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => {

  // get id and token from authorization
  const [id, token] = event.authorizationToken.split(' ')[1].split('.');
  const athlete = await getAthleteData(id);

  if (athlete) {
    if (athlete.contents.refreshToken === token) {
      return {
        principalId: 'anonymous',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: event.methodArn,
            },
          ],
        },
      };
    }
  }

  throw Error('Unauthorized' + event.authorizationToken);
}