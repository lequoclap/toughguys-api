import type { AWS } from '@serverless/typescript';
// import hello from '@functions/hello';
import getDashboard from '@functions/getDashboard';
import syncData from '@functions/syncData';
import generateToken from '@functions/generateToken';
import { dynamoDBResouce } from './resources/dynamodb';
import { APIGWResource } from './resources/api-gw';
import { env } from './env';

const serverlessConfiguration: AWS = {
  service: 'toughguys-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    // timeout: 600,
    region: "ap-northeast-1",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan"],
        Resource:
          "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/" + env.DYNAMO_DB_TABLE,
      },
    ],
    environment: env,
    deploymentBucket: 'toughguys-api'
  },
  // external resources
  resources: {
    Resources: {
      dynamoDB: dynamoDBResouce.Resources.ToughGuysTable,
      apigw: APIGWResource
    }
  },
  // import the function via paths
  functions: {
    getDashboard,
    syncData,
    generateToken,
    customAuthorizer: {
      handler: "src/functions/authorizer/handler.customAuthorizer"
    }
  },


  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    useChildProcesses: true // ホットリロードの設定をする。←追加する。
  },
};

module.exports = serverlessConfiguration;
