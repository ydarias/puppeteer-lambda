import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';

exports.handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: 'This is another output',
  };
};
