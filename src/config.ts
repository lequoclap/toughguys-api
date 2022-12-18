export const config = {
    app: {
        isDevMode: process.env.DEV_MODE == '1'
    },
    cognito: {
        UserPoolId: process.env.COGNITO_USER_POOL_ID
    },
    aws: {
        apiVersion: '2016-04-18',
        region: process.env.REGION,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    dyanmodb: {
        tableName: process.env.DYNAMO_DB_TABLE
    }
};
