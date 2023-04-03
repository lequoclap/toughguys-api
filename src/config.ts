export const config = {
    app: {
        isDevMode: process.env.DEV_MODE == '1'
    },
    cognito: {
        UserPoolId: process.env.COGNITO_USER_POOL_ID
    },
    aws: {
        apiVersion: '2016-04-18',
        region: process.env.REGION

    },
    dyanmodb: {
        tableName: process.env.DYNAMO_DB_TABLE
    },
    strava: {
        host: 'https://www.strava.com/api/v3',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        adminId: process.env.ADMIN_ID
    }
};
