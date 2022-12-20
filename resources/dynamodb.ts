import { env } from '../env'
export const dynamoDBResouce = {
  Resources: {
    // ResourceとしてDynamoDBを設定
    ToughGuysTable: {
      Type: "AWS::DynamoDB::Table",
      Properties: {
        TableName: env.DYNAMO_DB_TABLE,
        AttributeDefinitions: [
          {
            AttributeName: "id",
            AttributeType: "S",
          }
        ],
        KeySchema: [
          {
            KeyType: "HASH",
            AttributeName: "id",
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    },
  }
}