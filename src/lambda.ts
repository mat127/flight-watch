import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import ra from "./ra";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await ra.loadAll();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Data loaded.`,
      }),
    };
  }
  catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }
}