export const dynamoDBResouce = {
  Resources: {
    // ResourceとしてDynamoDBを設定
    stravaDataTable: {
      Type: "AWS::DynamoDB::Table",
      Properties: {
        TableName: "stravaDataTable",
        AttributeDefinitions: [
          {
            AttributeName: "id",
            AttributeType: "S",
          },
          {
            AttributeName: "name",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            KeyType: "HASH",
            AttributeName: "id",
          },
          {
            KeyType: "RANGE",
            AttributeName: "name",
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    },
  }
}