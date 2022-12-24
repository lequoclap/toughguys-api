import type { AWS } from '@serverless/typescript';
// import hello from '@functions/hello';
import getDashboard from '@functions/getDashboard';
import syncData from '@functions/syncData';
import generateToken from '@functions/generateToken';
import { dynamoDBResouce } from './resources/dynamodb';
import { env } from './env';

const serverlessConfiguration: AWS = {
  service: 'toughguys-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  //'serverless-webpack'
  // custom: deployEnv,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: "ap-northeast-1",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:PutItem", "dynamodb:GetItem"],
        Resource:
          "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/" + env.DYNAMO_DB_TABLE,
      },
    ],
    environment: env,
    deploymentBucket: 'toughguys-api'
  },
  // external resources
  resources: {
    Resources: dynamoDBResouce.Resources
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
