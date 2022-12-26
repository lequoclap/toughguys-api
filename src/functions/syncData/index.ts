import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'syncData',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        authorizer: {
          name: 'customAuthorizer'
        },
        cors: true
      }
    },
  ],
  timeout: 150 // 2.5minutes
};
