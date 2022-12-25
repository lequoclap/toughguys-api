export const APIGWResource = {
  Type: "AWS::ApiGateway::GatewayResponse",
  Properties: {
    ResponseParameters:
    {
      "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
      "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
    },
    ResponseType: "DEFAULT_4XX",
    RestApiId: {
      Ref: "ApiGatewayRestApi"
    },
  },
}